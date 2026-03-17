import mysql from "mysql2/promise";
import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const DB_CONFIG = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "root",
  database: process.env.DB_NAME || "pcstore",
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3307,
  ...(process.env.DB_SOCKET ? { socketPath: process.env.DB_SOCKET } : {}),
};

const args = process.argv.slice(2);
let csvDir = path.resolve("./data");
let fromGithub = false;
let githubUrl = "https://github.com/docyx/pc-part-dataset";

for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  if (arg === "--from-github" || arg === "--github") {
    fromGithub = true;
    if (args[i + 1] && !args[i + 1].startsWith("--")) {
      githubUrl = args[i + 1];
      i++;
    }
  } else if (arg === "--data" && args[i + 1]) {
    csvDir = path.resolve(args[i + 1]);
    i++;
  } else if (!arg.startsWith("--") && i === args.length - 1) {
    csvDir = path.resolve(arg);
  }
}

const productCategoryMap = {
  cpu: "CPU",
  gpu: "GPU",
  vga: "GPU",
  motherboard: "Motherboard",
  board: "Motherboard",
  ram: "RAM",
  memory: "RAM",
  ssd: "SSD",
  hdd: "HDD",
  psu: "PSU",
  case: "Case",
  cooler: "Cooler",
  monitor: "Monitor",
  keyboard: "Keyboard",
  mouse: "Mouse",
};

function parseCsvLine(line) {
  const cells = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }
    if (ch === "," && !inQuotes) {
      cells.push(cur);
      cur = "";
      continue;
    }
    cur += ch;
  }
  cells.push(cur);
  return cells;
}

function parseCsv(content) {
  const lines = content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
  if (!lines.length) return [];
  const headers = parseCsvLine(lines[0]).map((h) => h.toLowerCase().trim());
  return lines.slice(1).map((line) => {
    const values = parseCsvLine(line);
    const obj = {};
    for (let i = 0; i < headers.length; i++) {
      obj[headers[i]] = values[i] ?? "";
    }
    return obj;
  });
}

function walkCsvFiles(dir) {
  let results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(walkCsvFiles(fullPath));
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith(".csv")) {
      results.push(fullPath);
    }
  }
  return results;
}

function detectCategoryFromFile(fileName) {
  const key = fileName.toLowerCase();
  for (const [k, v] of Object.entries(productCategoryMap)) {
    if (key.includes(k)) return v;
  }
  return "Misc";
}

function chooseValue(record, keys) {
  for (const key of keys) {
    if (record[key] !== undefined && record[key] !== "") return record[key];
    const lower = key.toLowerCase();
    if (record[lower] !== undefined && record[lower] !== "") return record[lower];
  }
  return "";
}

function castNumber(value, fallback = 0) {
  const n = Number(String(value).replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : fallback;
}

async function main() {
  if (fromGithub) {
    const cloneDir = path.resolve("./data/github-dataset");
    if (fs.existsSync(cloneDir)) {
      console.log("Mise à jour du repo GitHub...");
      execSync(`git -C ${cloneDir} pull`, { stdio: "inherit" });
    } else {
      console.log("Clonage du repo GitHub...");
      fs.mkdirSync(path.dirname(cloneDir), { recursive: true });
      execSync(`git clone ${githubUrl} ${cloneDir}`, { stdio: "inherit" });
    }
    csvDir = cloneDir;
  }

  if (!fs.existsSync(csvDir)) {
    console.error("Dossier CSV introuvable :", csvDir);
    process.exit(1);
  }

  const connection = await mysql.createConnection(DB_CONFIG);
  console.log("Connecté à MySQL", DB_CONFIG.host, DB_CONFIG.database);

  const csvFiles = walkCsvFiles(csvDir);
  if (!csvFiles.length) {
    console.error("Aucun fichier CSV trouvé dans", csvDir);
    process.exit(1);
  }

  const categoryCache = new Map();
  const productCache = new Map();

  const ensureCategory = async (name) => {
    const normalized = String(name || "Misc").trim();
    if (!normalized) return null;
    if (categoryCache.has(normalized)) return categoryCache.get(normalized);
    const [rows] = await connection.execute("SELECT id FROM categories WHERE name = ?", [normalized]);
    if (rows.length) {
      categoryCache.set(normalized, rows[0].id);
      return rows[0].id;
    }
    const [result] = await connection.execute("INSERT INTO categories (name) VALUES (?)", [normalized]);
    categoryCache.set(normalized, result.insertId);
    return result.insertId;
  };

  const getProductByName = async (name) => {
    const key = name.trim().toLowerCase();
    if (productCache.has(key)) return productCache.get(key);
    const [rows] = await connection.execute("SELECT id FROM products WHERE name = ? LIMIT 1", [name]);
    if (rows.length) {
      productCache.set(key, rows[0].id);
      return rows[0].id;
    }
    return null;
  };

  let totalInserts = 0;
  let totalUpdates = 0;
  for (const filePath of csvFiles) {
    const records = parseCsv(fs.readFileSync(filePath, "utf8"));
    if (!records.length) continue;
    const categoryName = detectCategoryFromFile(path.basename(filePath));
    const categoryId = await ensureCategory(categoryName);
    console.log(`Import ${records.length} lignes depuis ${path.basename(filePath)} => catégorie ${categoryName}`);
    for (const record of records) {
      const name = chooseValue(record, ["name", "model", "product", "title"]).trim();
      if (!name) continue;
      const price = castNumber(chooseValue(record, ["price", "cost", "msrp", "prix"]), 0);
      let stock = castNumber(chooseValue(record, ["stock", "quantity", "qty"]), 5);
      if (stock < 0) stock = 0;
      const type = chooseValue(record, ["type", "category", "part", "component", "family"]).trim() || categoryName;
      const description = chooseValue(record, ["description", "desc", "overview", "notes", "detail"]).trim();
      const existingId = await getProductByName(name);
      if (existingId) {
        await connection.execute("UPDATE products SET type = ?, price = ?, stock = ?, description = ?, category_id = ? WHERE id = ?", [type, price, stock, description || null, categoryId, existingId]);
        totalUpdates++;
      } else {
        await connection.execute("INSERT INTO products (name, type, price, stock, description, category_id) VALUES (?, ?, ?, ?, ?, ?)", [name, type, price, stock, description || null, categoryId]);
        totalInserts++;
      }
    }
  }
  console.log(`\nImport terminé. Insérés: ${totalInserts}, mis à jour: ${totalUpdates}`);
  await connection.end();
}

if (args.includes("--help") || args.includes("-h")) {
  console.log("Usage: node import_csv_to_mysql.js [dataFolder] | --from-github [url] | --data folder");
  process.exit(0);
}

main().catch((err) => {
  console.error("Erreur d'import :", err.message || err);
  process.exit(1);
});

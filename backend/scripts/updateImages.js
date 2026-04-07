// scripts/updateImages.js
const mysql = require('mysql2/promise');
const axios = require('axios');
require('dotenv').config();

// Domaines de qualité — plus le score est élevé, mieux c'est
const GOOD_DOMAINS = [
  { domain: 'amd.com',            score: 10 },
  { domain: 'intel.com',          score: 10 },
  { domain: 'nvidia.com',         score: 10 },
  { domain: 'corsair.com',        score: 10 },
  { domain: 'asus.com',           score: 10 },
  { domain: 'samsung.com',        score: 10 },
  { domain: 'nzxt.com',           score: 10 },
  { domain: 'fractal-design.com', score: 10 },
  { domain: 'noctua.at',          score: 10 },
  { domain: 'seasonic.com',       score: 10 },
  { domain: 'gigabyte.com',       score: 10 },
  { domain: 'msi.com',            score: 10 }, 
  { domain: 'asrock.com',         score: 10 }, 
  { domain: 'ldlc.com',           score: 8  },
  { domain: 'topachat.com',       score: 8  },
  { domain: 'materiel.net',       score: 8  },
  { domain: 'amazon.fr',          score: 6  },
  { domain: 'media-amazon.com',   score: 6  },
  { domain: 'idealo.com',         score: 5  },
  { domain: 'lesnumeriques.com',  score: 5  },
];

// Domaines à exclure complètement
const EXCLUDED = [
  'iPad', 'Apple', 'tablette',     // images hors sujet
  '71KYSsC90pL',                   // image générique Amazon
  'bing.com', 'bing.net',
];

async function searchImage(productName) {
  try {
    const query = encodeURIComponent(`${productName} product photo`);
    const url   = `https://www.bing.com/images/search?q=${query}&form=HDRSC2&first=1`;

    const res = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'fr-FR,fr;q=0.9,en;q=0.8',
      }
    });

    // Récupère toutes les URLs disponibles
    const pattern = /&quot;murl&quot;:&quot;(https?:\/\/[^&]+\.(?:jpg|jpeg|png|webp))/gi;
    const matches = [...res.data.matchAll(pattern)].map(m => m[1]);

    if (matches.length === 0) {
      console.error(`  ⛔ Aucune image trouvée pour "${productName}"`);
      return null;
    }

    // Filtre les URLs exclues
    const filtered = matches.filter(url =>
      !EXCLUDED.some(e => url.toLowerCase().includes(e.toLowerCase()))
    );

    if (filtered.length === 0) {
      console.error(`  ⛔ Toutes les images filtrées pour "${productName}"`);
      return null;
    }

    // Donne un score à chaque URL
    const scored = filtered.map(url => {
      const goodDomain = GOOD_DOMAINS.find(g => url.includes(g.domain));
      return { url, score: goodDomain ? goodDomain.score : 1 };
    });

    // Trie par score décroissant et prend la meilleure
    scored.sort((a, b) => b.score - a.score);
    const best = scored[0];

    if (best.score >= 8) {
      console.log(`  🏆 Source de qualité (score ${best.score})`);
    }

    return best.url;

  } catch (err) {
    console.error(`  ❌ Erreur pour "${productName}" :`, err.message);
    return null;
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function updateAllImages() {
  const db = await mysql.createConnection({
    host:     process.env.DB_HOST,
    port:     parseInt(process.env.DB_PORT),
    user:     process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  console.log('✅ Connecté à la base de données\n');

  const [rows] = await db.execute(
    `SELECT id, name FROM products WHERE image IS NULL OR image = '' ORDER BY id`
  );

  if (rows.length === 0) {
    console.log('✅ Tous les produits ont déjà une image !');
    await db.end();
    return;
  }

  console.log(`🔄 ${rows.length} composants à traiter...\n`);

  let success = 0;
  let failed  = 0;

  for (const composant of rows) {
    console.log(`🔍 Recherche image pour : ${composant.name}`);

    const imageUrl = await searchImage(composant.name);

    if (imageUrl) {
      await db.execute(
        `UPDATE products SET image = ? WHERE id = ?`,
        [imageUrl, composant.id]
      );
      console.log(`  ✅ OK → ${imageUrl.substring(0, 70)}...\n`);
      success++;
    } else {
      console.log(`  ⚠️  Aucune image trouvée\n`);
      failed++;
    }

    const pause = Math.floor(Math.random() * 1500) + 1500;
    await sleep(pause);
  }

  console.log(`📊 Résultat final : ${success} ✅  |  ${failed} ⚠️`);
  await db.end();
}

updateAllImages();
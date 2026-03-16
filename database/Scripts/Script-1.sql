-- ===========================
-- Base de données : pcstore
-- ===========================

-- Table utilisateurs
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('user','admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table catégories de composants
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

-- Table produits
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    description TEXT,
    category_id INT,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Table commandes
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    status ENUM('pending','paid','shipped') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Table items dans les commandes
CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Table PC personnalisés
CREATE TABLE IF NOT EXISTS pc_builds (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Table composants de chaque PC personnalisé
CREATE TABLE IF NOT EXISTS pc_build_components (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pc_build_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT DEFAULT 1,
    FOREIGN KEY (pc_build_id) REFERENCES pc_builds(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- ===========================
-- Données de test
-- ===========================

-- Catégories
INSERT INTO categories (name) VALUES
('CPU'), ('GPU'), ('RAM'), ('Motherboard'), ('SSD'), ('PSU'), ('Case'), ('PC Finished');

-- Produits de test
INSERT INTO products (name, type, price, stock, category_id, description) VALUES
('Ryzen 5 5600X', 'CPU', 220.00, 10, 1, '6-core, 12-thread CPU'),
('Intel i5-13600K', 'CPU', 300.00, 8, 1, '10-core, 16-thread CPU'),
('RTX 4070', 'GPU', 750.00, 5, 2, 'High-end graphics card'),
('Corsair 16GB DDR4', 'RAM', 80.00, 20, 3, '16GB DDR4 RAM 3200MHz'),
('MSI B550', 'Motherboard', 150.00, 10, 4, 'AM4 motherboard'),
('Samsung 1TB NVMe', 'SSD', 100.00, 15, 5, 'Fast NVMe SSD'),
('Corsair RM750x', 'PSU', 120.00, 5, 6, '750W PSU'),
('NZXT H510', 'Case', 80.00, 7, 7, 'Mid tower case');

-- Utilisateurs de test
INSERT INTO users (email, password, role) VALUES
('admin@example.com', 'admin123', 'admin'),
('user1@example.com', 'user123', 'user');




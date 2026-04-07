CREATE USER IF NOT EXISTS 'pcuser'@'localhost' IDENTIFIED BY 'pcpassword';
GRANT ALL PRIVILEGES ON pcstore.* TO 'pcuser'@'localhost';
GRANT ALL PRIVILEGES ON pcstore.* TO 'pcuser'@'localhost';
FLUSH PRIVILEGES;

DESCRIBE products;


SELECT id, name, image FROM products;

UPDATE products SET image = NULL 
WHERE name IN ('Gigabyte X670 AORUS Elite');
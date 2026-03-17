CREATE USER IF NOT EXISTS 'pcuser'@'localhost' IDENTIFIED BY 'pcpassword';
GRANT ALL PRIVILEGES ON pcstore.* TO 'pcuser'@'localhost';
GRANT ALL PRIVILEGES ON pcstore.* TO 'pcuser'@'localhost';
FLUSH PRIVILEGES;

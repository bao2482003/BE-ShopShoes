CREATE DATABASE IF NOT EXISTS shop_shoes;
USE shop_shoes;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(120) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('ADMIN', 'USER') DEFAULT 'USER',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  brand VARCHAR(120) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  description TEXT,
  image_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Password for this seed account: Admin@123
INSERT INTO users (full_name, email, password, role)
VALUES (
  'System Admin',
  'admin@gmail.com',
  '$2a$10$Ev9df5Sy1TtSRROTuiEk0eQ9wJn4V/Vo9WrZbjuaML7BKATfDlj1.',
  'ADMIN'
)
ON DUPLICATE KEY UPDATE
  full_name = VALUES(full_name),
  password = VALUES(password),
  role = VALUES(role);

INSERT INTO products (name, brand, price, stock, description, image_url)
VALUES (
  'Mercurial Vapor 15 Academy TF',
  'Nike',
  1890000.00,
  20,
  'Giay da bong san co nhan tao toc do, om chan.',
  '/uploads/nike-vapor-15.jpg'
);

INSERT INTO products (name, brand, price, stock, description, image_url)
VALUES (
  'Predator Accuracy.3 TF',
  'Adidas',
  1750000.00,
  15,
  'Giay da bong kiem soat bong tot, de cao su bam san.',
  '/uploads/adidas-predator.jpg'
);

INSERT INTO products (name, brand, price, stock, description, image_url)
VALUES (
  'Future 7 Match TT',
  'Puma',
  1690000.00,
  18,
  'Thiet ke co gian, phu hop cho choi bong phong trao.',
  '/uploads/puma-future-7.jpg'
);

INSERT INTO products (name, brand, price, stock, description, image_url)
VALUES (
  'Mizuno Monarcida Neo Select AS',
  'Mizuno',
  1450000.00,
  12,
  'Chat lieu ben bi, form dang chan nguoi Viet.',
  '/uploads/mizuno-monarcida.jpg'
);

INSERT INTO products (name, brand, price, stock, description, image_url)
VALUES (
  'Tiempo Legend 10 Club TF',
  'Nike',
  1390000.00,
  25,
  'Mau giay co dien, phoi mau de mang va de phoi do.',
  '/uploads/nike-tiempo-10.jpg'
);

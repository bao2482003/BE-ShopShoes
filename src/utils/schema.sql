CREATE DATABASE IF NOT EXISTS shop_shoes;
USE shop_shoes;

CREATE TABLE IF NOT EXISTS brands (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(120) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('ADMIN', 'STAFF', 'USER') DEFAULT 'USER',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  brand_id INT NOT NULL,
  category_id INT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  description TEXT,
  image_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (brand_id) REFERENCES brands(id),
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

CREATE TABLE IF NOT EXISTS product_variants (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  sku VARCHAR(80) NOT NULL UNIQUE,
  size VARCHAR(20) NOT NULL,
  color VARCHAR(50),
  stock INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS carts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS cart_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cart_id INT NOT NULL,
  variant_id INT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (cart_id) REFERENCES carts(id) ON DELETE CASCADE,
  FOREIGN KEY (variant_id) REFERENCES product_variants(id),
  UNIQUE KEY uk_cart_variant (cart_id, variant_id)
);

CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  status ENUM('PENDING', 'PAID', 'SHIPPING', 'WAITING_RECEIVED', 'COMPLETED', 'DONE', 'CANCELLED') DEFAULT 'PENDING',
  total_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
  shipping_address VARCHAR(255) NOT NULL,
  phone_number VARCHAR(20) NOT NULL,
  note TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  variant_id INT NOT NULL,
  quantity INT NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(12,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (variant_id) REFERENCES product_variants(id)
);

CREATE TABLE IF NOT EXISTS payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  method ENUM('COD', 'VNPAY') NOT NULL,
  status ENUM('PENDING', 'PAID', 'DONE', 'FAILED') NOT NULL DEFAULT 'PENDING',
  amount DECIMAL(12,2) NOT NULL,
  transaction_ref VARCHAR(80) NOT NULL UNIQUE,
  vnp_transaction_no VARCHAR(120),
  vnp_response_code VARCHAR(10),
  pay_url TEXT,
  paid_at DATETIME NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  UNIQUE KEY uk_payment_order (order_id)
);

ALTER TABLE orders
MODIFY COLUMN status ENUM('PENDING', 'PAID', 'SHIPPING', 'WAITING_RECEIVED', 'COMPLETED', 'DONE', 'CANCELLED') DEFAULT 'PENDING';

ALTER TABLE payments
MODIFY COLUMN status ENUM('PENDING', 'PAID', 'DONE', 'FAILED') NOT NULL DEFAULT 'PENDING';

-- Password for this seed account: Admin@123
INSERT INTO users (full_name, email, password, role)
VALUES (
  'Admin',
  'admin@gmail.com',
  '$2a$10$Ev9df5Sy1TtSRROTuiEk0eQ9wJn4V/Vo9WrZbjuaML7BKATfDlj1.',
  'ADMIN'
)
ON DUPLICATE KEY UPDATE
  full_name = VALUES(full_name),
  password = VALUES(password),
  role = VALUES(role);

INSERT INTO brands (name)
VALUES ('Nike'), ('Adidas'), ('Puma'), ('Mizuno')
ON DUPLICATE KEY UPDATE
  name = VALUES(name);

INSERT INTO categories (name)
VALUES ('Football Shoes')
ON DUPLICATE KEY UPDATE
  name = VALUES(name);

INSERT INTO products (name, brand_id, category_id, price, stock, description, image_url)
VALUES (
  'Mercurial Vapor 15 Academy TF',
  (SELECT id FROM brands WHERE name = 'Nike' LIMIT 1),
  (SELECT id FROM categories WHERE name = 'Football Shoes' LIMIT 1),
  1890000.00,
  20,
  'Giay da bong san co nhan tao toc do, om chan.',
  '/uploads/nike-vapor-15.jpg'
);

INSERT INTO products (name, brand_id, category_id, price, stock, description, image_url)
VALUES (
  'Predator Accuracy.3 TF',
  (SELECT id FROM brands WHERE name = 'Adidas' LIMIT 1),
  (SELECT id FROM categories WHERE name = 'Football Shoes' LIMIT 1),
  1750000.00,
  15,
  'Giay da bong kiem soat bong tot, de cao su bam san.',
  '/uploads/adidas-predator.jpg'
);

INSERT INTO products (name, brand_id, category_id, price, stock, description, image_url)
VALUES (
  'Future 7 Match TT',
  (SELECT id FROM brands WHERE name = 'Puma' LIMIT 1),
  (SELECT id FROM categories WHERE name = 'Football Shoes' LIMIT 1),
  1690000.00,
  18,
  'Thiet ke co gian, phu hop cho choi bong phong trao.',
  '/uploads/puma-future-7.jpg'
);

INSERT INTO products (name, brand_id, category_id, price, stock, description, image_url)
VALUES (
  'Mizuno Monarcida Neo Select AS',
  (SELECT id FROM brands WHERE name = 'Mizuno' LIMIT 1),
  (SELECT id FROM categories WHERE name = 'Football Shoes' LIMIT 1),
  1450000.00,
  12,
  'Chat lieu ben bi, form dang chan nguoi Viet.',
  '/uploads/mizuno-monarcida.jpg'
);

INSERT INTO products (name, brand_id, category_id, price, stock, description, image_url)
VALUES (
  'Tiempo Legend 10 Club TF',
  (SELECT id FROM brands WHERE name = 'Nike' LIMIT 1),
  (SELECT id FROM categories WHERE name = 'Football Shoes' LIMIT 1),
  1390000.00,
  25,
  'Mau giay co dien, phoi mau de mang va de phoi do.',
  '/uploads/nike-tiempo-10.jpg'
);

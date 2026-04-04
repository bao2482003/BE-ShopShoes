# BE-ShopShoes (Node.js + MySQL)

Backend RESTful API for football shoes ecommerce.

## 1) Folder structure

```text
src/
  config/
  controllers/
  services/
  repositories/
  models/
  routes/
  middlewares/
  utils/
  validations/
  uploads/
  constants/
  app.js
  server.js
```

## 2) Features

- Authentication: register, login, get profile (`JWT`)
- Authorization: role based (`ADMIN`, `USER`)
- Product CRUD
  - `GET /api/products` public
  - `POST/PUT/DELETE /api/products` only `ADMIN`
- Upload image with `multer`

## 3) Setup

1. Install dependencies

```bash
npm install
```

2. Create DB and tables

- Run SQL script in `src/utils/schema.sql`

3. Configure env

- Copy `.env.example` to `.env` and update DB credentials

4. Start server

```bash
npm run dev
```

Server URL: `http://localhost:5000`

## 4) API sample

- Register: `POST /api/auth/register`
- Login: `POST /api/auth/login`
- Get me: `GET /api/auth/me`
- List products: `GET /api/products`
- Create product: `POST /api/products` (form-data, image field name is `image`)

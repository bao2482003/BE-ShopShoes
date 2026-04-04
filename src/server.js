const dotenv = require("dotenv");
const app = require("./app");
const pool = require("./config/db");

dotenv.config();

const port = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await pool.query("SELECT 1");
    console.log("MySQL connected");

    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  } catch (error) {
    console.error("Cannot connect MySQL", error.message);
    process.exit(1);
  }
};

startServer();

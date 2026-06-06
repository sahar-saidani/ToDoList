import { Sequelize } from "sequelize"

const db = new Sequelize(
    process.env.DB_NAME || "todolist",
    process.env.DB_USER || "root",
    process.env.DB_PASSWORD || "",
    {
        host: process.env.DB_HOST || "127.0.0.1",
        port: process.env.DB_PORT || 3306,
        dialect: "mysql",
        define: {
            timestamps: true
        }
    }
);

export default db;

import { Sequelize } from 'sequelize';

const db = process.env.DATABASE_URL
  ? new Sequelize(process.env.DATABASE_URL, {
      dialect: 'mysql',
      dialectOptions: {
        ssl: false
      },
      define: { timestamps: true },
      logging: false,
    })
  : new Sequelize(
      process.env.DB_NAME || 'todolist',
      process.env.DB_USER || 'root',
      process.env.DB_PASSWORD || 'sahar',
      {
        host: process.env.DB_HOST || '127.0.0.1',
        port: process.env.DB_PORT || 3306,
        dialect: 'mysql',
        define: { timestamps: true },
        logging: false,
      }
    );

export default db;

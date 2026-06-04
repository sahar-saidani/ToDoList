import {Sequelize} from "sequelize"

const db = new Sequelize("crud_react_node", "root", "ROUDAYNAKOUKA98722091/*-", {
    host: "localhost",
    port: "3306",
    dialect: "mysql",
    define: {
        timestamps: false
    }
});

export default db;


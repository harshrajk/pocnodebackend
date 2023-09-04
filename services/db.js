const mysql = require('mysql2/promise');
const jsonDump = require('../data.json');

console.log(jsonDump);
// Load env variables
require('dotenv').config()



const config_db = {
    /* don't expose password or any sensitive info, done only for demo */
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    connectTimeout: 60000
}

async function query(sql, params = [], type = 'execute') {
    const connection = await mysql.createConnection(config_db);
    let results;
    if (type === 'execute') {
        results = await connection.execute(sql, params);
    } else {
        results = await connection.query(sql, params);
    }

    return results;
}

async function setup() {
    try {

        const drop_table_cmd = `DROP TABLE products`;

        const dropres = await query(drop_table_cmd, []);

        console.log('DROP TABLE >>>', dropres);

        const create_table_statement = `
        CREATE TABLE IF NOT EXISTS products (
            id int(11) NOT NULL auto_increment,   
            product_id varchar(100) NOT NULL,  
            name varchar(1000)  NOT NULL default '',     
            description  varchar(1000) NULL,     
            features varchar(1000) NULL,    
            price  decimal(10,2) NOT NULL default 0,
            image varchar(1000) NULL,
            keywords varchar(1000) NOT NULL default '',    
            category varchar(250) NOT NULL default '',
            subcategory varchar(250) NULL,
             PRIMARY KEY  (id)
          );`;

        const result = await query(create_table_statement, []);

        console.log('CREATE TABLE >>>', result);

        const insertionData = jsonDump.products.items.map(item => {
            return [
                item.id,
                item.name,
                item.description,
                item.features,
                item.price,
                item.image,
                item.keywords,
                item.category,
                item.subcategory
            ]
        });

        const insert_command = 'INSERT INTO products (product_id,name,description,features,price,image,keywords,category,subcategory) VALUES ?';

        const insert_multi = await query(insert_command, [insertionData], 'query');

        console.log('INSERT RECORDS >>>', insert_multi);

        return { status: 'success' }
    } catch (error) {
        return { status: 'fail', message: error }
    }
}

module.exports = {
    query,
    setup
}
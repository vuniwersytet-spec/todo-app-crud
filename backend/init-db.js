require('dotenv').config();
const { Client } = require('pg');

const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: 'postgres',
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

const dbName = process.env.DB_DATABASE;

const createDbAndTable = async () => {
    try {
        await client.connect();
        console.log('Successfully connected to the server PostgreSQL.');

        const res = await client.query(`SELECT 1 FROM pg_database WHERE datname = '${dbName}'`);
        
        if (res.rowCount === 0) {
            await client.query(`CREATE DATABASE "${dbName}"`);
            console.log(`Database "${dbName}" successfully created.`);
        } else {
            console.log(`Database "${dbName}" already exists.`);
        }

        await client.end();

        const dbClient = new Client({
            user: process.env.DB_USER,
            host: process.env.DB_HOST,
            database: dbName,
            password: process.env.DB_PASSWORD,
            port: process.env.DB_PORT,
        });
        await dbClient.connect();
        console.log(`Successfully connected to the database "${dbName}".`);

        await dbClient.query(`
            CREATE TABLE IF NOT EXISTS tasks (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                completed BOOLEAN DEFAULT FALSE
            );
        `);
        console.log('The "tasks" table is ready for use..');

        await dbClient.end();

    } catch (error) {
        console.error('An error occurred while initializing the database.', error);
    }
};

createDbAndTable();

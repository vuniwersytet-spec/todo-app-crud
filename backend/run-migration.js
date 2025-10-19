const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const { Client } = require('pg');
const fs = require('fs');

const dbName = process.env.DB_DATABASE;

const runMigration = async () => {
    const adminClient = new Client({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: 'postgres',
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
    });

    try {
        await adminClient.connect();
        console.log('Połączono z serwerem PostgreSQL w celu przygotowania bazy danych.');

        const res = await adminClient.query(`SELECT 1 FROM pg_database WHERE datname = '${dbName}'`);

        if (res.rowCount === 0) {
            await adminClient.query(`CREATE DATABASE "${dbName}"`);
            console.log(`Baza danych "${dbName}" została pomyślnie utworzona.`);
        } else {
            console.log(`Baza danych "${dbName}" już istnieje.`);
        }
    } catch (error) {
        console.error('Wystąpił błąd podczas tworzenia bazy danych:', error);
        process.exit(1);
    } finally {
        await adminClient.end();
    }

    const dbClient = new Client({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: dbName,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
    });

    try {
        await dbClient.connect();
        console.log(`Pomyślnie połączono z bazą danych "${dbName}".`);

        const migrationFile = path.join(__dirname, 'migrations', '001_create_zadania_table.sql');
        const migrationSQL = fs.readFileSync(migrationFile, 'utf8');

        await dbClient.query(migrationSQL);
        console.log('Migracja tabeli "zadania" została pomyślnie uruchomiona.');

    } catch (error) {
        console.error('Wystąpił błąd podczas uruchamiania migracji:', error);
        process.exit(1);
    } finally {
        await dbClient.end();
        console.log('Zakończono proces migracji.');
    }
};

runMigration();
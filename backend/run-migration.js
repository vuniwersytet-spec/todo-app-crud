const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const { Client } = require('pg');
const fs = require('fs');

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    console.error('Błąd: Zmienna środowiskowa DATABASE_URL не jest ustawiona.');
    console.error('Upewnij się, że plik .env istnieje lub zmienna jest ustawiona na serwerze.');
    process.exit(1);
}

const runMigration = async () => {
    
    const dbClient = new Client({
        connectionString: connectionString,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    });

    try {
        await dbClient.connect();
        console.log(`Pomyślnie połączono z bazą danych (Render).`);

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
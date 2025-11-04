const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/zadania', async (req, res) => {
    try {
        const { sort, order } = req.query;

        const allowedSorts = ['id', 'priorytet', 'termin_wykonania'];
        const allowedOrders = ['ASC', 'DESC'];

        const sortColumn = allowedSorts.includes(sort) ? sort : 'id';
        const sortOrder = allowedOrders.includes(order) ? order : 'ASC';

        const wszystkieZadania = await pool.query(`SELECT * FROM zadania ORDER BY ${sortColumn} ${sortOrder}`);
        res.json(wszystkieZadania.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Błąd serwera');
    }
});

app.get('/zadania/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const zadanie = await pool.query("SELECT * FROM zadania WHERE id = $1", [id]);

        if (zadanie.rows.length === 0) {
            return res.status(404).json({ error: 'Nie znaleziono zadania' });
        }
        res.json(zadanie.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Błąd serwera');
    }
});

app.post('/zadania', async (req, res) => {
    try {
        const { tytul, priorytet, termin_wykonania } = req.body;

        if (!tytul || typeof tytul !== 'string' || tytul.trim() === '') {
            return res.status(400).json({ error: 'Tytuł jest wymagany i musi być tekstem.' });
        }

        const noweZadanie = await pool.query(
            "INSERT INTO zadania (tytul, priorytet, termin_wykonania) VALUES ($1, $2, $3) RETURNING *",
            [tytul, priorytet, termin_wykonania || null]
        );
        res.status(201).json(noweZadanie.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Błąd serwera');
    }
});

app.put('/zadania/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { tytul, priorytet, termin_wykonania, zakonczone } = req.body;

        if (tytul !== undefined && (typeof tytul !== 'string' || tytul.trim() === '')) {
             return res.status(400).json({ error: 'Tytuł nie może być pusty.' });
        }
        if (zakonczone !== undefined && typeof zakonczone !== 'boolean') {
             return res.status(400).json({ error: 'Status ukończenia musi być wartością logiczną.' });
        }

        const zaktualizowaneZadanie = await pool.query(
            "UPDATE zadania SET tytul = $1, priorytet = $2, termin_wykonania = $3, zakonczone = $4 WHERE id = $5 RETURNING *",
            [tytul, priorytet, termin_wykonania, zakonczone, id]
        );

        if (zaktualizowaneZadanie.rows.length === 0) {
            return res.status(404).json({ error: 'Nie znaleziono zadania' });
        }
        res.json(zaktualizowaneZadanie.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Błąd serwera');
    }
});

app.delete('/zadania/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const usunieteZadanie = await pool.query("DELETE FROM zadania WHERE id = $1 RETURNING *", [id]);

        if (usunieteZadanie.rows.length === 0) {
            return res.status(404).json({ error: 'Nie znaleziono zadania' });
        }
        res.json({ message: `Zadanie o ID ${id} zostało pomyślnie usunięte.` });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Błąd serwera');
    }
});

app.listen(PORT, () => {
    console.log(`Serwer działa na porcie ${PORT}`);
});
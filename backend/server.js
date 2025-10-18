require('dotenv').config();
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

app.post('/tasks', async (req, res) => {
    try {
        const { title } = req.body;
        if (!title) {
            return res.status(400).json({ error: 'Title is required' });
        }
        const newTask = await pool.query(
            "INSERT INTO tasks (title) VALUES ($1) RETURNING *",
            [title]
        );
        res.status(201).json(newTask.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

app.get('/tasks', async (req, res) => {
    try {
        const allTasks = await pool.query("SELECT * FROM tasks ORDER BY id");
        res.json(allTasks.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

app.put('/tasks/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { completed } = req.body;
        const updatedTask = await pool.query(
            "UPDATE tasks SET completed = $1 WHERE id = $2 RETURNING *",
            [completed, id]
        );

        if (updatedTask.rows.length === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.json(updatedTask.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

app.delete('/tasks/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedTask = await pool.query("DELETE FROM tasks WHERE id = $1 RETURNING *", [id]);

        if (deletedTask.rows.length === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.json({ message: `Task with id ${id} deleted successfully` });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

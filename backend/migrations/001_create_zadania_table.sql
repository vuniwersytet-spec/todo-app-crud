CREATE TABLE IF NOT EXISTS zadania (
    id SERIAL PRIMARY KEY,
    tytul VARCHAR(255) NOT NULL,
    priorytet INTEGER DEFAULT 1,
    termin_wykonania DATE,
    zakonczone BOOLEAN DEFAULT FALSE
);
# **Aplikacja Lista Zadań (CRUD)**

Prosta aplikacja typu "to-do list" z backendem w Node.js i frontendem w HTML/JS.

## **Wymagania wstępne:**

* Node.js i npm
* PostgreSQL
* Git

## **Instrukcja uruchomienia:**

### **KROK 1: POBRANIE PROJEKTU**

Otwórz terminal (Wiersz polecenia, PowerShell lub Git Bash w systemie Windows) i wykonaj następujące polecenia:

1.  `git clone https://github.com/vuniwersytet-spec/todo-app-crud.git`
2.  `cd todo-app-crud`

### **KROK 2: KONFIGURACJA BACKENDU**

1.  Przejdź do folderu `backend`:
    `cd backend`
2.  W folderze `backend` utwórz plik o nazwie `.env`. Skopiuj do niego poniższą zawartość.
    **WAŻNE:** Upewnij się, że `DB_USER` i `DB_PASSWORD` odpowiadają Twoim ustawieniom PostgreSQL.

    ```
    DB_USER=root
    DB_PASSWORD=root
    DB_HOST=localhost
    DB_PORT=5432
    DB_DATABASE=zadania_db
    PORT=5000
    ```
3.  Zainstaluj wszystkie zależności (biblioteki), będąc w głównym folderze projektu:
    `npm install`

### **KROK 3: PRZYGOTOWANIE BAZY DANYCH**

Upewnij się, że serwer PostgreSQL jest uruchomiony. Następnie, będąc w głównym folderze projektu, wykonaj to polecenie, aby automatycznie utworzyć bazę danych i tabelę:

`npm run db:init`

### **KROK 4: URUCHOMIENIE APLIKACJI**

1.  Uruchom serwer (backend):
    Będąc w głównym folderze projektu, uruchom polecenie:
    `npm start`
    W terminalu zobaczysz komunikat "Serwer działa na porcie 5000".
    **POZOSTAW TO OKNO TERMINALA OTWARTE.**
2.  Otwórz interfejs użytkownika (frontend):
    Za pomocą eksploratora plików znajdź folder `frontend` w projekcie.
    Kliknij dwukrotnie plik `index.html`, aby otworzyć go w przeglądarce.

Aplikacja jest gotowa do użycia.

---

## **Opis Endpointów API**

Baza URL: `http://localhost:5000`

### Encja: `Zadanie`

* `id`: `SERIAL` (klucz główny)
* `tytul`: `VARCHAR(255)` (wymagany)
* `priorytet`: `INTEGER` (domyślnie 1)
* `termin_wykonania`: `DATE` (opcjonalny)
* `zakonczone`: `BOOLEAN` (domyślnie `false`)

### Dostępne operacje

* **`GET /zadania`**
    * **Opis:** Pobiera listę wszystkich zadań.
    * **Odpowiedź (200 OK):** Tablica obiektów zadań.

* **`GET /zadania/:id`**
    * **Opis:** Pobiera jedno zadanie o podanym ID.
    * **Odpowiedź (200 OK):** Obiekt zadania.
    * **Odpowiedź (404 Not Found):** Jeśli zadanie nie istnieje.

* **`POST /zadania`**
    * **Opis:** Tworzy nowe zadanie.
    * **Request Body (JSON):**
        ```json
        {
          "tytul": "Nowe zadanie",
          "priorytet": 2,
          "termin_wykonania": "2025-12-31"
        }
        ```
    * **Odpowiedź (201 Created):** Obiekt nowo utworzonego zadania.
    * **Odpowiedź (400 Bad Request):** Jeśli `tytul` jest nieprawidłowy.

* **`PUT /zadania/:id`**
    * **Opis:** Aktualizuje istniejące zadanie.
    * **Request Body (JSON):**
        ```json
        {
          "tytul": "Zaktualizowany tytuł",
          "priorytet": 3,
          "termin_wykonania": "2026-01-15",
          "zakonczone": true
        }
        ```
    * **Odpowiedź (200 OK):** Obiekt zaktualizowanego zadania.
    * **Odpowiedź (404 Not Found):** Jeśli zadanie nie istnieje.
    * **Odpowiedź (400 Bad Request):** Jeśli dane są nieprawidłowe.

* **`DELETE /zadania/:id`**
    * **Opis:** Usuwa zadanie o podanym ID.
    * **Odpowiedź (200 OK):** Komunikat o pomyślnym usunięciu.
    * **Odpowiedź (404 Not Found):** Jeśli zadanie nie istnieje.

---
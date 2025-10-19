const API_URL = 'http://localhost:5000/zadania';

const titleInput = document.getElementById('titleInput');
const priorityInput = document.getElementById('priorityInput');
const dueDateInput = document.getElementById('dueDateInput');
const taskIdInput = document.getElementById('taskIdInput');
const actionButton = document.getElementById('actionButton');
const cancelButton = document.getElementById('cancelButton');
const taskList = document.getElementById('taskList');

let editMode = false;

const resetForm = () => {
    titleInput.value = '';
    priorityInput.value = '';
    dueDateInput.value = '';
    taskIdInput.value = '';
    actionButton.textContent = 'Dodaj Zadanie';
    cancelButton.classList.add('hidden');
    editMode = false;
};

const fetchZadania = async () => {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Nie udało się pobrać zadań.');
        return await response.json();
    } catch (error) {
        console.error(error);
        alert(error.message);
        return [];
    }
};

const wyswietlZadania = (zadania) => {
    taskList.innerHTML = '';
    zadania.forEach(zadanie => {
        const li = document.createElement('li');
        li.className = zadanie.zakonczone ? 'completed' : '';

        const detailsDiv = document.createElement('div');
        detailsDiv.className = 'task-details';

        const titleSpan = document.createElement('span');
        titleSpan.className = 'task-title';
        titleSpan.textContent = zadanie.tytul;
        titleSpan.addEventListener('click', () => przelaczStatusZadania(zadanie));
        
        const metaSpan = document.createElement('span');
        metaSpan.className = 'task-meta';
        const termin = zadanie.termin_wykonania ? new Date(zadanie.termin_wykonania).toLocaleDateString('pl-PL') : 'brak';
        metaSpan.textContent = `Priorytet: ${zadanie.priorytet || 'N/A'}, Termin: ${termin}`;
        
        detailsDiv.appendChild(titleSpan);
        detailsDiv.appendChild(metaSpan);

        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'task-actions';

        const editButton = document.createElement('button');
        editButton.textContent = 'Edytuj';
        editButton.className = 'edit-btn';
        editButton.addEventListener('click', () => przygotujDoEdycji(zadanie));
        
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Usuń';
        deleteButton.className = 'delete-btn';
        deleteButton.addEventListener('click', () => usunZadanie(zadanie.id));

        actionsDiv.appendChild(editButton);
        actionsDiv.appendChild(deleteButton);
        
        li.appendChild(detailsDiv);
        li.appendChild(actionsDiv);
        taskList.appendChild(li);
    });
};

const odswiezListe = async () => {
    const zadania = await fetchZadania();
    wyswietlZadania(zadania);
};

const przygotujDoEdycji = (zadanie) => {
    editMode = true;
    taskIdInput.value = zadanie.id;
    titleInput.value = zadanie.tytul;
    priorityInput.value = zadanie.priorytet;
    dueDateInput.value = zadanie.termin_wykonania ? zadanie.termin_wykonania.split('T')[0] : '';
    actionButton.textContent = 'Zapisz Zmiany';
    cancelButton.classList.remove('hidden');
};

const dodajLubAktualizujZadanie = async () => {
    const tytul = titleInput.value.trim();
    if (!tytul) {
        alert('Proszę wpisać tytuł zadania.');
        return;
    }

    const zadanieData = {
        tytul,
        priorytet: priorityInput.value ? parseInt(priorityInput.value, 10) : 1,
        termin_wykonania: dueDateInput.value || null
    };

    let url = API_URL;
    let method = 'POST';

    if (editMode) {
        const id = taskIdInput.value;
        const response = await fetch(`${API_URL}/${id}`);
        const originalTask = await response.json();
        zadanieData.zakonczone = originalTask.zakonczone;
        
        url = `${API_URL}/${id}`;
        method = 'PUT';
    }

    await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(zadanieData),
    });

    resetForm();
    odswiezListe();
};

const przelaczStatusZadania = async (zadanie) => {
    const zaktualizowaneZadanie = { ...zadanie, zakonczone: !zadanie.zakonczone };

    await fetch(`${API_URL}/${zadanie.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(zaktualizowaneZadanie),
    });

    odswiezListe();
};

const usunZadanie = async (id) => {
    if (!confirm('Czy na pewno chcesz usunąć to zadanie?')) return;
    
    await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
    });
    
    odswiezListe();
};

actionButton.addEventListener('click', dodajLubAktualizujZadanie);
cancelButton.addEventListener('click', resetForm);
document.addEventListener('DOMContentLoaded', odswiezListe);
import { JOURNALS_KEY as STORAGE_KEY } from './handler.js';

const journalForm = document.getElementById('journalForm');

let journals = [];
let search = '';

function isStorageExist() {
  if (typeof(Storage) === undefined) {
    return false;
  }
  return true;
}

function save() {
  if (!isStorageExist()) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(journals));
}

function load() {
  if (!isStorageExist()) return;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    journals = JSON.parse(stored);
    return;
  }
}

function generateTimestamp() {
  return Date.now();
}

function findJournalIndex(id) {
  for (const index in journals) {
    if (journals[index].id === id) {
      return index;
    }
  }
  return -1;
}

function journalObject(id, title, desc, timestamp) {
  return {
    id,
    title,
    desc,
    timestamp
  };
}

function createJournal(title, desc) {
  const timestamp = generateTimestamp();
  
  const journalId = `${timestamp}-${Math.random().toString(36).slice(2)}`;
  const journal = journalObject(journalId, title, desc, timestamp);
  
  journals.push(journal);
  render();
  save();
}

function removeJournal(id) {
  const journalIndex = findJournalIndex(id);
  
  if (journalIndex === -1) return;
  
  journals.splice(journalIndex, 1);
  render();
  save();
}

function generateElement(journal) {
  const journalContainer = document.createElement('div');
  const journalTitle = document.createElement('h3');
  const journalDescription = document.createElement('p');
  const journalId = document.createElement('p');
  const removeButton = document.createElement('button');
  
  journalTitle.textContent = journal.title;
  journalDescription.textContent = journal.desc;
  journalId.textContent = journal.id;
  removeButton.textContent = 'Remove';
  removeButton.classList.add('remove-journal');
  removeButton.setAttribute('type', 'button');
  
  journalContainer.append(journalTitle, journalDescription, journalId, removeButton);
  journalContainer.classList.add('journal');
  
  removeButton.addEventListener('click', (e) => {
    removeJournal(journal.id);
  });
  
  return journalContainer;
}

function render() {
  const journalsContainer = document.getElementById('journalContainer');
  journalsContainer.innerHTML = '';
  
  for (const journal of journals) {
    if (search && !journal.title.toLowerCase().includes(search)) {
      continue;
    }
    
    const journalElement = generateElement(journal);
    journalsContainer.append(journalElement);
  }
}

document.addEventListener('DOMContentLoaded', (e) => {
  load();
  render();
  
  journalForm.addEventListener('submit', (event) => {
    event.preventDefault();
    
    const journalTitleInput = document.getElementById('journalTitleInput').value;
    const journalDescInput = document.getElementById('journalDescInput').value;
  
    if (!journalTitleInput && !journalDescInput) return;
    
    createJournal(journalTitleInput, journalDescInput);
    journalForm.reset();
  });
});
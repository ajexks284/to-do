import { UI } from './ui';
import { projectsUI } from './projects';
import { counter } from './counter';

// Set the minimum date to current day
const date = new Date();
let year = date.getFullYear();
let month = date.getMonth() + 1;
if (month < 10) month = `0${month}`;
let day = date.getDate();
if (day < 10) day = `0${day}`;
document.querySelector('#task-due-date').min = `${year}-${month}-${day}`;

UI.render();
projectsUI.render();
counter.incrementProjectsCounter();
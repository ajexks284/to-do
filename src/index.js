import { app } from './app';
import { UI } from './ui';
import { projects } from './projects';
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
counter.incrementCounters();


// Filters
const homeSectionFilter = document.querySelector('.home-div-name');
homeSectionFilter.addEventListener('click', () => {
    let taskList = document.querySelectorAll('.to-do-item');
    [...taskList].forEach(task => {
        task.style.display = 'flex';
    })
})

const todaySectionFilter = document.querySelector('.today-div-name');
todaySectionFilter.addEventListener('click', () => {
    let taskList = document.querySelectorAll('.to-do-item');
    [...taskList].forEach(task => {
        let todayDateDay = new Date().getDate();
        if (todayDateDay < 10) todayDateDay = `0${todayDateDay}`;
        let taskDateDay = task.firstElementChild.nextElementSibling.firstElementChild.innerText.slice(-2);

        if (taskDateDay == todayDateDay) {
            task.style.display = 'flex';
        } else {
            task.style.display = 'none';
        }
    })
})

const thisWeekSectionFilter = document.querySelector('.this-week-div-name');
thisWeekSectionFilter.addEventListener('click', () => {
    // 
})

// Helps keep display none on tasks after rendering
export function returnItemsWithDisplayNone() {
    let taskList = document.querySelectorAll('.to-do-item');
    const displayNoneItems = {};

    taskList.forEach(item => {
        if (item.style.display == 'none') {
            displayNoneItems[item.firstElementChild.lastElementChild.innerText] = 'none';
        } else {
            displayNoneItems[item.firstElementChild.lastElementChild.innerText] = 'flex';
        }
    })
    
    return displayNoneItems;
}
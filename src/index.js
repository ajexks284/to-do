import { UI } from './ui';
import { projectsUI } from './projects';
import { counter } from './counter';
import { parse, isWithinInterval, subDays, isToday, addDays, format } from 'date-fns';

// Set the minimum date of task due date to current day
document.querySelector('.task-due-date').min = format(new Date(), 'yyyy-MM-dd');

// Render tasks and projects and start the counters
UI.render();
projectsUI.render();
counter.incrementCounters();


// Filters
const sectionTitle = document.querySelector('.main-section-title');
const homeSectionFilter = document.querySelector('.home-div-name');
homeSectionFilter.addEventListener('click', () => {
    sectionTitle.innerText = 'Home';

    let taskList = document.querySelectorAll('.to-do-item');

    // Make all tasks show
    [...taskList].forEach(task => {
        task.style.display = 'flex';
    })
})

const todaySectionFilter = document.querySelector('.today-div-name');
todaySectionFilter.addEventListener('click', () => {
    sectionTitle.innerText = 'Today';

    let taskList = document.querySelectorAll('.to-do-item');

    // If the task's date is equal to today's date, show it, otherwise hide it
    [...taskList].forEach(task => {
        let taskDateDay = task.firstElementChild.nextElementSibling.firstElementChild.innerText;
        if (isToday(parse(taskDateDay, 'do MMM yyyy', new Date()))) {
            task.style.display = 'flex';
        } else {
            task.style.display = 'none';
        }
    })
})

const thisWeekSectionFilter = document.querySelector('.this-week-div-name');
thisWeekSectionFilter.addEventListener('click', () => {
    sectionTitle.innerText = 'Next 7 days';
    
    let taskList = document.querySelectorAll('.to-do-item');

    // If the task's date is in the next 7 days, show it, otherwise hide it
    [...taskList].forEach(task => {
        let taskDateDay = task.firstElementChild.nextElementSibling.firstElementChild.innerText;
        if (isWithinInterval(parse(taskDateDay, 'do MMM yyyy', new Date()), {
            start: subDays(new Date(), 1),
            end: addDays(new Date(), 6)
         })) {
            task.style.display = 'flex';
        } else {
            task.style.display = 'none';
        }
    })
})

// Helps keep display none on tasks after rendering
export function returnItemsWithDisplayNone() {
    let taskList = document.querySelectorAll('.to-do-item');

    // Object will keep track of each task's display
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

// Search bar
function searchForString(e) {
    let text = e.target.value.toLowerCase();
    let taskList = document.querySelectorAll('.to-do-item');

    // Shows the tasks' which include the searched string in their title
    [...taskList].forEach(task => {
        let taskName = task.firstElementChild.lastElementChild.innerText;
        if (taskName.toLowerCase().indexOf(text) !== -1) {
            task.style.display = 'flex';
        } else {
            task.style.display = 'none';
        }
    })
}

const searchBar = document.querySelector('.search-bar');
searchBar.addEventListener('keyup', searchForString);

// When clicking on searchbar, go back to home section, and remove filters
searchBar.addEventListener('focus', (e) => {
    // First show all the items and go to 'Home', then search for the string
    sectionTitle.innerText = 'Home';
    
    let taskList = document.querySelectorAll('.to-do-item');
    [...taskList].forEach(task => {
        task.style.display = 'flex';
    })
    
    searchForString(e);
})

// Hamburger
const hamburger = document.querySelector('.hamburger');
const sideSection = document.querySelector('.side-section');
hamburger.addEventListener('click', () => {
    if (sideSection.style.display === 'flex') {
        sideSection.style.display = 'none';
    } else {
        sideSection.style.display = 'flex';
    }
})
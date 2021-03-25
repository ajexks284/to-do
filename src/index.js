import { UI } from './ui';
import { projectsUI } from './projects';
import { counter } from './counter';
import { parse, isWithinInterval, subDays, isToday, addDays, format } from 'date-fns';

// Set the minimum date to current day
document.querySelector('#task-due-date').min = format(new Date(), 'yyyy-MM-dd');

UI.render();
projectsUI.render();
counter.incrementCounters();


// Filters
const homeSectionFilter = document.querySelector('.home-div-name');
homeSectionFilter.addEventListener('click', () => {
    let taskList = document.querySelectorAll('.to-do-item');

    let sectionTitle = document.querySelector('.main-section-title');
    sectionTitle.innerText = 'Home';

    [...taskList].forEach(task => {
        task.style.display = 'flex';
    })
})

const todaySectionFilter = document.querySelector('.today-div-name');
todaySectionFilter.addEventListener('click', () => {
    let sectionTitle = document.querySelector('.main-section-title');
    sectionTitle.innerText = 'Today';

    let taskList = document.querySelectorAll('.to-do-item');
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
    let sectionTitle = document.querySelector('.main-section-title');
    sectionTitle.innerText = 'Next 7 days';

    let taskList = document.querySelectorAll('.to-do-item');
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
const searchBar = document.querySelector('.search-bar');
searchBar.addEventListener('keyup', (e) => {
    let text = e.target.value.toLowerCase();
    let taskList = document.querySelectorAll('.to-do-item');

    [...taskList].forEach(task => {
        let taskName = task.firstElementChild.lastElementChild.innerText;
        if (taskName.toLowerCase().indexOf(text) !== -1) {
            task.style.display = 'flex';
        } else {
            task.style.display = 'none';
        }
    })
})

// When clicking on searchbar, go back to home section, and remove filters
searchBar.addEventListener('focus', (e) => {
    let sectionTitle = document.querySelector('.main-section-title');
    sectionTitle.innerText = 'Home';
    
    let taskList = document.querySelectorAll('.to-do-item');
    [...taskList].forEach(task => {
        task.style.display = 'flex';
    })
    
    let text = e.target.value.toLowerCase();
    [...taskList].forEach(task => {
        let taskName = task.firstElementChild.lastElementChild.innerText;
        if (taskName.toLowerCase().indexOf(text) !== -1) {
            task.style.display = 'flex';
        } else {
            task.style.display = 'none';
        }
    })

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
import { app } from './app';
import { events } from './pubsub';

export const counter = (function() {
    // Cache DOM
    const homeCounter = document.querySelector('#home-div-counter');
    const todayCounter = document.querySelector('#today-div-counter');
    // const thisWeekCounter = document.querySelector('#this-week-div-counter');
    
    // Counters
    function incrementCounters() {
        const currentToDoList = app.getCurrentToDoList();
        
        // Projects Counters
        const projectsCounter = document.querySelectorAll('.project-counter');

        const counterForEachProject = currentToDoList.reduce((obj, task) => {
            let taskProject = task.project.toLowerCase();
            if (!obj.hasOwnProperty(taskProject)) {
                obj[taskProject] = 1;
            }  else {
                obj[taskProject] += 1;
            }
            return obj;
        }, {})

        projectsCounter.forEach(projectCounter => {
            const projectName = projectCounter.id.split('-')[0];
            const correspondingValue = counterForEachProject[projectName] || 0;

            projectCounter.innerText = correspondingValue;
        })

        // Home Counter
        homeCounter.innerText = currentToDoList.length;

        // Today Counter
        const date = new Date();
        let day = date.getDate();
        if (day < 10) day = `0${day}`;

        todayCounter.innerText = currentToDoList.reduce((acc, item) => {
            if (item.dueDate.slice(-2) == day) return acc + 1;
            else return acc + 0;
        }, 0);
    }

    events.on('taskAdded', incrementCounters);
    events.on('taskDeleted', incrementCounters);
    events.on('projectsRendered', incrementCounters);

    return { incrementCounters };
})();

import { app } from './app';
import { events } from './pubsub';

export const counter = (function() {
    // Cache DOM
    let homeCounter = document.querySelector('#home-div-counter');
    let todayCounter = document.querySelector('#today-div-counter');
    let thisWeekCounter = document.querySelector('#this-week-div-counter');

    // Projects Counters
    function incrementProjectsCounter() {
        const projectsCounter = document.querySelectorAll('.project-counter');
        const currentToDoList = app.getCurrentToDoList();

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
    }

    events.on('taskAdded', incrementProjectsCounter);
    events.on('taskDeleted', incrementProjectsCounter);
    events.on('projectsRendered', incrementProjectsCounter);

    return { incrementProjectsCounter };
})();

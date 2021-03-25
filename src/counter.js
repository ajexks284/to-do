import { app } from './app';
import { events } from './pubsub';
import { parseISO, isWithinInterval, subDays, isToday, addDays } from 'date-fns';

export const counter = (function() {
    // Cache DOM
    const homeCounter = document.querySelector('#home-div-counter');
    const todayCounter = document.querySelector('#today-div-counter');
    const thisWeekCounter = document.querySelector('#this-week-div-counter');
    
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
        todayCounter.innerText = currentToDoList.reduce((acc, item) => {
            if (isToday(parseISO(item.dueDate))) return acc + 1;
            else return acc + 0;
        }, 0);

        // This week Counter
        thisWeekCounter.innerText = currentToDoList.reduce((acc, item) => {
            if (isWithinInterval(parseISO(item.dueDate), {
                start: subDays(new Date(), 1),
                end: addDays(new Date(), 6)
             })) return acc + 1;
            else return acc + 0;
        }, 0);
    }

    events.on('taskAdded', incrementCounters);
    events.on('taskDeleted', incrementCounters);
    events.on('projectsRendered', incrementCounters);

    return { incrementCounters };
})();

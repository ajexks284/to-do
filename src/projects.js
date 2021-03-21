import { events } from "./pubsub";
import { UI } from './ui';
import { app } from './app';

const projects = (function() {
    let projects = [{ projectName: 'Default' }];

    function createProject(projectName) {
        return { projectName };
    }

    function getCurrentProjectList() {
        return projects;
    }

    function addProject(projectName) {
        projects.push(createProject(projectName));
    }

    function deleteProject(projectName) {
        for (let i = 0; i < projects.length; i++) {
            if (projects[i].projectName === projectName) {
                projects.splice(i, 1);
                return;
            }
        }
    }

    // localStorage
    function saveProjectList() {
        localStorage.setItem('project-list', JSON.stringify(projects))
    }

    function getProjectList() {
        if (localStorage.getItem('project-list')) {
            projects = JSON.parse(localStorage.getItem('project-list'));
        }
    }

    // PubSub events
    events.on('projectAdded', addProject);
    events.on('projectDeleted', deleteProject);

    return { getCurrentProjectList, saveProjectList, getProjectList }
})();

projects.getProjectList();

export const projectsUI = (function() {
    // Cache DOM
    const projectList = document.querySelector('.projects-list');
    const projectAddButton = document.querySelector('.projects-add');

    function render() {
        [...projectList.children].forEach(item => {
            if (item.classList.contains('project-div')) {
                projectList.removeChild(item);
            }
        })

        const currentProjectList = projects.getCurrentProjectList();
        currentProjectList.forEach(project => {
            createProject(project);
        })

        // PubSub event
        events.emit('projectsRendered', currentProjectList);

        projects.saveProjectList();
    }

    function createProject(project) {
        const projectDiv = document.createElement('div');
        projectDiv.classList = 'project-div';
        projectList.appendChild(projectDiv);

        const projectNameAndCounterDiv = document.createElement('div');
        projectNameAndCounterDiv.classList = 'project-name-counter';
        projectDiv.appendChild(projectNameAndCounterDiv);

        const projectName = document.createElement('div');
        projectName.classList = 'project-name';
        projectName.appendChild(document.createTextNode(project.projectName));
        projectName.addEventListener('click', (e) => {
            let sectionTitle = document.querySelector('.main-section-title');
            sectionTitle.innerText = e.target.innerText;

            let taskList = document.querySelectorAll('.to-do-item');
            [...taskList].forEach(task => {
                const projectName = e.target.innerText;
                if (task.id == projectName) {
                    task.style.display = 'flex';
                } else {
                    task.style.display = 'none';
                }
            })
        })
        projectNameAndCounterDiv.appendChild(projectName);

        const projectCounter = document.createElement('div');
        projectCounter.classList = 'counter project-counter';
        projectCounter.id = `${project.projectName.toLowerCase()}-project-counter`;
        projectCounter.appendChild(document.createTextNode('0'));
        projectNameAndCounterDiv.appendChild(projectCounter);

        // Default project can't be deleted
        if (project.projectName.toLowerCase() !== 'default') {
            const projectDelete = document.createElement('button');
            projectDelete.classList = 'project-delete';
            projectDelete.appendChild(document.createTextNode('x'));
            projectDelete.addEventListener('click', (e) => {
                events.emit('projectDeleted', e.target.previousElementSibling.firstElementChild.innerText);
                render();
            })
            projectDiv.appendChild(projectDelete);
        }
    }

    projectAddButton.addEventListener('click', () => {
        const projectName = prompt('Enter name of project:'); // Will add input instead of prompt
        if (projectName) {
            events.emit('projectAdded', projectName);
            render();
        }
    })

    return { render }
})();
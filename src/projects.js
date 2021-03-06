import { events } from "./pubsub";

const projects = (function() {
    let projects = [{ projectName: 'Default' }];

    // Project Factory
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
        // Delete all projects first
        [...projectList.children].forEach(project => {
            projectList.removeChild(project);
        })

        // Get the current list of projects and create them again
        const currentProjectList = projects.getCurrentProjectList();
        currentProjectList.forEach(project => {
            createProject(project);
        })

        // PubSub event
        events.emit('projectsRendered', currentProjectList);

        // Save to localStorage
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
            // When clicking on a project, set the main title to that project's name
            let sectionTitle = document.querySelector('.main-section-title');
            sectionTitle.innerText = e.target.innerText;

            // Filter the tasks
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

            // Emit event to delete the project
            projectDelete.addEventListener('click', (e) => {
                events.emit('projectDeleted', e.target.previousElementSibling.firstElementChild.innerText);

                render();
            })
            projectDiv.appendChild(projectDelete);
        }
    }

    projectAddButton.addEventListener('click', () => {
        const projectName = prompt('Enter name of project:');
        if (projectName) {
            events.emit('projectAdded', projectName);

            render();
        }
    })

    return { render }
})();
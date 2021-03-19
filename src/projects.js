import { events } from "./pubsub";

const projects = (function() {
    const projects = [{ projectName: 'Default' },
                      { projectName: 'School' },
                      { projectName: 'Workout' },
                      { projectName: 'Recreational' }];

    const createProject = (projectName) => {
        return { projectName };
    }

    const getCurrentProjectList = () => projects;

    const addProject = (projectName) => {
        projects.push(createProject(projectName));
    }

    const deleteProject = (projectName) => {
        for (let i = 0; i < projects.length; i++) {
            if (projects[i].projectName === projectName) {
                projects.splice(i, 1);
                return;
            }
        }
    }

    // PubSub events
    events.on('projectAdded', addProject);
    events.on('projectDeleted', deleteProject);

    return { getCurrentProjectList }
})();

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

        // console.table(currentProjectList);
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

        events.emit('projectAdded', projectName);
        render();
    })

    return { render }
})();
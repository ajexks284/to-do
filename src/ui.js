import { app } from './app';
import { events } from './pubsub';
import { returnItemsWithDisplayNone } from './index';

export const UI = (function() {
    // Cache DOM
    const addTaskForm = document.querySelector('.add-task-form');
    const addTaskButton = document.querySelector('.add-task');
    const cancelButton = document.querySelector('.cancel-task');
    const modal = document.querySelector('.modal-bg');
    const itemsDiv = document.querySelector('.to-do-items');
    const taskTitleInput = document.getElementById('task-title');
    const taskDueDateInput = document.getElementById('task-due-date');
    const taskProjectInput = document.getElementById('task-project');
    const taskPriorityInput = document.getElementById('task-priority');

    // Functions
    function render() {
        const displayNoneObj = returnItemsWithDisplayNone();
        
        [...itemsDiv.children].forEach(item => {
            if (item.classList.contains('to-do-item')) {
                itemsDiv.removeChild(item);
            }
        })

        const list = app.getCurrentToDoList();
        app.sortList();


        list.forEach(todoItem => {
            let isHidden;
            if (displayNoneObj[todoItem.title] === 'none') {
                isHidden = true;
            } else {
                isHidden = false;
            }

            createTask(todoItem, isHidden);
        });

        app.saveToDoList();     
    }

    function createTask(task, isHidden) {
        const taskDiv = document.createElement('div');
        taskDiv.classList = 'to-do-item';
        taskDiv.id = task.project;
        if (task.isCompleted) taskDiv.classList.add('completed');
        itemsDiv.appendChild(taskDiv);

        if (isHidden) {
            taskDiv.style.display = 'none';
        }

        const taskPriorityAndTitle = document.createElement('div');
        taskPriorityAndTitle.classList = 'priority-title';
        taskDiv.appendChild(taskPriorityAndTitle);

        const taskPriority = document.createElement('div');
        taskPriority.classList = 'to-do-item-priority to-do-item-complete';
        taskPriority.style.borderColor = task.isCompleted ? '#ddd' : `${determinePriorityColor(task)}`;
        taskPriority.addEventListener('click', (e) => {
            e.target.parentElement.parentElement.classList.toggle('completed');

            // PubSub events
            events.emit('completeStatusChanged', e.target.nextSibling.innerText);

            render();
        });
        taskPriorityAndTitle.appendChild(taskPriority);

        const taskTitle = document.createElement('div');
        taskTitle.classList = 'to-do-item-title';
        taskTitle.appendChild(document.createTextNode(task.title));
        taskPriorityAndTitle.appendChild(taskTitle);

        const taskDueDateAndDeleteButton = document.createElement('div');
        taskDueDateAndDeleteButton.classList = 'duedate-deletebtn';
        taskDiv.appendChild(taskDueDateAndDeleteButton);

        const taskDueDate = document.createElement('div');
        taskDueDate.classList = 'to-do-item-duedate';
        taskDueDate.appendChild(document.createTextNode(task.dueDate));
        taskDueDateAndDeleteButton.appendChild(taskDueDate);

        const taskDeleteButton = document.createElement('button');
        taskDeleteButton.classList = 'to-do-item-delete';
        taskDeleteButton.appendChild(document.createTextNode('x'));
        taskDeleteButton.addEventListener('click', (e) => {
            const title = e.target.parentElement.parentElement.firstElementChild.innerText;
            const date = e.target.previousSibling.innerText;

            // PubSub events
            events.emit('taskDeleted', title, date);

            render();
        })
        taskDueDateAndDeleteButton.appendChild(taskDeleteButton);

        const completedLine = document.createElement('div');
        completedLine.classList = 'completed-line';
        taskDiv.appendChild(completedLine);
    }

    function determinePriorityColor(task) {
        const priority = task.priority.toString();
        let color;

        switch (priority) {
            case '1':
                color = 'red';
                break;
            case '2':
                color = 'orange'
                break;
            case '3':
                color = 'yellow';
                break;
            case '4':
                color = 'green';
                break;
        }

        return color;
    }

    // Task Projects
    const taskProjects = document.querySelector('.task-project');
    events.on('projectsRendered', (currentProjectList) => {
        // Delete options first
        taskProjects.innerHTML = '';

        currentProjectList.forEach(project => {
            const projectName = project.projectName;

            // Create the project option
            const option = document.createElement('option');
            option.value = projectName;
            option.appendChild(document.createTextNode(projectName));
            taskProjects.appendChild(option);
        })

    })

    events.on('projectAdded', (projectName) => {
        const option = document.createElement('option');
        option.value = projectName;
        option.appendChild(document.createTextNode(projectName));
        taskProjects.appendChild(option);
    })

    events.on('projectDeleted', (projectName) => {
        // Remove project from project list
        [...taskProjects].forEach(option => {
            if (option.value.toLowerCase() === projectName.toLowerCase()) {
                taskProjects.removeChild(option);
            }
        })

        // Remove tasks that were in this project
        const currentToDo = app.getCurrentToDoList();
        let i = currentToDo.length;
        
        while (i--) {
            if (currentToDo[i].project.toLowerCase() === projectName.toLowerCase()) {
                events.emit('taskDeleted', currentToDo[i].title, currentToDo[i].dueDate);
                render();
            }
        }
    })

    // Events
    addTaskButton.addEventListener('click', () => {
        modal.style.display = 'block';
    });

    cancelButton.addEventListener('click', () => {
        modal.style.display = 'none';
        addTaskForm.reset();
    });

    modal.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-bg')) {
            modal.style.display = 'none';
            addTaskForm.reset();
        }
    });

    addTaskForm.addEventListener('submit', (e) => {
        // PubSub events
        events.emit('taskAdded', taskTitleInput.value, taskDueDateInput.value, taskProjectInput.value, taskPriorityInput.value)

        render();

        // Resets form
        e.preventDefault();
        modal.style.display = 'none';
        addTaskForm.reset();
    });

    document.body.onload = function() {
        addTaskForm.reset();
    };

    return { render }
})();
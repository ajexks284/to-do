import { app } from './app';
import { events } from './pubsub';
import { returnItemsWithDisplayNone } from './index';
import { format, parse, parseISO } from 'date-fns';

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
        // Object with all the tasks and their display value (flex/none)
        const displayNoneObj = returnItemsWithDisplayNone();
        
        // Delete all items
        [...itemsDiv.children].forEach(item => {
            itemsDiv.removeChild(item);
        })

        // Get the list and sort it
        const list = app.getCurrentToDoList();
        app.sortList();

        // Create the task with its display value
        list.forEach(todoItem => {
            let isHidden = displayNoneObj[todoItem.title] === 'none';
            createTask(todoItem, isHidden);
        });

        // Save in localStorage
        app.saveToDoList();     
    }

    function createTask(task, isHidden) {
        const taskDiv = document.createElement('div');
        taskDiv.classList = 'to-do-item';
        taskDiv.id = task.project;
        if (task.isCompleted) taskDiv.classList.add('completed'); // If the item was completed, keep it completed
        itemsDiv.appendChild(taskDiv);

        if (isHidden) taskDiv.style.display = 'none'; // If the item had display none, keep it after rendering

        const taskPriorityAndTitle = document.createElement('div');
        taskPriorityAndTitle.classList = 'priority-title';
        taskDiv.appendChild(taskPriorityAndTitle);

        const taskPriority = document.createElement('div');
        taskPriority.classList = 'to-do-item-priority';
        // Set background color of priority div based on its priority; if its completed make it gray
        taskPriority.style.backgroundColor = task.isCompleted ? '#ddd' : `${determinePriorityColor(task)}`; 
        // Emit event to change the task's complete status when clicked
        taskPriority.addEventListener('click', (e) => {
            const taskDiv = e.target.parentElement.parentElement;
            taskDiv.classList.toggle('completed');
            
            const title = e.target.nextSibling.innerText;
            const date = format(parse(e.target.parentElement.nextSibling.firstElementChild.innerText, 'do MMM yyyy', new Date()), 'yyyy-MM-dd')
            
            // PubSub events
            events.emit('completeStatusChanged', title, date);

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
        taskDueDate.appendChild(document.createTextNode(format(parseISO(task.dueDate), 'do MMM yyyy')));
        taskDueDateAndDeleteButton.appendChild(taskDueDate);

        const taskDeleteButton = document.createElement('button');
        taskDeleteButton.classList = 'to-do-item-delete';
        // Emit event to delete the task when clicked
        taskDeleteButton.addEventListener('click', (e) => {
            const title = e.target.parentElement.parentElement.firstElementChild.innerText;
            const date = format(parse(e.target.previousSibling.innerText, 'do MMM yyyy', new Date()), 'yyyy-MM-dd');

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

    // When projects are rendered, update the project's options on add-task form
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

    // When deleting a project, delete all the tasks in the project too
    events.on('projectDeleted', (projectName) => {
        const currentToDo = app.getCurrentToDoList();
        let i = currentToDo.length;
        
        while (i--) {
            if (currentToDo[i].project.toLowerCase() === projectName.toLowerCase()) {
                events.emit('taskDeleted', currentToDo[i].title, currentToDo[i].dueDate);
                render();
            }
        }
    })

    // Modal events
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

    // Events
    addTaskForm.addEventListener('submit', (e) => {
        // PubSub event
        events.emit('taskAdded', taskTitleInput.value, taskDueDateInput.value, taskProjectInput.value, taskPriorityInput.value)

        render();

        // When adding a task, go back to home section, and remove filters
        let sectionTitle = document.querySelector('.main-section-title');
        sectionTitle.innerText = 'Home';
        
        let taskList = document.querySelectorAll('.to-do-item');
        [...taskList].forEach(task => {
            task.style.display = 'flex';
        })

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
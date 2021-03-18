import { app } from './app';
import { events } from './pubsub';

export const UI = (function() {
    // Cache DOM
    const addTaskForm = document.querySelector('.add-task-form');
    const addTaskButton = document.querySelector('.add-task');
    const cancelButton = document.querySelector('.cancel-task');
    const modal = document.querySelector('.modal-bg');
    const itemsDiv = document.querySelector('.to-do-items');

    // Functions
    function render() {
        [...itemsDiv.children].forEach(item => {
            if (item.classList.contains('to-do-item')) {
                itemsDiv.removeChild(item);
            }
        })

        const toDo = app.getCurrentToDoList();
        toDo.forEach(todoItem => {
            createTask(todoItem);
        })
    }

    function createTask(task) {
        const taskDiv = document.createElement('div');
        taskDiv.classList = 'to-do-item';
        if (task.isCompleted) taskDiv.classList.add('completed');
        itemsDiv.appendChild(taskDiv);

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

    const taskTitleInput = document.getElementById('task-title');
    const taskDueDateInput = document.getElementById('task-due-date');
    const taskProjectInput = document.getElementById('task-project');
    const taskPriorityInput = document.getElementById('task-priority');

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

    return {
        render,
    }
})();
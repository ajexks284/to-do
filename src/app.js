import { events } from './pubsub';

export const app = (function() {
    let toDoList = [];

    function sortList() {
        toDoList.sort((a, b) => {
            return a.priority === b.priority ? 0 : (a.priority > b.priority ? 1 : -1);
        });
    }

    // To Do Factory
    function createToDo(title, dueDate, project, priority) {
        let isCompleted = false;
        return {title, dueDate, project, priority, isCompleted};
    }

    function getCurrentToDoList() {
        return toDoList;
    }

    function addToDo(title, dueDate, project, priority) {
        toDoList.push(createToDo(title, dueDate, project, priority));
    }

    function deleteToDo(title, date) {
        for (let i = 0; i < toDoList.length; i++) {
            if (toDoList[i].title === title && toDoList[i].dueDate === date) {
                toDoList.splice(i, 1);
            }
        }
    }

    function toggleCompleteStatus(title, date) {
        for (let i = 0; i < toDoList.length; i++) {
            if (toDoList[i].title === title && toDoList[i].dueDate === date) {
                toDoList[i].isCompleted = !toDoList[i].isCompleted;
            }
        }
    }

    // localStorage
    function saveToDoList() {
        localStorage.setItem('to-do', JSON.stringify(toDoList));
    }

    function getToDoList() {
        if (localStorage.getItem('to-do')) {
            toDoList = JSON.parse(localStorage.getItem('to-do'));
        }
    }

    // PubSub events
    events.on('completeStatusChanged', toggleCompleteStatus);
    events.on('taskDeleted', deleteToDo);
    events.on('taskAdded', addToDo);

    return { getCurrentToDoList, sortList, saveToDoList, getToDoList }
})();

app.getToDoList();
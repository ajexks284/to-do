import { UI } from './ui';
import { events } from './pubsub';

export const app = (function() {
    const toDoList = [{title: 'Do homework', dueDate: '2021-03-17', project: 'School', priority: 4, isCompleted: false},
                      {title: 'Go to school', dueDate: '2021-03-19', project: 'School', priority: 2, isCompleted: false},
                      {title: 'Workout', dueDate: '2021-03-18', project: 'Workout', priority: 3, isCompleted: false},
                      {title: 'Sleep', dueDate: '2021-03-22', project: 'Recreational', priority: 1, isCompleted: false},
                      {title: 'Sleep again', dueDate: '2021-04-03', project: 'Recreational', priority: 4, isCompleted: false}]

    function sortList() {
        toDoList.sort((a, b) => {
            return a.priority === b.priority ? 0 : (a.priority > b.priority ? 1 : -1);
        });
    }

    // To Do Factory
    const createToDo = (title, dueDate, project, priority) => {
        let isCompleted = false;
        project = project || 'Default';
        return {title, dueDate, project, priority, isCompleted};
    }

    const getCurrentToDoList = () => {
        return toDoList;
    }

    const addToDo = (title, dueDate, project, priority) => {
        toDoList.push(createToDo(title, dueDate, project, priority));
    }

    const deleteToDo = (title, date) => {
        for (let i = 0; i < toDoList.length; i++) {
            if (toDoList[i].title === title && toDoList[i].dueDate === date) {
                toDoList.splice(i, 1);
            }
        }
    }

    const toggleCompleteStatus = (title) => {
        toDoList.forEach(item => {
            if (item.title === title) {
                item.isCompleted = !item.isCompleted;
                return;
            }
        })
    }

    // PubSub events
    events.on('completeStatusChanged', toggleCompleteStatus);
    events.on('taskDeleted', deleteToDo);
    events.on('taskAdded', addToDo);

    return { getCurrentToDoList, sortList }
})();
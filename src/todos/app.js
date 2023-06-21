import html from './app.html?raw';
import todoStore, { Filters } from '../store/todo.store';
import { renderTodos, renderPending } from './use-cases';

const ElementIDs = {
    TodoList: '.todo-list',
    NewTodoInput: '#new-todo-input',
    ClearCompletedButton: '.clear-completed',
    TodoFilters: '.filtro',
    PendingCountLabel: '#pending-count',
}

/**
 * 
 * @param {String} elementId 
 */
export const App = (elementId) => {

    const displayTodos = () => {
        const todos = todoStore.getTodos( todoStore.getCurrentFilter() );
        renderTodos( ElementIDs.TodoList, todos );
        updatePendingCount();
    }

    const updatePendingCount = () => {
        renderPending( ElementIDs.PendingCountLabel );
    }

    // cuando la funcion App() se llama
    (()=> {
        const app = document.createElement('div');
        app.innerHTML = html;
        document.querySelector(elementId).append(app);
        displayTodos();
    })();

    /* REFERENCIAS HTML */
    const newDescriptionInput = document.querySelector( ElementIDs.NewTodoInput );
    const todoListUL = document.querySelector( ElementIDs.TodoList );
    const clearCompletedButton = document.querySelector( ElementIDs.ClearCompletedButton );
    const filtersLIs = document.querySelectorAll( ElementIDs.TodoFilters ); // devuelve un array

    /* LISTENERS */
    // Se agrega un ToDo cuando se escribe en el cuadro de texto
    newDescriptionInput.addEventListener('keyup', ( event ) => {
        if ( event.keyCode !== 13 ) return; // 13 es Enter
        if ( event.target.value.trim().length === 0 ) return; // trim() quita los espacios de los strings

        todoStore.addTodo( event.target.value );
        displayTodos(); // renderiza
        event.target.value = '';
    });

    // Se tacha el ToDo cuando se selecciona como 'done'
    todoListUL.addEventListener('click', ( event ) => {
        const element = event.target.closest('[data-id]'); // busca el elemento HTML con el data-id mas cercano (padre)
        todoStore.toggleTodo( element.getAttribute('data-id') );
        displayTodos();
    });

    todoListUL.addEventListener('click', ( event ) => {
        const isDestroyElement = event.target.className === 'destroy';
        const element = event.target.closest('[data-id]');
        if ( !element || !isDestroyElement ) return;
        todoStore.deleteTodo( element.getAttribute('data-id') );
        displayTodos();
    });

    clearCompletedButton.addEventListener('click', () => {
        todoStore.deleteCompleted();
        displayTodos();
    });

    filtersLIs.forEach( element => { // recorre el array
        element.addEventListener('click', (element) => {
            filtersLIs.forEach( el => el.classList.remove('selected') ); // remueve el recuadro de todos
            element.target.classList.add('selected'); // pone el recuadro en el actual
            // muestra los ToDo segun el boton apretado
            switch ( element.target.text ) {
                case 'Todos': todoStore.setFilter( Filters.All );
                break;
                case 'Pendientes': todoStore.setFilter( Filters.Pending );
                break;
                case 'Completados': todoStore.setFilter( Filters.Completed );
                break;
            }
            displayTodos(); 
        });
    });

}
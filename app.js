// Form
// List of tasks
const tasks = [{
        _id: '000001',
        complited: true,
        body: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Iste maxime temporibus recusandae facere corporis, necessitatibus earum officiis illo consectetur quia in modi exercitationem. Minus mollitia molestiae saepe ? Mollitia, quod commodi.',
        title: 'Mollitia, quod commodi',
    },
    {
        _id: '000002',
        complited: false,
        body: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Iste maxime temporibus recusandae facere corporis, necessitatibus earum officiis illo consectetur quia in modi exercitationem. Minus mollitia molestiae saepe ? Mollitia, quod commodi.',
        title: 'Mollitia, quod commodi',
    },
    {
        _id: '000003',
        complited: false,
        body: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Iste maxime temporibus recusandae facere corporis, necessitatibus earum officiis illo consectetur quia in modi exercitationem. Minus mollitia molestiae saepe ? Mollitia, quod commodi.',
        title: 'Mollitia, quod commodi',
    },
    {
        _id: '000004',
        complited: true,
        body: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Iste maxime temporibus recusandae facere corporis, necessitatibus earum officiis illo consectetur quia in modi exercitationem. Minus mollitia molestiae saepe ? Mollitia, quod commodi.',
        title: 'Mollitia, quod commodi',
    },
    {
        _id: '000005',
        complited: false,
        body: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Iste maxime temporibus recusandae facere corporis, necessitatibus earum officiis illo consectetur quia in modi exercitationem. Minus mollitia molestiae saepe ? Mollitia, quod commodi.',
        title: 'Mollitia, quod commodi',
    },
];

(function (arrOfTasks) {
    const objOfTasks = arrOfTasks.reduce((acc, task) => {
        acc[task._id] = task;
        return acc;
    }, {});

    // Elements UI
    const listContainer = document.querySelector('.tasks-list-section .list-group');
    const form = document.forms['addTask'];
    const inputTitle = form.elements['title'];
    const inputBody = form.elements['body'];


    // Events
    renderAllTasks(objOfTasks);
    form.addEventListener('submit', onFormSubmitHandler);

    function renderAllTasks(tasksList) {
        if (!tasksList) {
            console.error('Put list of tasks!');
            return;
        }

        const fragment = document.createDocumentFragment();
        Object.values(tasksList).forEach(task => {
            const li = listItemTemplate(task);
            fragment.appendChild(li);
        });
        listContainer.appendChild(fragment);
    }

    function listItemTemplate({
        _id,
        title,
        body
    } = {}) {
        const li = document.createElement('li');
        li.classList.add('list-group-item', 'd-flex', 'align-item-center', 'flex-wrap', 'mt-2');

        const span = document.createElement('span');
        span.textContent = title;
        span.style.fontWeight = 'bold';

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete task';
        deleteBtn.classList.add('btn', 'btn-danger', 'ml-auto', 'delete-btn');

        const article = document.createElement('p');
        article.textContent = body;
        article.classList.add('mt-2', 'w-100');

        li.appendChild(span);
        li.appendChild(deleteBtn);
        li.appendChild(article);

        return li;
    }

    function onFormSubmitHandler(e) {
        e.preventDefault();
        const titleValue = inputTitle.value;
        const bodyValue = inputBody.value;

        if (!titleValue || !bodyValue) {
            alert('Enter Title and Body of Form');
            return;
        }

        const task = createNewTask(titleValue, bodyValue);
        const listItem = listItemTemplate(task);
        listContainer.insertAdjacentElement('afterbegin', listItem);
        form.reset();
    }

    function createNewTask(title, body) {
        const newTask = {
            title,
            body,
            complited: false,
            _id: `task-${parseInt(Math.random()*1000000)}`,
        };

        objOfTasks[newTask._id] = newTask;

        return {
            ...newTask
        };
    }

}(tasks));
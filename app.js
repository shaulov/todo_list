// ToDo List

(function () {
    const objOfTasks = JSON.parse(localStorage.getItem("userTask")) || {};

    const saveTask = () => {
        localStorage.setItem("userTask", JSON.stringify(objOfTasks));
    };

    const themes = {
        default: {
            "--base-text-color": "#212529",
            "--header-bg": "#007bff",
            "--header-text-color": "#fff",
            "--default-btn-bg": "#007bff",
            "--default-btn-text-color": "#fff",
            "--default-btn-hover-bg": "#0069d9",
            "--default-btn-border-color": "#0069d9",
            "--danger-btn-bg": "#dc3545",
            "--danger-btn-text-color": "#fff",
            "--danger-btn-hover-bg": "#bd2130",
            "--danger-btn-border-color": "#dc3545",
            "--input-border-color": "#ced4da",
            "--input-bg-color": "#fff",
            "--input-text-color": "#495057",
            "--input-focus-bg-color": "#fff",
            "--input-focus-text-color": "#495057",
            "--input-focus-border-color": "#80bdff",
            "--input-focus-box-shadow": "0 0 0 0.2rem rgba(0, 123, 255, 0.25)",
        },
        dark: {
            "--base-text-color": "#212529",
            "--header-bg": "#343a40",
            "--header-text-color": "#fff",
            "--default-btn-bg": "#58616b",
            "--default-btn-text-color": "#fff",
            "--default-btn-hover-bg": "#292d31",
            "--default-btn-border-color": "#343a40",
            "--default-btn-focus-box-shadow": "0 0 0 0.2rem rgba(141, 143, 146, 0.25)",
            "--danger-btn-bg": "#b52d3a",
            "--danger-btn-text-color": "#fff",
            "--danger-btn-hover-bg": "#88222c",
            "--danger-btn-border-color": "#88222c",
            "--input-border-color": "#ced4da",
            "--input-bg-color": "#fff",
            "--input-text-color": "#495057",
            "--input-focus-bg-color": "#fff",
            "--input-focus-text-color": "#495057",
            "--input-focus-border-color": "#78818a",
            "--input-focus-box-shadow": "0 0 0 0.2rem rgba(141, 143, 146, 0.25)",
        },
        light: {
            "--base-text-color": "#212529",
            "--header-bg": "#fff",
            "--header-text-color": "#212529",
            "--default-btn-bg": "#fff",
            "--default-btn-text-color": "#212529",
            "--default-btn-hover-bg": "#e8e7e7",
            "--default-btn-border-color": "#343a40",
            "--default-btn-focus-box-shadow": "0 0 0 0.2rem rgba(141, 143, 146, 0.25)",
            "--danger-btn-bg": "#f1b5bb",
            "--danger-btn-text-color": "#212529",
            "--danger-btn-hover-bg": "#ef808a",
            "--danger-btn-border-color": "#e2818a",
            "--input-border-color": "#ced4da",
            "--input-bg-color": "#fff",
            "--input-text-color": "#495057",
            "--input-focus-bg-color": "#fff",
            "--input-focus-text-color": "#495057",
            "--input-focus-border-color": "#78818a",
            "--input-focus-box-shadow": "0 0 0 0.2rem rgba(141, 143, 146, 0.25)",
        },
    };

    let lastSelectedTheme = localStorage.getItem("app_theme") || "default";

    // Elements UI
    const listContainer = document.querySelector("#task-list");
    const form = document.forms["addTask"];
    const inputTitle = form.elements["title"];
    const inputBody = form.elements["body"];
    const themeSelect = document.getElementById("themeSelect");
    const messageAboutEmpty = document.querySelector(".empty-msg");
    const allTaskBtn = document.querySelector(".all-task-btn");
    const uncompeltedTaskBtn = document.querySelector(".uncompleted-task-btn");

    // Events
    setTheme(lastSelectedTheme);
    renderAllTasks(objOfTasks);
    form.addEventListener("submit", onFormSubmitHandler);
    listContainer.addEventListener("click", onDeleteHandler);
    listContainer.addEventListener("click", onCompleteHandler);
    themeSelect.addEventListener("change", onThemeSeletHandler);
    allTaskBtn.addEventListener("click", allTasksBtnHandler);
    uncompeltedTaskBtn.addEventListener("click", uncompletedTaskBtnHandler);

    function renderAllTasks(tasksList) {
        if (!tasksList) {
            console.error("Put list of tasks!");
            return;
        }
        const fragment = document.createDocumentFragment();
        Object.values(tasksList).forEach((task) => {
            const li = listItemTemplate(task);
            fragment.appendChild(li);
        });
        listContainer.appendChild(fragment);
        checkEmptiness();
    }

    function listItemTemplate({
        _id,
        title,
        body,
        completed
    } = {}) {
        const li = document.createElement("li");
        li.classList.add(
            "list-group-item",
            "d-flex",
            "align-item-center",
            "flex-wrap",
            "mt-2"
        );
        li.dataset.taskId = _id;

        const span = document.createElement("span");
        span.textContent = title;
        span.style.fontWeight = "bold";

        const btnContainer = document.createElement("div");
        btnContainer.classList.add("ml-auto");

        const completeBtn = document.createElement("button");
        completeBtn.textContent = "Complete task";
        completeBtn.classList.add("btn", "btn-success", "complete-btn");
        completeBtn.style.marginRight = "5px";

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete task";
        deleteBtn.classList.add("btn", "btn-danger", "ml-auto", "delete-btn");

        const article = document.createElement("p");
        article.textContent = body;
        article.classList.add("mt-2", "w-100");

        li.appendChild(span);
        btnContainer.appendChild(completeBtn);
        btnContainer.appendChild(deleteBtn);
        li.appendChild(btnContainer);
        li.appendChild(article);

        if (completed) completeTask(li);

        return li;
    }

    function onFormSubmitHandler(e) {
        e.preventDefault();
        const titleValue = inputTitle.value;
        const bodyValue = inputBody.value;

        if (!titleValue || !bodyValue) {
            alert("Enter Title and Body of Form");
            return;
        }

        const task = createNewTask(titleValue, bodyValue);
        const listItem = listItemTemplate(task);
        listContainer.insertAdjacentElement("afterbegin", listItem);
        form.reset();
        checkEmptiness();
        saveTask();
    }

    function createNewTask(title, body) {
        const newTask = {
            title,
            body,
            completed: false,
            _id: `task-${parseInt(Math.random() * 1000000)}`,
        };

        objOfTasks[newTask._id] = newTask;

        return {
            ...newTask,
        };
    }

    function deleteTask(id) {
        const {
            title
        } = objOfTasks[id];
        const isConfirm = confirm(`You want delete this task '${title}'?`);
        if (!isConfirm) return isConfirm;
        delete objOfTasks[id];
        return isConfirm;
    }

    function deleteTaskFromHtml(confirmed, el) {
        if (!confirmed) return;
        el.remove();
    }

    function onDeleteHandler({
        target
    }) {
        if (target.classList.contains("delete-btn")) {
            const parent = target.closest("[data-task-id]");
            const id = parent.dataset.taskId;
            const confirmed = deleteTask(id);
            deleteTaskFromHtml(confirmed, parent);
            checkEmptiness();
            saveTask();
        }
    }

    function completeTask(el) {
        el.classList.add("completed");
        const completeBtn = el.children[1].firstElementChild;
        completeBtn.classList.add("disabled");
        if (uncompeltedTaskBtn.classList.contains("active")) hideTask(el);
    }

    function onCompleteHandler({
        target
    }) {
        if (target.classList.contains("complete-btn")) {
            const parent = target.closest("[data-task-id]");
            const id = parent.dataset.taskId;
            objOfTasks[id].completed = true;
            completeTask(parent);
            saveTask();
        }
    }

    function onThemeSeletHandler(e) {
        const selectedTheme = themeSelect.value;
        const isConfirmed = confirm(`Do you want change theme '${selectedTheme}'`);
        if (!isConfirmed) {
            themeSelect.value = lastSelectedTheme;
            return;
        }
        setTheme(selectedTheme);
        lastSelectedTheme = selectedTheme;
        localStorage.setItem("app_theme", selectedTheme);
    }

    function setTheme(name) {
        const selectedThemeObj = themes[name];
        Object.entries(selectedThemeObj).forEach(([key, value]) => {
            document.documentElement.style.setProperty(key, value);
        });
    }

    function checkEmptiness() {
        if (!listContainer.firstElementChild) {
            messageAboutEmpty.classList.remove("d-none");
        } else {
            messageAboutEmpty.classList.add("d-none");
        }
    }

    function allTasksBtnHandler() {
        allTaskBtn.classList.add("active");
        uncompeltedTaskBtn.classList.remove("active");
        showAllTasks();
    }

    function uncompletedTaskBtnHandler() {
        allTaskBtn.classList.remove("active");
        uncompeltedTaskBtn.classList.add("active");
        hideCompletedTask();
    }

    function showAllTasks() {
        [...listContainer.children].forEach((item) => {
            item.classList.add("d-flex");
            item.classList.remove("d-none");
        });
    }

    function hideCompletedTask(el) {
        if (!uncompeltedTaskBtn.classList.contains("active")) return;

        const completedTasks =
            el || [...listContainer.children].filter((item) => {
                if (item.classList.contains("completed")) return item;
            });
        [...completedTasks].forEach((item) => hideTask(item));
    }

    function hideTask(task) {
        task.classList.remove("d-flex");
        task.classList.add("d-none");
    }
})();
document.addEventListener("DOMContentLoaded", function() {
    const taskList = document.getElementById("taskList");
    const taskInput = document.getElementById("taskInput");
    const taskDate = document.getElementById("taskDate"); // tylko data, bez godziny
    const addTaskButton = document.getElementById("addTaskButton");
    const searchInput = document.getElementById("search");
    const deleteCheckedButton = document.getElementById("deleteCheckedButton");

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    function isValidDate(inputDate) {
        const currentDate = new Date();
        const date = new Date(inputDate);
        return inputDate === "" || date.setHours(0,0,0,0) > currentDate.setHours(0,0,0,0); // Porównanie tylko dat
    }

    function highlightMatch(text, searchTerm) {
        const regex = new RegExp(`(${searchTerm})`, 'gi'); // Wyrażenie regularne do znajdywania frazy (niezależne od wielkości liter)
        return text.replace(regex, `<mark>$1</mark>`); // Zastąpienie znalezionego tekstu tagiem <mark>
    }

    function displayTasks(filteredTasks = tasks, searchTerm = "") {
        taskList.innerHTML = "";
        filteredTasks.forEach((task, index) => {
            const li = document.createElement("li");

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = task.completed || false;
            checkbox.addEventListener("change", function() {
                task.completed = checkbox.checked;
                saveTasks();
                displayTasks();
            });

            const taskContent = document.createElement("span");
            taskContent.classList.add("task-content");
            if (searchTerm && searchTerm.length >= 2) {
                taskContent.innerHTML = highlightMatch(task.text, searchTerm); // Podświetlanie dopasowanej frazy
            } else {
                taskContent.innerHTML = task.text;
            }

            const taskDueDate = document.createElement("span");
            taskDueDate.classList.add("task-date");
            taskDueDate.innerHTML = task.dueDate ? formatDate(task.dueDate) : "Brak terminu"; // Wyświetla tylko datę

            const deleteButton = document.createElement("button");
            deleteButton.classList.add("delete-button");
            deleteButton.innerHTML = "🗑️";
            deleteButton.addEventListener("click", () => {
                removeTask(index); 
            });

            li.appendChild(checkbox);
            li.appendChild(taskContent);
            li.appendChild(taskDueDate);
            li.appendChild(deleteButton);

            taskContent.addEventListener("click", function() {
                const input = document.createElement("input");
                input.type = "text";
                input.value = task.text;
                li.replaceChild(input, taskContent);
                input.focus();

                input.addEventListener("blur", function() {
                    task.text = input.value;
                    saveTasks();
                    displayTasks();
                });
            });

            taskList.appendChild(li);
        });
    }

    addTaskButton.addEventListener("click", function() {
        const taskText = taskInput.value.trim();
        const taskDueDate = taskDate.value; // Przechowuje tylko datę

        if (taskText.length < 3 || taskText.length > 255) {
            alert("Zadanie musi mieć od 3 do 255 znaków.");
            return;
        }
        if (!isValidDate(taskDueDate)) {
            alert("Data musi być w przyszłości lub pusta.");
            return;
        }

        const task = {
            text: taskText,
            dueDate: taskDueDate, // Przechowuje datę w formacie YYYY-MM-DD
            completed: false 
        };

        tasks.push(task);
        saveTasks();
        displayTasks();
        taskInput.value = "";
        taskDate.value = ""; // Wyczyszczenie daty po dodaniu zadania
    });

    function formatDate(dateString) {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Miesiące są indeksowane od 0
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`; // Format YYYY-MM-DD
    }

    function saveTasks() {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    function removeTask(index) {
        tasks.splice(index, 1);
        saveTasks();
        displayTasks();
    }

    deleteCheckedButton.addEventListener("click", function() {
        tasks = tasks.filter(task => !task.completed); // Usunięcie zaznaczonych
        saveTasks();
        displayTasks();
    });

    searchInput.addEventListener("input", function() {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredTasks = tasks.filter(task => task.text.toLowerCase().includes(searchTerm));

        displayTasks(filteredTasks, searchTerm);
    });

    displayTasks();
});

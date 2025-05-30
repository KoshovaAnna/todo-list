window.addEventListener('load', () => {
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
//ссылки на элементы из html 
  const form = document.querySelector("#new-task-form");
  const input = document.querySelector("#new-task-input");
  const listEl = document.querySelector("#tasks");//эл. содержающий все задачи
  const filterAll = document.querySelector("#filter-all");
  const filterCompleted = document.querySelector("#filter-completed");
  const filterActive = document.querySelector("#filter-active");

  displayTasks();
  updateStats();

  form.addEventListener('submit', (e) => {
    e.preventDefault();// предотвращает перезагрузку страницы 
    const taskText = input.value;
    if (!taskText) return;

    const task = {
      content: taskText,
      completed: false, //по умолчинию
      createdAt: new Date().getTime() //sort tasks by when they were created or calculating
    };

    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));//превр. массив в строкуJSON

    input.value = ''; //очищаем поле ввода после доб. задачи
    displayTasks();
    updateStats(); // Update stats after adding a task
  });

  function toggleTaskCompletion(taskEl, task, checkbox) {//перекл статус выплонения задачи
    task.completed = checkbox.checked;
    localStorage.setItem('tasks', JSON.stringify(tasks));

    if (task.completed) {
      taskEl.classList.add('completed');
    } else {
      taskEl.classList.remove('completed');
    }

    displayTasks();
    updateStats(); // Update stats after toggling completion
  }

  function displayTasks(filter = 'all') {
    listEl.innerHTML = "";

        // Перебираем массив tasks, чтобы отобразить каждую задачу в соответствии с выбранным фильтром
    tasks.forEach((task) => {
      if (filter === 'completed' && !task.completed) return;
      if (filter === 'active' && task.completed) return;

      const taskEl = document.createElement('div');
      taskEl.classList.add('task');
      taskEl.setAttribute('data-status', task.completed ? 'completed' : 'active');
        
      
      // Создаем контейнер для содержимого задачи
      const taskContentEl = document.createElement('div');
      taskContentEl.classList.add('content');



      const taskCheckbox = document.createElement('input');
      taskCheckbox.type = 'checkbox';
      taskCheckbox.classList.add('task-checkbox');
      taskCheckbox.checked = task.completed;// Если задача выполнена, чекбокс будет отмечен

      const taskInputEl = document.createElement('input');
      taskInputEl.classList.add('text');
      taskInputEl.type = 'text';
      taskInputEl.value = task.content;
      taskInputEl.setAttribute('readonly', 'readonly');

      //стиль завершенной задачи 
      if (task.completed) {
        taskInputEl.classList.add('completed'); // Apply strikethrough if completed
      }
//добавл нового к HTML структуре 
      taskContentEl.appendChild(taskCheckbox);
      taskContentEl.appendChild(taskInputEl);
      taskEl.appendChild(taskContentEl);

      const taskActionsEl = document.createElement('div');
      taskActionsEl.classList.add('actions');

//button
      const taskEditEl = document.createElement('button');
      taskEditEl.classList.add('edit');
      taskEditEl.innerText = 'Edit';

      const taskDeleteEl = document.createElement('button');
      taskDeleteEl.classList.add('delete');
      taskDeleteEl.innerText = 'Delete';
//


      taskActionsEl.appendChild(taskEditEl);
      taskActionsEl.appendChild(taskDeleteEl);
      taskEl.appendChild(taskActionsEl);

      listEl.appendChild(taskEl);

      //добавл событие дляCheckbox, изменения сост.-- обновляется статус задачи 
      taskCheckbox.addEventListener('change', () => {
        toggleTaskCompletion(taskInputEl, task, taskCheckbox);
      });


    // Добавляем обработчик события для кнопки редактирования задачи
      taskEditEl.addEventListener('click', () => {
        if (taskEditEl.innerText.toLowerCase() === "edit") {
          taskEditEl.innerText = "Save";
          taskInputEl.removeAttribute("readonly");
          taskInputEl.focus();
        } else { // Если кнопка в режиме "Save", сохраняем изменения и возвращаем в режим "Edit"

          taskEditEl.innerText = "Edit";
          taskInputEl.setAttribute("readonly", "readonly");
          task.content = taskInputEl.value;
          localStorage.setItem('tasks', JSON.stringify(tasks));
          displayTasks();
          updateStats(); 
        }
      });
      // 

      taskDeleteEl.addEventListener('click', () => {
        tasks = tasks.filter(t => t !== task);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        displayTasks();
        updateStats(); 
      });
    });
  }

  function updateStats() {
    const completedTasks = tasks.filter((task) => task.completed).length;
    const totalTasks = tasks.length;
    const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    const progressBar = document.getElementById("progress");

    progressBar.style.width = `${progress}%`;//динамически изменяет ширину полосы прогресса.

    document.getElementById("numbers").innerText = `${completedTasks} / ${totalTasks}`;
  }

  filterAll.addEventListener('click', () => displayTasks("all"));
  filterCompleted.addEventListener('click', () => displayTasks("completed"));
  filterActive.addEventListener('click', () => displayTasks("active"));
});

const menuToggle = document.getElementById('menuToggle');
const nav = document.getElementById('nav');

menuToggle.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});

nav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  });
});

const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const taskSubject = document.getElementById('taskSubject');
const taskList = document.getElementById('taskList');
const taskCounter = document.getElementById('taskCounter');
const remainingCount = document.getElementById('remainingCount');
const completedBig = document.getElementById('completedBig');
const wideProgress = document.getElementById('wideProgress');
const progressPercent = document.getElementById('progressPercent');
const progressMessage = document.getElementById('progressMessage');
const heroTasks = document.getElementById('heroTasks');
const heroPercent = document.getElementById('heroPercent');
const heroProgress = document.getElementById('heroProgress');
const filters = document.querySelectorAll('.filter');

let tasks = [
  { id: 1, title: 'Revise one Java topic', subject: 'Core Java', done: false },
  { id: 2, title: 'Solve 3 practice questions', subject: 'Python', done: true }
];
let activeFilter = 'all';
let nextId = 3;

function renderTasks() {
  const visibleTasks = tasks.filter(task => {
    if (activeFilter === 'pending') return !task.done;
    if (activeFilter === 'done') return task.done;
    return true;
  });

  taskList.innerHTML = '';
  if (!visibleTasks.length) {
    const empty = document.createElement('li');
    empty.className = 'empty-state';
    empty.textContent = activeFilter === 'done' ? 'No completed tasks yet. Finish a task to see it here.' : 'No tasks here. Add a task to get started!';
    taskList.appendChild(empty);
  } else {
    visibleTasks.forEach(task => {
      const item = document.createElement('li');
      item.className = `task-item${task.done ? ' completed' : ''}`;

      const check = document.createElement('button');
      check.className = 'task-check';
      check.type = 'button';
      check.textContent = task.done ? '✓' : '';
      check.setAttribute('aria-label', task.done ? 'Mark task incomplete' : 'Mark task complete');
      check.addEventListener('click', () => {
        task.done = !task.done;
        renderTasks();
      });

      const info = document.createElement('div');
      info.className = 'task-info';
      const title = document.createElement('strong');
      title.textContent = task.title;
      const subject = document.createElement('small');
      subject.textContent = task.subject;
      info.append(title, subject);

      const remove = document.createElement('button');
      remove.className = 'delete-task';
      remove.type = 'button';
      remove.textContent = '×';
      remove.setAttribute('aria-label', 'Delete task');
      remove.addEventListener('click', () => {
        tasks = tasks.filter(entry => entry.id !== task.id);
        renderTasks();
      });

      item.append(check, info, remove);
      taskList.appendChild(item);
    });
  }

  const completed = tasks.filter(task => task.done).length;
  const total = tasks.length;
  const percent = total ? Math.round(completed / total * 100) : 0;
  taskCounter.textContent = total;
  remainingCount.textContent = `${total - completed} remaining`;
  completedBig.textContent = completed;
  wideProgress.style.width = `${percent}%`;
  progressPercent.textContent = `${percent}%`;
  heroTasks.innerHTML = `${completed} <small>/ ${total}</small>`;
  heroPercent.textContent = `${percent}%`;
  heroProgress.style.width = `${percent}%`;
  progressMessage.textContent = total === 0 ? 'Add a task to begin your journey.' : percent === 100 ? 'Amazing! All tasks completed.' : percent >= 50 ? 'You are making good progress!' : 'Every small step counts.';
}

taskForm.addEventListener('submit', event => {
  event.preventDefault();
  const title = taskInput.value.trim();
  if (!title) {
    taskInput.focus();
    return;
  }
  tasks.unshift({ id: nextId++, title, subject: taskSubject.value, done: false });
  taskInput.value = '';
  activeFilter = 'all';
  filters.forEach(button => button.classList.toggle('active', button.dataset.filter === 'all'));
  renderTasks();
  taskInput.focus();
});

filters.forEach(button => {
  button.addEventListener('click', () => {
    activeFilter = button.dataset.filter;
    filters.forEach(filter => filter.classList.toggle('active', filter === button));
    renderTasks();
  });
});

const timerDisplay = document.getElementById('timerDisplay');
const timerStart = document.getElementById('timerStart');
const timerReset = document.getElementById('timerReset');
const timerHint = document.getElementById('timerHint');
const timerRing = document.getElementById('timerRing');
const focusSessions = document.getElementById('focusSessions');
const sessionLength = 25 * 60;
let secondsLeft = sessionLength;
let timerInterval = null;
let completedSessions = 0;

function updateTimer() {
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const elapsed = sessionLength - secondsLeft;
  const degrees = Math.round(elapsed / sessionLength * 360);
  timerRing.style.background = `conic-gradient(#6ca77c ${degrees}deg, #edf1eb ${degrees}deg)`;
}

timerStart.addEventListener('click', () => {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
    timerStart.textContent = 'Resume focus';
    timerHint.textContent = 'Paused. Continue whenever you are ready.';
    return;
  }
  if (secondsLeft === 0) secondsLeft = sessionLength;
  timerStart.textContent = 'Pause session';
  timerHint.textContent = 'Nice work. Keep your attention on one thing.';
  timerInterval = setInterval(() => {
    secondsLeft -= 1;
    updateTimer();
    if (secondsLeft <= 0) {
      clearInterval(timerInterval);
      timerInterval = null;
      completedSessions += 1;
      focusSessions.textContent = completedSessions;
      timerStart.textContent = 'Start another';
      timerHint.textContent = 'Focus session complete! Take a short break.';
    }
  }, 1000);
});

timerReset.addEventListener('click', () => {
  clearInterval(timerInterval);
  timerInterval = null;
  secondsLeft = sessionLength;
  timerStart.textContent = 'Start focus';
  timerHint.textContent = 'Ready when you are. Take it one minute at a time.';
  updateTimer();
});

renderTasks();
updateTimer();

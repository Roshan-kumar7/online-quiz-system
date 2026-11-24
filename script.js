// -------------------- QUIZ DATA (ARRAY) --------------------
const questions = [
  { question: "Which data structure follows the LIFO principle?", options: ["Queue", "Stack", "Array", "Linked List"], answer: 1 },
  { question: "What is the time complexity of accessing an array element by index?", options: ["O(1)", "O(n)", "O(log n)", "O(n²)"], answer: 0 },
  { question: "Which data structure follows FIFO?", options: ["Stack", "Tree", "Queue", "Graph"], answer: 2 },
  { question: "Which operation adds an element to the top of a stack?", options: ["Enqueue", "Dequeue", "Push", "Peek"], answer: 2 },
  { question: "What is the worst-case time complexity of Linear Search?", options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"], answer: 2 },
  { question: "Which sorting algorithm repeatedly compares adjacent elements?", options: ["Merge Sort", "Bubble Sort", "Quick Sort", "Selection Sort"], answer: 1 },
  { question: "Which data structure is commonly used in Breadth-First Search?", options: ["Stack", "Queue", "Heap", "Array only"], answer: 1 },
  { question: "What is the time complexity of Binary Search on a sorted array?", options: ["O(n)", "O(n²)", "O(log n)", "O(1)"], answer: 2 },
  { question: "A node in a singly linked list contains data and a:", options: ["Next pointer", "Two child nodes", "Priority value", "Queue index"], answer: 0 },
  { question: "What is the average time complexity of Merge Sort?", options: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"], answer: 1 }
];

// -------------------- CUSTOM STACK (NAVIGATION HISTORY) --------------------
class Stack {
  constructor() { this.items = []; }
  push(value) { this.items.push(value); }
  pop() { return this.items.length ? this.items.pop() : null; }
  peek() { return this.items.length ? this.items[this.items.length - 1] : null; }
  isEmpty() { return this.items.length === 0; }
  clear() { this.items = []; }
}

// -------------------- CUSTOM QUEUE (QUESTION DELIVERY) --------------------
class Queue {
  constructor() { this.items = []; }
  enqueue(value) { this.items.push(value); }
  dequeue() { return this.items.length ? this.items.shift() : null; }
  isEmpty() { return this.items.length === 0; }
  size() { return this.items.length; }
}

// -------------------- MANUAL SORTING ALGORITHMS --------------------
function bubbleSortDescending(input) {
  const arr = [...input];
  for (let i = 0; i < arr.length - 1; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      if (arr[j].score < arr[j + 1].score) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}

function mergeSortDescending(input) {
  if (input.length <= 1) return [...input];
  const mid = Math.floor(input.length / 2);
  const left = mergeSortDescending(input.slice(0, mid));
  const right = mergeSortDescending(input.slice(mid));
  return mergeDescending(left, right);
}
function mergeDescending(left, right) {
  const merged = [];
  let i = 0, j = 0;
  while (i < left.length && j < right.length) {
    if (left[i].score >= right[j].score) merged.push(left[i++]);
    else merged.push(right[j++]);
  }
  while (i < left.length) merged.push(left[i++]);
  while (j < right.length) merged.push(right[j++]);
  return merged;
}

// -------------------- APPLICATION STATE --------------------
const $ = (id) => document.getElementById(id);
let currentIndex = 0;
let answers = [];
let navigationHistory = new Stack();
let deliveryQueue = new Queue();
let lastResult = null;
let toastTimer;

const views = ["home", "quiz", "result", "leaderboard", "dsa"];
function showView(name) {
  views.forEach(view => $(view + "View").classList.toggle("active", view === name));
  document.querySelectorAll(".nav-link").forEach(btn => btn.classList.toggle("active", btn.dataset.view === name));
  window.scrollTo({ top: 0, behavior: "smooth" });
  if (name === "leaderboard") renderLeaderboard();
  if (name === "dsa") renderDsaDemos();
}
function notify(message) {
  const toast = $("toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}
function startQuiz() {
  currentIndex = 0;
  answers = Array(questions.length).fill(null);
  navigationHistory.clear();
  deliveryQueue = new Queue();
  // Enqueue every question index; dequeue as the quiz delivers each question.
  questions.forEach((_, index) => deliveryQueue.enqueue(index));
  deliveryQueue.dequeue();
  renderQuestion();
  showView("quiz");
}
function renderQuestion() {
  const q = questions[currentIndex];
  $("questionLabel").textContent = `Question ${currentIndex + 1} of ${questions.length}`;
  $("questionNumber").textContent = `QUESTION ${String(currentIndex + 1).padStart(2, "0")}`;
  $("questionText").textContent = q.question;
  $("progressPercent").textContent = `${Math.round(((currentIndex + 1) / questions.length) * 100)}%`;
  $("progressBar").style.width = `${((currentIndex + 1) / questions.length) * 100}%`;
  $("optionsList").innerHTML = "";
  q.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.className = `option ${answers[currentIndex] === index ? "selected" : ""}`;
    button.type = "button";
    button.innerHTML = `<span class="option-letter">${String.fromCharCode(65 + index)}</span><span class="option-text"></span>`;
    button.querySelector(".option-text").textContent = option;
    button.addEventListener("click", () => {
      answers[currentIndex] = index;
      renderQuestion();
    });
    $("optionsList").appendChild(button);
  });
  $("prevBtn").disabled = currentIndex === 0;
  $("prevBtn").style.opacity = currentIndex === 0 ? ".45" : "1";
  $("nextBtn").classList.toggle("hidden", currentIndex === questions.length - 1);
  $("submitBtn").classList.toggle("hidden", currentIndex !== questions.length - 1);
  renderQuestionMap();
}
function renderQuestionMap() {
  $("questionMap").innerHTML = "";
  questions.forEach((_, index) => {
    const button = document.createElement("button");
    button.className = `map-item ${index === currentIndex ? "current" : ""} ${answers[index] !== null ? "answered" : ""}`;
    button.textContent = index + 1;
    button.title = `Go to question ${index + 1}`;
    button.addEventListener("click", () => goToQuestion(index));
    $("questionMap").appendChild(button);
  });
}
function goToQuestion(target) {
  if (target === currentIndex) return;
  navigationHistory.push(currentIndex);
  currentIndex = target;
  // Remove questions from the delivery queue until this target has been delivered.
  while (!deliveryQueue.isEmpty() && deliveryQueue.items[0] !== target) deliveryQueue.dequeue();
  if (!deliveryQueue.isEmpty()) deliveryQueue.dequeue();
  renderQuestion();
}
function nextQuestion() {
  if (currentIndex >= questions.length - 1) return;
  navigationHistory.push(currentIndex);
  currentIndex++;
  if (!deliveryQueue.isEmpty() && deliveryQueue.items[0] === currentIndex) deliveryQueue.dequeue();
  renderQuestion();
}
function previousQuestion() {
  if (currentIndex === 0) return;
  const previous = navigationHistory.pop();
  currentIndex = previous !== null ? previous : currentIndex - 1;
  renderQuestion();
}
function submitQuiz() {
  const unanswered = answers.filter(answer => answer === null).length;
  if (unanswered > 0 && !confirm(`You have ${unanswered} unanswered question(s). Submit anyway?`)) return;
  const correct = answers.reduce((total, answer, index) => total + (answer === questions[index].answer ? 1 : 0), 0);
  const wrong = questions.length - correct;
  lastResult = { correct, wrong, answers: [...answers] };
  showResult(lastResult);
}
function showResult(result) {
  const percent = Math.round((result.correct / questions.length) * 100);
  $("scoreValue").textContent = `${result.correct}/${questions.length}`;
  $("correctCount").textContent = result.correct;
  $("wrongCount").textContent = result.wrong;
  $("percentValue").textContent = `${percent}%`;
  $("scoreRing").style.background = `conic-gradient(var(--blue) ${percent * 3.6}deg, #eaf0fa 0deg)`;
  $("resultIcon").textContent = percent >= 80 ? "🏆" : percent >= 50 ? "🎯" : "💪";
  $("resultTitle").textContent = percent >= 80 ? "Excellent work!" : percent >= 50 ? "Good effort!" : "Keep practising!";
  $("resultMessage").textContent = `You answered ${result.correct} out of ${questions.length} questions correctly.`;
  $("answerReview").innerHTML = "";
  questions.forEach((question, index) => {
    const isCorrect = result.answers[index] === question.answer;
    const yourAnswer = result.answers[index] === null ? "Not answered" : question.options[result.answers[index]];
    const item = document.createElement("div");
    item.className = `review-item ${isCorrect ? "correct" : "wrong"}`;
    const title = document.createElement("strong");
    title.textContent = `${index + 1}. ${question.question}`;
    const detail = document.createElement("p");
    detail.textContent = `Your answer: ${yourAnswer} · Correct answer: ${question.options[question.answer]}`;
    item.append(title, detail);
    $("answerReview").appendChild(item);
  });
  const name = prompt("Enter your name for the leaderboard:", "Student");
  if (name !== null && name.trim()) {
    const scores = getScores();
    scores.push({ name: name.trim().slice(0, 24), score: result.correct, total: questions.length, date: new Date().toISOString() });
    localStorage.setItem("quizLabScores", JSON.stringify(scores));
    notify("Your score has been saved to this browser.");
  } else {
    notify("Quiz completed. Your result is shown below.");
  }
  showView("result");
}
function getScores() {
  try {
    const stored = JSON.parse(localStorage.getItem("quizLabScores") || "[]");
    return Array.isArray(stored) ? stored.filter(s => s && typeof s.score === "number" && typeof s.name === "string") : [];
  } catch { return []; }
}
function renderLeaderboard() {
  const method = $("sortMethod").value;
  const scores = getScores();
  const sorted = method === "bubble" ? bubbleSortDescending(scores) : mergeSortDescending(scores);
  $("leaderboardList").innerHTML = "";
  $("sortNote").textContent = `Sorted by score using ${method === "bubble" ? "Bubble Sort" : "Merge Sort"} (descending).`;
  if (!sorted.length) {
    $("leaderboardList").innerHTML = '<div class="empty-leaderboard"><b>🏁</b>No scores yet. Complete a quiz to be the first on the board!</div>';
    return;
  }
  sorted.forEach((entry, index) => {
    const row = document.createElement("div");
    row.className = "leader-row";
    const rank = document.createElement("div"); rank.className = "rank"; rank.textContent = index + 1;
    const person = document.createElement("div");
    const name = document.createElement("div"); name.className = "leader-name"; name.textContent = entry.name;
    const date = document.createElement("div"); date.className = "leader-date"; date.textContent = new Date(entry.date).toLocaleDateString();
    person.append(name, date);
    const score = document.createElement("div"); score.className = "leader-score"; score.textContent = `${entry.score}/${entry.total || questions.length}`;
    const percent = document.createElement("div"); percent.className = "leader-percent"; percent.textContent = `${Math.round(entry.score / (entry.total || questions.length) * 100)}%`;
    row.append(rank, person, score, percent); $("leaderboardList").appendChild(row);
  });
}
function renderDsaDemos() {
  $("arrayDemo").innerHTML = "";
  questions.slice(0, 5).forEach((_, index) => {
    const cell = document.createElement("div"); cell.className = "array-cell";
    cell.innerHTML = `<span>Q${index + 1}</span><small>[${index}]</small>`;
    $("arrayDemo").appendChild(cell);
  });
  renderStackDemo(); renderQueueDemo(); renderSortDemo();
}
function renderStackDemo() {
  const stack = $("stackDemo"); stack.innerHTML = "";
  if (navigationHistory.isEmpty()) { stack.innerHTML = '<span class="empty-state">No navigation yet</span>'; return; }
  navigationHistory.items.forEach(value => {
    const block = document.createElement("div"); block.className = "stack-block"; block.textContent = `Question ${value + 1}`; stack.appendChild(block);
  });
}
function renderQueueDemo() {
  const queueEl = $("queueDemo"); queueEl.innerHTML = "";
  if (deliveryQueue.isEmpty()) { queueEl.innerHTML = '<span class="empty-state">Queue is empty</span>'; return; }
  deliveryQueue.items.slice(0, 7).forEach((value, index, visible) => {
    const cell = document.createElement("div");
    cell.className = `queue-cell ${index === 0 ? "front" : ""} ${index === visible.length - 1 ? "rear" : ""}`;
    cell.innerHTML = `<span>Q${value + 1}</span><small>${index === 0 ? "FRONT" : index === visible.length - 1 ? "REAR" : " "}</small>`;
    queueEl.appendChild(cell);
  });
}
const demoScores = [{score:42},{score:15},{score:67},{score:28},{score:51},{score:9}];
function renderScorePills(elementId, values, sorted=false) {
  $(elementId).innerHTML = "";
  values.forEach(item => { const pill = document.createElement("span"); pill.className = `score-pill ${sorted ? "sorted" : ""}`; pill.textContent = item.score; $(elementId).appendChild(pill); });
}
function renderSortDemo() {
  renderScorePills("unsortedScores", demoScores);
  renderScorePills("sortedScores", []);
  $("sortFeedback").textContent = "Choose an algorithm to sort the sample scores.";
}
function runSortDemo(method) {
  const result = method === "bubble" ? bubbleSortDescending(demoScores) : mergeSortDescending(demoScores);
  renderScorePills("unsortedScores", demoScores);
  renderScorePills("sortedScores", result, true);
  $("sortFeedback").textContent = `${method === "bubble" ? "Bubble Sort" : "Merge Sort"} complete: scores are now in descending order.`;
}

// -------------------- EVENT LISTENERS --------------------
document.querySelectorAll("[data-view]").forEach(button => button.addEventListener("click", () => showView(button.dataset.view)));
$("startBtn").addEventListener("click", startQuiz);
$("nextBtn").addEventListener("click", nextQuestion);
$("prevBtn").addEventListener("click", previousQuestion);
$("submitBtn").addEventListener("click", submitQuiz);
$("retryBtn").addEventListener("click", startQuiz);
$("exitQuizBtn").addEventListener("click", () => {
  if (confirm("Exit this quiz? Your current answers will not be saved.")) showView("home");
});
$("sortMethod").addEventListener("change", renderLeaderboard);
$("clearScoresBtn").addEventListener("click", () => {
  if (confirm("Clear all leaderboard scores saved in this browser?")) {
    localStorage.removeItem("quizLabScores"); renderLeaderboard(); notify("Leaderboard scores cleared.");
  }
});
$("stackPushBtn").addEventListener("click", () => {
  navigationHistory.push(2); renderStackDemo(); notify("Pushed Question 3 onto the stack.");
});
$("stackPopBtn").addEventListener("click", () => {
  const value = navigationHistory.pop(); renderStackDemo();
  notify(value === null ? "Stack is empty." : `Popped Question ${value + 1} from the stack.`);
});
$("enqueueBtn").addEventListener("click", () => {
  deliveryQueue.enqueue(5); renderQueueDemo(); notify("Enqueued Question 6 at the rear.");
});
$("dequeueBtn").addEventListener("click", () => {
  const value = deliveryQueue.dequeue(); renderQueueDemo();
  notify(value === null ? "Queue is empty." : `Dequeued Question ${value + 1} from the front.`);
});
$("bubbleDemoBtn").addEventListener("click", () => runSortDemo("bubble"));
$("mergeDemoBtn").addEventListener("click", () => runSortDemo("merge"));

// Initial screen and DSA demo content.
showView("home");
renderDsaDemos();

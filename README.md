# QuizLab — Online Quiz System

A beginner-friendly college DSA project made using **HTML, CSS and Vanilla JavaScript**. It runs entirely in the browser and stores leaderboard scores in `localStorage`.

## Features

- Home page and Start Quiz button
- 10 multiple-choice DSA questions with four options each
- Next, Previous and question-map navigation
- Question counter and progress bar
- Submit confirmation when questions are unanswered
- Result summary with score, correct/wrong count and answer review
- Local leaderboard with Bubble Sort or Merge Sort ordering
- DSA Lab with working Array, Stack, Queue and sorting demonstrations
- Responsive blue-and-white layout

## Project files

```text
online-quiz-system/
├── index.html
├── style.css
├── script.js
└── README.md
```

## Run with VS Code Live Server

1. Install **Visual Studio Code**.
2. Create a folder named `online-quiz-system`.
3. Inside it, create the four files shown above.
4. Copy the matching code into each file and save.
5. In VS Code, open **File → Open Folder** and select `online-quiz-system`.
6. Install the **Live Server** extension if it is not already installed.
7. Right-click `index.html` and choose **Open with Live Server**.
8. Your browser should open the website (usually at a local address such as `http://127.0.0.1:5500`).

You can also open `index.html` directly in a browser, but Live Server is more convenient while editing.

## DSA concepts used

### 1. Array — question bank

The `questions` array stores each question as an object with its text, four options and the correct option index. The quiz reads questions by their array index.

### 2. Stack — navigation history

A custom `Stack` class uses an array internally and provides `push()` and `pop()`. When navigating to another question, the current question index is pushed. The Previous button pops the most recent index, demonstrating **LIFO (Last In, First Out)**.

### 3. Queue — question delivery

A custom `Queue` class provides `enqueue()` and `dequeue()`. The question indexes are added to the rear and removed from the front as questions are delivered, demonstrating **FIFO (First In, First Out)**. The DSA Lab lets you enqueue and dequeue sample questions.

### 4. Bubble Sort — leaderboard

`bubbleSortDescending()` compares adjacent score records and swaps them when the left score is lower. The final order is highest score to lowest score.

### 5. Merge Sort — leaderboard

`mergeSortDescending()` recursively divides the score list into halves and merges the halves in descending order. The leaderboard dropdown lets you switch between the two manually implemented algorithms.

## Local storage

Leaderboard entries are saved under the browser key `quizLabScores`. They remain available in the same browser on the same device. Clearing browser site data or using another browser/device may remove or hide these results. There is no server, shared database or cross-device leaderboard.

## Notes

- This is a front-end demonstration project. Scores are stored locally and are not verified by a server.
- The leaderboard stores the name entered after a quiz, score, total questions and date.
- To add or edit quiz questions, update the `questions` array near the top of `script.js`. The `answer` value is a zero-based option index: `0` = A, `1` = B, `2` = C, `3` = D.

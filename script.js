function startGame() {
  var ageConfirmation = document.getElementById("confirmation");
  var content = document.getElementById("content");

  ageConfirmation.classList.add("hidden");
  content.classList.remove("hidden");
}

window.addEventListener("load", function () {
  var ageConfirmation = document.getElementById("confirmation");

  ageConfirmation.classList.remove("hidden");
});

const startButton = document.querySelector(".start-game-button");
const quizContainer = document.querySelector(".quiz-container-hidden");
const wrapper = document.querySelector(".wrapper");

wrapper.style.display = "none"; // hide the wrapper initially

startButton.addEventListener("click", function () {
  quizContainer.classList.remove("quiz-container-hidden");
  wrapper.style.display = "none";
});

document.querySelector(".wrapper").style.display = "block";
const _question = document.getElementById("question");
const _options = document.querySelector(".quiz-options");
const _checkBtn = document.getElementById("check-answer");
const _playAgainBtn = document.getElementById("play-again");
const _result = document.getElementById("result");
const _correctScore = document.getElementById("correct-score");
const _totalQuestion = document.getElementById("total-question");

let correctAnswer = "",
  correctScore = 0,
  askedCount = 0,
  totalQuestion = 5;

// load question from API
let previousIndex = -1;

async function loadQuestion() {
  const APIUrl = "https://qaeyxl.github.io/Quiz-Game/my_questions.json";
  const result = await fetch(APIUrl);
  const data = await result.json();
  _result.innerHTML = "";
  let randomIndex;
  do {
    randomIndex = Math.floor(Math.random() * data.questions.length);
  } while (randomIndex == previousIndex);
  previousIndex = randomIndex;
  showQuestion(data.questions[randomIndex]);
}

fetch("questions.json")
  .then((response) => response.json())
  .then((data) => {
    const questions = data.questions;
    let currentQuestionIndex = 0;
    const quizOptions = document.querySelector(".quiz-options");
    const quizScore = document.getElementById("correct-score");
    const quizTotalQuestion = document.getElementById("total-question");
    const checkAnswerButton = document.getElementById("check-answer");
    const playAgainButton = document.getElementById("play-again");

    function loadQuestion() {
      const currentQuestion = questions[currentQuestionIndex];
      _question.textContent = currentQuestion.question;
      quizOptions.innerHTML = "";
      for (const option of currentQuestion.options) {
        const li = document.createElement("li");
        const button = document.createElement("button");
        button.textContent = option;
        li.appendChild(button);
        quizOptions.appendChild(li);
      }
    }

    function startQuiz() {
      loadQuestion();
      checkAnswerButton.addEventListener("click", checkAnswer);
      playAgainButton.addEventListener("click", playAgain);
    }

    function checkAnswer() {
      const selectedOption = quizOptions.querySelector("li.active button");
      if (!selectedOption) {
        return;
      }
      const currentQuestion = questions[currentQuestionIndex];
      const answer = currentQuestion.answer;
      const isCorrect = selectedOption.textContent === answer;
      if (isCorrect) {
        correctScore++;
      }
      askedCount++;
      _result.innerHTML = isCorrect
        ? `<p><i class="fas fa-check"></i>Correct Answer!</p>`
        : `<p><i class="fas fa-times"></i>Incorrect Answer!</p><small><b>Correct Answer: </b>${answer}</small>`;
      currentQuestionIndex++;
      if (currentQuestionIndex === questions.length) {
        endQuiz();
      } else {
        loadQuestion();
      }
    }

    function playAgain() {
      currentQuestionIndex = 0;
      correctScore = 0;
      askedCount = 0;
      _result.innerHTML = "";
      startQuiz();
    }

    function endQuiz() {
      const percentCorrect = ((correctScore / askedCount) * 100).toFixed(2);
      _question.textContent = `Quiz Over! You scored ${percentCorrect}%`;
      quizOptions.innerHTML = "";
      checkAnswerButton.removeEventListener("click", checkAnswer);
      playAgainButton.removeEventListener("click", playAgain);
    }

    quizTotalQuestion.textContent = questions.length;
    startQuiz();
  })
  .catch((error) => {
    console.error(error);
  });

// event listeners
function eventListeners() {
  _checkBtn.addEventListener("click", checkAnswer);
  _playAgainBtn.addEventListener("click", restartQuiz);
}

document.addEventListener("DOMContentLoaded", function () {
  loadQuestion();
  eventListeners();
  _totalQuestion.textContent = totalQuestion;
  _correctScore.textContent = correctScore;
});

// display question and options
function showQuestion(data) {
  _checkBtn.disabled = false;
  correctAnswer = data.answer;
  let optionsList = data.options.slice();
  _question.innerHTML = `${data.question}`;
  _options.innerHTML = `
        ${optionsList
          .map(
            (option, index) => `
            <li> ${index + 1}. <span>${option}</span> </li>
        `
          )
          .join("")}
    `;
  selectOption();
}

// options selection
function selectOption() {
  _options.querySelectorAll("li").forEach(function (option) {
    option.addEventListener("click", function () {
      if (_options.querySelector(".selected")) {
        const activeOption = _options.querySelector(".selected");
        activeOption.classList.remove("selected");
      }
      option.classList.add("selected");
    });
  });
}

// answer checking
function checkAnswer() {
  _checkBtn.disabled = true;
  if (_options.querySelector(".selected")) {
    let selectedAnswer = _options.querySelector(".selected span").textContent;
    if (selectedAnswer == HTMLDecode(correctAnswer)) {
      correctScore++;
      askedCount++;
      _result.innerHTML = `<p><i class = "fas fa-check"></i>Correct Answer!</p>`;
    } else {
      askedCount++;
      _result.innerHTML = `<p><i class = "fas fa-times"></i>Incorrect Answer!</p> <small><b>Correct Answer: </b>${correctAnswer}</small>`;
    }
    checkCount();
  } else {
    _result.innerHTML = `<p><i class = "fas fa-question"></i>Please select an option!</p>`;
    _checkBtn.disabled = false;
  }
}

// to convert html entities into normal text of correct answer if there is any
function HTMLDecode(textString) {
  let doc = new DOMParser().parseFromString(textString, "text/html");
  return doc.documentElement.textContent;
}

function checkCount() {
  setCount();
  if (askedCount == totalQuestion) {
    _result.innerHTML += `<p>Your score is ${correctScore}.</p>`;
    _playAgainBtn.style.display = "block";
    _checkBtn.style.display = "none";
  } else {
    setTimeout(function () {
      loadQuestion();
    }, 300);
  }
}

function setCount() {
  _totalQuestion.textContent = totalQuestion;
  _correctScore.textContent = correctScore;
}

function restartQuiz() {
  correctScore = 0;
  askedCount = 0;
  _playAgainBtn.style.display = "none";
  _checkBtn.style.display = "block";
  _checkBtn.disabled = false;
  setCount();
  loadQuestion();
}

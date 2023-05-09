const _question = document.getElementById('question');
const _options = document.querySelector('.quiz-options');
const _checkBtn = document.getElementById('check-answer');
const _playAgainBtn = document.getElementById('play-again');
const _result = document.getElementById('result');
const _correctScore = document.getElementById('correct-score');
const _totalQuestion = document.getElementById('total-question');

let correctAnswer = "", correctScore = askedCount = 0, totalQuestion = 5;

// load question from API
let previousIndex = -1;

async function loadQuestion(){
    const APIUrl = 'https://raw.githubusercontent.com/QaeyxL/Quiz-Game/main/my_questions.json';
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


// event listeners
function eventListeners(){
    _checkBtn.addEventListener('click', checkAnswer);
    _playAgainBtn.addEventListener('click', restartQuiz);
}

document.addEventListener('DOMContentLoaded', function(){
    loadQuestion();
    eventListeners();
    _totalQuestion.textContent = totalQuestion;
    _correctScore.textContent = correctScore;
});


// display question and options
function showQuestion(data){
    _checkBtn.disabled = false;
    correctAnswer = data.answer;
    let optionsList = data.options.slice();
    optionsList.splice(Math.floor(Math.random() * optionsList.length), 0, correctAnswer);    
    _question.innerHTML = `${data.question}`;
    _options.innerHTML = `
        ${optionsList.map((option, index) => `
            <li> ${index + 1}. <span>${option}</span> </li>
        `).join('')}
    `;
    selectOption();
}

// options selection
function selectOption(){
    _options.querySelectorAll('li').forEach(function(option){
        option.addEventListener('click', function(){
            if(_options.querySelector('.selected')){
                const activeOption = _options.querySelector('.selected');
                activeOption.classList.remove('selected');
            }
            option.classList.add('selected');
        });
    });

    // Remove any existing duplicate of the correct answer
    const correctOption = _options.querySelector(`li span:nth-of-type(1):not(:contains("${correctAnswer}"))`);
    if (correctOption) {
        correctOption.parentNode.remove();
    }
    
    // Add the correct answer if it does not exist in the options list
    const options = _options.querySelectorAll('li');
    const correctOptionExists = Array.from(options).some(option => option.querySelector('span').textContent === correctAnswer);
    if (!correctOptionExists) {
        const randomIndex = Math.floor(Math.random() * options.length);
        const newOption = document.createElement('li');
        newOption.innerHTML = `${options.length}. <span>${correctAnswer}</span>`;
        options[randomIndex].before(newOption);
    }
}


// answer checking
function checkAnswer(){
    _checkBtn.disabled = true;
    if(_options.querySelector('.selected')){
        let selectedAnswer = _options.querySelector('.selected span').textContent;
        if(selectedAnswer == HTMLDecode(correctAnswer)){
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


function checkCount(){
    setCount();
    askedCount++;
    if(askedCount == totalQuestion){
        if(_options.querySelector('.selected')){
            let selectedAnswer = _options.querySelector('.selected span').textContent;
            if(selectedAnswer == HTMLDecode(correctAnswer)){
                correctScore++;
            }
        }

        _result.innerHTML += `<p>Your score is ${correctScore}.</p>`;
        _playAgainBtn.style.display = "block";
        _checkBtn.style.display = "none";
    } else {
        if(_options.querySelector('.selected')){
            let selectedAnswer = _options.querySelector('.selected span').textContent;
            if(selectedAnswer == HTMLDecode(correctAnswer)){
                correctScore++;
            }
        }

        setTimeout(function(){
            loadQuestion();
        }, 300);
    }
}

function setCount(){
    _totalQuestion.textContent = totalQuestion;
    _correctScore.textContent = correctScore;
}

function restartQuiz(){
    correctScore = askedCount = 0;
    _playAgainBtn.style.display = "none";
    _checkBtn.style.display = "block";
    _checkBtn.disabled = false;
    setCount();
    loadQuestion();
}
const startButton = document.getElementById('start-btn');
const nextButton = document.getElementById('next-btn');
const questionContainerElement = document.getElementById('question-container');
const questionElement = document.getElementById('question');
const answerButtonsElement = document.getElementById('answer-buttons');
const currentQuestionElement = document.getElementById('current-question');
const questionsAmountElement = document.getElementById('questions-amount');

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const questionsAmount = urlParams.has('amount') ? urlParams.get('amount') : 20
const startIndex = urlParams.has('start') ? urlParams.get('start') : 1
const lastIndex  = urlParams.has('end') ? urlParams.get('end') : 400


let questions = []
let currentQuestionIndex = 0
let result = 0

const getRandomQuestions = (amount, start, end) => {
    fetch(`http://127.0.0.1:8000/quiz/FMF_MEVm/random/${amount}/${start}/${end}`)
        .then((data) => data.json())
        .then((data) => {
            questions = data
            console.log(data)
        })
};


startButton.addEventListener('click', startQuiz);
nextButton.addEventListener('click', () => {
    currentQuestionIndex++
    setNextQuestion()
})


function startQuiz() {
    getRandomQuestions(questionsAmount, startIndex, lastIndex)
    result = 0
    currentQuestionIndex = 0
    currentQuestionElement.innerText = '1'
    questionsAmountElement.innerText = questionsAmount
    startButton.classList.add('hide');
    questionContainerElement.classList.remove('hide');
    setNextQuestion()
}

function setNextQuestion() {
    currentQuestionElement.innerText = currentQuestionIndex + 1
    resetState()
    showQuestion(questions[currentQuestionIndex])
}

function showQuestion(question) {
    if (question) {
        questionElement.innerText = question.question_text
        question.answer.sort(() => Math.random() - 0.5).forEach(answer => {
            const button = document.createElement('button')
            button.innerText = answer.answer_text
            button.classList.add('btn')
            if (answer.is_right) {
                button.dataset.correct = answer.is_right
            }
            button.addEventListener('click', selectAnswer)
            answerButtonsElement.appendChild(button)
        })
    }
}

function resetState() {
    clearStatusClass(document.body)
    answerButtonsElement.classList.remove('disabled');
    nextButton.classList.add('hide')
    while (answerButtonsElement.firstChild) {
        answerButtonsElement.removeChild(answerButtonsElement.firstChild)
    }
}

function selectAnswer(e) {
    const selectedButton = e.target
    const correct = selectedButton.dataset.correct
    answerButtonsElement.classList.add('disabled');
    setStatusClass(selectedButton, correct)
    if (correct) {
        result++
    } else {
        Array.from(answerButtonsElement.children).forEach(button => {
            if (button.dataset.correct) {
                setStatusClass(button, button.dataset.correct)
            }
        })
    }
    if (questions.length > currentQuestionIndex + 1) {
        nextButton.classList.remove('hide')
    } else {
        alert(`Your result: ${result}/${questionsAmount}`)
        startButton.innerText = 'Restart'
        startButton.classList.remove('hide')
    }
}

function setStatusClass(element, correct) {
    clearStatusClass(element)
    if (correct) {
        element.classList.add('correct')
    } else {
        element.classList.add('wrong')
    }
}


function clearStatusClass(element) {
    element.classList.remove('correct')
    element.classList.remove('wrong')
}

getRandomQuestions(1, 1, 1)

const API_URL = 'https://da-demo.github.io/api/futurama/questions/';
const quizContainer = document.querySelector('.quiz-container');
const messageContainer = document.querySelector('.messageContainer');
const correctSpan = document.getElementById('correct');
const incorrectSpan = document.getElementById('incorrect');
const answeredSpan = document.getElementById('answered');
const roundStatisticsContainer = document.querySelector('.roundStatisticsContainer');

let questions = [];
let usedQuestions = new Set(); // För att spåra vilka frågor som redan har visats
let currentQuestion = null;
let correctAnswers = 0;
let incorrectAnswers = 0;
let answeredQuestions = 0;
let roundCounter = 1; // Räknare för att hålla reda på rundorna

function fetchQuestions() {
    fetch(API_URL)
        .then(response => response.json())
        .then(data => {
            questions = data;
            shuffleQuestions();
            renderQuestion();
        })
        .catch(error => console.error('Error fetching questions:', error));
}

function renderQuestion() {
    if (questions.length === 0) {
        // Om det inte finns fler frågor avslutas quizzen
        alert('Quiz finished! You have answered all available questions.');
        return;
    }
    currentQuestion = getRandomQuestion();
    quizContainer.innerHTML = `
        <div class="col">
            <h3 class="text-center">${currentQuestion.question}</h3>
            <ul class="list-group">
                ${currentQuestion.possibleAnswers.map((option, index) => `
                    <li class="list-group-item">
                        <input class="form-check-input form-check-input-lg custom-radio" type="radio" name="option" id="option${index}" value="${option}">
                        <label for="option${index}" class="fs-4">${option}</label>
                    </li>
                `).join('')}
            </ul>
            <button class="btn btn-primary mt-3" onclick="checkAnswer()">Submit</button>
        </div>
    `;
}

function getRandomQuestion() {
    let randomIndex = Math.floor(Math.random() * questions.length);
    while (usedQuestions.has(questions[randomIndex])) {
        randomIndex = Math.floor(Math.random() * questions.length);
    }
    const selectedQuestion = questions[randomIndex];
    usedQuestions.add(selectedQuestion);
    return selectedQuestion;
}

function checkAnswer() {
    const selectedOption = document.querySelector('input[name="option"]:checked');
    if (!selectedOption) {
        showMessage('Please select an option.');
        return;
    }

    const selectedValue = selectedOption.value;

    if (selectedValue === currentQuestion.correctAnswer) {
        correctAnswers++;
        showMessage('Correct!', 'success');
    } else {
        incorrectAnswers++;
        showMessage('Incorrect!', 'danger');
    }

    answeredQuestions++;
    updateStatistics();
    nextQuestion();
}

function nextQuestion() {
    if (answeredQuestions < 10 && usedQuestions.size < questions.length) {
        renderQuestion();
    } else {
        // End of quiz
        displayStatistics();
    }
}

function updateStatistics() {
    correctSpan.textContent = correctAnswers;
    incorrectSpan.textContent = incorrectAnswers;
    answeredSpan.textContent = answeredQuestions;

    // Save statistics for the current round in localStorage
    const roundStatisticsKey = `statistics_round_${roundCounter}`;
    localStorage.setItem(roundStatisticsKey, JSON.stringify({ correct: correctAnswers, incorrect: incorrectAnswers, answered: answeredQuestions }));
}

function showMessage(message, messageType = 'info') {
    messageContainer.innerHTML = `<div class="alert alert-${messageType}" role="alert">${message}</div>`;
}

function shuffleQuestions() {
    for (let i = questions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [questions[i], questions[j]] = [questions[j], questions[i]];
    }
}

function displayStatistics() {
    // Clear the quiz container
    quizContainer.innerHTML = '';

    // Calculate percentage of correct answers
    const totalQuestions = 10;
    const percentage = (correctAnswers / totalQuestions) * 100;

    // Display statistics
    quizContainer.innerHTML = `
        <div class="col">
            <h3 class="text-center">Quiz Statistics</h3>
            <p class="text-center fs-5">You answered ${correctAnswers} out of ${totalQuestions} questions correctly.</p>
            <p class="text-center fs-5">Percentage of correct answers: ${percentage.toFixed(2)}%</p>
            <button class="btn btn-primary mt-3" onclick="restartQuiz()">Try Again</button>
        </div>
    `;
}

function restartQuiz() {
    // Reset variables
    currentQuestion = null;
    correctAnswers = 0;
    incorrectAnswers = 0;
    answeredQuestions = 0;

    // Clear used questions
    usedQuestions.clear();

    // Increment round counter for the next round
    roundCounter++;

    // Save statistics for the current round
    updateStatistics();

    // Display statistics for previous rounds
    displayRoundStatistics();

    // Fetch questions and render the first question
    fetchQuestions();
}

function displayRoundStatistics() {
    // Clear previous round statistics
    roundStatisticsContainer.innerHTML = '';

    // Iterate through localStorage and display statistics for each round
    for (let i = 1; i < roundCounter; i++) {
        const roundStatisticsKey = `statistics_round_${i}`;
        const roundStatistics = JSON.parse(localStorage.getItem(roundStatisticsKey));
        if (roundStatistics) {
            const newDiv = document.createElement('div');
            newDiv.classList.add('row', 'border');
            newDiv.innerHTML = `
                <div class="col">
                    <p class="fs-4">Round ${i}:</p>
                    <p class="fs-4">Correct: ${roundStatistics.correct}</p>
                    <p class="fs-4">Incorrect: ${roundStatistics.incorrect}</p>
                    <p class="fs-4">Answered: ${roundStatistics.answered}</p>
                </div>
            `;
            roundStatisticsContainer.appendChild(newDiv);
        }
    }
}

fetchQuestions();
displayRoundStatistics();

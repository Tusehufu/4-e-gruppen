let correctAnswerCount = 0;
let wrongAnswerCount = 0;
let totalQuestionsCount = 0;

// Aariable to store the fetched questions
let questions = [];

// Fetch questions function when the page loads
/*Ändra fetchQuestions() till namn som Kristian valt till funktionen som hämtar frågorna från API*/
document.addEventListener('DOMContentLoaded', async () => {
 questions = await fetchQuestions();
 displayQuestions(questions); //Ändra denna funktionen till rätt namn?
});

// When the user clicks on the answer button:
/*Vad kommer answer-btn riktiga namn*/
document.addEventListener("click", (event) => {
  if (event.target.classList.contains("answer-btn")) {
   

    /*these lines of code are used to extract the answer text and the question
     index from the clicked answer button, checking if the users
     answer is correct and updates the counters*/
    const answer = event.target.dataset.answer;
    const index = event.target.dataset.index;

     // Use the stored questions variable to get the correct answer
    const correctAnswer = questions[index].correctAnswer;

    if (answer === correctAnswer) {
        correctAnswerCount++;
        alert("Rätt svar");
    } else {
        wrongAnswerCount++;
        alert("Fel svar");
    }
    totalQuestionsCount++;

    updateCounters();

    // Show the 'Next' button
    nextButton.classList.remove('hide');
  }
});

//Updating the counters
function updateCounters() {
  document.getElementById("correct").textContent = correctAnswerCount;
  document.getElementById("incorrect").textContent = wrongAnswerCount;
  document.getElementById("answered").textContent = totalQuestionsCount;
}

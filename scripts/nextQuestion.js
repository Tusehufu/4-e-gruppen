const nextButton = document.getElementById('next-btn');
let currentQuestion = 0; //Counter for the questions.

// Initially hide the 'Next' button, since the user has not answered a question yet
nextButton.classList.add('hide');

function showNextQuestion() {
    // Clear the quiz interface
    resetInterface();
    // Check if there are more questions
    if (currentQuestionIndex < questions.length) {
       // Show the next question
       showNextQuestion(questions[currentQuestion]);
    } else {
       
       alert("Quiz finished!");
    }
   }
   
   function resetInterface() {

    // Hide the 'Next' button
    nextButton.classList.add('hide');
    
   }
   
   function showQuestion(question) {
   //Funktionen som visar frågan
   }
   
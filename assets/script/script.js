//Assigning variables to HTML elements
var scoreCount = document.getElementById('scoreCountdown');
var qDisplay = document.getElementById('questionDisplay');
// var answerBox = document.getElementById('answerBox');
// var but1 = document.getElementById('btn1');
// var but2 = document.getElementById('btn2');
// var but3 = document.getElementById('btn3');
// var but4 = document.getElementById('btn4');
var hsDisplay = document.getElementById('highScoreDisplay');
var listHS = document.getElementById('listHighScores');


/*
Need an object that the program can randomly iterate through to display the property and its contents.

set an object that records all questions and and their array of possible answers --> obj = {Question 1: [Correct Answer, Wrong answer1, Wrong answer2, Wrong answer3], ...}
*/

var questAndAns = {
    'What is the purpose of CSS': ['Styling of webpages', 'Structure of webpage', 'Define the content of webpages',  'Stores data to be accessed'],

    'Question2': ['Correct Answer', 'WrongAnswer1', 'WrongAnswer2', 'WrongAnswer3'],

    'Question3': ['Correct Answer', 'WrongAnswer1', 'WrongAnswer2', 'WrongAnswer3'], 

    'Question4': ['Correct Answer', 'WrongAnswer1', 'WrongAnswer2', 'WrongAnswer3'], 

    'Question5': ['Correct Answer', 'WrongAnswer1', 'WrongAnswer2', 'WrongAnswer3'],  
}

console.log(questAndAns)

//Create an array of the property names in questAndAns.  The program will randomly select from this array to display a random question.
var currentQuestions = Object.getOwnPropertyNames(questAndAns);

//Array of strings matching button IDs.  Used to display answers randomly for function chooseAButtonShuffle(array)
var chooseAButton = ['btn1', 'btn2', 'btn3', 'btn4'];

function displayQuestion () {
    //Randomly choose an index of currentQuestions to display the appropriate question.
    var indexCQ = Math.floor(Math.random() * currentQuestions.length)
    currentQuestion = currentQuestions[indexCQ];
    var currentAns = [] //array of answers for currentQuestion
    for (i = 0; i < questAndAns[currentQuestion].length; i++) {
        //making a copy of the answers so displayAnswers doesn't pop the object property's value (an array)
        currentAns[i] = questAndAns[currentQuestion][i] 
    }
    qDisplay.textContent = currentQuestion;
    //Randomly choose a button to display an answer
    chooseAButtonShuffle(chooseAButton);
    displayAnswers(chooseAButton, currentAns);
};

//credit https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function chooseAButtonShuffle(array) { //swaps indexes around
    for (let i = array.length - 1; i > 0; i--) { // starts with max index
        var j = Math.floor(Math.random() * (i+1)); //chooses a random index
        [array[i], array[j]] = [array[j], array[i]]; //swaps those two numbers
    } //results in an array that is shuffled
};

function displayAnswers (chooseAButton, currentAns) {
    //takes array of buttons, array of answers, pops the array into each button element.
    chooseAButton.forEach(function (element) {
        button = document.getElementById(element); //assign button to  HTML element
        var buttonAnswer = currentAns.pop(); //pops currentAns array
        button.textContent = buttonAnswer; //displays popped element
    })
}

//When user clicks a button, verifies if the answer is correct or not.  Then should call another function that changes the score and another function that changes the question.
function userClickBtn (event) {
    var element = event.target;
    if (element.matches('.btn')) {
        //obtains the ID of the button that was clicked.
        var buttonID = element.getAttribute('id');
        checkAnswer(buttonID)
    } else if (element.matches('#buttonStart')) {
        startTimer();
    }
};

//The browser will compare the answer selected with the array of answers corrosponding with questAndAns property.
function checkAnswer(buttonID) {
    var questionDisplay = qDisplay.textContent;
    var pressedBtn = document.getElementById(buttonID);
    if (pressedBtn.textContent === questAndAns[questionDisplay][0]) { //checking if the string of the answer matches with obj.property[0].  Correct answer is always indexed at 0.
        console.log('Correct!')
    } else {console.log('Incorrect')}
}

//declare timerRunning so user can't 
var timerRunning = false;
scoreCountdown = 60;

function startTimer () {
    if (timerRunning === false) {
        timerRunning = true;
        scoreCount.textContent = scoreCountdown;
        setInterval(function () {
            scoreCountdown -= 1;
            scoreCount.textContent = scoreCountdown;
        }, 1000)
    }



}

/* Add event listener to displaybox and execute a function when the user toggles the appropriate box */
document.addEventListener('click', userClickBtn);

// displayQuestion()
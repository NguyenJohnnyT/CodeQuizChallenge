//Assigning variables to HTML elements
var scoreCount = document.getElementById('scoreCountdown');
var questCount = document.getElementById('questionCountdown')
var qDisplay = document.getElementById('questionDisplay');
var startBtn = document.getElementById('buttonStart')
// var answerBox = document.getElementById('answerBox');
var but1 = document.getElementById('btn1');
var but2 = document.getElementById('btn2');
var but3 = document.getElementById('btn3');
var but4 = document.getElementById('btn4');
var hsDisplay = document.getElementById('highScoreDisplay');
var listHS = document.getElementById('listHighScores');

//declare timerRunning so user can't click start multiple times.
scoreCountdown = 60; //time left shown on webpage.
questionsAsked = 5 //how many questions the user will be asked

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

function startGame () {
    questCount.textContent = questionsAsked
    scoreCountdown = 60;
    questionsAsked = 5;
    btn1.disabled = false;
    btn2.disabled = false;
    btn3.disabled = false;
    btn4.disabled = false;
    startTimer();
    if (questionsAsked > 0){
        displayQuestion()
    };
}

/**
 * Show the user a question.
 * Functions:displayQuestion, chooseAButtonShuffle, displayAnswers
 */

function displayQuestion () {
    //Randomly choose an index of currentQuestions to display the appropriate question.
    var indexCQ = Math.floor(Math.random() * currentQuestions.length)
    currentQuestion = currentQuestions.splice(indexCQ, 1);
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
/** Button click events.
 * Functions: userClickBtn
 */
function userClickBtn (event) {
    //When user clicks a button, verifies if the answer is correct or not. Then should call another function that changes the score and another function that changes the question.
    var element = event.target;
    if (element.matches('.btn')) {
        //obtains the ID of the button that was clicked.
        var buttonID = element.getAttribute('id');
        checkAnswer(buttonID)
        if (startBtn.disabled === true && questionsAsked > 0) {
            displayQuestion();
        }
    } else if (element.matches('#buttonStart') && startBtn.disabled === false) {
        startBtn.disabled = true;
        startGame();
    }
};

/** 
 * checks the answer that the User selected.
 * Functions: checkAnswer
*/
//The browser will compare the answer selected with the array of answers corrosponding with questAndAns property.
function checkAnswer(buttonID) {
    var questionDisplay = qDisplay.textContent;
    var pressedBtn = document.getElementById(buttonID);
    if (pressedBtn.textContent === questAndAns[questionDisplay][0]) { 
        //checking if the string of the answer matches with obj.property[0].  Correct answer is always indexed at 0.
        console.log('Correct!')
        questionsAsked--;
        questCount.textContent = questionsAsked
    } else {
        console.log('Incorrect');
        questionsAsked--;
        questCount.textContent = questionsAsked
        scoreCountdown -= 5;
    }
}

/**
 * Display the score, 
 * functions: startTimer, checkIfZero, gameEnd
 */
var timerRunning = false; 

function startTimer () {
    //check if timer is running already
    if (timerRunning === false) {
        timerRunning = true;
        scoreCount.textContent = scoreCountdown;
        timer = setInterval(function () {
            scoreCountdown--;
            scoreCount.textContent = scoreCountdown;
            checkIfZero();
        }, 1000)
    }
}

function checkIfZero () {
    if (scoreCountdown <= 0 || questionsAsked === 0) {
        clearInterval(timer)
        gameEnd()
    }
}

function gameEnd () { //resets the board
    pageLoad()
    timerRunning = false;
    startBtn.disabled = false;
    currentQuestions = Object.getOwnPropertyNames(questAndAns);
    if (scoreCountdown <= 0) {
        user = alert('Gameover!  That was rough!  Please try again!')
    } else {
        user = prompt('Game Over! Your score is ' + scoreCountdown + '. Please enter your initials to submit into the scoreboard')
    }
}

function pageLoad () {
    qDisplay.textContent = 'Click'
    btn1.disabled = true;
    btn1.textContent = 'Start'
    btn2.disabled = true;
    btn2.textContent = 'to'
    btn3.disabled = true;
    btn3.textContent = 'Play'
    btn4.disabled = true;
    btn4.textContent = 'Game!'
}

/* Add event listener to displaybox and execute a function when the user toggles the appropriate box */
document.addEventListener('click', userClickBtn);

// displayQuestion()
pageLoad();
//Assigning variables to HTML elements
var scoreCount = document.getElementById('scoreCountdown');
var questCount = document.getElementById('questionCountdown')
var qDisplay = document.getElementById('questionDisplay');
var startBtn = document.getElementById('buttonStart');
var hsBtn = document.getElementById('buttonHS');
var clBtn = document.getElementById('clearHS');
var ansBox = document.getElementById('answerBox');
var btns = document.querySelectorAll('.btn');
var but1 = document.getElementById('btn1');
var but2 = document.getElementById('btn2');
var but3 = document.getElementById('btn3');
var but4 = document.getElementById('btn4');
var hsDisplay = document.getElementById('highScoreDisplay');
var listHS = document.getElementById('listHighScores');
var checkmark = document.getElementById('rightWrong');

//declare timerRunning so user can't click start multiple times.
var scoreCountdown = 60; //time left shown on webpage.
var questionsAsked = 5 //how many questions the user will be asked
var questionsCorrect = 0 //if user answers all questions incorrectly, no score

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

    'Question6': ['Correct Answer', 'WrongAnswer1', 'WrongAnswer2', 'WrongAnswer3'],

    'Question7': ['Correct Answer', 'WrongAnswer1', 'WrongAnswer2', 'WrongAnswer3'],

    'Question8': ['Correct Answer', 'WrongAnswer1', 'WrongAnswer2', 'WrongAnswer3'],

    'Question9': ['Correct Answer', 'WrongAnswer1', 'WrongAnswer2', 'WrongAnswer3'],

    'Question10': ['Correct Answer', 'WrongAnswer1', 'WrongAnswer2', 'WrongAnswer3']
}

console.log(questAndAns)

/**
 * Initialize high scores for local storage.
 * Functions: init, storeHS, clearHS, showHighScore, hideHighScore, renderHighScore updateHighScore
 * 
 */
//declare high scores
highScores = [];

function init() {
    pageLoad ()
    var storedHS = JSON.parse(localStorage.getItem("highScores"));
    if (storedHS !== null) { //renders local storage high scores.
        highScores = storedHS
    }
    renderHighScore()
}

function storeHS () {
    localStorage.setItem('highScores', JSON.stringify(highScores));
}

function clearHS () {
    listLi = document.querySelectorAll('li');
    for (i = listLi.length-1; i >= 0; i--) {
        listItem = listLi[i];
        listItem.remove()
    } //removes list of high scores.
    highScores = [];
    storeHS();
    updateHighScore()
}

function showHighScore () {
    if (qDisplay.style.display === "inline") {
        qDisplay.style.display = 'none';
        ansBox.style.display = 'none';
        hsDisplay.style.display='inline';
        hsBtn.textContent = 'View High Scores';
    } else {hideHighScore()}
}

function hideHighScore () {
        qDisplay.style.display = "inline";
        ansBox.style.display = "flex";
        hsDisplay.style.display='none';
        // hsBtn.textContent = 'Return';
}

function renderHighScore () {
    listLi = document.querySelectorAll('li')
    for (i = listLi.length-1; i >= 0; i--) {
        //removes items in the list
        listItem = listLi[i];
        listItem.remove()
    }

    for (i=0; i < highScores.length; i++) {
        //rebuilds the list with updated highScores
        var highScore = highScores[i]
        var li = document.createElement('li');
        li.textContent = highScore;
        listHS.appendChild(li);
    }
}

function updateHighScore (userPrompt) {
    //create ordered list based off user scores, with #1 being highest score
    if (!userPrompt) { //if user decided to not enter an initial
        showHighScore()
    }   else {
            userName = userPrompt.trim()
            scoreAdded = false;

            for (i = 0; i < highScores.length; i++) {
                //compares the userScore to each score in highScores, starting from the highest score
                scoreOne1 = highScores[i].charAt(highScores[i].length-2);
                scoreOne2 = highScores[i].charAt(highScores[i].length-1);
                topScore = ("" + scoreOne1 + scoreOne2);
                if (scoreCountdown > parseInt(topScore)) {
                    highScores.splice(i, 0, (userName + ' - ' + scoreCountdown))
                    scoreAdded = true;
                    break;
                }
            }

            if (scoreAdded === false && highScores.length < 10) {
                //adds userScore to the end of the list, if able
                newScore = [userName + ' - ' + scoreCountdown]
                console.log(newScore);
                highScores = highScores.concat(newScore);
                console.log(highScores);
                scoreAdded = true;
            }

            if (scoreAdded === false && highScores.length === 10) {
                //if list is full and score too low, alerts user
                alert("Sorry, your score is too low and the leaderboard is full!")
            }

            renderHighScore();
            storeHS()
    }
}

function startGame () {
    scoreCountdown = 60;
    questionsAsked = 5;
    questionsCorrect = 0;
    checkmark.innerHTML = '';
    checkmark.style.display = 'inline';
    document.getElementById('headerImg').style.width = '200px';
    questCount.textContent = questionsAsked;
    btns.forEach (function (btn) {
        btn.disabled = false;
    });
    hsBtn.disabled = true;
    clBtn.disabled= true;
    hideHighScore()
    startTimer();
    if (questionsAsked > 0) {
        displayQuestion()
    };
}

/**
 * Show the user a question.
 * Functions:displayQuestion, chooseAButtonShuffle, displayAnswers
 */

//Create an array of the property names from questAndAns object.  The program will randomly select from this array to display a random question.
var currentQuestions = Object.getOwnPropertyNames(questAndAns);

//Array of strings matching button IDs.  Used to display answers randomly for function chooseAButtonShuffle(array)
var chooseAButton = ['btn1', 'btn2', 'btn3', 'btn4'];

function displayQuestion () {
    //Randomly choose an index of currentQuestions to display the appropriate question.
    var indexCQ = Math.floor(Math.random() * currentQuestions.length)
    currentQuestion = currentQuestions.splice(indexCQ, 1); //removes element from curresntQuestions so no repeat questions
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

/** Give meaning to buttons clicked on page!
 * Functions: userClickBtn
 */
function userClickBtn (event) {
    //When user clicks a button, verifies if the answer is correct or not. Then should call another function that changes the score and another function that changes the question.
    var element = event.target;
    if (element.matches('.btn')) {
        //clicking one of the answer buttons.  Checks the answer
        var buttonID = element.getAttribute('id');
        checkAnswer(buttonID)
        if (startBtn.disabled === true && questionsAsked > 0) {
            displayQuestion();
        }
    } else if (element.matches('#buttonStart') && startBtn.disabled === false) {
        //clicking the start button game
        startBtn.disabled = true;
        startGame();
    } else if (element.matches('#clearHS')) {
        //clicking the clear high score button
        confirmClear = confirm('Are you sure you want to clear the high scores?')
        if (confirmClear) {
            clearHS();
        }
    } else if (element.matches('#buttonHS')) {
        //clicking the show high score button
        showHighScore()

    }
};

/** 
 * checks the answer that the User selected and update the score, questions correct, and questions Left appropriately.
 * Functions: checkAnswer
*/
function checkAnswer(buttonID) {
    //The browser will compare the answer selected with the array of answers corrosponding with questAndAns property.
    var questionDisplay = qDisplay.textContent;
    var pressedBtn = document.getElementById(buttonID);
    if (pressedBtn.textContent === questAndAns[questionDisplay][0]) { 
        //checking if the string of the answer matches with obj.property[0].  Correct answer is always indexed at 0.
        console.log('Correct!')
        checkmark.innerHTML = (checkmark.innerHTML + '✅')
        questionsAsked--;
        questionsCorrect++;
    } else {
        console.log('Incorrect');
        checkmark.innerHTML = (checkmark.innerHTML + '❌')
        scoreCountdown -= 5;
        questionsAsked--;
    }
}

/**
 * Show the user the time left.
 * functions: startTimer, checkIfZero, 
 * new variables: timerRunning
 */
var timerRunning = false; 

function startTimer () {
    //check if timer is running already
    if (timerRunning === false) {
        timerRunning = true;
        timer = setInterval(function () {
            scoreCountdown--;
        }, 1000)
        checkTimer = setInterval(function (){
            //constantly checks if the timer or questionsasked reaches 0
            //prevents user from accidentally double clicking on last question
            checkIfZero();
        },50)
    }
}

function checkIfZero () {
    questCount.textContent = questionsAsked;
    scoreCount.textContent = scoreCountdown;
    if (scoreCountdown <= 0 || questionsAsked === 0) {
        clearInterval(timer);
        clearInterval(checkTimer);
        setTimeout(gameEnd, 50) //lets the browser update the score/questions left before displaying the gameEnd prompts
    }
}

/**
 * Resets the webpage to a base template
 * Functions: gameEnd, pageLoad
 */
function gameEnd () { //resets the board
    pageLoad()
    timerRunning = false;
    startBtn.disabled = false;
    currentQuestions = Object.getOwnPropertyNames(questAndAns);
    if (scoreCountdown <= 0 || questionsCorrect === 0) {
        userAlert = alert('Gameover!  Oh no! No questions correct or zero score!  Study harder and try again!');
    } else {
        userPrompt = prompt('Game Over! Your score is ' + scoreCountdown + '. Please enter your initials to submit into the leaderboard!');
        while (userPrompt.trim() === "") {
            userPrompt = prompt('Game Over! Your score is ' + scoreCountdown + '. Please enter your initials to submit into the leaderboard!');
        }
        updateHighScore(userPrompt)
    }
    showHighScore();
    document.getElementById('headerImg').style.width = '400px';
    checkmark.style.display = 'none';
    hsBtn.disabled = false;
    clBtn.disabled = false;
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
    hsDisplay.disabled = false;
}

/* Add event listener to displaybox and execute a function when the user toggles the appropriate box */
document.addEventListener('click', userClickBtn);

//startup!
init();
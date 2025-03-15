// DOM Elements
const welcomeScreen = document.getElementById('welcome-screen');
const instructionsScreen = document.getElementById('instructions-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultsScreen = document.getElementById('results-screen');

const startQuizButton = document.getElementById('start-quiz');
const beginButton = document.getElementById('begin-button');
const nextQuestionButton = document.getElementById('next-question');
const restartQuizButton = document.getElementById('restart-quiz');

const nameInput = document.getElementById('name');
const ageInput = document.getElementById('age');
const questionText = document.getElementById('question-text');
const answerInput = document.getElementById('answer-input');
const suggestionsDropdown = document.getElementById('suggestions');
const currentQuestionSpan = document.getElementById('current-question');
const totalQuestionsSpan = document.getElementById('total-questions');
const timeDisplay = document.getElementById('time-display');
const resultNameSpan = document.getElementById('result-name');
const scoreSpan = document.getElementById('score');
const finalTimeSpan = document.getElementById('final-time');
const answersReview = document.getElementById('answers-review');
const leaderboard = document.getElementById('leaderboard');

// Quiz State
let currentQuestionIndex = 0;
let score = 0;
let timer = null;
let startTime = null;
let endTime = null;
let playerName = '';
let playerAge = 0;
let userAnswers = [];
let currentDate = new Date().toLocaleDateString();

// Shared list of all possible suggestions for all questions
const allSahabahSuggestions = [
    "Abu Bakr", "Umar ibn Al-Khattab", "Uthman ibn Affan", "Ali ibn Abi Talib",
    "Aisha bint Abu Bakr", "Khadijah bint Khuwaylid", "Bilal ibn Rabah", "Khalid ibn Al-Walid",
    "Salman Al-Farisi", "Abu Hurairah", "Abdullah ibn Abbas", "Fatimah",
    "Aminah bint Wahb", "Hamza ibn Abdul-Muttalib", "Zayd ibn Harithah", "Sa'd ibn Abi Waqqas",
    "Abdullah ibn Masud", "Talha ibn Ubaydullah", "Abu Dharr al-Ghifari", "Asma bint Abu Bakr",
    "Abu Ubaidah ibn al-Jarrah", "Muadh ibn Jabal", "Halimah Sa'diyah", "Ruqayyah",
    "Umm Kulthum"
];

// Sample Questions - We'll use only 5 questions per day
// Get a subset of questions to use for today's quiz
const questionsData = [
    {
        text: {
            kids: "Who was known as 'The Truthful One' and was the first adult male to accept Islam?",
            teens: "Who was the first Caliph after Prophet Muhammad ﷺ and was known as 'As-Siddiq'?",
            adults: "Who was known as 'As-Siddiq' and accompanied Prophet Muhammad ﷺ during the Hijrah to Medina?"
        },
        answer: "Abu Bakr",
        suggestions: allSahabahSuggestions
    },
    {
        text: {
            kids: "Who was the second Caliph in Islam and known for his strength and justice?",
            teens: "Who was the second Caliph and established the Islamic calendar?",
            adults: "During whose caliphate did Islam expand rapidly and the Islamic calendar was established?"
        },
        answer: "Umar ibn Al-Khattab",
        suggestions: allSahabahSuggestions
    },
    {
        text: {
            kids: "Who was the third Caliph and known for his modesty and kindness?",
            teens: "Who compiled the Quran into a single standardized book as we know it today?",
            adults: "Which Caliph was known as 'Dhun-Nurayn' (possessor of two lights) and standardized the Quran's text?"
        },
        answer: "Uthman ibn Affan",
        suggestions: allSahabahSuggestions
    },
    {
        text: {
            kids: "Who was the cousin and son-in-law of Prophet Muhammad ﷺ?",
            teens: "Who was known as the 'Gate of Knowledge' and was married to Fatimah, the daughter of Prophet Muhammad ﷺ?",
            adults: "Who was the fourth Caliph, known for his wisdom, knowledge and was the first young boy to accept Islam?"
        },
        answer: "Ali ibn Abi Talib",
        suggestions: allSahabahSuggestions
    },
    {
        text: {
            kids: "Who was the wife of Prophet Muhammad ﷺ who taught many hadiths to Muslims?",
            teens: "Which wife of Prophet Muhammad ﷺ narrated over 2,000 hadiths and was called 'Mother of the Believers'?",
            adults: "Which wife of Prophet Muhammad ﷺ was a scholar who narrated thousands of hadiths and lived many years after him?"
        },
        answer: "Aisha bint Abu Bakr",
        suggestions: allSahabahSuggestions
    }
    // Note: Only using 5 questions as requested
    // You can add more questions here and the code will automatically use the first 5
];

// Initialize the quiz
function init() {
    // DEVELOPER FUNCTION: Reset leaderboard - commented out as requested
    // To use, uncomment the next line when needed
    //clearLeaderboardData();
    
    // Set up event listeners
    startQuizButton.addEventListener('click', startQuiz);
    beginButton.addEventListener('click', beginQuiz);
    nextQuestionButton.addEventListener('click', goToNextQuestion);
    restartQuizButton.addEventListener('click', restartQuiz);
    answerInput.addEventListener('input', handleInput);
    
    // Set total questions to 5 (or the actual number of questions if less than 5)
    const numberOfQuestions = Math.min(questionsData.length, 5);
    totalQuestionsSpan.textContent = numberOfQuestions;
    
    // Check if we have a new date (for daily reset)
    checkForDailyReset();
    
    // Load leaderboard from localStorage
    loadLeaderboard();
}

// Check for daily reset of attempts
function checkForDailyReset() {
    const lastQuizDate = localStorage.getItem('ramadanQuizDate');
    
    // If it's a new day, clear the attempts
    if (lastQuizDate !== currentDate) {
        localStorage.setItem('ramadanQuizDate', currentDate);
        localStorage.removeItem('ramadanQuizPlayedUsers');
        console.log('Daily reset performed - cleared attempts for new day');
    }
}

// Developer function to clear leaderboard data
function clearLeaderboardData() {
    localStorage.removeItem('ramadanQuizLeaderboard');
    console.log('Leaderboard cleared successfully!');
    // Reload the leaderboard display (empty now)
    loadLeaderboard();
}

// Start Quiz - Collect player info and show instructions
function startQuiz() {
    // Validate inputs
    playerName = nameInput.value.trim();
    playerAge = parseInt(ageInput.value);
    
    if (!playerName) {
        alert('Please enter your name.');
        return;
    }
    
    if (!playerAge || playerAge < 5 || playerAge > 100) {
        alert('Please enter a valid age between 5 and 100.');
        return;
    }
    
    // Check if this user has played today
    const playedUsers = JSON.parse(localStorage.getItem('ramadanQuizPlayedUsers')) || [];
    const userIdentifier = `${playerName}-${playerAge}`;
    
    if (playedUsers.includes(userIdentifier)) {
        alert('You have already played today\'s quiz. Please come back tomorrow for a new quiz!');
        return;
    }
    
    // Add user to played list for today
    playedUsers.push(userIdentifier);
    localStorage.setItem('ramadanQuizPlayedUsers', JSON.stringify(playedUsers));
    
    // Show instructions screen
    switchScreen(welcomeScreen, instructionsScreen);
}

// Begin the actual quiz
function beginQuiz() {
    // Reset quiz state
    currentQuestionIndex = 0;
    score = 0;
    userAnswers = [];
    
    // Show first question
    showQuestion(currentQuestionIndex);
    
    // Start timer
    startTime = new Date();
    startTimer();
    
    // Show quiz screen
    switchScreen(instructionsScreen, quizScreen);
}

// Display the current question
function showQuestion(index) {
    const question = questionsData[index];
    
    // Determine which question version to show based on player age
    let questionVersion = 'adults';
    if (playerAge < 12) {
        questionVersion = 'kids';
    } else if (playerAge < 18) {
        questionVersion = 'teens';
    }
    
    // Set question text
    questionText.textContent = question.text[questionVersion];
    
    // Update question counter
    currentQuestionSpan.textContent = index + 1;
    
    // Clear answer input
    answerInput.value = '';
    
    // Clear suggestions
    suggestionsDropdown.innerHTML = '';
    suggestionsDropdown.style.display = 'none';
}

// Handle input in the answer field
function handleInput() {
    const input = answerInput.value.trim();
    if (input.length > 0) {
        showSuggestions(input);
    } else {
        suggestionsDropdown.innerHTML = '';
        suggestionsDropdown.style.display = 'none';
    }
}

// Show suggestions based on input
function showSuggestions(input) {
    const question = questionsData[currentQuestionIndex];
    const filteredSuggestions = question.suggestions.filter(suggestion => 
        suggestion.toLowerCase().includes(input.toLowerCase())
    );
    
    if (filteredSuggestions.length > 0) {
        suggestionsDropdown.innerHTML = '';
        
        filteredSuggestions.forEach(suggestion => {
            const item = document.createElement('div');
            item.className = 'suggestion-item';
            item.textContent = suggestion;
            item.addEventListener('click', () => {
                answerInput.value = suggestion;
                suggestionsDropdown.style.display = 'none';
            });
            
            suggestionsDropdown.appendChild(item);
        });
        
        suggestionsDropdown.style.display = 'block';
    } else {
        suggestionsDropdown.innerHTML = '';
        suggestionsDropdown.style.display = 'none';
    }
}

// Go to the next question or finish quiz
function goToNextQuestion() {
    // Save user answer
    const userAnswer = answerInput.value.trim();
    const correctAnswer = questionsData[currentQuestionIndex].answer;
    
    // Check if answer was given
    const isAnswered = userAnswer.length > 0;
    const isCorrect = isAnswered && userAnswer.toLowerCase() === correctAnswer.toLowerCase();
    
    // Updated scoring system: +4 for correct, -1 for wrong, 0 for unattempted
    let questionScore = 0;
    if (isCorrect) {
        questionScore = 4;
    } else if (isAnswered) {
        questionScore = -1;
    }
    
    // Update total score
    score += questionScore;
    
    // Save the answer data
    userAnswers.push({
        question: questionText.textContent,
        userAnswer: userAnswer,
        correctAnswer: correctAnswer,
        isCorrect: isCorrect,
        isAnswered: isAnswered,
        score: questionScore
    });
    
    // Add swipe animation
    quizScreen.classList.add('swipe-left');
    
    setTimeout(() => {
        quizScreen.classList.remove('swipe-left');
        
        // Move to next question or finish quiz
        currentQuestionIndex++;
        
        if (currentQuestionIndex < Math.min(questionsData.length, 5)) {
            showQuestion(currentQuestionIndex);
            quizScreen.classList.add('swipe-right');
            setTimeout(() => {
                quizScreen.classList.remove('swipe-right');
            }, 300);
        } else {
            finishQuiz();
        }
    }, 300);
}

// Finish the quiz and show results
function finishQuiz() {
    // Stop timer
    clearInterval(timer);
    endTime = new Date();
    const timeTaken = Math.floor((endTime - startTime) / 1000); // in seconds
    
    // Make sure score is never negative
    score = Math.max(score, 0);
    
    // Update results screen
    resultNameSpan.textContent = playerName;
    scoreSpan.textContent = score;
    finalTimeSpan.textContent = formatTime(timeTaken);
    
    // Show answer review
    displayAnswerReview();
    
    // Update leaderboard with cumulative score
    updateLeaderboard(playerName, score, timeTaken);
    
    // Switch to results screen
    switchScreen(quizScreen, resultsScreen);
}

// Display review of all answers
function displayAnswerReview() {
    answersReview.innerHTML = '';
    
    userAnswers.forEach((answer, index) => {
        const reviewItem = document.createElement('div');
        reviewItem.className = 'review-item';
        
        const questionNumber = document.createElement('div');
        questionNumber.className = 'question-number';
        questionNumber.textContent = `Question ${index + 1}:`;
        
        const questionText = document.createElement('div');
        questionText.className = 'question-text';
        questionText.textContent = answer.question;
        
        const answerText = document.createElement('div');
        let scoreText = '';
        
        if (answer.isCorrect) {
            answerText.className = 'answer-text correct';
            answerText.textContent = `Correct! Your answer: ${answer.userAnswer}`;
            scoreText = '+4 points';
        } else if (answer.isAnswered) {
            answerText.className = 'answer-text incorrect';
            answerText.textContent = `Incorrect. Your answer: ${answer.userAnswer} | Correct answer: ${answer.correctAnswer}`;
            scoreText = '-1 point';
        } else {
            answerText.className = 'answer-text unattempted';
            answerText.textContent = `Not attempted. Correct answer: ${answer.correctAnswer}`;
            scoreText = '0 points';
        }
        
        const pointsText = document.createElement('div');
        pointsText.className = 'points-text';
        pointsText.textContent = scoreText;
        
        reviewItem.appendChild(questionNumber);
        reviewItem.appendChild(questionText);
        reviewItem.appendChild(answerText);
        reviewItem.appendChild(pointsText);
        
        answersReview.appendChild(reviewItem);
    });
}

// Update leaderboard with new score
function updateLeaderboard(name, score, time) {
    // Get existing leaderboard
    let leaderboardData = JSON.parse(localStorage.getItem('ramadanQuizLeaderboard')) || [];
    
    // Check if user already exists in leaderboard
    const existingEntryIndex = leaderboardData.findIndex(entry => 
        entry.name === name && entry.age === playerAge
    );
    
    if (existingEntryIndex !== -1) {
        // Update existing entry with accumulated score
        leaderboardData[existingEntryIndex].score += score;
        leaderboardData[existingEntryIndex].totalAttempts += 1;
        leaderboardData[existingEntryIndex].lastAttemptDate = currentDate;
        
        // Update best time if current time is better
        if (time < leaderboardData[existingEntryIndex].time) {
            leaderboardData[existingEntryIndex].time = time;
        }
    } else {
        // Add new entry
        leaderboardData.push({
            name: name,
            age: playerAge,
            score: score,
            time: time,
            totalAttempts: 1,
            lastAttemptDate: currentDate
        });
    }
    
    // Sort by score (descending) and time (ascending)
    leaderboardData.sort((a, b) => {
        if (b.score !== a.score) {
            return b.score - a.score;
        }
        return a.time - b.time;
    });
    
    // Save to localStorage
    localStorage.setItem('ramadanQuizLeaderboard', JSON.stringify(leaderboardData));
    
    // Display leaderboard
    displayLeaderboard(leaderboardData);
}

// Display leaderboard
function displayLeaderboard(leaderboardData) {
    leaderboard.innerHTML = '';
    
    if (leaderboardData.length === 0) {
        const emptyMessage = document.createElement('div');
        emptyMessage.textContent = 'No entries yet. Be the first on the leaderboard!';
        leaderboard.appendChild(emptyMessage);
        return;
    }
    
    leaderboardData.forEach((entry, index) => {
        const leaderboardItem = document.createElement('div');
        leaderboardItem.className = 'leaderboard-item';
        
        const rank = document.createElement('div');
        rank.className = 'rank';
        if (index === 0) rank.classList.add('gold');
        if (index === 1) rank.classList.add('silver');
        if (index === 2) rank.classList.add('bronze');
        rank.textContent = index + 1;
        
        const playerInfo = document.createElement('div');
        playerInfo.className = 'player-info';
        playerInfo.textContent = entry.name;
        
        const playerScore = document.createElement('div');
        playerScore.className = 'player-score';
        playerScore.textContent = `${entry.score} pts (${formatTime(entry.time)})`;
        
        leaderboardItem.appendChild(rank);
        leaderboardItem.appendChild(playerInfo);
        leaderboardItem.appendChild(playerScore);
        
        leaderboard.appendChild(leaderboardItem);
    });
}

// Load leaderboard from localStorage
function loadLeaderboard() {
    const leaderboardData = JSON.parse(localStorage.getItem('ramadanQuizLeaderboard')) || [];
    displayLeaderboard(leaderboardData);
}

// Start the timer
function startTimer() {
    let seconds = 0;
    timeDisplay.textContent = '00:00';
    
    timer = setInterval(() => {
        seconds++;
        timeDisplay.textContent = formatTime(seconds);
    }, 1000);
}

// Format time from seconds to MM:SS
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Switch between screens with animation
function switchScreen(fromScreen, toScreen) {
    fromScreen.classList.remove('active');
    toScreen.classList.add('active');
}

// Restart the quiz
function restartQuiz() {
    switchScreen(resultsScreen, welcomeScreen);
    nameInput.value = playerName;
    ageInput.value = playerAge;
}

// Initialize the quiz when the page loads
document.addEventListener('DOMContentLoaded', init);

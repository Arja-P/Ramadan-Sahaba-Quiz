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

// Sample Questions - Replace with your actual questions about Sahabah
// Each question has different versions for different age groups
const questionsData = [
    {
        text: {
            kids: "Who was known as 'The Truthful One' and was the first adult male to accept Islam?",
            teens: "Who was the first Caliph after Prophet Muhammad ﷺ and was known as 'As-Siddiq'?",
            adults: "Who was known as 'As-Siddiq' and accompanied Prophet Muhammad ﷺ during the Hijrah to Medina?"
        },
        answer: "Abu Bakr",
        suggestions: ["Abu Bakr", "Umar", "Uthman", "Ali"]
    },
    {
        text: {
            kids: "Who was the second Caliph in Islam and known for his strength and justice?",
            teens: "Who was the second Caliph and established the Islamic calendar?",
            adults: "During whose caliphate did Islam expand rapidly and the Islamic calendar was established?"
        },
        answer: "Umar ibn Al-Khattab",
        suggestions: ["Umar ibn Al-Khattab", "Abu Bakr", "Uthman", "Ali"]
    },
    {
        text: {
            kids: "Who was the third Caliph and known for his modesty and kindness?",
            teens: "Who compiled the Quran into a single standardized book as we know it today?",
            adults: "Which Caliph was known as 'Dhun-Nurayn' (possessor of two lights) and standardized the Quran's text?"
        },
        answer: "Uthman ibn Affan",
        suggestions: ["Uthman ibn Affan", "Abu Bakr", "Umar", "Ali"]
    },
    {
        text: {
            kids: "Who was the cousin and son-in-law of Prophet Muhammad ﷺ?",
            teens: "Who was known as the 'Gate of Knowledge' and was married to Fatimah, the daughter of Prophet Muhammad ﷺ?",
            adults: "Who was the fourth Caliph, known for his wisdom, knowledge and was the first young boy to accept Islam?"
        },
        answer: "Ali ibn Abi Talib",
        suggestions: ["Ali ibn Abi Talib", "Umar", "Uthman", "Abu Bakr"]
    },
    {
        text: {
            kids: "Who was the wife of Prophet Muhammad ﷺ who taught many hadiths to Muslims?",
            teens: "Which wife of Prophet Muhammad ﷺ narrated over 2,000 hadiths and was called 'Mother of the Believers'?",
            adults: "Which wife of Prophet Muhammad ﷺ was a scholar who narrated thousands of hadiths and lived many years after him?"
        },
        answer: "Aisha bint Abu Bakr",
        suggestions: ["Aisha bint Abu Bakr", "Khadijah", "Hafsa", "Zaynab"]
    },
    {
        text: {
            kids: "Who was the first wife of Prophet Muhammad ﷺ who supported him when he received the first revelation?",
            teens: "Who was the first person to believe in Prophet Muhammad's ﷺ message and was his first wife?",
            adults: "Who was Prophet Muhammad's ﷺ first wife who supported him financially and emotionally during the early days of Islam?"
        },
        answer: "Khadijah bint Khuwaylid",
        suggestions: ["Khadijah bint Khuwaylid", "Aisha", "Fatimah", "Hafsa"]
    },
    {
        text: {
            kids: "Who was the freed slave who became the first muezzin (caller to prayer) in Islam?",
            teens: "Who was chosen by Prophet Muhammad ﷺ to be the first person to call the adhan in Islam?",
            adults: "Which former slave from Abyssinia had such a beautiful voice that he was chosen to be the first muezzin in Islam?"
        },
        answer: "Bilal ibn Rabah",
        suggestions: ["Bilal ibn Rabah", "Zayd ibn Harithah", "Abu Dharr", "Salman Al-Farisi"]
    },
    {
        text: {
            kids: "Who was the companion known as 'The Sword of Allah' and was an excellent military commander?",
            teens: "Which military commander was undefeated in battle and was given the title 'The Sword of Allah'?",
            adults: "Which companion was initially opposed to Islam but later became one of its greatest generals with the title 'Sayfullah' (Sword of Allah)?"
        },
        answer: "Khalid ibn Al-Walid",
        suggestions: ["Khalid ibn Al-Walid", "Sa'd ibn Abi Waqqas", "Abu Ubaidah", "Amr ibn Al-As"]
    },
    {
        text: {
            kids: "Who was the companion from Persia who suggested digging a trench to defend Medina?",
            teens: "Which Persian companion suggested the strategy of digging a trench during the Battle of the Trench?",
            adults: "Which companion traveled extensively seeking truth, from Persia to Syria to Medina, and suggested the trench defense strategy?"
        },
        answer: "Salman Al-Farisi",
        suggestions: ["Salman Al-Farisi", "Suhayb Ar-Rumi", "Abu Dharr", "Ammar ibn Yasir"]
    },
    {
        text: {
            kids: "Who was the companion who memorized and taught many sayings of Prophet Muhammad ﷺ?",
            teens: "Which companion narrated the most hadiths and was known for his excellent memory?",
            adults: "Which companion formed a group dedicated to memorizing hadith, lived in Bahrain, and narrated over 5,000 hadiths?"
        },
        answer: "Abu Hurairah",
        suggestions: ["Abu Hurairah", "Abdullah ibn Masud", "Abdullah ibn Abbas", "Anas ibn Malik"]
    },
    {
        text: {
            kids: "Who was the young cousin of Prophet Muhammad ﷺ who became a great scholar of the Quran?",
            teens: "Which young cousin of Prophet Muhammad ﷺ was called 'The Scholar of the Ummah' and 'The Interpreter of the Quran'?",
            adults: "Which cousin did Prophet Muhammad ﷺ embrace and pray for saying, 'O Allah, give him understanding of the religion and teach him interpretation'?"
        },
        answer: "Abdullah ibn Abbas",
        suggestions: ["Abdullah ibn Abbas", "Abdullah ibn Umar", "Zayd ibn Thabit", "Muadh ibn Jabal"]
    },
    {
        text: {
            kids: "Who was the daughter of Prophet Muhammad ﷺ who married Ali?",
            teens: "Which daughter of Prophet Muhammad ﷺ is known as 'The Leader of the Women of Paradise'?",
            adults: "Which daughter of Prophet Muhammad ﷺ was known for her resemblance to her father in speech and manners and was married to Ali?"
        },
        answer: "Fatimah",
        suggestions: ["Fatimah", "Ruqayyah", "Umm Kulthum", "Zaynab"]
    },
    {
        text: {
            kids: "Who was the mother of Prophet Muhammad ﷺ?",
            teens: "Who was the mother of Prophet Muhammad ﷺ who passed away when he was only six years old?",
            adults: "Which noble woman from Banu Zuhrah was the mother of Prophet Muhammad ﷺ, who died near Abwa while returning from Yathrib?"
        },
        answer: "Aminah bint Wahb",
        suggestions: ["Aminah bint Wahb", "Halimah", "Barakah", "Fatimah bint Asad"]
    },
    {
        text: {
            kids: "Who was the companion who was known for his generosity and helped finance the Muslim army?",
            teens: "Which wealthy companion spent all his wealth in the way of Allah and was titled 'The Generous One'?",
            adults: "Which companion was asked by Prophet Muhammad ﷺ 'What have you left for your family?' and replied 'Allah and His Messenger'?"
        },
        answer: "Uthman ibn Affan",
        suggestions: ["Uthman ibn Affan", "Abdur-Rahman ibn Awf", "Talha ibn Ubaydullah", "Zubayr ibn Al-Awwam"]
    },
    {
        text: {
            kids: "Who was the first child to accept Islam?",
            teens: "Who was the young cousin of Prophet Muhammad ﷺ who was the first child to accept Islam?",
            adults: "Which cousin of Prophet Muhammad ﷺ was raised in his household, was the first child to accept Islam, and later became the fourth Caliph?"
        },
        answer: "Ali ibn Abi Talib",
        suggestions: ["Ali ibn Abi Talib", "Zayd ibn Harithah", "Abdullah ibn Abbas", "Anas ibn Malik"]
    }
];

// Initialize the quiz
function init() {
    // Set up event listeners
    startQuizButton.addEventListener('click', startQuiz);
    beginButton.addEventListener('click', beginQuiz);
    nextQuestionButton.addEventListener('click', goToNextQuestion);
    restartQuizButton.addEventListener('click', restartQuiz);
    answerInput.addEventListener('input', handleInput);
    
    // Set total questions
    totalQuestionsSpan.textContent = questionsData.length;
    
    // Load leaderboard from localStorage
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
    const isCorrect = userAnswer.toLowerCase() === correctAnswer.toLowerCase();
    
    userAnswers.push({
        question: questionText.textContent,
        userAnswer: userAnswer,
        correctAnswer: correctAnswer,
        isCorrect: isCorrect
    });
    
    if (isCorrect) {
        score++;
    }
    
    // Add swipe animation
    quizScreen.classList.add('swipe-left');
    
    setTimeout(() => {
        quizScreen.classList.remove('swipe-left');
        
        // Move to next question or finish quiz
        currentQuestionIndex++;
        
        if (currentQuestionIndex < questionsData.length) {
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
    
    // Update results screen
    resultNameSpan.textContent = playerName;
    scoreSpan.textContent = score;
    finalTimeSpan.textContent = formatTime(timeTaken);
    
    // Show answer review
    displayAnswerReview();
    
    // Update leaderboard
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
        if (answer.isCorrect) {
            answerText.className = 'answer-text correct';
            answerText.textContent = `Correct! Your answer: ${answer.userAnswer}`;
        } else {
            answerText.className = 'answer-text incorrect';
            answerText.textContent = `Incorrect. Your answer: ${answer.userAnswer || '(No answer)'} | Correct answer: ${answer.correctAnswer}`;
        }
        
        reviewItem.appendChild(questionNumber);
        reviewItem.appendChild(questionText);
        reviewItem.appendChild(answerText);
        
        answersReview.appendChild(reviewItem);
    });
}

// Update leaderboard with new score
function updateLeaderboard(name, score, time) {
    // Get existing leaderboard
    let leaderboardData = JSON.parse(localStorage.getItem('ramadanQuizLeaderboard')) || [];
    
    // Add new entry
    leaderboardData.push({
        name: name,
        score: score,
        time: time,
        date: new Date().toLocaleDateString()
    });
    
    // Sort by score (descending) and time (ascending)
    leaderboardData.sort((a, b) => {
        if (b.score !== a.score) {
            return b.score - a.score;
        }
        return a.time - b.time;
    });
    
    // Keep only top 10 entries
    leaderboardData = leaderboardData.slice(0, 10);
    
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
        playerScore.textContent = `${entry.score}/${questionsData.length} (${formatTime(entry.time)})`;
        
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
    
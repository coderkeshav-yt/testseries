document.addEventListener('DOMContentLoaded', function() {
    // Initialize question data structure to store answers
    const questionData = {};
    
    // Define correct answers for scoring (in a real exam, this would come from a server)
    const correctAnswers = {
        '01': '3', // Answer for Question 1 is option 3: √(G ℏ/c³)
        '02': '4', // Example answers for other questions
        '03': '2',
        '04': '1',
        '05': '3',
        '06': '2',
        '07': '4',
        '08': '1',
        '09': '3',
        '10': '2'
        // In a real implementation, you would have answers for all 90 questions
    };
    
    // Define subject sections
    const subjectSections = {
        'PHYSICS': { start: 1, end: 30 },
        'CHEMISTRY': { start: 31, end: 60 },
        'MATHEMATICS': { start: 61, end: 90 }
    };
    
    // Current active subject
    let currentSubject = 'PHYSICS';
    
    // Initialize question data for all 90 questions
    for (let i = 1; i <= 90; i++) {
        const qNum = i.toString().padStart(2, '0');
        questionData[qNum] = {
            answered: false,
            markedForReview: false,
            selectedOption: null,
            visited: false,
            subject: getSubjectForQuestion(i)
        };
    }
    
    // Function to determine which subject a question belongs to
    function getSubjectForQuestion(questionNumber) {
        if (questionNumber >= 1 && questionNumber <= 30) {
            return 'PHYSICS';
        } else if (questionNumber >= 31 && questionNumber <= 60) {
            return 'CHEMISTRY';
        } else {
            return 'MATHEMATICS';
        }
    }
    
    // Set first question as visited
    questionData['01'].visited = true;
    
    // Timer functionality
    let timerElement = document.getElementById('timer');
    let timeRemaining = 3 * 60 * 60; // 3 hours in seconds
    
    function updateTimer() {
        const hours = Math.floor(timeRemaining / 3600);
        const minutes = Math.floor((timeRemaining % 3600) / 60);
        const seconds = timeRemaining % 60;
        
        timerElement.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            alert('Time is up! Your test will be submitted automatically.');
            submitTest();
        } else {
            timeRemaining--;
        }
    }
    
    const timerInterval = setInterval(updateTimer, 1000);
    updateTimer(); // Initialize timer display
    
    // Question navigation
    const questionButtons = document.querySelectorAll('.q-btn');
    
    questionButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Get current question number
            const currentQNum = document.querySelector('.q-btn.active')?.textContent || '01';
            
            // Save current state before moving
            saveCurrentState(currentQNum);
            
            // Remove active class from all buttons
            questionButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Mark as visited
            const qNum = this.textContent;
            questionData[qNum].visited = true;
            
            // Update question number in header
            document.querySelector('.question-header h2').textContent = `Question ${qNum}:`;
            
            // Load the question state (selected option)
            loadQuestionState(qNum);
            
            // Update UI
            updateQuestionButtonUI(qNum);
            updateStatusCounts();
            
            // Load question content based on question number
            loadQuestionContent(qNum);
        });
    });
    
    // Function to load question content
    function loadQuestionContent(qNum) {
        // In a real implementation, this would fetch the question content from a database
        // For this demo, we'll just update the question text based on the subject
        const questionNumber = parseInt(qNum);
        let questionText = '';
        
        if (questionNumber >= 1 && questionNumber <= 30) {
            questionText = `This is a Physics question about `;
            
            if (questionNumber <= 10) {
                questionText += 'mechanics and kinematics.';
            } else if (questionNumber <= 20) {
                questionText += 'electromagnetism and waves.';
            } else {
                questionText += 'modern physics and thermodynamics.';
            }
        } else if (questionNumber >= 31 && questionNumber <= 60) {
            questionText = `This is a Chemistry question about `;
            
            if (questionNumber <= 40) {
                questionText += 'organic chemistry and reactions.';
            } else if (questionNumber <= 50) {
                questionText += 'inorganic chemistry and periodic properties.';
            } else {
                questionText += 'physical chemistry and equilibrium.';
            }
        } else {
            questionText = `This is a Mathematics question about `;
            
            if (questionNumber <= 70) {
                questionText += 'algebra and functions.';
            } else if (questionNumber <= 80) {
                questionText += 'calculus and coordinate geometry.';
            } else {
                questionText += 'statistics and probability.';
            }
        }
        
        // Only update the question text if it's not the first question (which has special content)
        if (qNum !== '01') {
            document.querySelector('.question-content p').textContent = questionText;
            
            // Update options for demonstration purposes
            const options = document.querySelectorAll('.option label');
            options[0].innerHTML = `(1) Option A for question ${qNum}`;
            options[1].innerHTML = `(2) Option B for question ${qNum}`;
            options[2].innerHTML = `(3) Option C for question ${qNum}`;
            options[3].innerHTML = `(4) Option D for question ${qNum}`;
        }
    }
    
    // Subject navigation
    const subjectButtons = document.querySelectorAll('.subject-btn');
    
    subjectButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Get the current active question number
            const currentQNum = document.querySelector('.q-btn.active')?.textContent || '01';
            
            // Save current state before switching subjects
            saveCurrentState(currentQNum);
            
            // Remove active class from all buttons
            subjectButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Update current subject
            currentSubject = this.textContent;
            
            // Show questions for the selected subject
            showQuestionsForSubject(currentSubject);
            
            // Select the first question of the subject
            const firstQuestionOfSubject = document.querySelector('.q-btn:not(.hidden)');
            if (firstQuestionOfSubject) {
                firstQuestionOfSubject.click();
            }
        });
    });
    
    // Function to show questions for the selected subject
    function showQuestionsForSubject(subject) {
        const { start, end } = subjectSections[subject];
        
        // Hide all question buttons first
        questionButtons.forEach(btn => {
            btn.classList.add('hidden');
        });
        
        // Show only the question buttons for the selected subject
        for (let i = start; i <= end; i++) {
            const qNum = i.toString().padStart(2, '0');
            const btn = Array.from(questionButtons).find(btn => btn.textContent === qNum);
            if (btn) {
                btn.classList.remove('hidden');
            }
        }
        
        // Update the question palette header
        document.querySelector('.question-palette').setAttribute('data-subject', subject);
    }
    
    // Answer selection
    const optionInputs = document.querySelectorAll('.option input[type="radio"]');
    
    optionInputs.forEach(input => {
        input.addEventListener('change', function() {
            const qNum = document.querySelector('.q-btn.active').textContent;
            const selectedValue = this.value;
            
            // Update question data
            questionData[qNum].selectedOption = selectedValue;
            questionData[qNum].answered = true;
            
            // Update UI
            updateQuestionButtonUI(qNum);
            updateStatusCounts();
        });
    });
    
    // Action buttons functionality
    const saveNextBtn = document.querySelector('.save-next');
    const saveMarkBtn = document.querySelector('.save-mark');
    const clearBtn = document.querySelector('.clear');
    const markReviewBtn = document.querySelector('.mark-review');
    const nextBtn = document.querySelector('.next-btn');
    const backBtn = document.querySelector('.back-btn');
    const submitBtn = document.querySelector('.submit-btn');
    
    saveNextBtn.addEventListener('click', function() {
        const qNum = document.querySelector('.q-btn.active').textContent;
        
        // Save current state
        saveCurrentState(qNum);
        
        // Move to next question
        moveToNextQuestion();
    });
    
    saveMarkBtn.addEventListener('click', function() {
        const qNum = document.querySelector('.q-btn.active').textContent;
        
        // Save current state and mark for review
        saveCurrentState(qNum);
        questionData[qNum].markedForReview = true;
        
        // Update UI
        updateQuestionButtonUI(qNum);
        updateStatusCounts();
        
        // Move to next question
        moveToNextQuestion();
    });
    
    clearBtn.addEventListener('click', function() {
        const qNum = document.querySelector('.q-btn.active').textContent;
        
        // Clear selected option
        optionInputs.forEach(input => {
            input.checked = false;
        });
        
        // Update question data
        questionData[qNum].selectedOption = null;
        questionData[qNum].answered = false;
        
        // Update UI
        updateQuestionButtonUI(qNum);
        updateStatusCounts();
    });
    
    markReviewBtn.addEventListener('click', function() {
        const qNum = document.querySelector('.q-btn.active').textContent;
        
        // Mark for review
        questionData[qNum].markedForReview = true;
        
        // Update UI
        updateQuestionButtonUI(qNum);
        updateStatusCounts();
        
        // Move to next question
        moveToNextQuestion();
    });
    
    nextBtn.addEventListener('click', function() {
        const qNum = document.querySelector('.q-btn.active').textContent;
        
        // Save current state
        saveCurrentState(qNum);
        
        // Move to next question
        moveToNextQuestion();
    });
    
    backBtn.addEventListener('click', function() {
        const qNum = document.querySelector('.q-btn.active').textContent;
        
        // Save current state
        saveCurrentState(qNum);
        
        // Move to previous question
        moveToPreviousQuestion();
    });
    
    submitBtn.addEventListener('click', function() {
        if (confirm('Are you sure you want to submit your test? This action cannot be undone.')) {
            submitTest();
        }
    });
    
    // Helper functions
    function saveCurrentState(qNum) {
        const selectedOption = document.querySelector('.option input[type="radio"]:checked');
        
        if (selectedOption) {
            questionData[qNum].selectedOption = selectedOption.value;
            questionData[qNum].answered = true;
        } else {
            questionData[qNum].answered = false;
        }
    }
    
    function loadQuestionState(qNum) {
        // Clear all options first
        optionInputs.forEach(input => {
            input.checked = false;
        });
        
        // Set the saved option if any
        if (questionData[qNum].selectedOption) {
            const option = document.querySelector(`.option input[value="${questionData[qNum].selectedOption}"]`);
            if (option) {
                option.checked = true;
            }
        }
    }
    
    function updateQuestionButtonUI(qNum) {
        // Find the button with the matching text content
        const btn = Array.from(questionButtons).find(btn => btn.textContent === qNum);
        if (!btn) return;
        
        // Remove all status classes
        btn.classList.remove('not-answered', 'answered', 'marked', 'answered-marked');
        
        // Add appropriate class based on state
        if (questionData[qNum].answered && questionData[qNum].markedForReview) {
            btn.classList.add('answered-marked');
        } else if (questionData[qNum].answered) {
            btn.classList.add('answered');
        } else if (questionData[qNum].markedForReview) {
            btn.classList.add('marked');
        } else if (questionData[qNum].visited) {
            btn.classList.add('not-answered');
        }
    }
    
    function moveToNextQuestion() {
        const activeQuestionBtn = document.querySelector('.q-btn.active');
        if (activeQuestionBtn) {
            // Find the next visible question button
            let nextBtn = activeQuestionBtn.nextElementSibling;
            while (nextBtn && nextBtn.classList.contains('hidden')) {
                nextBtn = nextBtn.nextElementSibling;
            }
            
            if (nextBtn) {
                nextBtn.click();
            } else {
                // If we're at the end of the current subject, move to the next subject
                const nextSubjectIndex = Object.keys(subjectSections).indexOf(currentSubject) + 1;
                if (nextSubjectIndex < Object.keys(subjectSections).length) {
                    const nextSubject = Object.keys(subjectSections)[nextSubjectIndex];
                    const subjectBtn = Array.from(subjectButtons).find(btn => btn.textContent === nextSubject);
                    if (subjectBtn) {
                        subjectBtn.click();
                    }
                }
            }
        }
    }
    
    function moveToPreviousQuestion() {
        const activeQuestionBtn = document.querySelector('.q-btn.active');
        if (activeQuestionBtn) {
            // Find the previous visible question button
            let prevBtn = activeQuestionBtn.previousElementSibling;
            while (prevBtn && prevBtn.classList.contains('hidden')) {
                prevBtn = prevBtn.previousElementSibling;
            }
            
            if (prevBtn) {
                prevBtn.click();
            } else {
                // If we're at the beginning of the current subject, move to the previous subject
                const prevSubjectIndex = Object.keys(subjectSections).indexOf(currentSubject) - 1;
                if (prevSubjectIndex >= 0) {
                    const prevSubject = Object.keys(subjectSections)[prevSubjectIndex];
                    const subjectBtn = Array.from(subjectButtons).find(btn => btn.textContent === prevSubject);
                    if (subjectBtn) {
                        subjectBtn.click();
                        
                        // Select the last question of the previous subject
                        setTimeout(() => {
                            const lastQuestionOfSubject = Array.from(document.querySelectorAll('.q-btn:not(.hidden)')).pop();
                            if (lastQuestionOfSubject) {
                                lastQuestionOfSubject.click();
                            }
                        }, 0);
                    }
                }
            }
        }
    }
    
    function updateStatusCounts() {
        // Count questions by status for the current subject only
        let notVisitedCount = 0;
        let notAnsweredCount = 0;
        let answeredCount = 0;
        let markedCount = 0;
        let answeredMarkedCount = 0;
        
        // Get the range for the current subject
        const { start, end } = subjectSections[currentSubject];
        
        // Count based on our data structure
        for (let i = start; i <= end; i++) {
            const qNum = i.toString().padStart(2, '0');
            const q = questionData[qNum];
            
            if (!q.visited) {
                notVisitedCount++;
            } else if (q.answered && q.markedForReview) {
                answeredMarkedCount++;
            } else if (q.answered) {
                answeredCount++;
            } else if (q.markedForReview) {
                markedCount++;
            } else {
                notAnsweredCount++;
            }
        }
        
        // Update the status counts
        document.querySelector('.status-box.not-visited').textContent = notVisitedCount;
        document.querySelector('.status-box.not-answered').textContent = notAnsweredCount;
        document.querySelector('.status-box.answered').textContent = answeredCount;
        document.querySelector('.status-box.marked').textContent = markedCount;
        document.querySelector('.status-box.answered-marked').textContent = answeredMarkedCount;
    }
    
    function submitTest() {
        // Calculate results
        const results = calculateResults();
        
        // Display results page
        displayResultsPage(results);
        
        // Disable all interactive elements
        document.querySelectorAll('button, input').forEach(el => {
            el.disabled = true;
        });
        
        // Stop the timer
        clearInterval(timerInterval);
    }
    
    function calculateResults() {
        let totalAttempted = 0;
        let correctAnswers = 0;
        let incorrectAnswers = 0;
        let totalMarks = 0;
        
        // For each question, check if it was answered and if the answer was correct
        for (const qNum in questionData) {
            if (questionData[qNum].answered) {
                totalAttempted++;
                
                // Check if the answer is correct (in a real exam, this would be compared with correct answers from a server)
                if (isCorrectAnswer(qNum, questionData[qNum].selectedOption)) {
                    correctAnswers++;
                    totalMarks += 4; // +4 for correct answer
                } else {
                    incorrectAnswers++;
                    totalMarks -= 1; // -1 for incorrect answer
                }
            }
        }
        
        // Calculate percentage
        const totalQuestions = Object.keys(questionData).length;
        const maxMarks = totalQuestions * 4;
        const percentage = (totalMarks / maxMarks) * 100;
        
        // Determine performance level
        let performanceLevel = '';
        if (percentage >= 90) {
            performanceLevel = 'Excellent';
        } else if (percentage >= 75) {
            performanceLevel = 'Very Good';
        } else if (percentage >= 60) {
            performanceLevel = 'Good';
        } else if (percentage >= 40) {
            performanceLevel = 'Average';
        } else {
            performanceLevel = 'Below Average';
        }
        
        return {
            totalQuestions,
            totalAttempted,
            correctAnswers,
            incorrectAnswers,
            totalMarks,
            maxMarks,
            percentage: Math.max(0, percentage.toFixed(2)), // Ensure percentage is not negative
            performanceLevel
        };
    }
    
    function isCorrectAnswer(qNum, selectedOption) {
        // In a real exam, this would check against correct answers from a server
        // For this demo, we'll use our predefined correct answers
        return correctAnswers[qNum] === selectedOption;
    }
    
    function displayResultsPage(results) {
        // Create results container
        const resultsContainer = document.createElement('div');
        resultsContainer.className = 'results-container';
        
        // Create results content
        resultsContainer.innerHTML = `
            <div class="results-header">
                <h1>Test Results</h1>
                <div class="performance-badge ${results.performanceLevel.toLowerCase().replace(' ', '-')}">
                    ${results.performanceLevel}
                </div>
            </div>
            
            <div class="results-summary">
                <div class="result-item">
                    <div class="result-value">${results.totalAttempted}</div>
                    <div class="result-label">Questions Attempted</div>
                </div>
                <div class="result-item">
                    <div class="result-value">${results.correctAnswers}</div>
                    <div class="result-label">Correct Answers</div>
                </div>
                <div class="result-item">
                    <div class="result-value">${results.incorrectAnswers}</div>
                    <div class="result-label">Incorrect Answers</div>
                </div>
                <div class="result-item">
                    <div class="result-value">${results.totalMarks}</div>
                    <div class="result-label">Total Marks</div>
                </div>
            </div>
            
            <div class="results-details">
                <div class="score-container">
                    <div class="score-circle">
                        <div class="score-percentage">${results.percentage}%</div>
                        <div class="score-text">Score</div>
                    </div>
                </div>
                
                <div class="marks-breakdown">
                    <h2>Marks Breakdown</h2>
                    <div class="breakdown-item">
                        <span>Correct Answers (${results.correctAnswers} × 4):</span>
                        <span>+${results.correctAnswers * 4}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Incorrect Answers (${results.incorrectAnswers} × -1):</span>
                        <span>${results.incorrectAnswers > 0 ? '-' + results.incorrectAnswers : 0}</span>
                    </div>
                    <div class="breakdown-item total">
                        <span>Total Marks:</span>
                        <span>${results.totalMarks} / ${results.maxMarks}</span>
                    </div>
                </div>
            </div>
            
            <div class="results-analysis">
                <h2>Performance Analysis</h2>
                <p>You attempted ${results.totalAttempted} out of ${results.totalQuestions} questions.</p>
                <p>Your accuracy rate is ${results.totalAttempted > 0 ? (results.correctAnswers / results.totalAttempted * 100).toFixed(2) : 0}%.</p>
                <p>Your overall performance is <strong>${results.performanceLevel}</strong>.</p>
            </div>
            
            <div class="results-actions">
                <button class="action-btn review-btn">Review Answers</button>
                <button class="action-btn home-btn">Back to Home</button>
            </div>
        `;
        
        // Hide the main container
        document.querySelector('.main-container').style.display = 'none';
        
        // Add results container to the body
        document.body.appendChild(resultsContainer);
        
        // Add event listeners to the buttons
        resultsContainer.querySelector('.review-btn').addEventListener('click', function() {
            // Show the main container for review
            document.querySelector('.main-container').style.display = 'flex';
            // Hide the results container
            resultsContainer.style.display = 'none';
            // Hide the promo if it's visible
            const promoElement = document.querySelector('.promo-container');
            if (promoElement) {
                promoElement.style.display = 'none';
            }
        });
        
        resultsContainer.querySelector('.home-btn').addEventListener('click', function() {
            // Reload the page to start over
            window.location.reload();
        });
        
        // Create and display the promotional section after a short delay
        setTimeout(() => {
            displayPromoSection(results.performanceLevel);
        }, 1500);
    }
    
    function displayPromoSection(performanceLevel) {
        // Create promo container
        const promoContainer = document.createElement('div');
        promoContainer.className = 'promo-container';
        
        // Customize message based on performance level
        let customMessage = '';
        let recommendedPackage = '';
        
        if (performanceLevel === 'Excellent' || performanceLevel === 'Very Good') {
            customMessage = "Great job! You're performing well, but there's always room to perfect your skills.";
            recommendedPackage = "Advanced";
        } else if (performanceLevel === 'Good') {
            customMessage = "You're on the right track! With more practice, you can significantly improve your score.";
            recommendedPackage = "Comprehensive";
        } else {
            customMessage = "With structured practice and expert guidance, you can dramatically improve your performance.";
            recommendedPackage = "Foundation";
        }
        
        // Create promo content
        promoContainer.innerHTML = `
            <div class="promo-content">
                <div class="promo-close"><i class="fas fa-times"></i></div>
                <div class="promo-header">
                    <div class="promo-badge">RECOMMENDED</div>
                    <h2>Elevate Your JEE Preparation</h2>
                </div>
                
                <p class="promo-message">${customMessage}</p>
                
                <div class="promo-features">
                    <div class="promo-feature">
                        <div class="feature-icon"><i class="fas fa-book"></i></div>
                        <div class="feature-text">
                            <h3>Full-Length Mock Tests</h3>
                            <p>Access 50+ JEE pattern tests with real exam environment</p>
                        </div>
                    </div>
                    
                    <div class="promo-feature">
                        <div class="feature-icon"><i class="fas fa-lightbulb"></i></div>
                        <div class="feature-text">
                            <h3>Detailed Solutions</h3>
                            <p>Step-by-step explanations for every question</p>
                        </div>
                    </div>
                    
                    <div class="promo-feature">
                        <div class="feature-icon"><i class="fas fa-chart-line"></i></div>
                        <div class="feature-text">
                            <h3>Performance Analytics</h3>
                            <p>Track your progress with advanced analytics</p>
                        </div>
                    </div>
                    
                    <div class="promo-feature">
                        <div class="feature-icon"><i class="fas fa-user-graduate"></i></div>
                        <div class="feature-text">
                            <h3>Expert Guidance</h3>
                            <p>Get personalized feedback from JEE experts</p>
                        </div>
                    </div>
                </div>
                
                <div class="promo-package">
                    <div class="package-badge">RECOMMENDED FOR YOU</div>
                    <h3>${recommendedPackage} Package</h3>
                    <div class="package-price">
                        <span class="original-price">₹4,999</span>
                        <span class="discounted-price">₹2,999</span>
                        <span class="discount-badge">40% OFF</span>
                    </div>
                    <p class="package-description">Based on your performance, we recommend our ${recommendedPackage} Package to help you achieve your target score.</p>
                </div>
                
                <div class="promo-actions">
                    <button class="promo-btn primary-btn">Upgrade to Premium</button>
                    <button class="promo-btn secondary-btn">Learn More</button>
                </div>
                
                <div class="promo-testimonial">
                    <div class="testimonial-quote">"The mock tests were incredibly helpful. My JEE Main rank improved by 2000+ positions!"</div>
                    <div class="testimonial-author">— Rahul S., JEE 2023 Qualifier</div>
                </div>
            </div>
        `;
        
        // Add promo container to the body
        document.body.appendChild(promoContainer);
        
        // Add animation class after a small delay to trigger entrance animation
        setTimeout(() => {
            promoContainer.classList.add('active');
        }, 100);
        
        // Add event listener to close button
        promoContainer.querySelector('.promo-close').addEventListener('click', function() {
            promoContainer.classList.remove('active');
            setTimeout(() => {
                promoContainer.remove();
            }, 500);
        });
        
        // Add event listeners to buttons
        promoContainer.querySelector('.primary-btn').addEventListener('click', function() {
            alert('Redirecting to premium subscription page...');
            // In a real implementation, this would redirect to a payment page
        });
        
        promoContainer.querySelector('.secondary-btn').addEventListener('click', function() {
            alert('Redirecting to learn more about our test series...');
            // In a real implementation, this would redirect to an info page
        });
    }
    
    // Initialize the first question as not answered
    const firstQuestionBtn = document.querySelector('.q-btn.active');
    if (firstQuestionBtn) {
        firstQuestionBtn.classList.add('not-answered');
    }
    
    // Show only Physics questions initially
    showQuestionsForSubject('PHYSICS');
    
    // Update initial status counts
    updateStatusCounts();
    
    // Language selector functionality
    const languageSelector = document.getElementById('language');
    
    languageSelector.addEventListener('change', function() {
        alert(`Language changed to ${this.value}. The paper will be displayed in ${this.value}.`);
    });
});

// Registration form handling - moved outside the DOMContentLoaded event
function handleRegistration(event) {
    event.preventDefault();
    
    // Get form values
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const testName = document.getElementById('test-name').value;
    const declaration = document.getElementById('declaration').checked;
    
    // Validate form
    if (!name || !email || !testName) {
        alert('Please fill in all required fields');
        return;
    }
    
    if (!declaration) {
        alert('Please accept the declaration to proceed');
        return;
    }
    
    // Store user details in localStorage
    localStorage.setItem('userName', name);
    localStorage.setItem('userEmail', email);
    localStorage.setItem('testName', testName);
    
    // Show loading message
    const form = document.getElementById('registration-form');
    if (form) {
        form.innerHTML = '<div style="text-align: center; padding: 2rem;"><h3>Loading your test...</h3><p>Please wait while we prepare your test environment.</p></div>';
    }
    
    // Redirect to test page after a short delay (simulates loading)
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1500);
}

// Display user details on test page - moved outside the DOMContentLoaded event
function displayUserDetails() {
    const userName = localStorage.getItem('userName');
    const testName = localStorage.getItem('testName');
    
    if (userName && document.getElementById('display-name')) {
        document.getElementById('display-name').textContent = userName;
    } else if (document.getElementById('display-name')) {
        document.getElementById('display-name').textContent = "[Your Name]";
    }
    
    if (testName && document.getElementById('display-test')) {
        document.getElementById('display-test').textContent = testName;
    } else if (document.getElementById('display-test')) {
        document.getElementById('display-test').textContent = "[Test Practice]";
    }
}

// Call displayUserDetails when the document is ready
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the test page
    if (window.location.pathname.includes('index.html') || 
        window.location.pathname.endsWith('/') || 
        window.location.pathname.endsWith('/TEST%20Sereis/')) {
        displayUserDetails();
    }
}); 
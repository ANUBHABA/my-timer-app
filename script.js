let startDate;
let timerInterval;
let streakHistory = []; // Array to hold streak history

// Helper function to format time duration into a readable string
function formatDuration(timeDiff) {
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

    return `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`;
}

// Update timer function
function updateTimer() {
    const now = new Date();
    const timeDiff = now - startDate;
    document.getElementById("timer").textContent = formatDuration(timeDiff);
}

// Button Click Handling
document.querySelectorAll('.start-button').forEach(button => {
    button.addEventListener('click', function() {
        // Remove active class from all buttons
        document.querySelectorAll('.start-button').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Add active class to the clicked button
        this.classList.add('active');

        const startDateTimeInput = document.getElementById("startDateTime");

        if (this.id === "startNow") {
            startDate = new Date();  // Start from now
            startDateTimeInput.style.display = "none"; // Hide datetime input
            startTimer(); // Start the timer directly
        } else if (this.id === "pickDate") {
            startDateTimeInput.style.display = "block"; // Show datetime input
            startDateTimeInput.value = ""; // Clear previous value
            flatpickr("#startDateTime", {
                enableTime: true,
                dateFormat: "Y-m-d H:i",
                onClose: function(selectedDates) {
                    if (selectedDates.length) {
                        startDate = selectedDates[0]; // Set the selected date
                        startTimer(); // Start the timer immediately
                    }
                }
            });
        }
    });
});

// Start Timer function
function startTimer() {
    clearInterval(timerInterval);  // Clear any existing intervals
    timerInterval = setInterval(updateTimer, 1000);  // Start the timer
}

// Reset Timer and Show Streak
document.getElementById("resetButton").addEventListener("click", function() {
    clearInterval(timerInterval);

    const now = new Date();
    const timeDiff = now - startDate;
    const streakDuration = formatDuration(timeDiff);
    
    // Add streak duration to history
    streakHistory.push(streakDuration);
    
    document.getElementById("timer").textContent = `Streak ended! Your streak was: ${streakDuration}`;
    updateStreaksDisplay(); // Update the displayed streaks
});

// Clear Streak Button
document.getElementById("clearStreaksButton").addEventListener("click", function() {
    // Clear the streaks array
    streakHistory = [];
    
    // Update the displayed streaks list
    updateStreaksDisplay();
});

// Function to update streaks display
function updateStreaksDisplay() {
    const recentStreaksList = document.getElementById("recentStreaksList");
    recentStreaksList.innerHTML = ''; // Clear the current list

    // Populate the list with current streaks
    streakHistory.forEach(streak => {
        const listItem = document.createElement('li');
        listItem.textContent = streak;
        recentStreaksList.appendChild(listItem);
    });
}

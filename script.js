let startDate;
let timerInterval;
let streaks = [];

// Helper function to format time duration into a readable string
function formatDuration(timeDiff) {
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

    return `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`;
}

// Load saved timer state and streak history from localStorage
function loadTimer() {
    const savedStartDate = localStorage.getItem('startDate');
    if (savedStartDate) {
        startDate = new Date(savedStartDate);
        startTimer();
    }

    const savedStreaks = localStorage.getItem('streaks');
    if (savedStreaks) {
        streaks = JSON.parse(savedStreaks);
        displayStreaks();
    }
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
            localStorage.setItem('startDate', startDate); // Save to localStorage
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
                        localStorage.setItem('startDate', startDate); // Save to localStorage
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
    localStorage.removeItem('startDate'); // Remove from localStorage

    const now = new Date();
    const timeDiff = now - startDate;
    const streakDuration = formatDuration(timeDiff);

    // Save the streak
    streaks.push(streakDuration);
    localStorage.setItem('streaks', JSON.stringify(streaks)); // Save streaks to localStorage
    displayStreaks(); // Update the displayed streaks

    document.getElementById("timer").textContent = `Streak ended! Your streak was: ${streakDuration}`;
});

// Clear all streaks from localStorage
document.getElementById("clearStreaksButton").addEventListener("click", function() {
    localStorage.removeItem('streaks'); // Clear streak history from localStorage
    streaks = []; // Reset streaks array
    document.getElementById("recentStreaksList").innerHTML = ""; // Clear displayed streaks
});

// Function to display streaks
function displayStreaks() {
    const streakListElement = document.getElementById("recentStreaksList");
    streakListElement.innerHTML = ""; // Clear previous streaks

    // Limit to 10 streaks
    const recentStreaks = streaks.slice(-10);

    recentStreaks.forEach(streak => {
        const listItem = document.createElement("li");
        listItem.textContent = streak;
        streakListElement.appendChild(listItem);
    });
}

// Load timer on page load
loadTimer();

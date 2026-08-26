// Core Game Logic Orchestrator
document.addEventListener('DOMContentLoaded', () => {
    let currentLevelIndex = 0;
    let timerInterval = null;
    let timeRemaining = 0;

    UI.elements.themeBtn.addEventListener('click', () => UI.toggleTheme());
    UI.elements.nextBtn.addEventListener('click', () => loadNextLevel());

    function startLevel() {
        const puzzle = PuzzleData[currentLevelIndex];
        Analytics.resetTimer();
        
        UI.renderPuzzle(puzzle, handleItemSelect);
        UI.updateStats(currentLevelIndex + 1, Analytics.getDetectedBias(), null);

        clearInterval(timerInterval);
        if (puzzle.hasTimer) {
            timeRemaining = puzzle.timerSeconds;
            UI.updateStats(currentLevelIndex + 1, Analytics.getDetectedBias(), timeRemaining);
            
            timerInterval = setInterval(() => {
                timeRemaining--;
                UI.updateStats(currentLevelIndex + 1, Analytics.getDetectedBias(), timeRemaining);

                if (timeRemaining <= 0) {
                    clearInterval(timerInterval);
                    handleTimeout(puzzle);
                }
            }, 1000);
        }
    }

    function handleItemSelect(item, index) {
        const puzzle = PuzzleData[currentLevelIndex];
        const timeTaken = Date.now() - Analytics.firstClickTime;
        
        Analytics.trackClick(item, timeTaken);
        UI.updateStats(currentLevelIndex + 1, Analytics.getDetectedBias(), timeRemaining);

        const isCorrect = puzzle.evaluate(item, index);

        if (isCorrect) {
            clearInterval(timerInterval);
            UI.showFeedback(true, "Correct. The rule shifted.");
        } else {
            UI.showFeedback(false, "❌ Wrong. Try again.");
        }
    }

    function handleTimeout(puzzle) {
        // Special condition for puzzles where waiting is the key
        if (puzzle.id === 3) {
            UI.showFeedback(true, "Correct. Doing nothing was the solution.");
        } else {
            UI.showFeedback(false, "Time expired!");
        }
    }

    function loadNextLevel() {
        currentLevelIndex++;
        if (currentLevelIndex < PuzzleData.length) {
            startLevel();
        } else {
            UI.elements.instruction.innerText = "YOU COMPLETED THE DEMO.";
            UI.elements.grid.innerHTML = '';
            UI.showFeedback(true, "The game now understands how you think.");
        }
    }

    // Launch initial level
    startLevel();
});

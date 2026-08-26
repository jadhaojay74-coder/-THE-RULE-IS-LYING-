document.addEventListener('DOMContentLoaded', () => {
    let currentLevelIndex = 1;
    let timerInterval = null;
    let timeRemaining = 0;
    let levelStartTime = 0;
    let currentPuzzle = null;

    const generator = new InfiniteRuleGenerator(window.profiler);

    UI.elements.themeBtn.addEventListener('click', () => UI.toggleTheme());
    
    // Wire up NEXT button (handles both normal advancement & UI meta puzzles)
    UI.elements.nextBtn.addEventListener('click', () => {
        if (currentPuzzle && currentPuzzle.isMetaLevel) {
            handlePuzzleEvaluation(null, -1, 'NEXT_CLICK');
        } else {
            loadNextLevel();
        }
    });

    function startLevel() {
        currentPuzzle = generator.generateLevel(currentLevelIndex);
        levelStartTime = Date.now();
        
        UI.renderPuzzle(currentPuzzle, (item, idx) => handlePuzzleEvaluation(item, idx, 'GRID_CLICK'));
        UI.updateStats(currentLevelIndex, window.profiler.getDominantTrait(), null);

        // Enable NEXT button if it's a Meta UI puzzle
        if (currentPuzzle.isMetaLevel) {
            UI.elements.nextBtn.disabled = false;
        }

        clearInterval(timerInterval);
        if (currentPuzzle.hasTimer) {
            timeRemaining = currentPuzzle.timerSeconds;
            UI.updateStats(currentLevelIndex, window.profiler.getDominantTrait(), timeRemaining);
            
            timerInterval = setInterval(() => {
                timeRemaining--;
                UI.updateStats(currentLevelIndex, window.profiler.getDominantTrait(), timeRemaining);

                if (timeRemaining <= 0) {
                    clearInterval(timerInterval);
                    handleTimeout();
                }
            }, 1000);
        }
    }

    function handlePuzzleEvaluation(item, index, actionType) {
        const timeTakenMs = Date.now() - levelStartTime;
        const isCorrect = currentPuzzle.evaluate(item, index, actionType);

        window.profiler.recordAttempt({
            timeTakenMs,
            chosenItemIndex: index,
            itemWasVisualBait: item ? !!item.isBait : false,
            timedOut: false
        });

        if (isCorrect) {
            clearInterval(timerInterval);
            UI.showFeedback(true, `Correct! ${currentPuzzle.explanation}`);
        } else {
            UI.showFeedback(false, "❌ Wrong. The rule shifted. Try again.");
        }
    }

    function handleTimeout() {
        if (currentPuzzle.isDoNothingLevel) {
            window.profiler.recordAttempt({ timeTakenMs: 5000, chosenItemIndex: -1, itemWasVisualBait: false, timedOut: false });
            UI.showFeedback(true, `Correct! ${currentPuzzle.explanation}`);
        } else {
            window.profiler.recordAttempt({ timeTakenMs: 0, chosenItemIndex: -1, itemWasVisualBait: false, timedOut: true });
            UI.showFeedback(false, "⏰ Time expired!");
        }
    }

    function loadNextLevel() {
        currentLevelIndex++;
        startLevel();
    }

    startLevel();
});

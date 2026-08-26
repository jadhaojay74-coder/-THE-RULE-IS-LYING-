// Handles rendering and UI DOM mutations
const UI = {
    elements: {
        themeBtn: document.getElementById('theme-toggle-btn'),
        levelVal: document.getElementById('level-val'),
        timerVal: document.getElementById('timer-val'),
        biasVal: document.getElementById('bias-val'),
        instruction: document.getElementById('instruction-box'),
        grid: document.getElementById('puzzle-grid'),
        feedback: document.getElementById('feedback-msg'),
        nextBtn: document.getElementById('next-btn')
    },

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', nextTheme);
    },

    renderPuzzle(puzzle, onSelectCallback) {
        this.elements.grid.innerHTML = '';
        this.elements.instruction.innerText = puzzle.instruction;
        this.elements.feedback.innerText = '';
        this.elements.feedback.className = 'feedback';
        this.elements.nextBtn.disabled = true;

        puzzle.items.forEach((item, index) => {
            const el = document.createElement('div');
            el.className = 'grid-item';
            el.innerText = item.label;
            el.addEventListener('click', () => onSelectCallback(item, index));
            this.elements.grid.appendChild(el);
        });
    },

    showFeedback(isCorrect, message) {
        this.elements.feedback.innerText = message;
        this.elements.feedback.className = `feedback ${isCorrect ? 'correct' : 'wrong'}`;
        if (isCorrect) {
            this.elements.nextBtn.disabled = false;
        }
    },

    updateStats(level, bias, time) {
        this.elements.levelVal.innerText = level;
        this.elements.biasVal.innerText = bias;
        this.elements.timerVal.innerText = time !== null ? `${time}s` : '--';
    }
};

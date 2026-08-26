class AIProfiler {
    constructor() {
        this.history = [];
        this.stats = {
            avgReactionTimeMs: 0,
            visualBaitClicks: 0,
            firstIndexClicks: 0, // Top-left / early choices
            timeoutFails: 0,
            totalLevelsPlayed: 0
        };
        this.currentProfile = "Profiling...";
    }

    recordAttempt({ timeTakenMs, chosenItemIndex, itemWasVisualBait, timedOut }) {
        this.stats.totalLevelsPlayed++;
        
        if (timedOut) {
            this.stats.timeoutFails++;
        } else {
            // Rolling average of speed
            const prevTotal = this.stats.avgReactionTimeMs * (this.stats.totalLevelsPlayed - 1);
            this.stats.avgReactionTimeMs = (prevTotal + timeTakenMs) / this.stats.totalLevelsPlayed;
        }

        if (itemWasVisualBait) this.stats.visualBaitClicks++;
        if (chosenItemIndex === 0 || chosenItemIndex === 1) this.stats.firstIndexClicks++;

        this.updateProfile();
    }

    updateProfile() {
        if (this.stats.totalLevelsPlayed < 3) {
            this.currentProfile = "Profiling...";
            return;
        }

        const visualRatio = this.stats.visualBaitClicks / this.stats.totalLevelsPlayed;
        const speed = this.stats.avgReactionTimeMs;
        const indexRatio = this.stats.firstIndexClicks / this.stats.totalLevelsPlayed;

        if (visualRatio > 0.5) {
            this.currentProfile = "Visually Impulsive";
        } else if (speed > 4000) {
            this.currentProfile = "Analytical Overthinker";
        } else if (indexRatio > 0.4) {
            this.currentProfile = "Top-Left Bias";
        } else if (speed < 1200) {
            this.currentProfile = "Hasty Clicker";
        } else {
            this.currentProfile = "Adaptive Thinker";
        }
    }

    getDominantTrait() {
        return this.currentProfile;
    }
}

window.profiler = new AIProfiler();

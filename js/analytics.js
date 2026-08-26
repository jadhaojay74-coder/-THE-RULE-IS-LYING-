// Tracks player habits and builds psychological profile
const Analytics = {
    firstClickTime: null,
    totalClicks: 0,
    visualClickCount: 0,
    quickClickCount: 0,

    resetTimer() {
        this.firstClickTime = Date.now();
    },

    trackClick(item, timeTakenMs) {
        this.totalClicks++;

        // Track fast response bias (< 1.5 seconds)
        if (timeTakenMs < 1500) {
            this.quickClickCount++;
        }

        // Track visual bias (selecting colorful or distinct shapes)
        if (item.isVisuallyObvious) {
            this.visualClickCount++;
        }
    },

    getDetectedBias() {
        if (this.totalClicks < 2) return "Profiling...";
        if (this.quickClickCount / this.totalClicks > 0.6) return "Impulsive";
        if (this.visualClickCount / this.totalClicks > 0.5) return "Visual Priority";
        return "Analytical";
    }
};

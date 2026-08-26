class InfiniteRuleGenerator {
    constructor(profiler) {
        this.profiler = profiler;
        this.shapes = ['🔴', '🔵', '🟢', '🟡', '🔺', '🟦', '⬛', '⭐', '💎', '⚙️'];
        this.numbers = [3, 7, 12, 16, 21, 30, 42, 55, 68, 99];
    }

    generateLevel(levelNum) {
        const playerTrait = this.profiler.getDominantTrait();

        // 1. UI Subversion Levels (Every 5th level)
        if (levelNum % 5 === 0) {
            return this.buildUISubversionLevel(levelNum);
        }

        // 2. Counter-Play Generation based on AI Profile
        if (playerTrait === "Visually Impulsive") {
            return this.buildAntiVisualLevel(levelNum);
        } else if (playerTrait === "Analytical Overthinker") {
            return this.buildStallOrSimpleLevel(levelNum);
        } else if (playerTrait === "Top-Left Bias") {
            return this.buildAntiPositionLevel(levelNum);
        }

        // 3. Random Procedural Fallback
        return this.buildStandardProceduralLevel(levelNum);
    }

    buildAntiVisualLevel(levelNum) {
        // Embed an obvious shiny item as visual bait, but make the rule position/parity based
        const baitIndex = Math.floor(Math.random() * 6);
        const correctIndex = (baitIndex + 3) % 6;

        const items = Array.from({ length: 6 }, (_, i) => ({
            label: i === baitIndex ? "⭐" : "⬛",
            value: i,
            isBait: i === baitIndex
        }));

        return {
            id: levelNum,
            instruction: "Find the anomaly.",
            items: items,
            evaluate: (item, idx) => idx === correctIndex,
            explanation: "The star was a trap. The answer was index position " + (correctIndex + 1) + "."
        };
    }

    buildAntiPositionLevel(levelNum) {
        // Force player away from early items
        const items = this.numbers.slice(0, 6).map((num, i) => ({
            label: String(num),
            value: num,
            isBait: i < 2
        }));

        return {
            id: levelNum,
            instruction: "Select the odd number out.",
            items: items,
            evaluate: (item, idx) => idx === 5,
            explanation: "The sequence was irrelevant. The rule was selecting the last element."
        };
    }

    buildStallOrSimpleLevel(levelNum) {
        // "Do Nothing" level for overthinkers
        return {
            id: levelNum,
            instruction: "Do not move. 5-second silence required.",
            hasTimer: true,
            timerSeconds: 5,
            items: this.shapes.slice(0, 6).map(s => ({ label: s, value: s, isBait: false })),
            evaluate: () => false, // Clicking anything fails
            isDoNothingLevel: true,
            explanation: "The instruction meant literally do nothing!"
        };
    }

    buildUISubversionLevel(levelNum) {
        return {
            id: levelNum,
            instruction: "The answer is not on the board.",
            items: this.shapes.slice(0, 6).map(s => ({ label: s, value: s, isBait: false })),
            isMetaLevel: true,
            evaluate: (item, idx, actionType) => actionType === 'NEXT_CLICK',
            explanation: "The grid was locked. Clicking NEXT was the true input."
        };
    }

    buildStandardProceduralLevel(levelNum) {
        const randomTarget = Math.floor(Math.random() * 6);
        const items = this.shapes.sort(() => 0.5 - Math.random()).slice(0, 6).map((s, i) => ({
            label: s,
            value: s,
            isBait: i === 0
        }));

        return {
            id: levelNum,
            instruction: "Select the object that does not belong.",
            items: items,
            evaluate: (item, idx) => idx === randomTarget,
            explanation: "Rule generated dynamically: Target item position shift."
        };
    }
}

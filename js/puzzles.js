// Puzzle repository & rules
const PuzzleData = [
    {
        id: 1,
        instruction: "Select the object that doesn't belong.",
        items: [
            { label: "🔴", value: "red-circle", isVisuallyObvious: false },
            { label: "🔵", value: "blue-circle", isVisuallyObvious: false },
            { label: "🟢", value: "green-circle", isVisuallyObvious: false },
            { label: "🟡", value: "yellow-circle", isVisuallyObvious: false },
            { label: "⭐", value: "star", isVisuallyObvious: true },
            { label: "🔺", value: "triangle", isVisuallyObvious: false }
        ],
        // The rule lies: star is visually obvious, but the real rule is picking the 3rd element
        evaluate: (item, index) => index === 2 
    },
    {
        id: 2,
        instruction: "Choose the odd number out.",
        items: [
            { label: "3", value: 3, isVisuallyObvious: false },
            { label: "8", value: 8, isVisuallyObvious: false },
            { label: "14", value: 14, isVisuallyObvious: false },
            { label: "21", value: 21, isVisuallyObvious: false },
            { label: "29", value: 29, isVisuallyObvious: false },
            { label: "38", value: 38, isVisuallyObvious: true }
        ],
        // Hidden rule: Select the number spelled with the fewest letters ("3" = T-H-R-E-E)
        evaluate: (item) => item.value === 3
    },
    {
        id: 3,
        instruction: "You have 10 seconds. Hurry up!",
        hasTimer: true,
        timerSeconds: 10,
        items: [
            { label: "A", value: "A" },
            { label: "B", value: "B" },
            { label: "C", value: "C" },
            { label: "D", value: "D" },
            { label: "E", value: "E" },
            { label: "F", value: "F" }
        ],
        // Hidden rule: DO NOTHING. Correct answer triggers on timeout.
        evaluate: () => false 
    }
];

document.addEventListener('DOMContentLoaded', () => {
    const textToTypeElement = document.getElementById('text-to-type');
    const inputField = document.getElementById('input-field');
    const timerElement = document.getElementById('timer');
    const speedElement = document.getElementById('speed');
    const accuracyElement = document.getElementById('accuracy');
    const scoreElement = document.getElementById('score');
    const startButton = document.getElementById('start-button');
    const resetButton = document.getElementById('reset-button');

    const keyboardKeys = {
        Q: document.getElementById('key-Q'),
        W: document.getElementById('key-W'),
        E: document.getElementById('key-E'),
        R: document.getElementById('key-R'),
        T: document.getElementById('key-T'),
        Y: document.getElementById('key-Y'),
        U: document.getElementById('key-U'),
        I: document.getElementById('key-I'),
        O: document.getElementById('key-O'),
        P: document.getElementById('key-P'),
        A: document.getElementById('key-A'),
        S: document.getElementById('key-S'),
        D: document.getElementById('key-D'),
        F: document.getElementById('key-F'),
        G: document.getElementById('key-G'),
        H: document.getElementById('key-H'),
        J: document.getElementById('key-J'),
        K: document.getElementById('key-K'),
        L: document.getElementById('key-L'),
        Z: document.getElementById('key-Z'),
        X: document.getElementById('key-X'),
        C: document.getElementById('key-C'),
        V: document.getElementById('key-V'),
        B: document.getElementById('key-B'),
        N: document.getElementById('key-N'),
        M: document.getElementById('key-M'),
        SPACE: document.getElementById('key-SPACE'),
        BACKSPACE: document.getElementById('key-BACKSPACE'),
        SHIFT: document.getElementById('key-SHIFT')
    };

    let startTime, endTime, timerInterval, correctCharacters, totalCharacters, currentText;
    const texts = [
        "The quick brown fox jumps over the lazy dog.",
        "Pack my box with five dozen liquor jugs.",
        "How razorback-jumping frogs can level six piqued gymnasts!",
        "Jinxed wizards pluck ivy from the big quilt.",
        "Sphinx of black quartz, judge my vow.",
        "Bright vixens jump; dozy fowl quack.",
        "Jinxed wizards pluck ivy from the big quilt.",
        "The five boxing wizards jump quickly.",
        "We promptly judged antique ivory buckles for the next prize.",
        "fd fdf df hh vb gg surg rehj rierhu fdgih dfg dfgjdf dfgh dfg."
    ];

    function startGame() {
        inputField.value = '';
        inputField.disabled = false;
        correctCharacters = 0;
        totalCharacters = 0;
        currentText = texts[Math.floor(Math.random() * texts.length)];
        textToTypeElement.textContent = currentText;
        textToTypeElement.innerHTML = currentText.split('').map(char => `<span>${char}</span>`).join('');
        inputField.focus();
        startTime = new Date();
        timerElement.textContent = `Time: 0s`;
        speedElement.textContent = `Speed: 0 WPM`;
        accuracyElement.textContent = `Accuracy: 100%`;
        scoreElement.textContent = `Score: 0`;

        clearInterval(timerInterval);
        timerInterval = setInterval(updateTimer, 1000);

        // End game after 5 minutes (300 seconds)
        setTimeout(() => {
            endTime = new Date();
            clearInterval(timerInterval);
            inputField.disabled = true;
            calculateScores();
            showResults();
        }, 300000); // 5 minutes
    }

    function updateTimer() {
        const elapsedTime = Math.floor((new Date() - startTime) / 1000);
        timerElement.textContent = `Time: ${elapsedTime}s`;
    }

    function updateText() {
        const typedText = inputField.value;
        let newHtml = '';

        for (let i = 0; i < currentText.length; i++) {
            if (typedText[i] === undefined) {
                newHtml += `<span>${currentText[i]}</span>`;
            } else if (typedText[i] === currentText[i]) {
                correctCharacters++;
                newHtml += `<span class="highlight">${currentText[i]}</span>`;
                if (keyboardKeys[typedText[i].toUpperCase()]) {
                    simulateKeyPress(typedText[i].toUpperCase());
                }
            } else {
                newHtml += `<span class="incorrect">${currentText[i]}</span>`;
            }
            totalCharacters++;
        }

        textToTypeElement.innerHTML = newHtml;

        if (typedText === currentText) {
            endTime = new Date();
            clearInterval(timerInterval);
            inputField.disabled = true;
            calculateScores();
            showResults();
        }
    }

    function simulateKeyPress(key) {
        // Remove 'active' class from all keys
        for (const k in keyboardKeys) {
            keyboardKeys[k].classList.remove('active');
        }

        // Add 'active' class to the currently pressed key
        if (keyboardKeys[key]) {
            const keyElement = keyboardKeys[key];
            keyElement.classList.add('active');
            setTimeout(() => {
                keyElement.classList.remove('active');
            }, 100);
        }
    }

    function calculateWords(text) {
        return text.trim().split(/\s+/).length;
    }

    function calculateScores() {
        const elapsedTime = Math.floor((endTime - startTime) / 1000);
        const wordsTyped = calculateWords(inputField.value);
        const wpm = Math.round(wordsTyped / (elapsedTime / 60));
        const accuracy = Math.round((correctCharacters / totalCharacters) * 100);
        const score = wpm * accuracy;

        speedElement.textContent = `Speed: ${wpm} WPM`;
        accuracyElement.textContent = `Accuracy: ${accuracy}%`;
        scoreElement.textContent = `Score: ${score}`;
    }

    function showResults() {
        const score = scoreElement.textContent.split(': ')[1];
        swal({
            title: "Time's Up!",
            text: `Your score is ${score}.`,
            icon: "info",
            buttons: {
                restart: {
                    text: "Restart the Game",
                    value: "restart"
                },
                ok: true
            }
        }).then((value) => {
            if (value === "restart") {
                location.reload(); // Refresh the page
            }
            // "ok" does nothing but hides the popup
        });
    }

    function handleKeyPress(event) {
        const key = event.key.toUpperCase();

        // Handle special keys (spacebar, backspace, shift)
        if (key === ' ') {
            simulateKeyPress('SPACE');
        } else if (key === 'BACKSPACE') {
            simulateKeyPress('BACKSPACE');
        } else if (key === 'SHIFT') {
            simulateKeyPress('SHIFT');
        } else if (keyboardKeys[key]) {
            simulateKeyPress(key);
        }
    }

    inputField.addEventListener('input', updateText);
    document.addEventListener('keydown', handleKeyPress);

    startButton.addEventListener('click', startGame);

    resetButton.addEventListener('click', () => {
        location.reload(); // Refresh the page
    });

    // Automatically start the game when the page loads
    startGame();
});

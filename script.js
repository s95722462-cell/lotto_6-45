document.addEventListener('DOMContentLoaded', () => {
    const drawButton = document.getElementById('draw-button');
    const numbersDisplay = document.getElementById('numbers-display');
    // Removed: const bonusDisplay = document.getElementById('bonus-display');

    // New elements for input modal
    const inputModal = document.getElementById('input-modal');
    const investmentAmountInput = document.getElementById('investment-amount');
    const confirmInvestmentButton = document.getElementById('confirm-investment');
    const cancelInvestmentButton = document.getElementById('cancel-investment');

    // Event listener for the main draw button
    drawButton.addEventListener('click', () => {
        showInputModal();
    });

    // Event listeners for input modal buttons
    confirmInvestmentButton.addEventListener('click', () => {
        const amount = parseInt(investmentAmountInput.value.replace(/,/g, '')); // Remove commas before parsing
        if (isNaN(amount) || amount <= 0 || amount % 1000 !== 0) {
            alert('유효한 금액을 입력해주세요. (1000원 단위)');
            return;
        }
        const numberOfLines = amount / 1000;
        hideInputModal();
        generateLottoLines(numberOfLines);
    });

    cancelInvestmentButton.addEventListener('click', () => {
        hideInputModal();
    });

    // Input formatting for investment amount
    investmentAmountInput.addEventListener('input', (event) => {
        let value = event.target.value.replace(/[^\d]/g, ''); // Remove non-digits
        if (value) {
            event.target.value = parseInt(value).toLocaleString('ko-KR');
        }
    });

    function showInputModal() {
        inputModal.classList.add('show');
        investmentAmountInput.value = ''; // Clear previous input
        investmentAmountInput.focus();
    }

    function hideInputModal() {
        inputModal.classList.remove('show');
    }

    function getBallColor(number) {
        if (number <= 10) return 'color-1';
        if (number <= 20) return 'color-2';
        if (number <= 30) return 'color-3';
        if (number <= 40) return 'color-4';
        return 'color-5';
    }

    function generateLottoLines(linesToGenerate, currentLineIndex = 0) {
        // Base case: All lines generated
        if (currentLineIndex >= linesToGenerate) {
            drawButton.disabled = false; // Re-enable button
            // Optionally show "이번 주 주인공은 당신입니다" popup after all lines are drawn
            // showAnimatedPopup("이번 주 주인공은 당신입니다");
            return;
        }

        // Clear display only for the very first call
        if (currentLineIndex === 0) {
            numbersDisplay.innerHTML = '';
            // Removed: bonusDisplay.innerHTML = '';
            drawButton.disabled = true; // Disable button at the start of the whole process
        }

        const lineContainer = document.createElement('div');
        lineContainer.className = 'lotto-line-container';
        numbersDisplay.appendChild(lineContainer); // Append to numbersDisplay

        const lineLabel = document.createElement('div');
        lineLabel.className = 'line-label';
        lineLabel.textContent = `${currentLineIndex + 1}번째 줄:`;
        lineContainer.appendChild(lineLabel);

        const lineNumbersDisplay = document.createElement('div');
        lineNumbersDisplay.className = 'line-numbers-display';
        lineContainer.appendChild(lineNumbersDisplay);

        // Removed: const lineBonusDisplay = document.createElement('div');
        // Removed: lineBonusDisplay.className = 'line-bonus-display';
        // Removed: lineContainer.appendChild(lineBonusDisplay);

        const numbers = new Set();
        while (numbers.size < 6) { // Changed from 7 to 6
            const rand = Math.floor(Math.random() * 45) + 1;
            numbers.add(rand);
        }

        const lottoNumbers = Array.from(numbers);
        const winningNumbers = lottoNumbers.slice(0, 6).sort((a, b) => a - b);
        // Removed: const bonusNumber = lottoNumbers[6];

        winningNumbers.forEach((number, index) => {
            const delay = 2000 + (index * 3000); // 2s for first, then 3s intervals
            setTimeout(() => {
                const ball = document.createElement('div');
                ball.className = `ball ${getBallColor(number)}`;
                ball.textContent = number;
                lineNumbersDisplay.appendChild(ball);
            }, delay);
        });

        const lastBallDisplayTime = 2000 + (5 * 3000); // 2s (first) + 5*3s (next 5) = 17000ms

        setTimeout(() => {
            // Removed bonusLabel and bonus ball creation/appending
            // Removed: lineBonusDisplay.appendChild(bonusLabel);
            // Removed: lineBonusDisplay.appendChild(ball);

            // Schedule the next line generation after this line's animation is complete
            generateLottoLines(linesToGenerate, currentLineIndex + 1);

        }, lastBallDisplayTime);
    }

    function showAnimatedPopup(message) {
        const popupContainer = document.getElementById('animated-popup');
        const popupMessage = document.getElementById('popup-message');
        const popupCloseButton = document.getElementById('popup-close-button');

        popupMessage.textContent = message;
        popupContainer.classList.add('show');

        popupCloseButton.onclick = () => {
            popupContainer.classList.remove('show');
        };
    }
});
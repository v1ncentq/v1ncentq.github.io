(() => {
    // DOM Elements
    const DOM = {
        digitsInput: document.getElementById('digits'),
        positionInput: document.getElementById('position'),
        maxPositionSpan: document.getElementById('maxPosition'),
        errorDiv: document.getElementById('error'),
        resultSection: document.getElementById('result'),
        calculationSteps: document.getElementById('calculationSteps'),
        hiddenDigitOutput: document.getElementById('hiddenDigitOutput'),
        secretNumberOutput: document.getElementById('secretNumberOutput'),
        roundingRadios: document.querySelectorAll('input[name="rounding"]')
    };

    // Constants
    const MODIFIERS = { none: 0, first: 6, second: 3, both: 1 };
    const VALIDATION_RULES = {
        minDigits: 2,
        maxDigits: 5,
        minNumber: 0,
        maxNumber: 9
    };

    // Event Listeners
    const initEventListeners = () => {
        DOM.digitsInput.addEventListener('input', handleDigitsInput);
        DOM.roundingRadios.forEach(radio => {
            radio.addEventListener('change', handleRoundingChange);
        });
        document.querySelector('button').addEventListener('click', calculate);
    };

    // Input Handlers
    const handleDigitsInput = (e) => {
        const digits = e.target.value.split(',').filter(d => d.trim() !== '');
        DOM.maxPositionSpan.textContent = digits.length;
        DOM.positionInput.max = digits.length;
    };

    const handleRoundingChange = (e) => {
        console.log('Rounding changed to:', e.target.value);
    };

    // Validation
    const validateInput = (digits, position) => {
        const errors = [];
        
        if (digits.length < VALIDATION_RULES.minDigits || 
            digits.length > VALIDATION_RULES.maxDigits) {
            errors.push(`Мінімальна кількість цифр — ${VALIDATION_RULES.minDigits}`);
        }

        if (digits.some(d => d < VALIDATION_RULES.minNumber || 
                           d > VALIDATION_RULES.maxNumber)) {
            errors.push(`Цифри повинні бути від ${VALIDATION_RULES.minNumber} до ${VALIDATION_RULES.maxNumber}`);
        }

        if (position < 1 || position > digits.length) {
            errors.push('Невірний розряд прихованої цифри');
        }

        return errors;
    };

    // Calculations
    const calculateHiddenDigit = (digits, position, modifier) => {
        const hiddenIndex = position - 1;
        const knownSum = digits
            .filter((_, i) => i !== hiddenIndex)
            .reduce((a, b) => a + b, 0);
        
        const total = knownSum + modifier;
        const nextMultiple = Math.ceil(total / 9) * 9;
        return nextMultiple - total || 9;
    };

    const calculateSecretNumber = (knownSum, hiddenDigit, modifier) => {
        return Math.floor((knownSum + hiddenDigit + modifier) / 9 * 4);
    };

    // UI Effects
    const showResults = () => {
        DOM.resultSection.style.opacity = '0';
        DOM.resultSection.style.transform = 'translateY(20px)';
        
        requestAnimationFrame(() => {
            DOM.resultSection.style.transition = 'all 0.3s ease-out';
            DOM.resultSection.style.opacity = '1';
            DOM.resultSection.style.transform = 'translateY(0)';
        });

        DOM.resultSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
            inline: 'nearest'
        });
    };

    const showError = (messages) => {
        DOM.errorDiv.innerHTML = messages
            .map(msg => `<div class="error-message">${msg}</div>`)
            .join('');
        
        DOM.errorDiv.style.display = 'block';
        setTimeout(() => {
            DOM.errorDiv.style.opacity = '1';
        }, 10);
    };

    // Main Function
    const calculate = () => {
        // Reset UI
        DOM.errorDiv.innerHTML = '';
        DOM.errorDiv.style.display = 'none';

        // Get Input Values
        const digits = DOM.digitsInput.value
            .split(',')
            .map(d => parseInt(d.trim()))
            .filter(n => !isNaN(n));

        const position = parseInt(DOM.positionInput.value);
        const rounding = document.querySelector('input[name="rounding"]:checked').value;

        // Validate
        const errors = validateInput(digits, position);
        if (errors.length) {
            showError(errors);
            return;
        }

        // Calculations
        const modifier = MODIFIERS[rounding];
        const hiddenDigit = calculateHiddenDigit(digits, position, modifier);
        const secretNumber = calculateSecretNumber(
            digits.reduce((a, b) => a + b, 0) - digits[position-1],
            hiddenDigit,
            modifier
        );

        // Update UI
        DOM.hiddenDigitOutput.textContent = `Прихована цифра: ${hiddenDigit}`;
        DOM.secretNumberOutput.textContent = `Загадане число: ${secretNumber}`;
        
        DOM.calculationSteps.innerHTML = `
            <h3>Деталі обчислення:</h3>
            <p>Сума відомих цифр: ${knownSum}</p>
            <p>Модифікатор округлення: ${modifier}</p>
            <p>Сума з модифікатором: ${total}</p>
            <p>Найближче кратне 9: ${nextMultiple}</p>
            <p>Різниця: ${nextMultiple} - ${total} = ${hiddenDigit}</p>
            <p>Формула: (${allDigitsSum} + ${modifier}) / 9 × 4 = ${secretNumber}</p>
        `;

        showResults();
    };

    // Initialization
    const init = () => {
        initEventListeners();
        console.log('System initialized 🚀');
    };

    // Start App
    init();
})();
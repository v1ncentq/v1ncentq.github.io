const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints;

if(isTouchDevice) {
  document.body.classList.add('touch-device');
}

// Оновлення максимального розряду при зміні кількості цифр
document.getElementById('digits').addEventListener('input', function(e) {
    const digits = e.target.value.split(',').filter(d => d.trim() !== '');
    document.getElementById('maxPosition').textContent = digits.length;
    document.getElementById('position').max = digits.length;
});

// Підсвітка активних полів
document.querySelectorAll('input').forEach(input => {
    input.addEventListener('focus', () => {
        input.parentElement.style.transform = 'scale(1.02)';
    });
    input.addEventListener('blur', () => {
        input.parentElement.style.transform = 'scale(1)';
    });
});

// Анімація завантаження результатів
function showResults() {
    const resultSection = document.getElementById('result');
    resultSection.style.opacity = '0';
    resultSection.style.transform = 'translateY(20px)';
    setTimeout(() => {
        resultSection.style.opacity = '1';
        resultSection.style.transform = 'translateY(0)';
    }, 300);
}

// Викликати showResults() після обчислень
function calculate() {
        // Отримання даних
    const digitsInput = document.getElementById('digits').value;
    const position = parseInt(document.getElementById('position').value);
    const rounding = document.querySelector('input[name="rounding"]:checked').value;
    const errorDiv = document.getElementById('error');
    errorDiv.innerHTML = '';

    // Валідація введених даних
    const digits = digitsInput.split(',').map(d => parseInt(d.trim()));
    if (digits.length < 2 || digits.length > 5) {
        errorDiv.innerHTML = 'Мінімальна кількість цифр — 2';
        return;
    }
    if (digits.some(d => isNaN(d) || d < 0 || d > 9)) {
        errorDiv.innerHTML = 'Цифри повинні бути від 0 до 9';
        return;
    }
    if (isNaN(position) || position < 1 || position > digits.length) {
        errorDiv.innerHTML = 'Невірний розряд прихованої цифри';
        return;
    }

    // Визначення модифікатора округлення
    const modifiers = { none: 0, first: 6, second: 3, both: 1 };
    const modifier = modifiers[rounding];

    // Обчислення прихованої цифри
    const hiddenIndex = position - 1;
    const knownSum = digits.filter((_, i) => i !== hiddenIndex).reduce((a, b) => a + b, 0);
    const total = knownSum + modifier;
    const nextMultiple = Math.ceil(total / 9) * 9;
    let hiddenDigit = nextMultiple - total;
    hiddenDigit = hiddenDigit === 0 ? 9 : hiddenDigit;

    // Обчислення загаданого числа
    const allDigitsSum = knownSum + hiddenDigit;
    const secretNumber = Math.floor((allDigitsSum + modifier) / 9 * 4);

    // Виведення результатів
    document.getElementById('hiddenDigitOutput').textContent = `Прихована цифра: ${hiddenDigit}`;
    document.getElementById('secretNumberOutput').textContent = `Загадане число: ${secretNumber}`;

    // Деталізація обчислень
    const steps = `
        <h3>Деталі обчислення:</h3>
        <p>Сума відомих цифр: ${knownSum}</p>
        <p>Модифікатор округлення: ${modifier}</p>
        <p>Сума з модифікатором: ${total}</p>
        <p>Найближче кратне 9: ${nextMultiple}</p>
        <p>Різниця: ${nextMultiple} - ${total} = ${hiddenDigit}</p>
        <p>Формула загаданого числа: (${allDigitsSum} + ${modifier}) / 9 × 4 = ${secretNumber}</p>
    `;
    document.getElementById('calculationSteps').innerHTML = steps;
    showResults();
}


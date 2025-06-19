let currentLevel = 1;
const totalLevels = 100;
const progress = [];
const levelInfo = document.getElementById('level-info');
const question = document.getElementById('question');
const answerInput = document.getElementById('answer');
const submitButton = document.getElementById('submit');
const progressDiv = document.getElementById('progress');

function generateQuestion(level) {
    // Генерация вопроса на основе уровня. Например:
    // Уровень 1: 1 + 1
    // Уровень 2: 2 + 2 и так далее
    const a = level;
    const b = level; // простой пример: складываем уровень
    question.textContent = `Сколько будет ${a} + ${b}?`;
    return a + b; // правильный ответ
}

let correctAnswer = generateQuestion(currentLevel);

submitButton.addEventListener('click', () => {
    const userAnswer = parseInt(answerInput.value);
    if (userAnswer === correctAnswer) {
        currentLevel++;
        if (currentLevel > totalLevels) {
            alert('Поздравляем, вы прошли все уровни!');
        } else {
            correctAnswer = generateQuestion(currentLevel);
            levelInfo.textContent = `Уровень: ${currentLevel}`;
            progress.push(currentLevel);
            progressDiv.textContent = `Пройденные уровни: ${progress.join(', ')}`;
        }
    } else {
        alert('Неверный ответ! Вы вернётесь на 2 уровня назад.');
        currentLevel = Math.max(1, currentLevel - 2);
        correctAnswer = generateQuestion(currentLevel);
        levelInfo.textContent = `Уровень: ${currentLevel}`;
    }
});

// Логика для рисования на холсте
const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');
let drawing = false;
let isErasing = false;

canvas.addEventListener('mousedown', (e) => {
    drawing = true;
    ctx.beginPath();
    ctx.moveTo(e.offsetX, e.offsetY);
});

canvas.addEventListener('mousemove', (e) => {
    if (!drawing) return;
    if (isErasing) {
        ctx.clearRect(e.offsetX - 5, e.offsetY - 5, 10, 10); // Простая стерка
    } else {
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
    }
});

canvas.addEventListener('mouseup', () => {
    drawing = false;
});

document.getElementById('pencil').addEventListener('click', () => {
    isErasing = false;
    ctx.strokeStyle = 'black'; // Цвет карандаша
});

document.getElementById('eraser').addEventListener('click', () => {
    isErasing = true;
});
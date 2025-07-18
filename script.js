// Preguntas del juego
const questions = [
  {
    emoji: "🐄",
    question: "¿Qué animal hace 'muu'?",
    answers: ["Vaca 🐄", "Perro 🐕", "Gato 🐱"],
    correct: 0,
  },
  {
    emoji: "🌿",
    question: "¿De qué color son las hojas de los árboles?",
    answers: ["Verde 🌿", "Azul 💙", "Rojo ❤️"],
    correct: 0,
  },
  {
    emoji: "🐦",
    question: "¿Cuál de estos animales puede volar?",
    answers: ["Pájaro 🐦", "Pez 🐟", "Elefante 🐘"],
    correct: 0,
  },
  {
    emoji: "🐟",
    question: "¿Qué animal vive en el agua?",
    answers: ["Pez 🐟", "Gato 🐱", "Conejo 🐰"],
    correct: 0,
  },
  {
    emoji: "🍌",
    question: "¿Qué fruto viene del platanero?",
    answers: ["Plátano 🍌", "Manzana 🍎", "Uva 🍇"],
    correct: 0,
  },
  {
    emoji: "🐘",
    question: "¿Qué animal es muy grande y tiene trompa?",
    answers: ["Elefante 🐘", "Ratón 🐭", "Gato 🐱"],
    correct: 0,
  },
  {
    emoji: "🌹",
    question: "¿Cuál es una flor?",
    answers: ["Rosa 🌹", "León 🦁", "Pan 🍞"],
    correct: 0,
  },
  {
    emoji: "🐔",
    question: "¿Qué animal pone huevos?",
    answers: ["Gallina 🐔", "Perro 🐕", "Gato 🐱"],
    correct: 0,
  },
  {
    emoji: "🍎",
    question: "¿Qué árbol da manzanas?",
    answers: ["Manzano 🍎", "Pino 🌲", "Cactus 🌵"],
    correct: 0,
  },
  {
    emoji: "🦁",
    question: "¿Qué animal vive en la selva y es el 'rey'?",
    answers: ["León 🦁", "Loro 🦜", "Tigre 🐅"],
    correct: 0,
  },
  {
    emoji: "🐝",
    question: "¿Qué insecto hace miel?",
    answers: ["Abeja 🐝", "Mariposa 🦋", "Mosca 🪰"],
    correct: 0,
  },
  {
    emoji: "🐬",
    question: "¿Cuál de estos es un animal marino?",
    answers: ["Delfín 🐬", "León 🦁", "Caballo 🐴"],
    correct: 0,
  },
  {
    emoji: "🌵",
    question: "¿Qué planta es verde y tiene espinas?",
    answers: ["Cactus 🌵", "Girasol 🌻", "Pino 🌲"],
    correct: 0,
  },
  {
    emoji: "🐧",
    question: "¿Qué ave no puede volar?",
    answers: ["Pingüino 🐧", "Águila 🦅", "Paloma 🕊️"],
    correct: 0,
  },
  {
    emoji: "🍌",
    question: "¿Qué fruta es amarilla y curva?",
    answers: ["Plátano 🍌", "Sandía 🍉", "Uva 🍇"],
    correct: 0,
  },
]

// Variables del juego
let currentQuestion = 0
let score = 0
let gameStarted = false

// Elementos del DOM
const startScreen = document.getElementById("start-screen")
const gameScreen = document.getElementById("game-screen")
const endScreen = document.getElementById("end-screen")
const startBtn = document.getElementById("start-btn")
const playAgainBtn = document.getElementById("play-again-btn")
const questionEmoji = document.getElementById("question-emoji")
const questionText = document.getElementById("question-text")
const answerBtns = document.querySelectorAll(".answer-btn")
const feedback = document.getElementById("feedback")
const feedbackMessage = document.getElementById("feedback-message")
const currentQuestionSpan = document.getElementById("current-question")
const progressBar = document.getElementById("progress")
const finalScore = document.getElementById("final-score")

// Sonidos (usando Web Audio API)
function playSound(frequency, duration) {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)()
  const oscillator = audioContext.createOscillator()
  const gainNode = audioContext.createGain()

  oscillator.connect(gainNode)
  gainNode.connect(audioContext.destination)

  oscillator.frequency.value = frequency
  oscillator.type = "sine"

  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration)

  oscillator.start(audioContext.currentTime)
  oscillator.stop(audioContext.currentTime + duration)
}

function playCorrectSound() {
  playSound(523, 0.2) // Do
  setTimeout(() => playSound(659, 0.2), 100) // Mi
  setTimeout(() => playSound(784, 0.3), 200) // Sol
}

function playIncorrectSound() {
  playSound(200, 0.5)
}

// Funciones del juego
function startGame() {
  currentQuestion = 0
  score = 0
  gameStarted = true
  showScreen("game")
  loadQuestion()
}

function showScreen(screenName) {
  document.querySelectorAll(".screen").forEach((screen) => {
    screen.classList.remove("active")
  })

  if (screenName === "start") {
    startScreen.classList.add("active")
  } else if (screenName === "game") {
    gameScreen.classList.add("active")
  } else if (screenName === "end") {
    endScreen.classList.add("active")
  }
}

function loadQuestion() {
  const question = questions[currentQuestion]

  questionEmoji.textContent = question.emoji
  questionText.textContent = question.question
  currentQuestionSpan.textContent = currentQuestion + 1

  // Actualizar barra de progreso
  const progress = ((currentQuestion + 1) / questions.length) * 100
  progressBar.style.width = progress + "%"

  // Cargar respuestas
  answerBtns.forEach((btn, index) => {
    btn.textContent = question.answers[index]
    btn.disabled = false
    btn.style.opacity = "1"
  })

  // Ocultar feedback
  feedback.classList.add("hidden")
}

function selectAnswer(selectedIndex) {
  const question = questions[currentQuestion]
  const isCorrect = selectedIndex === question.correct

  // Deshabilitar botones
  answerBtns.forEach((btn) => {
    btn.disabled = true
  })

  // Mostrar feedback
  feedback.classList.remove("hidden")

  if (isCorrect) {
    score++
    feedback.className = "feedback correct stars"
    feedbackMessage.innerHTML = "¡Muy bien explorador! 🌟✨"
    playCorrectSound()
  } else {
    feedback.className = "feedback incorrect"
    feedbackMessage.innerHTML =
      "¡Intenta de nuevo! 🌱<br><small>La respuesta correcta era: " + question.answers[question.correct] + "</small>"
    playIncorrectSound()
  }

  // Continuar al siguiente
  setTimeout(() => {
    currentQuestion++
    if (currentQuestion < questions.length) {
      loadQuestion()
    } else {
      endGame()
    }
  }, 3000)
}

function endGame() {
  finalScore.innerHTML = `¡Respondiste correctamente ${score} de ${questions.length} preguntas! 🏆`
  showScreen("end")

  // Sonido de finalización
  setTimeout(() => playCorrectSound(), 500)
}

// Event listeners
startBtn.addEventListener("click", startGame)
playAgainBtn.addEventListener("click", startGame)

answerBtns.forEach((btn, index) => {
  btn.addEventListener("click", () => {
    if (gameStarted && !btn.disabled) {
      selectAnswer(index)
    }
  })
})

// Inicializar
showScreen("start")

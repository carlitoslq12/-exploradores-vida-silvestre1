// Variables globales
let currentLevel = 1
let currentGame = ""
let currentQuestions = []
let currentQuestion = 0
let score = 0
let gameStarted = false

// Configuración de juegos
const gameConfig = {
  1: {
    name: "Nivel 1",
    emojis: "🌲🐾",
    games: [
      { id: "quiz", name: "Preguntas", description: "Responde preguntas sobre fauna y flora", class: "quiz-btn" },
      {
        id: "classification",
        name: "Clasificación",
        description: "Clasifica elementos como fauna o flora",
        class: "classification-btn",
      },
      {
        id: "matching",
        name: "Emparejamiento",
        description: "Empareja animales con sus hábitats",
        class: "matching-btn",
      },
    ],
  },
  2: {
    name: "Nivel 2",
    emojis: "🌺🐍",
    games: [
      {
        id: "quiz",
        name: "Preguntas Avanzadas",
        description: "Responde preguntas más difíciles sobre biodiversidad",
        class: "quiz-btn",
      },
      {
        id: "classification",
        name: "Clasificación Avanzada",
        description: "Clasifica elementos más complejos",
        class: "classification-btn",
      },
      {
        id: "matching",
        name: "Emparejamiento Avanzado",
        description: "Empareja animales con hábitats más específicos",
        class: "matching-btn",
      },
    ],
  },
}

// Preguntas para el nivel 1
const level1Questions = [
  { question: "¿Cuál es el animal más grande de Colombia?", answers: ["Oso pardo", "Jirafa", "Elefante"], correct: 0 },
  {
    question: "¿Cuál es el árbol más alto de Colombia?",
    answers: ["Palma de cera", "Árbol de caoba", "Árbol de guayacán"],
    correct: 1,
  },
]

// Preguntas para el nivel 2
const level2Questions = [
  { question: "¿Cuál es el insecto más pequeño del mundo?", answers: ["Mosquito", "Mariposa", "Abra"], correct: 2 },
  { question: "¿Cuál es el pájaro más rápido del mundo?", answers: ["Águila", "Pavo real", "Ánade"], correct: 0 },
]

// Elementos para el juego de clasificación en nivel 1
const level1Classification = [
  { emoji: "🐶", name: "Perro", type: "fauna" },
  { emoji: "🌸", name: "Rosa", type: "flora" },
]

// Pares para el juego de emparejamiento en nivel 2
const level2Matching = [
  { animal: "Tigre", habitat: "Selva" },
  { animal: "Pinguino", habitat: "Antártida" },
]

// Elementos del DOM
const screens = {
  start: document.getElementById("start-screen"),
  gameSelection: document.getElementById("game-selection-screen"),
  quiz: document.getElementById("quiz-screen"),
  classification: document.getElementById("classification-screen"),
  matching: document.getElementById("matching-screen"),
  end: document.getElementById("end-screen"),
}

// Sonidos
function playSound(frequency, duration) {
  try {
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
  } catch (e) {
    console.log("Audio no disponible")
  }
}

function playCorrectSound() {
  playSound(523, 0.2)
  setTimeout(() => playSound(659, 0.2), 100)
  setTimeout(() => playSound(784, 0.3), 200)
}

function playIncorrectSound() {
  playSound(200, 0.5)
}

// Navegación entre pantallas
function showScreen(screenName) {
  Object.values(screens).forEach((screen) => {
    screen.classList.remove("active")
  })
  screens[screenName].classList.add("active")
}

// Inicialización de eventos
function initializeEvents() {
  // Selección de nivel
  document.querySelectorAll(".level-btn[data-level]").forEach((btn) => {
    btn.addEventListener("click", () => {
      currentLevel = Number.parseInt(btn.dataset.level)
      showGameSelection()
    })
  })

  // Botones de volver
  document.getElementById("back-to-levels").addEventListener("click", () => showScreen("start"))
  document.getElementById("back-from-quiz").addEventListener("click", () => showScreen("gameSelection"))
  document.getElementById("back-from-classification").addEventListener("click", () => showScreen("gameSelection"))
  document.getElementById("back-from-matching").addEventListener("click", () => showScreen("gameSelection"))

  // Botones finales
  document.getElementById("play-again-btn").addEventListener("click", () => showGameSelection())
  document.getElementById("try-other-level").addEventListener("click", () => showScreen("start"))

  // Respuestas del quiz
  document.querySelectorAll(".answer-btn").forEach((btn, index) => {
    btn.addEventListener("click", () => {
      if (gameStarted && !btn.disabled) {
        selectAnswer(index)
      }
    })
  })
}

// Mostrar selección de juegos
function showGameSelection() {
  const config = gameConfig[currentLevel]
  document.getElementById("level-title").textContent = `Nivel ${currentLevel}: ${config.name}`
  document.getElementById("level-emojis").textContent = config.emojis

  const gameSelector = document.getElementById("game-selector")
  gameSelector.innerHTML = ""

  config.games.forEach((game) => {
    const btn = document.createElement("button")
    btn.className = `game-btn ${game.class}`
    btn.innerHTML = `${game.name}<br><small>${game.description}</small>`
    btn.addEventListener("click", () => startGame(game.id))
    gameSelector.appendChild(btn)
  })

  showScreen("gameSelection")
}

// Iniciar juego
function startGame(gameType) {
  currentGame = gameType
  gameStarted = true
  score = 0
  currentQuestion = 0

  switch (gameType) {
    case "quiz":
      startQuizGame()
      break
    case "classification":
      startClassificationGame()
      break
    case "matching":
      startMatchingGame()
      break
  }
}

// Juego de preguntas
function startQuizGame() {
  if (currentLevel === 1) {
    currentQuestions = [...level1Questions]
    document.getElementById("game-name").textContent = "Preguntas sobre Fauna y Flora"
  } else {
    currentQuestions = [...level2Questions]
    document.getElementById("game-name").textContent = "Preguntas Avanzadas"
  }

  document.getElementById("total-questions").textContent = currentQuestions.length
  showScreen("quiz")
  loadQuestion()
}

function loadQuestion() {
  const question = currentQuestions[currentQuestion]

  // Mostrar imagen si existe
  const questionImage = document.getElementById("question-image")
  if (question.image) {
    questionImage.src = question.image
    questionImage.style.display = "block"
    document.getElementById("question-emoji").style.display = "none"
  } else {
    questionImage.style.display = "none"
    document.getElementById("question-emoji").style.display = "block"
    document.getElementById("question-emoji").textContent = question.emoji
  }

  document.getElementById("question-text").textContent = question.question
  document.getElementById("current-question").textContent = currentQuestion + 1

  const progress = ((currentQuestion + 1) / currentQuestions.length) * 100
  document.getElementById("progress").style.width = progress + "%"

  const answerBtns = document.querySelectorAll(".answer-btn")
  answerBtns.forEach((btn, index) => {
    btn.textContent = question.answers[index]
    btn.disabled = false
    btn.style.opacity = "1"
  })

  document.getElementById("feedback").classList.add("hidden")
}

function selectAnswer(selectedIndex) {
  const question = currentQuestions[currentQuestion]
  const isCorrect = selectedIndex === question.correct

  document.querySelectorAll(".answer-btn").forEach((btn) => {
    btn.disabled = true
  })

  const feedback = document.getElementById("feedback")
  const feedbackMessage = document.getElementById("feedback-message")
  feedback.classList.remove("hidden")

  if (isCorrect) {
    score++
    feedback.className = "feedback correct"
    feedbackMessage.innerHTML = "¡Excelente, explorador! 🌟✨<br><small>¡Conoces muy bien la fauna colombiana!</small>"
    playCorrectSound()
  } else {
    feedback.className = "feedback incorrect"
    feedbackMessage.innerHTML =
      "¡Sigue explorando! 🌱<br><small>La respuesta correcta era: " + question.answers[question.correct] + "</small>"
    playIncorrectSound()
  }

  setTimeout(() => {
    currentQuestion++
    if (currentQuestion < currentQuestions.length) {
      loadQuestion()
    } else {
      endGame()
    }
  }, 3500)
}

// Juego de clasificación
function startClassificationGame() {
  showScreen("classification")
  initializeClassificationGame()
}

function initializeClassificationGame() {
  const items = [...level1Classification]
  const container = document.getElementById("classification-items")
  container.innerHTML = ""

  // Mezclar elementos
  items.sort(() => Math.random() - 0.5)

  items.forEach((item, index) => {
    const div = document.createElement("div")
    div.className = "classification-item"
    div.draggable = true
    div.dataset.type = item.type
    div.dataset.index = index
    div.innerHTML = `${item.emoji} ${item.name}`

    div.addEventListener("dragstart", handleDragStart)
    div.addEventListener("dragend", handleDragEnd)

    container.appendChild(div)
  })

  // Configurar zonas de drop
  document.getElementById("fauna-box").addEventListener("dragover", handleDragOver)
  document.getElementById("fauna-box").addEventListener("drop", handleDrop)
  document.getElementById("flora-box").addEventListener("dragover", handleDragOver)
  document.getElementById("flora-box").addEventListener("drop", handleDrop)

  updateClassificationProgress()
}

let draggedElement = null

function handleDragStart(e) {
  draggedElement = e.target
  e.target.classList.add("dragging")
}

function handleDragEnd(e) {
  e.target.classList.remove("dragging")
}

function handleDragOver(e) {
  e.preventDefault()
  e.target.classList.add("dragover")
}

function handleDrop(e) {
  e.preventDefault()
  e.target.classList.remove("dragover")

  if (!draggedElement) return

  const dropZone = e.target.closest(".classification-box")
  const itemType = draggedElement.dataset.type
  const dropType = dropZone.classList.contains("fauna") ? "fauna" : "flora"

  if (itemType === dropType) {
    // Correcto
    draggedElement.remove()
    score++
    showClassificationFeedback(true, draggedElement.textContent)
    playCorrectSound()
  } else {
    // Incorrecto
    showClassificationFeedback(false, draggedElement.textContent)
    playIncorrectSound()
  }

  updateClassificationProgress()

  // Verificar si terminó
  if (document.querySelectorAll(".classification-item").length === 0) {
    setTimeout(() => endGame(), 2000)
  }
}

function showClassificationFeedback(isCorrect, itemName) {
  const feedback = document.getElementById("classification-feedback")
  const message = document.getElementById("classification-feedback-message")

  feedback.classList.remove("hidden")

  if (isCorrect) {
    feedback.className = "feedback correct"
    message.innerHTML = `¡Correcto! ${itemName} está en el lugar correcto 🌟`
  } else {
    feedback.className = "feedback incorrect"
    message.innerHTML = `¡Intenta de nuevo! ${itemName} va en la otra caja 🌱`
  }

  setTimeout(() => {
    feedback.classList.add("hidden")
  }, 2000)
}

function updateClassificationProgress() {
  const total = level1Classification.length
  const remaining = document.querySelectorAll(".classification-item").length
  const classified = total - remaining

  document.getElementById("classified-count").textContent = classified
  document.getElementById("total-items").textContent = total

  const progress = (classified / total) * 100
  document.getElementById("classification-progress").style.width = progress + "%"
}

// Juego de emparejamiento
function startMatchingGame() {
  showScreen("matching")
  initializeMatchingGame()
}

function initializeMatchingGame() {
  const pairs = [...level2Matching]
  const animalsColumn = document.getElementById("animals-column")
  const habitatsColumn = document.getElementById("habitats-column")

  // Limpiar columnas
  animalsColumn.innerHTML = "<h3>🐾 Animales</h3>"
  habitatsColumn.innerHTML = "<h3>🏞️ Hábitats</h3>"

  // Mezclar arrays
  const animals = pairs.map((pair, index) => ({ ...pair, id: index }))
  const habitats = pairs.map((pair, index) => ({ ...pair, id: index }))

  animals.sort(() => Math.random() - 0.5)
  habitats.sort(() => Math.random() - 0.5)

  // Crear elementos de animales
  animals.forEach((animal) => {
    const div = document.createElement("div")
    div.className = "matching-item animal"
    div.dataset.id = animal.id
    div.textContent = animal.animal
    div.addEventListener("click", () => selectMatchingItem(div, "animal"))
    animalsColumn.appendChild(div)
  })

  // Crear elementos de hábitats
  habitats.forEach((habitat) => {
    const div = document.createElement("div")
    div.className = "matching-item habitat"
    div.dataset.id = habitat.id
    div.textContent = habitat.habitat
    div.addEventListener("click", () => selectMatchingItem(div, "habitat"))
    habitatsColumn.appendChild(div)
  })

  updateMatchingProgress()
}

let selectedAnimal = null
let selectedHabitat = null

function selectMatchingItem(element, type) {
  if (element.classList.contains("matched")) return

  // Deseleccionar elementos del mismo tipo
  document.querySelectorAll(`.matching-item.${type}.selected`).forEach((item) => {
    item.classList.remove("selected")
  })

  element.classList.add("selected")

  if (type === "animal") {
    selectedAnimal = element
  } else {
    selectedHabitat = element
  }

  // Verificar emparejamiento
  if (selectedAnimal && selectedHabitat) {
    checkMatch()
  }
}

function checkMatch() {
  const animalId = selectedAnimal.dataset.id
  const habitatId = selectedHabitat.dataset.id

  if (animalId === habitatId) {
    // Correcto
    selectedAnimal.classList.add("matched")
    selectedHabitat.classList.add("matched")
    selectedAnimal.classList.remove("selected")
    selectedHabitat.classList.remove("selected")

    score++
    showMatchingFeedback(true)
    playCorrectSound()

    // Verificar si terminó
    if (document.querySelectorAll(".matching-item:not(.matched)").length === 0) {
      setTimeout(() => endGame(), 2000)
    }
  } else {
    // Incorrecto
    showMatchingFeedback(false)
    playIncorrectSound()

    setTimeout(() => {
      selectedAnimal.classList.remove("selected")
      selectedHabitat.classList.remove("selected")
    }, 1500)
  }

  selectedAnimal = null
  selectedHabitat = null
  updateMatchingProgress()
}

function showMatchingFeedback(isCorrect) {
  const feedback = document.getElementById("matching-feedback")
  const message = document.getElementById("matching-feedback-message")

  feedback.classList.remove("hidden")

  if (isCorrect) {
    feedback.className = "feedback correct"
    message.innerHTML = "¡Perfecto! Ese animal vive en ese hábitat 🌟"
  } else {
    feedback.className = "feedback incorrect"
    message.innerHTML = "¡Intenta de nuevo! Ese no es el hábitat correcto 🌱"
  }

  setTimeout(() => {
    feedback.classList.add("hidden")
  }, 2000)
}

function updateMatchingProgress() {
  const total = level2Matching.length
  const matched = document.querySelectorAll(".matching-item.matched").length / 2

  document.getElementById("matched-count").textContent = matched
  document.getElementById("total-pairs").textContent = total

  const progress = (matched / total) * 100
  document.getElementById("matching-progress").style.width = progress + "%"
}

// Finalizar juego
function endGame() {
  let totalItems
  let gameTitle

  switch (currentGame) {
    case "quiz":
      totalItems = currentQuestions.length
      gameTitle = currentLevel === 1 ? "Preguntas sobre Fauna y Flora" : "Preguntas Avanzadas"
      break
    case "classification":
      totalItems = level1Classification.length
      gameTitle = "¿Fauna o Flora?"
      break
    case "matching":
      totalItems = level2Matching.length
      gameTitle = "Empareja Animal con Hábitat"
      break
  }

  const percentage = Math.round((score / totalItems) * 100)
  document.getElementById("final-score").innerHTML =
    `¡Completaste "${gameTitle}"!<br>` +
    `${score} de ${totalItems} correctas 🏆<br>` +
    `<span style="font-size: 0.7em; color: #1565c0;">${percentage}% de aciertos</span>`

  let completionMessage = ""
  if (percentage >= 90) {
    completionMessage = "🏆 ¡Eres un verdadero experto en biodiversidad colombiana! ¡Increíble!"
  } else if (percentage >= 70) {
    completionMessage = "🌟 ¡Muy bien! Tienes un gran conocimiento sobre nuestra fauna y flora."
  } else if (percentage >= 50) {
    completionMessage = "🌱 ¡Buen trabajo! Sigues aprendiendo sobre la naturaleza colombiana."
  } else {
    completionMessage = "🌿 ¡Sigue explorando! Cada día puedes aprender algo nuevo sobre Colombia."
  }

  document.getElementById("level-completion").innerHTML = completionMessage
  showScreen("end")
  setTimeout(() => playCorrectSound(), 500)

  gameStarted = false
}

// Inicializar aplicación
document.addEventListener("DOMContentLoaded", () => {
  initializeEvents()
  showScreen("start")
})

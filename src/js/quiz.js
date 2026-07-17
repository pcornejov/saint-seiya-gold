import { goldSaints } from './saintsData.js';

const quizQuestions = [
  {
    question: "Frente a un gran dilema moral o peligro inminente, ¿cuál es tu primera reacción?",
    options: [
      { text: "Analizar con paciencia y buscar restaurar el equilibrio de forma pacífica.", weights: { mu: 3, dohko: 2, shaka: 2 } },
      { text: "Enfrentarlo de frente con toda mi fuerza física y valor inquebrantable.", weights: { aldebaran: 3, aiolia: 3, milo: 2 } },
      { text: "Actuar con fría lógica, reprimiendo cualquier emoción para ejecutar el deber.", weights: { camus: 3, shura: 3, shaka: 1 } },
      { text: "Hacer lo que sea necesario para imponer el orden, sin importar la moralidad de los medios.", weights: { saga: 3, deathmask: 3, aphrodite: 2 } }
    ]
  },
  {
    question: "¿Qué tipo de destreza cósmica crees que encaja mejor con tu espíritu?",
    options: [
      { text: "Barreras defensivas impenetrables y teletransportación psíquica.", weights: { mu: 3, shaka: 2, dohko: 1 } },
      { text: "Impactos colosales y ráfagas físicas directas a la velocidad de la luz.", weights: { aiolia: 3, aldebaran: 2, aiolos: 3 } },
      { text: "Manipulación de temperaturas gélidas o del espacio y dimensiones.", weights: { camus: 3, saga: 3, shura: 1 } },
      { text: "Técnicas sutiles ligadas a espíritus, picaduras venenosas o flores letales.", weights: { deathmask: 3, milo: 3, aphrodite: 3 } }
    ]
  },
  {
    question: "¿Cuál consideras que es tu mayor fortaleza interna?",
    options: [
      { text: "La sabiduría espiritual y la capacidad de meditación profunda.", weights: { shaka: 3, dohko: 3, mu: 2 } },
      { text: "La lealtad ciega y el honor hacia mis ideales y mis mentores.", weights: { aiolos: 3, shura: 3, aiolia: 2 } },
      { text: "La nobleza, camaradería y protección hacia los más vulnerables.", weights: { aldebaran: 3, milo: 3, dohko: 1 } },
      { text: "La ambición inquebrantable y el impulso constante de superación.", weights: { saga: 3, deathmask: 2, aphrodite: 2 } }
    ]
  },
  {
    question: "¿Qué entorno sintoniza mejor con tu paz mental?",
    options: [
      { text: "Un templo sereno rodeado de cascadas eternas o lagos sagrados.", weights: { dohko: 3, shaka: 3, mu: 1 } },
      { text: "Una planicie expuesta a tormentas eléctricas y lluvias estelares.", weights: { aiolia: 3, aiolos: 3, mu: 2 } },
      { text: "Un desierto congelado y montañoso cubierto por nieve perpetua.", weights: { camus: 3, shura: 2, aldebaran: 1 } },
      { text: "Un jardín de rosas majestuosas o una dimensión de portales estrellados.", weights: { aphrodite: 3, saga: 3, deathmask: 2, milo: 1 } }
    ]
  },
  {
    question: "Para ti, ¿qué representa la energía del Cosmos?",
    options: [
      { text: "La armonía universal y la comunión con el Todo celestial.", weights: { shaka: 3, mu: 2, dohko: 3 } },
      { text: "Un fuego interior latente que estalla con fuerza ante la injusticia.", weights: { aiolia: 3, aldebaran: 2, milo: 3 } },
      { text: "Una fuerza de voluntad pura, afilada como el acero de una espada.", weights: { shura: 3, aiolos: 2, camus: 1 } },
      { text: "Una fuerza dual de luz y oscuridad capaz de colapsar galaxias.", weights: { saga: 3, camus: 2, deathmask: 2, aphrodite: 2 } }
    ]
  }
];

const saintTraits = {
  mu: ["Muro de Cristal", "Sabiduría Estelar"],
  aldebaran: ["Gran Cuerno", "Nobleza del Toro"],
  saga: ["Explosión Galáctica", "Alma Dual"],
  deathmask: ["Paso al Inframundo", "Llamas Espirituales"],
  aiolia: ["Plasma Relámpago", "Furia Dorada"],
  shaka: ["Tesoro del Cielo", "Meditación Budista"],
  dohko: ["Cien Dragones", "Armas Legendarias"],
  milo: ["Aguja Escarlata", "Orgullo Letal"],
  aiolos: ["Flecha de la Justicia", "Testamento Sagrado"],
  shura: ["Corte Excalibur", "Disciplina Estricta"],
  camus: ["Cero Absoluto", "Frío Imperturbable"],
  aphrodite: ["Rosas Demoníacas", "Muerte Hermosa"]
};

export function initQuiz() {
  const startScreen = document.getElementById('quiz-start-screen');
  const questionScreen = document.getElementById('quiz-question-screen');
  const resultsScreen = document.getElementById('quiz-results-screen');
  
  const startBtn = document.getElementById('start-quiz-btn');
  const restartBtn = document.getElementById('restart-quiz-btn');
  
  const progressFill = document.getElementById('quiz-progress-fill');
  const counterText = document.getElementById('quiz-counter');
  const questionText = document.getElementById('quiz-question-text');
  const optionsContainer = document.getElementById('quiz-options-container');
  
  const resultName = document.getElementById('result-saint-name');
  const resultTitle = document.getElementById('result-saint-title');
  const resultPortrait = document.getElementById('result-saint-portrait');
  const resultDesc = document.getElementById('result-saint-desc');
  const trait1 = document.getElementById('trait-1');
  const trait2 = document.getElementById('trait-2');

  let currentQuestionIndex = 0;
  let scores = {};

  // Reset scores
  function resetQuiz() {
    currentQuestionIndex = 0;
    scores = {
      mu: 0, aldebaran: 0, saga: 0, deathmask: 0, aiolia: 0,
      shaka: 0, dohko: 0, milo: 0, aiolos: 0, shura: 0,
      camus: 0, aphrodite: 0
    };
  }

  // Start button handler
  startBtn.addEventListener('click', () => {
    resetQuiz();
    startScreen.classList.remove('active');
    questionScreen.classList.add('active');
    showQuestion();
  });

  // Restart button handler
  restartBtn.addEventListener('click', () => {
    resultsScreen.classList.remove('active');
    startScreen.classList.add('active');
  });

  function showQuestion() {
    const q = quizQuestions[currentQuestionIndex];
    if (!q) {
      calculateAndShowResult();
      return;
    }

    // Update progress bar
    const progress = (currentQuestionIndex / quizQuestions.length) * 100;
    progressFill.style.width = `${progress}%`;
    
    // Update labels
    counterText.textContent = `Pregunta ${currentQuestionIndex + 1} de ${quizQuestions.length}`;
    questionText.textContent = q.question;

    // Render options
    optionsContainer.innerHTML = '';
    q.options.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.className = 'option-btn';
      btn.textContent = opt.text;
      
      btn.addEventListener('click', () => {
        // Highlight selection
        btn.classList.add('selected');
        
        // Sum weights
        Object.keys(opt.weights).forEach(saintId => {
          scores[saintId] += opt.weights[saintId];
        });

        // Delay slightly for visual effect then proceed
        setTimeout(() => {
          currentQuestionIndex++;
          showQuestion();
        }, 300);
      });

      optionsContainer.appendChild(btn);
    });
  }

  function calculateAndShowResult() {
    // Complete progress fill
    progressFill.style.width = "100%";
    
    // Find the saint with the highest score
    let winnerId = 'mu';
    let highestScore = -1;

    Object.keys(scores).forEach(id => {
      if (scores[id] > highestScore) {
        highestScore = scores[id];
        winnerId = id;
      }
    });

    const saint = goldSaints.find(s => s.id === winnerId);
    if (!saint) return;

    // Fill results UI
    resultName.textContent = saint.name;
    resultTitle.textContent = `Guardián de la ${saint.temple.split(' (')[0]}`;
    resultPortrait.src = saint.image;
    resultPortrait.alt = saint.name;
    resultDesc.textContent = `Tu cosmos está firmemente alineado con ${saint.name}. ${saint.description}`;

    // Traits
    const traits = saintTraits[winnerId] || ["Cosmos Dorado", "Séptimo Sentido"];
    trait1.textContent = traits[0];
    trait2.textContent = traits[1];

    // Switch screen
    questionScreen.classList.remove('active');
    resultsScreen.classList.add('active');
  }
}

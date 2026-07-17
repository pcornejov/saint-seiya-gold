// Styles imports
import './css/main.css';
import './css/canvas.css';
import './css/codex.css';
import './css/sanctuary.css';
import './css/quiz.css';

// Scripts imports
import { initSpaceBackground } from './js/canvas.js';
import { initCodex } from './js/codex.js';
import { initSanctuary } from './js/sanctuary.js';
import { initQuiz } from './js/quiz.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize background particle engine
  const cleanupBackground = initSpaceBackground();

  // 2. Initialize subsystems
  initCodex();
  initSanctuary();
  initQuiz();

  // 3. Navigation Header Scroll Effect
  const header = document.getElementById('site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // 4. Mobile Menu toggle
  const mobileBtn = document.getElementById('mobile-menu-btn');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-links a');

  if (mobileBtn && navMenu) {
    mobileBtn.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      mobileBtn.classList.toggle('active');
    });

    // Close menu when a link is clicked
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        mobileBtn.classList.remove('active');
      });
    });
  }

  // 5. Sound Controller / Ambient Audio Logic
  const audio = document.getElementById('bg-music');
  const soundToggle = document.getElementById('music-toggle');
  const soundOffIcon = document.getElementById('sound-off-icon');
  const soundOnIcon = document.getElementById('sound-on-icon');
  let isMuted = true;
  let audioStarted = false;

  // Set lower default volume for ambient mood
  if (audio) {
    audio.volume = 0.2;
  }

  if (soundToggle && audio) {
    soundToggle.addEventListener('click', () => {
      if (!audioStarted) {
        // Start playing first time upon user interaction
        audio.play().then(() => {
          audioStarted = true;
          isMuted = false;
          updateSoundUI();
        }).catch(err => {
          console.log("Audio play failed: ", err);
        });
      } else {
        // Toggle state
        if (isMuted) {
          audio.muted = false;
          audio.play();
          isMuted = false;
        } else {
          audio.muted = true;
          isMuted = true;
        }
        updateSoundUI();
      }
    });

    // Enable sound start on first user tap anywhere if they haven't explicitly muted
    document.body.addEventListener('click', () => {
      if (!audioStarted && isMuted) {
        audio.play().then(() => {
          audioStarted = true;
          // Keep it muted by default unless they click the button, to avoid surprising the user
          audio.muted = true;
          isMuted = true;
          updateSoundUI();
        }).catch(() => {
          // ignore autplay errors
        });
      }
    }, { once: true });
  }

  function updateSoundUI() {
    if (isMuted) {
      soundOffIcon.classList.remove('hide');
      soundOnIcon.classList.add('hide');
    } else {
      soundOffIcon.classList.add('hide');
      soundOnIcon.classList.remove('hide');
    }
  }

  // 6. Scrollspy navigation highlights
  const sections = document.querySelectorAll('section');
  const navItems = {
    'hero-section': document.getElementById('nav-item-home'),
    'codex-section': document.getElementById('nav-item-codex'),
    'sanctuary-section': document.getElementById('nav-item-sanctuary'),
    'quiz-section': document.getElementById('nav-item-quiz')
  };

  window.addEventListener('scroll', () => {
    let currentSectionId = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 150;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    Object.keys(navItems).forEach(id => {
      const item = navItems[id];
      if (item) {
        if (id === currentSectionId) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      }
    });
  });
});

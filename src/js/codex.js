import { goldSaints } from './saintsData.js';

const zodiacSymbols = {
  mu: '♈',
  aldebaran: '♉',
  saga: '♊',
  deathmask: '♋',
  aiolia: '♌',
  shaka: '♍',
  dohko: '♎',
  milo: '♏',
  aiolos: '♐',
  shura: '♑',
  camus: '♒',
  aphrodite: '♓'
};

const spanishAttrNames = {
  cosmos: 'Cosmos',
  fuerza: 'Fuerza',
  velocidad: 'Velocidad',
  sabiduria: 'Sabiduría',
  defensa: 'Defensa'
};

export function initCodex() {
  const gridContainer = document.getElementById('signs-selector-grid');
  const detailsEmpty = document.getElementById('details-empty-state');
  const detailsContent = document.getElementById('details-real-content');
  
  const portrait = document.getElementById('saint-portrait');
  const name = document.getElementById('saint-name');
  const badge = document.getElementById('saint-sign-badge');
  const temple = document.getElementById('saint-temple-name');
  
  const bioAge = document.getElementById('bio-age');
  const bioHeight = document.getElementById('bio-height');
  const bioWeight = document.getElementById('bio-weight');
  const bioBlood = document.getElementById('bio-blood');
  const bioOrigin = document.getElementById('bio-origin');
  const bioTraining = document.getElementById('bio-training');
  
  const desc = document.getElementById('saint-description');
  const statsBars = document.getElementById('stats-bars');
  const techList = document.getElementById('techniques-list');
  
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');
  
  let currentSaint = null;

  // Render the 12 signs grid
  goldSaints.forEach((saint) => {
    const card = document.createElement('div');
    card.className = 'sign-card';
    card.dataset.id = saint.id;
    
    const symbol = zodiacSymbols[saint.id] || '✨';
    
    card.innerHTML = `
      <span class="sign-card-symbol">${symbol}</span>
      <span class="sign-card-name">${saint.sign}</span>
    `;
    
    card.addEventListener('click', () => {
      selectSaint(saint.id);
    });
    
    gridContainer.appendChild(card);
  });

  // Setup tab handlers
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const activeTab = button.dataset.tab;
      
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabPanes.forEach(pane => pane.classList.remove('active'));
      
      button.classList.add('active');
      document.getElementById(`pane-${activeTab}`).classList.add('active');
      
      // Re-trigger stats bar width animation if stats tab is opened
      if (activeTab === 'stats' && currentSaint) {
        animateStatsBars(currentSaint);
      }
    });
  });

  function selectSaint(id) {
    // Toggle active state in grid
    const cards = document.querySelectorAll('.sign-card');
    cards.forEach(card => {
      if (card.dataset.id === id) {
        card.classList.add('active');
      } else {
        card.classList.remove('active');
      }
    });

    // Find data
    const saint = goldSaints.find(s => s.id === id);
    if (!saint) return;
    currentSaint = saint;

    // Show details layout
    detailsEmpty.classList.add('hide');
    detailsContent.classList.remove('hide');

    // Fill elements
    portrait.src = saint.image;
    portrait.alt = saint.name;
    name.textContent = saint.name;
    badge.textContent = saint.sign;
    temple.textContent = saint.temple;
    
    bioAge.textContent = saint.age;
    bioHeight.textContent = saint.height;
    bioWeight.textContent = saint.weight;
    bioBlood.textContent = saint.bloodType;
    bioOrigin.textContent = saint.nationality;
    bioTraining.textContent = saint.trainingPlace;
    
    desc.textContent = saint.description;

    // Build stats bars structure
    statsBars.innerHTML = '';
    Object.keys(saint.stats).forEach(key => {
      const val = saint.stats[key];
      const name = spanishAttrNames[key] || key;
      const row = document.createElement('div');
      row.className = 'stat-row';
      row.innerHTML = `
        <span class="stat-label">${name}</span>
        <div class="stat-bar-outer">
          <div class="stat-bar-inner" data-value="${val}" style="width: 0%"></div>
        </div>
        <span class="stat-value">${val}%</span>
      `;
      statsBars.appendChild(row);
    });

    // Build techniques list
    techList.innerHTML = '';
    saint.techniques.forEach(tech => {
      const item = document.createElement('div');
      item.className = 'tech-item';
      item.innerHTML = `
        <div class="tech-name">${tech.name}</div>
        <div class="tech-desc">${tech.desc}</div>
      `;
      techList.appendChild(item);
    });

    // Check which tab is active, if stats, animate immediately
    const activeTabButton = document.querySelector('.tab-btn.active');
    if (activeTabButton && activeTabButton.dataset.tab === 'stats') {
      animateStatsBars(saint);
    } else {
      // default back to lore tab to avoid empty tab issues
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabPanes.forEach(pane => pane.classList.remove('active'));
      
      document.getElementById('tab-btn-lore').classList.add('active');
      document.getElementById('pane-lore').classList.add('active');
    }
  }

  function animateStatsBars(saint) {
    // Delay slightly to allow DOM layout
    setTimeout(() => {
      const bars = document.querySelectorAll('.stat-bar-inner');
      bars.forEach(bar => {
        const val = bar.dataset.value;
        bar.style.width = `${val}%`;
      });
    }, 50);
  }
}

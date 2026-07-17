import { goldSaints } from './saintsData.js';

const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];

// Spaced coordinates climbing the mountain (X%, Y% relative to container)
const templeCoordinates = [
  { x: 12, y: 84 },  // I. Aries
  { x: 23, y: 78 },  // II. Tauro
  { x: 34, y: 71 },  // III. Géminis
  { x: 44, y: 64 },  // IV. Cáncer
  { x: 55, y: 58 },  // V. Leo
  { x: 67, y: 52 },  // VI. Virgo
  { x: 78, y: 46 },  // VII. Libra
  { x: 86, y: 38 },  // VIII. Escorpio
  { x: 77, y: 28 },  // IX. Sagitario
  { x: 64, y: 22 },  // X. Capricornio
  { x: 50, y: 17 },  // XI. Acuario
  { x: 36, y: 11 }   // XII. Piscis
];

const templeLores = [
  "La entrada al Santuario. Aquí, el sabio Mu repara las Armaduras de Bronce dañadas de Seiya y sus amigos, enseñándoles la importancia del Séptimo Sentido antes de dejarlos pasar de manera pacífica.",
  "El primer combate real de las Doce Casas. El gigante Aldebarán bloquea el paso de los santos de bronce. Seiya logra cortar un cuerno del casco dorado de Aldebarán, ganándose su respeto y el derecho de avanzar.",
  "Un templo laberíntico dominado por ilusiones espaciales. Saga de Géminis controla la armadura vacía a distancia desde el templo del Papa. Shun logra romper la ilusión con su Cadena de Andrómeda.",
  "El templo del horror, plagado con los rostros de las almas de las víctimas de Máscara de Muerte. Shiryū de Dragón combate al guardián y lo derrota tras ser transportado al Yomotsu Hirasaka.",
  "Aiolia combate bajo el influjo del control mental del Patriarca (el Satanás Imperial). Cassios se sacrifica para romper el hechizo, permitiendo que Aiolia recupere la razón tras presenciar la muerte de un inocente.",
  "El templo donde reside Shaka. Seiya, Shiryū y Shun son derrotados fácilmente. Ikki de Fénix llega para entablar un duelo brutal, sacrificando sus propios sentidos para despertar su cosmos máximo y derrotar a Shaka.",
  "Un templo desierto custodiado espiritualmente por Dohko (el Viejo Maestro de Rozan). Los caballeros de bronce encuentran a Hyōga congelado en el ataúd de Camus. Usan la Espada de Libra de Dohko para liberarlo.",
  "Milo de Escorpio defiende su templo con la Aguja Escarlata. Hyōga se enfrenta a él en una batalla sangrienta. Tras ver la determinación de Cisne, Milo detiene la hemorragia de Hyōga y le permite seguir adelante.",
  "El templo del héroe fallecido Aiolos. No hay guardián físico, pero la armadura dispara una flecha que revela la pared secreta con el testamento del caballero: 'A los jóvenes que han venido aquí, les encomiendo la vida de Athena'.",
  "Shura de Capricornio, poseedor de la espada Excalibur en su brazo derecho, se enfrenta a Shiryū. El Dragón se ve forzado a usar el Último Dragón (un ataque suicida) para ascender al cielo junto a Shura, quien se arrepiente al final.",
  "Camus de Acuario se enfrenta a su discípulo Hyōga. Camus intenta congelar a Hyōga para protegerlo del combate definitivo, pero Hyōga asimila el Cero Absoluto de su maestro en un duelo épico de Ejecuciones de Aurora.",
  "El último templo, custodiado por Afrodita, quien sembró un jardín de rosas envenenadas en la escalinata al templo del Papa. Shun derrota a Afrodita con su Tormenta Nebular tras vengar la muerte de su maestro Albiore."
];

export function initSanctuary() {
  const nodesContainer = document.getElementById('temple-nodes-container');
  const drawer = document.getElementById('temple-drawer');
  const closeBtn = document.getElementById('close-drawer');
  
  const drawerNumber = document.getElementById('drawer-temple-number');
  const drawerName = document.getElementById('drawer-temple-name');
  const drawerImg = document.getElementById('drawer-guardian-img');
  const drawerGuardianName = document.getElementById('drawer-guardian-name');
  const drawerLore = document.getElementById('drawer-temple-lore');

  // Generate the 12 nodes
  goldSaints.forEach((saint, index) => {
    const coord = templeCoordinates[index] || { x: 50, y: 50 };
    const node = document.createElement('div');
    node.className = 'temple-node';
    node.style.left = `${coord.x}%`;
    node.style.top = `${coord.y}%`;
    node.dataset.id = saint.id;
    node.dataset.index = index;
    node.textContent = romanNumerals[index];

    // Subtitle label
    const label = document.createElement('span');
    label.className = 'temple-node-label';
    label.textContent = saint.sign;
    node.appendChild(label);

    node.addEventListener('click', () => {
      selectTemple(index);
    });

    nodesContainer.appendChild(node);
  });

  // Close drawer handler
  closeBtn.addEventListener('click', () => {
    drawer.classList.add('hide');
    // Remove active state from all nodes
    document.querySelectorAll('.temple-node').forEach(n => n.classList.remove('active'));
  });

  function selectTemple(index) {
    const nodes = document.querySelectorAll('.temple-node');
    nodes.forEach((node, idx) => {
      if (idx === index) {
        node.classList.add('active');
      } else {
        node.classList.remove('active');
      }
    });

    const saint = goldSaints[index];
    if (!saint) return;

    // Show drawer
    drawer.classList.remove('hide');

    // Fill details
    drawerNumber.textContent = `Templo ${romanNumerals[index]}`;
    drawerName.textContent = saint.temple.split(' (')[0]; // strip the detail suffix
    drawerImg.src = saint.image;
    drawerImg.alt = saint.name;
    drawerGuardianName.textContent = saint.name.split(' de ')[0];
    drawerLore.textContent = templeLores[index] || "Custodiado por un Caballero de Oro del Santuario.";

    // Remove any existing action buttons in the body to avoid stacking
    const existingBtn = drawer.querySelector('.drawer-body .btn-gold');
    if (existingBtn) existingBtn.remove();

    // Create "Investigar Caballero" button
    const inspectBtn = document.createElement('button');
    inspectBtn.className = 'btn-gold';
    inspectBtn.textContent = 'Ver en el Códice';
    inspectBtn.addEventListener('click', () => {
      // 1. Scroll to codex section
      const codexSec = document.getElementById('codex-section');
      codexSec.scrollIntoView({ behavior: 'smooth' });

      // 2. Select the saint in codex
      setTimeout(() => {
        const codexCard = document.querySelector(`.sign-card[data-id="${saint.id}"]`);
        if (codexCard) codexCard.click();
      }, 500); // Wait for scroll to finish
    });

    drawer.querySelector('.drawer-body').appendChild(inspectBtn);
  }
}

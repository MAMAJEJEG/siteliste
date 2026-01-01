const nav = document.querySelector(".nav")
const menuIcon = document.querySelector(".menu-icon")
menuIcon.addEventListener('click',()=>{
nav.classList.toggle('mobile-menu')
console.log("salut")
})

const ruche = document.querySelector(".ruche-image");
const btnRetour = document.getElementById('btn-retour');
const vueInterieure = document.getElementById('interieur-ruche');
const mainElement = document.querySelector('main');
// Quand on clique sur la ruche
ruche.addEventListener('click', () => {
    vueInterieure.classList.add('active'); // Le CSS gère l'apparition
    mainElement.classList.add('ruche-ouverte');
});

// Quand on clique sur "Sortir"
btnRetour.addEventListener('click', () => {
    vueInterieure.classList.remove('active'); // Le CSS gère la disparition
    mainElement.classList.remove('ruche-ouverte');
});


const seed = 7; 

function seededRandom(s) {
    return function() {
        s = Math.sin(s) * 10000;
        return s - Math.floor(s);
    };
}

const myRandom = seededRandom(seed); // On crée notre propre "Math.random" basé sur la seed



const field = document.querySelector('.grass-field');
const grassCount = 60; // Tu peux ajuster le nombre de brins ici

for (let i = 0; i < grassCount; i++) {
    const grass = document.createElement('div');
    grass.classList.add('grass');

    // --- RANDOMISATION ---
    
    // 1. Position horizontale (de 0 à 100%)
    const posX = myRandom() * 100;
    
    // 2. Taille aléatoire (entre 20px et 50px)
    const height = 20 + myRandom() * 30;
    
    // 3. Délai d'animation aléatoire (pour que tout ne bouge pas en même temps)
    const delay = myRandom() * -5; // Valeur négative pour qu'ils aient déjà commencé à bouger
    
    // 4. Opacité/Couleur légère (pour donner de la profondeur)
    const brightness = 80 + myRandom() * 40;

    // Appliquer les styles
    grass.style.left = `${posX}%`;
    grass.style.height = `${height}px`;
    grass.style.animationDelay = `${delay}s`;
    grass.style.filter = `brightness(${brightness}%)`;

    field.appendChild(grass);
}


const bee = document.getElementById('main-bee');
const main = document.querySelector('main');

// On récupère les dimensions réelles de la zone de vol
let zoneWidth = main.clientWidth;
let zoneHeight = main.clientHeight;

// Position de départ au centre du main
let beePos = { x: zoneWidth / 2, y: zoneHeight / 2 };
let target = { x: beePos.x, y: beePos.y };
let angle = 0;
const speed = 2.5; 

function moveBee() {
    // 1. On met à jour les dimensions de la zone (au cas où on redimensionne la fenêtre)
    zoneWidth = main.clientWidth;
    zoneHeight = main.clientHeight;

    const distToTarget = Math.hypot(target.x - beePos.x, target.y - beePos.y);
    
    // 2. Si proche de la cible, on en choisit une nouvelle STRICTEMENT dans le main
    if (distToTarget < 20) {
        target = {
            x: Math.random() * (zoneWidth - 100) + 50,
            y: Math.random() * (zoneHeight - 100) + 50
        };
    }

    // 3. Calcul de l'angle fluide
    const targetAngle = Math.atan2(target.y - beePos.y, target.x - beePos.x) * 180 / Math.PI;
    
    // Pour éviter que l'abeille ne fasse des tours sur elle-même brusquement
    let diff = targetAngle - angle;
    while (diff < -180) diff += 360;
    while (diff > 180) diff -= 360;
    angle += diff * 0.05;

    const radians = angle * Math.PI / 180;
    beePos.x += Math.cos(radians) * speed;
    beePos.y += Math.sin(radians) * speed;

    // 4. On s'assure que beePos ne sorte JAMAIS des limites (Sécurité)
    beePos.x = Math.max(20, Math.min(beePos.x, zoneWidth - 20));
    beePos.y = Math.max(20, Math.min(beePos.y, zoneHeight - 20));

    // 5. Rendu : on ajuste le Flip (miroir) pour qu'elle ne vole pas sur le dos
    const flip = (Math.cos(radians) < 0) ? -1 : 1;
    
    // On utilise scaleX pour la direction gauche/droite et rotate pour l'inclinaison
    // Note: On utilise scaleY(-1) si on veut qu'elle se retourne proprement sans être à l'envers
    bee.style.transform = `translate(${beePos.x}px, ${beePos.y}px) rotate(${angle}deg) scaleY(${flip})`;

    requestAnimationFrame(moveBee);
}

moveBee();

// main.addEventListener('mousemove', (e) => {
//     target.x = e.clientX;
//     target.y = e.clientY;
// });

import { initBees, bees } from './beeSystem.js';
import { startCloudSystem, spawnImageFlowers, initGrass } from './environment.js';
import { createParticles } from './effects.js';
import {setupButterflies} from './butterfly.js'

// ================= EASTER EGG OURS =================

let flowersClickedCount = 0;
// IMPORTANT : Remplace '.fleur' par la vraie classe de tes fleurs (ex: .scattered-flower)
const flowerSelector = '.scattered-flower'; 

export function setupEasterEgg() {
    const flowers = document.querySelectorAll(flowerSelector);
    
    flowers.forEach(flower => {
        flower.addEventListener('click', function() {
            // On vérifie si la fleur a déjà été comptée dans ce cycle
            if (this.style.pointerEvents === 'none') return;

            this.style.opacity = '0.5';
            this.style.pointerEvents = 'none'; // Désactive temporairement cette fleur

            flowersClickedCount++;
            
            if (flowersClickedCount === flowers.length) {
                startBearSequence();
            }
        });
    });
}

function startBearSequence() {
    const bear = document.getElementById('bear-container');
    const bearSvg = bear.querySelector('.bear-svg');
    const pot = bear.querySelector('.honey-pot-css');
    const ruche = document.querySelector('.ruche-image');
    const cave = document.getElementById('cave-entrance');
    const main = document.querySelector('main');
    
    const rucheRect = ruche.getBoundingClientRect();
    const caveRect = cave.getBoundingClientRect();
    const mainRect = main.getBoundingClientRect();

    // CALCUL DES POSITIONS CIBLES (Centrage)
    // Centre de la ruche
    const targetX_Ruche = (rucheRect.left + rucheRect.width / 2) - mainRect.left - (bear.offsetWidth / 2);
    const targetY_Ruche = (rucheRect.top + rucheRect.height / 2) - mainRect.top - (bear.offsetHeight / 2);

    // Centre de la grotte (Position de départ et de retour)
    const targetX_Cave = (caveRect.left + caveRect.width / 2) - mainRect.left - (bear.offsetWidth / 2);
    const targetY_Cave = (caveRect.top + caveRect.height / 2) - mainRect.top - (bear.offsetHeight / 2);

    // --- SÉQUENCE ---
    
    // 1. APPARITION : On le place directement au centre de la grotte
    bear.style.transition = 'none'; // Pas de glissement pour le placement initial
    bear.style.transform = `translate(${targetX_Cave}px, ${targetY_Cave}px)`;
    
    // On force un petit délai pour que l'opacité s'anime après le placement
    setTimeout(() => {
        bear.style.transition = 'opacity 2s ease-in-out';
        bear.style.opacity = '1';
    }, 50);

    // 2. MARCHE vers la ruche
    setTimeout(() => {
        bear.classList.add('is-walking');
        bear.style.transition = 'transform 5s linear';
        bear.style.transform = `translate(${targetX_Ruche}px, ${targetY_Ruche}px)`;
    }, 2100);

    // 3. ARRIVÉE et POT
    setTimeout(() => {
        bear.classList.remove('is-walking');
        pot.classList.add('show-pot'); // Le pot s'affiche enfin !
        bearSvg.style.animation = 'bearEat 0.5s ease-in-out infinite alternate';
    }, 7100);

    // 4. RETOUR vers la grotte
    setTimeout(() => {
        bearSvg.style.animation = '';
        pot.classList.remove('show-pot');
        bear.style.transform = `translate(${targetX_Ruche}px, ${targetY_Ruche}px) scaleX(-1)`; 
        
        setTimeout(() => {
            bear.classList.add('is-walking');
            bear.style.transition = 'transform 5s linear';
            bear.style.transform = `translate(${targetX_Cave}px, ${targetY_Cave}px) scaleX(-1)`;
        }, 500);
    }, 11000);

    // 5. DISPARITION
    setTimeout(() => {
        bear.classList.remove('is-walking');
        bear.style.transition = 'opacity 2s ease-in-out';
        bear.style.opacity = '0';
    }, 16500);
    // 6. RÉINITIALISATION pour pouvoir recommencer
    setTimeout(() => {
        // Remise à zéro du compteur
        flowersClickedCount = 0;

        // Réactivation des fleurs
        const flowers = document.querySelectorAll(flowerSelector);
        flowers.forEach(flower => {
            flower.style.opacity = '1';
            flower.style.pointerEvents = 'auto'; // Elles redeviennent cliquables
        });

        // Remise à zéro de l'ours (caché et retourné à sa position initiale)
        bear.style.transition = 'none'; // Pas de transition pour le reset "invisible"
        bear.style.transform = 'translateX(-150px)';
        bear.style.opacity = '0';
        
        // On retire les classes résiduelles
        bear.classList.remove('is-walking');
        
        console.log("Système réinitialisé, prêt pour un nouvel Easter Egg !");
    }, 18500);

}
// N'oublie pas d'appeler setupEasterEgg() au chargement de ta page !
// document.addEventListener('DOMContentLoaded', setupEasterEgg);



document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialisation
    startCloudSystem();
    spawnImageFlowers(10);
    initBees(5);
    initGrass();
    setupEasterEgg();
    setupButterflies();

    const main = document.querySelector('main');
    const vueInterieure = document.getElementById('interieur-ruche');

    // 2. Gestionnaire de clics unique (Délégation)
    main.addEventListener('click', (e) => {
        
        // --- CLIC SUR LA RUCHE ---
        const ruche = e.target.closest('.ruche-image');
        if (ruche) {
            vueInterieure.classList.add('active');
            main.classList.add('ruche-ouverte');
            return;
        }

        // --- CLIC SUR UN NUAGE ---
        const cloud = e.target.closest('.cloud-svg');
        if (cloud) {
            const rect = cloud.getBoundingClientRect();
            const mainRect = main.getBoundingClientRect();
            createParticles(15, rect.left - mainRect.left + rect.width/2, rect.bottom - mainRect.top, 'raindrop');
            return;
        }

        // --- CLIC SUR UNE FLEUR ---
        const flower = e.target.closest('.scattered-flower');
        if (flower) {
            flower.classList.add('is-shaking-flower');
            setTimeout(() => flower.classList.remove('is-shaking-flower'), 300);
            
            const rect = flower.getBoundingClientRect();
            const mainRect = main.getBoundingClientRect();
            const x = rect.left - mainRect.left + rect.width/2;
            const y = rect.top - mainRect.top + rect.height/2;

            createParticles(6, x, y, 'falling-petal');
            
            // Colère des abeilles
            bees.forEach(bee => {
                const dist = Math.hypot(bee.pos.x - x, bee.pos.y - y);
                if (bee.isPollinating && dist < 60) bee.becomeAngry();
            });
            return;
        }

        // --- CLIC SUR UN ARBRE ---
        const tree = e.target.closest('.tree');
        if (tree) {
            tree.classList.add('is-shaking');
            setTimeout(() => tree.classList.remove('is-shaking'), 400);
            
            const rect = tree.getBoundingClientRect();
            const mainRect = main.getBoundingClientRect();
            createParticles(8, rect.left - mainRect.left + rect.width/2, rect.top - mainRect.top + 40, 'falling-leaf');
        }
    });

    // Bouton retour (Sortir de la ruche)
    document.getElementById('btn-retour').addEventListener('click', () => {
        vueInterieure.classList.remove('active');
        main.classList.remove('ruche-ouverte');
    });

    
});


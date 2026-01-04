// // --- Logique de Random déterministe (Seed) ---
// const seed = 7; 
// function seededRandom(s) {
//     return function() {
//         s = Math.sin(s) * 10000;
//         return s - Math.floor(s);
//     };
// }
// const myRandom = seededRandom(seed);


// --- Logique de Random déterministe (Version robuste) ---
function createSeededRandom(a) {
    return function() {
      let t = a += 0x6D2B79F5;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
}

// On utilise des seeds différentes pour que l'herbe et les fleurs
// n'aient pas exactement le même motif de placement
const grassRandom = createSeededRandom(7); 
const flowerRandom = createSeededRandom(3);

// --- 1. GÉNÉRATION DE L'HERBE ---
export function initGrass() {
    const field = document.querySelector('.grass-field');
    if (!field) return;
    
    const grassCount = 60;
    for (let i = 0; i < grassCount; i++) {
        const grass = document.createElement('div');
        grass.classList.add('grass');

        const posX = grassRandom() * 100;
        const height = 20 + grassRandom() * 30;
        const delay = grassRandom() * -5;
        const brightness = 80 + grassRandom() * 40;

        grass.style.left = `${posX}%`;
        grass.style.height = `${height}px`;
        grass.style.animationDelay = `${delay}s`;
        grass.style.filter = `brightness(${brightness}%)`;

        field.appendChild(grass);
    }
}

// --- 2. GÉNÉRATION DES NUAGES ---
function spawnCloud(isInitial = false) {
    const main = document.querySelector('main');
    if (!main) return;

    const cloud = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    cloud.setAttribute("viewBox", "0 0 100 60");
    cloud.classList.add("cloud-svg");
    cloud.innerHTML = `<path d="M10,40 Q0,40 0,30 Q0,10 20,10 Q30,-5 50,5 Q70,-5 80,10 Q100,10 100,30 Q100,40 90,40 Q90,55 70,55 Q50,65 30,55 Q10,55 10,40 Z" fill="white"/>`;

    const top = Math.random() * 45; 
    const duration = 60 + Math.random() * 60;
    const opacity = 0.6 + Math.random() * 0.4;
    const baseScale = 0.5 + Math.random() * 0.7;

    cloud.style.setProperty('--rand-top', `${top}%`);
    cloud.style.setProperty('--rand-duration', `${duration}s`);
    cloud.style.setProperty('--base-scale', baseScale);
    cloud.style.opacity = opacity;

    if (isInitial) {
        const randomDelay = Math.random() * duration;
        cloud.style.animationDelay = `-${randomDelay}s`;
    }

    main.appendChild(cloud);
    cloud.addEventListener('animationend', () => cloud.remove());
}

export function startCloudSystem() {
    for (let i = 0; i < 8; i++) {
        spawnCloud(true);
    }

    const nextSpawn = () => {
        const time = 8000 + Math.random() * 10000;
        setTimeout(() => {
            spawnCloud(false);
            nextSpawn();
        }, time);
    };
    nextSpawn();
}

// --- 3. GÉNÉRATION DES FLEURS ---
export function spawnImageFlowers(count) {
    const main = document.querySelector('main');
    if (!main) return;

    const flowerImages = [
        'assets/fleur/image.png',
        'assets/fleur/image1.png',
        'assets/fleur/image2.png'
    ];

    for (let i = 0; i < count; i++) {
        const img = document.createElement('img');
        const randomIndex = Math.floor(flowerRandom() * flowerImages.length);
        img.src = flowerImages[randomIndex];
        img.classList.add('scattered-flower');

        const bottom = 5 + flowerRandom() * 30; 
        const left = flowerRandom() * 95; 
        const scale = 0.4 + flowerRandom() * 0.8; 
        const delay = flowerRandom() * -5;

        img.style.bottom = `${bottom}%`;
        img.style.left = `${left}%`;
        img.style.setProperty('--rand-scale', scale);
        img.style.animationDelay = `${delay}s`;

        main.appendChild(img);
    }
}

// Utile pour que les abeilles trouvent les fleurs
export function getFlowerPositions() {
    const flowerElements = document.querySelectorAll('.scattered-flower');
    return Array.from(flowerElements).map(f => ({
        x: f.offsetLeft + f.clientWidth / 2,
        y: f.offsetTop + f.clientHeight / 2,
        element: f
    }));
}
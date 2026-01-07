export function setupButterflies() {
    const main = document.querySelector('main');
    const butterflies = document.querySelectorAll('.butterfly');
    
    if (!main || butterflies.length === 0) return;

    butterflies.forEach(butterfly => {
        // Dimensions du papillon pour ne pas qu'il dépasse
        const bWidth = 50; 
        
        // Position initiale aléatoire DANS le main
        let pos = {
            x: Math.random() * (main.clientWidth - bWidth),
            y: Math.random() * (main.clientHeight - bWidth)
        };
        
        let target = { ...pos };
        let speed = 1.5 + Math.random() * 2;

        function move() {
            // 1. Calcul de la distance vers la cible
            const dx = target.x - pos.x;
            const dy = target.y - pos.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            // 2. Si on est arrivé proche de la cible, on en change
            if (dist < 10) {
                target.x = Math.random() * (main.clientWidth - bWidth);
                target.y = Math.random() * (main.clientHeight - bWidth);
            }

            // 3. Calcul du mouvement
            const angle = Math.atan2(dy, dx);
            
            // Petit mouvement erratique (jitter) propre au papillon
            const jitter = (Math.random() - 0.5) * 4;

            pos.x += Math.cos(angle) * speed + jitter;
            pos.y += Math.sin(angle) * speed + jitter;

            // 4. SÉCURITÉ : On "enferme" le papillon dans le main (Clamping)
            // Si le papillon tente de sortir, on le ramène à la limite
            if (pos.x < 0) pos.x = 0;
            if (pos.y < 0) pos.y = 0;
            if (pos.x > main.clientWidth - bWidth) pos.x = main.clientWidth - bWidth;
            if (pos.y > main.clientHeight - bWidth) pos.y = main.clientHeight - bWidth;

            // 5. Orientation (Miroir)
            const scaleX = (dx > 0) ? 1 : -1;

            // 6. Application
            butterfly.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) scaleX(${scaleX})`;

            requestAnimationFrame(move);
        }

        move();
    });
}
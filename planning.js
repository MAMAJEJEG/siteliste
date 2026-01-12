const fichierJson = 'data.json'; 
const select = document.getElementById('FormatSelect'); 

const todayButton = document.querySelector(".todayButton");
const datePreviousButton = document.querySelector(".datePrevious");
const dateNextButton = document.querySelector(".dateNext");

const tablesSemaine = document.querySelector('.tablesSemaine');
const tablesJour = document.querySelector('.tableJour');

const date = document.querySelector(".date")


let currentDate;

let donneesEvents = {};


// Retourne la date au format YYYY-MM-DD sans décalage
function getFormatYYYYMMDD(dateObj) {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}


async function chargerDonnees() {
    try {
        const reponse = await fetch('data.json');
        if (!reponse.ok) throw new Error("Erreur JSON");

        donneesEvents = await reponse.json();
        
        currentDate = new Date();
        changeDate(0);

        const valeurAuDemarrage = select.value; 
        
        if (valeurAuDemarrage === "jour") {
            tablesJour.classList.remove("tablesHide");
            tablesSemaine.classList.add("tablesHide");
        } else {
            tablesSemaine.classList.remove("tablesHide");
            tablesJour.classList.add("tablesHide");
        }

        printContent(); 

    } catch (erreur) {
        console.error("Erreur :", erreur);
    }
}
chargerDonnees();

function printContent() {
    const mode = select.value;
    const slots = ['matin', 'midi', 'soir'];

    const fillCell = (cellSelector, dataObj) => {
        const cell = document.querySelector(cellSelector);
        if (!cell) return;
        
        const wrapper = cell.querySelector('.img-wrapper') || cell; 
        wrapper.innerHTML = ""; // On vide la case

        if (!dataObj) return;

        if (dataObj.isSecret) {
            const secretIcon = document.createElement('span');
            secretIcon.className = 'quest-icon';
            secretIcon.textContent = '?';
            // On lie l'événement directement à la création dynamique
            secretIcon.onclick = (e) => {
                console.log("test");
                e.stopPropagation();
                openSecretVideo(); // Fonction définie plus bas
            };
            
            wrapper.appendChild(secretIcon);
        }

        // --- 1. GESTION DES LOGOS ---
        const logos = dataObj.logos || [];
        if (logos.length > 0) {
            const logoContainer = document.createElement('div');
            logoContainer.className = "logo-container " + (logos.length > 1 ? 'feat-stack' : '');
            
            logos.forEach((nom, index) => {
                const img = document.createElement('img');
                img.src = `assets/Logo${nom}.jpg`;
                img.style.zIndex = index + 1; 
                img.className = "imgtable";
                logoContainer.appendChild(img);
            });
            wrapper.appendChild(logoContainer);
        }

        // --- 2. GESTION DU TEXTE ---
        if (dataObj.texte && dataObj.texte.trim() !== "") {
            const txt = document.createElement('p');
            txt.className = "event-text";
            txt.className ="txt";
            txt.textContent = dataObj.texte;
            wrapper.appendChild(txt);
        }
    };

    if (mode === "jour") {
        const dateStr = getFormatYYYYMMDD(currentDate);
        slots.forEach(slot => {
            const data = (donneesEvents[dateStr] && donneesEvents[dateStr][slot]) || null;
            fillCell(`.tableJour .${slot}1`, data);
        });
    } else {
        let tempDate = new Date(currentDate);
        const dayNum = tempDate.getDay(); 
        tempDate.setDate(tempDate.getDate() - (dayNum === 0 ? 6 : dayNum - 1));

        for (let i = 0; i < 7; i++) {
            const dateStr = getFormatYYYYMMDD(tempDate);
            const col = i + 1;
            slots.forEach(slot => {
                const data = (donneesEvents[dateStr] && donneesEvents[dateStr][slot]) || null;
                fillCell(`.tablesSemaine .${slot}${col}`, data);
            });
            // ... (mise à jour headCell inchangée)
            tempDate.setDate(tempDate.getDate() + 1);
        }
    }
}

function changeDate(day) {
    currentDate.setDate(currentDate.getDate() + day);

    const mode = select.value;

    if (mode === "jour") {
        date.innerHTML = currentDate.toLocaleDateString('fr-FR', {
            weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
        });
    } else {
        let dateBegin = new Date(currentDate);
        const dayNum = dateBegin.getDay();
        const diffToMonday = (dayNum === 0 ? 6 : dayNum - 1);
        dateBegin.setDate(dateBegin.getDate() - diffToMonday);

        let dateEnd = new Date(dateBegin);
        dateEnd.setDate(dateBegin.getDate() + 6);

        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        date.innerHTML = `${dateBegin.toLocaleDateString('fr-FR', options)} - ${dateEnd.toLocaleDateString('fr-FR', options)}`;
    }
}

datePreviousButton.addEventListener('click', function() {
    const jump = (select.value === "semaine") ? -7 : -1;
    changeDate(jump);
    printContent();
});

dateNextButton.addEventListener('click', function() {
    const jump = (select.value === "semaine") ? 7 : 1;
    changeDate(jump);
    printContent();
});

// Important : Relancer l'affichage quand on change de mode (jour <-> semaine)
select.addEventListener('change', function() {
    let valeurSelectionnee = this.value; 
    if (valeurSelectionnee === "jour") {
        tablesJour.classList.remove("tablesHide");
        tablesSemaine.classList.add("tablesHide");
    } else {
        tablesSemaine.classList.remove("tablesHide");
        tablesJour.classList.add("tablesHide");
    }
    changeDate(0);
    printContent(); // On rafraîchit le contenu immédiatement
});

todayButton.addEventListener('click', function() {
    // 1. On crée une toute nouvelle date (celle de maintenant)
    currentDate = new Date();
    
    // 2. On met à jour l'affichage du texte (le titre de la date)
    changeDate(0); 
    
    // 3. IMPORTANT : On recharge le contenu du planning
    printContent();
    
    console.log("Retour à aujourd'hui :", currentDate);
});

window.openSecretVideo = function() {
    const overlay = document.getElementById('video-egg-overlay');
    const video = document.getElementById('egg-video-player');
    
    if (overlay && video) {
        overlay.style.display = 'flex';
        video.play();
        document.body.style.overflow = 'hidden';

        // --- NOUVEAU : Détecter la fin de la vidéo ---
        video.onended = function() {
            closeSecretVideo(); // Ferme l'overlay automatiquement
        };
    }
};

window.closeSecretVideo = function() {
    const overlay = document.getElementById('video-egg-overlay');
    const video = document.getElementById('egg-video-player');
    
    if (overlay && video) {
        overlay.style.display = 'none';
        video.pause();
        video.currentTime = 0; // Remet à zéro pour la prochaine fois
        document.body.style.overflow = 'auto';
    }
};
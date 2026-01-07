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

    // Fonction utilitaire pour générer les images dans une cellule
    const fillCell = (cellSelector, listesArray) => {
    const cell = document.querySelector(cellSelector);
    if (!cell) return;
    
    // On cherche le wrapper, ou la cellule elle-même si pas de wrapper
    const wrapper = cell.querySelector('.img-wrapper') || cell; 
    wrapper.innerHTML = ""; // On vide la case

    if (listesArray && Array.isArray(listesArray) && listesArray.length > 0) {
        // --- NOUVEAU : Détection du mode "Feat" ---
        if (listesArray.length > 1) {
            // S'il y a plus d'1 logo, on active le mode "pile diagonale"
            wrapper.classList.add('feat-stack');
        } else {
            // Sinon, on s'assure que la classe est retirée pour un centrage normal
            wrapper.classList.remove('feat-stack');
        }

        // Création des images
        listesArray.forEach((nom, index) => {
            const img = document.createElement('img');
            img.src = `assets/Logo${nom}.jpg`;
            // Ajout d'un z-index croissant pour que le dernier du tableau soit au-dessus
            img.style.zIndex = index + 1; 
            img.className = "imgtable";
            wrapper.appendChild(img);
        });
    } else {
        // Si la case est vide, on nettoie la classe
        wrapper.classList.remove('feat-stack');
    }
};

    if (mode === "jour") {
        const dateStr = getFormatYYYYMMDD(currentDate);
        slots.forEach(slot => {
            const listes = (donneesEvents[dateStr] && donneesEvents[dateStr][slot]) || [];
            fillCell(`.tableJour .${slot}1`, listes);
        });
    } else {
        // --- MODE SEMAINE ---
        let tempDate = new Date(currentDate);
        const dayNum = tempDate.getDay(); 
        tempDate.setDate(tempDate.getDate() - (dayNum === 0 ? 6 : dayNum - 1));

        for (let i = 0; i < 7; i++) {
            const dateStr = getFormatYYYYMMDD(tempDate);
            const col = i + 1;
            
            slots.forEach(slot => {
                const listes = (donneesEvents[dateStr] && donneesEvents[dateStr][slot]) || [];
                fillCell(`.tablesSemaine .${slot}${col}`, listes);
            });

            // Mise à jour de l'en-tête (Lun. 12, etc.)
            const headCell = tablesSemaine.querySelector(`.head-${col}`);
            if (headCell) {
                headCell.innerHTML = `${tempDate.toLocaleDateString('fr-FR', { weekday: 'short' })} ${tempDate.getDate()}`;
                const isToday = tempDate.toDateString() === new Date().toDateString();
                headCell.classList.toggle("today-header", isToday);
            }
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
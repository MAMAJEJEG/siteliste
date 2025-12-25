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
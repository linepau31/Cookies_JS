const affichage = document.querySelector('.affichage');
const btns = document.querySelectorAll('button');
const inputs = document.querySelectorAll('input');
const infoTxt = document.querySelector('.info-txt')
let dejaFait = false;

const today = new Date(); // la date d'aujourd'hui, new Date()
const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000); // rajoute 1 semaine, se déplacer dans le temps
// console.log(nextWeek);
let day = ('0' + nextWeek).slice(9,11);  // jours, slice qui découpe la chaine de caractère
let month = ('0' + (nextWeek.getMonth() + 1)).slice(-2); // mois
let year = today.getFullYear(); // années
document.querySelector('input[type=date]').value = `${year}-${month}-${day}`;


btns.forEach(btn => { // pour chaque btn, tableau
    btn.addEventListener('click', btnAction); // au clic
})

function btnAction(e){ 

    let nvObj = {}; // Nouvel obj, mais vide

    inputs.forEach(input => { // pour chaque input
        let attrName = input.getAttribute('name');
	// est ce que attrName ou attrValue est différent de cookie? si oui, on prend input.value, sinon on prend input.valueAsDate
        let attrValeur = attrName !== "cookieExpire" ? input.value : input.valueAsDate;
        nvObj[attrName] = attrValeur; // new obj
    })
    // console.log(nvObj);
    let description = e.target.getAttribute('data-cookie'); // btn clic

    if(description === "creer"){ // créer un cookie
        creerCookie(nvObj.cookieName, nvObj.cookieValue, nvObj.cookieExpire);
    } 
    else if (description === "toutAfficher"){ // sinon, on fait apparaitre la liste des cookie 
        listeCookies();
    }
}


function creerCookie(name, value, exp){

    infoTxt.innerText = ""; // info de chaine de caractère vide
    affichage.innerHTML = ""; // chaine de caractère vide 

    // Si le cookie à un même nom
    let cookies = document.cookie.split(';'); // split en tableau jusqu'au ; va faire un tableau
    cookies.forEach(cookie => { // pour chaque cookie du tableau créer avec split

        cookie = cookie.trim(); // trim enlève les espaces blanc au début et à la fin de l'élément
        // console.log(cookie);
        let formatCookie = cookie.split('='); // tableau avec (le 1er élément) le nom du cookie
        // console.log(formatCookie);
        if(formatCookie[0] === encodeURIComponent(name)){ // le cookie formaté, [0] c'est le nom du cookie est strictement égale à encodeURIComponent(name)
            dejaFait = true; // si le nom dans l'input est égale au cookie, déjà fait
        }
    })

    if(dejaFait){
        infoTxt.innerText = "Un cookie possède déjà ce nom!" // message qui s'affiche
        dejaFait = false; // false pour pouvoir regarder les autres condition
        return; // retour à zéro
    }

    // Si le cookie n'a pas de nom
    if(name.length === 0) { // strictement égale à 0
        infoTxt.innerText = `Impossible de définir un cookie sans nom.` // message qui s'affiche
        return; // l'enlève aprés
    }

    document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)};expires=${exp.toUTCString()}`; // transforme en chaine de caractère
    let info = document.createElement('li');
    info.innerText = `Cookie ${name} créé.`; // créer un message 
    affichage.appendChild(info);
    setTimeout(() => {
        info.remove(); // enlève le message cookie créer
    }, 1500) // 1.5seconde
}

function listeCookies(){ // création d'une fonction liste cookie

    let cookies = document.cookie.split(';'); // créer un tableau à partir de ;
    if(cookies.join() === "") { // join (l'inverse de split qui transforme une chaine de caractère en tableau), transforme un tableau en chaine de caractère
        infoTxt.innerText = 'Pas de cookies à afficher'; // message qui s'affiche
        return;
    }

    cookies.forEach(cookie => { // pour chaque cookie

        cookie = cookie.trim(); // on lui enlève les espace avant et aprés
        let formatCookie = cookie.split('='); 

        // console.log(formatCookie);
        let item = document.createElement('li'); // créer un élément de liste
        
        infoTxt.innerText = 'Cliquez sur un cookie dans la liste pour le supprimer.' // message qui s'affiche
        // décode les caratère spéciaux en chaine de caractères pour le faire lire par quelqu'un
        item.innerText = `Nom : ${decodeURIComponent(formatCookie[0])}, Valeur : ${decodeURIComponent(formatCookie[1])}`;
        affichage.appendChild(item);


        // Suppression cookie
        item.addEventListener('click', () => { // envoie une fonction supprimer au clic

            document.cookie = `${formatCookie[0]}=; expires=${new Date(0)}` // supprimer cookie à la date qui est déjà passer (date, expires)
            item.innerText = `Cookie ${formatCookie[0]} supprimé`; // le text dans l'item que le cookie est supprimer
            setTimeout(() => {
                item.remove(); // enlève l'item
            }, 1000); // au bout d'1 seconde

        })
    })

}
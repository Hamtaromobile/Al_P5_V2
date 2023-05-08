let data; // données utilisé dans fonction "getKanapIdApi()" et "displayKanap()"
let url = `http://localhost:3000/api/products/`; //URL des produits
let urlOdrer = `http://localhost:3000/api/products/order`; // URL pour envoyer la commande vers API

let coulKanap = []; //va permettre d'afficher la couleur sélectionné; utilisé dans la fonction getKanapIdApi() et displayKanap()
let nbrKanap = []; //va permettre d'afficher le nombre sélectionné; utilisé dans la fonction getKanapIdApi() et displayKanap()
let i = 0; // init. i va permettre le stockage de données ds des tab. aux différentes itérations
let kanapLoad; // va permettre de récupérer le LS initiale au chargement de la page
let kanapReload; // va permettre de reload la page si un utilisateur ajoute un "kanap", alors que carte.html est affiché

/******EVENEMENT D'ECOUTE AU CHARGEMENT ***********/

document.addEventListener("DOMContentLoaded", function () {
	kanapLoad = getKanapLS(); //Récup. LS init. au chargement
});

/******FONCTION QUI RELOAD LA PAGE PANIER LORSQU'UN NOUVEAU "KANAP" EST AJOUTE ***********/

function reload() {
	kanapReload = getKanapLS(); //Récup.nouveau LS
	if (kanapReload.length > kanapLoad.length) {
		// si nouveau LS > LS init. ; ajout d'un nouveau "kanap" par l'utilisateur
		window.location.reload(); // reload page
	}
}

/******EVENEMENT D'ECOUTE AU CHANGEMENT DU LS ***********/

window.addEventListener("storage", function () {
	reload(); //Lance la fonction de rechargement de la page
});

/******FONCTION DE RECUPERATION DE "KANAP" DANS LE LOCAL STORAGE ***********/

function getKanapLS() {
	let Kanap = [];
	Kanap = localStorage.getItem("Kanap"); //Récup. du LS
	if (Kanap == null) {
		// Si LS vide
		return []; //return tab. vide
	} else {
		// Sinon LS existe
		return JSON.parse(Kanap); //return de Kanap reformer en données complexes
	}
}

/******FONCTION QUI SAUVEGARDE "KANAP" DANS LE LOCAL STORAGE ***********/

function saveKanap(Kanap) {
	localStorage.setItem("Kanap", JSON.stringify(Kanap)); //Clé "Kanap" (valeur recupéré) associé à variable Kanap ; Sérialisation : Kanap données complexes => chaine de caracteres (pour que le localStorage puisse l'enregistrer)
}

/******FONCTION QUI CHERCHE LES DONNEES "KANAP" DANS L'API POUR L'AFFICHAGE ***********/

function getKanapIdApi() {
	let newKanap = getKanapLS(); // LS dans "newKanap"
	for (let dataKanap of newKanap) {
		// Parcours NewKanap pour créer coul. et nbr. Et fetch avec l'id
		coulKanap.push(dataKanap.colors);
		nbrKanap.push(dataKanap.nbr);
		fetch(url + `${dataKanap.id}`) //requête "fetch" pour aller chercher les informations dans l'API
			.then(function (response) {
				//Fonction qui récupère la "promise" de la requête "fetch"
				data = response.json();
				return data; //Renvoie de la promise en .json
			})
			.then(function (data) {
				//Récupération de la promise en .json; data est un objet
				displayKanap(data); // Appel fonction affichage
				i++; //incrémentation pour l'affichage
				return data; //renvoie les données "kanap" et l'incrémentation
			})
			.catch((err) => alert("Erreur : " + err)); //Message d'erreur si requête "fetch" non fonctionnelle*/
	}
}
getKanapIdApi(); // appel de la fonction qui cherche les données dans l'API

/******FONCTION QUI AFFICHE LES "KANAP" DU PANIER ***********/

let dataNbr = 0; // va contenir le nombre des "kanap" sélectionné par l'utilisateur
let dataPrice = 0; // va contenir le prix total des "kanap" sélectionné par l'utilisateur
let tabPrice = []; // va contenir le prix spécifique de chaque "kanap" sélectionner pour le récupérer lors d'un changement du nombre de "kanap" par l'utilisateur
let affichage = []; //Tableau d'affichage des données "kanap" appelé dans "diplayKanap" et dont l'index évolue à chaque itération de "i" de la fonction getKanapIdApi

function displayKanap(data) {
	let TailleTab = []; //Variable qui va permettre de lancer la fonction totalDisplay
	TailleTab = getKanapLS(); //Recup "kanap" LS dans "TailleTab" pour avoir la lgr du tab.en provenance du LS
	data.colors = coulKanap[i]; //récup. coul. kanap à l'itération du tab. dataKanap de la fonction getKanapIdApi()
	data.nbr = nbrKanap[i]; //récup. nbr kanap à l'itération du tab. dataKanap de la fonction getKanapIdApi()
	dataNbr = Number(data.nbr) + Number(dataNbr); // Nombre total de "kanap" ajouté au panier pour fonction "totalDisplay"
	dataPrice = data.price * data.nbr + Number(dataPrice); // Prix total des "kanap" ajouté au panier pour fonction "totalDisplay"
	priceKanap = data.nbr * data.price; //Prix "kanap" en fonction du nombre sélectionné
	tabPrice[i] = data.price; // Tableau des prix des "kanaps" pour fonction "totalDisplayOnClick"
	affichage[i] =
		//Tableau d'affichage des différents "kanaps" sélectionnés
		`<article class="cart__item"> 
        <div class="cart__item__img">  
            <img src="${data.imageUrl}" alt="${data.altTxt}"/> 
        </div> 
        <div class="cart__item__content"> <h2 class="productName">${data.name}</h3> 
            <p>"${data.colors}"</p> <p id="priceKanap${i}">${priceKanap} Euros<p> 
        </div> 
        <div class="cart__item__content__settings">
            <div class="cart__item__content__settings__quantity">
                <p>Qté : </p>
                <input onclick="totalDisplayOnClick(${i})" type="number" class="itemQuantity" name="itemQuantity"  id="itemQuantity${i}" min="1" max="100" value=${data.nbr} onkeydown="if (event.keyCode === 189 || event.keyCode === 109) return false;">

            </div>
                <div class="cart__item__content__settings__delete">
                <p onclick="deleteItem (${i})" class="deleteItem" >Supprimer</p>
            </div>
        </div>
    </article>`;
	/* envoie des données dans carte.html*/
	document.querySelector("#cart__items").innerHTML = affichage.join(""); // join("") : supp des virgules entre tab.
	if (TailleTab.length == affichage.length) {
		//Lorsque tout les "kanap" du LS sont affichés :
		totalDisplay(dataNbr, dataPrice); //on appel la fonction qui affiche le nbr et le prix de tout les "kanap" du LS
	}
}

/******FONCTION QUI AFFICHE LE PRIX ET LE NOMBRE DE "KANAP" ***********/

function totalDisplay(dataNbr, dataPrice) {
	document.querySelector("#totalQuantity").innerHTML = dataNbr; //Nbr total "kanap" vers carte.html
	document.querySelector("#totalPrice").innerHTML = dataPrice; //Prix total "kanap" vers carte.html
}

/******FONCTION QUI CHANGE LE PRIX ET LE NOMBRE DE "KANAP" AU CHANGEMENT DU CHOIX DU NOMBRE DE "KANAP" ***********/

function totalDisplayOnClick(e) {
	//Récup (e) : où le "kanap" choisi est affiché avec son prix et sa quantitée
	let prixKanapTot = tabPrice[e]; // Récup. prix "kanap" du tableau de prix créé dans la fonction displayKanap()
	let itemQuantityKanap = Number(
		document.querySelector(`#itemQuantity${e}`).value
	); // Récup. de la nouvelle quantitée choisis
	document.querySelector(`#priceKanap${e}`).innerHTML = `${
		prixKanapTot * itemQuantityKanap
	} Euros`; //Nouveau prix Total pr un type de "kanap"
	document.querySelector("#totalPrice").innerHTML = 0; // init prix tot.  "kanap"
	for (j = 0; j < i; j++) {
		// re init prix total "kanap"
		document.querySelector("#totalPrice").innerHTML =
			Number(document.querySelector("#totalPrice").innerHTML) +
			Number(document.querySelector(`#itemQuantity${j}`).value) *
				Number(tabPrice[j]);
	}

	document.querySelector("#totalQuantity").innerHTML = 0; // init. nbre total de "kanap"
	for (j = 0; j < i; j++) {
		// re init nbre total de "kanap"
		document.querySelector("#totalQuantity").innerHTML =
			Number(document.querySelector("#totalQuantity").innerHTML) +
			Number(document.querySelector(`#itemQuantity${j}`).value);
	}
}

/******FONCTION QUI SUPPRIME LES "KANAP" DU PANIER ***********/

function deleteItem(e) {
	//appel au "click" avec recup. de l'index "e" envoyé par "(${i})"
	let KanapDI = getKanapLS(); // Récup. panier LS
	let indexKanap = KanapDI[e]; //Elément du tab. à suppà l'index "e"
	let index = KanapDI.indexOf(indexKanap); //renvoie 1er index auquel un élément donné peut être trouvé dans le tableau, ou -1 s'il n'est pas présent.
	if (index > -1) {
		KanapDI.splice(index, 1); // sup. 1 élément à "index"
	}
	saveKanap(KanapDI); //appel de la fonction qui sauvegarde dans LS
	window.location.reload(); // reload page
}

document.querySelector("#order").addEventListener("click", validForm); //Ecoute du "click" bouton "Commander !"
/*Appel de la fonction "validForm"*/

let allowSend = new Boolean(false); //variable qui va autoriser avec la fonction dataUser l'envoie des données dans l'API avec la fonction "sendData"

/******FONCTION QUI COMPART LES DONNEES ENTREES PAR L'UTILISATEUR AVEC DES REGEXS ***********/

function dataUser() {
	/* Création de "Regex" pour corriger les erreurs d'écritures*/
	let nameRegex = /^[a-zA-Z ]+$/;
	let addressRegex = /^[a-zA-Z0-9\s,.'-]{3,}$/;
	let cityRegex = /^[a-zA-Z\u0080-\u024F\s\/\-\)\(\`\.\"\']+$/;
	let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
	let allowSendFiN = new Boolean(false); //Empêche l'envoie de données si "firstName" non conforme
	let allowSendLN = new Boolean(false); //Empêche l'envoie de données si "lastName" non conforme
	let allowSendA = new Boolean(false); //Empêche l'envoie de données si "address" non conforme
	let allowSendC = new Boolean(false); //Empêche l'envoie de données si "city" non conforme
	let allowSendE = new Boolean(false); //Empêche l'envoie de données si "email" non conforme
	/*firstName*/
	let firstName = document.querySelector("#firstName").value; //Prénom entré par l'utilisateur
	if (nameRegex.test(firstName)) {
		//Comparaison avec regex
		allowSendFiN = true; //autorisation d'envoie à l'API
		document.querySelector("#firstNameErrorMsg").innerHTML = "";
	} else {
		document.querySelector("#firstNameErrorMsg").innerHTML =
			"Votre nom n'est pas écrit correctement"; //rapport d'une erreur
		allowSendFiN = false;
		allowSend = false; //refus d'envoie à l'API
	}
	/*lastName*/
	let lastName = document.querySelector("#lastName").value; //Nom de famille entré par l'utilisateur
	if (nameRegex.test(lastName)) {
		//comparaison avec regex
		document.querySelector("#lastNameErrorMsg").innerHTML = "";
		allowSendLN = true; //autorisation d'envoie à l'API
	} else {
		document.querySelector("#lastNameErrorMsg").innerHTML =
			"Votre prénom n'est pas écrit correctement"; //rapport d'une erreur
		allowSendLN = false;
		allowSend = false; //refus d'envoie à l'API
	}
	/*address*/
	let address = document.querySelector("#address").value; //Adresse entré par l'utilisateur
	if (addressRegex.test(address)) {
		//comparaison avec regex
		document.querySelector("#addressErrorMsg").innerHTML = "";
		allowSendA = true; //autorisation d'envoie à l'API
	} else {
		document.querySelector("#addressErrorMsg").innerHTML =
			"Votre adresse n'est pas écrite correctement"; //rapport d'une erreur
		allowSendA = false;
		allowSend = false; //refus d'envoie à l'API
	}
	/*city*/
	let city = document.querySelector("#city").value; //Ville entré par l'utilisateur
	if (cityRegex.test(city)) {
		//comparaison avec regex
		document.querySelector("#cityErrorMsg").innerHTML = "";
		allowSendC = true; //autorisation d'envoie à l'API
	} else {
		document.querySelector("#cityErrorMsg").innerHTML =
			"Le nom de votre ville n'est pas écrit correctement"; //rapport d'une erreur
		allowSendC = false;
		allowSend = false; //refus d'envoie à l'API
	}
	/*email*/
	let email = document.querySelector("#email").value; //Email entré par l'utilisateur
	if (emailRegex.test(email)) {
		//comparaison avec regex
		document.querySelector("#emailErrorMsg").innerHTML = "";
		allowSendE = true; //autorisation d'envoie à l'API
	} else {
		document.querySelector("#emailErrorMsg").innerHTML =
			"Votre email n'est pas écrit correctement"; //rapport d'une erreur
		allowSendE = false;
		allowSend = false; //refus d'envoie à l'API
	}
	if (
		allowSendFiN == false ||
		allowSendLN == false ||
		allowSendA == false ||
		allowSendC == false ||
		allowSendE == false
	) {
		allowSend = false;
		alert("Vos coordonnées ne sont pas correctement remplies.");
	} else {
		allowSend = true;
	}
}

/******FONCTION QUI VALIDE FORMULAIRE ET AUTORISE L'ENVOI DE LA COMMANDE ***********/

async function validForm() {
	let KanapVF = localStorage.getItem("Kanap"); //Récup. du LS
	dataUser(); //Appel la fonction qui va vérifier les données entrés pas l'utilisateur
	if (allowSend == true && KanapVF != null) {
		//Si l'autorisation d'envoyé vers l'API est valide et si présence "Kanap" dans LS
		sendData(); //Appel de la fonction qui envoie les données à l'API
	} else if (allowSend == true && KanapVF == null) {
		//Si pas de "Kanap" ds LS rapport d'erreur
		alert("Vous n'avez pas choisi de Kanap"); //rapport d'une erreur
		allowSend = false;
	}
}

/******FONCTION D'ENVOIE DE LA COMMANDE DANS L'API POUR RECUP. NUM. DE COM. ***********/

function sendData() {
	let KanapSD = getKanapLS(); //recup. "kanap" ds LS
	let products = []; // Tableau d'id. de "kanap" pour envoie vers API
	for (let productsKanap of KanapSD) {
		// Boucle qui insert les id. de Kanap dans products
		products.push(productsKanap.id);
	}

	/* Création : "commande" avec l'objet "contact" et le tableau d'id "products" */
	const commande = {
		contact: {
			firstName: document.querySelector("#firstName").value,
			lastName: document.querySelector("#lastName").value,
			address: document.querySelector("#address").value,
			city: document.querySelector("#city").value,
			email: document.querySelector("#email").value,
		},
		products,
	};

	/*Envoie des données vers l'API*/
	const promise01 = fetch(urlOdrer, {
		method: "POST", // méthode d'encodage pour envoyé à l'API
		body: JSON.stringify(commande), // données de commande en "string"
		headers: {
			//Informe API, données envoyées: "json"
			Accept: "application/json",
			"Content-Type": "application/json",
		},
	});
	/*Réception des données envoyé par l'Api*/
	promise01.then(async (response) => {
		//att. de la response de la promise01
		try {
			const numCom = await response.json(); //Récup. du num. de com. envoyé par l'API
			clientConfirm(numCom); // Appel de la fonction qui créer un id. client et qui envoie vers la page de confirm.
		} catch (e) {
			console.log(e);
		}
	});
}

/******FONCTION DE CREATION D'UN ID POUR LE CLIENT ***********/

function clientConfirm(numCom) {
	/*Récupération h. min. s. mins. pour création ID*/
	const today = new Date();
	const milliseconds = today.getUTCMilliseconds();
	const seconds = today.getUTCSeconds();
	const minutes = today.getUTCMinutes();
	const hours = today.getUTCHours();
	/*Création Id client*/
	const clientId =
		"?id=" +
		milliseconds +
		"" +
		seconds +
		"" +
		minutes +
		"" +
		hours +
		"" +
		document.querySelector("#firstName").value.length +
		"" +
		document.querySelector("#lastName").value.length +
		"" +
		document.querySelector("#address").value.length +
		"" +
		document.querySelector("#city").value.length +
		"" +
		document.querySelector("#email").value.length +
		document.querySelector("#firstName").value.charAt(0) +
		document.querySelector("#lastName").value.charAt(0);
	localStorage.removeItem("Kanap"); // Clear LS
	localStorage.setItem("numCom", JSON.stringify(numCom)); //numéro de commande envoyé au LS
	let urlConfirm = new URL(
		"http://127.0.0.1:5500/front/html/confirmation.html"
	);
	(window.location.href = urlConfirm + clientId).load(); //chargement page confirmation avec l'id. client
}

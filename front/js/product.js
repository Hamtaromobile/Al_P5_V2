/******METHODE SEARCHE PARAMS : RECUPERE PARAMETRES URL ***********/

let kanapData = new Object(); //Objet qui va contenir la couleur, le prix et l'id. du "kanap"

/******REQUETE FETCH POUR ALLER CHERCHER LES INFORMATIONS DU "KANAPS" A AFFICHER DANS L'API ***********/
window.onload = function getKanapApiDisplay() {
	//appel la fonction au chargement de la page
	let params = new URL(document.location).searchParams; //document.location : informations URL ;
	let id = params.get("id"); // On isole le paramètre id de l'URL précédente dans la variable "id"

	fetch(`http://localhost:3000/api/products/${id}`) //requête "fetch" pour aller chercher les informations dans l'API avec l'id du "kanap" à afficher
		.then(function (response) {
			//Fonction qui récupère la "promise" de la requête "fetch"
			let data = response.json();
			return data; //Renvoie de la promise en .json
		})
		.then(function (data) {
			//Récupération de la promise en .json; data est un objet
			document.querySelector(
				".item__img"
			).innerHTML = `<img src="${data.imageUrl}" alt="${data.altTxt}"/>`; //image vers product.html        document.querySelector("#title").innerHTML = `<h1 id="title">${data.name}</h1>`;
			document.querySelector(
				"#price"
			).innerHTML = `<span id="price">${data.price}</span>`; //prix vers product.html
			document.querySelector(
				"#description"
			).innerHTML = `<p id="description">${data.description}</p>`; //description vers product.html
			/*création des éléments "id", "colors", et nbr pour l'objet "kanapData"*/
			kanapData.id = data._id;
			kanapData.colors = "void";
			kanapData.nbr = 0;
			return data;
		})
		.catch((err) => alert("Erreur : " + err)); //Message d'erreur si requête "fetch" non fonctionnelle*/
};

/******FONCTION QUI SAUVEGARDE "KANAP" DANS LE LOCAL STORAGE ***********/

function saveKanap(Kanap) {
	//Enregistre le panier dans le localStorage
	localStorage.setItem("Kanap", JSON.stringify(Kanap)); //Clé "Kanap" (valeur recupéré) associé à variable Kanap ; Sérialisation : Kanap données complexes => chaine de caracteres (pour que le localStorage puisse l'enregistrer)
}

/******FONCTION DE RECUPERATION DE "KANAP" DANS LE LOCAL STORAGE ***********/

function getKanapLS() {
	//fonction qui recupère ou non le panier situé dans le localStorage
	let Kanap = [];
	Kanap = localStorage.getItem("Kanap"); //On enregistre dans la variable Kanap les données recupérés du LocalStorage
	if (Kanap == null) {
		// si Le panier du localStorage est vide
		return []; //On return un tableau vide => panier vide
	} else {
		// sinon Le panier du localStorage existe
		return JSON.parse(Kanap); //return de Kanap reformer en données complexes
	}
}

/******FONCTION D'AJOUT D'UN "KANAP" AU PANIER ***********/

const addKanap = () => {
	if (document.querySelector("#colors").value == "") {
		// Empêche l'envoie au panier si pas de couleur séléctionné
		alert("Veuillez choisir une couleur de kanap"); //Rapporte une erreur
	} else if (document.querySelector("#quantity").value == 0) {
		// Empêche l'envoie au panier si pas de nombre séléctionné
		alert("Veuillez sélectionner un nombre d'articles"); // Rapporte une erreur
	} else {
		let KanapAK = []; // Création tab. KanapAK pour ajouter un "kanap" selectionner par un utilisateur
		KanapAK = getKanapLS(); //Récup. "Kanap" LS
		let selectcoul = document.getElementById("colors"); //récupération valeur couleur
		let selectnbr = document.getElementById("quantity"); //récupération valeur nombre
		let KanapNbr = 0;
		for (const dataKanap of KanapAK) {
			if (
				kanapData.id == dataKanap.id &&
				selectcoul.value == dataKanap.colors
			) {
				let idToDelete = dataKanap.id; // id de l'objet à supprimer
				let colorToDelete = dataKanap.colors; //couleur de l'objet à supprimer
				KanapNbr = dataKanap.nbr;
				// Recherche de l'index de l'objet à supprimer
				let index = KanapAK.findIndex(
					(obj) => obj.id === idToDelete && obj.colors === colorToDelete
				);

				// Suppression de l'objet à l'index trouvé
				if (index !== -1) {
					KanapAK.splice(index, 1);
				}
			}
		}
		const KanapPanier = Object.assign({}, kanapData, {
			//Création d'un nouvelle objet "kanaPanier",assignation,id,coul,nbr
			colors: `${selectcoul.value}`, //Récup. couleurs selectionné par l'utilisateur
			nbr: parseInt(`${selectnbr.value}`) + parseInt(KanapNbr), //Récup. nbr sélectionné par l'utilisateur
		});

		alert("Kanap ajouté"); // Préviens l'utilisateur de l'ajout d'un "kanap"
		KanapAK.push(KanapPanier); //Ajoute le "kanap" sélectionner aux autres "kanap"
		saveKanap(KanapAK); // Sauvegarde de cette nouvelle sélection
	}
};

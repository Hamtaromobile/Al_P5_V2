let affichage = []; // Tableau des éléments à afficher
let data // Données renvoyées par l'API
let i = 0; //init. i qui va permettre le stockage des données dans le tab. "affichage" aux différentes itérations

/******REQUETE FETCH POUR ALLER CHERCHER LES INFORMATIONS DES "KANAPS" DANS L'API ***********/

function getKanapsApiDisplay() {
    fetch('http://localhost:3000/api/products') //requête "fetch" pour aller chercher les informations dans l'API
        .then(function(response) { //Fonction qui récupère la "promise" de la requête "fetch"
            data = response.json();
            return data; //Renvoie de la promise en .json
        })
        .then(function(data) { //Récupération de la promise en .json
            for (let kanap of data) { //Boucle "for of" qui parcourt le tableau d'objets "data" ; met les données dans "kanap"
                affichage[i] = `<a href="./product.html?id=${kanap._id}">
                <article> 
                    <img src="${kanap.imageUrl}" alt="${kanap.altTxt}"/> 
                    <h3 class="productName">${kanap.name}
                    </h3> 
                    <p>${kanap.price} Euros 
                    </p>
                    <p class="productDescription">${kanap.description}
                    </p> 
                </article> 
            </a>`; //Envoie des données à afficher dans le tableau "affichage"
                i++; // on augmente i de +  à chaque passage dans la boucle 
            }
            document.querySelector("#produits_kanap").innerHTML = affichage.join(""); // envoie des données à afficher vers produc.html supp des virgules entre tab; 
        })
        .catch((err) => alert("Erreur : " + err)); //Message d'erreur si requête "fetch" non fonctionnelle
};
getKanapsApiDisplay()
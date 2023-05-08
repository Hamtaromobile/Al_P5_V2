/******FONCTION QUI RECUPERE LE NUM. DE COMMANDE DANS LE LS ***********/

function getDataClient() {
    let numCom = localStorage.getItem("numCom"); //Récup. du LS
    if (numCom == null) { // Si LS vide
        return []; //return tab. vide
    } else { // Sinon LS existe
        return JSON.parse(numCom); //return numCom reformer en données complexes
    }
};

/******FONCTION QUI AFFICHE LE NUMERO DE COMMANDE ***********/

function Display() {
    data = getDataClient(); // Récup. LS
    const numCom = data.orderId; // Récup. num. com.
    document.querySelector("#orderId").innerHTML = numCom.toString(); // Affichage num. com. vers confirmation.html
    localStorage.removeItem("numCom"); // Clear LS
};

Display() //Appel de la fonction d'affichage
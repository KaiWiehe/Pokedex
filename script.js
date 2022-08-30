let pokemonLimit = 10;
let pokemonLimitStart = 0;
let pokemonNameAndUrlList = []; // Only the Names and the Url's
let loadedPokemon = []; // All Infos and Img's ...

async function loadAllPokemon() {
    await download();
    renderPokeDeck();
}

function renderPokeDeck() {
    for (let i = 0; i < pokemonNameAndUrlList[0].length; i++) {
        let pokemon = loadedPokemon[i];
        let img = pokemon['sprites']['other']['dream_world']['front_default']; // Dort findet man im JSON das Bild 
        let nameBig = capitalizeFirstLetter(pokemon['name']); // Damit der Name auch großgeschrieben wird
        let card = document.getElementById('cardContainer');

        loadCard(card, img, nameBig, pokemon, i);
        changeColor(pokemon, i);
    }
}

/* #############################################   Hilfsfunktionen   ############################################# */

async function download() {
    //###############################Lädt die Liste mit Name und Url runter###############################

    let url = `https://pokeapi.co/api/v2/pokemon?limit=${pokemonLimit}&offset=${pokemonLimitStart}` // Setzt die URl von allen Pokemon fest, grade auf 100 limitiert
    let response = await fetch(url); // Lädt die "Datei" als String herunter
    let pokemon = await response.json(); // Wandelt diese in ein JSON um

    pokemonNameAndUrlList.push(pokemon['results']);
    console.log(pokemonNameAndUrlList);

    //###########################Lädt die ganzen Daten für jedes Pokemon einzeln herunter###########################

    for (let i = 0; i < pokemonNameAndUrlList[0].length; i++) {
        let pokemonList = pokemonNameAndUrlList[0][i];

        let url = pokemonList['url']; // Legt die neue URL fest, die von dem einzelnen Pokemon
        let response = await fetch(url); // Lädt die Datei herrunter
        let pokemon = await response.json(); // Formatiert sie in eine JSON Datei

        loadedPokemon.push(pokemon);
    }
    console.log(loadedPokemon);
}


/**
 * @param string 
 * @returns string Großgeschrieben
 * @example
 * // Die Funktion gibt uns "Name" zurück
 * console.log(capitalizeFirstLetter(name))
 */
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * @param number 
 * @returns number / 10
 * @example
 * // Die Funktion gibt uns "12.3" zurück
 * console.log(divided10(123))
 */
function divided10(number) {
    return number / 10;
}


/** Ließt das Inputfeld aus und vergleicht es mit den Pokemon Namen und zeigt auch nur die an die im Inputfeld stehen*/
function search() {
    let search = document.getElementById('search').value;
    search = search.toLowerCase(); /* .toLowerCase ist dazu da damit die funktion nicht auf groß und kleinschreibung achtet */

    let cardContainer = document.getElementById('cardContainer');
    cardContainer.innerHTML = ``; /* Löscht alles raus um dann nur die gesuchten anzuzeigen */

    if (search.length > 0) {
        for (let i = 0; i < pokemonNameAndUrlList[0].length; i++) {
            if (pokemonNameAndUrlList[0][i]['name'].toLowerCase().includes(search)) { /* .includes(search) damit vergleicht er die Namen mit dem was ich im Inputfeld eingebe */
                loadSearchedPokemon(i);
            }
        }
    } else {
        renderPokeDeck();
    }
}

function loadSearchedPokemon(i) {
    let pokemon = loadedPokemon[i];
    let img = pokemon['sprites']['other']['dream_world']['front_default']; // Dort findet man im JSON das Bild 
    let nameBig = capitalizeFirstLetter(pokemon['name']); // Damit der Name auch großgeschrieben wird
    let card = document.getElementById('cardContainer');

    loadCard(card, img, nameBig, pokemon, i);
    changeColor(pokemon, i);
}

/** Guckt durch jede Karte und vergibt die passende Farbe je nach Type des Pokemon
 * @example 
 * Wenn der Type des Pokemon "Wasser" ist ändert die funktion die hintergrundfarbe zu Blau
 */
function changeColor(pokemon, i) {
    if (pokemon['types'][0]['type']['name'] === 'water') {
        document.getElementById(`card${i}`).style = "width: 18rem;background: var(--bs-info);"
    } else if (pokemon['types'][0]['type']['name'] === 'grass') {
        document.getElementById(`card${i}`).style = "width: 18rem;background: var(--bs-green);"
    } else if (pokemon['types'][0]['type']['name'] === 'fire') {
        document.getElementById(`card${i}`).style = "width: 18rem;background: var(--bs-danger);"
    } else if (pokemon['types'][0]['type']['name'] === 'bug') {
        document.getElementById(`card${i}`).style = "width: 18rem;background: var(--bs-yellow);"
    } else if (pokemon['types'][0]['type']['name'] === 'normal') {
        document.getElementById(`card${i}`).style = "width: 18rem;background: var(--bs-secondary);"
    } else if (pokemon['types'][0]['type']['name'] === 'electric') {
        document.getElementById(`card${i}`).style = "width: 18rem;background: var(--bs-orange);"
    } else if (pokemon['types'][0]['type']['name'] === 'poison') {
        document.getElementById(`card${i}`).style = "width: 18rem;background: var(--bs-purple);"
    } else if (pokemon['types'][0]['type']['name'] === 'ground') {
        document.getElementById(`card${i}`).style = "width: 18rem;background: var(--bs-light);"
    }
}

/** Lädt das HTML Gerüst der Karte */
function loadCard(card, img, nameBig, pokemon, i) {
    card.innerHTML += /* html */ `
        <div id="card${i}" class="card" style="width: 18rem;">
            <img src="${img}" class="card-img-top img" alt="Pokemon picture">
            <div class="card-body">
                <h5 class="card-title">${nameBig}</h5>
            </div>
            <ul class="list-group list-group-flush">
                <li id="stats${i}" class="list-group-item">Type: ${capitalizeFirstLetter(pokemon['types'][0]['type']['name'])}</li>
                <li class="list-group-item">Height: ${divided10(pokemon['height'])} m</li>
                <li class="list-group-item">Weight: ${divided10(pokemon['weight'])} kg</li>
                <li class="list-group-item">
                <div class="name">${capitalizeFirstLetter(pokemon['stats'][0]['stat']['name'])}: </div>
                <div class="progress">
                    <div class="progress-bar" role="progressbar" style="width: ${pokemon['stats'][0]['base_stat']}%;" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">${pokemon['stats'][0]['base_stat']}</div>
                </div>
                </li>
                <li class="list-group-item">
                <div class="name">${capitalizeFirstLetter(pokemon['stats'][1]['stat']['name'])}: </div>
                <div class="progress">
                    <div class="progress-bar" role="progressbar" style="width: ${pokemon['stats'][1]['base_stat']}%;" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">${pokemon['stats'][1]['base_stat']}</div>
                </div>
                </li>
                <li class="list-group-item">
                <div class="name">${capitalizeFirstLetter(pokemon['stats'][2]['stat']['name'])}: </div>
                <div class="progress">
                    <div class="progress-bar" role="progressbar" style="width: ${pokemon['stats'][2]['base_stat']}%;" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">${pokemon['stats'][2]['base_stat']}</div>
                </div>
                </li>
                <li class="list-group-item">
                <div class="name">${capitalizeFirstLetter(pokemon['stats'][3]['stat']['name'])}: </div>
                <div class="progress">
                    <div class="progress-bar" role="progressbar" style="width: ${pokemon['stats'][3]['base_stat']}%;" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">${pokemon['stats'][3]['base_stat']}</div>
                </div>
                </li>
                <li class="list-group-item">
                <div class="name">${capitalizeFirstLetter(pokemon['stats'][4]['stat']['name'])}: </div>
                <div class="progress">
                    <div class="progress-bar" role="progressbar" style="width: ${pokemon['stats'][4]['base_stat']}%;" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">${pokemon['stats'][4]['base_stat']}</div>
                </div>
                </li>
                <li class="list-group-item">
                <div class="name">${capitalizeFirstLetter(pokemon['stats'][5]['stat']['name'])}: </div>
                <div class="progress">
                    <div class="progress-bar" role="progressbar" style="width: ${pokemon['stats'][5]['base_stat']}%;" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">${pokemon['stats'][5]['base_stat']}</div>
                </div>
                </li>
            </ul>
        </div>`;
    if (pokemon['types'][1]) { // Wenn es ein zweiten Type gibt schreibe ihn auch dazu
        document.getElementById(`stats${i}`).innerHTML += `, ${capitalizeFirstLetter(pokemon['types'][1]['type']['name'])}`;
    }
}

function next100() {
    let card = document.getElementById('cardContainer');
    card.innerHTML = '';

    pokemonNameAndUrlList = [];
    loadedPokemon = [];

    if (pokemonLimitStart === 0) {
        pokemonLimitStart = 10;
    } else {
        pokemonLimitStart = pokemonLimitStart + 10;
    }
    loadAllPokemon();
}

function back100() {
    if (pokemonLimitStart === 0) {} else {
        let card = document.getElementById('cardContainer');
        card.innerHTML = '';

        pokemonNameAndUrlList = [];
        loadedPokemon = [];

        pokemonLimitStart = pokemonLimitStart - 10;

        loadAllPokemon();
    }
}
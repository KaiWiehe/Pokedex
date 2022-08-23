let pokemonLimit = 100;

async function loadAllPokemon() {
    let url = `https://pokeapi.co/api/v2/pokemon?limit=${pokemonLimit}&offset=0` // Setzt die URl von allen Pokemon fest, grade auf 100 limitiert
    let response = await fetch(url); // Lädt die "Datei" als String herunter
    let responseAsJSON = await response.json(); // Wandelt diese in ein JSON um

    for (let i = 0; i < responseAsJSON['results'].length; i++) {
        let pokemonList = responseAsJSON['results'][i]; // Setzt die Variable, damit die schreibweise schöner ist. Ich möchte eh nur die "results" haben, der rest ist egal
        await loadPokemon(pokemonList, i); //Das await ist wichtig damit er er wartet bis die Funktion ganz ausgeführt ist 
    }
}

async function loadPokemon(pokemonList, i) {
    let url = pokemonList['url']; // Legt die neue URL fest, die von dem einzelnen Pokemon
    let response = await fetch(url); // Lädt die Datei herrunter
    let responseAsJSON = await response.json(); // Formatiert sie in eine JSON Datei

    renderPokeDeck(responseAsJSON, i); // Gibt die Daten weiter
}

function renderPokeDeck(responseAsJSON, i) {
    let img = responseAsJSON['sprites']['other']['dream_world']['front_default']; // Dort findet man im JSON das Bild 
    let nameBig = capitalizeFirstLetter(responseAsJSON['name']); // Damit der Name auch großgeschrieben wird
    let card = document.getElementById('cardContainer');

    loadCard(card, responseAsJSON, i, img, nameBig);
    changeColor(responseAsJSON, i);
}

/* #############################################   Hilfsfunktionen   ############################################# */

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
async function search() {
    let url = `https://pokeapi.co/api/v2/pokemon?limit=100&offset=0` /* Setzt die URl von allen Pokemon fest, grade noch auf 100 limitiert */
    let response = await fetch(url); /* Lädt die "Datei" als string herunter */
    let responseAsJSON = await response.json(); /* Wandelt diese in ein JSON um */

    let search = document.getElementById('search').value;
    search = search.toLowerCase(); /* .toLowerCase ist dazu da damit die funktion nicht auf groß und kleinschreibung achtet */

    let cardContainer = document.getElementById('cardContainer');
    cardContainer.innerHTML = ``; /* Löscht alles raus um dann nur die gesuchten anzuzeigen */

    if (search.length > 0) {
        for (let i = 0; i < responseAsJSON['results'].length; i++) {
            let pokemonList = responseAsJSON['results'][i]; /* Setzt die Variable, damit die schreibweise schöner ist. Ich möchte eh nur die "results" haben, der rest ist egal */
            if (pokemonList['name'].toLowerCase().includes(search)) { /* .includes(search) damit vergleicht er die Namen mit dem was ich im Inputfeld eingebe */
                await loadPokemon(pokemonList, i);
            }
        }
    }
    if (search.length === 0) {
        await loadAllPokemon();
    }

    // Funktioniet nicht so wie ich mir das vorgestellt habe
    // Mein plan war es das nur wenn ich eine Taste drücke die nicht "Enter" oder "Backspace" ist, die funktion ausgeführt wird
    // Das problem ist das wenn ich die eingabe lösche alle karten weg sind 
    // erst wenn das inputfeld leer ist wird wieder was angezeigt, sieht ohne schöner aus!
    //
    //    document.querySelector("input").addEventListener("keyup", (evt) => {
    //        if (evt.key === "Enter") {
    //            console.log("Enter!")
    //        } else if (evt.key === "Backspace") {
    //            console.log("Backspace!")
    //        } else {
    //
    //        }
    //    });
}

/** Guckt durch jede Karte und vergibt die passende Farbe je nach Type des Pokemon
 * @example 
 * Wenn der Type des Pokemon "Wasser" ist ändert die funktion die hintergrundfarbe zu Blau
 */
function changeColor(responseAsJSON, i) {
    if (responseAsJSON['types'][0]['type']['name'] === 'water') {
        document.getElementById(`card${i}`).style = "width: 18rem;background: var(--bs-info);"
    }
    if (responseAsJSON['types'][0]['type']['name'] === 'grass') {
        document.getElementById(`card${i}`).style = "width: 18rem;background: var(--bs-green);"
    }
    if (responseAsJSON['types'][0]['type']['name'] === 'fire') {
        document.getElementById(`card${i}`).style = "width: 18rem;background: var(--bs-danger);"
    }
    if (responseAsJSON['types'][0]['type']['name'] === 'bug') {
        document.getElementById(`card${i}`).style = "width: 18rem;background: var(--bs-yellow);"
    }
    if (responseAsJSON['types'][0]['type']['name'] === 'normal') {
        document.getElementById(`card${i}`).style = "width: 18rem;background: var(--bs-secondary);"
    }
    if (responseAsJSON['types'][0]['type']['name'] === 'electric') {
        document.getElementById(`card${i}`).style = "width: 18rem;background: var(--bs-orange);"
    }
    if (responseAsJSON['types'][0]['type']['name'] === 'poison') {
        document.getElementById(`card${i}`).style = "width: 18rem;background: var(--bs-purple);"
    }
    if (responseAsJSON['types'][0]['type']['name'] === 'ground') {
        document.getElementById(`card${i}`).style = "width: 18rem;background: var(--bs-light);"
    }
}

/** Lädt das HTML Gerüst der Karte */
function loadCard(card, responseAsJSON, i, img, nameBig) {
    card.innerHTML += /* html */ `
        <div id="card${i}" class="card ${i}" style="width: 18rem;">
            <img src="${img}" class="card-img-top img" alt="Pokemon picture">
            <div class="card-body">
                <h5 class="card-title">${nameBig}</h5>
            </div>
            <ul class="list-group list-group-flush">
                <li id="stats${i}" class="list-group-item">Type: ${capitalizeFirstLetter(responseAsJSON['types'][0]['type']['name'])}</li>
                <li class="list-group-item">Height: ${divided10(responseAsJSON['height'])} m</li>
                <li class="list-group-item">Weight: ${divided10(responseAsJSON['weight'])} kg</li>
                <li class="list-group-item">
                <div class="name">${capitalizeFirstLetter(responseAsJSON['stats'][0]['stat']['name'])}: </div>
                <div class="progress">
                    <div class="progress-bar" role="progressbar" style="width: ${responseAsJSON['stats'][0]['base_stat']}%;" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">${responseAsJSON['stats'][0]['base_stat']}</div>
                </div>
                </li>
                <li class="list-group-item">
                <div class="name">${capitalizeFirstLetter(responseAsJSON['stats'][1]['stat']['name'])}: </div>
                <div class="progress">
                    <div class="progress-bar" role="progressbar" style="width: ${responseAsJSON['stats'][1]['base_stat']}%;" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">${responseAsJSON['stats'][1]['base_stat']}</div>
                </div>
                </li>
                <li class="list-group-item">
                <div class="name">${capitalizeFirstLetter(responseAsJSON['stats'][2]['stat']['name'])}: </div>
                <div class="progress">
                    <div class="progress-bar" role="progressbar" style="width: ${responseAsJSON['stats'][2]['base_stat']}%;" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">${responseAsJSON['stats'][2]['base_stat']}</div>
                </div>
                </li>
                <li class="list-group-item">
                <div class="name">${capitalizeFirstLetter(responseAsJSON['stats'][3]['stat']['name'])}: </div>
                <div class="progress">
                    <div class="progress-bar" role="progressbar" style="width: ${responseAsJSON['stats'][3]['base_stat']}%;" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">${responseAsJSON['stats'][3]['base_stat']}</div>
                </div>
                </li>
                <li class="list-group-item">
                <div class="name">${capitalizeFirstLetter(responseAsJSON['stats'][4]['stat']['name'])}: </div>
                <div class="progress">
                    <div class="progress-bar" role="progressbar" style="width: ${responseAsJSON['stats'][4]['base_stat']}%;" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">${responseAsJSON['stats'][4]['base_stat']}</div>
                </div>
                </li>
                <li class="list-group-item">
                <div class="name">${capitalizeFirstLetter(responseAsJSON['stats'][5]['stat']['name'])}: </div>
                <div class="progress">
                    <div class="progress-bar" role="progressbar" style="width: ${responseAsJSON['stats'][5]['base_stat']}%;" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">${responseAsJSON['stats'][5]['base_stat']}</div>
                </div>
                </li>
            </ul>
        </div>`;
    if (responseAsJSON['types'][1]) { // Wenn es ein zweiten Type gibt schreibe ihn auch dazu
        document.getElementById(`stats${i}`).innerHTML += `, ${capitalizeFirstLetter(responseAsJSON['types'][1]['type']['name'])}`;
    }
}
/*****************************************************************************
 * Challenge 2: Review the provided code. The provided code includes:
 * -> Statements that import data from games.js
 * -> A function that deletes all child elements from a parent element in the DOM
*/

// import the JSON data about the crowd funded games from the games.js file
import GAMES_DATA from './games.js';

// create a list of objects to store the data about the games using JSON.parse
const GAMES_JSON = JSON.parse(GAMES_DATA)

// remove all child elements from a parent element in the DOM
function deleteChildElements(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

/*****************************************************************************
 * Challenge 3: Add data about each game as a card to the games-container
 * Skills used: DOM manipulation, for loops, template literals, functions
*/

// grab the element with the id games-container
const gamesContainer = document.getElementById("games-container");

// create a function that adds all data from the games array to the page;
function addGamesToPage(games) {
    for (let game of games) {
        let gameElement = document.createElement("div");
        gameElement.classList.add("game-card");
        const newHTMLContent = `<img class="game-img" src="${game.img}" />` + 
                                `<div class="game-name">${game.name}</div>` +
                                `<div class="game-description">${game.description}</div>` +
                                `<div class="game-backers">Backers: ${game.backers}</div>`;
        gameElement.innerHTML = newHTMLContent;
        gamesContainer.appendChild(gameElement);
    }
}

// call the function we just defined using the correct variable
addGamesToPage(GAMES_JSON);
// later, we'll call this function using a different list of games

/*************************************************************************************
 * Challenge 4: Create the summary statistics at the top of the page displaying the
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: arrow functions, reduce, template literals
*/

// grab the contributions card element
const contributionsCard = document.getElementById("num-contributions");

// use reduce() to count the number of total contributions by summing the backers
const totalContribution = GAMES_JSON.reduce( (total, game) => {
    return total + game.backers;
    }, 0);
contributionsCard.innerHTML = `<p>${totalContribution.toLocaleString('en-US')}</p>`;

// grab the amount raised card, then use reduce() to find the total amount raised
const raisedCard = document.getElementById("total-raised");
const totalRaised = GAMES_JSON.reduce( (total, game) => {
    return total + game.pledged;
    }, 0);
raisedCard.innerHTML = `<p>${totalRaised.toLocaleString('en-US')}</p>`;

// grab number of games card and set its inner HTML
const gamesCard = document.getElementById("num-games");
const game_counter = GAMES_JSON.length;
gamesCard.innerHTML = `<p>${game_counter}</p>`;


/*************************************************************************************
 * Challenge 5: Add functions to filter the funded and unfunded games
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: functions, filter
*/

// show only games that do not yet have enough funding
function filterUnfundedOnly() {
    deleteChildElements(gamesContainer);

    // use filter() to get a list of games that have not yet met their goal
    const unfundedGames = GAMES_JSON.filter( (game) => game.pledged < game.goal);

    // use the function we previously created to add the unfunded games to the DOM
    addGamesToPage(unfundedGames);
}

// show only games that are fully funded
function filterFundedOnly() {
    deleteChildElements(gamesContainer);

    // use filter() to get a list of games that have met or exceeded their goal
    const fundedGames = GAMES_JSON.filter( (game) => game.pledged >= game.goal);

    // use the function we previously created to add unfunded games to the DOM
    addGamesToPage(fundedGames);
}

// show all games
function showAllGames() {
    deleteChildElements(gamesContainer);
    // add all games from the JSON data to the DOM
    addGamesToPage(GAMES_JSON);
}

// select each button in the "Our Games" section
const unfundedBtn = document.getElementById("unfunded-btn");
const fundedBtn = document.getElementById("funded-btn");
const allBtn = document.getElementById("all-btn");

// add event listeners with the correct functions to each button
unfundedBtn.addEventListener("click", filterUnfundedOnly);
fundedBtn.addEventListener("click", filterFundedOnly);
allBtn.addEventListener("click", showAllGames)

/*************************************************************************************
 * Challenge 6: Add more information at the top of the page about the company.
 * Skills used: template literals, ternary operator
*/

// grab the description container
const descriptionContainer = document.getElementById("description-container");

// use filter or reduce to count the number of unfunded games
const unfundedGames = GAMES_JSON.filter( (game) => game.pledged < game.goal);

// create a string that explains the number of unfunded games using the ternary operator
const displayStr = `A total of $${totalRaised.toLocaleString('en-US')} has been raised for ${game_counter} games. Currently, ${unfundedGames.length} ${unfundedGames.length > 1 ? "games remain" : "game remains"} unfunded. We need your help to fund these amazing games!`

// create a new DOM element containing the template string and append it to the description container
const callForFunds = document.createElement("p");
callForFunds.id = "intro-statement";
callForFunds.innerHTML = displayStr;
descriptionContainer.appendChild(callForFunds);


/************************************************************************************
 * Challenge 7: Select & display the top 2 games
 * Skills used: spread operator, destructuring, template literals, sort 
 */

const firstGameContainer = document.getElementById("first-game");
const secondGameContainer = document.getElementById("second-game");

const sortedGames =  GAMES_JSON.sort( (item1, item2) => {
    return item2.pledged - item1.pledged;
});

// use destructuring and the spread operator to grab the first and second games
const [fGame, sGame, ...rest] = sortedGames;

// create a new element to hold the name of the top pledge game, then append it to the correct element
const firstFundedGame = document.createElement("div");
firstFundedGame.innerHTML = `<p>${fGame.name}</p>`;
firstGameContainer.appendChild(firstFundedGame);

// do the same for the runner up item
const secondFundedGame = document.createElement("div");
secondFundedGame.innerHTML = `<p>${sGame.name}</p>`;
secondGameContainer.appendChild(secondFundedGame);

/************************************************************************************
 * Challenge 7: Add search functionality and navbar
 */

const searchInput = document.getElementById("search-input");
const resultsList = document.getElementById("search-results");
const searchDisplay = document.getElementById("search-items-container");
const landingDisplay = document.getElementById("landing-page-container");

//Toggle search window
searchInput.addEventListener("click", function() {
    searchDisplay.style.display = "grid";
    landingDisplay.classList.add("hide");
})

searchInput.addEventListener("input", function() {
    const searchTerm = searchInput.value.toLowerCase();
    if (searchTerm.trim() === "") {
        // Clear the results if the search bar is empty
        resultsList.innerHTML = "";
        // return landing page to original state
        searchDisplay.style.display = "none";
        landingDisplay.classList.remove("hide");
    } else {
    searchDisplay.style.display = "grid";
    landingDisplay.classList.add("hide");
    const filteredData = GAMES_JSON.filter(game => {
        return (
            game.name.toLowerCase().includes(searchTerm)
        );
    });
    if (filteredData.length === 0) {
        resultsList.innerHTML = "<p>No results found.</p>";
    } else {
        displayResults(filteredData);
    }
    }
});


// Display search results
// If the search bar is emptied, show nothing
// If the search bar is not empty, show the results
function displayResults(data) {
    resultsList.innerHTML = "";
    data.forEach(game => {
        let gameElement = document.createElement("div");
        gameElement.classList.add("game-card");
        const newHTMLContent = `<img class="game-img" src="${game.img}" />` + 
                                `<div class="game-name">${game.name}</div>` +
                                `<div class="game-description">${game.description}</div>` +
                                `<div class="game-backers">Backers: ${game.backers}</div>`;
        gameElement.innerHTML = newHTMLContent;
        resultsList.appendChild(gameElement);
    });
}


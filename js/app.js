console.log ("Welcome to my Kingdom come");

//computer or another kingdom will play as the upcoming enemy that will attack the kingdom, they will have a power level. (not sure if to have set level or make it random array of numbers)
//user's goal is to have a certain amount of points on military and structure, which when added together will equal to a power level, which by the end of the 7th day will be measured against the computer's kingdom. 
//IF by the end of the 7th day, the kingdom has a lower power level than the computer, the computer wins. ELSE IF the user has a higher power level, they win the game.
//user will be able to CLICK 1 out of 5 BUTTONS to add to statistics and move the game foward.
//with each CLICK of a BUTTON, the time of day will move forward.
//each day will have 3 times of days, morning, afternoon, evening. The game will end after the 7th day's evening CLICK (21 CLICKS?). The results will be RENDERED with a results message/screen/picture revealing the WIN/LOSE SCENARIO.
//the user starts with a set amount of stats (maybe random if I have time).
//the users main resource will be the kingdom's treasury. 
//Each BUTTON CLICK will decrease a point to the treasury. 
//Each time of day that passes, will lower the stat of food, popularity and structure (still trying to figure out the balance, still not 100% on the 5 main stats...). 
//The user must keep a balance of the stats before the enemy arrives. Specifically Military and Structure (does the user know this?). 
//IF FOOD/POPULARITY stat reaches 0, THEN the game will have a premature LOSS Scenario. (the people revolt against the king)

//TREASURY could reach 0, but if power level is high enough, user could still win?
//TAXES will increase the treasury but lower POPULARITY (again balance...)
//with every BUTTON CLICK, render a game message let the user know the current standing (i.e "You have feed your people, they are ${happy}) <- emotions based on point level?

//visual RENDER time of day?
//at the end of the 7th day, render a results message with the WIN/LOSE SCENARIO. Depending on the user's power level vs the computer's power level. 



/*-------------- Constants -------------*/

const timeOfDay = ["morning", "afternoon", "evening"];

/*---------- Variables (state) ---------*/

let currentDay = 1;
let currentTime = 0; // 0 for morning, 1 for afternoon, 2 for evening

let treasury = 100; // this is the starting amount of treasury points
let popularity = 50; // this is the starting amount of popularity points, at the end of the day, popularity will increase or decrease based on the user's actions

let powerLevel = 0; // this is the total power level of the kingdom, which is the sum of military and structure points


let military = 50; // everytime military button is clicked, military will increase by 10 points, but treasury will decrease by 5 points
let structure = 50; // everytime structure button is clicked, structure will increase by 10 points, but treasury will decrease by 5 points
let food = 50; // everytime food button is clicked, food will increase by 10 points, but treasury will decrease by 5 points
let culture = 50; // everytime culture button is clicked, culture will increase by 10 points, but treasury will decrease by 5 points
let taxes; // everytime taxes button is clicked, treasury will increase by 10 points, but popularity will decrease by 5 points



/*----- Cached Element References  -----*/

const dayDisplay = document.getElementById("day-display");
const timeDisplay = document.getElementById("time-display");
const treasuryDisplay = document.getElementById("treasury-display");
const popularityDisplay = document.getElementById("popularity-display");
const militaryDisplay = document.getElementById("military-display");
const structureDisplay = document.getElementById("structure-display");
const foodDisplay = document.getElementById("food-display");
const cultureDisplay = document.getElementById("culture-display");
const resultDisplay = document.getElementById("result-display");



/*-------------- Functions -------------*/
function render() {
    dayDisplay.textContent = `Day: ${currentDay}`;
    timeDisplay.textContent = `Time: ${timeOfDay[currentTime]}`;
    treasuryDisplay.textContent = `Treasury: ${treasury}`;
    popularityDisplay.textContent = `Popularity: ${popularity}`;
    militaryDisplay.textContent = `Military: ${military}`;
    structureDisplay.textContent = `Structure: ${structure}`;
    foodDisplay.textContent = `Food: ${food}`;
    cultureDisplay.textContent = `Culture: ${culture}`;

    if (currentDay > 7) {
        displayResults();
    }
}



/*----------- Event Listeners ----------*/
document.getElementById("startButton").addEventListener("click", function() {
    currentDay = 1;
    currentTime = 0;
    treasury = 100;
    popularity = 50;
    military = 50;
    structure = 50;
    food = 50;
    culture = 50;

    render();
});
// document.getElementById("nextButton").addEventListener("click", nextDay);
// document.getElementById("military-button").addEventListener("click", increaseMilitary);
// document.getElementById("structure-button").addEventListener("click", increaseStructure);
// document.getElementById("food-button").addEventListener("click", increaseFood);
// document.getElementById("culture-button").addEventListener("click", increaseCulture);
// document.getElementById("taxes-button").addEventListener("click", increaseTreasury);
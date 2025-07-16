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



/*---------- Variables (state) ---------*/

let currentDay = 1;
let currentTime = 0; // 0 for morning, 1 for afternoon, 2 for evening

// initalize variables for the kingdom's stats
let treasuryPoints = 100; // this is the starting amount of treasury points
let popularityPoints = 50; // this is the starting amount of popularity points, at the end of the day, popularity will increase or decrease based on the user's actions
let powerLevelpoints = 0; // this is the total power level of the kingdom, which is the sum of military and structure points
let militaryPoints = 50; // everytime military button is clicked, military will increase by 10 points, but treasury will decrease by 5 points
let structurePoints = 50; // everytime structure button is clicked, structure will increase by 10 points, but treasury will decrease by 5 points
let foodPoints = 50; // everytime food button is clicked, food will increase by 10 points, but treasury will decrease by 5 points
let culturePoints = 50; // everytime culture button is clicked, culture will increase by 10 points, but treasury will decrease by 5 points


// let taxesPoints; // everytime taxes button is clicked, treasury will increase by 10 points, but popularity will decrease by 5 points



/*----- Cached Element References  -----*/


/*-------------- Functions -------------*/



/*----------- Event Listeners ----------*/


document.addEventListener('DOMContentLoaded', () => {


  // Time and day variables
  let currentDay = 1;
  const maxDays = 7;
  const timePhases = ['Morning', 'Afternoon', 'Evening'];
  let currentTimeIndex = 0; // 0: Morning, 1: Afternoon, 2: Evening

  // Track actions per time slot
  let actionTakenThisTimeSlot = false; // Only one action allowed per time slot

  // Get references to HTML elements for displaying values
  const treasuryTotalSpan = document.getElementById('treasury-total');
  const popularityTotalSpan = document.getElementById('popularity-total');
  const powerLevelTotalSpan = document.getElementById('power-level-total');
  const militaryTotalSpan = document.getElementById('military-total');
  const structureTotalSpan = document.getElementById('structure-total');
  const foodTotalSpan = document.getElementById('food-total');
  const cultureTotalSpan = document.getElementById('culture-total');

  const currentDaySpan = document.getElementById('current-day');
  const currentTimeOfDaySpan = document.getElementById('current-time-of-day');

  // Get references to action buttons (divs)
  const actionButtons = document.querySelectorAll('.action-button'); // Select all action buttons
  const militaryDiv = document.querySelector('.military-div');
  const structureDiv = document.querySelector('.structure-div');
  const foodDiv = document.querySelector('.food-div');
  const cultureDiv = document.querySelector('.culture-div');
  const taxesDiv = document.querySelector('.taxes-div');

  // Function to update all displayed values
  function updateDisplay() {
    treasuryTotalSpan.textContent = treasuryPoints;
    popularityTotalSpan.textContent = popularityPoints;
    powerLevelTotalSpan.textContent = militaryPoints + structurePoints;
    militaryTotalSpan.textContent = militaryPoints;
    structureTotalSpan.textContent = structurePoints;
    foodTotalSpan.textContent = foodPoints;
    cultureTotalSpan.textContent = culturePoints;

    currentDaySpan.textContent = currentDay;
    currentTimeOfDaySpan.textContent = timePhases[currentTimeIndex];
  }

  // Function to disable all action buttons
  function disableActionButtons() {
    actionButtons.forEach(button => {
      button.style.pointerEvents = 'none'; // Makes the div unclickable
      button.style.opacity = '0.6'; // Visual cue that it's disabled
    });
  }

  // Function to enable all action buttons
  function enableActionButtons() {
    actionButtons.forEach(button => {
      button.style.pointerEvents = 'auto'; // Makes the div clickable again
      button.style.opacity = '1'; // Reset visual cue
    });
  }

  // Function to handle the end of a time slot
  function endCurrentTimeSlot() {
    currentTimeIndex++;
    actionTakenThisTimeSlot = false; // Reset for the new time slot
    enableActionButtons(); // Re-enable buttons for the next time slot

    if (currentTimeIndex >= timePhases.length) {
      // End of day
      currentTimeIndex = 0; // Reset to Morning
      currentDay++;

      // Implement end-of-day effects here
      if (foodPoints < militaryPoints + structurePoints) {
        popularityPoints -= 10;
      } else {
        foodPoints -= (militaryPoints + structurePoints) / 2;
      }

      // Check if game over (7 days passed)
      if (currentDay > maxDays) {
        // Game Over logic
        alert("7 days have passed! The enemy attacks!"); // You can customize this
        resetGame();
        return;
      }
    }
    updateDisplay();
  }

  // Function to reset the game state
  function resetGame() {
    treasuryPoints = 100;
    popularityPoints = 50;
    militaryPoints = 50;
    structurePoints = 50;
    foodPoints = 50;
    culturePoints = 50;
    currentDay = 1;
    currentTimeIndex = 0;
    actionTakenThisTimeSlot = false;
    updateDisplay();
    enableActionButtons(); // Ensure buttons are enabled on reset
  }

  // Initial display update
  updateDisplay();

  // Event listener for Military button
  militaryDiv.addEventListener('click', () => {
    if (!actionTakenThisTimeSlot) {
      if (treasuryPoints >= 5) {
        militaryPoints += 10;
        treasuryPoints -= 5;
        actionTakenThisTimeSlot = true;
        updateDisplay();
        disableActionButtons(); // Disable all buttons after this action
        setTimeout(endCurrentTimeSlot, 1000); // Advance time slot after a short delay
      } else {
        // You could visually indicate lack of treasury without an alert here.
        // E.g., make the button shake, change its border color temporarily, etc.
        // For now, let's just do nothing.
      }
    }
  });

  // Event listener for Structure button
  structureDiv.addEventListener('click', () => {
    if (!actionTakenThisTimeSlot) {
      if (treasuryPoints >= 5) {
        structurePoints += 10;
        treasuryPoints -= 5;
        actionTakenThisTimeSlot = true;
        updateDisplay();
        disableActionButtons();
        setTimeout(endCurrentTimeSlot, 1000);
      }
    }
  });

  // Event listener for Food button
  foodDiv.addEventListener('click', () => {
    if (!actionTakenThisTimeSlot) {
      if (treasuryPoints >= 5) {
        foodPoints += 10;
        treasuryPoints -= 5;
        actionTakenThisTimeSlot = true;
        updateDisplay();
        disableActionButtons();
        setTimeout(endCurrentTimeSlot, 1000);
      }
    }
  });

  // Event listener for Culture button
  cultureDiv.addEventListener('click', () => {
    if (!actionTakenThisTimeSlot) {
      if (treasuryPoints >= 5) {
        culturePoints += 10;
        treasuryPoints -= 5;
        actionTakenThisTimeSlot = true;
        updateDisplay();
        disableActionButtons();
        setTimeout(endCurrentTimeSlot, 1000);
      }
    }
  });

  // Event listener for Taxes button
  taxesDiv.addEventListener('click', () => {
    if (!actionTakenThisTimeSlot) {
      treasuryPoints += 10;
      popularityPoints -= 5;
      actionTakenThisTimeSlot = true;
      updateDisplay();
      disableActionButtons();
      setTimeout(endCurrentTimeSlot, 1000);
    }
  });
});






//show the current total of milatary points with every click


console.log ("Welcome to my Kingdom come");


document.addEventListener('DOMContentLoaded', () => {
  // Game state variables
  let treasuryPoints, popularityPoints, militaryPoints, structurePoints, foodPoints, culturePoints;
  let currentDay, currentTimeIndex, actionTakenThisTimeSlot;

  // Game constants
  const maxDays = 7;
  const timePhases = ['Morning', 'Afternoon', 'Evening'];


  // Cached elements for UI sections
  const startScreen = document.getElementById('start-screen');
  const gameContainer = document.getElementById('game-container');
  const actionsContainer = document.querySelector('.actions-container');

  // Get references to HTML elements for displaying values
  const treasuryTotalSpan = document.getElementById('treasury-total');
  const popularityTotalSpan = document.getElementById('popularity-total');
  const powerLevelTotalSpan = document.getElementById('power-level-total');
  const militaryTotalSpan = document.getElementById('military-total');
  const structureTotalSpan = document.getElementById('structure-total');
  const foodTotalSpan = document.getElementById('food-total');
  const cultureTotalSpan = document.getElementById('culture-total');

  const endOfDayScreen = document.getElementById('end-of-day-screen');
  const endDayNumberSpan = document.getElementById('end-day-number');
  const eodTreasurySpan = document.getElementById('eod-treasury');
  const eodPopularitySpan = document.getElementById('eod-popularity');
  const eodMilitarySpan = document.getElementById('eod-military');
  const eodStructureSpan = document.getElementById('eod-structure');
  const eodFoodSpan = document.getElementById('eod-food');
  const eodCultureSpan = document.getElementById('eod-culture');
  const eodPowerSpan = document.getElementById('eod-power');
  const winProbabilityMessage = document.getElementById('win-probability-message');
  const winProbabilitySpan = document.getElementById('win-probability');
  const gameOverScreen = document.getElementById('game-over-screen');
  const gameOverMessage = document.getElementById('game-over-message');
  const startGameButton = document.getElementById('start-game-button');
  const continueButton = document.getElementById('continue-button');

  const messageBox = document.getElementById('message-box');
  const messageText = document.getElementById('message-text');

  const currentDaySpan = document.getElementById('current-day');
  const currentTimeOfDaySpan = document.getElementById('current-time-of-day');

  // Get references to action buttons (divs)
  const actionButtons = document.querySelectorAll('.action-button'); // Select all action buttons
  const militaryDiv = document.querySelector('.military-div');
  const structureDiv = document.querySelector('.structure-div');
  const foodDiv = document.querySelector('.food-div');
  const cultureDiv = document.querySelector('.culture-div');
  const taxesDiv = document.querySelector('.taxes-div');

  // Function to start the game
  function startGame() {
    // Hide start screen and show game UI
    startScreen.classList.add('hidden');
    gameContainer.classList.remove('invisible');
    actionsContainer.classList.remove('invisible');

    resetGame();
  }

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

  // Function to display a status message
  function showStatusMessage(message, isTemporary = false) {
    messageText.textContent = message;
    messageBox.classList.add('show');

    if (isTemporary) {
      // Hide after a short delay for temporary messages (e.g., errors)
      setTimeout(() => {
        messageBox.classList.remove('show');
      }, 2500); // Message visible for 2.5 seconds
    }
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
    messageBox.classList.remove('show'); // Hide status message
    currentTimeIndex++;
    actionTakenThisTimeSlot = false; // Reset for the new time slot
    enableActionButtons(); // Re-enable buttons for the next time slot

    if (currentTimeIndex >= timePhases.length) {
      // End of day
      currentTimeIndex = 0; // Reset to Morning

      currentDay++;
      endDayNumberSpan.textContent = currentDay;
      eodTreasurySpan.textContent = treasuryPoints;
      eodPopularitySpan.textContent = popularityPoints;
      eodMilitarySpan.textContent = militaryPoints;
      eodStructureSpan.textContent = structurePoints;
      eodFoodSpan.textContent = foodPoints;
      eodCultureSpan.textContent = culturePoints;
      const currentPowerLevel = militaryPoints + structurePoints;
      eodPowerSpan.textContent = currentPowerLevel;

      // Calculate and display win probability (simplified example)
      //  This should be adjusted based on your actual game logic
      let winProbability = 50; // Default probability
      if (currentPowerLevel > 70) {
        winProbability = 75;
      } else if (currentPowerLevel < 40) {
        winProbability = 25;
      }
      winProbabilitySpan.textContent = winProbability;

      // Display win/loss message based on probability
      if (winProbability >= 75) {
        winProbabilityMessage.textContent = "Your kingdom is strong! Your chances of victory are excellent!";
      } else if (winProbability <= 25) {
        winProbabilityMessage.textContent = "Your kingdom is in peril! Prepare for a difficult battle!";
      }
      endOfDayScreen.style.display = 'block';

      // Implement end-of-day effects here
      foodPoints -= 5; // Natural food decrease each day

      // Decrease popularity only if food or culture is low
      if (foodPoints < 20) {
          popularityPoints -= 5;
          showStatusMessage("Food is scarce! Popularity decreases.", true);
      }

      if (culturePoints < 20) {
          popularityPoints -= 5;
          showStatusMessage("Culture is suffering! Popularity decreases.", true);
      }

      if (foodPoints < 20 || popularityPoints < 20) {
        culturePoints -= 5;
        showStatusMessage("Low food or popularity is affecting cultural activities.", true);
      }

      foodPoints = Math.max(0, foodPoints);
      popularityPoints = Math.max(0, popularityPoints);
      // Check if game over (7 days passed)
      if (currentDay > maxDays) {
        // Game Over logic
        currentDay = maxDays; // Prevent day from going past 7 on the display
      }

      // Check for early game over due to zero popularity
      if (popularityPoints <= 0) {
        endGame("Your rule has collapsed. The people have revolted!");
      }
      endOfDayScreen.style.display = popularityPoints <=0 ? 'none' : 'block'
    }
    updateDisplay();
  }

  // Function to handle continuing to the next day from the EOD screen
  function continueToNextDay() {
    endOfDayScreen.style.display = 'none';
    if (currentDay >= maxDays) { // Check if 7 days have passed (game over)
      let playerPower = militaryPoints + structurePoints;
      // Placeholder for enemy power (you should calculate this based on your game logic)
      let enemyPower = 80; 

      // Basic win/loss condition
      if (playerPower >= enemyPower) {
        gameOverMessage.textContent = "Your kingdom stood strong and repelled the enemy forces! Victory is yours!";
      } else {
        gameOverMessage.textContent = "Your kingdom has fallen... The enemy overwhelmed your defenses. But you can always try again!";
      }
      gameOverScreen.style.display = 'block'; // Show the game over screen
    }
  }

  // Function to handle the end of the game
  function endGame(message) {
    gameOverMessage.textContent = message;
    gameOverScreen.style.display = 'block';
    if (popularityPoints <= 0){
    }
  }

  // Event listener for the replay button
  document.getElementById('replay-button').addEventListener('click', () => {
    gameOverScreen.style.display = 'none'; // Hide the game over screen
    resetGame(); // Reset the game state to start a new game
  });

  // Function to reset the game state
  function resetGame() {
    // All initial values are set here
    treasuryPoints = 50;
    popularityPoints = 25;
    militaryPoints = 25;
    structurePoints = 25;
    foodPoints = 25;
    culturePoints = 25;
    currentDay = 1;
    currentTimeIndex = 0;
    actionTakenThisTimeSlot = false;
    updateDisplay();
    enableActionButtons();
    endOfDayScreen.style.display = 'none';
  }
  
  // Set initial UI state (game hidden)
  gameContainer.classList.add('invisible');
  actionsContainer.classList.add('invisible');


  // Event listener for Military button
  militaryDiv.addEventListener('click', () => {
    if (!actionTakenThisTimeSlot) {
      if (treasuryPoints >= 5) {
        militaryPoints += 10;
        treasuryPoints -= 5;
        actionTakenThisTimeSlot = true;
        showStatusMessage('You have bolstered your army. Your military might grows!');
        updateDisplay();
        disableActionButtons(); // Disable all buttons after this action
        setTimeout(endCurrentTimeSlot, 1500); // Advance time slot after a short delay
      } else {
        showStatusMessage('Your treasury is too low to fund the military!', true);
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
        showStatusMessage("New walls have been erected, strengthening your kingdom's defenses.");
        updateDisplay();
        disableActionButtons();
        setTimeout(endCurrentTimeSlot, 1500);
      } else {
        showStatusMessage('You lack the funds for new construction projects.', true);
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
        showStatusMessage('The granaries are filling up. Your people will not go hungry this day.');
        updateDisplay();
        disableActionButtons();
        setTimeout(endCurrentTimeSlot, 1500);
      } else {
        showStatusMessage('Not enough gold to purchase more food.', true);
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
        showStatusMessage('The arts flourish, bringing joy and prestige to your kingdom.');
        updateDisplay();
        disableActionButtons();
        setTimeout(endCurrentTimeSlot, 1500);
      } else {
        showStatusMessage('There are no funds available to support the arts.', true);
      }
    }
  });

  // Event listener for Taxes button
  taxesDiv.addEventListener('click', () => {
    if (!actionTakenThisTimeSlot) {
      treasuryPoints += 10;
      popularityPoints -= 5;
      actionTakenThisTimeSlot = true;
      showStatusMessage("The treasury swells from new taxes, but your people's spirits are dampened.");
      updateDisplay();
      disableActionButtons();
      setTimeout(endCurrentTimeSlot, 1500);
    }
  });

  // Event listener for the "Continue" button on the end-of-day screen
  startGameButton.addEventListener('click', startGame);
  continueButton.addEventListener('click', continueToNextDay);
  
});

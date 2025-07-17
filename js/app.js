console.log("Welcome to my Kingdom come");

// ==============================
// DOMContentLoaded Main Function
// ==============================

document.addEventListener('DOMContentLoaded', () => {

  // ------------------------------
  // Game State & Constants
  // ------------------------------

  let treasuryPoints, popularityPoints, militaryPoints, structurePoints, foodPoints, culturePoints;
  let currentDay, currentTimeIndex, actionTakenThisTimeSlot;
  const maxDays = 7;
  const timePhases = ['Morning', 'Afternoon', 'Evening'];

  // ------------------------------
  // Cached DOM Elements
  // ------------------------------

  const startScreen = document.getElementById('start-screen');
  const gameContainer = document.getElementById('game-container');
  const actionsContainer = document.querySelector('.actions-container');
  const messageBox = document.getElementById('message-box');
  const messageText = document.getElementById('message-text');
  const currentDaySpan = document.getElementById('current-day');
  const currentTimeOfDaySpan = document.getElementById('current-time-of-day');
  const actionButtons = document.querySelectorAll('.action-button');
  const militaryDiv = document.querySelector('.military-div');
  const structureDiv = document.querySelector('.structure-div');
  const foodDiv = document.querySelector('.food-div');
  const cultureDiv = document.querySelector('.culture-div');
  const taxesDiv = document.querySelector('.taxes-div');
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

  // ------------------------------
  // UI Utility Functions
  // ------------------------------

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

  function showStatusMessage(message, isTemporary = false) {
    messageText.textContent = message;
    messageBox.classList.add('show');
    if (isTemporary) {
      setTimeout(() => {
        messageBox.classList.remove('show');
      }, 2500);
    }
  }

  function disableActionButtons() {
    actionButtons.forEach(button => {
      button.style.pointerEvents = 'none';
      button.style.opacity = '0.6';
    });
  }

  function enableActionButtons() {
    actionButtons.forEach(button => {
      button.style.pointerEvents = 'auto';
      button.style.opacity = '1';
    });
  }

  // ------------------------------
  // Game Flow Functions
  // ------------------------------

  function startGame() {
    startScreen.classList.add('hidden');
    gameContainer.classList.remove('invisible');
    actionsContainer.classList.remove('invisible');
    resetGame();
  }

  function resetGame() {
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

  function endGame(message) {
    gameOverMessage.textContent = message;
    gameOverScreen.style.display = 'block';
  }

  function continueToNextDay() {
    endOfDayScreen.style.display = 'none';
    if (currentDay >= maxDays) {
      let playerPower = militaryPoints + structurePoints;
      let enemyPower = 80;
      if (playerPower >= enemyPower) {
        gameOverMessage.textContent = "Your kingdom stood strong and repelled the enemy forces! Victory is yours!";
      } else {
        gameOverMessage.textContent = "Your kingdom has fallen... The enemy overwhelmed your defenses. But you can always try again!";
      }
      gameOverScreen.style.display = 'block';
    }
  }

  // ------------------------------
  // End of Time Slot & Day Logic
  // ------------------------------

  function endCurrentTimeSlot() {
    messageBox.classList.remove('show');
    currentTimeIndex++;
    actionTakenThisTimeSlot = false;
    enableActionButtons();

    if (currentTimeIndex >= timePhases.length) {
      // End of day
      currentTimeIndex = 0;
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

      // Win probability calculation
      let winProbability = 50;
      if (currentPowerLevel > 70) winProbability = 75;
      else if (currentPowerLevel < 40) winProbability = 25;
      winProbabilitySpan.textContent = winProbability;

      // Win/loss message
      if (winProbability >= 75) {
        winProbabilityMessage.textContent = "Your kingdom is strong! Your chances of victory are excellent!";
      } else if (winProbability <= 25) {
        winProbabilityMessage.textContent = "Your kingdom is in peril! Prepare for a difficult battle!";
      }

      endOfDayScreen.style.display = 'block';

      // End-of-day effects
      foodPoints -= 5;
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

      // Game over checks
      if (currentDay > maxDays) {
        currentDay = maxDays;
      }
      if (popularityPoints <= 0) {
        endGame("Your rule has collapsed. The people have revolted!");
      }
      endOfDayScreen.style.display = popularityPoints <= 0 ? 'none' : 'block';
    }
    updateDisplay();
  }

  // ------------------------------
  // Action Button Event Listeners
  // ------------------------------

  militaryDiv.addEventListener('click', () => {
    if (!actionTakenThisTimeSlot) {
      if (treasuryPoints >= 5) {
        militaryPoints += 10;
        treasuryPoints -= 5;
        actionTakenThisTimeSlot = true;
        showStatusMessage('You have bolstered your army. Your military might grows!');
        updateDisplay();
        disableActionButtons();
        setTimeout(endCurrentTimeSlot, 1500);
      } else {
        showStatusMessage('Your treasury is too low to fund the military!', true);
      }
    }
  });

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

  // ------------------------------
  // Main Screen & Game Over Events
  // ------------------------------

  startGameButton.addEventListener('click', startGame);
  continueButton.addEventListener('click', continueToNextDay);
  document.getElementById('replay-button').addEventListener('click', () => {
    gameOverScreen.style.display = 'none';
    resetGame();
  });

  // ------------------------------
  // Initial UI State
  // ------------------------------
  
  gameContainer.classList.add('invisible');
  actionsContainer.classList.add('invisible');
});
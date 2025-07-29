console.log("Welcome to my Kingdom come");

// Left all the additional notes for future refence and guidance.


// ==============================
// DOMContentLoaded Main Function
// ==============================

document.addEventListener('DOMContentLoaded', () => {

  // ------------------------------
  // Game State & Constants
  // ------------------------------

  let treasuryPoints, popularityPoints, militaryPoints, structurePoints, foodPoints, culturePoints;
  let currentDay, currentTimeIndex, actionTakenThisTimeSlot;
  let muteState = 0; // 0 = all on, 1 = music muted, 2 = all muted
  const maxDays = 7;
  const timePhases = ['Morning', 'Afternoon', 'Evening'];

  // ------------------------------
  // Cached DOM Elements
  // ------------------------------

  const header = document.querySelector('header');
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
  const winProbabilityMessage = document.getElementById('win-probability-message');
  const winProbabilitySpan = document.getElementById('win-probability');
  const gameOverScreen = document.getElementById('game-over-screen');
  const gameOverMessage = document.getElementById('game-over-message');
  const startGameButton = document.getElementById('start-game-button');
  const instructionsButton = document.getElementById('instructions-button');
  const instructionsPanel = document.getElementById('instructions-panel');
  const muteButton = document.getElementById('toggle-mute-button');
  const restartButton = document.getElementById('restart-button');
  const continueButton = document.getElementById('continue-button');

  // ------------------------------
  // Cached Audio Elements
  // ------------------------------
  const backgroundMusic = document.getElementById('background-music');
  const militarySound = document.getElementById('military-sound');
  const structureSound = document.getElementById('structure-sound');
  const foodSound = document.getElementById('food-sound');
  const cultureSound = document.getElementById('culture-sound');
  const taxesSound = document.getElementById('taxes-sound');
  const gameOverSound = document.getElementById('defeat-sound');
  const victorySound = document.getElementById('victory-sound');
  const soundEffects = [militarySound, structureSound, foodSound, cultureSound, taxesSound, gameOverSound, victorySound];

  // Set default volumes (0.0 to 1.0)
  backgroundMusic.volume = 0.3;
  militarySound.volume = 0.2;
  structureSound.volume = 0.1;
  foodSound.volume = 0.2;
  cultureSound.volume = 0.1;
  taxesSound.volume = 0.2;
  gameOverSound.volume = 0.3;
  victorySound.volume = 0.3;

  // ------------------------------
  // UI Utility Functions
  // ------------------------------

  function playSound(sound) {
    if (!sound) return;
    sound.currentTime = 0;
    sound.play().catch(e => console.error("Error playing sound:", e));
  }


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

    // Update background based on time of day
    gameContainer.classList.remove('morning', 'afternoon', 'evening');
    const timeOfDayClass = timePhases[currentTimeIndex].toLowerCase();
    gameContainer.classList.add(timeOfDayClass);
  }

  function showStatusMessage(message, isTemporary = false) {
    messageText.textContent = message;
    messageBox.classList.add('show');
    if (isTemporary) {
      setTimeout(() => {
        messageBox.classList.remove('show');
      }, 15000); // increse the timeout to 15 seconds for better visibility
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
    playSound(backgroundMusic);
    header.classList.remove('hidden');
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

  function endGame(message, outcome = 'defeat_battle') {
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;

    gameOverScreen.classList.remove('victory-bg', 'defeat-bg', 'revolt-bg');

    if (outcome === 'victory') {
      playSound(victorySound);
      gameOverScreen.classList.add('victory-bg');
    } else {
      playSound(gameOverSound);
      if (outcome === 'defeat_revolt') {
        gameOverScreen.classList.add('revolt-bg');
      } else { 
        gameOverScreen.classList.add('defeat-bg');
      }
    }

    gameOverMessage.textContent = message;
    gameOverScreen.style.display = 'flex';
  }

  function continueToNextDay() {
    enableActionButtons();
    endOfDayScreen.style.display = 'none';
    if (currentDay > maxDays) {
      const playerPower = militaryPoints + structurePoints;
      const enemyPower = 100; // The power level to beat
      if (playerPower >= enemyPower) {
        endGame("Your kingdom stood strong and repelled the enemy forces! Victory is yours!", 'victory');
      } else {
        endGame("Your kingdom has fallen... The enemy overwhelmed your defenses. But you can always try again!", 'defeat_battle');
      }
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
      endDayNumberSpan.textContent = currentDay; 
      currentTimeIndex = 0;
      currentDay++;
      const currentPowerLevel = militaryPoints + structurePoints;

      // Win probability calculation
      let winProbability = 50;
      if (currentPowerLevel > 100) winProbability = 75;
      else if (currentPowerLevel < 60) winProbability = 25;
      winProbabilitySpan.textContent = winProbability;

      // Win/loss message
      if (winProbability >= 75) {
        winProbabilityMessage.textContent = "Your kingdom is strong! Your chances of victory are excellent!";
      } else if (winProbability <= 25) {
        winProbabilityMessage.textContent = "Your kingdom is in peril! Prepare for a difficult battle!";
      }

      endOfDayScreen.style.display = 'block';
      disableActionButtons();

      // --- End-of-day effects ---
      foodPoints -= 5; // Daily food consumption

      // Check for popularity changes based on food and culture levels
      if (foodPoints >= 30 && culturePoints >= 30) {
        popularityPoints += 5;
        showStatusMessage("Your people are prosperous and content! Popularity increases.", true);
      } else {
        // Check for penalties only if the bonus condition isn't met
        if (foodPoints < 20) {
          popularityPoints -= 5;
          showStatusMessage("Food is scarce! Your people are unhappy.", true);
        }
        if (culturePoints < 20) {
          popularityPoints -= 5;
          showStatusMessage("Culture is suffering! Your people are restless.", true);
        }
      }

      // Culture can decay from general instability
      if (foodPoints < 20 || popularityPoints < 20) {
        culturePoints -= 5;
      }

      // Ensure stats don't go below zero
      foodPoints = Math.max(0, foodPoints);
      popularityPoints = Math.max(0, popularityPoints);
      culturePoints = Math.max(0, culturePoints);

      // Game over checks
      if (popularityPoints <= 0) {
        endGame("Your rule has collapsed. The people have revolted!", 'defeat_revolt');
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
        playSound(militarySound);
        actionTakenThisTimeSlot = true;
        showStatusMessage('You have bolstered your army. Your military might grows!');
        updateDisplay();
        disableActionButtons();
        setTimeout(endCurrentTimeSlot, 3000);
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
        playSound(structureSound);
        actionTakenThisTimeSlot = true;
        showStatusMessage("New walls have been erected, strengthening your kingdom's defenses.");
        updateDisplay();
        disableActionButtons();
        setTimeout(endCurrentTimeSlot, 3000);
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
        playSound(foodSound);
        actionTakenThisTimeSlot = true;
        showStatusMessage('The granaries are filling up. Your people will not go hungry this day.');
        updateDisplay();
        disableActionButtons();
        setTimeout(endCurrentTimeSlot, 3000);
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
        playSound(cultureSound);
        actionTakenThisTimeSlot = true;
        showStatusMessage('The arts flourish, bringing joy and prestige to your kingdom.');
        updateDisplay();
        disableActionButtons();
        setTimeout(endCurrentTimeSlot, 3000);
      } else {
        showStatusMessage('There are no funds available to support the arts.', true);
      }
    }
  });

  taxesDiv.addEventListener('click', () => {
    if (!actionTakenThisTimeSlot) {
      treasuryPoints += 10;
      popularityPoints -= 5;
      playSound(taxesSound);
      actionTakenThisTimeSlot = true;
      showStatusMessage("The treasury swells from new taxes, but your people's spirits are dampened.");
      updateDisplay();
      disableActionButtons();
      setTimeout(endCurrentTimeSlot, 3000);
    }
  });

  // ------------------------------
  // Main Screen & Game Over Events
  // ------------------------------

  startGameButton.addEventListener('click', startGame);
  continueButton.addEventListener('click', continueToNextDay);
  document.getElementById('replay-button').addEventListener('click', () => { // Correctly restart music on replay
    // Stop any end-game music that might be playing
    gameOverSound.pause();
    gameOverSound.currentTime = 0;
    victorySound.pause();
    victorySound.currentTime = 0;

    gameOverScreen.style.display = 'none';
    resetGame();
    playSound(backgroundMusic);
  });

  // ------------------------------
  // Initial UI State
  // ------------------------------
  
  header.classList.add('hidden');
  gameContainer.classList.add('invisible');
  actionsContainer.classList.add('invisible');
  instructionsButton.classList.add('jumping');
  muteButton.textContent = '🔇 Mute Music';

  // ------------------------------
  // Instructions Button Event
  // ------------------------------

  instructionsButton.addEventListener('click', () => {
    instructionsButton.classList.remove('jumping'); // Stop the animation on first click
    instructionsPanel.classList.toggle('hidden');
    // If the panel is now visible, scroll to it smoothly.
    if (!instructionsPanel.classList.contains('hidden')) {
      instructionsPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });


  // ------------------------------
  // Mute Button Event
  // ------------------------------

  muteButton.addEventListener('click', () => {
    muteState = (muteState + 1) % 3; // Cycle through 0, 1, 2

    switch (muteState) {
      case 0: // All sound on
        backgroundMusic.muted = false;
        soundEffects.forEach(sound => sound.muted = false);
        muteButton.textContent = '🔇 Mute Music';
        break;
      case 1: // Music only muted
        backgroundMusic.muted = true;
        soundEffects.forEach(sound => sound.muted = false);
        muteButton.textContent = '🔇 Mute All';
        break;
      case 2: // All sound muted
        backgroundMusic.muted = true;
        soundEffects.forEach(sound => sound.muted = true);
        muteButton.textContent = '🔈 Unmute';
        break;
    }
  });

  // --------------------------
  // Restart Button Event
  // --------------------------

  restartButton.addEventListener('click', () => {
    // Stop any music that might be playing
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;
    gameOverSound.pause();
    gameOverSound.currentTime = 0;
    victorySound.pause();
    victorySound.currentTime = 0;

    // Hide all game elements and overlays to return to the main menu
    header.classList.add('hidden');
    gameContainer.classList.add('invisible');
    actionsContainer.classList.add('invisible');
    endOfDayScreen.style.display = 'none';
    gameOverScreen.style.display = 'none';
    instructionsPanel.classList.add('hidden');

    // Show the start screen again
    startScreen.classList.remove('hidden');
    instructionsButton.classList.add('jumping');
  });

});
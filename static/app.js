import { DEBUG, GAME_CONFIG } from './config.js';

class Game {
    constructor() {
        this.score = 0;
        this.isRunning = false;
        this.obstacles = [];
        this.gameStartTime = 0;
        this.gameTimer = null;
        this.GAME_DURATION = 120000; // 2 minutes in milliseconds
        this.lockedRoads = new Set(); // Track which roads are currently in use
        this.collectedItems = new Set(); // Track unique collected items
        this.init();
    }

    init() {
        this.startButton = document.getElementById('start-game');
        this.scoreElement = document.getElementById('score');
        this.timeElement = document.getElementById('time');
        this.collectionElement = document.getElementById('collection');
        this.pipes = document.querySelectorAll('.pipe');
        this.roads = document.querySelectorAll('.road');
        
        // Initialize UI with emojis
        this.startButton.textContent = '🎮 Start Game';
        this.updateScore();
        this.timeElement.textContent = '⏱️ 2:00';
        this.updateCollection();
        
        this.startButton.addEventListener('click', () => this.startGame());
        this.pipes.forEach(pipe => {
            pipe.addEventListener('click', (e) => this.handlePipeClick(e));
        });

        // Start collision detection loop
        this.collisionDetectionLoop();
    }

    updateTimer() {
        const timeLeft = Math.max(0, this.GAME_DURATION - (Date.now() - this.gameStartTime));
        const minutes = Math.floor(timeLeft / 60000);
        const seconds = Math.floor((timeLeft % 60000) / 1000);
        this.timeElement.textContent = `⏱️ ${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        if (this.isRunning) {
            requestAnimationFrame(() => this.updateTimer());
        }
    }

    updateCollection() {
        if (!this.collectionElement) return;
        
        const adventureNames = {
            // Places & Landmarks
            '🗺️': 'Treasure Map', '🧭': 'Compass', '⛺': 'Camp Site', '🏰': 'Castle',
            '🗿': 'Ancient Monument', '🎪': 'Circus', '🎡': 'Fair', '🎢': 'Adventure Park',
            '🏛️': 'Ancient Ruins', '⛩️': 'Sacred Shrine', '🕌': 'Grand Mosque', '⛪': 'Old Church',
            '🏯': 'Palace', '🏭': 'Steam Factory',
            
            // Nature & Weather
            '🌋': 'Volcano', '🏔️': 'Mountain Peak', '🏝️': 'Desert Island', '🌅': 'Sunset Beach',
            '🌠': 'Stargazing', '🌄': 'Mountain Sunrise', '🏞️': 'National Park', '🌈': 'Rainbow Valley',
            '🌊': 'Ocean Waves', '❄️': 'Snow Peak', '🌺': 'Flower Garden', '🌴': 'Palm Beach',
            '🍄': 'Mystic Forest', '🌵': 'Desert Trail',
            
            // Transport & Movement
            '🚂': 'Steam Train', '🚤': 'Speed Boat', '✈️': 'Sky Journey', '🎈': 'Balloon Ride',
            '🛸': 'Space Travel', '🚁': 'Helicopter Tour', '⛵': 'Sailing Trip',
            
            // Wildlife
            '🦁': 'Lion Safari', '🐘': 'Elephant Trek', '🦒': 'Giraffe Watch', '🦜': 'Exotic Birds',
            '🐠': 'Ocean Diving', '🦋': 'Butterfly Garden', '🐪': 'Desert Caravan'
        };

        const totalAdventures = Object.keys(adventureNames).length;
        const collectedCount = this.collectedItems.size;
        
        if (collectedCount === totalAdventures) {
            // All adventures collected!
            this.collectionElement.textContent = '🎉 Congratulations! You\'ve collected all adventures! You\'re a true explorer! 🌟';
            this.collectionElement.style.fontSize = '20px';
            this.collectionElement.style.color = '#F39C12'; // Using the highlight-orange color
        } else if (collectedCount === 0) {
            this.collectionElement.textContent = 'No adventures yet! 🎒';
            this.collectionElement.style.fontSize = '16px';
            this.collectionElement.style.color = ''; // Reset color
        } else {
            // Show progress in two lines
            this.collectionElement.innerHTML = 
                `🎒 ${collectedCount} different adventures collected! 🗺️<br>` +
                `🔍 ${totalAdventures - collectedCount} more to discover! ✨`;
            this.collectionElement.style.fontSize = '16px';
            this.collectionElement.style.color = ''; // Reset color
        }
    }

    startGame() {
        if (this.isRunning) {
            this.endGame();
            return;
        }
        
        this.isRunning = true;
        this.score = 0;
        this.collectedItems.clear(); // Reset collection
        this.gameStartTime = Date.now();
        this.updateScore();
        this.updateCollection();
        this.startButton.textContent = '🔄 Reset Game';
        this.timeElement.textContent = '⏱️ 2:00';
        
        // Start spawning obstacles
        this.spawnObstacles();

        // Start game timer
        this.gameTimer = setTimeout(() => {
            this.endGame(true);
        }, this.GAME_DURATION);

        // Start timer updates
        this.updateTimer();
    }

    endGame(timeUp = false) {
        this.isRunning = false;
        // Don't clear collection on game end to show final collection
        this.score = 0;
        this.updateScore();
        this.lockedRoads.clear(); // Clear all road locks
        
        if (timeUp) {
            this.startButton.textContent = '🏁 Game Over! Play Again?';
        } else {
            this.startButton.textContent = '🎮 Start Game';
        }
        
        // Clear timer if it exists
        if (this.gameTimer) {
            clearTimeout(this.gameTimer);
            this.gameTimer = null;
        }
        
        // Reset squares to top position
        document.querySelectorAll('.square').forEach(square => {
            square.className = 'square top';
            square.dataset.position = 'top';
        });
        
        // Clear obstacles
        document.querySelectorAll('.obstacle').forEach(o => o.remove());
    }

    handlePipeClick(event) {
        if (!this.isRunning) return;
        
        const pipe = event.currentTarget;
        const square = pipe.querySelector('.square');
        
        if (!square) return;
        
        // Toggle square position
        const isTop = square.dataset.position === 'top';
        square.className = `square ${isTop ? 'bottom' : 'top'}`;
        square.dataset.position = isTop ? 'bottom' : 'top';
        
        if (DEBUG) console.log(`Pipe ${pipe.dataset.pipe} square moved to ${square.dataset.position}`);
    }

    checkCollision(square, obstacle) {
        const squareRect = square.getBoundingClientRect();
        const obstacleRect = obstacle.getBoundingClientRect();
        const roadRect = obstacle.parentElement.getBoundingClientRect();
        
        // Only check collisions near the ends
        const isNearEnds = 
            obstacleRect.right <= roadRect.left + 70 ||  // Left end
            obstacleRect.left >= roadRect.right - 70;    // Right end
            
        if (!isNearEnds) return false;
        
        const hasCollision = !(squareRect.right < obstacleRect.left || 
                squareRect.left > obstacleRect.right || 
                squareRect.bottom < obstacleRect.top || 
                squareRect.top > obstacleRect.bottom);
                
        if (hasCollision) {
            // Add to collection when collected
            this.collectedItems.add(obstacle.textContent);
            this.updateCollection();
        }
        
        return hasCollision;
    }

    collisionDetectionLoop() {
        if (this.isRunning) {
            const squares = document.querySelectorAll('.square');
            const obstacles = document.querySelectorAll('.obstacle');
            
            squares.forEach(square => {
                obstacles.forEach(obstacle => {
                    if (this.checkCollision(square, obstacle)) {
                        // Handle collision
                        square.classList.add('collision');
                        obstacle.classList.add('collision');
                        this.updateScore(1);
                        
                        // Remove collision class after animation
                        setTimeout(() => {
                            square.classList.remove('collision');
                            obstacle.classList.remove('collision');
                        }, 300);
                    }
                });
            });
        }
        
        // Continue the loop
        requestAnimationFrame(() => this.collisionDetectionLoop());
    }

    getDifficultySettings() {
        const elapsedTime = Date.now() - this.gameStartTime;
        const progress = Math.min(1, elapsedTime / GAME_CONFIG.difficultyRampUpTime);
        
        // Interpolate between initial and final values
        return {
            minSpeed: this.lerp(GAME_CONFIG.initial.minSpeed, GAME_CONFIG.final.minSpeed, progress),
            maxSpeed: this.lerp(GAME_CONFIG.initial.maxSpeed, GAME_CONFIG.final.maxSpeed, progress),
            minSpawnRate: this.lerp(GAME_CONFIG.initial.minSpawnRate, GAME_CONFIG.final.minSpawnRate, progress),
            maxSpawnRate: this.lerp(GAME_CONFIG.initial.maxSpawnRate, GAME_CONFIG.final.maxSpawnRate, progress),
            maxObstacles: Math.round(this.lerp(GAME_CONFIG.initial.maxObstacles, GAME_CONFIG.final.maxObstacles, progress)),
            multiSpawnChance: this.lerp(GAME_CONFIG.initial.multiSpawnChance, GAME_CONFIG.final.multiSpawnChance, progress)
        };
    }

    lerp(start, end, progress) {
        return start + (end - start) * progress;
    }

    spawnObstacles() {
        if (!this.isRunning) return;
        
        const settings = this.getDifficultySettings();
        
        // Count current obstacles
        const currentObstacles = document.querySelectorAll('.obstacle').length;
        if (currentObstacles >= settings.maxObstacles) {
            // Schedule next check if at max
            setTimeout(() => this.spawnObstacles(), 100);
            return;
        }
        
        // Get available (unlocked) roads
        const availableRoads = Array.from(this.roads).filter(road => !this.lockedRoads.has(road));
        
        if (availableRoads.length === 0) {
            // No available roads, try again soon
            setTimeout(() => this.spawnObstacles(), 100);
            return;
        }
        
        // Pick a random available road
        const roadIndex = Math.floor(Math.random() * availableRoads.length);
        const road = availableRoads[roadIndex];
        
        // Lock the road
        this.lockedRoads.add(road);
        
        // Create obstacle (now collectible)
        const obstacle = document.createElement('div');
        obstacle.className = 'obstacle';
        
        // Add random adventure emoji as collectible
        const adventureEmojis = [
            // Places & Landmarks (14)
            '🗺️', '🧭', '⛺', '🏰', '🗿', '🎪', '🎡', '🎢', '🏛️', '⛩️', '🕌', '⛪', '🏯', '🏭',
            
            // Nature & Weather (14)
            '🌋', '🏔️', '🏝️', '🌅', '🌠', '🌄', '🏞️', '🌈', '🌊', '❄️', '🌺', '🌴', '🍄', '🌵',
            
            // Transport & Movement (7)
            '🚂', '🚤', '✈️', '🎈', '🛸', '🚁', '⛵',
            
            // Wildlife (7)
            '🦁', '🐘', '🦒', '🦜', '🐠', '🦋', '🐪'
        ];
        const randomEmoji = adventureEmojis[Math.floor(Math.random() * adventureEmojis.length)];
        obstacle.textContent = randomEmoji;
        
        // Set initial position (left or right side)
        const goingLeft = Math.random() > 0.5;
        
        // Base distance is 330px
        // If spawning on left and moving right:
        //   Start at 324px (6px less on left), end at 336px (6px more on right)
        // If spawning on right and moving left:
        //   Start at -324px (6px less on right), end at -336px (6px more on left)
        const startPos = goingLeft ? 324 : -324;
        const endPos = goingLeft ? -336 : 336;
        
        obstacle.style.transform = `translateX(${startPos}px)`;
        
        road.appendChild(obstacle);
        
        // Random speed between current min and max speeds
        const randomSpeed = settings.minSpeed + 
            Math.random() * (settings.maxSpeed - settings.minSpeed);
        
        // Animate obstacle
        const animation = obstacle.animate([
            { transform: `translateX(${startPos}px)` },
            { transform: `translateX(${endPos}px)` }
        ], {
            duration: randomSpeed * 1000,
            easing: 'linear'
        });
        
        animation.onfinish = () => {
            if (this.isRunning) {
                // Unlock the road when obstacle is removed
                this.lockedRoads.delete(road);
                obstacle.remove();
            }
        };
        
        // Random spawn rate based on current difficulty
        const nextSpawnRate = settings.minSpawnRate + 
            Math.random() * (settings.maxSpawnRate - settings.minSpawnRate);
        
        // Schedule next spawn
        setTimeout(() => {
            if (this.isRunning) {
                this.spawnObstacles();
            }
        }, nextSpawnRate);
    }

    updateScore(increment = 0) {
        this.score += increment;
        this.scoreElement.textContent = `🧭 Adventures: ${this.score}`;
        
        // Add sparkle effect on score increase
        if (increment > 0) {
            const sparkle = document.createElement('span');
            sparkle.textContent = ' ✨';
            sparkle.style.opacity = '1';
            this.scoreElement.appendChild(sparkle);
            
            // Fade out and remove sparkle
            setTimeout(() => {
                sparkle.style.transition = 'opacity 0.5s';
                sparkle.style.opacity = '0';
                setTimeout(() => sparkle.remove(), 500);
            }, 100);
        }
    }
}

// Start the game when the page loads
window.addEventListener('DOMContentLoaded', () => {
    new Game();
}); 

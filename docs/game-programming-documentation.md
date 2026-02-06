# AdventureHopper - Game Programming Documentation

## Overview

AdventureHopper is a web-based collection game inspired by the "2 Cars" concept. Players control six squares positioned on pipes to collect adventure-themed emojis moving across roads. The game features progressive difficulty, a 2-minute timer, and a collection system that tracks unique adventures.

## Architecture

### Technology Stack

- **Backend**: Python with FastAPI framework
- **Frontend**: Vanilla JavaScript with ES6 modules
- **Styling**: CSS3 with CSS variables for theming
- **Animation**: Web Animations API
- **Server**: Uvicorn ASGI server

### Project Structure

```
adventurehopper/
├── main.py              # FastAPI server and API endpoints
├── requirements.txt     # Python dependencies
├── static/             # Frontend assets
│   ├── index.html      # Main game HTML
│   ├── style.css       # Game styling and animations
│   ├── config.js       # Game configuration constants
│   └── app.js          # Main game logic
└── docs/               # Documentation
```

## Backend Implementation

### FastAPI Server (`main.py`)

The backend provides a minimal API serving static files and handling game endpoints:

```python
from fastapi import FastAPI, Request
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
```

#### Key Endpoints

1. **Root Endpoint (`/`)**
   - Serves the main game HTML file
   - Returns `static/index.html`

2. **Start Game (`POST /api/start`)**
   - Initializes a new game session
   - Returns `{"status": "started"}`

3. **Submit Score (`POST /api/score`)**
   - Accepts score data for persistence (TODO: implement storage)
   - Returns `{"status": "saved", "score": score}`

### Static File Serving

Static files are mounted at `/static` using FastAPI's `StaticFiles` middleware, allowing access to CSS, JavaScript, and other assets.

## Frontend Implementation

### Game Architecture (`app.js`)

The game follows an object-oriented pattern with a main `Game` class encapsulating all game logic:

#### Core Properties

```javascript
class Game {
    constructor() {
        this.score = 0;                    // Current score
        this.isRunning = false;            // Game state
        this.obstacles = [];              // Active obstacles
        this.gameStartTime = 0;           // Session start time
        this.gameTimer = null;            // Game timeout reference
        this.GAME_DURATION = 120000;      // 2 minutes in ms
        this.lockedRoads = new Set();     // Road occupancy tracking
        this.collectedItems = new Set();  // Unique collection tracker
    }
}
```

#### Key Methods

1. **Initialization (`init()`)**
   - Binds DOM elements
   - Sets up event listeners
   - Initializes UI state
   - Starts collision detection loop

2. **Game Loop (`startGame()`, `endGame()`)**
   - Manages game state transitions
   - Handles timer initialization
   - Resets game elements
   - Manages obstacle spawning

3. **Obstacle System (`spawnObstacles()`)**
   - Dynamically creates collectible obstacles
   - Implements road locking mechanism
   - Handles difficulty progression
   - Manages obstacle lifecycle

4. **Collision Detection (`collisionDetectionLoop()`)**
   - Uses `requestAnimationFrame` for smooth checking
   - Implements boundary-based collision detection
   - Triggers collection logic on collision
   - Adds visual feedback animations

### Configuration System (`config.js`)

Centralized configuration with progressive difficulty settings:

```javascript
export const GAME_CONFIG = {
    initial: {
        minSpeed: 2,          // Starting speed
        maxSpeed: 2.5,        
        minSpawnRate: 1000,   // Spawn interval (ms)
        maxSpawnRate: 1500,   
        maxObstacles: 6,      // Max simultaneous
        multiSpawnChance: 0.1 
    },
    final: {
        minSpeed: 1.2,        // After ramp-up
        maxSpeed: 3.5,        
        minSpawnRate: 300,    
        maxSpawnRate: 900,    
        maxObstacles: 12,     
        multiSpawnChance: 0.4 
    },
    difficultyRampUpTime: 60000 // 60 seconds
};
```

### Difficulty Progression

The game implements linear interpolation (lerp) for smooth difficulty transitions:

```javascript
getDifficultySettings() {
    const elapsedTime = Date.now() - this.gameStartTime;
    const progress = Math.min(1, elapsedTime / GAME_CONFIG.difficultyRampUpTime);
    
    return {
        minSpeed: this.lerp(GAME_CONFIG.initial.minSpeed, 
                          GAME_CONFIG.final.minSpeed, progress),
        // ... other settings
    };
}
```

## Game Mechanics

### Collection System

- **42 Unique Adventures**: Categorized into Places & Nature, Transport, and Wildlife
- **Unique Tracking**: Uses a `Set` to track collected items
- **Progress Display**: Shows collected count and remaining discoveries
- **Completion Message**: Special message when all adventures are collected

### Road Management

To prevent obstacle overlap, the game implements a road locking system:

1. **Road Locking**: When spawning, roads are temporarily locked
2. **Availability Check**: Only unlocked roads can receive new obstacles
3. **Automatic Unlocking**: Roads unlock when obstacles complete their journey

### Collision Detection

Collisions are only checked near road endpoints for performance:

```javascript
const isNearEnds = 
    obstacleRect.right <= roadRect.left + 70 ||  // Left end
    obstacleRect.left >= roadRect.right - 70;    // Right end
```

This optimization reduces unnecessary calculations during obstacle transit.

## Visual Design

### CSS Architecture (`style.css`)

#### CSS Variables

```css
:root {
    --primary-blue: #4A90E2;
    --highlight-orange: #F39C12;
    --soft-cream: #FFF9E5;
    --dark-gray: #34495E;
    --success-green: #2ECC71;
    --error-red: #E74C3C;
    --light-gray: #ECF0F1;
}
```

#### Layout System

- **CSS Grid**: Main game area uses 3-column grid (buttons | roads | buttons)
- **Flexbox**: Button columns and road containers use flexbox
- **Absolute Positioning**: Obstacles positioned absolutely within roads

#### Animations

1. **Square Movement**: CSS transitions for smooth position changes
2. **Obstacle Motion**: Web Animations API for linear movement
3. **Collision Feedback**: Temporary class addition with CSS animations
4. **Score Effects**: JavaScript-controlled sparkle animations

## Performance Optimizations

### Animation Frame Usage

- `requestAnimationFrame` for collision detection
- Efficient DOM queries with cached element references
- Optimized collision checking with boundary detection

### Memory Management

- Automatic obstacle cleanup on animation completion
- Road locking prevents excessive obstacle generation
- Set-based collection tracking for O(1) lookups

## Development Features

### Debug Mode

Toggleable debug flag in `config.js`:
```javascript
export const DEBUG = true;
```

Enables console logging for:
- Pipe interactions
- Obstacle spawning
- Collision events

## Future Enhancements

### Backend TODOs

1. **Score Persistence**: Implement database storage for high scores
2. **User Sessions**: Add player identification and statistics
3. **Achievement System**: Track milestones and special collections

### Frontend TODOs

1. **Sound Effects**: Add audio feedback for collisions and collections
2. **Particle Effects**: Enhanced visual feedback for collections
3. **Mobile Support**: Touch event handling for mobile devices
4. **Pause Functionality**: Ability to pause and resume games

## Deployment

### Local Development

```bash
# Install dependencies
pip install -r requirements.txt

# Run development server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Production Considerations

- Use a production ASGI server
- Implement proper logging
- Add rate limiting for API endpoints
- Configure CORS for production domains

## Conclusion

AdventureHopper demonstrates modern web game development with clean architecture, efficient animations, and engaging gameplay mechanics. The modular design allows for easy extension and maintenance while providing a smooth player experience through optimized rendering and responsive controls.

export const DEBUG = true;
export const GAME_CONFIG = {
    // Initial (easier) settings
    initial: {
        minSpeed: 2,          // Slower at start
        maxSpeed: 2.5,        // More consistent speed
        minSpawnRate: 1000,   // Slower spawns
        maxSpawnRate: 1500,   // More time between spawns
        maxObstacles: 6,      // Fewer obstacles
        multiSpawnChance: 0.1 // Rare multi-spawns
    },
    // Final (challenging) settings after 60 seconds
    final: {
        minSpeed: 1.2,        // Faster minimum speed
        maxSpeed: 3.5,        // More speed variation
        minSpawnRate: 300,    // Faster spawns
        maxSpawnRate: 900,    // Quicker timing
        maxObstacles: 12,     // More simultaneous obstacles
        multiSpawnChance: 0.4 // More frequent multi-spawns
    },
    difficultyRampUpTime: 60000 // Time in ms to reach final difficulty (60 seconds)
}; 


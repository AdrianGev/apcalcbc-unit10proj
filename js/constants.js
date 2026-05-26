const GAME_CONFIG = {
    MAP_HEIGHT_PERCENT: 0.65,
    BOTTOM_PANEL_PERCENT: 0.35,
    BASE_HP: 20,
    STARTING_COINS: 100,
    TOWER_SELL_PERCENT: 0.6,
    TIME_FREEZE_COST: 50,
    TIME_FREEZE_DURATION: 8000,
    MAX_TIME_FREEZES: 3,
    GAME_SPEED_NORMAL: 1,
    GAME_SPEED_FAST: 2
};

const TOWER_DATA = {
    an_tower: {
        name: "aₙ Tower",
        tier: 1,
        cost: 50,
        range: 120,
        fireRate: 600,
        damage: 5,
        description: "Fires sequential term shots with increasing damage",
        topic: "sequences",
        unlockWave: 1,
        upgrades: [
            { cost: 75, description: "Increases fire rate by 30%", topic: "sequences" },
            { cost: 100, description: "Adds secondary shot in opposite direction", topic: "sequences" }
        ]
    },
    limit_tower: {
        name: "Limit Tower",
        tier: 1,
        cost: 120,
        range: 150,
        fireRate: 1500,
        damage: 15,
        description: "Evaluates limits and fires bursts based on limit values",
        topic: "sequences",
        unlockWave: 1,
        upgrades: [
            { cost: 150, description: "Reduces cooldown by 25%", topic: "sequences" },
            { cost: 200, description: "Adds L'Hôpital mode for double damage", topic: "sequences" }
        ]
    },
    geometric_tower: {
        name: "Geometric Tower",
        tier: 2,
        cost: 180,
        range: 140,
        fireRate: 800,
        damage: 12,
        description: "Fires bursts with geometric decay",
        topic: "geometric",
        unlockWave: 3,
        upgrades: [
            { cost: 200, description: "Auto-selects optimal r per enemy", topic: "geometric" },
            { cost: 280, description: "Fires two burst sequences simultaneously", topic: "geometric" }
        ]
    },
    pseries_cannon: {
        name: "p-Series Cannon",
        tier: 2,
        cost: 150,
        range: 160,
        fireRate: 1000,
        damage: 10,
        description: "Area damage based on 1/nᵖ",
        topic: "pseries",
        unlockWave: 3,
        p: 1,
        upgrades: [
            { cost: 175, description: "Increases p by 0.5", topic: "pseries" },
            { cost: 250, description: "Increases p by 1.0 and adds slow", topic: "pseries" }
        ]
    },
    ratio_turret: {
        name: "Ratio Turret",
        tier: 3,
        cost: 280,
        range: 170,
        fireRate: 700,
        damage: 25,
        description: "Devastating against factorial and exponential enemies",
        topic: "ratio",
        unlockWave: 6,
        upgrades: [
            { cost: 300, description: "Extends range by 35%", topic: "ratio" },
            { cost: 400, description: "Critical burst when ratio exceeds 2", topic: "ratio" }
        ]
    },
    comparison_bunker: {
        name: "Comparison Bunker",
        tier: 3,
        cost: 250,
        range: 200,
        fireRate: 0,
        damage: 0,
        description: "Slows bounded enemies by 40%",
        topic: "comparison",
        unlockWave: 6,
        upgrades: [
            { cost: 275, description: "Increases slow to 60%", topic: "comparison" },
            { cost: 375, description: "Deals continuous damage to slowed enemies", topic: "comparison" }
        ]
    },
    radius_cannon: {
        name: "Radius Cannon",
        tier: 4,
        cost: 400,
        range: 200,
        fireRate: 800,
        damage: 30,
        description: "Full damage within radius of convergence",
        topic: "power",
        unlockWave: 10,
        upgrades: [
            { cost: 425, description: "Extends radius by 20%", topic: "power" },
            { cost: 550, description: "Extends radius by 30% and adds armor-piercing", topic: "power" }
        ]
    },
    taylor_approximator: {
        name: "Taylor Approximator",
        tier: 5,
        cost: 500,
        range: 160,
        fireRate: 600,
        damage: 20,
        description: "Increases accuracy with each degree upgrade",
        topic: "taylor",
        unlockWave: 14,
        degree: 1,
        upgrades: [
            { cost: 200, description: "Increases degree from 1 to 4", topic: "taylor" },
            { cost: 350, description: "Increases degree from 4 to 8", topic: "taylor" },
            { cost: 500, description: "Increases degree from 8 to 10", topic: "taylor" }
        ]
    },
    maclaurin_beam: {
        name: "Maclaurin Beam",
        tier: 5,
        cost: 550,
        range: 190,
        fireRate: 500,
        damage: 35,
        description: "Strongest at path midpoint, recognizes enemy types",
        topic: "maclaurin",
        unlockWave: 14,
        upgrades: [
            { cost: 575, description: "Increases beam damage by 40%", topic: "maclaurin" },
            { cost: 700, description: "Adds centered area pulse every 10s", topic: "maclaurin" }
        ]
    },
    lagrange_barrier: {
        name: "Lagrange Barrier",
        tier: 5,
        cost: 480,
        range: 0,
        fireRate: 0,
        damage: 0,
        description: "Error bound wall blocking path",
        topic: "lagrange",
        unlockWave: 14,
        wallHP: 500,
        upgrades: [
            { cost: 500, description: "Wall regenerates 5% HP per second", topic: "lagrange" },
            { cost: 625, description: "Reflects damage back at enemies", topic: "lagrange" }
        ]
    }
};

const ENEMY_DATA = {
    sequence_crawler: {
        name: "Sequence Crawler",
        tier: 1,
        hp: 50,
        speed: 30,
        damage: 1,
        coins: 5,
        color: "#66d9ef",
        unlockWave: 1
    },
    divergent_runner: {
        name: "Divergent Runner",
        tier: 1,
        hp: 80,
        speed: 45,
        damage: 1,
        coins: 8,
        color: "#f92672",
        unlockWave: 1,
        special: "divergent"
    },
    oscillating_bouncer: {
        name: "Oscillating Bouncer",
        tier: 1,
        hp: 60,
        speed: 50,
        damage: 1,
        coins: 7,
        color: "#a6e22e",
        unlockWave: 2,
        special: "oscillating"
    },
    geometric_swarmer: {
        name: "Geometric Swarmer",
        tier: 1,
        hp: 30,
        speed: 60,
        damage: 1,
        coins: 4,
        color: "#fd971f",
        unlockWave: 2,
        special: "geometric"
    },
    pseries_tank: {
        name: "p-Series Tank",
        tier: 2,
        hp: 200,
        speed: 25,
        damage: 2,
        coins: 15,
        color: "#ae81ff",
        unlockWave: 6,
        special: "pseries"
    },
    harmonic_walker: {
        name: "Harmonic Walker",
        tier: 2,
        hp: 120,
        speed: 35,
        damage: 2,
        coins: 12,
        color: "#e6db74",
        unlockWave: 6,
        special: "harmonic"
    },
    alternating_elite: {
        name: "Alternating Elite",
        tier: 2,
        hp: 150,
        speed: 40,
        damage: 2,
        coins: 18,
        color: "#75715e",
        unlockWave: 7,
        special: "alternating"
    },
    ratio_beast: {
        name: "Ratio Beast",
        tier: 2,
        hp: 100,
        speed: 30,
        damage: 2,
        coins: 20,
        color: "#f92672",
        unlockWave: 8,
        special: "ratio"
    },
    comparison_shield: {
        name: "Comparison Shield",
        tier: 2,
        hp: 180,
        speed: 35,
        damage: 2,
        coins: 25,
        color: "#66d9ef",
        unlockWave: 8,
        special: "comparison"
    },
    power_surger: {
        name: "Power Surger",
        tier: 3,
        hp: 300,
        speed: 50,
        damage: 3,
        coins: 30,
        color: "#a6e22e",
        unlockWave: 11,
        special: "power"
    },
    interval_breaker: {
        name: "Interval Breaker",
        tier: 3,
        hp: 250,
        speed: 45,
        damage: 3,
        coins: 35,
        color: "#fd971f",
        unlockWave: 11,
        special: "interval"
    },
    taylor_phantom: {
        name: "Taylor Phantom",
        tier: 3,
        hp: 280,
        speed: 40,
        damage: 3,
        coins: 40,
        color: "#ae81ff",
        unlockWave: 12,
        special: "taylor"
    },
    maclaurin_giant: {
        name: "Maclaurin Giant",
        tier: 3,
        hp: 400,
        speed: 30,
        damage: 3,
        coins: 45,
        color: "#e6db74",
        unlockWave: 13,
        special: "maclaurin"
    },
    error_phantom: {
        name: "Error Phantom",
        tier: 4,
        hp: 350,
        speed: 55,
        damage: 4,
        coins: 50,
        color: "#75715e",
        unlockWave: 16,
        special: "error"
    },
    divergence_cascade: {
        name: "Divergence Cascade",
        tier: 4,
        hp: 300,
        speed: 40,
        damage: 4,
        coins: 55,
        color: "#f92672",
        unlockWave: 17,
        special: "cascade"
    },
    infinite_series_brute: {
        name: "Infinite Series Brute",
        tier: 4,
        hp: 600,
        speed: 20,
        damage: 4,
        coins: 70,
        color: "#66d9ef",
        unlockWave: 18,
        special: "brute"
    },
    radius_ghost: {
        name: "Radius Ghost",
        tier: 4,
        hp: 280,
        speed: 60,
        damage: 4,
        coins: 60,
        color: "#a6e22e",
        unlockWave: 19,
        special: "ghost"
    }
};

const BOSS_DATA = {
    divergent_boss: {
        name: "The Divergent",
        wave: 5,
        hp: 1000,
        speed: 35,
        damage: 5,
        coins: 200,
        color: "#ff0066",
        special: "divergent_boss"
    },
    shapeshifter_boss: {
        name: "The Shapeshifter",
        wave: 10,
        hp: 2000,
        speed: 40,
        damage: 5,
        coins: 350,
        color: "#00ff99",
        special: "shapeshifter_boss"
    },
    accumulator_boss: {
        name: "The Accumulator",
        wave: 15,
        hp: 3000,
        speed: 30,
        damage: 5,
        coins: 500,
        color: "#9966ff",
        special: "accumulator_boss"
    },
    sigma_boss: {
        name: "The Sigma",
        wave: 20,
        hp: 5000,
        speed: 25,
        damage: 5,
        coins: 1000,
        color: "#ffcc00",
        special: "sigma_boss"
    }
};

const TOPIC_DATA = {
    sequences: {
        name: "Sequences",
        coins: 15,
        unlockWave: 1
    },
    geometric: {
        name: "Geometric Series",
        coins: 15,
        unlockWave: 1
    },
    pseries: {
        name: "p-Series and nth Term",
        coins: 20,
        unlockWave: 3
    },
    integral: {
        name: "Integral Test",
        coins: 35,
        unlockWave: 4
    },
    comparison: {
        name: "Comparison Tests",
        coins: 35,
        unlockWave: 5
    },
    ast: {
        name: "Alternating Series Test",
        coins: 30,
        unlockWave: 6
    },
    ratio: {
        name: "Ratio Test",
        coins: 40,
        unlockWave: 7
    },
    power: {
        name: "Power Series and Radius",
        coins: 45,
        unlockWave: 8
    },
    interval: {
        name: "Interval of Convergence",
        coins: 45,
        unlockWave: 10
    },
    taylor: {
        name: "Taylor Polynomials",
        coins: 55,
        unlockWave: 12
    },
    maclaurin: {
        name: "Maclaurin Series",
        coins: 50,
        unlockWave: 12
    },
    lagrange: {
        name: "Lagrange Error Bound",
        coins: 60,
        unlockWave: 14
    }
};
class Game {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        
        this.currentLevel = null;
        this.map = null;
        this.waveManager = new WaveManager();
        this.questionManager = new QuestionManager();
        this.uiManager = new UIManager(this);
        
        this.towers = [];
        this.projectiles = [];
        
        this.coins = GAME_CONFIG.STARTING_COINS;
        this.baseHP = GAME_CONFIG.BASE_HP;
        this.timeFreezes = 0;
        this.freezeActive = false;
        this.freezeEndTime = 0;
        
        this.gameSpeed = GAME_CONFIG.GAME_SPEED_NORMAL;
        this.lastFrameTime = Date.now();
        this.gameRunning = false;
        
        this.placementMode = false;
        this.placementX = 0;
        this.placementY = 0;
        this.gridX = 0;
        this.gridY = 0;
        this.selectedTowerForUpgrade = null;
        this.towerOnCursor = null;
        
        this.setupCanvasEvents();
    }
    
    resizeCanvas() {
        const container = this.canvas.parentElement;
        this.canvas.width = container.clientWidth;
        this.canvas.height = container.clientHeight;
    }
    
    setupCanvasEvents() {
        this.canvas.addEventListener('click', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            if (this.towerOnCursor) {
                const gridSize = 40;
                const snapX = Math.floor(x / gridSize) * gridSize + gridSize / 2;
                const snapY = Math.floor(y / gridSize) * gridSize + gridSize / 2;
                
                if (this.map && this.map.isValidPlacement(snapX, snapY)) {
                    this.placeTower(this.towerOnCursor, snapX, snapY);
                    this.towerOnCursor = null;
                }
                return;
            }
            
            const clickedTower = this.towers.find(tower => {
                const distance = Math.sqrt(
                    Math.pow(tower.x - x, 2) + 
                    Math.pow(tower.y - y, 2)
                );
                return distance <= 15;
            });
            
            if (clickedTower) {
                this.selectedTowerForUpgrade = clickedTower;
                this.uiManager.showUpgradeMenu(clickedTower);
            }
        });
        
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            if (this.map) {
                const gridSize = 40;
                this.gridX = Math.floor(x / gridSize) * gridSize;
                this.gridY = Math.floor(y / gridSize) * gridSize;
                
                this.placementMode = true;
                
                if (this.towerOnCursor) {
                    this.isValidPlacementSpot = this.map.isValidPlacement(this.gridX + gridSize / 2, this.gridY + gridSize / 2);
                } else {
                    this.isValidPlacementSpot = false;
                }
            }
            
            this.placementX = x;
            this.placementY = y;
        });
        
        this.canvas.addEventListener('mouseleave', () => {
            this.placementMode = false;
            this.gridX = undefined;
            this.gridY = undefined;
        });
        
        // right click to cancel tower placement
        this.canvas.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            if (this.towerOnCursor) {
                // refund the tower cost
                const towerData = TOWER_DATA[this.towerOnCursor];
                this.coins += towerData.cost;
                this.uiManager.updateCoins(this.coins);
                this.towerOnCursor = null;
            }
        });
    }
    
    startGame() {
        this.map = new GameMap('level3', this.canvas.width, this.canvas.height);
        
        this.towers = [];
        this.projectiles = [];
        this.waveManager = new WaveManager();
        
        this.timeFreezes = 0;
        this.gameSpeed = GAME_CONFIG.GAME_SPEED_NORMAL;
        
        this.waveManager.currentWave = 1;
        this.questionManager.updateAvailableTopics(1);
        
        this.uiManager.updateCoins(this.coins);
        this.uiManager.updateHP(this.baseHP);
        this.uiManager.updateWave(1);
        
        const firstQuestion = this.questionManager.getNextQuestion();
        this.uiManager.displayQuestion(firstQuestion);
        
        this.gameRunning = true;
        this.lastFrameTime = Date.now();
        this.gameLoop();
    }
    
    restartGame() {
        this.towers = [];
        this.projectiles = [];
        this.waveManager = new WaveManager();
        this.questionManager = new QuestionManager();
        
        this.coins = GAME_CONFIG.STARTING_COINS;
        this.baseHP = GAME_CONFIG.BASE_HP;
        this.tutorialQuestionsAnswered = 0;
        
        document.getElementById('game-over').classList.add('hidden');
        this.uiManager.showTutorial();
    }
    
    startWave() {
        if (this.waveManager.waveInProgress) return;
        
        this.waveManager.waveJustCompleted = false;
        this.waveManager.generateWave(this.waveManager.currentWave, this.map.getPath());
        this.waveManager.startWave(this.map.getPath());
        
        document.getElementById('start-wave-btn').disabled = true;
    }
    
    toggleSpeed() {
        this.gameSpeed = this.gameSpeed === 1 ? 2 : 1;
    }
    
    answerQuestion(choiceIndex) {
        const question = this.questionManager.currentQuestion;
        // map the shuffled index back to the original index
        const originalIndex = this.uiManager.currentShuffleMap[choiceIndex];
        const isCorrect = originalIndex === question.correct;
        
        const result = this.questionManager.answerQuestion(choiceIndex, isCorrect);
        
        if (result.correct) {
            this.coins += result.coins;
            this.uiManager.updateCoins(this.coins);
        }
        
        this.uiManager.showQuestionFeedback(result);
    }
    
    retryQuestion() {
        const question = this.questionManager.retry();
        this.uiManager.displayQuestion(question);
    }
    
    nextQuestion() {
        const question = this.questionManager.getNextQuestion();
        this.uiManager.displayQuestion(question);
    }
    
    skipTopic() {
        const question = this.questionManager.skipTopic();
        this.uiManager.displayQuestion(question);
    }
    
    pinTopic(topicKey) {
        // if clicking the same topic that's already pinned, unpin it
        if (this.questionManager.pinnedTopic === topicKey) {
            this.questionManager.pinnedTopic = null;
        } else {
            // pin the new topic
            this.questionManager.currentTopic = topicKey;
            this.questionManager.pinnedTopic = topicKey;
        }
        
        // update the dashboard to reflect the selection change
        this.uiManager.updateDashboard();
        this.uiManager.updatePinButton();
        
        // load a question from the selected topic and switch to question tab
        const question = this.questionManager.getNextQuestion();
        this.uiManager.displayQuestion(question);
        this.uiManager.switchPanel('question');
    }
    
    buyTowerFromMarket(towerKey) {
        const towerData = TOWER_DATA[towerKey];
        
        if (this.coins < towerData.cost) {
            return;
        }
        
        // deduct coins
        this.coins -= towerData.cost;
        this.uiManager.updateCoins(this.coins);
        
        // put tower on cursor
        this.towerOnCursor = towerKey;
        
        // dtay in market panel and tower icon will follow cursor
    }
    
    placeTower(towerType, x, y) {
        const towerData = TOWER_DATA[towerType];
        
        // don't check coins again already deducted when buying from market
        
        if (!this.map.isValidPlacement(x, y)) {
            return false;
        }
        
        const tooClose = this.towers.some(tower => {
            const distance = Math.sqrt(
                Math.pow(tower.x - x, 2) + 
                Math.pow(tower.y - y, 2)
            );
            return distance < 30;
        });
        
        if (tooClose) {
            return false;
        }
        
        // don't deduct coins again already done in buyTowerFromMarket
        
        const tower = new Tower(towerType, x, y);
        this.towers.push(tower);
        
        return true;
    }
    
    upgradeTower(tower, level) {
        const upgrade = tower.upgrades[level - 1];
        
        if (this.coins < upgrade.cost) {
            return false;
        }
        
        this.coins -= upgrade.cost;
        this.uiManager.updateCoins(this.coins);
        
        tower.upgrade(level);
        
        return true;
    }
    
    sellSelectedTower() {
        if (!this.selectedTowerForUpgrade) return;
        
        const sellValue = this.selectedTowerForUpgrade.getSellValue();
        this.coins += sellValue;
        this.uiManager.updateCoins(this.coins);
        
        this.towers = this.towers.filter(t => t !== this.selectedTowerForUpgrade);
        this.selectedTowerForUpgrade = null;
    }
    
    buyTimeFreeze() {
        if (this.coins < GAME_CONFIG.TIME_FREEZE_COST) return;
        if (this.timeFreezes >= GAME_CONFIG.MAX_TIME_FREEZES) return;
        
        this.coins -= GAME_CONFIG.TIME_FREEZE_COST;
        this.timeFreezes++;
        
        this.uiManager.updateCoins(this.coins);
    }
    
    useTimeFreeze() {
        if (this.timeFreezes === 0) return;
        if (this.freezeActive) return;
        
        this.timeFreezes--;
        this.freezeActive = true;
        this.freezeEndTime = Date.now() + GAME_CONFIG.TIME_FREEZE_DURATION;
    }
    
    gameLoop() {
        if (!this.gameRunning) return;
        
        const currentTime = Date.now();
        const deltaTime = currentTime - this.lastFrameTime;
        this.lastFrameTime = currentTime;
        
        this.update(deltaTime);
        this.render();
        
        requestAnimationFrame(() => this.gameLoop());
    }
    
    update(deltaTime) {
        if (this.freezeActive) {
            if (Date.now() >= this.freezeEndTime) {
                this.freezeActive = false;
            }
        }
        
        this.waveManager.update(deltaTime, this.gameSpeed, this.freezeActive);
        
        const reachedEnemies = this.waveManager.getReachedEnemies();
        reachedEnemies.forEach(enemy => {
            this.baseHP -= enemy.damage;
            this.uiManager.updateHP(this.baseHP);
            
            if (this.baseHP <= 0) {
                this.gameOver();
            }
        });
        
        const deadEnemies = this.waveManager.enemies.filter(e => !e.alive && !e.reachedBase);
        deadEnemies.forEach(enemy => {
            this.coins += enemy.coinReward;
            this.uiManager.updateCoins(this.coins);
        });
        
        this.towers.forEach(tower => {
            tower.update(deltaTime, this.waveManager.enemies, this.projectiles, this.gameSpeed, this.freezeActive);
        });
        
        this.projectiles = this.projectiles.filter(projectile => {
            projectile.update(deltaTime, this.gameSpeed);
            return projectile.alive;
        });
        
        if (this.waveManager.isWaveComplete() && this.waveManager.hasStartedAnyWave) {
            // increment wave when it completes
            if (!this.waveManager.waveJustCompleted) {
                this.waveManager.currentWave++;
                this.uiManager.updateWave(this.waveManager.currentWave);
                this.questionManager.updateAvailableTopics(this.waveManager.currentWave);
                this.waveManager.waveJustCompleted = true;
            }
            document.getElementById('start-wave-btn').disabled = false;
        }
    }
    
    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        if (this.map) {
            this.map.draw(this.ctx);
            
            this.drawGrid();
            
            if (this.placementMode && this.gridX !== undefined) {
                this.drawPlacementPreview();
            }
        }
        
        this.towers.forEach(tower => {
            tower.draw(this.ctx);
        });
        
        if (this.selectedTowerForUpgrade) {
            this.selectedTowerForUpgrade.drawRange(this.ctx);
        }
        
        this.projectiles.forEach(projectile => {
            projectile.draw(this.ctx);
        });
        
        // draw tower on cursor
        if (this.towerOnCursor && this.gridX !== undefined) {
            const towerData = TOWER_DATA[this.towerOnCursor];
            const centerX = this.gridX + 20;
            const centerY = this.gridY + 20;
            
            // draw range circle
            this.ctx.beginPath();
            this.ctx.arc(centerX, centerY, towerData.range, 0, Math.PI * 2);
            this.ctx.fillStyle = this.isValidPlacementSpot ? 'rgba(90, 140, 60, 0.15)' : 'rgba(255, 100, 100, 0.15)';
            this.ctx.fill();
            this.ctx.strokeStyle = this.isValidPlacementSpot ? 'rgba(90, 140, 60, 0.4)' : 'rgba(255, 100, 100, 0.4)';
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
            
            // draw tower icon matching the actual tower appearance
            const colors = {
                1: '#66d9ef',
                2: '#a6e22e',
                3: '#f92672',
                4: '#fd971f',
                5: '#ae81ff'
            };
            const towerColor = colors[towerData.tier] || '#888';
            
            // make it semi-transparent based on placement validity
            const alpha = this.isValidPlacementSpot ? 0.8 : 0.5;
            this.ctx.fillStyle = towerColor.replace(')', `, ${alpha})`).replace('rgb', 'rgba').replace('#', 'rgba(') || towerColor;
            
            if (this.towerOnCursor === 'lagrange_barrier') {
                // draw barrier as rectangle
                const barWidth = 80;
                const barHeight = 40;
                this.ctx.fillRect(centerX - barWidth/2, centerY - barHeight/2, barWidth, barHeight);
                this.ctx.strokeStyle = this.isValidPlacementSpot ? '#4a9eff' : '#ff6b6b';
                this.ctx.lineWidth = 2;
                this.ctx.strokeRect(centerX - barWidth/2, centerY - barHeight/2, barWidth, barHeight);
            } else {
                // draw circular tower
                this.ctx.globalAlpha = alpha;
                this.ctx.fillStyle = towerColor;
                this.ctx.beginPath();
                this.ctx.arc(centerX, centerY, 15, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.strokeStyle = this.isValidPlacementSpot ? '#4a9eff' : '#ff6b6b';
                this.ctx.lineWidth = 2;
                this.ctx.stroke();
                this.ctx.globalAlpha = 1.0;
            }
            
            // draw tower symbol
            const symbols = {
                'an_tower': 'aₙ',
                'limit_tower': 'lim',
                'geometric_tower': 'r',
                'pseries_cannon': 'p',
                'ratio_turret': 'R',
                'comparison_bunker': '≤',
                'radius_cannon': 'R',
                'taylor_approximator': 'Tₙ',
                'maclaurin_beam': 'M',
                'lagrange_barrier': '±ε'
            };
            this.ctx.fillStyle = 'white';
            this.ctx.font = 'bold 10px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(symbols[this.towerOnCursor] || 'T', centerX, centerY + 4);
        }
        
        if (this.waveManager) {
            this.waveManager.draw(this.ctx);
        }
        
        if (this.freezeActive) {
            this.ctx.fillStyle = 'rgba(100, 200, 255, 0.1)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            
            this.ctx.fillStyle = 'rgba(100, 200, 255, 0.8)';
            this.ctx.font = 'bold 24px Arial';
            this.ctx.textAlign = 'center';
            const remaining = Math.ceil((this.freezeEndTime - Date.now()) / 1000);
            this.ctx.fillText(`TIME FREEZE: ${remaining}s`, this.canvas.width / 2, 50);
        }
    }
    
    drawGrid() {
        const gridSize = 40;
        this.ctx.strokeStyle = 'rgba(200, 200, 200, 0.15)';
        this.ctx.lineWidth = 1;
        
        for (let x = 0; x < this.canvas.width; x += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }
        
        for (let y = 0; y < this.canvas.height; y += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }
    }
    
    drawPlacementPreview() {
        const gridSize = 40;
        
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                const x = this.gridX + dx * gridSize;
                const y = this.gridY + dy * gridSize;
                
                if (x >= 0 && x < this.canvas.width && y >= 0 && y < this.canvas.height) {
                    const centerX = x + gridSize / 2;
                    const centerY = y + gridSize / 2;
                    const isValidCell = this.map.isValidPlacement(centerX, centerY);
                    
                    if (isValidCell) {
                        const isCenter = dx === 0 && dy === 0;
                        this.ctx.fillStyle = isCenter ? 'rgba(180, 180, 180, 0.4)' : 'rgba(180, 180, 180, 0.2)';
                        this.ctx.fillRect(x, y, gridSize, gridSize);
                        
                        this.ctx.strokeStyle = 'rgba(150, 150, 150, 0.6)';
                        this.ctx.lineWidth = 2;
                        this.ctx.strokeRect(x, y, gridSize, gridSize);
                    }
                }
            }
        }
    }
    
    levelComplete() {
        this.gameRunning = false;
        
        const accuracy = this.questionManager.getOverallAccuracy();
        const accuracyMultiplier = 0.8 + (accuracy / 100) * 0.7;
        
        const score = {
            baseHP: this.baseHP * 100,
            coins: this.coins,
            accuracyMultiplier: accuracyMultiplier,
            total: Math.floor((this.baseHP * 100 + this.coins) * accuracyMultiplier)
        };
        
        this.uiManager.showVictory(score);
    }
    
    gameOver() {
        this.gameRunning = false;
        this.uiManager.showGameOver();
    }
}
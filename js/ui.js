class UIManager {
    constructor(game) {
        this.game = game;
        this.currentPanel = 'question';
        this.selectedTower = null;
        this.hoveredTower = null;
        
        this.initializeEventListeners();
        
        if (localStorage.getItem('helpViewed') === 'true') {
            const helpBtn = document.getElementById('help-btn');
            if (helpBtn) helpBtn.classList.add('viewed');
        }
    }
    
    renderMixedContent(text, element) {
        element.innerHTML = '';
        const regex = /\\\((.*?)\\\)/g;
        let lastIndex = 0;
        let match;
        
        while ((match = regex.exec(text)) !== null) {
            if (match.index > lastIndex) {
                element.appendChild(document.createTextNode(text.substring(lastIndex, match.index)));
            }
            
            const mathContent = match[1];
            const span = document.createElement('span');
            span.style.display = 'inline';
            span.style.margin = '0 0.15em';
            try {
                katex.render(mathContent, span, {
                    throwOnError: true,
                    displayMode: false
                });
                element.appendChild(span);
            } catch (e) {
                element.appendChild(document.createTextNode(match[0]));
            }
            
            lastIndex = regex.lastIndex;
        }
        
        if (lastIndex < text.length) {
            element.appendChild(document.createTextNode(text.substring(lastIndex)));
        }
    }
    
    initializeEventListeners() {
        document.getElementById('question-tab-btn').addEventListener('click', () => {
            this.switchPanel('question');
        });
        
        document.getElementById('dashboard-tab-btn').addEventListener('click', () => {
            this.switchPanel('dashboard');
        });
        
        document.getElementById('market-tab-btn').addEventListener('click', () => {
            this.switchPanel('market');
        });
        
        document.getElementById('start-wave-btn').addEventListener('click', () => {
            this.game.startWave();
        });
        
        document.getElementById('speed-toggle-btn').addEventListener('click', () => {
            this.game.toggleSpeed();
            this.updateSpeedButton();
        });
        
        
        document.getElementById('full-review-btn').addEventListener('click', () => {
            const fullReviewBtn = document.getElementById('full-review-btn');
            if (fullReviewBtn.classList.contains('active')) {
                fullReviewBtn.classList.remove('active');
                this.game.questionManager.pinnedTopic = null;
            } else {
                fullReviewBtn.classList.add('active');
                this.game.questionManager.startFullReview();
            }
            this.updateDashboard();
        });
        
        document.getElementById('close-tower-menu').addEventListener('click', () => {
            document.getElementById('tower-menu').classList.add('hidden');
            this.selectedTower = null;
        });
        
        document.getElementById('close-upgrade-menu').addEventListener('click', () => {
            document.getElementById('upgrade-menu').classList.add('hidden');
        });
        
        document.getElementById('continue-btn').addEventListener('click', () => {
            this.hideExplanationView();
            if (this.game.nextQuestion) {
                this.game.nextQuestion();
            }
        });
        
        document.getElementById('help-btn').addEventListener('click', () => {
            document.getElementById('help-modal').classList.remove('hidden');
            const helpBtn = document.getElementById('help-btn');
            helpBtn.classList.add('viewed');
            localStorage.setItem('helpViewed', 'true');
        });
        
        document.getElementById('close-help-btn').addEventListener('click', () => {
            document.getElementById('help-modal').classList.add('hidden');
        });
        
        document.getElementById('sell-tower-btn').addEventListener('click', () => {
            this.game.sellSelectedTower();
            document.getElementById('upgrade-menu').classList.add('hidden');
        });
    }
    
    showExplanationView(isCorrect, problem, explanation) {
        document.getElementById('question-prompt').classList.add('hidden');
        document.getElementById('answer-choices').classList.add('hidden');
        document.getElementById('question-feedback').classList.add('hidden');
        
        const explanationView = document.getElementById('explanation-view');
        explanationView.classList.remove('hidden');
        
        const headerEl = document.getElementById('explanation-header');
        headerEl.textContent = isCorrect ? "Yes! Here's one way to do it:" : "Close! Here's one approach:";
        headerEl.style.color = isCorrect ? '#51cf66' : '#ff6b6b';
        
        const problemEl = document.getElementById('explanation-problem-content');
        this.renderMixedContent(problem, problemEl);
        
        const solutionEl = document.getElementById('explanation-solution-content');
        this.renderMixedContent(explanation, solutionEl);
    }
    
    hideExplanationView() {
        document.getElementById('explanation-view').classList.add('hidden');
        document.getElementById('question-prompt').classList.remove('hidden');
        document.getElementById('answer-choices').classList.remove('hidden');
    }
    
    switchPanel(panel) {
        this.currentPanel = panel;

        document.querySelectorAll('#panel-tabs .tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        document.querySelectorAll('.panel-content').forEach(content => {
            content.classList.remove('active');
        });

        const fullReviewBtn = document.getElementById('full-review-btn');

        if (panel === 'question') {
            document.getElementById('question-tab-btn').classList.add('active');
            document.getElementById('question-panel').classList.add('active');
            fullReviewBtn.classList.add('hidden');
        } else if (panel === 'dashboard') {
            document.getElementById('dashboard-tab-btn').classList.add('active');
            document.getElementById('dashboard-panel').classList.add('active');
            fullReviewBtn.classList.remove('hidden');
            this.updateDashboard();
        } else if (panel === 'market') {
            document.getElementById('market-tab-btn').classList.add('active');
            document.getElementById('market-panel').classList.add('active');
            fullReviewBtn.classList.add('hidden');
            this.updateMarket();
        }
    }
    
    updateCoins(coins) {
        document.getElementById('coin-amount').textContent = coins;
    }
    
    updateHP(hp) {
        document.getElementById('hp-amount').textContent = hp;
    }
    
    updateWave(wave) {
        document.getElementById('wave-number').textContent = `Wave ${wave}`;
    }
    
    updateSpeedButton() {
        const btn = document.getElementById('speed-toggle-btn');
        btn.textContent = this.game.gameSpeed === 1 ? '1x' : '2x';
    }
    
    
    displayQuestion(question) {
        if (!question) return;
        
        const topicData = TOPIC_DATA[question.topic];
        document.getElementById('topic-label').textContent = topicData.name;
        document.getElementById('coin-reward').textContent = `· ${topicData.coins} coins`;
        
        const promptEl = document.getElementById('question-prompt');
        this.renderMixedContent(question.prompt, promptEl);
        
        const shuffledChoices = question.choices.map((choice, index) => ({ choice, originalIndex: index }));
        for (let i = shuffledChoices.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledChoices[i], shuffledChoices[j]] = [shuffledChoices[j], shuffledChoices[i]];
        }
        
        this.currentShuffleMap = shuffledChoices.map(item => item.originalIndex);
        
        const answerButtons = document.querySelectorAll('.answer-btn');
        shuffledChoices.forEach((item, index) => {
            const btn = answerButtons[index];
            btn.classList.remove('correct', 'incorrect');
            btn.disabled = false;
            
            this.renderMixedContent(item.choice, btn);
            
            btn.onclick = () => this.game.answerQuestion(index);
        });
        
        document.getElementById('question-feedback').classList.add('hidden');
        document.getElementById('explanation-view').classList.add('hidden');
        document.getElementById('question-prompt').classList.remove('hidden');
        document.getElementById('answer-choices').classList.remove('hidden');
    }
    
    showQuestionFeedback(result) {
        const answerButtons = document.querySelectorAll('.answer-btn');
        const originalCorrectIndex = this.game.questionManager.currentQuestion.correct;
        const shuffledCorrectIndex = this.currentShuffleMap.indexOf(originalCorrectIndex);
        const userAnswerIndex = result.userAnswer;
        
        answerButtons.forEach((btn, index) => {
            btn.disabled = true;
            if (index === shuffledCorrectIndex) {
                btn.classList.add('correct');
            } else if (index === userAnswerIndex && !result.correct) {
                btn.classList.add('incorrect');
            }
        });
        
        setTimeout(() => {
            const continueBtn = document.getElementById('continue-btn');
            continueBtn.onclick = null;
            const currentQuestion = this.game.questionManager.currentQuestion;
            this.showExplanationView(result.correct, currentQuestion.prompt, result.explanation);
        }, 500);
    }
    
    updateDashboard() {
        const stats = this.game.questionManager.getTopicStats();
        const topicGrid = document.getElementById('topic-grid');
        topicGrid.innerHTML = '';
        
        Object.keys(TOPIC_DATA).forEach(topicKey => {
            const topicData = TOPIC_DATA[topicKey];
            const topicStats = stats[topicKey];
            const isLocked = topicData.unlockWave > this.game.waveManager.currentWave;
            
            const card = document.createElement('div');
            card.className = 'topic-card';
            if (isLocked) card.classList.add('locked');
            
            const accuracy = topicStats.attempted > 0 ? 
                ((topicStats.correct / topicStats.attempted) * 100).toFixed(1) : 0;
            
            const isSelected = this.game.questionManager.pinnedTopic === topicKey;
            const buttonText = isSelected ? 'SELECTED' : 'SELECT';
            const buttonClass = isSelected ? 'control-btn active' : 'control-btn';
            
            card.innerHTML = `
                <div class="topic-card-header">
                    <h4>${topicData.name}</h4>
                    ${!isLocked ? `<button class="${buttonClass} topic-select-btn" onclick="game.pinTopic('${topicKey}')">${buttonText}</button>` : ''}
                </div>
                <div class="dashboard-stats-grid">
                    <div class="stat">Coins: <strong>${topicStats.coinsEarned}</strong></div>
                    <div class="stat">Q's: ${topicStats.correct}/${topicStats.attempted}</div>
                    <div class="stat">Acc: ${accuracy}%</div>
                    ${isLocked ? '<div class="stat unlock-msg">Wave ' + topicData.unlockWave + '</div>' : '<div></div>'}
                </div>
            `;
            
            topicGrid.appendChild(card);
        });
        
                
        this.updateTowerCosts();
    }
    
    updateMarket() {
        const marketGrid = document.getElementById('market-grid');
        marketGrid.innerHTML = '';
        
        Object.keys(TOWER_DATA).forEach(towerKey => {
            const towerData = TOWER_DATA[towerKey];
            const isUnlocked = towerData.unlockWave <= this.game.waveManager.currentWave;
            const canAfford = this.game.coins >= towerData.cost;
            
            const card = document.createElement('div');
            card.className = 'market-card';
            if (!isUnlocked) card.classList.add('locked');
            if (!canAfford && isUnlocked) card.classList.add('unaffordable');
            
            card.innerHTML = `
                <h3>${towerData.name}</h3>
                <div class="market-stats-grid">
                    <div class="market-stat">Cost: <strong>${towerData.cost}</strong></div>
                    <div class="market-stat">Dmg: ${towerData.damage}</div>
                    <div class="market-stat">Range: ${towerData.range}px</div>
                    <div class="market-stat">Rate: ${(1000/towerData.fireRate).toFixed(2)}/s</div>
                </div>
                <div class="market-description">${towerData.description}</div>
                ${isUnlocked ? 
                    `<button class="market-buy-btn ${!canAfford ? 'disabled' : ''}" 
                        onclick="game.buyTowerFromMarket('${towerKey}')" 
                        ${!canAfford ? 'disabled' : ''}>
                        ${canAfford ? 'BUY' : 'NOT ENOUGH COINS'}
                    </button>` : 
                    `<div class="market-locked">Unlocks Wave ${towerData.unlockWave}</div>`
                }
            `;
            
            marketGrid.appendChild(card);
        });
    }
    
    updateTowerCosts() {
        const costList = document.getElementById('tower-cost-list');
        costList.innerHTML = '';
        
        Object.keys(TOWER_DATA).forEach(towerKey => {
            const tower = TOWER_DATA[towerKey];
            if (tower.unlockWave <= this.game.waveManager.currentWave) {
                const item = document.createElement('div');
                item.className = 'tower-cost-item';
                item.innerHTML = `
                    <span>${tower.name}</span>
                    <span>🪙 ${tower.cost}</span>
                `;
                costList.appendChild(item);
            }
        });
    }
    
    showTowerMenu(x, y) {
        const menu = document.getElementById('tower-menu');
        const selection = document.getElementById('tower-selection');
        selection.innerHTML = '';
        
        Object.keys(TOWER_DATA).forEach(towerKey => {
            const tower = TOWER_DATA[towerKey];
            const isLocked = tower.unlockWave > this.game.waveManager.currentWave;
            const canAfford = this.game.coins >= tower.cost;
            
            const option = document.createElement('div');
            option.className = 'tower-option';
            if (isLocked || !canAfford) option.classList.add('locked');
            
            option.innerHTML = `
                <h4>${tower.name} - 🪙${tower.cost}</h4>
                <p>${tower.description}</p>
                <p>Range: ${tower.range} | Damage: ${tower.damage} | Tier: ${tower.tier}</p>
            `;
            
            if (!isLocked && canAfford) {
                option.addEventListener('click', () => {
                    this.game.placeTower(towerKey, x, y);
                    menu.classList.add('hidden');
                });
            }
            
            selection.appendChild(option);
        });
        
        menu.classList.remove('hidden');
    }
    
    showUpgradeMenu(tower) {
        const menu = document.getElementById('upgrade-menu');
        const nameEl = document.getElementById('upgrade-tower-name');
        const optionsEl = document.getElementById('upgrade-options');
        
        nameEl.textContent = tower.name;
        optionsEl.innerHTML = '';
        
        tower.upgrades.forEach((upgrade, index) => {
            const level = index + 1;
            const isUpgraded = tower.upgradeLevel >= level;
            const canAfford = this.game.coins >= upgrade.cost;
            
            const option = document.createElement('div');
            option.className = 'upgrade-option';
            if (isUpgraded || !canAfford) option.classList.add('locked');
            
            option.innerHTML = `
                <h4>Upgrade ${level} - 🪙${upgrade.cost}</h4>
                <p>${upgrade.description}</p>
                <p>${isUpgraded ? '✓ Purchased' : canAfford ? 'Click to upgrade' : 'Not enough coins'}</p>
            `;
            
            if (!isUpgraded && canAfford) {
                option.addEventListener('click', () => {
                    this.game.upgradeTower(tower, level);
                    this.showUpgradeMenu(tower);
                });
            }
            
            optionsEl.appendChild(option);
        });
        
        const sellValue = tower.getSellValue();
        document.getElementById('sell-tower-btn').textContent = `Sell (🪙${sellValue})`;
        
        menu.classList.remove('hidden');
    }
    
    showTutorial() {
        this.game.map = new GameMap('level3', this.game.canvas.width, this.game.canvas.height);
        this.game.gameRunning = true;
        this.game.lastFrameTime = Date.now();
        this.game.gameLoop();
        
        const question = this.game.questionManager.getNextQuestion();
        this.displayQuestion(question);
    }
    
    loadTutorialQuestion() {
        const answerButtons = document.querySelectorAll('.answer-btn');
        answerButtons.forEach(btn => {
            btn.classList.remove('correct', 'incorrect');
            btn.disabled = false;
        });
        
        const question = this.game.questionManager.getNextQuestion();
        
        document.getElementById('tutorial-count').textContent = this.game.tutorialQuestionsAnswered;
        
        const promptEl = document.getElementById('question-prompt');
        this.renderMixedContent(question.prompt, promptEl);
        
        question.choices.forEach((choice, index) => {
            const btn = answerButtons[index];
            this.renderMixedContent(choice, btn);
            btn.onclick = () => this.answerTutorialQuestion(index);
        });
        
        document.getElementById('question-feedback').classList.add('hidden');
        document.getElementById('explanation-view').classList.add('hidden');
        document.getElementById('question-prompt').classList.remove('hidden');
        document.getElementById('answer-choices').classList.remove('hidden');
    }
    
    answerTutorialQuestion(choiceIndex) {
        const question = this.game.questionManager.currentQuestion;
        const isCorrect = choiceIndex === question.correct;
        
        const result = this.game.questionManager.answerQuestion(choiceIndex, isCorrect);
        
        const answerButtons = document.querySelectorAll('.answer-btn');
        answerButtons.forEach((btn, index) => {
            btn.disabled = true;
            if (index === question.correct) {
                btn.classList.add('correct');
            } else if (index === choiceIndex && !isCorrect) {
                btn.classList.add('incorrect');
            }
        });
        
        setTimeout(() => {
            this.showExplanationView(isCorrect, question.prompt, result.explanation);
            
            const continueBtn = document.getElementById('continue-btn');
            continueBtn.onclick = () => {
                this.hideExplanationView();
                
                if (isCorrect) {
                    this.game.coins += result.coins;
                    this.game.tutorialQuestionsAnswered++;
                    document.getElementById('tutorial-count').textContent = this.game.tutorialQuestionsAnswered;
                    
                    if (this.game.tutorialQuestionsAnswered >= 5) {
                        document.getElementById('tutorial-mode').classList.add('hidden');
                        document.getElementById('question-header').classList.remove('hidden');
                        
                        this.game.towers = [];
                        this.game.projectiles = [];
                        this.game.waveManager = new WaveManager();
                        this.game.timeFreezes = 0;
                        this.game.gameSpeed = GAME_CONFIG.GAME_SPEED_NORMAL;
                        this.game.waveManager.currentWave = 1;
                        this.game.questionManager.updateAvailableTopics(1);
                        this.updateCoins(this.game.coins);
                        this.updateHP(this.game.baseHP);
                        this.updateWave(1);
                        
                        const nextQuestion = this.game.questionManager.getNextQuestion();
                        this.displayQuestion(nextQuestion);
                    } else {
                        this.loadTutorialQuestion();
                    }
                } else {
                    this.loadTutorialQuestion();
                }
            };
        }, 500);
    }
    
    showVictory(score) {
        const modal = document.getElementById('game-over');
        const stats = document.getElementById('game-over-stats');
        
        stats.innerHTML = `
            <h2 style="color: #51cf66; margin-bottom: 20px;">Victory!</h2>
            <div class="score-item">
                <span>Waves Completed:</span>
                <strong>20/20</strong>
            </div>
            <div class="score-item">
                <span>Base HP Remaining:</span>
                <strong>${this.game.baseHP}</strong>
            </div>
            <div class="score-item">
                <span>Coins Remaining:</span>
                <strong>${this.game.coins}</strong>
            </div>
            <div class="score-item">
                <span>Questions Answered:</span>
                <strong>${this.game.questionManager.questionsAnswered}</strong>
            </div>
            <div class="score-item">
                <span>Overall Accuracy:</span>
                <strong>${this.game.questionManager.getOverallAccuracy().toFixed(1)}%</strong>
            </div>
            <div class="score-item">
                <span>Total Score:</span>
                <strong>${score.total}</strong>
            </div>
        `;
        
        modal.classList.remove('hidden');
        
        document.getElementById('retry-level-btn').textContent = 'Play Again';
        document.getElementById('back-to-menu-btn').classList.add('hidden');
    }
    
    showGameOver() {
        const modal = document.getElementById('game-over');
        const stats = document.getElementById('game-over-stats');
        
        const accuracy = this.game.questionManager.getOverallAccuracy();
        
        stats.innerHTML = `
            <h2 style="color: #ff6b6b; margin-bottom: 20px;">Game Over</h2>
            <div class="score-item">
                <span>Wave Reached:</span>
                <strong>${this.game.waveManager.currentWave}</strong>
            </div>
            <div class="score-item">
                <span>Questions Answered:</span>
                <strong>${this.game.questionManager.questionsAnswered}</strong>
            </div>
            <div class="score-item">
                <span>Overall Accuracy:</span>
                <strong>${accuracy.toFixed(1)}%</strong>
            </div>
            <div class="score-item">
                <span>Coins Earned:</span>
                <strong>${this.game.coins}</strong>
            </div>
        `;
        
        modal.classList.remove('hidden');
        
        document.getElementById('retry-level-btn').textContent = 'Try Again';
        document.getElementById('back-to-menu-btn').classList.add('hidden');
    }
}
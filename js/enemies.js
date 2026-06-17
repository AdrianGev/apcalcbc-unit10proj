class Enemy {
    constructor(type, path, spawnDelay = 0) {
        const data = ENEMY_DATA[type] || BOSS_DATA[type];
        
        this.type = type;
        this.name = data.name;
        this.maxHP = data.hp;
        this.hp = data.hp;
        this.speed = data.speed;
        this.damage = data.damage;
        this.coinReward = data.coins;
        this.color = data.color;
        this.special = data.special;
        
        this.path = path;
        this.pathIndex = 0;
        this.pathProgress = 0;
        this.x = path[0].x;
        this.y = path[0].y;
        this.size = 12;
        
        this.alive = true;
        this.reachedBase = false;
        this.spawnDelay = spawnDelay;
        this.age = 0;
        
        this.effects = {
            slow: 0,
            stun: 0,
            damageOverTime: 0
        };
        
        this.specialData = this.initializeSpecial();
    }
    
    initializeSpecial() {
        switch(this.special) {
            case 'divergent':
                return { hitCount: 0, hpMultiplier: 1 };
            case 'divergent_boss':
                return { startTime: Date.now(), hpIncreaseRate: 0.1 };
            case 'oscillating':
                return { oscillatePhase: 0 };
            case 'geometric':
                return { spawnedCopies: false };
            case 'harmonic':
                return { lastRegenTime: Date.now(), regenAmount: 5 };
            case 'alternating':
                return { shieldPhase: 0, shieldActive: true };
            case 'ratio':
                return { groupIndex: 0 };
            case 'comparison':
                return { requiresBunker: true };
            case 'shapeshifter_boss':
                return { resistancePhase: 0, phaseTimer: Date.now() };
            case 'accumulator_boss':
                return { shieldActive: true, integralDamage: 0, threshold: 500 };
            case 'sigma_boss':
                return { currentBar: 0, bars: [
                    { hp: 1250, maxHP: 1250, weakness: 'tier1' },
                    { hp: 1250, maxHP: 1250, weakness: 'ratio_comparison' },
                    { hp: 1250, maxHP: 1250, weakness: 'integral_ast' },
                    { hp: 1250, maxHP: 1250, weakness: 'taylor_maclaurin' }
                ]};
            default:
                return {};
        }
    }
    
    update(deltaTime, gameSpeed, isFrozen) {
        if (this.spawnDelay > 0) {
            this.spawnDelay -= deltaTime;
            return;
        }
        
        if (!this.alive || isFrozen) return;
        
        this.age += deltaTime;
        
        this.updateSpecialBehavior(deltaTime);
        
        if (this.effects.stun > 0) {
            this.effects.stun -= deltaTime;
            return;
        }
        
        let effectiveSpeed = this.speed * gameSpeed;
        if (this.effects.slow > 0) {
            effectiveSpeed *= 0.5;
            this.effects.slow -= deltaTime;
        }
        
        if (this.effects.damageOverTime > 0) {
            this.takeDamage(this.effects.damageOverTime * deltaTime / 1000);
        }
        
        this.pathProgress += effectiveSpeed * deltaTime / 1000;
        
        if (this.pathIndex < this.path.length - 1) {
            const current = this.path[this.pathIndex];
            const next = this.path[this.pathIndex + 1];
            const distance = Math.sqrt(
                Math.pow(next.x - current.x, 2) + 
                Math.pow(next.y - current.y, 2)
            );
            
            if (this.pathProgress >= distance) {
                this.pathProgress -= distance;
                this.pathIndex++;
                
                if (this.pathIndex >= this.path.length - 1) {
                    this.reachedBase = true;
                    this.alive = false;
                    return;
                }
            }
            
            const t = this.pathProgress / distance;
            this.x = current.x + (next.x - current.x) * t;
            this.y = current.y + (next.y - current.y) * t;
            
            if (this.special === 'oscillating') {
                const oscillation = Math.sin(this.specialData.oscillatePhase) * 15;
                const dx = next.x - current.x;
                const dy = next.y - current.y;
                const perpX = -dy / distance;
                const perpY = dx / distance;
                this.x += perpX * oscillation;
                this.y += perpY * oscillation;
            }
        }
    }
    
    updateSpecialBehavior(deltaTime) {
        switch(this.special) {
            case 'divergent_boss':
                const elapsed = (Date.now() - this.specialData.startTime) / 1000;
                if (elapsed % 5 < deltaTime / 1000) {
                    this.maxHP *= 1.1;
                    this.hp *= 1.1;
                }
                break;
                
            case 'oscillating':
                this.specialData.oscillatePhase += deltaTime / 200;
                break;
                
            case 'harmonic':
                if (Date.now() - this.specialData.lastRegenTime > 3000) {
                    this.hp = Math.min(this.hp + this.specialData.regenAmount, this.maxHP);
                    this.specialData.lastRegenTime = Date.now();
                }
                break;
                
            case 'alternating':
                this.specialData.shieldPhase += deltaTime;
                if (this.specialData.shieldPhase >= 4000) {
                    this.specialData.shieldPhase = 0;
                    this.specialData.shieldActive = !this.specialData.shieldActive;
                }
                break;
                
            case 'shapeshifter_boss':
                if (Date.now() - this.specialData.phaseTimer > 15000) {
                    this.specialData.resistancePhase = (this.specialData.resistancePhase + 1) % 4;
                    this.specialData.phaseTimer = Date.now();
                }
                break;
        }
    }
    
    takeDamage(amount, source = null) {
        if (!this.alive || this.spawnDelay > 0) return 0;
        
        let actualDamage = amount;
        
        if (this.special === 'alternating' && this.specialData.shieldActive) {
            return 0;
        }
        
        if (this.special === 'comparison' && this.specialData.requiresBunker) {
            actualDamage *= 0.1;
        }
        
        if (this.special === 'pseries') {
            actualDamage *= 0.7;
        }
        
        if (this.special === 'error' && !source?.lagrangeActive) {
            actualDamage *= 0.25;
        }
        
        if (this.special === 'brute' && amount < 10) {
            return 0;
        }
        
        if (this.special === 'shapeshifter_boss' && source) {
            const resistances = ['ratio', 'comparison', 'ast', 'integral'];
            if (source.topic === resistances[this.specialData.resistancePhase]) {
                actualDamage *= 0.3;
            }
        }
        
        if (this.special === 'accumulator_boss') {
            if (this.specialData.shieldActive) {
                if (source?.type === 'integral_siege') {
                    this.specialData.integralDamage += actualDamage;
                    if (this.specialData.integralDamage >= this.specialData.threshold) {
                        this.specialData.shieldActive = false;
                    }
                }
                return 0;
            }
        }
        
        if (this.special === 'sigma_boss') {
            const currentBar = this.specialData.bars[this.specialData.currentBar];
            if (!currentBar) {
                this.hp = 0;
                this.alive = false;
                return actualDamage;
            }
            
            let damageMultiplier = 1;
            if (source) {
                switch(currentBar.weakness) {
                    case 'tier1':
                        if (source.tier <= 2) damageMultiplier = 2;
                        break;
                    case 'ratio_comparison':
                        if (source.topic === 'ratio' || source.topic === 'comparison') damageMultiplier = 2;
                        break;
                    case 'integral_ast':
                        if (source.topic === 'integral' || source.topic === 'ast') damageMultiplier = 2;
                        break;
                    case 'taylor_maclaurin':
                        if (source.topic === 'taylor' || source.topic === 'maclaurin') damageMultiplier = 2;
                        break;
                }
            }
            
            actualDamage *= damageMultiplier;
            currentBar.hp -= actualDamage;
            
            if (currentBar.hp <= 0) {
                this.specialData.currentBar++;
                if (this.specialData.currentBar >= this.specialData.bars.length) {
                    this.hp = 0;
                    this.alive = false;
                }
            }
            
            return actualDamage;
        }
        
        if (this.special === 'divergent') {
            this.specialData.hitCount++;
            this.specialData.hpMultiplier = Math.pow(1.08, this.specialData.hitCount);
            actualDamage /= this.specialData.hpMultiplier;
        }
        
        this.hp -= actualDamage;
        
        if (this.hp <= 0) {
            this.hp = 0;
            this.alive = false;
        }
        
        return actualDamage;
    }
    
    applySlow(duration) {
        this.effects.slow = Math.max(this.effects.slow, duration);
    }
    
    applyStun(duration) {
        this.effects.stun = Math.max(this.effects.stun, duration);
    }
    
    applyDamageOverTime(damagePerSecond, duration) {
        this.effects.damageOverTime = damagePerSecond;
        setTimeout(() => {
            this.effects.damageOverTime = 0;
        }, duration);
    }
    
    draw(ctx) {
        if (this.spawnDelay > 0 || !this.alive) return;
        
        if (this.special === 'sigma_boss') {
            const currentBar = this.specialData.bars[this.specialData.currentBar];
            if (currentBar) {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
                ctx.fill();
                
                ctx.fillStyle = 'white';
                ctx.font = 'bold 12px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(`Bar ${this.specialData.currentBar + 1}`, this.x, this.y - 30);
                
                const barWidth = 60;
                const barHeight = 6;
                ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
                ctx.fillRect(this.x - barWidth/2, this.y - 25, barWidth, barHeight);
                ctx.fillStyle = '#ff6b6b';
                const barFill = (currentBar.hp / currentBar.maxHP) * barWidth;
                ctx.fillRect(this.x - barWidth/2, this.y - 25, barFill, barHeight);
            }
        } else {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            
            if (this.special === 'alternating' && this.specialData.shieldActive) {
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size + 4, 0, Math.PI * 2);
                ctx.stroke();
            }
            
            const barWidth = this.size * 2;
            const barHeight = 4;
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.fillRect(this.x - barWidth/2, this.y - this.size - 8, barWidth, barHeight);
            ctx.fillStyle = '#51cf66';
            const hpPercent = this.hp / this.maxHP;
            ctx.fillRect(this.x - barWidth/2, this.y - this.size - 8, barWidth * hpPercent, barHeight);
        }
        
        if (this.effects.stun > 0) {
            ctx.fillStyle = 'yellow';
            ctx.font = 'bold 10px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('⚡', this.x, this.y - this.size - 12);
        }
    }
    
    getHPPercent() {
        if (this.special === 'sigma_boss') {
            const currentBar = this.specialData.bars[this.specialData.currentBar];
            return currentBar ? currentBar.hp / currentBar.maxHP : 0;
        }
        return this.hp / this.maxHP;
    }
}

class WaveManager {
    constructor() {
        this.currentWave = 1;
        this.waveInProgress = false;
        this.enemies = [];
        this.enemySpawnQueue = [];
        this.lastSpawnTime = 0;
        this.hasStartedAnyWave = false;
    }
    
    generateWave(waveNumber, path) {
        this.enemySpawnQueue = [];
        let spawnDelay = 0;
        
        if (waveNumber === 1) {
            for (let i = 0; i < 3; i++) {
                this.enemySpawnQueue.push({ type: 'sequence_crawler', delay: spawnDelay });
                spawnDelay += 2500;
            }
        } else if (waveNumber === 2) {
            for (let i = 0; i < 5; i++) {
                this.enemySpawnQueue.push({ type: 'sequence_crawler', delay: spawnDelay });
                spawnDelay += 2000;
            }
        } else if (waveNumber === 3) {
            for (let i = 0; i < 7; i++) {
                this.enemySpawnQueue.push({ type: 'sequence_crawler', delay: spawnDelay });
                spawnDelay += 1800;
            }
            for (let i = 0; i < 2; i++) {
                this.enemySpawnQueue.push({ type: 'limit_runner', delay: spawnDelay });
                spawnDelay += 2000;
            }
        } else if (waveNumber === 5) {
            this.enemySpawnQueue.push({ type: 'divergent_boss', delay: spawnDelay });
        } else if (waveNumber === 10) {
            this.enemySpawnQueue.push({ type: 'shapeshifter_boss', delay: spawnDelay });
        } else if (waveNumber === 15) {
            this.enemySpawnQueue.push({ type: 'accumulator_boss', delay: spawnDelay });
        } else if (waveNumber === 20) {
            this.enemySpawnQueue.push({ type: 'sigma_boss', delay: spawnDelay });
        } else {
            const baseCount = 8;
            const enemyCount = baseCount + waveNumber * 2;
            const delayIncrement = Math.max(400, 1000 - waveNumber * 20);
            
            for (let i = 0; i < enemyCount; i++) {
                const enemyType = this.selectEnemyType(waveNumber);
                this.enemySpawnQueue.push({ type: enemyType, delay: spawnDelay });
                spawnDelay += delayIncrement;
            }
        }
        
        return this.enemySpawnQueue;
    }
    
    selectEnemyType(wave) {
        const availableEnemies = [];
        
        Object.keys(ENEMY_DATA).forEach(type => {
            const data = ENEMY_DATA[type];
            if (data.unlockWave <= wave) {
                availableEnemies.push(type);
            }
        });
        
        if (availableEnemies.length === 0) {
            return 'sequence_crawler';
        }
        
        return availableEnemies[Math.floor(Math.random() * availableEnemies.length)];
    }
    
    startWave(path) {
        this.waveInProgress = true;
        this.hasStartedAnyWave = true;
        this.lastSpawnTime = Date.now();
        
        this.enemySpawnQueue.forEach(spawn => {
            setTimeout(() => {
                if (this.waveInProgress) {
                    this.enemies.push(new Enemy(spawn.type, path, 0));
                }
            }, spawn.delay);
        });
    }
    
    update(deltaTime, gameSpeed, isFrozen) {
        this.enemies = this.enemies.filter(enemy => {
            enemy.update(deltaTime, gameSpeed, isFrozen);
            return enemy.alive || enemy.reachedBase;
        });
        
        if (this.waveInProgress && this.enemies.length === 0 && this.enemySpawnQueue.length > 0) {
            const allSpawned = this.enemySpawnQueue.every(spawn => 
                Date.now() - this.lastSpawnTime > spawn.delay + 1000
            );
            
            if (allSpawned && this.enemies.every(e => !e.alive)) {
                this.waveInProgress = false;
            }
        }
    }
    
    isWaveComplete() {
        return !this.waveInProgress && this.enemies.length === 0;
    }
    
    getReachedEnemies() {
        const reached = this.enemies.filter(e => e.reachedBase);
        this.enemies = this.enemies.filter(e => !e.reachedBase);
        return reached;
    }
    
    draw(ctx) {
        this.enemies.forEach(enemy => enemy.draw(ctx));
    }
}
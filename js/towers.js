class Tower {
    constructor(type, x, y) {
        const data = TOWER_DATA[type];
        
        this.type = type;
        this.name = data.name;
        this.tier = data.tier;
        this.cost = data.cost;
        this.range = data.range;
        this.fireRate = data.fireRate;
        this.damage = data.damage;
        this.topic = data.topic;
        this.description = data.description;
        this.upgrades = data.upgrades;
        
        this.x = x;
        this.y = y;
        this.upgradeLevel = 0;
        this.lastFireTime = 0;
        this.target = null;
        
        this.specialData = this.initializeSpecial(data);
    }
    
    initializeSpecial(data) {
        const special = {};
        
        if (data.p !== undefined) {
            special.p = data.p;
        }
        
        if (data.degree !== undefined) {
            special.degree = data.degree;
        }
        
        if (data.wallHP !== undefined) {
            special.wallHP = data.wallHP;
            special.maxWallHP = data.wallHP;
        }
        
        if (this.type === 'an_tower') {
            special.n = 1;
            special.limit = 20;
            special.dualShot = false;
        }
        
        if (this.type === 'limit_tower') {
            special.lhopitalMode = false;
        }
        
        if (this.type === 'geometric_tower') {
            special.r = 0.75;
            special.autoSelect = false;
            special.dualTarget = false;
        }
        
        if (this.type === 'telescoping_tower') {
            special.stunDuration = 0;
        }
        
        if (this.type === 'comparison_bunker') {
            special.slowPercent = 0.4;
            special.dealsDamage = false;
        }
        
        if (this.type === 'ast_cannon') {
            special.alternatePhase = 0;
            special.hasNeutral = false;
            special.fullStop = false;
        }
        
        if (this.type === 'integral_siege') {
            special.beamTargets = 1;
            special.accumulatedDamage = new Map();
        }
        
        if (this.type === 'radius_cannon') {
            special.armorPiercing = false;
        }
        
        if (this.type === 'endpoint_tower') {
            special.bonusDuration = 3000;
        }
        
        if (this.type === 'maclaurin_beam') {
            special.autoIdentify = false;
            special.pulseTimer = 0;
        }
        
        if (this.type === 'lagrange_barrier') {
            special.regenerates = false;
            special.reflects = false;
        }
        
        return special;
    }
    
    upgrade(level) {
        if (level > this.upgrades.length || level <= this.upgradeLevel) {
            return false;
        }
        
        this.upgradeLevel = level;
        const upgrade = this.upgrades[level - 1];
        
        switch(this.type) {
            case 'an_tower':
                if (level === 1) this.fireRate *= 0.7;
                if (level === 2) this.specialData.dualShot = true;
                break;
                
            case 'limit_tower':
                if (level === 1) this.fireRate *= 0.75;
                if (level === 2) this.specialData.lhopitalMode = true;
                break;
                
            case 'geometric_tower':
                if (level === 1) this.specialData.autoSelect = true;
                if (level === 2) this.specialData.dualTarget = true;
                break;
                
            case 'telescoping_tower':
                if (level === 1) this.damage *= 1.4;
                if (level === 2) this.specialData.stunDuration = 1000;
                break;
                
            case 'pseries_cannon':
                if (level === 1) this.specialData.p += 0.5;
                if (level === 2) {
                    this.specialData.p += 1.0;
                    this.specialData.appliesSlow = true;
                }
                break;
                
            case 'ratio_turret':
                if (level === 1) this.range *= 1.35;
                if (level === 2) this.specialData.criticalBurst = true;
                break;
                
            case 'comparison_bunker':
                if (level === 1) this.specialData.slowPercent = 0.6;
                if (level === 2) this.specialData.dealsDamage = true;
                break;
                
            case 'ast_cannon':
                if (level === 1) this.specialData.hasNeutral = true;
                if (level === 2) this.specialData.fullStop = true;
                break;
                
            case 'integral_siege':
                if (level === 1) this.range *= 1.5;
                if (level === 2) this.specialData.beamTargets = 2;
                break;
                
            case 'radius_cannon':
                if (level === 1) this.range *= 1.2;
                if (level === 2) {
                    this.range *= 1.3;
                    this.specialData.armorPiercing = true;
                }
                break;
                
            case 'endpoint_tower':
                if (level === 1) this.specialData.bonusDuration = 5000;
                if (level === 2) this.specialData.hpDamage = true;
                break;
                
            case 'taylor_approximator':
                if (level === 1) this.specialData.degree = 4;
                if (level === 2) this.specialData.degree = 8;
                if (level === 3) this.specialData.degree = 10;
                this.damage = 20 + this.specialData.degree * 5;
                break;
                
            case 'maclaurin_beam':
                if (level === 1) this.damage *= 1.4;
                if (level === 2) this.specialData.hasPulse = true;
                break;
                
            case 'lagrange_barrier':
                if (level === 1) this.specialData.regenerates = true;
                if (level === 2) this.specialData.reflects = true;
                break;
        }
        
        return true;
    }
    
    findTarget(enemies) {
        let closestEnemy = null;
        let closestDistance = Infinity;
        
        enemies.forEach(enemy => {
            if (!enemy.alive || enemy.spawnDelay > 0) return;
            
            const distance = Math.sqrt(
                Math.pow(enemy.x - this.x, 2) + 
                Math.pow(enemy.y - this.y, 2)
            );
            
            if (distance <= this.range && distance < closestDistance) {
                closestDistance = distance;
                closestEnemy = enemy;
            }
        });
        
        return closestEnemy;
    }
    
    update(deltaTime, enemies, projectiles, gameSpeed, isFrozen) {
        if (isFrozen) return;
        
        if (this.type === 'comparison_bunker') {
            enemies.forEach(enemy => {
                if (!enemy.alive || enemy.spawnDelay > 0) return;
                
                const distance = Math.sqrt(
                    Math.pow(enemy.x - this.x, 2) + 
                    Math.pow(enemy.y - this.y, 2)
                );
                
                if (distance <= this.range) {
                    enemy.applySlow(100);
                    
                    if (enemy.special === 'comparison') {
                        enemy.specialData.requiresBunker = false;
                    }
                    
                    if (this.specialData.dealsDamage) {
                        enemy.takeDamage(0.5 * deltaTime / 1000, this);
                    }
                }
            });
            return;
        }
        
        if (this.type === 'lagrange_barrier') {
            if (this.specialData.regenerates && this.specialData.wallHP < this.specialData.maxWallHP) {
                this.specialData.wallHP = Math.min(
                    this.specialData.wallHP + this.specialData.maxWallHP * 0.05 * deltaTime / 1000,
                    this.specialData.maxWallHP
                );
            }
            return;
        }
        
        if (this.type === 'integral_siege') {
            const targets = [];
            enemies.forEach(enemy => {
                if (!enemy.alive || enemy.spawnDelay > 0) return;
                
                const distance = Math.sqrt(
                    Math.pow(enemy.x - this.x, 2) + 
                    Math.pow(enemy.y - this.y, 2)
                );
                
                if (distance <= this.range) {
                    targets.push(enemy);
                }
            });
            
            targets.sort((a, b) => {
                const distA = Math.sqrt(Math.pow(a.x - this.x, 2) + Math.pow(a.y - this.y, 2));
                const distB = Math.sqrt(Math.pow(b.x - this.x, 2) + Math.pow(b.y - this.y, 2));
                return distA - distB;
            });
            
            for (let i = 0; i < Math.min(this.specialData.beamTargets, targets.length); i++) {
                const enemy = targets[i];
                const damage = this.damage * deltaTime / 100;
                enemy.takeDamage(damage, this);
            }
            
            return;
        }
        
        const currentTime = Date.now();
        if (currentTime - this.lastFireTime < this.fireRate / gameSpeed) {
            return;
        }
        
        this.target = this.findTarget(enemies);
        
        if (this.target) {
            this.fire(projectiles, enemies);
            this.lastFireTime = currentTime;
        }
    }
    
    fire(projectiles, enemies) {
        switch(this.type) {
            case 'an_tower':
                projectiles.push(new Projectile(this, this.target, this.damage + this.specialData.n));
                this.specialData.n = Math.min(this.specialData.n + 1, this.specialData.limit);
                
                if (this.specialData.dualShot) {
                    const secondTarget = this.findSecondTarget(enemies, this.target);
                    if (secondTarget) {
                        projectiles.push(new Projectile(this, secondTarget, this.damage + this.specialData.n));
                    }
                }
                break;
                
            case 'geometric_tower':
                const burstCount = 5;
                let currentDamage = this.damage;
                for (let i = 0; i < burstCount; i++) {
                    setTimeout(() => {
                        if (this.target && this.target.alive) {
                            projectiles.push(new Projectile(this, this.target, currentDamage));
                        }
                    }, i * 100);
                    currentDamage *= this.specialData.r;
                }
                
                if (this.specialData.dualTarget) {
                    const secondTarget = this.findSecondTarget(enemies, this.target);
                    if (secondTarget) {
                        let currentDamage2 = this.damage;
                        for (let i = 0; i < burstCount; i++) {
                            setTimeout(() => {
                                if (secondTarget && secondTarget.alive) {
                                    projectiles.push(new Projectile(this, secondTarget, currentDamage2));
                                }
                            }, i * 100);
                            currentDamage2 *= this.specialData.r;
                        }
                    }
                }
                break;
                
            case 'pseries_cannon':
                enemies.forEach(enemy => {
                    if (!enemy.alive || enemy.spawnDelay > 0) return;
                    
                    const distance = Math.sqrt(
                        Math.pow(enemy.x - this.x, 2) + 
                        Math.pow(enemy.y - this.y, 2)
                    );
                    
                    if (distance <= this.range) {
                        enemy.takeDamage(this.damage, this);
                        if (this.specialData.appliesSlow) {
                            enemy.applySlow(2000);
                        }
                    }
                });
                break;
                
            case 'ratio_turret':
                const ratioBonus = this.target.special === 'ratio' || 
                                  this.target.special === 'divergent' ? 2 : 1;
                let damage = this.damage * ratioBonus;
                
                if (this.specialData.criticalBurst && ratioBonus >= 2) {
                    damage *= 3;
                }
                
                projectiles.push(new Projectile(this, this.target, damage));
                break;
                
            case 'ast_cannon':
                const phase = this.specialData.alternatePhase % 2;
                if (phase === 0) {
                    projectiles.push(new Projectile(this, this.target, this.damage));
                } else {
                    const slowDuration = this.specialData.fullStop ? 2000 : 1500;
                    this.target.applySlow(slowDuration);
                    if (this.specialData.fullStop) {
                        this.target.applyStun(2000);
                    }
                }
                
                this.specialData.alternatePhase++;
                
                if (this.specialData.hasNeutral && this.specialData.alternatePhase % 3 === 0) {
                    enemies.forEach(enemy => {
                        if (!enemy.alive || enemy.spawnDelay > 0) return;
                        
                        const distance = Math.sqrt(
                            Math.pow(enemy.x - this.target.x, 2) + 
                            Math.pow(enemy.y - this.target.y, 2)
                        );
                        
                        if (distance <= 50) {
                            enemy.takeDamage(this.damage * 0.5, this);
                        }
                    });
                }
                break;
                
            case 'maclaurin_beam':
                projectiles.push(new Projectile(this, this.target, this.damage));
                
                if (this.specialData.hasPulse) {
                    this.specialData.pulseTimer += this.fireRate;
                    if (this.specialData.pulseTimer >= 10000) {
                        this.specialData.pulseTimer = 0;
                        enemies.forEach(enemy => {
                            if (!enemy.alive || enemy.spawnDelay > 0) return;
                            
                            const distance = Math.sqrt(
                                Math.pow(enemy.x - this.x, 2) + 
                                Math.pow(enemy.y - this.y, 2)
                            );
                            
                            if (distance <= this.range) {
                                enemy.takeDamage(this.damage * 2, this);
                            }
                        });
                    }
                }
                break;
                
            default:
                projectiles.push(new Projectile(this, this.target, this.damage));
                break;
        }
    }
    
    findSecondTarget(enemies, excludeTarget) {
        let secondTarget = null;
        let closestDistance = Infinity;
        
        enemies.forEach(enemy => {
            if (!enemy.alive || enemy.spawnDelay > 0 || enemy === excludeTarget) return;
            
            const distance = Math.sqrt(
                Math.pow(enemy.x - this.x, 2) + 
                Math.pow(enemy.y - this.y, 2)
            );
            
            if (distance <= this.range && distance < closestDistance) {
                closestDistance = distance;
                secondTarget = enemy;
            }
        });
        
        return secondTarget;
    }
    
    draw(ctx) {
        ctx.fillStyle = this.getTowerColor();
        ctx.strokeStyle = '#4a9eff';
        ctx.lineWidth = 2;
        
        if (this.type === 'lagrange_barrier') {
            const barWidth = 80;
            const barHeight = 40;
            ctx.fillRect(this.x - barWidth/2, this.y - barHeight/2, barWidth, barHeight);
            ctx.strokeRect(this.x - barWidth/2, this.y - barHeight/2, barWidth, barHeight);
            
            ctx.fillStyle = 'white';
            ctx.font = 'bold 10px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(`HP: ${Math.floor(this.specialData.wallHP)}`, this.x, this.y);
        } else {
            ctx.beginPath();
            ctx.arc(this.x, this.y, 15, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            
            ctx.fillStyle = 'white';
            ctx.font = 'bold 10px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(this.getSymbol(), this.x, this.y + 4);
        }
        
        if (this.upgradeLevel > 0) {
            ctx.fillStyle = '#ffd700';
            ctx.font = 'bold 8px Arial';
            for (let i = 0; i < this.upgradeLevel; i++) {
                ctx.fillText('★', this.x - 10 + i * 10, this.y - 20);
            }
        }
    }
    
    drawRange(ctx) {
        ctx.strokeStyle = 'rgba(74, 158, 255, 0.3)';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.range, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
    }
    
    getTowerColor() {
        const colors = {
            1: '#66d9ef',
            2: '#a6e22e',
            3: '#f92672',
            4: '#fd971f',
            5: '#ae81ff'
        };
        return colors[this.tier] || '#888';
    }
    
    getSymbol() {
        const symbols = {
            'an_tower': 'aₙ',
            'limit_tower': 'lim',
            'geometric_tower': 'r',
            'telescoping_tower': '±',
            'pseries_cannon': 'p',
            'ratio_turret': 'R',
            'comparison_bunker': '≤',
            'ast_cannon': '∑±',
            'integral_siege': '∫',
            'radius_cannon': 'R',
            'endpoint_tower': '[]',
            'taylor_approximator': 'Tₙ',
            'maclaurin_beam': 'M',
            'lagrange_barrier': '±ε'
        };
        return symbols[this.type] || 'T';
    }
    
    getSellValue() {
        let total = this.cost;
        for (let i = 0; i < this.upgradeLevel; i++) {
            total += this.upgrades[i].cost;
        }
        return Math.floor(total * GAME_CONFIG.TOWER_SELL_PERCENT);
    }
}
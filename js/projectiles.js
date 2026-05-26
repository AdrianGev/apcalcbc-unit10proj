class Projectile {
    constructor(tower, target, damage) {
        this.tower = tower;
        this.target = target;
        this.damage = damage;
        
        this.x = tower.x;
        this.y = tower.y;
        this.speed = 300;
        this.alive = true;
        
        this.color = tower.getTowerColor();
    }
    
    update(deltaTime, gameSpeed) {
        if (!this.alive || !this.target || !this.target.alive) {
            this.alive = false;
            return;
        }
        
        const dx = this.target.x - this.x;
        const dy = this.target.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 5) {
            this.target.takeDamage(this.damage, this.tower);
            
            if (this.tower.type === 'telescoping_tower' && this.tower.specialData.stunDuration > 0) {
                this.target.applyStun(this.tower.specialData.stunDuration);
            }
            
            this.alive = false;
            return;
        }
        
        const moveDistance = this.speed * gameSpeed * deltaTime / 1000;
        this.x += (dx / distance) * moveDistance;
        this.y += (dy / distance) * moveDistance;
    }
    
    draw(ctx) {
        if (!this.alive) return;
        
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 4, 0, Math.PI * 2);
        ctx.fill();
    }
}
const MAPS = {
    level1: {
        name: "Level 1: Straight Path",
        description: "Simple horizontal path - learn the basics",
        path: [
            { x: 50, y: 250 },
            { x: 750, y: 250 }
        ],
        placementZones: [
            { x: 100, y: 100, width: 600, height: 100 },
            { x: 100, y: 300, width: 600, height: 100 }
        ],
        basePosition: { x: 750, y: 250 },
        waves: 20
    },
    level2: {
        name: "Level 2: Single Curve",
        description: "One gentle curve - positioning matters",
        path: [
            { x: 50, y: 350 },
            { x: 300, y: 350 },
            { x: 400, y: 250 },
            { x: 500, y: 150 },
            { x: 750, y: 150 }
        ],
        placementZones: [
            { x: 100, y: 50, width: 600, height: 80 },
            { x: 100, y: 270, width: 250, height: 100 },
            { x: 450, y: 270, width: 250, height: 100 }
        ],
        basePosition: { x: 750, y: 150 },
        waves: 20
    },
    level3: {
        name: "Level 3: Zigzag Path",
        description: "Full zigzag pattern - strategic placement required",
        path: [
            { x: 50, y: 300 },
            { x: 150, y: 300 },
            { x: 250, y: 150 },
            { x: 350, y: 150 },
            { x: 450, y: 300 },
            { x: 550, y: 300 },
            { x: 650, y: 150 },
            { x: 750, y: 300 }
        ],
        placementZones: [
            { x: 100, y: 50, width: 150, height: 80 },
            { x: 100, y: 320, width: 100, height: 80 },
            { x: 300, y: 170, width: 100, height: 110 },
            { x: 500, y: 50, width: 100, height: 80 },
            { x: 500, y: 320, width: 100, height: 80 }
        ],
        basePosition: { x: 750, y: 300 },
        waves: 20
    },
    level4: {
        name: "Level 4: Split Path",
        description: "Branching path - cover both lanes",
        path: [
            { x: 50, y: 250 },
            { x: 250, y: 250 },
            { x: 300, y: 150 },
            { x: 500, y: 150 },
            { x: 550, y: 250 },
            { x: 750, y: 250 }
        ],
        path2: [
            { x: 250, y: 250 },
            { x: 300, y: 350 },
            { x: 500, y: 350 },
            { x: 550, y: 250 }
        ],
        placementZones: [
            { x: 100, y: 100, width: 150, height: 100 },
            { x: 100, y: 300, width: 150, height: 100 },
            { x: 320, y: 180, width: 160, height: 140 },
            { x: 550, y: 100, width: 150, height: 100 },
            { x: 550, y: 300, width: 150, height: 100 }
        ],
        basePosition: { x: 750, y: 250 },
        waves: 20
    },
    level5: {
        name: "Level 5: Complex Maze",
        description: "Advanced layout - strategic placement required",
        path: [
            { x: 50, y: 350 },
            { x: 150, y: 350 },
            { x: 200, y: 300 },
            { x: 200, y: 200 },
            { x: 300, y: 150 },
            { x: 400, y: 150 },
            { x: 450, y: 200 },
            { x: 500, y: 250 },
            { x: 600, y: 250 },
            { x: 650, y: 200 },
            { x: 700, y: 150 },
            { x: 750, y: 150 }
        ],
        placementZones: [
            { x: 100, y: 50, width: 500, height: 80 },
            { x: 100, y: 200, width: 80, height: 120 },
            { x: 250, y: 180, width: 120, height: 100 },
            { x: 420, y: 180, width: 60, height: 100 },
            { x: 520, y: 180, width: 100, height: 50 },
            { x: 100, y: 370, width: 600, height: 30 }
        ],
        basePosition: { x: 750, y: 150 },
        waves: 20
    }
};

class GameMap {
    constructor(levelId, canvasWidth, canvasHeight) {
        const mapData = MAPS[levelId];
        
        this.levelId = levelId;
        this.name = mapData.name;
        this.description = mapData.description;
        this.waves = mapData.waves;
        
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        
        this.path = this.scalePath(mapData.path);
        this.path2 = mapData.path2 ? this.scalePath(mapData.path2) : null;
        this.placementZones = this.scaleZones(mapData.placementZones);
        this.basePosition = this.scalePoint(mapData.basePosition);
        
        this.generateGrassBlades();
        this.generateFlowers();
        this.generatePathStones();
    }
    
    generateGrassBlades() {
        this.grassBlades = [];
        for (let i = 0; i < 150; i++) {
            this.grassBlades.push({
                x: Math.random() * this.canvasWidth,
                y: Math.random() * this.canvasHeight,
                color: Math.random() > 0.5 ? '#6b9e4a' : '#4a6c2c'
            });
        }
    }
    
    generateFlowers() {
        this.flowers = [];
        const flowerCount = 40;
        for (let i = 0; i < flowerCount; i++) {
            const x = Math.random() * this.canvasWidth;
            const y = Math.random() * this.canvasHeight;
            
            let onPath = false;
            for (let j = 0; j < this.path.length - 1; j++) {
                const p1 = this.path[j];
                const p2 = this.path[j + 1];
                const dist = this.pointToLineDistance(x, y, p1.x, p1.y, p2.x, p2.y);
                if (dist < 50) {
                    onPath = true;
                    break;
                }
            }
            
            if (!onPath) {
                this.flowers.push({ x, y });
            }
        }
    }
    
    generatePathStones() {
        this.pathStones = [];
        for (let i = 0; i < this.path.length - 1; i++) {
            const p1 = this.path[i];
            const p2 = this.path[i + 1];
            const distance = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
            const stones = Math.floor(distance / 20);
            
            for (let s = 0; s < stones; s++) {
                const t = s / stones;
                const x = p1.x + (p2.x - p1.x) * t + (Math.random() - 0.5) * 15;
                const y = p1.y + (p2.y - p1.y) * t + (Math.random() - 0.5) * 15;
                const color = Math.random() > 0.5 ? '#9a8a7a' : '#b0a090';
                const radius = 3 + Math.random() * 2;
                
                this.pathStones.push({ x, y, color, radius });
            }
        }
    }
    
    scalePath(path) {
        const scaleX = this.canvasWidth / 800;
        const scaleY = this.canvasHeight / 400;
        
        return path.map(point => ({
            x: point.x * scaleX,
            y: point.y * scaleY
        }));
    }
    
    scaleZones(zones) {
        const scaleX = this.canvasWidth / 800;
        const scaleY = this.canvasHeight / 400;
        
        return zones.map(zone => ({
            x: zone.x * scaleX,
            y: zone.y * scaleY,
            width: zone.width * scaleX,
            height: zone.height * scaleY
        }));
    }
    
    scalePoint(point) {
        const scaleX = this.canvasWidth / 800;
        const scaleY = this.canvasHeight / 400;
        
        return {
            x: point.x * scaleX,
            y: point.y * scaleY
        };
    }
    
    isValidPlacement(x, y) {
        for (let i = 0; i < this.path.length - 1; i++) {
            const p1 = this.path[i];
            const p2 = this.path[i + 1];
            const dist = this.pointToLineDistance(x, y, p1.x, p1.y, p2.x, p2.y);
            if (dist < 30) {
                return false;
            }
        }
        
        const baseDist = Math.sqrt(
            Math.pow(x - this.basePosition.x, 2) + 
            Math.pow(y - this.basePosition.y, 2)
        );
        if (baseDist < 50) {
            return false;
        }
        
        return true;
    }
    
    draw(ctx) {
        this.drawGrass(ctx);
        this.drawFlowers(ctx);
        this.drawPath(ctx, this.path);
        if (this.path2) {
            this.drawPath(ctx, this.path2);
        }
        
        this.drawBase(ctx);
    }
    
    drawGrass(ctx) {
        const grassGradient = ctx.createLinearGradient(0, 0, this.canvasWidth, this.canvasHeight);
        grassGradient.addColorStop(0, '#5a8c3c');
        grassGradient.addColorStop(0.5, '#4a7c2c');
        grassGradient.addColorStop(1, '#5a8c3c');
        ctx.fillStyle = grassGradient;
        ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
        
        ctx.globalAlpha = 0.3;
        this.grassBlades.forEach(blade => {
            ctx.fillStyle = blade.color;
            ctx.fillRect(blade.x, blade.y, 2, 4);
        });
        ctx.globalAlpha = 1;
    }
    
    drawFlowers(ctx) {
        this.flowers.forEach(flower => {
            ctx.fillStyle = '#ffd700';
            ctx.beginPath();
            ctx.arc(flower.x, flower.y, 3, 0, Math.PI * 2);
            ctx.fill();
            
            for (let p = 0; p < 5; p++) {
                const angle = (p / 5) * Math.PI * 2;
                const px = flower.x + Math.cos(angle) * 5;
                const py = flower.y + Math.sin(angle) * 5;
                ctx.fillStyle = '#ffffff';
                ctx.beginPath();
                ctx.arc(px, py, 2, 0, Math.PI * 2);
                ctx.fill();
            }
        });
    }
    
    pointToLineDistance(px, py, x1, y1, x2, y2) {
        const A = px - x1;
        const B = py - y1;
        const C = x2 - x1;
        const D = y2 - y1;
        
        const dot = A * C + B * D;
        const lenSq = C * C + D * D;
        let param = -1;
        
        if (lenSq !== 0) param = dot / lenSq;
        
        let xx, yy;
        
        if (param < 0) {
            xx = x1;
            yy = y1;
        } else if (param > 1) {
            xx = x2;
            yy = y2;
        } else {
            xx = x1 + param * C;
            yy = y1 + param * D;
        }
        
        const dx = px - xx;
        const dy = py - yy;
        return Math.sqrt(dx * dx + dy * dy);
    }
    
    drawPath(ctx, path) {
        ctx.strokeStyle = '#8b7355';
        ctx.lineWidth = 45;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        ctx.beginPath();
        ctx.moveTo(path[0].x, path[0].y);
        for (let i = 1; i < path.length; i++) {
            ctx.lineTo(path[i].x, path[i].y);
        }
        ctx.stroke();
        
        ctx.strokeStyle = '#a89080';
        ctx.lineWidth = 35;
        ctx.beginPath();
        ctx.moveTo(path[0].x, path[0].y);
        for (let i = 1; i < path.length; i++) {
            ctx.lineTo(path[i].x, path[i].y);
        }
        ctx.stroke();
        
        ctx.globalAlpha = 0.6;
        this.pathStones.forEach(stone => {
            ctx.fillStyle = stone.color;
            ctx.beginPath();
            ctx.arc(stone.x, stone.y, stone.radius, 0, Math.PI * 2);
            ctx.fill();
        });
        ctx.globalAlpha = 1;
    }
    
    drawBase(ctx) {
        ctx.fillStyle = '#8b4513';
        ctx.strokeStyle = '#6b3410';
        ctx.lineWidth = 4;
        
        ctx.fillRect(this.basePosition.x - 30, this.basePosition.y - 30, 60, 60);
        ctx.strokeRect(this.basePosition.x - 30, this.basePosition.y - 30, 60, 60);
        
        ctx.fillStyle = '#a0522d';
        ctx.fillRect(this.basePosition.x - 30, this.basePosition.y - 40, 60, 10);
        
        ctx.fillStyle = '#654321';
        ctx.fillRect(this.basePosition.x - 10, this.basePosition.y - 10, 20, 30);
        
        ctx.fillStyle = 'white';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('BASE', this.basePosition.x, this.basePosition.y + 50);
    }
    
    drawPlacementZones(ctx, showZones) {
        if (!showZones) return;
        
        ctx.fillStyle = 'rgba(139, 115, 85, 0.15)';
        ctx.strokeStyle = 'rgba(139, 115, 85, 0.4)';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        
        this.placementZones.forEach(zone => {
            ctx.fillRect(zone.x, zone.y, zone.width, zone.height);
            ctx.strokeRect(zone.x, zone.y, zone.width, zone.height);
        });
        
        ctx.setLineDash([]);
    }
    
    getPath() {
        return this.path;
    }
}
class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.scoreElement = document.getElementById('score');
        
        // Game state
        this.score = 0;
        this.gameOver = false;
        
        // Player square
        this.player = {
            x: this.canvas.width / 2,
            y: this.canvas.height / 2,
            size: 20,
            speed: 3,
            color: '#00ffff'
        };
        
        // Mouse position
        this.mouse = {
            x: 0,
            y: 0
        };
        
        // Game objects
        this.obstacles = [];
        this.points = [];
        
        // Initialize
        this.init();
        this.gameLoop();
    }
    
    init() {
        // Mouse event listeners
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
        });
        
        // Generate initial obstacles and points
        this.generateObstacles();
        this.generatePoints();
    }
    
    generateObstacles() {
        this.obstacles = [];
        for (let i = 0; i < 8; i++) {
            this.obstacles.push({
                x: Math.random() * (this.canvas.width - 40),
                y: Math.random() * (this.canvas.height - 40),
                width: 40 + Math.random() * 60,
                height: 40 + Math.random() * 60,
                color: '#ff4444'
            });
        }
    }
    
    generatePoints() {
        this.points = [];
        for (let i = 0; i < 5; i++) {
            this.points.push({
                x: Math.random() * (this.canvas.width - 20),
                y: Math.random() * (this.canvas.height - 20),
                size: 15,
                color: '#44ff44',
                collected: false
            });
        }
    }
    
    updatePlayer() {
        if (this.gameOver) return;
        
        // Calculate direction from player to mouse
        const dx = this.mouse.x - this.player.x;
        const dy = this.mouse.y - this.player.y;
        
        // Calculate distance
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Only move if mouse is not too close (prevents jittering)
        if (distance > 5) {
            // Normalize direction and apply speed
            const dirX = dx / distance;
            const dirY = dy / distance;
            
            // Update player position
            this.player.x += dirX * this.player.speed;
            this.player.y += dirY * this.player.speed;
        }
        
        // Keep player within canvas bounds
        this.player.x = Math.max(this.player.size / 2, Math.min(this.canvas.width - this.player.size / 2, this.player.x));
        this.player.y = Math.max(this.player.size / 2, Math.min(this.canvas.height - this.player.size / 2, this.player.y));
    }
    
    checkCollisions() {
        // Check collision with obstacles
        for (let obstacle of this.obstacles) {
            if (this.player.x < obstacle.x + obstacle.width &&
                this.player.x + this.player.size > obstacle.x &&
                this.player.y < obstacle.y + obstacle.height &&
                this.player.y + this.player.size > obstacle.y) {
                this.gameOver = true;
                return;
            }
        }
        
        // Check collision with points
        for (let point of this.points) {
            if (!point.collected &&
                this.player.x < point.x + point.size &&
                this.player.x + this.player.size > point.x &&
                this.player.y < point.y + point.size &&
                this.player.y + this.player.size > point.y) {
                point.collected = true;
                this.score += 10;
                this.scoreElement.textContent = this.score;
                
                // Check if all points are collected
                if (this.points.every(p => p.collected)) {
                    this.generatePoints();
                }
            }
        }
    }
    
    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw obstacles
        for (let obstacle of this.obstacles) {
            this.ctx.fillStyle = obstacle.color;
            this.ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        }
        
        // Draw points
        for (let point of this.points) {
            if (!point.collected) {
                this.ctx.fillStyle = point.color;
                this.ctx.beginPath();
                this.ctx.arc(point.x + point.size / 2, point.y + point.size / 2, point.size / 2, 0, Math.PI * 2);
                this.ctx.fill();
            }
        }
        
        // Draw player
        this.ctx.fillStyle = this.player.color;
        this.ctx.fillRect(
            this.player.x - this.player.size / 2,
            this.player.y - this.player.size / 2,
            this.player.size,
            this.player.size
        );
        
        // Draw direction line (optional visual aid)
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(this.player.x, this.player.y);
        this.ctx.lineTo(this.mouse.x, this.mouse.y);
        this.ctx.stroke();
        
        // Game over screen
        if (this.gameOver) {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            
            this.ctx.fillStyle = '#ffffff';
            this.ctx.font = '48px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('¡Juego Terminado!', this.canvas.width / 2, this.canvas.height / 2 - 50);
            
            this.ctx.font = '24px Arial';
            this.ctx.fillText(`Puntuación: ${this.score}`, this.canvas.width / 2, this.canvas.height / 2);
            
            this.ctx.font = '18px Arial';
            this.ctx.fillText('Recarga la página para jugar de nuevo', this.canvas.width / 2, this.canvas.height / 2 + 50);
        }
    }
    
    gameLoop() {
        this.updatePlayer();
        this.checkCollisions();
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }
}

// Start the game when the page loads
window.addEventListener('load', () => {
    new Game();
}); 
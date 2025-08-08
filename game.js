class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.scoreElement = document.getElementById('score');
        this.deviceIndicator = document.getElementById('deviceIndicator');
        
        // Game state
        this.score = 0;
        this.gameOver = false;
        
        // Device detection
        this.isMobile = this.detectMobile();
        
        // Update device indicator
        if (this.deviceIndicator) {
            this.deviceIndicator.textContent = this.isMobile ? 'Modo Móvil' : 'Modo PC';
        }
        
        // Responsive canvas setup
        this.setupCanvas();
        
        // Player square - fixed sizes for better gameplay
        this.player = {
            x: this.canvas.width / 2,
            y: this.canvas.height / 2,
            size: this.isMobile ? 25 : 20, // Fixed size based on device
            speed: this.isMobile ? 4 : 3, // Fixed speed based on device
            color: '#00ffff'
        };
        
        // Touch/mouse position
        this.target = {
            x: this.canvas.width / 2,
            y: this.canvas.height / 2
        };
        
        // Game objects
        this.obstacles = [];
        this.points = [];
        
        // Touch state
        this.isTouching = false;
        
        // Initialize
        this.init();
        this.gameLoop();
        
        // Handle window resize
        window.addEventListener('resize', () => {
            this.setupCanvas();
            this.resizeGameObjects();
        });
    }
    
    detectMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
               (window.innerWidth <= 768);
    }
    
    setupCanvas() {
        const container = this.canvas.parentElement;
        const rect = container.getBoundingClientRect();
        
        // Set canvas size to match container
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
        
        // Ensure target position is within bounds
        if (this.target) {
            this.target.x = Math.min(Math.max(0, this.target.x), this.canvas.width);
            this.target.y = Math.min(Math.max(0, this.target.y), this.canvas.height);
        }
    }
    
    resizeGameObjects() {
        // Regenerate obstacles and points for new canvas size
        this.generateObstacles();
        this.generatePoints();
        
        // Update player position to center
        this.player.x = this.canvas.width / 2;
        this.player.y = this.canvas.height / 2;
        this.target.x = this.player.x;
        this.target.y = this.player.y;
    }
    
    init() {
        // Touch events for mobile
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.isTouching = true;
            this.updateTargetPosition(e);
        });
        
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            if (this.isTouching) {
                this.updateTargetPosition(e);
            }
        });
        
        this.canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.isTouching = false;
        });
        
        // Mouse events for desktop (fallback)
        this.canvas.addEventListener('mousedown', (e) => {
            this.isTouching = true;
            this.updateTargetPosition(e);
        });
        
        this.canvas.addEventListener('mousemove', (e) => {
            if (this.isTouching) {
                this.updateTargetPosition(e);
            }
        });
        
        this.canvas.addEventListener('mouseup', (e) => {
            this.isTouching = false;
        });
        
        // Prevent context menu on right click
        this.canvas.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
        
        // Generate initial obstacles and points
        this.generateObstacles();
        this.generatePoints();
    }
    
    updateTargetPosition(event) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        
        let clientX, clientY;
        
        if (event.touches && event.touches[0]) {
            // Touch event
            clientX = event.touches[0].clientX;
            clientY = event.touches[0].clientY;
        } else {
            // Mouse event
            clientX = event.clientX;
            clientY = event.clientY;
        }
        
        this.target.x = (clientX - rect.left) * scaleX;
        this.target.y = (clientY - rect.top) * scaleY;
    }
    
    generateObstacles() {
        this.obstacles = [];
        
        // Fixed number of obstacles based on device type
        const numObstacles = this.isMobile ? 8 : 12;
        
        for (let i = 0; i < numObstacles; i++) {
            // Fixed sizes for better gameplay
            const minSize = this.isMobile ? 40 : 35;
            const maxSize = this.isMobile ? 70 : 60;
            
            this.obstacles.push({
                x: Math.random() * (this.canvas.width - maxSize),
                y: Math.random() * (this.canvas.height - maxSize),
                width: minSize + Math.random() * (maxSize - minSize),
                height: minSize + Math.random() * (maxSize - minSize),
                color: '#ff4444'
            });
        }
    }
    
    generatePoints() {
        this.points = [];
        
        // Fixed number of points based on device type
        const numPoints = this.isMobile ? 5 : 8;
        
        for (let i = 0; i < numPoints; i++) {
            // Fixed size for better gameplay
            const pointSize = this.isMobile ? 15 : 12;
            
            this.points.push({
                x: Math.random() * (this.canvas.width - pointSize),
                y: Math.random() * (this.canvas.height - pointSize),
                size: pointSize,
                color: '#44ff44',
                collected: false
            });
        }
    }
    
    updatePlayer() {
        if (this.gameOver) return;
        
        // Calculate direction from player to target
        const dx = this.target.x - this.player.x;
        const dy = this.target.y - this.player.y;
        
        // Calculate distance
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Only move if target is not too close (prevents jittering)
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
        if (this.isTouching) {
            this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.moveTo(this.player.x, this.player.y);
            this.ctx.lineTo(this.target.x, this.target.y);
            this.ctx.stroke();
        }
        
        // Game over screen
        if (this.gameOver) {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            
            this.ctx.fillStyle = '#ffffff';
            const fontSize = this.isMobile ? 28 : 32;
            this.ctx.font = `${fontSize}px Arial`;
            this.ctx.textAlign = 'center';
            this.ctx.fillText('¡Juego Terminado!', this.canvas.width / 2, this.canvas.height / 2 - 50);
            
            const scoreFontSize = this.isMobile ? 20 : 24;
            this.ctx.font = `${scoreFontSize}px Arial`;
            this.ctx.fillText(`Puntuación: ${this.score}`, this.canvas.width / 2, this.canvas.height / 2);
            
            const restartFontSize = this.isMobile ? 16 : 18;
            this.ctx.font = `${restartFontSize}px Arial`;
            this.ctx.fillText('Toca la pantalla para reiniciar', this.canvas.width / 2, this.canvas.height / 2 + 50);
        }
    }
    
    gameLoop() {
        this.updatePlayer();
        this.checkCollisions();
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }
    
    resetGame() {
        this.score = 0;
        this.gameOver = false;
        this.scoreElement.textContent = this.score;
        this.player.x = this.canvas.width / 2;
        this.player.y = this.canvas.height / 2;
        this.target.x = this.player.x;
        this.target.y = this.player.y;
        this.generateObstacles();
        this.generatePoints();
    }
}

// Start the game when the page loads
window.addEventListener('load', () => {
    // Small delay to ensure proper canvas sizing
    setTimeout(() => {
        const game = new Game();
        
        // Add restart functionality
        game.canvas.addEventListener('click', (e) => {
            if (game.gameOver) {
                game.resetGame();
            }
        });
        
        game.canvas.addEventListener('touchstart', (e) => {
            if (game.gameOver) {
                e.preventDefault();
                game.resetGame();
            }
        });
    }, 100);
}); 
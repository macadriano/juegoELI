import pygame
import math
import random

# Inicializar Pygame
pygame.init()

# Configuración de la ventana
WIDTH = 800
HEIGHT = 600
FPS = 60

# Colores
BLACK = (0, 0, 0)
WHITE = (255, 255, 255)
CYAN = (0, 255, 255)
RED = (255, 68, 68)
GREEN = (68, 255, 68)
BLUE_GRADIENT_1 = (102, 126, 234)
BLUE_GRADIENT_2 = (118, 75, 162)

class Game:
    def __init__(self):
        self.screen = pygame.display.set_mode((WIDTH, HEIGHT))
        pygame.display.set_caption("Cuadrado Seguidor del Cursor")
        self.clock = pygame.time.Clock()
        self.font = pygame.font.Font(None, 36)
        self.small_font = pygame.font.Font(None, 24)
        
        # Estado del juego
        self.score = 0
        self.game_over = False
        
        # Cuadrado del jugador
        self.player = {
            'x': WIDTH // 2,
            'y': HEIGHT // 2,
            'size': 20,
            'speed': 3,
            'color': CYAN
        }
        
        # Posición del mouse
        self.mouse_x = 0
        self.mouse_y = 0
        
        # Objetos del juego
        self.obstacles = []
        self.points = []
        
        # Generar obstáculos y puntos iniciales
        self.generate_obstacles()
        self.generate_points()
    
    def generate_obstacles(self):
        """Genera obstáculos aleatorios"""
        self.obstacles = []
        for _ in range(8):
            obstacle = {
                'x': random.randint(0, WIDTH - 100),
                'y': random.randint(0, HEIGHT - 100),
                'width': random.randint(40, 100),
                'height': random.randint(40, 100),
                'color': RED
            }
            self.obstacles.append(obstacle)
    
    def generate_points(self):
        """Genera puntos aleatorios para recolectar"""
        self.points = []
        for _ in range(5):
            point = {
                'x': random.randint(0, WIDTH - 30),
                'y': random.randint(0, HEIGHT - 30),
                'size': 15,
                'color': GREEN,
                'collected': False
            }
            self.points.append(point)
    
    def update_player(self):
        """Actualiza la posición del jugador basada en la posición del mouse"""
        if self.game_over:
            return
        
        # Calcular dirección desde el jugador hacia el mouse
        dx = self.mouse_x - self.player['x']
        dy = self.mouse_y - self.player['y']
        
        # Calcular distancia
        distance = math.sqrt(dx * dx + dy * dy)
        
        # Solo mover si el mouse no está muy cerca (evita temblores)
        if distance > 5:
            # Normalizar dirección y aplicar velocidad
            dir_x = dx / distance
            dir_y = dy / distance
            
            # Actualizar posición del jugador
            self.player['x'] += dir_x * self.player['speed']
            self.player['y'] += dir_y * self.player['speed']
        
        # Mantener al jugador dentro de los límites del canvas
        self.player['x'] = max(self.player['size'] // 2, 
                              min(WIDTH - self.player['size'] // 2, self.player['x']))
        self.player['y'] = max(self.player['size'] // 2, 
                              min(HEIGHT - self.player['size'] // 2, self.player['y']))
    
    def check_collisions(self):
        """Verifica colisiones con obstáculos y puntos"""
        player_rect = pygame.Rect(
            self.player['x'] - self.player['size'] // 2,
            self.player['y'] - self.player['size'] // 2,
            self.player['size'],
            self.player['size']
        )
        
        # Verificar colisión con obstáculos
        for obstacle in self.obstacles:
            obstacle_rect = pygame.Rect(obstacle['x'], obstacle['y'], 
                                      obstacle['width'], obstacle['height'])
            if player_rect.colliderect(obstacle_rect):
                self.game_over = True
                return
        
        # Verificar colisión con puntos
        for point in self.points:
            if not point['collected']:
                point_rect = pygame.Rect(point['x'], point['y'], 
                                       point['size'], point['size'])
                if player_rect.colliderect(point_rect):
                    point['collected'] = True
                    self.score += 10
                    
                    # Verificar si todos los puntos fueron recolectados
                    if all(p['collected'] for p in self.points):
                        self.generate_points()
    
    def draw(self):
        """Dibuja todos los elementos del juego"""
        # Limpiar pantalla con gradiente
        self.draw_gradient_background()
        
        # Dibujar obstáculos
        for obstacle in self.obstacles:
            pygame.draw.rect(self.screen, obstacle['color'], 
                           (obstacle['x'], obstacle['y'], 
                            obstacle['width'], obstacle['height']))
        
        # Dibujar puntos
        for point in self.points:
            if not point['collected']:
                pygame.draw.circle(self.screen, point['color'],
                                 (point['x'] + point['size'] // 2, 
                                  point['y'] + point['size'] // 2),
                                 point['size'] // 2)
        
        # Dibujar jugador
        pygame.draw.rect(self.screen, self.player['color'],
                        (self.player['x'] - self.player['size'] // 2,
                         self.player['y'] - self.player['size'] // 2,
                         self.player['size'], self.player['size']))
        
        # Dibujar línea de dirección (ayuda visual opcional)
        pygame.draw.line(self.screen, (255, 255, 255, 128),
                        (self.player['x'], self.player['y']),
                        (self.mouse_x, self.mouse_y), 2)
        
        # Dibujar puntuación
        score_text = self.font.render(f"Puntos: {self.score}", True, WHITE)
        self.screen.blit(score_text, (WIDTH - 150, 10))
        
        # Dibujar instrucciones
        instructions = [
            "Instrucciones:",
            "• Mueve el cursor para dirigir el cuadrado",
            "• El cuadrado seguirá la dirección del cursor",
            "• Evita los obstáculos rojos",
            "• Recolecta los puntos verdes"
        ]
        
        for i, instruction in enumerate(instructions):
            color = WHITE if i == 0 else (200, 200, 200)
            text = self.small_font.render(instruction, True, color)
            self.screen.blit(text, (10, 10 + i * 25))
        
        # Pantalla de game over
        if self.game_over:
            overlay = pygame.Surface((WIDTH, HEIGHT))
            overlay.set_alpha(200)
            overlay.fill(BLACK)
            self.screen.blit(overlay, (0, 0))
            
            game_over_text = self.font.render("¡Juego Terminado!", True, WHITE)
            score_text = self.font.render(f"Puntuación: {self.score}", True, WHITE)
            restart_text = self.small_font.render("Presiona R para reiniciar o ESC para salir", True, WHITE)
            
            self.screen.blit(game_over_text, 
                           (WIDTH // 2 - game_over_text.get_width() // 2, HEIGHT // 2 - 50))
            self.screen.blit(score_text, 
                           (WIDTH // 2 - score_text.get_width() // 2, HEIGHT // 2))
            self.screen.blit(restart_text, 
                           (WIDTH // 2 - restart_text.get_width() // 2, HEIGHT // 2 + 50))
    
    def draw_gradient_background(self):
        """Dibuja un fondo con gradiente"""
        for y in range(HEIGHT):
            ratio = y / HEIGHT
            r = int(BLUE_GRADIENT_1[0] * (1 - ratio) + BLUE_GRADIENT_2[0] * ratio)
            g = int(BLUE_GRADIENT_1[1] * (1 - ratio) + BLUE_GRADIENT_2[1] * ratio)
            b = int(BLUE_GRADIENT_1[2] * (1 - ratio) + BLUE_GRADIENT_2[2] * ratio)
            pygame.draw.line(self.screen, (r, g, b), (0, y), (WIDTH, y))
    
    def reset_game(self):
        """Reinicia el juego"""
        self.score = 0
        self.game_over = False
        self.player['x'] = WIDTH // 2
        self.player['y'] = HEIGHT // 2
        self.generate_obstacles()
        self.generate_points()
    
    def run(self):
        """Bucle principal del juego"""
        running = True
        
        while running:
            # Manejo de eventos
            for event in pygame.event.get():
                if event.type == pygame.QUIT:
                    running = False
                elif event.type == pygame.KEYDOWN:
                    if event.key == pygame.K_ESCAPE:
                        running = False
                    elif event.key == pygame.K_r and self.game_over:
                        self.reset_game()
                elif event.type == pygame.MOUSEMOTION:
                    self.mouse_x, self.mouse_y = event.pos
            
            # Actualizar lógica del juego
            self.update_player()
            self.check_collisions()
            
            # Dibujar
            self.draw()
            
            # Actualizar pantalla
            pygame.display.flip()
            self.clock.tick(FPS)
        
        pygame.quit()

if __name__ == "__main__":
    game = Game()
    game.run() 
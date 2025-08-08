# Cuadrado Seguidor del Cursor - Juego Adaptativo

Un juego simple donde controlas un cuadrado que sigue tu cursor o dedo, evitando obstáculos y recolectando puntos.

## Características

### 🎮 Gameplay
- **Control intuitivo**: El cuadrado sigue tu cursor (PC) o dedo (móvil)
- **Obstáculos dinámicos**: Evita los cuadrados rojos
- **Sistema de puntos**: Recolecta los círculos verdes para ganar puntos
- **Detección de colisiones**: Juego termina al tocar un obstáculo

### 📱 Adaptabilidad Multiplataforma
- **Detección automática de dispositivo**: Se adapta automáticamente entre móvil y PC
- **Tamaños optimizados**: 
  - **Móvil**: Cuadrado jugador más grande (25px), velocidad moderada (4)
  - **PC**: Cuadrado jugador estándar (20px), velocidad normal (3)
- **Cantidad de elementos balanceada**:
  - **Móvil**: 8 obstáculos, 5 puntos
  - **PC**: 12 obstáculos, 8 puntos
- **Interfaz responsiva**: Se ajusta a cualquier tamaño de pantalla

### 🎯 Mejoras Implementadas
- **Tamaños fijos**: Eliminados los cálculos porcentuales que causaban objetos muy grandes en PCs
- **Velocidades apropiadas**: Diferentes velocidades según el dispositivo
- **Mejor experiencia móvil**: Controles táctiles optimizados
- **Indicador de modo**: Muestra si está en modo móvil o PC
- **Interfaz mejorada**: Efectos de blur y mejor legibilidad

## Cómo Jugar

### En PC:
1. Haz clic y arrastra el mouse para mover el cuadrado
2. Evita los obstáculos rojos
3. Recolecta los puntos verdes

### En Móvil:
1. Toca y arrastra tu dedo por la pantalla
2. El cuadrado seguirá tu dedo
3. Evita los obstáculos rojos
4. Recolecta los puntos verdes

## Instalación

1. Descarga todos los archivos
2. Abre `index.html` en tu navegador
3. ¡Disfruta del juego!

## Compatibilidad

- ✅ Navegadores modernos (Chrome, Firefox, Safari, Edge)
- ✅ Dispositivos móviles (Android, iOS)
- ✅ Tablets
- ✅ PCs de escritorio

## Tecnologías

- HTML5 Canvas
- JavaScript ES6+
- CSS3 con media queries
- Detección de dispositivos móviles

## Versión

v2.0 - Versión adaptativa multiplataforma 
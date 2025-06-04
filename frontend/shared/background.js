// Инициализация canvas для анимации шариков
document.addEventListener('DOMContentLoaded', function() {
  const canvas = document.getElementById('backgroundCanvas');
  if (!canvas) {
    console.error('Canvas элемент не найден!');
    return;
  }
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    console.error('Canvas context не найден!');
    return;
  }

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  class Ball {
    constructor() {
      this.reset();
    }

    getPastelColor() {
      const pastelColors = [
        [255, 209, 220], // розовый
        [208, 242, 255], // голубой
        [219, 255, 208], // зеленый
        [255, 236, 208], // оранжевый
        [236, 208, 255], // фиолетовый
        [255, 255, 208], // желтый
        [208, 255, 249], // бирюзовый
      ];
      const [r, g, b] = pastelColors[Math.floor(Math.random() * pastelColors.length)];
      this.baseColor = [r, g, b];
      return this.getColorWithOpacity(this.opacity);
    }

    getColorWithOpacity(opacity) {
      if (!this.baseColor) return `rgba(220,220,220,${opacity})`;
      return `rgba(${this.baseColor[0]},${this.baseColor[1]},${this.baseColor[2]},${opacity})`;
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 6 + 2;
      this.speedX = (Math.random() - 0.5) * 2;
      this.speedY = (Math.random() - 0.5) * 2;
      this.opacity = Math.random() * 0.4 + 0.2;
      this.originalOpacity = this.opacity;
      this.fadeDirection = Math.random() > 0.5 ? 0.001 : -0.001;
      this.getPastelColor();
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
      if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
      if (this.x < -50 || this.x > canvas.width + 50 || this.y < -50 || this.y > canvas.height + 50) {
        this.reset();
      }
      this.opacity += this.fadeDirection;
      if (this.opacity <= this.originalOpacity - 0.2 || this.opacity >= this.originalOpacity + 0.2) {
        this.fadeDirection *= -1;
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.getColorWithOpacity(this.opacity);
      ctx.fill();
    }
  }

  const balls = Array(75).fill().map(() => new Ball());

  function animate() {
    ctx.fillStyle = 'rgba(248, 255, 255, 0.08)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    balls.forEach(ball => {
      ball.update();
      ball.draw();
    });
    requestAnimationFrame(animate);
  }
  animate();
}); 
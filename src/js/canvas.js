export function initSpaceBackground() {
  const canvas = document.getElementById('space-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let animationId;
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  // Configuration
  const STAR_COUNT = 150;
  const SPEED = 0.5;
  const CONNECT_DISTANCE = 110;
  
  const stars = [];
  const mouse = { x: null, y: null, radius: 150 };

  // Star Class
  class Star {
    constructor() {
      this.reset(true);
    }

    reset(init = false) {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.z = init ? Math.random() * width : width; // Depth
      
      this.size = Math.random() * 1.5 + 0.5;
      
      // Speed components
      this.vx = (Math.random() - 0.5) * SPEED;
      this.vy = (Math.random() - 0.5) * SPEED;
      
      // Color
      // 80% white/yellowish, 20% gold/orange/blue
      const rand = Math.random();
      if (rand > 0.9) {
        this.color = 'rgba(255, 215, 0, ' + (Math.random() * 0.7 + 0.3) + ')'; // Gold
      } else if (rand > 0.8) {
        this.color = 'rgba(100, 149, 237, ' + (Math.random() * 0.7 + 0.3) + ')'; // Cosmic Blue
      } else {
        this.color = 'rgba(255, 255, 255, ' + (Math.random() * 0.8 + 0.2) + ')'; // White
      }
      
      // Pulse effect
      this.pulseSpeed = Math.random() * 0.03 + 0.01;
      this.opacity = Math.random();
      this.increasing = Math.random() > 0.5;
    }

    update() {
      // Movement
      this.x += this.vx;
      this.y += this.vy;
      
      // Pulse brightness
      if (this.increasing) {
        this.opacity += this.pulseSpeed;
        if (this.opacity >= 1) this.increasing = false;
      } else {
        this.opacity -= this.pulseSpeed;
        if (this.opacity <= 0.2) this.increasing = true;
      }

      // Border checks
      if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
        this.reset(false);
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color.replace(/[\d\.]+\)$/, `${this.opacity})`);
      ctx.shadowBlur = this.size * 2;
      ctx.shadowColor = this.color;
      ctx.fill();
      ctx.shadowBlur = 0; // Reset shadow for performance
    }
  }

  // Shooting Star Class
  class ShootingStar {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * (height * 0.5);
      this.length = Math.random() * 80 + 50;
      this.speed = Math.random() * 15 + 10;
      this.dx = -(Math.random() * 4 + 2); // diagonal movement
      this.dy = Math.random() * 2 + 1;
      this.active = false;
      this.delay = Math.random() * 600; // frames before appearing
    }

    update() {
      if (!this.active) {
        this.delay--;
        if (this.delay <= 0) {
          this.active = true;
        }
        return;
      }

      this.x += this.dx * this.speed;
      this.y += this.dy * this.speed;

      if (this.x < -100 || this.y > height + 100) {
        this.reset();
      }
    }

    draw() {
      if (!this.active) return;
      
      const grad = ctx.createLinearGradient(this.x, this.y, this.x - this.dx * this.length, this.y - this.dy * this.length);
      grad.addColorStop(0, 'rgba(255, 223, 115, 0.9)'); // Gold tail head
      grad.addColorStop(0.3, 'rgba(255, 215, 0, 0.4)');
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      
      ctx.beginPath();
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.5;
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(this.x - this.dx * this.length, this.y - this.dy * this.length);
      ctx.stroke();
    }
  }

  // Initialize arrays
  for (let i = 0; i < STAR_COUNT; i++) {
    stars.push(new Star());
  }

  const shootingStars = [new ShootingStar(), new ShootingStar()];

  // Track mouse movement (optional parallax or tracing)
  window.addEventListener('mousemove', (e) => {
    // Convert coordinate to window scale
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  // Handle Resize
  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    stars.length = 0;
    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push(new Star());
    }
  });

  // Main Loop
  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Draw nebulas (optional styling via canvas grad or let CSS do it)
    // Draw and update stars
    for (let i = 0; i < stars.length; i++) {
      stars[i].update();
      stars[i].draw();

      // Constellation lines: connect nearby stars
      for (let j = i + 1; j < stars.length; j++) {
        const dx = stars[i].x - stars[j].x;
        const dy = stars[i].y - stars[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < CONNECT_DISTANCE) {
          const alpha = (1 - dist / CONNECT_DISTANCE) * 0.13;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(255, 215, 0, ${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(stars[i].x, stars[i].y);
          ctx.lineTo(stars[j].x, stars[j].y);
          ctx.stroke();
        }
      }

      // Connect stars to mouse if mouse is nearby
      if (mouse.x !== null) {
        const dx = stars[i].x - mouse.x;
        const dy = stars[i].y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < mouse.radius) {
          const alpha = (1 - dist / mouse.radius) * 0.25;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(255, 223, 115, ${alpha})`;
          ctx.lineWidth = 0.7;
          ctx.moveTo(stars[i].x, stars[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }
    }

    // Draw shooting stars
    shootingStars.forEach(sStar => {
      sStar.update();
      sStar.draw();
    });

    animationId = requestAnimationFrame(animate);
  }

  // Start Loop
  animate();

  // Return clean-up handler
  return () => {
    cancelAnimationFrame(animationId);
  };
}

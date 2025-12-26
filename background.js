const canvas = document.getElementById('hextech-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let particles = [];

// Configuration
const particleCount = 80; // Fewer particles, but higher quality
const connectionDistance = 110;
const mouseDistance = 160;

// Mouse tracker
let mouse = {
    x: null,
    y: null,
    radius: mouseDistance
};

window.addEventListener('mousemove', (event) => {
    mouse.x = event.x;
    mouse.y = event.y;
});

window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
});

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}

// THE QUANTUM PARTICLE
class Particle {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.5; // Slower, smoother movement
        this.vy = (Math.random() - 0.5) * 0.5;
        this.baseSize = Math.random() * 2 + 1;
        this.size = this.baseSize;
        this.color = Math.random() > 0.5 ? '#00f0ff' : '#9d00ff'; // Blue or Purple
        
        // Quantum Features
        this.hasRing = Math.random() > 0.8; // 20% chance to have an orbital ring
        this.angle = Math.random() * Math.PI * 2; // For ring rotation
        this.pulseSpeed = 0.05 + Math.random() * 0.05; // How fast it breathes
        this.pulseAngle = 0; // Current breath state
    }

    update() {
        // 1. Movement
        this.x += this.vx;
        this.y += this.vy;

        // 2. Pulse Effect (Breathing size)
        this.pulseAngle += this.pulseSpeed;
        this.size = this.baseSize + Math.sin(this.pulseAngle) * 0.5;

        // 3. Ring Rotation
        this.angle += 0.02;

        // 4. Edge Bouncing
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // 5. MOUSE INTERACTION
        if (mouse.x != null) {
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < mouse.radius) {
                // "Supercharge" Jitter: If very close, shake randomly
                if (distance < 50) {
                    this.x += (Math.random() - 0.5) * 2;
                    this.y += (Math.random() - 0.5) * 2;
                }

                // Repel Force (Push away)
                const forceDirectionX = dx / distance;
                const forceDirectionY = dy / distance;
                const force = (mouse.radius - distance) / mouse.radius;
                const directionX = forceDirectionX * force * 3;
                const directionY = forceDirectionY * force * 3;

                this.x -= directionX;
                this.y -= directionY;
            }
        }
    }

    draw() {
        ctx.beginPath();
        // Check if mouse is close for "Supercharge" color (Bright White/Gold)
        let isSupercharged = false;
        if (mouse.x != null) {
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            if (Math.sqrt(dx*dx + dy*dy) < 60) isSupercharged = true;
        }

        ctx.fillStyle = isSupercharged ? '#ffffff' : this.color;
        
        // Draw Core
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.shadowBlur = isSupercharged ? 20 : 10; // Extra glow if charged
        ctx.shadowColor = this.color;
        ctx.fill();

        // Draw Quantum Ring (if this particle has one)
        if (this.hasRing) {
            ctx.beginPath();
            ctx.strokeStyle = isSupercharged ? '#c8aa6e' : this.color; // Gold ring if charged
            ctx.lineWidth = 0.5;
            ctx.ellipse(this.x, this.y, this.size * 3, this.size * 3, this.angle, 0, Math.PI * 2);
            ctx.stroke();
        }
    }
}

function init() {
    resize();
    particles = [];
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
}

function animate() {
    ctx.clearRect(0, 0, width, height);
    
    // Background Gradient (Deep Zaun/Piltover Night)
    let gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#05070a');
    gradient.addColorStop(1, '#101420');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Update particles
    particles.forEach((p, index) => {
        p.update();
        p.draw();

        // CONNECTING LINES
        // 1. Particle to Particle (Constellations)
        for (let j = index + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const dx = p.x - p2.x;
            const dy = p.y - p2.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < connectionDistance) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(0, 240, 255, ${0.2 * (1 - distance / connectionDistance)})`; // Faint blue
                ctx.lineWidth = 0.5;
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
            }
        }

        // 2. Mouse Connections (The Gold Thread)
        if (mouse.x != null) {
            let dx = mouse.x - p.x;
            let dy = mouse.y - p.y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < mouse.radius) {
                ctx.beginPath();
                // Gold color that fades out
                ctx.strokeStyle = `rgba(200, 170, 110, ${1 - distance / mouse.radius})`; 
                ctx.lineWidth = 1.5; // Slightly thicker
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(mouse.x, mouse.y);
                ctx.stroke();
            }
        }
    });

    requestAnimationFrame(animate);
}

window.addEventListener('resize', () => {
    resize();
    init();
});

init();
animate();

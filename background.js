const canvas = document.getElementById('hextech-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let particles = [];

// Configuration for the magic dust
const particleCount = 100; // Total number of floating particles
const connectionDistance = 100; // How close particles must be to connect
const mouseDistance = 150; // How close the mouse must be to interact

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

// Reset mouse when leaving window so lines don't get stuck
window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
});

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}

// Particle Class (The 3D Dots)
class Particle {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 1; // Velocity X
        this.vy = (Math.random() - 0.5) * 1; // Velocity Y
        this.size = Math.random() * 2 + 1;
        // Randomly choose between Hextech Blue and Shimmer Purple
        this.color = Math.random() > 0.5 ? '#00f0ff' : '#9d00ff';
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce off edges
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // Mouse Interaction (The "Magic" Push)
        // If mouse is active and close, gently push particle away
        if (mouse.x != null) {
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < mouse.radius) {
                const forceDirectionX = dx / distance;
                const forceDirectionY = dy / distance;
                const force = (mouse.radius - distance) / mouse.radius;
                const directionX = forceDirectionX * force * 3; // Push strength
                const directionY = forceDirectionY * force * 3;

                this.x -= directionX;
                this.y -= directionY;
            }
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        ctx.fill();
    }
}

function init() {
    resize();
    particles = []; // Clear array
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
}

function animate() {
    ctx.clearRect(0, 0, width, height);
    
    // Create a dark gradient background each frame
    let gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#05070a');
    gradient.addColorStop(1, '#101420');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Update and draw particles
    particles.forEach((p, index) => {
        p.update();
        p.draw();

        // 1. Draw lines between particles (Constellations)
        for (let j = index + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const dx = p.x - p2.x;
            const dy = p.y - p2.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < connectionDistance) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(0, 240, 255, ${1 - distance / connectionDistance})`; // Fading blue line
                ctx.lineWidth = 0.5;
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
            }
        }

        // 2. Draw lines to Mouse (Interaction)
        if (mouse.x != null) {
            let dx = mouse.x - p.x;
            let dy = mouse.y - p.y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < mouse.radius) {
                ctx.beginPath();
                // Makes the connection line bright Gold/Yellow when touching the mouse
                ctx.strokeStyle = `rgba(200, 170, 110, ${1 - distance / mouse.radius})`; 
                ctx.lineWidth = 1;
                ctx.moveTo(p

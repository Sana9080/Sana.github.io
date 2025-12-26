const canvas = document.getElementById('quantum-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let particles = [];

// QUANTUM CONFIG
const particleCount = 70; // High precision particles
const connectionDistance = 120;
const mouseDistance = 180;

let mouse = { x: null, y: null };

window.addEventListener('mousemove', e => {
    mouse.x = e.x;
    mouse.y = e.y;
});

window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
});

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}

class Particle {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.8;
        this.vy = (Math.random() - 0.5) * 0.8;
        this.size = Math.random() * 1.5 + 0.5; // Very small points (atoms)
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        // Wall bounce
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // MOUSE INTERACTION: The "Observer Effect"
        if (mouse.x != null) {
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx*dx + dy*dy);

            if (distance < mouseDistance) {
                // Gentle repulsion (Magnetic field)
                const forceDirectionX = dx / distance;
                const forceDirectionY = dy / distance;
                const force = (mouseDistance - distance) / mouseDistance;
                
                this.x -= forceDirectionX * force * 2;
                this.y -= forceDirectionY * force * 2;
            }
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = '#00f3ff'; // Cyan atomic color
        ctx.fill();
    }
}

function init() {
    resize();
    particles = [];
    for(let i=0; i<particleCount; i++) particles.push(new Particle());
}

function animate() {
    ctx.clearRect(0, 0, width, height);
    
    // Background is Pure Void
    ctx.fillStyle = '#020204';
    ctx.fillRect(0, 0, width, height);

    particles.forEach((p, index) => {
        p.update();
        p.draw();

        // QUANTUM ENTANGLEMENT (Lines)
        for (let j = index + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const dx = p.x - p2.x;
            const dy = p.y - p2.y;
            const distance = Math.sqrt(dx*dx + dy*dy);

            if (distance < connectionDistance) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(0, 243, 255, ${1 - distance / connectionDistance})`;
                ctx.lineWidth = 0.4; 
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
            }
        }
        
        // MOUSE DATA STREAM
        if (mouse.x != null) {
            let dx = mouse.x - p.x;
            let dy = mouse.y - p.y;
            let distance = Math.sqrt(dx*dx + dy*dy);

            if (distance < mouseDistance) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(255, 255, 255, ${0.8 * (1 - distance / mouseDistance)})`;
                ctx.lineWidth = 0.8;
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(mouse.x, mouse.y);
                ctx.stroke();
            }
        }
    });

    requestAnimationFrame(animate);
}

window.addEventListener('resize', () => { resize(); init(); });

init();
animate();

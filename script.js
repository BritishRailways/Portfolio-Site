// Animated wipe/typing effect for KaiBaisley.com
document.addEventListener('DOMContentLoaded', function() {
    const title = document.getElementById('site-title');
    if (!title) return;
    const fullText = 'KaiBaisley.com';
    let showing = true;
    function wipeOut(callback) {
        let i = fullText.length;
        function step() {
            if (i >= 0) {
                title.textContent = fullText.slice(0, i);
                i--;
                setTimeout(step, 40);
            } else {
                callback();
            }
        }
        step();
    }
    function typeIn(callback) {
        let i = 0;
        function step() {
            if (i <= fullText.length) {
                title.textContent = fullText.slice(0, i);
                i++;
                setTimeout(step, 60);
            } else {
                callback();
            }
        }
        step();
    }
    function animateLoop() {
        setTimeout(() => {
            wipeOut(() => {
                setTimeout(() => {
                    typeIn(() => {
                        animateLoop();
                    });
                }, 400);
            });
        }, 4000);
    }
    animateLoop();
});
// Gallery card click-to-show detail info
document.addEventListener('DOMContentLoaded', function() {
    const galleryCards = document.querySelectorAll('.gallery-card');
    galleryCards.forEach(card => {
        card.addEventListener('click', function() {
            // Hide detail info on all cards
            galleryCards.forEach(c => c.classList.remove('show-detail'));
            // Show detail info on clicked card
            card.classList.add('show-detail');
        });
        card.addEventListener('blur', function() {
            card.classList.remove('show-detail');
        });
    });
});
// Home Gallery Rotator (cycle through all images in /images, no repeats, with fade)
document.addEventListener('DOMContentLoaded', function() {
    const galleryImgs = document.querySelectorAll('.home-gallery .gallery-img');
    if (galleryImgs.length === 4) {
        // List of all images in /images (update this list if you add/remove images)
        const allImages = [
            "images/Weybourne.JPG",
            "images/Radio.jpg",
            "images/Porthmadog.JPG",
            "images/NLE626.JPG",
            "images/Linda.JPG",
            "images/Hear Sink.JPG",
            "images/Golf.jpg",
            "images/F24(H).JPG",
            "images/F24(C).JPG",
            "images/F&WHR.JPG",
            "images/EATM.JPG",
            "images/1858.jpg",
            "images/1201.JPG",
            "images/Arkwright-certificate.JPG",
            "images/NNR.JPG",
            "images/TFLR.jpg",
            "images/W&RR.jpg"
        ];
        // Start with 4 unique random images
        let current = [];
        function getUniqueImages(exclude) {
            let pool = allImages.filter(img => !exclude.includes(img));
            let result = [];
            for (let i = 0; i < 4; i++) {
                if (pool.length === 0) break;
                let idx = Math.floor(Math.random() * pool.length);
                result.push(pool[idx]);
                pool.splice(idx, 1);
            }
            return result;
        }
        current = getUniqueImages([]);
        for (let i = 0; i < 4; i++) {
            galleryImgs[i].src = current[i];
        }
        setInterval(() => {
            let next = getUniqueImages(current);
            for (let i = 0; i < 4; i++) {
                if (next[i]) {
                    // Fade out
                    galleryImgs[i].classList.add('fade-out');
                    setTimeout(() => {
                        galleryImgs[i].src = next[i];
                        galleryImgs[i].classList.remove('fade-out');
                        galleryImgs[i].classList.add('fade-in');
                        setTimeout(() => {
                            galleryImgs[i].classList.remove('fade-in');
                        }, 700);
                    }, 700);
                }
            }
            current = next;
        }, 12000);
    }
});
// Interactive Particle Network Background
const canvas = document.getElementById('bg-particles');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;
    let particles = [];
    const PARTICLE_COUNT = 80;
    const PARTICLE_RADIUS = 10;
    const LINE_DIST = 250;
    const MOUSE_RADIUS = 120;
    let mouse = { x: null, y: null };

    function resizeCanvas() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    function randomVel() {
        return (Math.random() - 0.5) * 1.2;
    }

    function createParticles() {
        particles = [];
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: randomVel(),
                vy: randomVel(),
            });
        }
    }
    createParticles();

    function drawParticles() {
        ctx.clearRect(0, 0, width, height);
        // Draw lines
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < LINE_DIST) {
                    ctx.save();
                    ctx.globalAlpha = 1 - dist / LINE_DIST;
                    ctx.strokeStyle = '#4e5d94';
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                    ctx.restore();
                }
            }
        }
        // Draw particles
        for (let p of particles) {
            ctx.save();
            ctx.beginPath();
            ctx.arc(p.x, p.y, PARTICLE_RADIUS, 0, Math.PI * 2);
            ctx.fillStyle = '#b0b8e6';
            ctx.shadowColor = '#4e5d94';
            ctx.shadowBlur = 8;
            ctx.globalAlpha = 0.85;
            ctx.fill();
            ctx.restore();
        }
    }

    function updateParticles() {
        for (let p of particles) {
            // Move
            p.x += p.vx;
            p.y += p.vy;
            // Bounce off edges
            if (p.x < PARTICLE_RADIUS || p.x > width - PARTICLE_RADIUS) p.vx *= -1;
            if (p.y < PARTICLE_RADIUS || p.y > height - PARTICLE_RADIUS) p.vy *= -1;
            // Mouse interaction
            if (mouse.x !== null && mouse.y !== null) {
                const dx = p.x - mouse.x;
                const dy = p.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < MOUSE_RADIUS) {
                    // Push away from mouse
                    const angle = Math.atan2(dy, dx);
                    const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS * 2.5;
                    p.vx += Math.cos(angle) * force * 0.08;
                    p.vy += Math.sin(angle) * force * 0.08;
                }
            }
            // Limit speed
            p.vx = Math.max(Math.min(p.vx, 2), -2);
            p.vy = Math.max(Math.min(p.vy, 2), -2);
        }
    }

    canvas.addEventListener('mousemove', function(e) {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });
    canvas.addEventListener('mouseleave', function() {
        mouse.x = null;
        mouse.y = null;
    });

    function animate() {
        updateParticles();
        drawParticles();
        requestAnimationFrame(animate);
    }
    animate();
}

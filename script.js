// Split-flap style title effect for KaiBaisley.com.
document.addEventListener('DOMContentLoaded', function() {
    const title = document.getElementById('site-title');
    if (!title) return;

    const fullText = 'KaiBaisley.com';
    title.classList.add('splitflap-title');
    title.setAttribute('aria-label', fullText);
    title.textContent = '';

    const scrambleChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const chars = [];

    function createFace(className, ch) {
        const face = document.createElement('span');
        face.className = className;
        const text = document.createElement('span');
        text.className = 'splitflap-text';
        text.textContent = ch === ' ' ? '\u00A0' : ch;
        face.appendChild(text);
        return face;
    }

    for (const ch of fullText) {
        const cell = document.createElement('span');
        cell.className = 'splitflap-char';
        cell.dataset.char = ch;
        cell.dataset.display = ch;

        const top = createFace('splitflap-top', ch);
        const bottom = createFace('splitflap-bottom', ch);
        const flipTop = createFace('splitflap-flip-top', ch);
        const flipBottom = createFace('splitflap-flip-bottom', ch);

        cell.appendChild(top);
        cell.appendChild(bottom);
        cell.appendChild(flipTop);
        cell.appendChild(flipBottom);

        title.appendChild(cell);
        chars.push(cell);
    }

    let isAnimating = false;

    function setFaceChars(cell, ch) {
        const visible = ch === ' ' ? '\u00A0' : ch;
        cell.querySelector('.splitflap-top .splitflap-text').textContent = visible;
        cell.querySelector('.splitflap-bottom .splitflap-text').textContent = visible;
        cell.dataset.display = ch;
    }

    function randomScrambleChar() {
        const idx = Math.floor(Math.random() * scrambleChars.length);
        return scrambleChars[idx];
    }

    function flipToChar(cell, nextChar, delay) {
        setTimeout(() => {
            const current = cell.dataset.display || ' ';
            const flipTopText = cell.querySelector('.splitflap-flip-top .splitflap-text');
            const flipBottomText = cell.querySelector('.splitflap-flip-bottom .splitflap-text');

            flipTopText.textContent = current === ' ' ? '\u00A0' : current;
            flipBottomText.textContent = nextChar === ' ' ? '\u00A0' : nextChar;

            cell.classList.remove('flipping');
            void cell.offsetWidth;
            cell.classList.add('flipping');

            setTimeout(() => {
                setFaceChars(cell, nextChar);
            }, 130);

            setTimeout(() => {
                cell.classList.remove('flipping');
            }, 290);
        }, delay);
    }

    function runSplitFlapCycle() {
        if (isAnimating) return;
        isAnimating = true;

        chars.forEach((cell, idx) => {
            const stepDelay = idx * 85;
            const originalChar = cell.dataset.char || ' ';

            for (let spin = 0; spin < 4; spin++) {
                flipToChar(cell, randomScrambleChar(), stepDelay + spin * 220);
            }

            flipToChar(cell, originalChar, stepDelay + 4 * 220);
        });

        const totalDuration = (chars.length - 1) * 85 + 4 * 220 + 520;
        setTimeout(() => {
            isAnimating = false;
        }, totalDuration);
    }

    setTimeout(() => {
        runSplitFlapCycle();
        setInterval(runSplitFlapCycle, 9000);
    }, 3200);
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

// Toggle sound for looped project videos.
document.addEventListener('DOMContentLoaded', function() {
    const videoBlocks = document.querySelectorAll('.project-video-wrap');
    videoBlocks.forEach(block => {
        const video = block.querySelector('video');
        const toggle = block.querySelector('.video-audio-toggle');
        if (!video || !toggle) return;

        function syncLabel() {
            const soundOn = !video.muted;
            toggle.textContent = soundOn ? 'Mute Sound' : 'Turn Sound On';
            toggle.setAttribute('aria-pressed', soundOn ? 'true' : 'false');
            toggle.setAttribute('aria-label', soundOn ? 'Mute sound' : 'Turn sound on');
            toggle.classList.toggle('sound-on', soundOn);
        }

        // Some browsers need JS-set flags plus an explicit play() call.
        video.autoplay = true;
        video.loop = true;
        video.playsInline = true;
        video.muted = true;
        video.setAttribute('muted', '');
        video.play().catch(() => {
            // If autoplay is blocked, user can still start playback by interaction.
        });
        syncLabel();

        toggle.addEventListener('click', function() {
            video.muted = !video.muted;
            if (!video.muted) {
                video.play().catch(() => {
                    video.muted = true;
                });
            }
            syncLabel();
        });
    });
});

// Improve mobile performance and iOS PDF compatibility.
document.addEventListener('DOMContentLoaded', function() {
    const allImgs = document.querySelectorAll('img');
    allImgs.forEach((img, idx) => {
        if (!img.hasAttribute('loading')) {
            img.setAttribute('loading', idx < 2 ? 'eager' : 'lazy');
        }
    });

    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
        || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    if (!isIOS) return;

    document.querySelectorAll('.pdf-embed').forEach(embed => {
        embed.style.display = 'none';
    });
    document.querySelectorAll('.pdf-ios-note').forEach(note => {
        note.style.display = 'block';
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

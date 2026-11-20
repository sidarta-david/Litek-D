/**
 * FAQ App — Premium Animations
 * Inspired by Antigravity-style immersive effects
 */

(function () {
    'use strict';

    /* ============================================
       LOADER SCREEN
       ============================================ */
    function initLoader() {
        const loader = document.createElement('div');
        loader.id = 'page-loader';
        loader.innerHTML = `
            <div class="loader-content">
                <div class="loader-rings">
                    <div class="ring r1"></div>
                    <div class="ring r2"></div>
                    <div class="ring r3"></div>
                    <span class="loader-icon">?</span>
                </div>
            </div>`;
        document.body.prepend(loader);

        window.addEventListener('load', () => {
            setTimeout(() => {
                loader.classList.add('loaded');
                setTimeout(() => loader.remove(), 600);
            }, 400);
        });
    }
    initLoader();

    /* ---- Boot everything after DOM ---- */
    document.addEventListener('DOMContentLoaded', () => {
        initAccordion();
        initSearch();
        initCategoryTabs();
        initGeometricParticles();
        initAnimatedWave();
        initScrollReveal();
        initParallax();
        initMouseGlow();
        initCursorTrail();
        initCountUp();
        initMagneticButtons();
        initRipple();
        initTiltCards();
        initScrollProgress();
        initFloatingDecorations();
        initSearchFocus();
    });

    /* ============================================
       ACCORDION (spring-physics feel)
       ============================================ */
    function initAccordion() {
        document.querySelectorAll('.faq-question').forEach(btn => {
            btn.addEventListener('click', () => {
                const item = btn.closest('.faq-item');
                const wasOpen = item.classList.contains('open');

                document.querySelectorAll('.faq-item.open').forEach(el => {
                    el.classList.remove('open');
                    const ans = el.querySelector('.faq-answer');
                    ans.style.maxHeight = '0px';
                });

                if (!wasOpen) {
                    item.classList.add('open');
                    const answer = item.querySelector('.faq-answer');
                    answer.style.maxHeight = answer.scrollHeight + 40 + 'px';
                }
            });
        });
    }

    /* ============================================
       SEARCH
       ============================================ */
    function initSearch() {
        const input = document.getElementById('searchInput');
        if (!input) return;
        let timer;
        input.addEventListener('input', () => {
            clearTimeout(timer);
            timer = setTimeout(filterFAQs, 180);
        });
    }

    function filterFAQs() {
        const q = document.getElementById('searchInput').value.toLowerCase().trim();
        const items = document.querySelectorAll('.faq-item');
        const noRes = document.getElementById('noResults');
        const wrap = document.querySelector('.faq-card-wrapper');
        const cat = document.querySelector('.category-tab.active')?.dataset.category || 'all';
        let n = 0;

        items.forEach(item => {
            const mS = !q || item.dataset.question.toLowerCase().includes(q) || item.dataset.answer.toLowerCase().includes(q);
            const mC = cat === 'all' || item.dataset.category === cat;
            if (mS && mC) {
                item.style.display = '';
                item.style.animation = `fadeSlideIn 0.4s ${n * 0.05}s cubic-bezier(.16,1,.3,1) both`;
                n++;
            } else {
                item.style.display = 'none';
                item.style.animation = '';
            }
        });
        if (noRes) noRes.style.display = n === 0 ? '' : 'none';
        if (wrap) wrap.style.display = n === 0 ? 'none' : '';
    }

    /* ============================================
       CATEGORY TABS
       ============================================ */
    function initCategoryTabs() {
        document.querySelectorAll('.category-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.category-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                filterFAQs();
            });
        });
    }

    /* ============================================
       GEOMETRIC PARTICLE SYSTEM (Premium)
       ============================================ */
    function initGeometricParticles() {
        const hero = document.querySelector('.hero');
        if (!hero) return;

        const canvas = document.createElement('canvas');
        canvas.classList.add('particle-canvas');
        hero.insertBefore(canvas, hero.firstChild);
        const ctx = canvas.getContext('2d');

        let W, H, particles = [], mouse = { x: -9999, y: -9999 }, raf;
        const COLORS = [
            'rgba(255,255,255,0.6)',
            'rgba(187,222,251,0.5)',
            'rgba(100,181,246,0.4)',
            'rgba(3,169,244,0.35)',
            'rgba(255,255,255,0.3)',
        ];

        function resize() {
            W = canvas.width = hero.offsetWidth;
            H = canvas.height = hero.offsetHeight;
        }

        class Particle {
            constructor() { this.init(); }

            init() {
                this.x = Math.random() * W;
                this.y = Math.random() * H;
                this.size = Math.random() * 5 + 1.5;
                this.baseSize = this.size;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.4 - 0.25;
                this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
                this.life = Math.random() * 400 + 250;
                this.maxLife = this.life;
                this.angle = Math.random() * Math.PI * 2;
                this.spin = (Math.random() - 0.5) * 0.03;
                this.shape = ['circle', 'ring', 'triangle', 'diamond', 'hexagon', 'plus', 'star'][Math.floor(Math.random() * 7)];
                this.pulsePhase = Math.random() * Math.PI * 2;
                this.wobbleAmp = Math.random() * 1.5 + 0.5;
                this.wobbleSpeed = Math.random() * 0.03 + 0.01;
            }

            update() {
                // Antigravity drift
                this.x += this.vx;
                this.y += this.vy;
                this.angle += this.spin;

                // Wobble
                this.x += Math.sin(this.life * this.wobbleSpeed) * this.wobbleAmp * 0.3;
                this.y += Math.cos(this.life * this.wobbleSpeed * 0.7) * this.wobbleAmp * 0.15;

                // Pulse size
                this.pulsePhase += 0.025;
                this.size = this.baseSize * (1 + Math.sin(this.pulsePhase) * 0.2);

                // Mouse interaction — attract gently then repel if too close
                const dx = this.x - mouse.x;
                const dy = this.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 160) {
                    const force = (160 - dist) / 160;
                    if (dist < 60) {
                        // Repel
                        this.x += (dx / dist) * force * 3;
                        this.y += (dy / dist) * force * 3;
                    } else {
                        // Orbit
                        this.x += (-dy / dist) * force * 0.8;
                        this.y += (dx / dist) * force * 0.8;
                    }
                }

                this.life--;
                if (this.life <= 0 || this.x < -30 || this.x > W + 30 || this.y < -30 || this.y > H + 30) {
                    this.init();
                }
            }

            getAlpha() {
                const r = this.life / this.maxLife;
                if (r > 0.9) return (1 - r) * 10;
                if (r < 0.1) return r * 10;
                return 1;
            }

            draw() {
                const a = this.getAlpha();
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(this.angle);
                ctx.globalAlpha = a * 0.7;
                ctx.fillStyle = this.color;
                ctx.strokeStyle = this.color;
                ctx.lineWidth = 0.8;
                const s = this.size;

                switch (this.shape) {
                    case 'circle':
                        ctx.beginPath();
                        ctx.arc(0, 0, s, 0, Math.PI * 2);
                        ctx.fill();
                        break;

                    case 'ring':
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.arc(0, 0, s * 1.5, 0, Math.PI * 2);
                        ctx.stroke();
                        break;

                    case 'triangle':
                        ctx.beginPath();
                        for (let i = 0; i < 3; i++) {
                            const ang = (i / 3) * Math.PI * 2 - Math.PI / 2;
                            ctx[i === 0 ? 'moveTo' : 'lineTo'](Math.cos(ang) * s * 1.4, Math.sin(ang) * s * 1.4);
                        }
                        ctx.closePath();
                        ctx.stroke();
                        break;

                    case 'diamond':
                        ctx.beginPath();
                        ctx.moveTo(0, -s * 1.6);
                        ctx.lineTo(s, 0);
                        ctx.lineTo(0, s * 1.6);
                        ctx.lineTo(-s, 0);
                        ctx.closePath();
                        ctx.stroke();
                        break;

                    case 'hexagon':
                        ctx.beginPath();
                        for (let i = 0; i < 6; i++) {
                            const ang = (i / 6) * Math.PI * 2;
                            ctx[i === 0 ? 'moveTo' : 'lineTo'](Math.cos(ang) * s * 1.3, Math.sin(ang) * s * 1.3);
                        }
                        ctx.closePath();
                        ctx.stroke();
                        break;

                    case 'plus':
                        ctx.lineWidth = 1.2;
                        ctx.beginPath();
                        ctx.moveTo(-s * 1.2, 0); ctx.lineTo(s * 1.2, 0);
                        ctx.moveTo(0, -s * 1.2); ctx.lineTo(0, s * 1.2);
                        ctx.stroke();
                        break;

                    case 'star':
                        ctx.beginPath();
                        for (let i = 0; i < 5; i++) {
                            const outerAng = (i / 5) * Math.PI * 2 - Math.PI / 2;
                            const innerAng = ((i + 0.5) / 5) * Math.PI * 2 - Math.PI / 2;
                            ctx.lineTo(Math.cos(outerAng) * s * 1.5, Math.sin(outerAng) * s * 1.5);
                            ctx.lineTo(Math.cos(innerAng) * s * 0.7, Math.sin(innerAng) * s * 0.7);
                        }
                        ctx.closePath();
                        ctx.stroke();
                        break;
                }
                ctx.restore();
            }
        }

        function drawConnections() {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const d = Math.sqrt(dx * dx + dy * dy);
                    if (d < 110) {
                        const alpha = (1 - d / 110) * 0.1;
                        ctx.save();
                        ctx.globalAlpha = alpha;
                        const grad = ctx.createLinearGradient(
                            particles[i].x, particles[i].y,
                            particles[j].x, particles[j].y
                        );
                        grad.addColorStop(0, 'rgba(255,255,255,0.8)');
                        grad.addColorStop(1, 'rgba(100,181,246,0.4)');
                        ctx.strokeStyle = grad;
                        ctx.lineWidth = 0.6;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                        ctx.restore();
                    }
                }
            }
        }

        // Mouse-proximity glow circle
        function drawMouseAura() {
            if (mouse.x < -100) return;
            const grad = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 140);
            grad.addColorStop(0, 'rgba(255,255,255,0.06)');
            grad.addColorStop(0.5, 'rgba(100,181,246,0.03)');
            grad.addColorStop(1, 'transparent');
            ctx.fillStyle = grad;
            ctx.fillRect(mouse.x - 140, mouse.y - 140, 280, 280);
        }

        function loop() {
            ctx.clearRect(0, 0, W, H);
            drawMouseAura();
            particles.forEach(p => { p.update(); p.draw(); });
            drawConnections();
            raf = requestAnimationFrame(loop);
        }

        function start() {
            resize();
            const count = Math.min(75, Math.floor(W * H / 9000));
            particles = Array.from({ length: count }, () => new Particle());
            if (raf) cancelAnimationFrame(raf);
            loop();
        }

        hero.addEventListener('mousemove', e => {
            const r = hero.getBoundingClientRect();
            mouse.x = e.clientX - r.left;
            mouse.y = e.clientY - r.top;
        });
        hero.addEventListener('mouseleave', () => { mouse.x = mouse.y = -9999; });

        let resizeTimer;
        window.addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(start, 200); });
        start();
    }

    /* ============================================
       ANIMATED WAVE SEPARATOR
       ============================================ */
    function initAnimatedWave() {
        const hero = document.querySelector('.hero');
        if (!hero) return;

        // Remove the CSS pseudo-element curve
        const waveSVG = document.createElement('div');
        waveSVG.classList.add('wave-separator');
        waveSVG.innerHTML = `
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path class="wave wave-back" fill="rgba(240,245,255,0.4)"
                d="M0,60 C360,120 720,0 1080,60 C1260,90 1380,80 1440,60 L1440,120 L0,120 Z"/>
            <path class="wave wave-mid" fill="rgba(240,245,255,0.6)"
                d="M0,80 C240,30 480,100 720,70 C960,40 1200,90 1440,60 L1440,120 L0,120 Z"/>
            <path class="wave wave-front" fill="#F0F5FF"
                d="M0,90 C180,60 360,100 540,80 C720,60 900,100 1080,80 C1260,60 1380,85 1440,75 L1440,120 L0,120 Z"/>
        </svg>`;
        hero.appendChild(waveSVG);

        // Animate waves
        function animateWaves() {
            const t = Date.now() * 0.001;
            const back = waveSVG.querySelector('.wave-back');
            const mid = waveSVG.querySelector('.wave-mid');
            const front = waveSVG.querySelector('.wave-front');

            if (back) {
                const y1 = 55 + Math.sin(t * 0.5) * 10;
                const y2 = 60 + Math.cos(t * 0.4) * 12;
                back.setAttribute('d', `M0,${y1} C360,${y1 + 50} 720,${y1 - 40} 1080,${y2} C1260,${y2 + 20} 1380,${y2 + 10} 1440,${y2 - 5} L1440,120 L0,120 Z`);
            }
            if (mid) {
                const y1 = 75 + Math.sin(t * 0.6 + 1) * 8;
                const y2 = 65 + Math.cos(t * 0.5 + 2) * 10;
                mid.setAttribute('d', `M0,${y1} C240,${y1 - 30} 480,${y1 + 20} 720,${y2} C960,${y2 - 20} 1200,${y2 + 25} 1440,${y2 - 10} L1440,120 L0,120 Z`);
            }
            if (front) {
                const y1 = 88 + Math.sin(t * 0.7 + 2) * 6;
                const y2 = 78 + Math.cos(t * 0.55 + 1) * 7;
                front.setAttribute('d', `M0,${y1} C180,${y1 - 20} 360,${y1 + 10} 540,${y2} C720,${y2 - 15} 900,${y2 + 15} 1080,${y2 - 5} C1260,${y2 - 15} 1380,${y2} 1440,${y2 - 8} L1440,120 L0,120 Z`);
            }
            requestAnimationFrame(animateWaves);
        }
        animateWaves();
    }

    /* ============================================
       SCROLL REVEAL (staggered)
       ============================================ */
    function initScrollReveal() {
        const els = document.querySelectorAll('.faq-item, .stats-bar, .category-tabs, .faq-card-wrapper, .admin-card');
        if (!('IntersectionObserver' in window)) {
            els.forEach(el => el.classList.add('revealed'));
            return;
        }

        const obs = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const idx = el.closest('.faq-list')
                        ? Array.from(el.parentNode.children).indexOf(el) : 0;
                    setTimeout(() => el.classList.add('revealed'), idx * 70);
                    obs.unobserve(el);
                }
            });
        }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

        els.forEach(el => { el.classList.add('reveal-on-scroll'); obs.observe(el); });
    }

    /* ============================================
       PARALLAX
       ============================================ */
    function initParallax() {
        const hero = document.querySelector('.hero');
        if (!hero) return;
        const h1 = hero.querySelector('h1');
        const p = hero.querySelector('p');
        const sb = hero.querySelector('.search-box');
        let tick = false;

        window.addEventListener('scroll', () => {
            if (!tick) {
                requestAnimationFrame(() => {
                    const y = window.scrollY;
                    const hH = hero.offsetHeight;
                    if (y < hH) {
                        const r = y / hH;
                        if (h1) { h1.style.transform = `translateY(${y * 0.35}px) scale(${1 - r * 0.08})`; h1.style.opacity = 1 - r * 1.3; }
                        if (p) { p.style.transform = `translateY(${y * 0.22}px)`; p.style.opacity = 1 - r * 1.6; }
                        if (sb) { sb.style.transform = `translateY(${y * 0.12}px)`; sb.style.opacity = 1 - r * 0.9; }
                    }
                    tick = false;
                });
                tick = true;
            }
        });
    }

    /* ============================================
       MOUSE GLOW ON HERO
       ============================================ */
    function initMouseGlow() {
        const hero = document.querySelector('.hero');
        if (!hero) return;
        const glow = document.createElement('div');
        glow.classList.add('mouse-glow');
        hero.appendChild(glow);

        let targetX = -500, targetY = -500, curX = -500, curY = -500;

        hero.addEventListener('mousemove', e => {
            const r = hero.getBoundingClientRect();
            targetX = e.clientX - r.left;
            targetY = e.clientY - r.top;
            glow.style.opacity = '1';
        });
        hero.addEventListener('mouseleave', () => { glow.style.opacity = '0'; });

        (function glowLoop() {
            curX += (targetX - curX) * 0.08;
            curY += (targetY - curY) * 0.08;
            glow.style.left = curX + 'px';
            glow.style.top = curY + 'px';
            requestAnimationFrame(glowLoop);
        })();
    }

    /* ============================================
       CURSOR TRAIL
       ============================================ */
    function initCursorTrail() {
        if (window.innerWidth < 768) return;

        const DOTS = 12;
        const dots = [];
        let mx = -100, my = -100;

        for (let i = 0; i < DOTS; i++) {
            const d = document.createElement('div');
            d.classList.add('cursor-dot');
            d.style.width = d.style.height = (DOTS - i) * 1.2 + 2 + 'px';
            d.style.opacity = (1 - i / DOTS) * 0.5;
            document.body.appendChild(d);
            dots.push({ el: d, x: -100, y: -100 });
        }

        document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

        (function trailLoop() {
            let px = mx, py = my;
            dots.forEach((dot, i) => {
                dot.x += (px - dot.x) * (0.35 - i * 0.02);
                dot.y += (py - dot.y) * (0.35 - i * 0.02);
                dot.el.style.transform = `translate(${dot.x}px, ${dot.y}px)`;
                px = dot.x;
                py = dot.y;
            });
            requestAnimationFrame(trailLoop);
        })();
    }

    /* ============================================
       COUNT-UP
       ============================================ */
    function initCountUp() {
        const stats = document.querySelectorAll('.stat-item strong');
        if (!stats.length) return;

        const obs = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const target = parseInt(el.textContent, 10);
                    if (isNaN(target)) return;
                    let cur = 0;
                    const step = Math.max(1, target / 50);
                    el.textContent = '0';
                    (function count() {
                        cur += step;
                        if (cur >= target) { el.textContent = target; }
                        else { el.textContent = Math.floor(cur); requestAnimationFrame(count); }
                    })();
                    obs.unobserve(el);
                }
            });
        }, { threshold: 0.5 });

        stats.forEach(s => obs.observe(s));
    }

    /* ============================================
       MAGNETIC BUTTONS
       ============================================ */
    function initMagneticButtons() {
        if (window.innerWidth < 768) return;

        document.querySelectorAll('.btn, .category-tab').forEach(btn => {
            btn.addEventListener('mousemove', e => {
                const r = btn.getBoundingClientRect();
                const x = e.clientX - r.left - r.width / 2;
                const y = e.clientY - r.top - r.height / 2;
                btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px) scale(1.03)`;
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = '';
                btn.style.transition = 'transform 0.4s cubic-bezier(.16,1,.3,1)';
                setTimeout(() => { btn.style.transition = ''; }, 400);
            });
        });
    }

    /* ============================================
       RIPPLE EFFECT
       ============================================ */
    function initRipple() {
        document.addEventListener('click', e => {
            const tgt = e.target.closest('.btn, .category-tab, .faq-question');
            if (!tgt) return;
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            const rect = tgt.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height) * 2.5;
            Object.assign(ripple.style, {
                width: size + 'px', height: size + 'px',
                left: (e.clientX - rect.left - size / 2) + 'px',
                top: (e.clientY - rect.top - size / 2) + 'px',
            });
            tgt.style.position = 'relative';
            tgt.style.overflow = 'hidden';
            tgt.appendChild(ripple);
            ripple.addEventListener('animationend', () => ripple.remove());
        });
    }

    /* ============================================
       3D TILT ON FAQ WRAPPER
       ============================================ */
    function initTiltCards() {
        const wrapper = document.querySelector('.faq-card-wrapper');
        if (!wrapper || window.innerWidth < 768) return;

        wrapper.addEventListener('mousemove', e => {
            const r = wrapper.getBoundingClientRect();
            const x = (e.clientX - r.left) / r.width - 0.5;
            const y = (e.clientY - r.top) / r.height - 0.5;
            wrapper.style.transition = 'transform 0.08s ease';
            wrapper.style.transform = `perspective(1400px) rotateX(${-y * 2}deg) rotateY(${x * 2}deg) scale3d(1.005,1.005,1)`;
        });
        wrapper.addEventListener('mouseleave', () => {
            wrapper.style.transition = 'transform 0.6s cubic-bezier(.16,1,.3,1)';
            wrapper.style.transform = '';
        });
    }

    /* ============================================
       SCROLL PROGRESS BAR
       ============================================ */
    function initScrollProgress() {
        const bar = document.createElement('div');
        bar.classList.add('scroll-progress');
        document.body.appendChild(bar);

        window.addEventListener('scroll', () => {
            const h = document.documentElement.scrollHeight - window.innerHeight;
            const pct = h > 0 ? (window.scrollY / h) * 100 : 0;
            bar.style.width = pct + '%';
        });
    }

    /* ============================================
       FLOATING DECORATIONS
       ============================================ */
    function initFloatingDecorations() {
        const container = document.querySelector('.container');
        if (!container) return;

        const deco = document.createElement('div');
        deco.classList.add('floating-decorations');
        deco.setAttribute('aria-hidden', 'true');

        const shapes = ['◇', '○', '△', '□', '⬡', '✦'];
        for (let i = 0; i < 8; i++) {
            const s = document.createElement('span');
            s.classList.add('float-shape');
            s.textContent = shapes[i % shapes.length];
            s.style.left = Math.random() * 100 + '%';
            s.style.animationDelay = Math.random() * 6 + 's';
            s.style.animationDuration = (8 + Math.random() * 6) + 's';
            s.style.fontSize = (12 + Math.random() * 14) + 'px';
            deco.appendChild(s);
        }
        container.prepend(deco);
    }

    /* ============================================
       SEARCH INPUT FOCUS EFFECTS
       ============================================ */
    function initSearchFocus() {
        const input = document.getElementById('searchInput');
        if (!input) return;
        const box = input.closest('.search-box');

        input.addEventListener('focus', () => box?.classList.add('focused'));
        input.addEventListener('blur', () => box?.classList.remove('focused'));
    }

})();

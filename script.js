// ============================================================
// THEME TOGGLE (light / dark) — with localStorage
// ============================================================
(function initThemeToggle() {
    const toggle = document.getElementById('themeToggle');
    const root = document.body;

    const saved = localStorage.getItem('theme');
    if (saved === 'light') {
        root.classList.add('light-mode');
    } else if (saved === 'dark') {
        root.classList.remove('light-mode');
    } else {
        if (window.matchMedia('(prefers-color-scheme: light)').matches) {
            root.classList.add('light-mode');
        }
    }

    if (toggle) {
        toggle.addEventListener('click', () => {
            root.classList.toggle('light-mode');
            const isLight = root.classList.contains('light-mode');
            localStorage.setItem('theme', isLight ? 'light' : 'dark');

            if (typeof window.runScrollChecks === 'function') {
                window.runScrollChecks();
            }
        });
    }
})();

// ============================================================
// MILKY WAY STARFIELD
// ============================================================
(function initMilkyWay() {
    const farLayer = document.getElementById('starsFar');
    const midLayer = document.getElementById('starsMid');
    const nearLayer = document.getElementById('starsNear');
    if (!farLayer || !midLayer || !nearLayer) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function generateStars(layer, count, minSize, maxSize, brightness) {
        const stars = [];
        for (let i = 0; i < count; i++) {
            const size = (minSize + Math.random() * (maxSize - minSize)).toFixed(2);
            const x = (Math.random() * 100).toFixed(3);
            const y = (Math.random() * 100).toFixed(3);
            const opacity = (0.3 + Math.random() * 0.7) * brightness;
            const twinkleDur = (2 + Math.random() * 4).toFixed(2);
            const twinkleDelay = (Math.random() * 5).toFixed(2);
            const glow = size > 1.5 ? `0 0 ${size * 3}px rgba(255, 255, 255, 0.8)` : 'none';

            stars.push(
                `<div class="mw-star" style="
                    position: absolute;
                    left: ${x}%;
                    top: ${y}%;
                    width: ${size}px;
                    height: ${size}px;
                    background: #ffffff;
                    border-radius: 50%;
                    opacity: ${opacity};
                    box-shadow: ${glow};
                    ${reduceMotion ? '' : `animation: starTwinkle ${twinkleDur}s ease-in-out ${twinkleDelay}s infinite;`}
                "></div>`
            );
        }
        layer.innerHTML = stars.join('');
    }

    generateStars(farLayer, 220, 0.5, 1.2, 0.6);
    generateStars(midLayer, 120, 1, 2, 0.85);
    generateStars(nearLayer, 60, 1.5, 2.8, 1);
})();

// ============================================================
// CUSTOM CURSOR + GLITTER
// ============================================================
(function initCursor() {
    const dot = document.getElementById('cursorDot');
    const ring = document.getElementById('cursorRing');
    const glitterLayer = document.getElementById('glitterLayer');
    if (!dot || !ring || !glitterLayer) return;

    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isMobile || reduceMotion) return;

    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;
    let lastGlitterTime = 0;

    const glitterChars = ['✦', '✧', '✩', '★', '❋', '✺', '✹', '✨', '⋆'];
    const glitterColors = ['#ffffff', '#e8e8ee', '#c0c0c8', '#8a8a92', '#fafafa'];

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        dot.style.left = mouseX + 'px';
        dot.style.top = mouseY + 'px';
        dot.classList.add('visible');
        ring.classList.add('visible');

        const now = performance.now();
        if (now - lastGlitterTime > 40) {
            spawnGlitter(mouseX, mouseY);
            lastGlitterTime = now;
        }
    });

    document.addEventListener('mouseleave', () => {
        dot.classList.remove('visible');
        ring.classList.remove('visible');
    });

    function tick() {
        ringX += (mouseX - ringX) * 0.18;
        ringY += (mouseY - ringY) * 0.18;
        ring.style.left = ringX + 'px';
        ring.style.top = ringY + 'px';
        requestAnimationFrame(tick);
    }
    tick();

    function spawnGlitter(x, y) {
        const star = document.createElement('div');
        star.className = 'glitter-star';
        star.textContent = glitterChars[Math.floor(Math.random() * glitterChars.length)];

        const color = glitterColors[Math.floor(Math.random() * glitterColors.length)];
        const size = 8 + Math.random() * 14;
        const duration = 0.8 + Math.random() * 0.8;
        const offsetX = (Math.random() - 0.5) * 24;
        const offsetY = (Math.random() - 0.5) * 24;

        star.style.left = (x + offsetX) + 'px';
        star.style.top = (y + offsetY) + 'px';
        star.style.fontSize = size + 'px';
        star.style.color = color;
        star.style.animationDuration = duration + 's';
        star.style.filter = `drop-shadow(0 0 6px ${color}) drop-shadow(0 0 12px ${color})`;

        glitterLayer.appendChild(star);
        setTimeout(() => star.remove(), duration * 1000 + 100);
    }

    const interactiveEls = document.querySelectorAll('a, button, .gallery-thumb, .gallery-main, .subjects-toggle, .stat-card, .project-card, .btn-glass, .cv-btn, .tech-tile, .cert-card, .power-toggle, .cert-learn-toggle, .theme-toggle');
    interactiveEls.forEach(el => {
        el.addEventListener('mouseenter', () => ring.classList.add('hover'));
        el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
    });
})();

// ============================================================
// SCROLL PROGRESS
// ============================================================
const progressBar = document.getElementById('scrollProgress');
window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const total = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = (scrolled / total) * 100 + '%';
}, { passive: true });

// ============================================================
// SCROLL REVEAL
// ============================================================
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ============================================================
// STAT COUNTERS
// ============================================================
const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const el = entry.target;
            const target = parseInt(el.getAttribute('data-target'), 10);
            const duration = 1800;
            const startTime = performance.now();

            function tick(now) {
                const progress = Math.min((now - startTime) / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                el.textContent = Math.floor(eased * target);
                if (progress < 1) requestAnimationFrame(tick);
                else el.textContent = target;
            }
            requestAnimationFrame(tick);
            statObserver.unobserve(el);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-number').forEach(el => statObserver.observe(el));

// ============================================================
// BACK TO TOP + NAV SHOW — combined scroll handler
// ============================================================
const backToTop = document.getElementById('backToTop');
const nav = document.querySelector('.main-nav');

function runScrollChecks() {
    const y = window.scrollY;

    if (backToTop) {
        if (y > 600) backToTop.classList.add('visible');
        else backToTop.classList.remove('visible');
    }

    if (nav) {
        if (y > window.innerHeight * 0.6) nav.classList.add('visible');
        else nav.classList.remove('visible');
    }
}

window.addEventListener('scroll', runScrollChecks, { passive: true });
window.addEventListener('resize', runScrollChecks);
window.addEventListener('load', runScrollChecks);

window.runScrollChecks = runScrollChecks;

runScrollChecks();

backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ============================================================
// SMOOTH SCROLL
// ============================================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

// ============================================================
// CONTACT FORM
// ============================================================
(function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = form.querySelector('input[name="name"]').value.trim();
        alert(`Thanks${name ? ', ' + name : ''}! I'll get back to you soon.`);
        form.reset();
    });
})();

// ============================================================
// SKILLS DATA
// ============================================================
const SKILL_CARDS = [
    { slug: 'python',       title: 'Python',       category: 'Language',       desc: 'Primary language for data analysis, scripting, and machine learning.', tags: ['Pandas', 'NumPy', 'Scikit-learn'] },
    { slug: 'mysql',        title: 'SQL',          category: 'Language',       desc: 'Querying and managing relational databases.', tags: ['MySQL', 'PostgreSQL', 'Joins'] },
    { slug: 'r',            title: 'R',            category: 'Language',       desc: 'Statistical computing and data visualization.', tags: ['ggplot2', 'dplyr', 'Statistics'] },
    { slug: 'openjdk',      title: 'Java',         category: 'Language',       desc: 'Object-oriented programming language.', tags: ['OOP', 'Classes', 'JVM'] },
    { slug: 'javascript',   title: 'JavaScript',   category: 'Language',       desc: 'Scripting language for the web.', tags: ['ES6', 'DOM', 'Async'] },

    { slug: 'apachespark',  title: 'Apache Spark', category: 'Big Data',       color: 'ffffff', desc: 'Distributed data processing for large-scale analytics.', tags: ['PySpark', 'RDDs', 'DataFrames'] },
    { slug: 'apachekafka',  title: 'Apache Kafka', category: 'Streaming',      color: 'ffffff', desc: 'Real-time data streaming and event-driven pipelines.', tags: ['Producers', 'Consumers', 'Topics'] },
    { slug: 'apachestorm',  title: 'Apache Storm', category: 'Streaming',      color: 'ffffff', desc: 'Real-time stream processing with windows.', tags: ['Spouts', 'Bolts', 'Topologies'] },
    { slug: 'apachehadoop', title: 'Hadoop',       category: 'Big Data',       desc: 'Distributed storage and processing framework.', tags: ['MapReduce', 'HDFS', 'YARN'] },
    { slug: 'apachehadoop', title: 'HDFS',         category: 'Big Data',       desc: 'Hadoop Distributed File System for scalable storage.', tags: ['Storage', 'Blocks', 'Replication'] },

    { slug: 'snowflake',    title: 'Snowflake',    category: 'Data Warehouse', desc: 'Cloud data warehousing for scalable analytics.', tags: ['Warehouse', 'SQL', 'Cloud'] },
    { slug: 'mysql',        title: 'MySQL',        category: 'Database',       desc: 'Relational database management system.', tags: ['SQL', 'Tables', 'Queries'] },
    { slug: 'postgresql',   title: 'PostgreSQL',   category: 'Database',       desc: 'Advanced relational database.', tags: ['SQL', 'ACID', 'Extensions'] },
    { slug: 'mongodb',      title: 'MongoDB',      category: 'Database',       desc: 'NoSQL document database.', tags: ['NoSQL', 'Documents', 'Collections'] },

    { slug: 'databricks',   title: 'Databricks',   category: 'Cloud',          desc: 'Unified data analytics platform built on Spark.', tags: ['Notebooks', 'Spark', 'Delta Lake'] },
    { slug: 'amazonaws',    title: 'AWS',          category: 'Cloud',          color: 'ffffff', desc: 'Cloud computing platform.', tags: ['EC2', 'S3', 'Lambda'] },

    { slug: 'pandas',       title: 'Pandas',       category: 'Analytics',      desc: 'Data manipulation, cleaning, and analysis.', tags: ['DataFrames', 'Cleaning', 'GroupBy'] },
    { slug: 'numpy',        title: 'NumPy',        category: 'Analytics',      desc: 'Numerical computing and array operations.', tags: ['Arrays', 'Math', 'Linear Algebra'] },
    { slug: 'databricks',   title: 'Data Cleaning', category: 'Analytics',     desc: 'Cleaning, shaping, and preparing raw data for analysis.', tags: ['Preprocessing', 'Missing Values', 'Outliers'] },
    { slug: 'snowflake',    title: 'Data Warehousing', category: 'Data Warehouse', desc: 'Designing and managing centralized data repositories.', tags: ['ETL', 'Schema', 'OLAP'] },

    { slug: 'plotly',       title: 'Matplotlib',   category: 'Visualization',  desc: 'Static, animated, and interactive visualizations.', tags: ['Plots', 'Charts', 'Figures'] },
    { slug: 'python',       title: 'Seaborn',      category: 'Visualization',  desc: 'Statistical data visualization on top of Matplotlib.', tags: ['Distributions', 'Heatmaps', 'Pairplots'] },
    { slug: 'plotly',       title: 'Plotly',       category: 'Visualization',  desc: 'Interactive, publication-quality graphs.', tags: ['Interactive', 'Dashboards', '3D Plots'] },
    { slug: 'powerbi',      title: 'Power BI',     category: 'BI Tool',        desc: 'Business intelligence dashboards.', tags: ['Dashboards', 'DAX', 'Reports'] },

    { slug: 'scikitlearn',  title: 'Scikit-learn', category: 'ML Library',     desc: 'Machine learning library.', tags: ['ML Models', 'Preprocessing', 'Metrics'] },
    { slug: 'pytorch',      title: 'PyTorch',      category: 'ML Framework',   desc: 'Deep learning framework.', tags: ['Neural Nets', 'Tensors', 'Autograd'] },

    { slug: 'flask',        title: 'Flask',        category: 'Backend',        color: 'ffffff', desc: 'Lightweight Python web framework.', tags: ['Web Apps', 'Routes', 'APIs'] },
    { slug: 'django',       title: 'Django',       category: 'Backend',        desc: 'Full-stack Python web framework.', tags: ['ORM', 'Admin', 'Templates'] },
    { slug: 'html5',        title: 'HTML',         category: 'Frontend',       desc: 'Markup language for structuring web pages.', tags: ['Tags', 'Semantics', 'Forms'] },
    { slug: 'css3',         title: 'CSS',          category: 'Frontend',       color: 'ffffff', desc: 'Styling language for web pages.', tags: ['Flexbox', 'Grid', 'Animations'] },
    { slug: 'react',        title: 'React',        category: 'Frontend',       desc: 'Component-based JS library for UIs.', tags: ['Components', 'Hooks', 'JSX'] },

    { slug: 'cisco',        title: 'Cisco Packet Tracer', category: 'Networking', desc: 'Network simulation tool for designing and testing topologies.', tags: ['Topologies', 'Routing', 'Switching'] },

    { slug: 'docker',       title: 'Docker',       category: 'DevOps',         desc: 'Containerization for development and deployment.', tags: ['Containers', 'Images', 'Compose'] },
    { slug: 'linux',        title: 'Linux',        category: 'OS',             desc: 'Command-line and server environment.', tags: ['Bash', 'Shell', 'Terminal'] },

    { slug: 'jupyter',      title: 'Jupyter',      category: 'Tool',           color: 'ffffff', desc: 'Interactive notebooks for data exploration.', tags: ['Notebooks', 'Markdown', 'Interactive'] },
    { slug: 'googlecolab',  title: 'Google Colab', category: 'Tool',           desc: 'Cloud-based Jupyter notebooks.', tags: ['Cloud', 'GPU', 'Notebooks'] },
    { slug: 'github',       title: 'Git/GitHub',   category: 'Version Control', color: 'ffffff', desc: 'Version control and collaboration.', tags: ['Version Control', 'Branches', 'PRs'] },
    { slug: 'visualstudiocode', title: 'VS Code',  category: 'Editor',         desc: 'Primary code editor.', tags: ['Editor', 'Extensions', 'Debugging'] }
];

// ============================================================
// LOGO TRAINS
// ============================================================
function buildLogoTrains() {
    const top = document.getElementById('trainTop');
    const bottom = document.getElementById('trainBottom');
    if (!top || !bottom) return;

    const html = SKILL_CARDS.map(c => `
        <div class="logo-chip">
            <img class="chip-logo" src="https://cdn.simpleicons.org/${c.slug}${c.color ? '/' + c.color : ''}" alt="" loading="lazy" onerror="this.style.display='none'">
            <span class="chip-name">${c.title}</span>
        </div>
    `).join('');

    top.innerHTML = html + html;
    bottom.innerHTML = html + html;
}

// ============================================================
// TECH GRID
// ============================================================
function buildTechGrid() {
    const grid = document.getElementById('techGrid');
    if (!grid) return;

    grid.innerHTML = SKILL_CARDS.map(card => `
        <div class="tech-tile" title="${card.title} — ${card.category}">
            <div class="tech-tile-icon">
                <img src="https://cdn.simpleicons.org/${card.slug}${card.color ? '/' + card.color : ''}" alt="${card.title}" loading="lazy" onerror="this.replaceWith(document.createTextNode('◆'))">
            </div>
            <div class="tech-tile-name">${card.title}</div>
            <div class="tech-tile-cat">${card.category}</div>
        </div>
    `).join('');

    initTechTileTilt();
}

function initTechTileTilt() {
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isMobile || reduceMotion) return;

    const tiles = document.querySelectorAll('.tech-tile');

    tiles.forEach(tile => {
        const MAX_TILT = 14;

        tile.addEventListener('mousemove', (e) => {
            const rect = tile.getBoundingClientRect();
            const px = (e.clientX - rect.left) / rect.width;
            const py = (e.clientY - rect.top) / rect.height;

            const rotateY = (px - 0.5) * 2 * MAX_TILT;
            const rotateX = (0.5 - py) * 2 * MAX_TILT;

            tile.style.setProperty('--rx', rotateX.toFixed(2) + 'deg');
            tile.style.setProperty('--ry', rotateY.toFixed(2) + 'deg');
            tile.style.setProperty('--mx', (px * 100).toFixed(2) + '%');
            tile.style.setProperty('--my', (py * 100).toFixed(2) + '%');
        });

        tile.addEventListener('mouseleave', () => {
            tile.style.setProperty('--rx', '0deg');
            tile.style.setProperty('--ry', '0deg');
            tile.style.setProperty('--mx', '50%');
            tile.style.setProperty('--my', '50%');
        });
    });
}

// ============================================================
// DESK 3D TILT + SCROLL PARALLAX
// ============================================================
function initDeskTilt() {
    const stage = document.getElementById('setupStage');
    if (!stage) return;

    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!isMobile && !reduceMotion) {
        const MAX_TILT = 6;

        stage.addEventListener('mousemove', (e) => {
            const rect = stage.getBoundingClientRect();
            const px = (e.clientX - rect.left) / rect.width;
            const py = (e.clientY - rect.top) / rect.height;

            const rotateY = (px - 0.5) * 2 * MAX_TILT;
            const rotateX = (0.5 - py) * 2 * MAX_TILT;

            stage.style.setProperty('--rx', rotateX.toFixed(2) + 'deg');
            stage.style.setProperty('--ry', rotateY.toFixed(2) + 'deg');
        });

        stage.addEventListener('mouseleave', () => {
            stage.style.setProperty('--rx', '0deg');
            stage.style.setProperty('--ry', '0deg');
        });
    }

    if (!reduceMotion) {
        window.addEventListener('scroll', () => {
            const y = window.scrollY;
            const offset = Math.min(y * 0.06, 40);
            stage.style.setProperty('--scrollY', offset + 'px');
        }, { passive: true });
    }
}

// ============================================================
// JOURNEY ACCORDION
// ============================================================
document.querySelectorAll('.subjects-toggle').forEach(button => {
    button.addEventListener('click', () => {
        const panel = document.getElementById(button.getAttribute('data-target'));
        if (!panel) return;

        const isOpen = panel.classList.contains('open');

        document.querySelectorAll('.subjects-panel.open').forEach(p => {
            if (p !== panel) {
                p.classList.remove('open');
                const b = document.querySelector(`.subjects-toggle[data-target="${p.id}"]`);
                if (b) b.classList.remove('open');
            }
        });

        panel.classList.toggle('open', !isOpen);
        button.classList.toggle('open', !isOpen);
    });
});

// ============================================================
// CERTIFICATE LIGHTBOX
// ============================================================
(function initCertLightbox() {
    const certCards = document.querySelectorAll('.cert-card:not(.cert-card--placeholder)');
    const certLightbox = document.getElementById('certLightbox');
    const certLightboxImg = document.getElementById('certLightboxImg');
    const certLightboxClose = document.getElementById('certLightboxClose');
    if (!certLightbox || !certLightboxImg) return;

    certCards.forEach(card => {
        card.addEventListener('click', (e) => {
            if (e.target.closest('.cert-learn-toggle')) return;
            if (e.target.closest('.cert-learn-panel')) return;
            const imgSrc = card.getAttribute('data-cert');
            if (!imgSrc) return;
            certLightboxImg.src = imgSrc;
            certLightbox.classList.add('open');
            document.body.style.overflow = 'hidden';
        });
    });

    function closeCertLightbox() {
        certLightbox.classList.remove('open');
        document.body.style.overflow = '';
        setTimeout(() => { certLightboxImg.src = ''; }, 300);
    }

    if (certLightboxClose) certLightboxClose.addEventListener('click', closeCertLightbox);

    certLightbox.addEventListener('click', (e) => {
        if (e.target === certLightbox) closeCertLightbox();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && certLightbox.classList.contains('open')) {
            closeCertLightbox();
        }
    });
})();

// ============================================================
// CERTIFICATE "WHAT I LEARNED" TOGGLE
// ============================================================
document.querySelectorAll('.cert-learn-toggle').forEach(button => {
    button.addEventListener('click', (e) => {
        e.stopPropagation();
        const panel = document.getElementById(button.getAttribute('data-target'));
        if (!panel) return;

        const isOpen = panel.classList.contains('open');
        panel.classList.toggle('open', !isOpen);
        button.classList.toggle('open', !isOpen);
    });
});

// ============================================================
// PROJECT GALLERIES
// ============================================================
document.querySelectorAll('.project-gallery').forEach(gallery => {
    const main = gallery.querySelector('.gallery-main');
    const thumbs = gallery.querySelectorAll('.gallery-thumb');
    const counter = gallery.querySelector('.gallery-counter');

    if (!main) return;

    if (thumbs.length > 0) {
        thumbs.forEach((thumb, idx) => {
            thumb.addEventListener('click', (e) => {
                e.stopPropagation();
                const imgSrc = thumb.getAttribute('data-img');
                main.style.backgroundImage = `url('${imgSrc}')`;
                thumbs.forEach(t => t.classList.remove('active'));
                thumb.classList.add('active');
                if (counter) counter.textContent = `${idx + 1} / ${thumbs.length}`;
            });
        });
    }

    main.addEventListener('click', () => {
        let imgSrc = main.getAttribute('data-img');

        if (!imgSrc) {
            const match = main.style.backgroundImage.match(/url\(["']?(.*?)["']?\)/);
            if (match && match[1]) imgSrc = match[1];
        }

        if (imgSrc) openLightbox(imgSrc);
    });
});

// ============================================================
// LIGHTBOX
// ============================================================
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');

let currentGallery = [];
let currentIndex = 0;

function openLightbox(imgSrc) {
    if (!lightbox || !lightboxImg) return;

    const parentGallery = Array.from(document.querySelectorAll('.project-gallery')).find(g => {
        const main = g.querySelector('.gallery-main');
        return main && main.style.backgroundImage.includes(imgSrc);
    });

    if (parentGallery) {
        const thumbs = parentGallery.querySelectorAll('.gallery-thumb');
        if (thumbs.length > 0) {
            currentGallery = Array.from(thumbs).map(t => t.getAttribute('data-img'));
            currentIndex = Math.max(0, currentGallery.indexOf(imgSrc));
        } else {
            currentGallery = [imgSrc];
            currentIndex = 0;
        }
    } else {
        currentGallery = [imgSrc];
        currentIndex = 0;
    }

    lightboxImg.src = currentGallery[currentIndex];
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
}

function navigateLightbox(dir) {
    if (currentGallery.length <= 1) return;
    currentIndex = (currentIndex + dir + currentGallery.length) % currentGallery.length;
    lightboxImg.src = currentGallery[currentIndex];
}

if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
if (lightboxPrev) lightboxPrev.addEventListener('click', () => navigateLightbox(-1));
if (lightboxNext) lightboxNext.addEventListener('click', () => navigateLightbox(1));
if (lightbox) lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });

document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigateLightbox(-1);
    if (e.key === 'ArrowRight') navigateLightbox(1);
});

// ============================================================
// DESK DASHBOARD — LIVE DATA + POWER TOGGLE (with boot flash)
// ============================================================
(function initDeskDashboard() {
    const stage   = document.getElementById('setupStage');
    const toggle  = document.getElementById('powerToggle');
    const timeEl  = document.getElementById('dashTime');
    const lineEl  = document.getElementById('dashLine');
    const fillEl  = document.getElementById('dashLineFill');
    const barsEl  = document.getElementById('dashBars');
    const logEl   = document.getElementById('dashLog');
    const tickerEl= document.getElementById('dashTicker');
    const kEvents = document.getElementById('kpiEvents');
    const kActive = document.getElementById('kpiActive');
    const kLatency= document.getElementById('kpiLatency');
    const kUptime = document.getElementById('kpiUptime');

    if (!stage || !toggle || !lineEl) return;

    let isOff = false;

    function togglePower(e) {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        isOff = !isOff;

        if (isOff) {
            stage.classList.add('power-off');
        } else {
            stage.classList.remove('power-off');
            stage.classList.add('boot-flash');
            setTimeout(() => stage.classList.remove('boot-flash'), 900);
        }
    }

    toggle.addEventListener('click', togglePower);
    toggle.addEventListener('pointerdown', (e) => {
        e.stopPropagation();
    });

    toggle.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') togglePower(e);
    });

    toggle.style.pointerEvents = 'auto';

    function updateClock() {
        if (!timeEl) return;
        const d = new Date();
        const pad = n => String(n).padStart(2, '0');
        timeEl.textContent = `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    }
    updateClock();
    setInterval(updateClock, 1000);

    const POINTS = 40;
    const lineData = Array.from({ length: POINTS }, () => 40 + Math.random() * 30);

    function renderLine() {
        if (stage.classList.contains('power-off')) return;
        lineData.shift();
        const last = lineData[lineData.length - 1];
        const next = Math.max(10, Math.min(90, last + (Math.random() - 0.5) * 25));
        lineData.push(next);

        const stepX = 300 / (POINTS - 1);
        const pts = lineData.map((v, i) => `${(i * stepX).toFixed(2)},${(100 - v).toFixed(2)}`).join(' ');

        lineEl.setAttribute('points', pts);
        fillEl.setAttribute('points', `0,100 ${pts} 300,100`);
    }
    renderLine();
    setInterval(renderLine, 900);

    const barSpans = barsEl ? Array.from(barsEl.querySelectorAll('span')) : [];
    function updateBars() {
        if (stage.classList.contains('power-off')) return;
        barSpans.forEach(b => {
            b.style.height = (25 + Math.random() * 70) + '%';
        });
    }
    updateBars();
    setInterval(updateBars, 1100);

    let events = 342, active = 128, latency = 42, uptime = 99.9;

    function setKpiColor(el, value, goodFn, warnFn) {
        el.classList.remove('is-good', 'is-warn', 'is-bad');
        if (goodFn(value)) el.classList.add('is-good');
        else if (warnFn(value)) el.classList.add('is-warn');
        else el.classList.add('is-bad');
    }

    function updateKpis() {
        if (stage.classList.contains('power-off')) return;

        events  = Math.max(80, Math.min(999, events + Math.floor((Math.random() - 0.45) * 40)));
        active  = Math.max(20, Math.min(400, active + Math.floor((Math.random() - 0.5) * 20)));
        latency = Math.max(8,  Math.min(180, latency + Math.floor((Math.random() - 0.5) * 15)));
        uptime  = Math.max(98.5, Math.min(100, uptime + (Math.random() - 0.5) * 0.05));

        if (kEvents) { kEvents.textContent = events; setKpiColor(kEvents, events, v => v > 200, v => v > 100); }
        if (kActive) { kActive.textContent = active; setKpiColor(kActive, active, v => v > 100, v => v > 50); }
        if (kLatency) { kLatency.innerHTML = latency + '<span class="dash-unit">ms</span>'; setKpiColor(kLatency, latency, v => v < 60, v => v < 120); }
        if (kUptime) { kUptime.innerHTML = uptime.toFixed(2) + '<span class="dash-unit">%</span>'; setKpiColor(kUptime, uptime, v => v > 99.5, v => v > 99); }
    }
    updateKpis();
    setInterval(updateKpis, 1400);

    const boroughs = ['Westminster', 'Camden', 'Hackney', 'Croydon', 'Greenwich', 'Islington', 'Tower Hamlets', 'Lambeth', 'Southwark', 'Barnet'];
    const eventsPool = ['Fire alarm', 'False alarm', 'Special service', 'Small fire', 'Vehicle fire', 'Dwelling fire'];

    function newLogLine() {
        if (stage.classList.contains('power-off')) return;
        const d = new Date();
        const pad = n => String(n).padStart(2, '0');
        const ts = `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
        const borough = boroughs[Math.floor(Math.random() * boroughs.length)];
        const evt = eventsPool[Math.floor(Math.random() * eventsPool.length)];
        const ok = Math.random() > 0.15;

        const line = document.createElement('div');
        line.className = 'dash-log-line';
        line.innerHTML = `<span class="log-ts">${ts}</span><span class="${ok ? 'log-ok' : 'log-warn'}">${ok ? '[OK]' : '[WARN]'}</span> ${borough} → ${evt}`;

        logEl.prepend(line);
        while (logEl.children.length > 6) logEl.removeChild(logEl.lastChild);
    }
    for (let i = 0; i < 4; i++) newLogLine();
    setInterval(newLogLine, 1800);

    const tickerText = 'LONDON FIRE BRIGADE LIVE STREAM  •  KAFKA PIPELINE ACTIVE  •  INFLUXDB CONNECTED  •  GRAFANA VISUALISATION ONLINE  •  ' +
                       'BOROUGH MONITORING  •  INCIDENT DETECTION  •  REAL-TIME ANALYTICS  •  ';
    if (tickerEl) tickerEl.textContent = tickerText + tickerText;
})();

// ============================================================
// CONTENT PROTECTION DETERRENTS
// ============================================================
(function initContentProtection() {
    document.addEventListener('contextmenu', (e) => {
        const tag = (e.target.tagName || '').toLowerCase();
        if (tag === 'input' || tag === 'textarea') return;
        e.preventDefault();
    });

    document.addEventListener('keydown', (e) => {
        const k = e.key.toLowerCase();

        if ((e.ctrlKey || e.metaKey) && k === 'c') {
            const tag = (e.target.tagName || '').toLowerCase();
            if (tag !== 'input' && tag !== 'textarea') e.preventDefault();
        }

        if ((e.ctrlKey || e.metaKey) && k === 's') e.preventDefault();
        if ((e.ctrlKey || e.metaKey) && k === 'u') e.preventDefault();
        if ((e.ctrlKey || e.metaKey) && k === 'p') e.preventDefault();
    });

    document.addEventListener('dragstart', (e) => {
        if ((e.target.tagName || '').toLowerCase() === 'img') {
            e.preventDefault();
        }
    });
})();

// ============================================================
// INIT
// ============================================================
buildLogoTrains();
buildTechGrid();
initDeskTilt();
runScrollChecks();

console.log('✨ PURVASHI — GLITTER CURSOR loaded');
import React, {useEffect, useRef} from 'react';
import Layout from '@theme/Layout';
import '../css/hub.css';

// Bouncing-nodes mesh, ported from ratspeak.org/about.html: a handful of
// free-floating nodes (one larger hub) that drift and bounce, connected by
// distance-faded lines, with the occasional packet travelling along an edge.
function MeshCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const htmlEl = document.documentElement;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const nodeCount = isMobile ? 14 : 24;
    const connDist = isMobile ? 100 : 130;

    let w = 0, h = 0, time = 0, running = false, rafId = 0;
    let nodes = [], packets = [];
    let accent = getComputedStyle(htmlEl).getPropertyValue('--hub-accent').trim() || '#D2693B';

    const rand = (a, b) => a + Math.random() * (b - a);

    function resize() {
      const rect = canvas.parentElement.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      w = rect.width;
      h = rect.height;
    }

    function initNodes() {
      nodes = [];
      for (let i = 0; i < nodeCount; i++) {
        nodes.push({
          x: rand(40, w - 40),
          y: rand(40, h - 40),
          vx: rand(-0.15, 0.15),
          vy: rand(-0.15, 0.15),
          r: i === 0 ? 5 : rand(2, 3.5),
        });
      }
    }

    function spawnPacket() {
      if (nodes.length < 2) return;
      const a = Math.floor(rand(0, nodes.length));
      const neighbors = [];
      for (let i = 0; i < nodes.length; i++) {
        if (i === a) continue;
        const dx = nodes[a].x - nodes[i].x, dy = nodes[a].y - nodes[i].y;
        if (Math.sqrt(dx * dx + dy * dy) < connDist) neighbors.push(i);
      }
      if (neighbors.length === 0) return;
      const b = neighbors[Math.floor(rand(0, neighbors.length))];
      const dx = nodes[a].x - nodes[b].x, dy = nodes[a].y - nodes[b].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      packets.push({ from: a, to: b, t: 0, speed: dist > 0 ? 1 / dist : 0.05 });
    }

    let lastFrameT = 0;
    const MIN_FRAME_MS = 1000 / 120;
    function draw(t) {
      if (!running) return;
      if (document.hidden) { rafId = requestAnimationFrame(draw); return; }
      if (t - lastFrameT < MIN_FRAME_MS) { rafId = requestAnimationFrame(draw); return; }
      lastFrameT = t;
      ctx.clearRect(0, 0, w, h);
      time++;

      for (const n of nodes) {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 20 || n.x > w - 20) n.vx *= -1;
        if (n.y < 20 || n.y > h - 20) n.vy *= -1;
      }

      ctx.strokeStyle = accent;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < connDist) {
            ctx.globalAlpha = (1 - d / connDist) * 0.28;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      ctx.fillStyle = accent;
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        ctx.globalAlpha = i === 0 ? 0.9 : 0.65;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      }

      if (time % 60 === 0) spawnPacket();
      for (let p = packets.length - 1; p >= 0; p--) {
        const pkt = packets[p];
        pkt.t += pkt.speed;
        if (pkt.t > 1) { packets.splice(p, 1); continue; }
        const from = nodes[pkt.from], to = nodes[pkt.to];
        const px = from.x + (to.x - from.x) * pkt.t;
        const py = from.y + (to.y - from.y) * pkt.t;
        ctx.globalAlpha = 0.8 * (1 - Math.abs(pkt.t - 0.5) * 2);
        ctx.beginPath();
        ctx.arc(px, py, 2, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      if (!reduceMotion) rafId = requestAnimationFrame(draw);
    }

    function start() { if (!running) { running = true; rafId = requestAnimationFrame(draw); } }
    function stop() { running = false; if (rafId) cancelAnimationFrame(rafId); rafId = 0; }

    resize();
    initNodes();

    // Re-read accent when the theme (light/dark) toggles.
    const themeObserver = new MutationObserver(() => {
      accent = getComputedStyle(htmlEl).getPropertyValue('--hub-accent').trim() || accent;
    });
    themeObserver.observe(htmlEl, { attributes: true, attributeFilter: ['data-theme'] });

    let io;
    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver((entries) => {
        entries.forEach((en) => (en.isIntersecting ? start() : stop()));
      }, { threshold: 0 });
      io.observe(canvas);
    } else {
      start();
    }

    let resizeTimer = null, lastW = w;
    const onResize = () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        resize();
        if (Math.abs(w - lastW) > 10) { initNodes(); lastW = w; }
      }, 150);
    };
    window.addEventListener('resize', onResize);

    return () => {
      stop();
      themeObserver.disconnect();
      if (io) io.disconnect();
      window.removeEventListener('resize', onResize);
      if (resizeTimer) clearTimeout(resizeTimer);
    };
  }, []);

  return <canvas ref={canvasRef} className="hero-canvas" />;
}

function HeroCycle() {
  const ref = useRef(null);
  useEffect(() => {
    const words = ['Connect.', 'Mesh.', 'Encrypt.', 'Deploy.'];
    let wi = 0;
    const id = setInterval(() => {
      if (!ref.current) return;
      ref.current.classList.add('fade-out');
      setTimeout(() => { wi=(wi+1)%words.length; if(ref.current){ref.current.textContent=words[wi];ref.current.classList.remove('fade-out');} }, 300);
    }, 2800);
    return () => clearInterval(id);
  }, []);
  return <span className="hero-accent" ref={ref}>Connect.</span>;
}

const Topo = () => (
  <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M50 250 Q100 200 180 220 T320 180 T380 100" stroke="currentColor" strokeWidth="1.2" strokeDasharray="900 200" opacity="0.3"/>
    <path d="M30 280 Q90 230 160 240 T300 200 T370 130" stroke="currentColor" strokeWidth="0.8" strokeDasharray="900 200" opacity="0.2"/>
    <path d="M70 230 Q120 180 200 200 T340 160 T390 80" stroke="currentColor" strokeWidth="1" strokeDasharray="900 200" opacity="0.25"/>
    <path d="M20 260 Q80 220 140 230 T280 190 T360 120 T400 60" stroke="currentColor" strokeWidth="0.6" strokeDasharray="900 200" opacity="0.15"/>
    <path d="M60 240 Q110 190 190 210 T330 170 T385 90" stroke="currentColor" strokeWidth="0.9" strokeDasharray="900 200" opacity="0.22"/>
  </svg>
);

const Arrow = () => (
  <svg className="support-arrow" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
);

export default function Hub() {
  return (
    <Layout noFooter wrapperClassName="hub-wrapper" title="Documentation hub">
      <div className="hub-page">
        <section className="hero">
          <MeshCanvas />
          <div className="hero-fade" />
          <div className="hero-content">
            <p className="hero-eyebrow">Documentation hub</p>
            <h1 className="hero-title">Learn. Build. <HeroCycle /></h1>
            <p className="hero-subtitle">Everything you need to get started with Ratspeak, understand the protocols, and build on the mesh.</p>
          </div>
        </section>

        <section className="content">
          <div className="cards">
            <a href="/docs" className="card">
              <div className="card-glow" />
              <div className="card-inner">
                <div className="card-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/><line x1="8" y1="7" x2="16" y2="7"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
                </div>
                <div className="card-body">
                  <h2 className="card-title">Technical docs</h2>
                  <p className="card-desc">Architecture, configuration, protocol internals, and API reference for developers and operators.</p>
                  <span className="card-link">Browse docs <span className="arrow">&rarr;</span></span>
                </div>
              </div>
            </a>
            <a href="/tutorials" className="card">
              <div className="card-glow" />
              <div className="card-inner">
                <div className="card-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                </div>
                <div className="card-body">
                  <h2 className="card-title">Tutorials</h2>
                  <p className="card-desc">Step-by-step guides that walk you through setup, first messages, radio links, and common workflows.</p>
                  <span className="card-link">Start learning <span className="arrow">&rarr;</span></span>
                </div>
              </div>
            </a>
          </div>

          <div className="community-section">
            <div className="topo-bg">
              <div className="topo topo-left"><Topo /></div>
              <div className="topo topo-right"><Topo /></div>
            </div>
            <div className="section-header">
              <div className="section-line" />
              <span className="section-label">Community and support</span>
              <div className="section-line" />
            </div>
            <div className="support-grid">
              <a href="https://ratspeak.org/discord" className="support-card">
                <div className="support-icon"><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/></svg></div>
                <div><h3>Discord</h3><p>Chat with the community, get help, share your builds.</p></div>
                <Arrow />
              </a>
              <a href="https://ratspeak.org/telegram" className="support-card">
                <div className="support-icon"><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0h-.056zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg></div>
                <div><h3>Telegram</h3><p>Updates, announcements, and discussion.</p></div>
                <Arrow />
              </a>
              <a href="https://github.com/ratspeak" className="support-card">
                <div className="support-icon"><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg></div>
                <div><h3>GitHub</h3><p>Source code, issues, and contributions.</p></div>
                <Arrow />
              </a>
              <a href="/docs/reference/faq" className="support-card">
                <div className="support-icon"><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></div>
                <div><h3>FAQ</h3><p>Answers to the most common questions.</p></div>
                <Arrow />
              </a>
            </div>
          </div>
        </section>

        <footer className="hub-footer">
          <p>&copy; 2026 Ratspeak. Built for the mesh.</p>
        </footer>
      </div>
    </Layout>
  );
}

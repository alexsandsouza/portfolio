const fs = require('fs');
const file = 'public/Inovatech2026/inovtech_2026_amazon_tech.html';
let content = fs.readFileSync(file, 'utf8');
const newCss = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Syne:wght@600;700;800&display=swap');

*{box-sizing:border-box;margin:0;padding:0}
:root{
  --green:#10b981; --green-dark:#059669; --green-light:#d1fae5;
  --amber:#f59e0b; --amber-dark:#d97706; --amber-light:#fef3c7;
  --blue:#3b82f6; --blue-dark:#2563eb; --blue-light:#dbeafe;
  --coral:#ef4444; --coral-dark:#dc2626; --coral-light:#fee2e2;
  
  --bg: #0f172a; 
  --bg2: #1e293b; 
  --bg3: #334155;
  --border: #334155; 
  --border-hover: #475569;
  --txt: #f8fafc; 
  --txt2: #94a3b8; 
}

body {
  background-color: var(--bg);
  min-height: 100vh;
}

#app{
  font-family:'Space Grotesk',sans-serif;
  color:var(--txt);
  padding:3rem 1.5rem;
  max-width:900px;
  margin:0 auto;
}

/* HERO */
.hero{
  background:linear-gradient(135deg, #022c22 0%, #064e3b 50%, #065f46 100%);
  border-radius:24px;
  padding:3.5rem 2.5rem;
  position:relative;
  overflow:hidden;
  margin-bottom:2.5rem;
  box-shadow: 0 20px 40px rgba(0,0,0,0.3);
  border: 1px solid rgba(16, 185, 129, 0.2);
}
.hero::before{
  content:'';position:absolute;top:-60px;right:-60px;
  width:300px;height:300px;border-radius:50%;
  background:radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%);
}
.hero-badge{
  display:inline-flex;align-items:center;gap:8px;
  background:rgba(16,185,129,0.2);
  border:1px solid rgba(16,185,129,0.4);
  color:#34d399;font-size:13px;font-weight:700;letter-spacing:1px;
  padding:6px 16px;border-radius:30px;margin-bottom:20px;text-transform:uppercase;
}
.hero h1{
  font-family:'Syne',sans-serif;font-size:clamp(32px,6vw,48px);
  color:#fff;line-height:1.1;margin-bottom:16px;
}
.hero h1 span{color:#34d399;}
.hero p{color:#a7f3d0;font-size:16px;line-height:1.6;max-width:600px; margin-bottom:24px;}

.xp-bar{
  background:rgba(0,0,0,0.3);border-radius:14px;padding:16px 24px;
  display:flex;align-items:center;gap:16px;
  border: 1px solid rgba(255,255,255,0.05);
  backdrop-filter: blur(10px);
}
.xp-label{color:#34d399;font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:1px;white-space:nowrap}
.xp-track{flex:1;height:12px;background:rgba(255,255,255,0.1);border-radius:6px;overflow:hidden; box-shadow: inset 0 2px 4px rgba(0,0,0,0.2);}
.xp-fill{height:100%;background:linear-gradient(90deg, #10b981, #34d399);border-radius:6px;transition:width 0.8s cubic-bezier(0.4, 0, 0.2, 1);width:0%; box-shadow: 0 0 10px rgba(52,211,153,0.5);}
.xp-pts{color:#fff;font-size:16px;font-weight:800;white-space:nowrap}

.phase-nav{display:flex;gap:12px;margin-bottom:2.5rem;overflow-x:auto;padding-bottom:12px; scrollbar-width: thin; scrollbar-color: var(--border) transparent;}
.phase-nav::-webkit-scrollbar { height: 6px; }
.phase-nav::-webkit-scrollbar-track { background: transparent; }
.phase-nav::-webkit-scrollbar-thumb { background-color: var(--border); border-radius: 10px; }
.phase-btn{
  flex-shrink:0;display:flex;align-items:center;gap:8px;
  padding:12px 24px;border-radius:30px;border:1px solid var(--border);
  background:var(--bg2);cursor:pointer;font-size:15px;font-weight:600;
  color:var(--txt2);transition:all .3s ease;white-space:nowrap;
  font-family: 'Space Grotesk', sans-serif;
}
.phase-btn:hover { background: var(--bg3); color: var(--txt); border-color: var(--border-hover); }
.phase-btn.active{background:var(--green-dark);border-color:var(--green);color:#fff; box-shadow: 0 4px 12px rgba(5,150,105,0.3);}
.phase-btn.done{background:rgba(16,185,129,0.1);border-color:var(--green-dark);color:var(--green);}
.phase-btn .dot{width:8px;height:8px;border-radius:50%;background:currentColor;opacity:.8; transition:transform 0.3s;}
.phase-btn.active .dot{transform: scale(1.2); opacity: 1;}

.phase-card{display:none;}
.phase-card.active{display:block; animation: fadeIn 0.4s ease-out;}
@keyframes fadeIn { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }

.section-head{
  display:flex;align-items:flex-start;gap:20px;
  background:var(--bg2);border:1px solid var(--border);
  border-radius:20px;padding:24px;margin-bottom:28px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.15);
}
.section-icon{
  width:56px;height:56px;border-radius:16px;
  display:flex;align-items:center;justify-content:center;
  font-size:28px;flex-shrink:0;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  background: rgba(255,255,255,0.05);
}
.section-head h2{font-size:22px;font-weight:700;margin-bottom:8px; color: var(--txt);}
.section-head p{font-size:16px;color:var(--txt2);line-height:1.6}

.q-card{
  background:var(--bg);border:1px solid var(--border);
  border-radius:20px;padding:28px;margin-bottom:24px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}
.q-card:hover { border-color: var(--border-hover); box-shadow: 0 8px 25px rgba(0,0,0,0.15); }
.q-label{font-size:14px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:16px;display:flex;align-items:center;gap:12px; color: var(--txt);}
.q-pts{background:rgba(255,255,255,0.1);color:#fff;font-size:12px;padding:6px 12px;border-radius:12px; letter-spacing: 0.5px;}
.q-text{font-size:20px;font-weight:600;margin-bottom:14px;line-height:1.5; color: var(--txt);}
.q-sub{font-size:15px;color:var(--txt2);margin-bottom:20px;line-height:1.6}

.options{display:flex;flex-direction:column;gap:12px}
.opt{
  display:flex;align-items:center;gap:16px;
  padding:16px 20px;border-radius:14px;
  border:2px solid var(--border);cursor:pointer;
  background:var(--bg2);transition:all .2s ease;font-size:16px; font-weight: 500;
  color: var(--txt);
}
.opt:hover{border-color:var(--green);background:rgba(16,185,129,0.05); transform: translateY(-2px);}
.opt.selected{border-color:var(--green);background:rgba(16,185,129,0.1);color:var(--green);}
.opt.wrong{border-color:var(--coral);background:rgba(239,68,68,0.1);color:var(--coral);}
.opt.correct{border-color:var(--green);background:rgba(16,185,129,0.15);color:var(--green);}
.opt-letter{
  width:32px;height:32px;border-radius:10px;background:var(--bg3);
  display:flex;align-items:center;justify-content:center;
  font-size:14px;font-weight:700;flex-shrink:0; color: var(--txt);
  transition: all 0.2s;
}
.opt:hover .opt-letter { background: var(--green); color: #fff; }
.opt.selected .opt-letter, .opt.correct .opt-letter { background: var(--green); color: #fff; }
.opt.wrong .opt-letter { background: var(--coral); color: #fff; }

textarea{
  width:100%;border:2px solid var(--border);border-radius:14px;
  padding:20px;font-size:16px;color:var(--txt);
  background:var(--bg2);resize:vertical;min-height:140px;
  font-family:'Space Grotesk',sans-serif;line-height:1.6;
  transition: border-color 0.2s, box-shadow 0.2s;
}
textarea:focus{outline:none;border-color:var(--green); box-shadow: 0 0 0 4px rgba(16,185,129,0.15);}
textarea::placeholder{color:var(--border-hover);}

.tag-grid{display:flex;flex-wrap:wrap;gap:12px;margin-bottom:20px}
.tag{
  padding:12px 20px;border-radius:30px;border:1px solid var(--border);
  cursor:pointer;font-size:15px;font-weight:600;background:var(--bg2);
  transition:all .2s;color:var(--txt2);
}
.tag:hover{border-color:var(--green); color:var(--txt); background:rgba(16,185,129,0.05);}
.tag.active{background:var(--green-dark);border-color:var(--green);color:#fff; box-shadow: 0 4px 10px rgba(5,150,105,0.3);}

.meter{margin-bottom:16px}
.meter-label{display:flex;justify-content:space-between;font-size:15px;margin-bottom:8px}
.meter-label span:first-child{color:var(--txt2); font-weight: 500;}
.meter-label span:last-child{font-weight:700; color: var(--txt);}
.meter-track{height:12px;background:var(--bg2);border-radius:6px;overflow:hidden;border:1px solid var(--border); box-shadow: inset 0 1px 3px rgba(0,0,0,0.2);}
.meter-fill{height:100%;border-radius:6px;transition:width 1s cubic-bezier(0.4, 0, 0.2, 1);width:0}

input[type=range] {
  -webkit-appearance: none;
  width: 100%;
  background: transparent;
}
input[type=range]:focus {
  outline: none;
}
input[type=range]::-webkit-slider-runnable-track {
  width: 100%; height: 8px; cursor: pointer;
  background: var(--bg3); border-radius: 4px;
}
input[type=range]::-webkit-slider-thumb {
  height: 20px; width: 20px; border-radius: 50%;
  background: var(--green); cursor: pointer;
  -webkit-appearance: none; margin-top: -6px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.3);
}

.score-badge{
  display:inline-flex;align-items:center;gap:8px;
  padding:8px 16px;border-radius:24px;font-size:14px;font-weight:700;
}
.score-A{background:rgba(16,185,129,0.2);color:var(--green);border:1px solid var(--green);}
.score-B{background:rgba(59,130,246,0.2);color:var(--blue);border:1px solid var(--blue);}
.score-C{background:rgba(245,158,11,0.2);color:var(--amber);border:1px solid var(--amber);}
.score-D{background:rgba(239,68,68,0.2);color:var(--coral);border:1px solid var(--coral);}

.feedback-box{
  border-radius:14px;padding:20px 24px;margin-top:20px;
  font-size:16px;line-height:1.6;display:none; font-weight: 500;
  animation: fadeIn 0.3s ease-out;
}
.feedback-box.show{display:block}
.fb-green{background:rgba(16,185,129,0.1);color:var(--green);border:1px solid rgba(16,185,129,0.3);}
.fb-amber{background:rgba(245,158,11,0.1);color:var(--amber);border:1px solid rgba(245,158,11,0.3);}
.fb-red{background:rgba(239,68,68,0.1);color:var(--coral);border:1px solid rgba(239,68,68,0.3);}

.cta-row{display:flex;gap:16px;flex-wrap:wrap;margin-top:28px}
.btn{
  padding:16px 28px;border-radius:12px;border:none;cursor:pointer;
  font-family:'Space Grotesk',sans-serif;font-size:16px;font-weight:700;
  transition:all .2s; display: inline-flex; align-items: center; justify-content: center; gap: 10px;
}
.btn-primary{background:var(--green);color:#fff; box-shadow: 0 4px 15px rgba(16,185,129,0.25);}
.btn-primary:hover{background:var(--green-dark); transform: translateY(-3px); box-shadow: 0 8px 20px rgba(16,185,129,0.35);}
.btn-secondary{background:var(--bg2);color:var(--txt);border:1px solid var(--border);}
.btn-secondary:hover{border-color:var(--border-hover); background: var(--bg3); transform: translateY(-3px);}
.btn-ai{background:var(--blue);color:#fff; box-shadow: 0 4px 15px rgba(59,130,246,0.25);}
.btn-ai:hover{background:var(--blue-dark); transform: translateY(-3px); box-shadow: 0 8px 20px rgba(59,130,246,0.35);}

.mvp-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-top:24px}
.mvp-item{
  background:var(--bg2);border:1px solid var(--border);
  border-radius:14px;padding:24px; transition: border-color 0.2s;
}
.mvp-item:hover{border-color: var(--border-hover);}
.mvp-item h4{font-size:16px;font-weight:700;margin-bottom:10px;color:var(--txt);}
.mvp-item p{font-size:16px;color:var(--txt2); line-height: 1.5;}

.prize-row{display:flex;gap:20px;margin-top:28px}
.prize{
  flex:1;background:var(--bg2);border:1px solid var(--border);
  border-radius:16px;padding:24px;text-align:center;
  transition: transform 0.2s, box-shadow 0.2s;
}
.prize:hover{transform: translateY(-5px); border-color: var(--border-hover); box-shadow: 0 10px 25px rgba(0,0,0,0.2);}
.prize-icon{font-size:40px;margin-bottom:12px}
.prize-title{font-size:14px;font-weight:800;text-transform:uppercase;letter-spacing:1px;color:var(--txt2); margin-bottom: 6px;}
.prize-val{font-size:24px;font-weight:800;color:var(--txt)}

.result-card{
  background:linear-gradient(135deg,#064e3b,#022c22);
  border-radius:24px;padding:3.5rem 2rem;text-align:center;color:#fff;
  margin-top:28px; box-shadow: 0 20px 40px rgba(0,0,0,0.3);
  border: 1px solid rgba(16, 185, 129, 0.2);
}
.result-score{font-family:'Syne',sans-serif;font-size:72px;font-weight: 800;color:#34d399;line-height:1; text-shadow: 0 4px 20px rgba(52,211,153,0.3);}
.result-label{font-size:18px;font-weight: 600;color:#a7f3d0;margin-top:12px;margin-bottom:30px; text-transform: uppercase; letter-spacing: 1px;}

.pulse{animation:pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}

.chip{display:inline-flex;align-items:center;gap:8px;padding:8px 16px;border-radius:30px;font-size:14px;font-weight:600; letter-spacing: 0.5px;}
.chip-green{background:rgba(16,185,129,0.15);color:var(--green);border:1px solid rgba(16,185,129,0.3);}
.chip-blue{background:rgba(59,130,246,0.15);color:var(--blue);border:1px solid rgba(59,130,246,0.3);}
.chip-amber{background:rgba(245,158,11,0.15);color:var(--amber);border:1px solid rgba(245,158,11,0.3);}

@media (max-width: 768px) {
  #app{padding: 1rem;}
  .hero{padding:2.5rem 1.5rem; border-radius: 20px; text-align: center;}
  .hero h1{font-size: 32px;}
  .hero-badge{font-size: 12px; margin: 0 auto 20px auto;}
  .xp-bar{flex-direction: column; padding: 20px; gap: 12px; border-radius: 16px; align-items: stretch;}
  .xp-track{width: 100%;}
  .xp-pts{text-align: center;}
  .phase-nav{flex-wrap:nowrap; overflow-x:auto; padding-bottom: 12px; margin-bottom: 2rem;}
  .section-head{flex-direction:column; align-items:center; text-align:center; padding: 1.5rem 1rem;}
  .options .opt{flex-direction:column; text-align:center; padding: 1.5rem;}
  .opt-letter{width: 40px; height: 40px; font-size: 16px; margin-bottom: 10px;}
  .mvp-grid{grid-template-columns:1fr; gap: 16px;}
  .prize-row{flex-direction:column; gap: 16px;}
  .cta-row{justify-content:center; flex-direction: column;}
  .cta-row .btn{width: 100%; justify-content: center;}
  textarea{min-height:160px;}
  .result-card{padding: 2.5rem 1.5rem;}
  .result-score{font-size: 56px;}
}
`

content = content.replace(/<style>[\s\S]*?<\/style>/, `<style>\n${newCss.trim()}\n</style>`);
fs.writeFileSync(file, content);
console.log('Update Script executed successfully');

import { useState, useEffect, useRef } from "react";
import { Link } from 'react-router-dom';
import { db } from '../../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { saveProgress } from './HDBProgress';
import { playSuccess, playError, playTick, playBadge } from './HDBAudio';
import HDBTerminalLoader from './HDBTerminalLoader';
import './HackersDoBem.css';

const QUESTIONS_POOL = [
  // Avaliações de Segurança
  { type:"choice", category:"AVALIAÇÃO", text:"Segundo o NIST (SP 800-115), quais são as três atividades principais em avaliações de segurança?", answers:["Codificar, Testar e Publicar.","Testar (objetos), Examinar (de documentos) e Entrevistar (pessoal).","Atacar, Defender e Reportar.","Bloquear, Filtrar e Monitorar."], correct:1, feedback:"O NIST define essas 3 ações como a base para qualquer avaliação técnica.", points:5 },
  { type:"choice", category:"AVALIAÇÃO", text:"Qual é o foco principal de uma 'Verificação de Vulnerabilidades'?", answers:["Identificar, avaliar e analisar fraquezas e falhas de segurança em sistemas e redes.","Invadir o sistema para roubar dados de teste.","Monitorar o desempenho dos servidores.","Treinar funcionários em engenharia social."], correct:0, feedback:"A verificação busca as falhas antes que elas sejam exploradas.", points:5 },
  { type:"choice", category:"AVALIAÇÃO", text:"Sobre verificações manuais vs automatizadas, é correto afirmar que:", answers:["As automatizadas são sempre melhores e não precisam de revisão.","As manuais são desnecessárias em sistemas complexos.","As manuais podem identificar vulnerabilidades que ferramentas automáticas (scanners) não detectam.","Ferramentas automatizadas nunca geram erros."], correct:2, feedback:"Testes manuais exigem especialização e pegam falhas de lógica que scanners automáticos 'passam direto'.", points:5 },
  // CVE
  { type:"choice", category:"CVE", text:"O sistema global que fornece um método comum de identificação e nomeação de vulnerabilidades conhecidas é o:", answers:["CVS (Code Versioning System)","NIST Framework","CVE (Common Vulnerabilities and Exposures)","WHOIS database"], correct:2, feedback:"O CVE é mantido pela MITRE Corporation e é o padrão da indústria.", points:5 },
  { type:"choice", category:"CVE", text:"Qual é o formato padrão do identificador de uma vulnerabilidade no sistema CVE?", answers:["VULN-####-####","CVE-YYYY-#### (Ex: CVE-2024-1234)","IP-ADDR-YYYY","SECURITY-LEVEL-##"], correct:1, feedback:"O identificador inclui o prefixo CVE, o ano da descoberta e um número sequencial.", points:5 },
  // Intrusiva vs Não Intrusiva
  { type:"choice", category:"TECNICAS", text:"Uma varredura INTRUSIVA (ou ativa) se caracteriza por:", answers:["Apenas analisar o tráfego de rede passivamente sem interagir.","Ter ações que podem impactar o sistema (ex: travar serviços) e fazer exploração real de falhas.","Pesquisar apenas em fontes públicas como o Google.","Não exigir conexão de rede com o alvo."], correct:1, feedback:"Varreduras intrusivas devem ser feitas com cautela e em ambientes controlados.", points:5 },
  { type:"choice", category:"TECNICAS", text:"A principal vantagem de uma varredura NÃO INTRUSIVA (passiva) é:", answers:["Detectar TODAS as falhas internas do sistema.","Ser segura e não causar interrupções ou lentidão nos serviços.","Garantir acesso administrativo total ao servidor.","Explorar automaticamente todas as portas abertas."], correct:1, feedback:"São 'seguras' porque analisam evidências indiretas ou configurações sem forçar a entrada.", points:5 },
  // Credenciada vs Não Credenciada
  { type:"choice", category:"CREDENCIAIS", text:"Sobre varreduras 'Não Credenciadas', qual a principal perspectiva?", answers:["Visão de um usuário interno com senha de administrador.","Visão de um observador externo/invasor que não possui permissões no sistema.","Visão completa do código fonte do aplicativo.","Não existe varredura sem credencial."], correct:1, feedback:"Ela testa o que um hacker externo veria ao tentar atacar sua rede 'por fora'.", points:5 },
  { type:"choice", category:"CREDENCIAIS", text:"Por que realizar varreduras 'Credenciadas'?", answers:["Para gastar menos tempo com senhas.","Para permitir acesso a áreas profundas, facilitando a identificação de problemas de configuração e patches faltantes.","Para evitar que o firewall bloqueie o scanner.","Não há vantagem, são menos precisas."], correct:1, feedback:"Com login, o scanner consegue ver por dentro do sistema se as configurações estão corretas.", points:5 },
  // Falsos Positivos e Logs
  { type:"choice", category:"RESULTADOS", text:"O termo 'Falso Positivo' em segurança da informação ocorre quando:", answers:["O sistema é invadido mas o admin não percebe.","Uma vulnerabilidade real não é detectada pela ferramenta.","A ferramenta identifica erroneamente uma vulnerabilidade que NÃO existe na realidade.","O invasor limpa os logs do sistema."], correct:2, feedback:"Falsos positivos geram desperdício de tempo investigando problemas inexistentes.", points:5 },
  { type:"choice", category:"RESULTADOS", text:"A 'Análise de Logs' após uma varredura serve para:", answers:["Deletar registros de ataques para limpar o sistema.","Confirmar os resultados e ajudar a distinguir entre falsos positivos e fragilidades reais.","Aumentar o desempenho da rede.","Criar novas senhas para os usuários."], correct:1, feedback:"Logs são a 'caixa preta' do sistema que prova o que realmente aconteceu.", points:5 },
  
  // Forca
  { type:"hangman", category:"TECNICAS", text:"Uso de software especializado (Nmap, Nessus) para procurar falhas sem intervenção humana constante.", answer:"AUTOMATIZADA", feedback:"Ferramentas automatizadas são rápidas, mas precisam de assinaturas atualizadas.", points:10 },
  { type:"hangman", category:"CVE", text:"Organização que mantém e gerencia o sistema CVE.", answer:"MITRE", feedback:"A MITRE Corporation é uma organização sem fins lucrativos que gerencia o CVE.", points:10 },
  { type:"hangman", category:"RESULTADOS", text:"Quando uma vulnerabilidade real presente no sistema NÃO é detectada pelo teste.", answer:"FALSO NEGATIVO", feedback:"Falsos negativos são perigosos porque dão uma falsa sensação de segurança.", points:10 },
  // Anagramas
  { type:"scrambled", category:"TECNICAS", text:"Exploração de rede para descobrir hosts, topologia e portas abertas.", answer:"VARREDURA", feedback:"A varredura (scanning) é uma das fases iniciais de um teste de invasão.", points:8 },
  { type:"scrambled", category:"AVALIAÇÃO", text:"Tratamento de vulnerabilidades que consiste em aplicar correções ou ajustes.", answer:"REVISAO", feedback:"A revisão de configuração é essencial para fechar brechas deixadas no padrão (default).", points:8 },
  { type:"scrambled", category:"TECNICAS", text:"Ferramenta clássica de mapeamento de rede e descoberta de portas.", answer:"NMAP", feedback:"O Nmap é talvez a ferramenta mais famosa e usada no mundo para scanners de rede.", points:8 },
];

const BADGES = [
  { id:'vulnerability_scout', emoji:'🔍', name:'Escoteiro de Falhas', desc:'Entendeu o conceito de verificação de vulnerabilidades', condition:(s)=>s.categories['AVALIAÇÃO']>=3 },
  { id:'cve_reporter', emoji:'📋', name:'Relator CVE', desc:'Conhece o padrão global de identificação de falhas', condition:(s)=>s.categories['CVE']>=2 },
  { id:'stealth_agent', emoji:'👤', name:'Agente Furtivo', desc:'Sabe a diferença entre varredura intrusiva e passiva', condition:(s)=>s.categories['TECNICAS']>=3 },
  { id:'hangman_pro', emoji:'🪢', name:'Mestre da Forca', desc:'Venceu 3 desafios de forca', condition:(s)=>s.types['hangman']>=3 },
  { id:'unscrambler', emoji:'🧩', name:'Decifrador de Redes', desc:'Resolveu os anagramas de detecção', condition:(s)=>s.types['scrambled']>=2 },
  { id:'m3_certified', emoji:'🎯', name:'Perito em Identificação', desc:'Completou o Módulo 03', condition:(s)=>s.finished },
];

function HangmanGame({ target, onComplete, disabled }) {
  const [guessed, setGuessed] = useState([]);
  const word = target.toUpperCase();
  const letters = word.split('');
  const uniqueLetters = [...new Set(word.replace(/ /g,'').replace(/[0-9]/g,'').split(''))];
  const mistakes = guessed.filter(l=>l!==' '&&!uniqueLetters.includes(l)).length;
  const maxMistakes = 6;
  const isWon = uniqueLetters.every(l=>guessed.includes(l));
  const isLost = mistakes>=maxMistakes;
  useEffect(()=>{ if(isWon)onComplete(true); if(isLost)onComplete(false); },[isWon,isLost]);
  const alphabet="ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  return (
    <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:20}}>
      <div style={{fontFamily:'monospace',fontSize:20,color:'#FF5252',lineHeight:1.2,textAlign:'left',width:100}}>
        <pre>{`  +---+ \n  |   | \n  ${mistakes>0?'O':' '}   | \n ${mistakes>2?'/':' '}${mistakes>1?'|':' '}${mistakes>3?'\\':' '}  | \n ${mistakes>4?'/':' '} ${mistakes>5?'\\':' '}  | \n      | \n=========`}</pre>
      </div>
      <div style={{display:'flex',flexWrap:'wrap',gap:8,justifyContent:'center'}}>
        {letters.map((l,i)=>(
          <div key={i} style={{width:l===' '||l.match(/[0-9]/)?20:30,height:40,borderBottom:l===' '?'none':'2px solid #00E676',fontSize:24,fontWeight:700,display:'flex',alignItems:'center',justifyContent:'center',color:guessed.includes(l)||isLost||l.match(/[0-9]/)?(uniqueLetters.includes(l)||l.match(/[0-9]/)?'#00E676':'#FF5252'):'transparent'}}>
            {l===' '?' ':(guessed.includes(l)||isLost||l.match(/[0-9]/)?l:'')}
          </div>
        ))}
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(9,1fr)',gap:4,width:'100%',maxWidth:400}}>
        {alphabet.map(l=>{
          const isGuessed=guessed.includes(l);
          return(<button key={l} onClick={()=>!isGuessed&&!disabled&&setGuessed(g=>[...g,l])} disabled={isGuessed||isLost||isWon||disabled} style={{padding:'8px 0',borderRadius:4,border:'1px solid rgba(255,255,255,0.1)',background:isGuessed?(uniqueLetters.includes(l)?'rgba(0,230,118,0.2)':'rgba(255,82,82,0.2)'):'rgba(255,255,255,0.05)',color:isGuessed?(uniqueLetters.includes(l)?'#00E676':'#FF5252'):'#fff',fontSize:12,fontWeight:700,cursor:isGuessed||disabled?'default':'pointer'}}>{l}</button>);
        })}
      </div>
    </div>
  );
}

function ScrambledGame({ target, onComplete, disabled }) {
  const word = target.replace(/ /g,'').toUpperCase();
  const [input,setInput]=useState("");
  const scrambled=useRef(word.split('').sort(()=>Math.random()-0.5).join('')).current;
  const handleSubmit=(e)=>{ e.preventDefault(); if(disabled)return; onComplete(input.toUpperCase()===word); };
  return (
    <form onSubmit={handleSubmit} style={{textAlign:'center'}}>
      <div style={{letterSpacing:8,fontSize:32,fontWeight:900,color:'#00D676',marginBottom:20}}>{scrambled}</div>
      <input type="text" value={input} onChange={e=>setInput(e.target.value)} disabled={disabled} placeholder="DECIFRE A PALAVRA..."
        style={{width:'100%',padding:15,borderRadius:10,background:'#0A0A0F',border:'1px solid #333',color:'#fff',textAlign:'center',fontSize:18,fontWeight:700}}/>
    </form>
  );
}

export default function AtividadeHDBM03() {
  const [screen,setScreen]=useState("intro");
  const [questions,setQuestions]=useState([]);
  const [currentQ,setCurrentQ]=useState(0);
  const [score,setScore]=useState(0);
  const [timeLeft,setTimeLeft]=useState(180);
  const [playerName,setPlayerName]=useState("");
  const [showFeedback,setShowFeedback]=useState(false);
  const [isCorrect,setIsCorrect]=useState(false);
  const [earnedBadges,setEarnedBadges]=useState([]);
  const [stats,setStats]=useState({categories:{},types:{},finished:false});
  const [duration,setDuration]=useState(0);
  const [showBadge,setShowBadge]=useState(false);
  const timerRef=useRef(null);

  useEffect(()=>{
    if(screen==="quiz"){
      timerRef.current=setInterval(()=>{
        setTimeLeft(t=>{ if(t<=1){handleComplete(false);return 0;} if(t<=10)playTick(); return t-1; });
        setDuration(d=>d+1);
      },1000);
      return()=>clearInterval(timerRef.current);
    }
  },[screen]);

  const startChallenge=()=>{ if(!playerName.trim())return; setScreen("bypass"); };
  const onBypassComplete=()=>{ setQuestions([...QUESTIONS_POOL].sort(()=>Math.random()-0.5).slice(0,17)); setScreen("quiz"); };

  const handleComplete=(correct)=>{
    if(showFeedback)return;
    setIsCorrect(correct); setShowFeedback(true);
    const q=questions[currentQ];
    const newStats={...stats};
    if(correct){ playSuccess(); setScore(s=>s+q.points); newStats.categories[q.category]=(newStats.categories[q.category]||0)+1; newStats.types[q.type]=(newStats.types[q.type]||0)+1; }
    else playError();
    setStats(newStats);
    const newBadges=BADGES.filter(b=>!earnedBadges.includes(b.id)&&b.condition(newStats));
    if(newBadges.length>0){ playBadge(); setEarnedBadges(prev=>[...prev,...newBadges.map(b=>b.id)]); }
  };

  const nextQuestion=()=>{
    if(currentQ+1<questions.length){ setCurrentQ(c=>c+1); setShowFeedback(false); setTimeLeft(180); }
    else finishGame();
  };

  const finishGame=async()=>{
    const finalStats={...stats,finished:true};
    const finalBadges=BADGES.filter(b=>b.condition(finalStats)).map(b=>b.id);
    setScreen("result"); setEarnedBadges(finalBadges);
    saveProgress("HDB_M03",finalBadges,score); playBadge();
    try{ await addDoc(collection(db,"fametro_ranking"),{name:playerName,score,duration:duration*1000,module:"HDB_M03",badges:finalBadges,timestamp:serverTimestamp()}); }
    catch(err){ console.warn("Ranking Error:",err); }
  };

  if(screen==="intro") return (
    <div className="hdb-scanlines" style={{minHeight:'100vh',background:'#0A0A0F',color:'#fff',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:20,fontFamily:'var(--hdb-main-font)'}}>
      <div className="hdb-card" style={{maxWidth:500,textAlign:'center',background:'#13131A',padding:40,borderRadius:20,border:'1px solid #2A2A35',boxShadow:'0 20px 50px rgba(0,0,0,0.5)'}}>
        <div style={{fontSize:60,marginBottom:20}}>🎯</div>
        <h1 style={{fontSize:28,fontWeight:900,marginBottom:10}}>Identificação de Ameaças</h1>
        <h2 style={{fontSize:13,color:'#00FF88',letterSpacing:3,marginBottom:30,fontWeight:700}}>MÓDULO 03 · TÉCNICAS E MÉTODOS</h2>
        <p className="hdb-high-contrast" style={{marginBottom:35,lineHeight:1.6,fontSize:16}}>
          Aprenda a caçar vulnerabilidades! Domine varreduras intrusivas, o padrão CVE e a análise técnica de resultados reais.
        </p>
        <input type="text" placeholder="ID DO AGENTE" value={playerName} onChange={e=>setPlayerName(e.target.value)}
          style={{width:'100%',padding:15,borderRadius:10,border:'1px solid #333',background:'#0A0A0F',color:'#fff',marginBottom:20,textAlign:'center',fontSize:16}}/>
        <button onClick={startChallenge} style={{width:'100%',padding:18,borderRadius:10,border:'none',background:'#00FF88',color:'#000',fontWeight:900,fontSize:16,cursor:'pointer'}}>INICIAR DETECÇÃO</button>
        <Link to="/hackersdobem" style={{display:'block',marginTop:20,color:'#666',textDecoration:'none',fontSize:12}}>VOLTAR PARA O HUB →</Link>
      </div>
    </div>
  );

  if(screen==="quiz"){
    const q=questions[currentQ];
    return (
      <div className="hdb-scanlines" style={{minHeight:'100vh',background:'#0A0A12',color:'#fff',padding:'100px 20px',fontFamily:'var(--hdb-main-font)'}}>
        <div style={{maxWidth:800,margin:'0 auto'}}>
          <div style={{display:'flex',justifyContent:'space-between',marginBottom:20,background:'#13131A',padding:'15px 25px',borderRadius:15,border:'1px solid #2A2A35'}}>
            <div style={{color:'#00FF88',fontWeight:700}}>{playerName}</div>
            <div style={{color:timeLeft<30?'#FF5252':'#FFD600',fontFamily:'monospace',fontWeight:700}}>{Math.floor(timeLeft/60)}:{String(timeLeft%60).padStart(2,'0')}</div>
            <div style={{fontWeight:700}}>Score: {score}</div>
            <div style={{color:'rgba(255,255,255,0.4)'}}>{currentQ+1}/{questions.length}</div>
          </div>
          <div className="hdb-card" style={{background:'#13131A',padding:40,borderRadius:24,border:'1px solid #2A2A35',minHeight:450,display:'flex',flexDirection:'column'}}>
            <div style={{fontSize:11,color:'#00FF88',letterSpacing:3,marginBottom:15}}>{q.category} · {q.points} PTS</div>
            <h3 style={{fontSize:22,fontWeight:700,marginBottom:35,lineHeight:1.4}}>{q.text}</h3>
            <div style={{flex:1}}>
              {q.type==="choice"&&(
                <div style={{display:'grid',gridTemplateColumns:'minmax(0,1fr) minmax(0,1fr)',gap:15}}>
                  {q.answers.map((ans,i)=>(
                    <button key={i} onClick={()=>!showFeedback&&handleComplete(i===q.correct)} disabled={showFeedback} className="hdb-btn-neon"
                      style={{padding:20,borderRadius:12,border:'1px solid rgba(255,255,255,0.05)',background:showFeedback?(i===q.correct?'rgba(0,255,136,0.1)':'rgba(255,255,255,0.02)'):'rgba(255,255,255,0.03)',borderColor:showFeedback?(i===q.correct?'#00FF88':'rgba(255,82,82,0.5)'):'rgba(255,255,255,0.05)',color:'#eee',textAlign:'left',cursor:showFeedback?'default':'pointer',fontSize:15}}>{ans}</button>
                  ))}
                </div>
              )}
              {q.type==="hangman"&&<HangmanGame target={q.answer} onComplete={handleComplete} disabled={showFeedback}/>}
              {q.type==="scrambled"&&<ScrambledGame target={q.answer} onComplete={handleComplete} disabled={showFeedback}/>}
            </div>
            {showFeedback&&(
              <div style={{marginTop:40,animation:'fadeIn 0.4s'}}>
                <div style={{padding:25,borderRadius:15,background:isCorrect?'rgba(0,255,136,0.03)':'rgba(255,82,82,0.03)',borderLeft:`5px solid ${isCorrect?'#00FF88':'#FF5252'}`,marginBottom:25}}>
                  <div style={{fontWeight:900,color:isCorrect?'#00FF88':'#FF5252',fontSize:18,marginBottom:8}}>{isCorrect?"MISSION SUCCESS (+"+q.points+" pts)":"MISSION FAILED"}</div>
                  <div style={{color:'rgba(255,255,255,0.6)',lineHeight:1.5}}>{q.feedback}</div>
                </div>
                <button onClick={nextQuestion} style={{width:'100%',padding:20,borderRadius:12,border:'none',background:'#fff',color:'#000',fontWeight:900,fontSize:16,cursor:'pointer'}}>
                  {currentQ+1<questions.length?"PRÓXIMA FASE →":"ENCERRAR MISSÃO 🏆"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if(screen==="result") return (
    <div className="hdb-scanlines" style={{minHeight:'100vh',background:'#0A0A0F',color:'#fff',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:20,fontFamily:'var(--hdb-main-font)'}}>
      <div className="hdb-card" style={{maxWidth:650,width:'100%',textAlign:'center',background:'#13131A',padding:50,borderRadius:30,border:'1px solid #2A2A35',boxShadow:'0 30px 60px rgba(0,0,0,0.6)'}}>
        <div style={{fontSize:90,marginBottom:20}}>🏆</div>
        <h2 style={{fontSize:32,fontWeight:900,marginBottom:10}}>PONTUAÇÃO FINAL</h2>
        <div style={{fontSize:80,fontWeight:900,color:'#00FF88',textShadow:'0 0 30px rgba(0,255,136,0.4)',lineHeight:1}}>{score}</div>
        <div style={{color:'rgba(255,255,255,0.3)',margin:'20px 0 40px',letterSpacing:4}}>AGENTE {playerName.toUpperCase()}</div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:15,marginBottom:40}}>
          <div style={{background:'#0A0A0F',padding:20,borderRadius:15}}><div style={{fontSize:24,fontWeight:700}}>{questions.length}</div><div style={{fontSize:11,color:'#666'}}>QUESTÕES</div></div>
          <div style={{background:'#0A0A0F',padding:20,borderRadius:15}}><div style={{fontSize:24,fontWeight:700}}>{Math.floor(duration/60)}:{String(duration%60).padStart(2,'0')}</div><div style={{fontSize:11,color:'#666'}}>TEMPO</div></div>
          <div style={{background:'#0A0A0F',padding:20,borderRadius:15}}><div style={{fontSize:24,fontWeight:700}}>{earnedBadges.length}</div><div style={{fontSize:11,color:'#666'}}>BADGES</div></div>
        </div>
        <div style={{display:'flex',justifyContent:'center',gap:12,flexWrap:'wrap',marginBottom:40}}>
          {earnedBadges.map(bid=>{ const b=BADGES.find(x=>x.id===bid); if(!b)return null; return <div key={bid} title={b.desc} style={{background:'rgba(0,255,136,0.1)',color:'#00FF88',border:'1px solid rgba(0,255,136,0.3)',padding:'10px 20px',borderRadius:30,fontSize:12,fontWeight:700}}>{b.emoji} {b.name}</div>; })}
        </div>
        <div style={{display:'flex',gap:15}}>
          <button onClick={()=>setShowBadge(true)} style={{flex:1,padding:20,borderRadius:12,background:'rgba(0,255,136,0.1)',color:'#00FF88',border:'1px solid #00FF88',fontWeight:900,cursor:'pointer'}}>GERAR CREDENCIAL</button>
          <Link to="/hackersdobem" style={{flex:1,padding:20,borderRadius:12,background:'#00FF88',color:'#000',textDecoration:'none',fontWeight:900}}>HUB PRINCIPAL</Link>
        </div>
      </div>
      {showBadge&&(
        <div className="hdb-no-print" style={{position:'fixed',top:0,left:0,width:'100%',height:'100%',background:'rgba(0,0,0,0.9)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:30000,padding:20}}>
          <div className="hdb-badge-container hdb-badge-print">
            <div className="hdb-badge-head">
              <div style={{fontSize:10,letterSpacing:4,color:'#00FF88',marginBottom:5}}>SECURITY CLEARANCE: LEVEL 3</div>
              <div style={{fontSize:24,fontWeight:900,color:'#fff'}}>AGENTE ESPECIALISTA</div>
            </div>
            <div style={{display:'flex',gap:20,textAlign:'left',marginBottom:30}}>
              <div style={{width:100,height:120,background:'rgba(0,255,136,0.05)',border:'1px solid rgba(0,255,136,0.2)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:40,borderRadius:10}}>🎯</div>
              <div style={{flex:1}}>
                <div style={{fontSize:10,color:'rgba(255,255,255,0.4)',marginBottom:2}}>NOME DO AGENTE</div>
                <div style={{fontSize:20,fontWeight:900,color:'#fff',marginBottom:15}}>{playerName.toUpperCase()}</div>
                <div style={{fontSize:10,color:'rgba(255,255,255,0.4)',marginBottom:2}}>MISSÃO</div>
                <div style={{fontSize:12,color:'#00FF88'}}>MÓDULO 03: IDENTIFICAÇÃO DE AMEAÇAS</div>
              </div>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:30}}>
              <div style={{background:'rgba(255,255,255,0.03)',padding:10,borderRadius:8}}><div style={{fontSize:9,color:'rgba(255,255,255,0.3)'}}>SCORE TOTAL</div><div style={{fontSize:22,fontWeight:900,color:'#00FF88'}}>{score}</div></div>
              <div style={{background:'rgba(255,255,255,0.03)',padding:10,borderRadius:8}}><div style={{fontSize:9,color:'rgba(255,255,255,0.3)'}}>QUALIFICAÇÃO</div><div style={{fontSize:14,fontWeight:900,marginTop:5}}>APROVADO</div></div>
            </div>
            <div style={{fontSize:8,color:'rgba(255,255,255,0.2)',marginBottom:20}}>VERIFICADO POR ALEXSANDER FARIAS · 2026</div>
            <div className="hdb-no-print" style={{display:'flex',gap:10}}>
              <button onClick={()=>window.print()} style={{flex:1,padding:12,borderRadius:8,border:'none',background:'#fff',color:'#000',fontWeight:900,cursor:'pointer'}}>IMPRIMIR / PDF</button>
              <button onClick={()=>setShowBadge(false)} style={{padding:12,borderRadius:8,border:'1px solid rgba(255,255,255,0.1)',background:'transparent',color:'#fff',cursor:'pointer'}}>FECHAR</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  if(screen==="bypass") return (
    <div style={{height:'100vh',background:'#0A0A12'}}>
      <HDBTerminalLoader onComplete={onBypassComplete} message={`INVESTIGANDO ALVOS: ${playerName.toUpperCase()}...`}/>
    </div>
  );
  return null;
}

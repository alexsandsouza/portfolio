import { useState, useEffect, useRef } from "react";
import { Link } from 'react-router-dom';
import { db } from '../../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { saveProgress } from './HDBProgress';
import { playSuccess, playError, playTick, playBadge } from './HDBAudio';
import HDBTerminalLoader from './HDBTerminalLoader';
import './HackersDoBem.css';

const QUESTIONS_POOL = [
  // Tríade CID
  { type:"choice", category:"FUNDAMENTOS", text:"Qual é a Tríade fundamental (pilar) da Segurança da Informação?", answers:["Confiabilidade, Inteligência e Disponibilidade","Confidencialidade, Integridade e Disponibilidade","Controle, Integridade e Disponibilidade","Confidencialidade, Identidade e Defesa"], correct:1, feedback:"A tríade CID (ou CIA em inglês: Confidentiality, Integrity, Availability) é o coração da segurança.", points:5 },
  { type:"choice", category:"FUNDAMENTOS", text:"O princípio que garante que a informação só será acessada por pessoas autorizadas é a:", answers:["Integridade","Disponibilidade","Confidencialidade","Autenticidade"], correct:2, feedback:"A Confidencialidade protege os dados contra acessos indevidos.", points:5 },
  { type:"choice", category:"FUNDAMENTOS", text:"Quando os dados permanecem exatos, completos e não sofrem alterações indevidas ou não autorizadas, atingimos o princípio da:", answers:["Confidencialidade","Integridade","Disponibilidade","Não Repúdio"], correct:1, feedback:"A Integridade assegura que o sistema não foi corrompido, adulterado de forma indesejada.", points:5 },
  // Vulnerabilidades e Riscos
  { type:"choice", category:"RISCOS", text:"Como se chama uma fraqueza ou deficiência em um sistema que pode ser explorada para causar um dano?", answers:["Ameaça","Risco","Vulnerabilidade","Impacto"], correct:2, feedback:"Vulnerabilidade é o 'buraco' que permite que a Ameaça cause problemas.", points:5 },
  { type:"choice", category:"RISCOS", text:"Qual é a relação entre Vulnerabilidade, Ameaça e Risco?", answers:["Risco é a fraqueza, Ameaça é a exploração, Vulnerabilidade é o dano.","Risco é a probabilidade de uma Ameaça explorar uma Vulnerabilidade causando impacto.","São três palavras para o mesmo conceito técnico.","Ameaça causa a Vulnerabilidade e o Risco é a correção."], correct:1, feedback:"Uma ameaça só será um risco alto se houver uma vulnerabilidade associada e um impacto considerável.", points:5 },
  { type:"choice", category:"RISCOS", text:"Ao avaliar os riscos usando uma Matriz de Risco, quais fatores principais são levados em conta?", answers:["Tamanho do código e Linguagem.","Probabilidade de ocorrência e Impacto no negócio.","Orçamento do projeto e Recursos humanos.","Dias de resposta e Custo do antivírus."], correct:1, feedback:"A Matriz de risco prioriza as ameaças unindo a chande delas ocorrerem (Probabilidade) e o grau de dano se elas ocorrerem (Impacto).", points:5 },
  // NIST Framework
  { type:"choice", category:"FRAMEWORK", text:"Segundo o NIST Cybersecurity Framework, a função 'Identify' (Identificar) se refere a:", answers:["Identificar e analisar vírus espalhados no sistema.","Compreender o contexto do negócio, seus ativos, dados e os riscos da organização para gerenciá-los.","Impedir que uma exploração ocorra ativamente.","Criar backups de emergência."], correct:1, feedback:"Identificar é o primeiro passo: conhecer o que proteger, a Governança, a Avaliação de Riscos.", points:5 },
  { type:"choice", category:"FRAMEWORK", text:"Qual função do NIST envolve Controle de Acesso, Conscientização de Usuários e Manutenção da segurança?", answers:["Detectar","Proteger (Protect)","Responder","Recuperar"], correct:1, feedback:"Proteger aplica barreiras (como autenticação, firewall) para impedir a ameaça.", points:5 },
  { type:"choice", category:"FRAMEWORK", text:"O planejamento de como a empresa voltará a operar e restaurará os serviços e dados afetados após um ciberataque faz parte da função:", answers:["Identificar","Detectar","Recuperar (Recover)","Avaliar"], correct:2, feedback:"Recuperar é restaurar backups de infraestrutura, comunicação e lições aprendidas.", points:5 },
  
  // Forca
  { type:"hangman", category:"FUNDAMENTOS", text:"A garantia de que o autor de uma mensagem/ação não pode negar que a gerou. Princípio chamado 'Não ______'.", answer:"REPUDIO", feedback:"O Não Repúdio é vital nas transações digitais, muitas vezes estabelecido usando certificados e logs invioáveis.", points:10 },
  { type:"hangman", category:"FRAMEWORK", text:"Framework internacional padrão muito abordado no módulo, desenvolvido pelo Instituto Nacional de Padrões e Tecnologia dos EUA. Sigla de 4 letras.", answer:"NIST", feedback:"O NIST Cybersecurity Framework define 5 funções centrais: Identificar, Proteger, Detectar, Responder e Recuperar.", points:10 },
  { type:"hangman", category:"RISCOS", text:"Tratamento de risco em que você simplesmente escolhe viver com ele por ser improvável ou barato demais de contornar. (Aceitar, _ _ _ _) ?", answer:"ACEITAR", feedback:"As 4 ações de risco: Aceitar, Mitigar, Transferir (seguro) ou Evitar (não realizar a ação).", points:10 },
  // Anagramas
  { type:"scrambled", category:"FUNDAMENTOS", text:"Verificação da identidade de um usuário, garantindo que ele é quem diz ser.", answer:"AUTENTICACAO", feedback:"Autenticação prova quem você é (senha, biometria). Autorização define onde você tem acesso.", points:8 },
  { type:"scrambled", category:"RISCOS", text:"Estratégia de gerenciamento de riscos que foca em minimizar a probabilidade de falha ou o impacto (Verbo).", answer:"MITIGAR", feedback:"Mitigar é tomar ações reais para tentar que o golpe diminua seu estrago.", points:8 },
  { type:"scrambled", category:"FUNDAMENTOS", text:"Pilar do CID que afirma que os sistemas devem estar operando sob demanda quando os usuários precisarem.", answer:"DISPONIBILIDADE", feedback:"Ataques como DDoS visam exatamente quebrar a Disponibilidade do sistema.", points:8 },
];

const BADGES = [
  { id:'cid_master', emoji:'🛡️', name:'Guardião da Tríade', desc:'Entendeu o conceito de C.I.D.', condition:(s)=>s.categories['FUNDAMENTOS']>=3 },
  { id:'risk_analyst', emoji:'📉', name:'Analista de Risco', desc:'Sabe gerenciar e classificar riscos', condition:(s)=>s.categories['RISCOS']>=2 },
  { id:'nist_expert', emoji:'🏛️', name:'Framework Expert', desc:'Dominou o framework NIST', condition:(s)=>s.categories['FRAMEWORK']>=2 },
  { id:'hangman_pro', emoji:'🪢', name:'Mestre da Forca', desc:'Venceu 3 desafios de forca', condition:(s)=>s.types['hangman']>=3 },
  { id:'unscrambler', emoji:'🧩', name:'Decifrador', desc:'Resolveu os anagramas P1', condition:(s)=>s.types['scrambled']>=2 },
  { id:'m1_certified', emoji:'📜', name:'Fundamentos da Segurança', desc:'Completou o Módulo 01', condition:(s)=>s.finished },
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

export default function AtividadeHDBM01() {
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
  const onBypassComplete=()=>{ setQuestions([...QUESTIONS_POOL].sort(()=>Math.random()-0.5).slice(0,15)); setScreen("quiz"); };

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
    saveProgress("HDB_M01",finalBadges,score); playBadge();
    try{ await addDoc(collection(db,"fametro_ranking"),{name:playerName,score,duration:duration*1000,module:"HDB_M01",badges:finalBadges,timestamp:serverTimestamp()}); }
    catch(err){ console.warn("Ranking Error:",err); }
  };

  if(screen==="intro") return (
    <div className="hdb-scanlines" style={{minHeight:'100vh',background:'#0A0A0F',color:'#fff',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:20,fontFamily:'var(--hdb-main-font)'}}>
      <div className="hdb-card" style={{maxWidth:500,textAlign:'center',background:'#13131A',padding:40,borderRadius:20,border:'1px solid #2A2A35',boxShadow:'0 20px 50px rgba(0,0,0,0.5)'}}>
        <div style={{fontSize:60,marginBottom:20}}>🔰</div>
        <h1 style={{fontSize:28,fontWeight:900,marginBottom:10}}>Princípios da Segurança</h1>
        <h2 style={{fontSize:13,color:'#00FF88',letterSpacing:3,marginBottom:30,fontWeight:700}}>MÓDULO 01 · A INTRODUÇÃO</h2>
        <p className="hdb-high-contrast" style={{marginBottom:35,lineHeight:1.6,fontSize:16}}>
          Domine os fundamentos! A Tríade CID, a matriz de riscos e as recomendações do framework NIST para defesa cibernética.
        </p>
        <input type="text" placeholder="ID DO AGENTE" value={playerName} onChange={e=>setPlayerName(e.target.value)}
          style={{width:'100%',padding:15,borderRadius:10,border:'1px solid #333',background:'#0A0A0F',color:'#fff',marginBottom:20,textAlign:'center',fontSize:16}}/>
        <button onClick={startChallenge} style={{width:'100%',padding:18,borderRadius:10,border:'none',background:'#00FF88',color:'#000',fontWeight:900,fontSize:16,cursor:'pointer'}}>INICIAR RECRUTAMENTO</button>
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
              <div style={{fontSize:10,letterSpacing:4,color:'#00FF88',marginBottom:5}}>SECURITY CLEARANCE: RECRUIT</div>
              <div style={{fontSize:24,fontWeight:900,color:'#fff'}}>AGENTE NOVATO</div>
            </div>
            <div style={{display:'flex',gap:20,textAlign:'left',marginBottom:30}}>
              <div style={{width:100,height:120,background:'rgba(0,255,136,0.05)',border:'1px solid rgba(0,255,136,0.2)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:40,borderRadius:10}}>🔰</div>
              <div style={{flex:1}}>
                <div style={{fontSize:10,color:'rgba(255,255,255,0.4)',marginBottom:2}}>NOME DO AGENTE</div>
                <div style={{fontSize:20,fontWeight:900,color:'#fff',marginBottom:15}}>{playerName.toUpperCase()}</div>
                <div style={{fontSize:10,color:'rgba(255,255,255,0.4)',marginBottom:2}}>MISSÃO</div>
                <div style={{fontSize:12,color:'#00FF88'}}>MÓDULO 01: PRINCÍPIOS DE SEGURANÇA</div>
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
      <HDBTerminalLoader onComplete={onBypassComplete} message={`ANALISANDO RECRUTA: ${playerName.toUpperCase()}...`}/>
    </div>
  );
  return null;
}

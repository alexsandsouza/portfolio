import { useState, useEffect, useRef } from "react";
import { Link } from 'react-router-dom';
import { db } from '../../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { saveProgress } from './HDBProgress';
import { playSuccess, playError, playTick, playBadge } from './HDBAudio';
import HDBTerminalLoader from './HDBTerminalLoader';
import './HackersDoBem.css';

const QUESTIONS_POOL = [
  // Aula 01 - Tipos de Contas e IAM
  { type:"choice", category:"IAM", text:"Qual é o principal objetivo do IAM (Identity and Access Management)?", answers:["Gerenciar redes Wi-Fi corporativas","Controlar quem pode acessar quais recursos e quando","Monitorar o tráfego de rede em tempo real","Criptografar todos os arquivos da empresa"], correct:1, feedback:"IAM gerencia identidades digitais e regula o acesso a sistemas, dados e aplicações dentro de uma organização.", points:5 },
  { type:"choice", category:"IAM", text:"O processo de criação de acesso e configuração de conta para um novo funcionário é chamado de:", answers:["Offboarding","Provisioning (Onboarding)","Deprovisioning","Account Lockout"], correct:1, feedback:"Onboarding / Provisioning é o ciclo de criação, configuração e concessão de acessos para novos usuários.", points:5 },
  { type:"choice", category:"IAM", text:"O processo de revogação de acessos e encerramento de conta ao desligar um funcionário é chamado de:", answers:["Onboarding","Account Review","Deprovisioning (Offboarding)","Privilege Escalation"], correct:2, feedback:"Deprovisioning garante que ex-funcionários não mantenham acessos indevidos após o desligamento.", points:5 },
  { type:"choice", category:"IAM", text:"Contas de serviço são utilizadas para:", answers:["Login de funcionários comuns","Acesso físico ao data center","Execução automatizada de processos e aplicações","Armazenar senhas dos usuários"], correct:2, feedback:"Contas de serviço executam aplicações, scripts e serviços sem interação humana direta.", points:5 },
  // Aula 02 - Atributos e Geofencing
  { type:"choice", category:"ATRIBUTOS", text:"A técnica que limita o acesso a sistemas com base na localização geográfica do usuário é:", answers:["Biometria","Geofencing","Captcha","Token de Hardware"], correct:1, feedback:"Geofencing define perímetros geográficos virtuais para controlar de onde os usuários podem acessar sistemas.", points:5 },
  { type:"choice", category:"ATRIBUTOS", text:"O princípio de segurança que garante que cada usuário receba apenas os acessos estritamente necessários para sua função é chamado de:", answers:["Privilégio Total","Menor Privilégio (Least Privilege)","Acesso Universal","Segregação de Rede"], correct:1, feedback:"O Princípio do Menor Privilégio reduz a superfície de ataque ao limitar permissões ao mínimo necessário.", points:5 },
  { type:"choice", category:"ATRIBUTOS", text:"A auditoria de contas tem como objetivo principal:", answers:["Criar novas contas em lote","Revisar e validar se os acessos concedidos ainda são necessários e apropriados","Bloquear usuários inativos automaticamente","Redefinir senhas de todos os usuários"], correct:1, feedback:"A auditoria periódica de contas garante que os acessos permaneçam alinhados com as necessidades reais de cada função.", points:5 },
  // Aula 03 - Modelos de Autorização
  { type:"choice", category:"AUTORIZACAO", text:"No modelo RBAC (Role-Based Access Control), o acesso é concedido com base em:", answers:["Identidade individual do usuário","Hora do dia","Função/Papel do usuário na organização","Localização geográfica"], correct:2, feedback:"No RBAC, permissões são atribuídas a papéis (roles) e usuários recebem acessos ao assumirem esses papéis.", points:5 },
  { type:"choice", category:"AUTORIZACAO", text:"No modelo MAC (Mandatory Access Control), quem define os níveis de acesso aos recursos?", answers:["O próprio usuário","O administrador do sistema","A política central da organização / Sistema Operacional","O fornecedor do software"], correct:2, feedback:"No MAC, a política de segurança é definida centralmente pelo sistema e usuários não podem alterar seus próprios acessos.", points:5 },
  { type:"choice", category:"AUTORIZACAO", text:"O protocolo SAML (Security Assertion Markup Language) é utilizado principalmente para:", answers:["Criptografia de discos rígidos","Autenticação federada e Single Sign-On (SSO)","Varredura de vulnerabilidades em redes","Gerenciamento de firewalls"], correct:1, feedback:"SAML permite que um provedor de identidade (IdP) autentique usuários e transmita as credenciais a provedores de serviços (SP).", points:5 },
  { type:"choice", category:"AUTORIZACAO", text:"O protocolo OAuth 2.0 é amplamente usado para:", answers:["Criptografar comunicações de rede","Autorizar aplicações de terceiros a acessar recursos sem compartilhar senha","Gerenciar certificados digitais","Monitorar logs de sistema"], correct:1, feedback:"OAuth delega autorização de acesso a recursos protegidos sem expor credenciais do usuário a terceiros.", points:5 },
  { type:"choice", category:"AUTORIZACAO", text:"No modelo DAC (Discretionary Access Control), quem controla as permissões de acesso aos recursos?", answers:["O sistema operacional de forma automática","O departamento de TI exclusivamente","O próprio dono/criador do recurso","O fornecedor do aplicativo"], correct:2, feedback:"No DAC, o proprietário do recurso decide quem pode acessá-lo, o que pode levar a configurações inconsistentes.", points:5 },
  // Aula 04 - Políticas de Pessoal
  { type:"choice", category:"POLITICAS", text:"O uso de tecnologia (apps, serviços cloud, dispositivos) por funcionários sem autorização da empresa é chamado de:", answers:["BYOD","Shadow IT","Geofencing","Account Harvesting"], correct:1, feedback:"Shadow IT representa um risco significativo pois escapa dos controles de segurança corporativos.", points:5 },
  { type:"choice", category:"POLITICAS", text:"A sigla BYOD significa:", answers:["Bring Your Own Data","Build Your Own Device","Bring Your Own Device","Buy Your Own Domain"], correct:2, feedback:"BYOD (Bring Your Own Device) é a política que regula o uso de dispositivos pessoais no ambiente de trabalho corporativo.", points:5 },
  { type:"choice", category:"POLITICAS", text:"A Política de Mesa Limpa tem como objetivo principal:", answers:["Manter o escritório organizado visualmente","Minimizar o risco de acesso a informações físicas deixadas nos locais de trabalho","Garantir que monitores sejam desligados ao fim do dia","Regular o uso de impressoras"], correct:1, feedback:"A Política de Mesa Limpa exige que documentos sensíveis sejam guardados e que telas sejam bloqueadas quando o usuário se afasta.", points:5 },
  // Hangman - Forca
  { type:"hangman", category:"IAM", text:"Processo de verificar a identidade digital de um usuário antes de conceder acesso ao sistema.", answer:"AUTENTICACAO", feedback:"Autenticação confirma QUEM você é. Autorização define O QUE você pode fazer após a autenticação.", points:10 },
  { type:"hangman", category:"AUTORIZACAO", text:"Técnica de segurança que exige a separação de responsabilidades críticas entre diferentes usuários para evitar fraudes.", answer:"SEGREGACAO", feedback:"A Segregação de Funções é um controle fundamental: nenhum único usuário deve controlar uma transação do início ao fim.", points:10 },
  { type:"hangman", category:"POLITICAS", text:"Campanha de simulação de ataque enviada internamente para treinar funcionários a identificar e-mails maliciosos.", answer:"PHISHING", feedback:"Campanhas de phishing simulado são fundamentais para medir e melhorar a consciência de segurança da equipe.", points:10 },
  // Anagramas - Scramble
  { type:"scrambled", category:"AUTORIZACAO", text:"Padrão de autorização que permite que aplicativos acessem recursos em nome do usuário sem revelar credenciais.", answer:"OAUTH", feedback:"OAuth 2.0 é a base de autorização de muitas integrações modernas — como 'Entrar com Google' em aplicativos de terceiros.", points:8 },
  { type:"scrambled", category:"IAM", text:"Modelo de segurança chamado 'Confiança Zero', que nunca presume acesso legítimo sem verificação contínua.", answer:"ZEROTRUST", feedback:"Zero Trust assume que qualquer rede, interna ou externa, é potencialmente hostil e exige verificação contínua.", points:8 },
];

const BADGES = [
  { id:'iam_master', emoji:'🪪', name:'Mestre do IAM', desc:'Dominou Identidade e Acesso', condition:(s)=>s.categories['IAM']>=3 },
  { id:'author_king', emoji:'🔑', name:'Rei da Autorização', desc:'Entendeu RBAC, MAC e DAC', condition:(s)=>s.categories['AUTORIZACAO']>=3 },
  { id:'policy_guard', emoji:'📋', name:'Guardião de Políticas', desc:'Conhece as Políticas de Pessoal', condition:(s)=>s.categories['POLITICAS']>=2 },
  { id:'hangman_pro', emoji:'🪢', name:'Mestre da Forca', desc:'Venceu 3 desafios de forca', condition:(s)=>s.types['hangman']>=3 },
  { id:'unscrambler', emoji:'🧩', name:'Decifrador', desc:'Resolveu os anagramas M5', condition:(s)=>s.types['scrambled']>=2 },
  { id:'m5_certified', emoji:'📜', name:'Identidades & Contas', desc:'Completou o Módulo 05', condition:(s)=>s.finished },
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

export default function AtividadeHDBM05() {
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
    saveProgress("HDB_M05",finalBadges,score); playBadge();
    try{ await addDoc(collection(db,"fametro_ranking"),{name:playerName,score,duration:duration*1000,module:"HDB_M05",badges:finalBadges,timestamp:serverTimestamp()}); }
    catch(err){ console.warn("Ranking Error:",err); }
  };

  if(screen==="intro") return (
    <div className="hdb-scanlines" style={{minHeight:'100vh',background:'#0A0A0F',color:'#fff',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:20,fontFamily:'var(--hdb-main-font)'}}>
      <div className="hdb-card" style={{maxWidth:500,textAlign:'center',background:'#13131A',padding:40,borderRadius:20,border:'1px solid #2A2A35',boxShadow:'0 20px 50px rgba(0,0,0,0.5)'}}>
        <div style={{fontSize:60,marginBottom:20}}>🪪</div>
        <h1 style={{fontSize:28,fontWeight:900,marginBottom:10}}>Gerenciamento de Identidades</h1>
        <h2 style={{fontSize:13,color:'#00FF88',letterSpacing:3,marginBottom:30,fontWeight:700}}>MÓDULO 05 · AULAS 01 A 04</h2>
        <p className="hdb-high-contrast" style={{marginBottom:35,lineHeight:1.6,fontSize:16}}>
          Domine IAM, Onboarding/Offboarding, RBAC, MAC, DAC, OAuth, SAML e Políticas de Pessoal.
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
              <div style={{fontSize:10,letterSpacing:4,color:'#00FF88',marginBottom:5}}>SECURITY CLEARANCE: IDENTITY MANAGER</div>
              <div style={{fontSize:24,fontWeight:900,color:'#fff'}}>GESTOR DE IDENTIDADES</div>
            </div>
            <div style={{display:'flex',gap:20,textAlign:'left',marginBottom:30}}>
              <div style={{width:100,height:120,background:'rgba(0,255,136,0.05)',border:'1px solid rgba(0,255,136,0.2)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:40,borderRadius:10}}>🪪</div>
              <div style={{flex:1}}>
                <div style={{fontSize:10,color:'rgba(255,255,255,0.4)',marginBottom:2}}>NOME DO AGENTE</div>
                <div style={{fontSize:20,fontWeight:900,color:'#fff',marginBottom:15}}>{playerName.toUpperCase()}</div>
                <div style={{fontSize:10,color:'rgba(255,255,255,0.4)',marginBottom:2}}>MISSÃO</div>
                <div style={{fontSize:12,color:'#00FF88'}}>MÓDULO 05: GERENCIAMENTO DE IDENTIDADES E CONTAS</div>
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
      <HDBTerminalLoader onComplete={onBypassComplete} message={`ANALISANDO AGENTE: ${playerName.toUpperCase()}...`}/>
    </div>
  );
  return null;
}

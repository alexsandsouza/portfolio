import { useState, useEffect, useRef } from "react";
import { Link } from 'react-router-dom';
import { db } from '../../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { saveProgress } from './HDBProgress';
import { playSuccess, playError, playTick, playBadge } from './HDBAudio';
import HDBTerminalLoader from './HDBTerminalLoader';
import './HackersDoBem.css';

const QUESTIONS_POOL = [
  // RAID e Redundância
  { type:"choice", category:"RAID", text:"Qual nível de RAID divide dados em blocos e os distribui em múltiplos discos para melhorar desempenho, mas NÃO oferece tolerância a falhas?", answers:["RAID 1","RAID 5","RAID 0","RAID 6"], correct:2, feedback:"RAID 0 (Striping) melhora desempenho mas a falha de qualquer disco resulta em perda total dos dados.", points:5 },
  { type:"choice", category:"RAID", text:"O RAID 1 é conhecido como:", answers:["Striping","Espelhamento (Mirroring)","Paridade Distribuída","Striping com Paridade Dupla"], correct:1, feedback:"RAID 1 cria cópia idêntica dos dados em dois ou mais discos — se um falhar, o outro assume.", points:5 },
  { type:"choice", category:"RAID", text:"Qual configuração RAID combina os conceitos do RAID 0 e RAID 1, oferecendo alta performance E redundância?", answers:["RAID 5","RAID 6","RAID 10 (1+0)","RAID 3"], correct:2, feedback:"RAID 10 faz striping de conjuntos espelhados, trazendo velocidade do RAID 0 com a segurança do RAID 1.", points:5 },
  { type:"choice", category:"RAID", text:"Qual nível de RAID utiliza paridade DUPLA, permitindo a recuperação mesmo se 2 discos falharem ao mesmo tempo?", answers:["RAID 5","RAID 6","RAID 1","RAID 0"], correct:1, feedback:"RAID 6 distribui dois conjuntos de paridade, sendo mais tolerante a falhas que o RAID 5.", points:5 },
  // Backup
  { type:"choice", category:"BACKUP", text:"Qual tipo de backup copia SOMENTE os arquivos alterados desde o ÚLTIMO BACKUP (seja completo ou incremental anterior)?", answers:["Backup Completo","Backup Diferencial","Backup Incremental","Backup Espelhado"], correct:2, feedback:"Backup Incremental copia apenas as mudanças desde o último backup de qualquer tipo, ocupando menos espaço.", points:5 },
  { type:"choice", category:"BACKUP", text:"Um backup que captura TODOS os arquivos alterados desde o último backup COMPLETO (ignorando incrementais anteriores) é chamado de:", answers:["Incremental","Diferencial","Espelhado","Contínuo"], correct:1, feedback:"Backup Diferencial sempre referencia o último Full, acumulando alterações até o próximo Full.", points:5 },
  { type:"choice", category:"BACKUP", text:"Qual tecnologia de backup cria réplicas identificadas (snapshots) de discos inteiros, incluindo SO e configurações, em um arquivo de imagem?", answers:["Backup Local","Backup Incremental","Backup de Imagem (Image Backup)","NAS"], correct:2, feedback:"Image Backup captura o estado completo do sistema em um arquivo de imagem para restauração total.", points:5 },
  { type:"choice", category:"BACKUP", text:"O armazenamento de backups em um local GEOGRAFICAMENTE SEPARADO das instalações principais para proteção contra desastres locais é chamado de:", answers:["Backup em Nuvem","Backup Remoto (Offsite Backup)","NAS","RAID 1"], correct:1, feedback:"Offsite Backup protege contra incêndios, inundações e outros desastres que afetariam o local principal.", points:5 },
  // Segurança Física
  { type:"choice", category:"FÍSICA", text:"Qual tecnologia de segurança física utiliza características únicas humanas como impressão digital, íris ou reconhecimento facial para autenticar o acesso?", answers:["Cartão de Acesso","CFTV","Biometria","Sistema de Alarme"], correct:2, feedback:"Biometria usa características físicas inatas da pessoa, sendo mais difícil de falsificar que senhas ou cartões.", points:5 },
  { type:"choice", category:"FÍSICA", text:"Sistema de câmeras para captura, transmissão e gravação de imagens em tempo real para monitoramento de instalações — Sigla?", answers:["IDS","CFTV (Circuito Fechado de Televisão)","NAC","DLP"], correct:1, feedback:"CFTV é essencial para monitoramento e evidências em caso de incidentes físicos.", points:5 },
  { type:"choice", category:"FÍSICA", text:"A prática de manter a mesa de trabalho livre de documentos, senhas e dispositivos sensíveis quando não estão em uso se chama:", answers:["Clear Screen","Política de Senha","Clean Desk (Mesa Limpa)","Hardening"], correct:2, feedback:"Clean Desk reduz o risco de exposição acidental ou intencional de informações confidenciais.", points:5 },
  // Replicação
  { type:"choice", category:"REPLICAÇÃO", text:"Qual tipo de replicação garante que os dados estejam sincronizados em tempo real antes de confirmar a operação, sem aceitar qualquer atraso?", answers:["Replicação Assíncrona","Replicação Síncrona","RSYNC","Backup Incremental"], correct:1, feedback:"Na replicação síncrona, o sistema aguarda a confirmação do destino antes de prosseguir — sem lag de dados.", points:5 },
  { type:"choice", category:"REPLICAÇÃO", text:"A ferramenta RSYNC é conhecida por:", answers:["Fazer backup completo sempre","Sincronizar apenas as partes MODIFICADAS dos arquivos (delta transfer)","Criar RAID via software","Monitorar câmeras de segurança"], correct:1, feedback:"RSYNC economiza tempo e largura de banda ao transferir apenas as diferenças (delta) dos arquivos.", points:5 },
  // Forca
  { type:"hangman", category:"CONCEITO", text:"Tecnologia que combina múltiplos discos para redundância e/ou performance. Sigla de 4 letras.", answer:"RAID", feedback:"Redundant Array of Independent Disks — essencial para alta disponibilidade.", points:10 },
  { type:"hangman", category:"BACKUP", text:"Tipo de backup que captura o estado completo do disco — SO incluído — em um arquivo de imagem.", answer:"IMAGE BACKUP", feedback:"Permitem restauração total do sistema, não apenas de arquivos individuais.", points:10 },
  { type:"hangman", category:"FÍSICA", text:"Prática de manter a área de trabalho limpa de informações sensíveis visíveis.", answer:"CLEAN DESK", feedback:"Simples, mas muito eficaz para evitar espionagem e vazamentos não intencionais.", points:10 },
  { type:"hangman", category:"REPLICAÇÃO", text:"Modo de replicação onde os dados são copiados em intervalos definidos — não imediatamente.", answer:"ASSINCRONA", feedback:"A replicação assíncrona prioriza o desempenho em detrimento do sincronismo total.", points:10 },
  // Anagramas
  { type:"scrambled", category:"CONCEITO", text:"Processo de ter componentes duplicados em caso de falha para manter disponibilidade.", answer:"REDUNDANCIA", feedback:"Redundância é o pilar da alta disponibilidade em sistemas críticos.", points:8 },
  { type:"scrambled", category:"BACKUP", text:"Cópia de segurança realizada de forma automática e constante, sem intervalos fixos.", answer:"CONTINUO", feedback:"Backup contínuo garante que as alterações mais recentes sempre sejam salvas.", points:8 },
  { type:"scrambled", category:"FÍSICA", text:"Processo de migração automática de carga para um servidor redundante em caso de falha.", answer:"FAILOVER", feedback:"Failover minimiza o tempo de inatividade em ambientes de missão crítica.", points:8 },
];

const BADGES = [
  { id:'raid_master', emoji:'💽', name:'RAID Master', desc:'Dominou RAID', condition:(s)=>s.categories['RAID']>=3 },
  { id:'backup_guru', emoji:'🗄️', name:'Backup Guru', desc:'Especialista em estratégias de backup', condition:(s)=>s.categories['BACKUP']>=3 },
  { id:'physical_guard', emoji:'🏛️', name:'Guardião Físico', desc:'Protege o ambiente físico', condition:(s)=>s.categories['FÍSICA']>=2 },
  { id:'hangman_pro', emoji:'🪢', name:'Mestre da Forca', desc:'Venceu 4 desafios de forca', condition:(s)=>s.types['hangman']>=4 },
  { id:'unscrambler', emoji:'🧩', name:'Decifrador', desc:'Resolveu anagramas de segurança', condition:(s)=>s.types['scrambled']>=3 },
  { id:'m7_certified', emoji:'🎓', name:'Redundância Expert', desc:'Completou o Módulo 07', condition:(s)=>s.finished },
];

function HangmanGame({ target, onComplete, disabled }) {
  const [guessed, setGuessed] = useState([]);
  const word = target.toUpperCase();
  const letters = word.split('');
  const uniqueLetters = [...new Set(word.replace(/ /g,'').split(''))];
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
          <div key={i} style={{width:l===' '?20:30,height:40,borderBottom:l===' '?'none':'2px solid #00E676',fontSize:24,fontWeight:700,display:'flex',alignItems:'center',justifyContent:'center',color:guessed.includes(l)||isLost?(uniqueLetters.includes(l)?'#00E676':'#FF5252'):'transparent'}}>
            {l===' '?' ':(guessed.includes(l)||isLost?l:'')}
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

export default function AtividadeHDBM07() {
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
  const onBypassComplete=()=>{ setQuestions([...QUESTIONS_POOL].sort(()=>Math.random()-0.5).slice(0,20)); setScreen("quiz"); };

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
    saveProgress("HDB_M07",finalBadges,score); playBadge();
    try{ await addDoc(collection(db,"fametro_ranking"),{name:playerName,score,duration:duration*1000,module:"HDB_M07",badges:finalBadges,timestamp:serverTimestamp()}); }
    catch(err){ console.warn("Ranking Error:",err); }
  };

  if(screen==="intro") return (
    <div className="hdb-scanlines" style={{minHeight:'100vh',background:'#0A0A0F',color:'#fff',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:20,fontFamily:'var(--hdb-main-font)'}}>
      <div className="hdb-card" style={{maxWidth:500,textAlign:'center',background:'#13131A',padding:40,borderRadius:20,border:'1px solid #2A2A35',boxShadow:'0 20px 50px rgba(0,0,0,0.5)'}}>
        <div style={{fontSize:60,marginBottom:20}}>🗄️</div>
        <h1 style={{fontSize:28,fontWeight:900,marginBottom:10}}>Redundância, Backup & Segurança Física</h1>
        <h2 style={{fontSize:13,color:'#00FF88',letterSpacing:3,marginBottom:30,fontWeight:700}}>MÓDULO 07 · CONTINUIDADE & PROTEÇÃO</h2>
        <p className="hdb-high-contrast" style={{marginBottom:35,lineHeight:1.6,fontSize:16}}>
          Garanta a continuidade! Enfrente 20 desafios sobre RAID, Tipos de Backup, Replicação de Dados e Segurança Física.
        </p>
        <input type="text" placeholder="ID DO AGENTE" value={playerName} onChange={e=>setPlayerName(e.target.value)}
          style={{width:'100%',padding:15,borderRadius:10,border:'1px solid #333',background:'#0A0A0F',color:'#fff',marginBottom:20,textAlign:'center',fontSize:16}}/>
        <button onClick={startChallenge} style={{width:'100%',padding:18,borderRadius:10,border:'none',background:'#00FF88',color:'#000',fontWeight:900,fontSize:16,cursor:'pointer'}}>INICIAR MISSÃO</button>
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
            <div style={{color:'rgba(255,255,255,0.4)'}}>{currentQ+1}/20</div>
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
          <div style={{background:'#0A0A0F',padding:20,borderRadius:15}}><div style={{fontSize:24,fontWeight:700}}>20</div><div style={{fontSize:11,color:'#666'}}>QUESTÕES</div></div>
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
              <div style={{fontSize:10,letterSpacing:4,color:'#00FF88',marginBottom:5}}>SECURITY CLEARANCE: LEVEL 1</div>
              <div style={{fontSize:24,fontWeight:900,color:'#fff'}}>AGENTE DE CONTINUIDADE</div>
            </div>
            <div style={{display:'flex',gap:20,textAlign:'left',marginBottom:30}}>
              <div style={{width:100,height:120,background:'rgba(0,255,136,0.05)',border:'1px solid rgba(0,255,136,0.2)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:40,borderRadius:10}}>🗄️</div>
              <div style={{flex:1}}>
                <div style={{fontSize:10,color:'rgba(255,255,255,0.4)',marginBottom:2}}>NOME DO AGENTE</div>
                <div style={{fontSize:20,fontWeight:900,color:'#fff',marginBottom:15}}>{playerName.toUpperCase()}</div>
                <div style={{fontSize:10,color:'rgba(255,255,255,0.4)',marginBottom:2}}>MISSÃO</div>
                <div style={{fontSize:12,color:'#00FF88'}}>MÓDULO 07: REDUNDÂNCIA & BACKUP</div>
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
      <HDBTerminalLoader onComplete={onBypassComplete} message={`AUTENTICANDO AGENTE: ${playerName.toUpperCase()}...`}/>
    </div>
  );
  return null;
}

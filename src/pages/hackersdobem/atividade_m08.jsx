import { useState, useEffect, useRef } from "react";
import { Link } from 'react-router-dom';
import { db } from '../../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { saveProgress } from './HDBProgress';
import { playSuccess, playError, playTick, playBadge } from './HDBAudio';
import HDBTerminalLoader from './HDBTerminalLoader';
import './HackersDoBem.css';

const QUESTIONS_POOL = [
  // Propriedades da Criptografia
  { type:"choice", category:"PROPRIEDADES", text:"Propriedade que visa tornar a relação entre a chave e o texto cifrado tão complexa quanto possível, geralmente alcançada por embaralhamento (ex: S-Box):", answers:["Difusão","Colisão","Confusão","Esteganografia"], correct:2, feedback:"A Confusão dificulta a identificação de padrões pelos adversários ao tornar complexa a relação entre os dados originais e a chave.", points:5 },
  { type:"choice", category:"PROPRIEDADES", text:"Propriedade que garante que qualquer pequena alteração nos dados de entrada (como 1 bit modificado) cause uma mudança significativa em todo o texto cifrado:", answers:["Difusão","Ofuscação","Perfect Forward Secrecy","Confusão"], correct:0, feedback:"A Difusão distribui as propriedades estatísticas dos dados originais por todo o texto criptografado.", points:5 },
  { type:"choice", category:"PROPRIEDADES", text:"Na criptografia, o termo 'Colisão' se refere a:", answers:["Uma queda no desempenho da rede durante a criptografia de dados em trânsito.","Quando duas entradas diferentes geram o mesmo resumo (hash) criptográfico.","Ataque onde o adversário rouba a chave privada de Alice.","Técnica de esconder dados dentro de uma imagem."], correct:1, feedback:"Uma colisão ocorre quando entradas diferentes resultam no mesmo hash, abrindo brecha para falsificação de dados.", points:5 },
  { type:"choice", category:"PROPRIEDADES", text:"O conceito de Perfect Forward Secrecy (PFS) é caracterizado por:", answers:["Usar a mesma chave sempre.","Garantir a confidencialidade mesmo se as chaves forem comprometidas no futuro, através do uso de chaves efêmeras.","Dividir o dado em fragmentos (Fragmentação).","Ser imune a computadores quânticos."], correct:1, feedback:"PFS assegura que se uma chave de longo prazo for vazada no futuro, sessões anteriores não poderão ser decifradas.", points:5 },
  // Ocultação
  { type:"choice", category:"OCULTAÇÃO", text:"A técnica de ocultar informações sensíveis dentro de arquivos aparentemente comuns, como imagens ou áudios, para passar despercebido, é chamada de:", answers:["Criptografia Simétrica","Ofuscação","Esteganografia","Fragmentação"], correct:2, feedback:"A esteganografia esconde O FATO de que a mensagem existe, ao contrário da criptografia que esconde O CONTEÚDO da mensagem.", points:5 },
  { type:"choice", category:"OCULTAÇÃO", text:"Qual técnica consiste em tornar o código/programa mais complexo e difícil de entender, através de renomeação de variáveis ou inserção de comandos inúteis, sem alterar a funcionalidade?", answers:["Ofuscação","Colisão","Hash","Confusão"], correct:0, feedback:"A ofuscação não é criptografia propriamente dita, mas sim uma técnica para desestimular engenharia reversa e análise de código.", points:5 },
  // Criptografia Simétrica
  { type:"choice", category:"SIMÉTRICA", text:"Sobre a criptografia simétrica, é CORRETO afirmar:", answers:["Utiliza duas chaves diferentes: uma pública e uma privada.","É muito lenta, mas resolve perfeitamente o problema da distribuição de chaves.","Utiliza a mesma chave para criptografar e descriptografar os dados.","Cria assinaturas digitais usando propriedades RSA."], correct:2, feedback:"Na criptografia simétrica, a MESMA chave (secreta) deve ser compartilhada entre quem envia e quem recebe os dados.", points:5 },
  { type:"choice", category:"SIMÉTRICA", text:"Qual categoria de cifra transforma os dados num fluxo contínuo de bits, combinando o texto claro com um 'keystream' de chaves através de operações lógicas como o XOR?", answers:["Cifra de Blocos (Block Cipher)","Cifra de Fluxo (Stream Cipher)","Hash Aleatório","Assinatura Digital"], correct:1, feedback:"Cifras de fluxo (ex: RC4) processam os dados bit a bit ou byte a byte continuamente.", points:5 },
  { type:"choice", category:"SIMÉTRICA", text:"O AES (Advanced Encryption Standard), atual padrão do NIST, é um algoritmo com:", answers:["Cifra de Blocos de 64 bits.","Cifra de Fluxo.","Cifra de Blocos de 128 bits e suporte para chaves de 128, 192 e 256 bits.","Par de Chaves Assimétricas."], correct:2, feedback:"AES atua em blocos de 128 bits e é notório por sua segurança, eficiência e resistência a ataques.", points:5 },
  { type:"choice", category:"SIMÉTRICA", text:"Qual clássico algoritmo de criptografia simétrica de blocos funciona com blocos de 64 bits, utiliza uma estrutura de rede Feistel e hoje é considerado inseguro pelo tamanho pequeno de chave?", answers:["AES","DES (Data Encryption Standard)","Serpent","Blowfish"], correct:1, feedback:"O DES foi o padrão anterior ao AES, mas as rápidas evoluções computacionais tornaram sua chave muito fácil de quebrar via força bruta.", points:5 },
  // Forca
  { type:"hangman", category:"CONCEITO", text:"Algoritmo simétrico (criado como um sucessor possível, mas perdeu para o Rijndael/AES) que usa blocos de 128 bits. Nome de uma cobra.", answer:"SERPENT", feedback:"O Serpent foi um finalista no processo do NIST para escolha do AES, mas não venceu.", points:10 },
  { type:"hangman", category:"CONCEITO", text:"Nome do famoso algoritmo de criptografia de FLUXO projetado pelo criador do RSA, que foi bastante usado em WEP/SSL no passado.", answer:"RC4", feedback:"RC4 (Rivest Cipher 4) dominou as cifras de fluxo, mas vulnerabilidades forçaram seu abandono gradual.", points:10 },
  { type:"hangman", category:"PROPRIEDADE", text:"Técnica onde se renomeiam variáveis e se altera a estrutura de código para dificultar engenharia reversa.", answer:"OFUSCACAO", feedback:"Ofuscação é a arte de criar 'código espaguete' proposital.", points:10 },
  { type:"hangman", category:"ALGORITMO", text:"Extensão do DES que opera em 3 passos sucessivos (criptografia, descriptografia, criptografia).", answer:"3DES", feedback:"O 3DES foi um caminho temporário muito usado para reforçar a segurança do DES original.", points:10 },
  // Anagramas
  { type:"scrambled", category:"CONCEITO", text:"O esconderijo das mensagens dentro de outro tipo de arquivo, como uma foto digital.", answer:"ESTEGANOGRAFIA", feedback:"A esteganografia tem origem no termo 'escrita oculta'.", points:8 },
  { type:"scrambled", category:"PROPRIEDADE", text:"Um pequeno ajuste de entrada gera uma alteração radical e ampla na saída (Propriedade dos Algoritmos).", answer:"DIFUSAO", feedback:"Claude Shannon apresentou as bases de Difusão e Confusão.", points:8 },
  { type:"scrambled", category:"PERSONAGEM", text:"O tradicional nome de 'adversário / espião' em problemas de criptografia.", answer:"EVE", feedback:"Na comunidade de cripto, Alice e Bob querem falar e Eve (Eavesdropper) quer ouvir.", points:8 },
];

const BADGES = [
  { id:'crypto_math', emoji:'➗', name:'Criptomatemático', desc:'Entendeu Confusão e Difusão', condition:(s)=>s.categories['PROPRIEDADES']>=3 },
  { id:'stealth_ninja', emoji:'🥷', name:'Ninja Stealth', desc:'Dominou Ocultação de Dados', condition:(s)=>s.categories['OCULTAÇÃO']>=2 },
  { id:'aes_master', emoji:'🔑', name:'Mestre Simétrico', desc:'Entendeu as cifras de bloco e fluxo', condition:(s)=>s.categories['SIMÉTRICA']>=3 },
  { id:'hangman_pro', emoji:'🪢', name:'Mestre da Forca', desc:'Venceu 4 desafios de forca', condition:(s)=>s.types['hangman']>=4 },
  { id:'unscrambler', emoji:'🧩', name:'Decifrador', desc:'Resolveu anagramas de criptografia', condition:(s)=>s.types['scrambled']>=3 },
  { id:'m8_certified', emoji:'🔐', name:'Crypt Analyst', desc:'Completou o Módulo 08', condition:(s)=>s.finished },
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

export default function AtividadeHDBM08() {
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
    saveProgress("HDB_M08",finalBadges,score); playBadge();
    try{ await addDoc(collection(db,"fametro_ranking"),{name:playerName,score,duration:duration*1000,module:"HDB_M08",badges:finalBadges,timestamp:serverTimestamp()}); }
    catch(err){ console.warn("Ranking Error:",err); }
  };

  if(screen==="intro") return (
    <div className="hdb-scanlines" style={{minHeight:'100vh',background:'#0A0A0F',color:'#fff',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:20,fontFamily:'var(--hdb-main-font)'}}>
      <div className="hdb-card" style={{maxWidth:500,textAlign:'center',background:'#13131A',padding:40,borderRadius:20,border:'1px solid #2A2A35',boxShadow:'0 20px 50px rgba(0,0,0,0.5)'}}>
        <div style={{fontSize:60,marginBottom:20}}>🔐</div>
        <h1 style={{fontSize:28,fontWeight:900,marginBottom:10}}>Conceitos de Criptografia</h1>
        <h2 style={{fontSize:13,color:'#00FF88',letterSpacing:3,marginBottom:30,fontWeight:700}}>MÓDULO 08 · ANÁLISE DE CÓDIGOS</h2>
        <p className="hdb-high-contrast" style={{marginBottom:35,lineHeight:1.6,fontSize:16}}>
          Proteja o tráfego de dados! Enfrente os desafios sobre Criptografia Simétrica, Confusão, Difusão e Esteganografia.
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
              <div style={{fontSize:10,letterSpacing:4,color:'#00FF88',marginBottom:5}}>SECURITY CLEARANCE: LEVEL 2</div>
              <div style={{fontSize:24,fontWeight:900,color:'#fff'}}>ANALISTA CRIPTOGRÁFICO</div>
            </div>
            <div style={{display:'flex',gap:20,textAlign:'left',marginBottom:30}}>
              <div style={{width:100,height:120,background:'rgba(0,255,136,0.05)',border:'1px solid rgba(0,255,136,0.2)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:40,borderRadius:10}}>🔐</div>
              <div style={{flex:1}}>
                <div style={{fontSize:10,color:'rgba(255,255,255,0.4)',marginBottom:2}}>NOME DO AGENTE</div>
                <div style={{fontSize:20,fontWeight:900,color:'#fff',marginBottom:15}}>{playerName.toUpperCase()}</div>
                <div style={{fontSize:10,color:'rgba(255,255,255,0.4)',marginBottom:2}}>MISSÃO</div>
                <div style={{fontSize:12,color:'#00FF88'}}>MÓDULO 08: CONCEITOS DE CRIPTOGRAFIA</div>
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
      <HDBTerminalLoader onComplete={onBypassComplete} message={`AUTENTICANDO CHAVES: ${playerName.toUpperCase()}...`}/>
    </div>
  );
  return null;
}

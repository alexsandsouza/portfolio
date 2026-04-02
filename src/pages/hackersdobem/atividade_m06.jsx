import { useState, useEffect, useRef } from "react";
import { Link } from 'react-router-dom';
import { db } from '../../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { saveProgress } from './HDBProgress';
import { playSuccess, playError, playTick, playBadge } from './HDBAudio';
import HDBTerminalLoader from './HDBTerminalLoader';
import './HackersDoBem.css';

const QUESTIONS_POOL = [
  // URL e Encoding
  { type:"choice", category:"URLs", text:"Qual componente de uma URL vem após o domínio e a porta, especificando o recurso exato no servidor?", answers:["Esquema (Scheme)","Query String","Caminho (Path)","Âncora (Fragment)"], correct:2, feedback:"O Path (caminho) indica a localização do arquivo ou diretório no servidor.", points:5 },
  { type:"choice", category:"URLs", text:"Na URL 'https://exemplo.com/busca?q=seguranca', o trecho '?q=seguranca' é conhecido como:", answers:["Âncora","Path","Query String","Host"], correct:2, feedback:"A Query String envia parâmetros para o servidor.", points:5 },
  { type:"choice", category:"URLs", text:"Como o caractere de 'espaço' é representado no HTTP Percent Encoding?", answers:["%00","%20","%2F","%40"], correct:1, feedback:"O código hexadecimal 20 representa o espaço na tabela ASCII.", points:5 },
  { type:"choice", category:"URLs", text:"O ataque SSL Strip (Remoção de SSL) funciona através de:", answers:["Criptografar os dados do usuário com uma chave falsa.","Redirecionar o tráfego HTTPS (seguro) para HTTP (não seguro) para interceptar dados.","Apagar o certificado digital do servidor alvo.","Bloquear o acesso ao site para todos os usuários."], correct:1, feedback:"O SSL Strip 'rebaixa' a conexão para poder ler os dados em texto claro.", points:5 },
  // Ataques de Sessão e Web
  { type:"choice", category:"SESSÃO", text:"O ataque 'Clickjacking' caracteriza-se por:", answers:["Sequestrar os cookies de sessão do navegador.","Ocultar uma página maliciosa sob uma página legítima para enganar os cliques do usuário.","Enviar milhares de cliques falsos para derrubar um site.","Prever o próximo ID de sessão do servidor."], correct:1, feedback:"Também chamado de 'UI Redressing', engana o usuário visualmente.", points:5 },
  { type:"choice", category:"SESSÃO", text:"O 'Session Hijacking' (Sequestro de Sessão) visa principalmente:", answers:["Obter o controle da sessão ativa de um usuário legítimo para agir em seu nome.","Alterar a senha do administrador do banco de dados.","Deletar o histórico de navegação da vítima.","Monitorar a velocidade da conexão de rede."], correct:0, feedback:"O invasor assume a identidade do usuário sem precisar da senha original.", points:5 },
  { type:"choice", category:"SESSÃO", text:"A técnica de 'Replay Attack' consiste em:", answers:["Deletar os logs de acesso para repetir o ataque.","Interceptar dados válidos e retransmiti-los posteriormente para ganho não autorizado.","Mudar a cor da interface do usuário repetidamente.","Forçar o usuário a digitar a senha várias vezes."], correct:1, feedback:"O invasor 'toca de novo' uma gravação de um login bem-sucedido, por exemplo.", points:5 },
  { type:"choice", category:"ATAQUES", text:"Qual a principal diferença entre o CSRF e o XSS?", answers:["Não há diferença, são o mesmo ataque.","No CSRF o invasor executa um script no site, no XSS ele engana o usuário para fazer uma ação.","No XSS o invasor executa scripts no navegador da vítima; no CSRF o invasor força o navegador da vítima a fazer pedidos indesejados a um site onde ela está logada.","XSS só funciona em bancos, CSRF funciona em qualquer site."], correct:2, feedback:"XSS foca na execução de código indesejado; CSRF foca em ações indesejadas em sites confiáveis.", points:5 },
  // Injections
  { type:"choice", category:"INJECTION", text:"O ataque de 'SQL Injection' ocorre devido a:", answers:["Falta de antivírus no servidor.","Falha na validação de entradas do usuário, permitindo a inserção de comandos SQL maliciosos.","O uso de bancos de dados muito antigos.","Senhas de usuários muito curtas."], correct:1, feedback:"A falta de tratamento de dados de usuários permite 'injetar' lógica no banco.", points:5 },
  { type:"choice", category:"INJECTION", text:"Qual dessas é uma medida eficaz para prevenir SQL Injection?", answers:["Usar senhas fortes no Wi-Fi.","Consultas Parametrizadas (Prepared Statements).","Aumentar o tempo de expiração da sessão.","Usar HTTPS em todas as páginas."], correct:1, feedback:"Prepared Statements separam os dados dos comandos SQL, neutralizando a injeção.", points:5 },
  { type:"choice", category:"INJECTION", text:"O 'Directory Traversal' permite que um invasor:", answers:["Acelere a velocidade de download de arquivos grandes.","Acesse arquivos e diretórios fora da pasta raiz do servidor web (ex: /etc/passwd).","Mude o nome do domínio do site.","Crie novas pastas no computador do usuário."], correct:1, feedback:"O invasor usa '../' para navegar para fora da área permitida do servidor.", points:5 },
  { type:"choice", category:"INJECTION", text:"O ataque SSRF (Server-Side Request Forgery) faz com que:", answers:["O usuário faça pedidos falsos para o servidor.","O servidor vulnerável faça requisições indesejadas para outros recursos internos ou externos.","O banco de dados pare de responder.","O firewall bloqueie todas as conexões de saída."], correct:1, feedback:"O servidor é usado como um 'proxy' para atacar outros sistemas internos.", points:5 },
  { type:"choice", category:"ATAQUES", text:"O 'Command Injection' é perigoso porque permite ao invasor:", answers:["Apenas ler arquivos de texto simples.","Executar comandos diretamente no sistema operacional do servidor alvo.","Mudar a data e hora do site.","Aumentar o tamanho das imagens da página."], correct:1, feedback:"É um dos ataques mais críticos, pois dá controle total sobre o SO.", points:5 },
  { type:"choice", category:"XSS", text:"Um ataque XSS 'Armazenado' (Stored) se diferencia do 'Refletido' por:", answers:["O código malicioso ficar salvo no banco de dados do servidor (ex: em um comentário).","Ocorrer apenas em dispositivos móveis.","Exigir que o usuário clique em um link infectado toda vez.","Não precisar de conexão com a internet."], correct:0, feedback:"O Stored XSS afeta qualquer usuário que visualize a página onde o script foi salvo.", points:5 },

  // Forca
  { type:"hangman", category:"ATAQUES", text:"Ataque onde o invasor oculta uma página maliciosa sob uma legítima.", answer:"CLICKJACKING", feedback:"Clickjacking explora a confiança visual do usuário.", points:10 },
  { type:"hangman", category:"INJECTION", text:"Tática de usar '../' para acessar arquivos protegidos no servidor.", answer:"TRAVERSAL", feedback:"Directory Traversal (ou Path Traversal) explora falhas no gerenciamento de caminhos de arquivos.", points:10 },
  { type:"hangman", category:"URLs", text:"Processo de 'rebaixar' HTTPS para HTTP para interceptar dados.", answer:"SSLSTRIP", feedback:"O SSL Strip tira o cadeado de segurança da conexão.", points:10 },
  // Anagramas
  { type:"scrambled", category:"INJECTION", text:"Tipo de injeção em bases de dados relacionais.", answer:"SQL", feedback:"SQL é a linguagem padrão de quase todos os bancos de dados modernos.", points:8 },
  { type:"scrambled", category:"SESSÃO", text:"Token usado para prevenir ataques de Cross-Site Request Forgery.", answer:"ANTIXSRF", feedback:"Tokens Anti-CSRF garantem que a requisição veio de um formulário legítimo do site.", points:8 },
  { type:"scrambled", category:"ATAQUES", text:"Sigla para ataques que forçam o servidor a fazer requisições por ele.", answer:"SSRF", feedback:"Server-Side Request Forgery é comum em serviços que buscam URLs ou metadados de nuvem.", points:8 },
];

const BADGES = [
  { id:'web_defender', emoji:'🌐', name:'Defensor Web', desc:'Domina os conceitos de proteção de URLs e ataques web', condition:(s)=>s.categories['URLs']>=3 },
  { id:'anti_injection', emoji:'💉', name:'Anti-Injeção', desc:'Sabe prevenir SQL, LDAP e Command Injection', condition:(s)=>s.categories['INJECTION']>=3 },
  { id:'session_guardian', emoji:'🛡️', name:'Guardião de Sessão', desc:'Conhece ataques de Hijacking e Clickjacking', condition:(s)=>s.categories['SESSÃO']>=3 },
  { id:'hangman_pro', emoji:'🪢', name:'Mestre da Forca', desc:'Venceu 3 desafios de forca', condition:(s)=>s.types['hangman']>=3 },
  { id:'unscrambler', emoji:'🧩', name:'Decifrador de Scripts', desc:'Resolveu os anagramas de proteção web', condition:(s)=>s.types['scrambled']>=2 },
  { id:'m6_certified', emoji:'🕸️', name:'Perito em Web Security', desc:'Completou o Módulo 06', condition:(s)=>s.finished },
];

// ... (Rest of components: HangmanGame, ScrambledGame, AtividadeHDBM06) - reusing standard template
// I will include the full code for consistency

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

export default function AtividadeHDBM06() {
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
  const onBypassComplete=()=>{ setQuestions([...QUESTIONS_POOL].sort(()=>Math.random()-0.5).slice(0,18)); setScreen("quiz"); };

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
    saveProgress("HDB_M06",finalBadges,score); playBadge();
    try{ await addDoc(collection(db,"fametro_ranking"),{name:playerName,score,duration:duration*1000,module:"HDB_M06",badges:finalBadges,timestamp:serverTimestamp()}); }
    catch(err){ console.warn("Ranking Error:",err); }
  };

  if(screen==="intro") return (
    <div className="hdb-scanlines" style={{minHeight:'100vh',background:'#0A0A0F',color:'#fff',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:20,fontFamily:'var(--hdb-main-font)'}}>
      <div className="hdb-card" style={{maxWidth:500,textAlign:'center',background:'#13131A',padding:40,borderRadius:20,border:'1px solid #2A2A35',boxShadow:'0 20px 50px rgba(0,0,0,0.5)'}}>
        <div style={{fontSize:60,marginBottom:20}}>🕸️</div>
        <h1 style={{fontSize:28,fontWeight:900,marginBottom:10}}>Segurança Web</h1>
        <h2 style={{fontSize:13,color:'#00FF88',letterSpacing:3,marginBottom:30,fontWeight:700}}>MÓDULO 06 · PROTEÇÃO WEB</h2>
        <p className="hdb-high-contrast" style={{marginBottom:35,lineHeight:1.6,fontSize:16}}>
          A web é o campo de batalha mais ativo! Domine ataques de XSS, Injeções, Sequestro de Sessão e Clickjacking para proteger aplicações e usuários.
        </p>
        <input type="text" placeholder="ID DO AGENTE" value={playerName} onChange={e=>setPlayerName(e.target.value)}
          style={{width:'100%',padding:15,borderRadius:10,border:'1px solid #333',background:'#0A0A0F',color:'#fff',marginBottom:20,textAlign:'center',fontSize:16}}/>
        <button onClick={startChallenge} style={{width:'100%',padding:18,borderRadius:10,border:'none',background:'#00FF88',color:'#000',fontWeight:900,fontSize:16,cursor:'pointer'}}>INICIAR COMBATE WEB</button>
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
              <div style={{fontSize:10,letterSpacing:4,color:'#00FF88',marginBottom:5}}>SECURITY CLEARANCE: LEVEL 6</div>
              <div style={{fontSize:24,fontWeight:900,color:'#fff'}}>AGENTE ESPECIALISTA WEB</div>
            </div>
            <div style={{display:'flex',gap:20,textAlign:'left',marginBottom:30}}>
              <div style={{width:100,height:120,background:'rgba(0,255,136,0.05)',border:'1px solid rgba(0,255,136,0.2)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:40,borderRadius:10}}>🕸️</div>
              <div style={{flex:1}}>
                <div style={{fontSize:10,color:'rgba(255,255,255,0.4)',marginBottom:2}}>NOME DO AGENTE</div>
                <div style={{fontSize:20,fontWeight:900,color:'#fff',marginBottom:15}}>{playerName.toUpperCase()}</div>
                <div style={{fontSize:10,color:'rgba(255,255,255,0.4)',marginBottom:2}}>MISSÃO</div>
                <div style={{fontSize:12,color:'#00FF88'}}>MÓDULO 06: PROTEÇÃO WEB</div>
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
      <HDBTerminalLoader onComplete={onBypassComplete} message={`ANALISANDO VETORES WEB: ${playerName.toUpperCase()}...`}/>
    </div>
  );
  return null;
}

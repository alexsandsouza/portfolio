import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Code, Network, ShieldCheck, Database, LifeBuoy, Users, 
    ArrowRight, ArrowLeft, RefreshCcw, Sparkles, Brain, Rocket,
    CheckCircle2
} from 'lucide-react';

const QUESTIONS = [
    {
        id: 1,
        question: "Quando você encontra um problema técnico, o que mais desperta sua curiosidade?",
        options: [
            { key: "A", text: "Entender a lógica e construir uma solução", area: "Desenvolvimento" },
            { key: "B", text: "Descobrir onde a falha ocorreu", area: "Redes" },
            { key: "C", text: "Proteger o sistema contra riscos", area: "Segurança" },
            { key: "D", text: "Extrair padrões dos dados", area: "Dados e IA" },
            { key: "E", text: "Ajudar alguém a resolver", area: "Suporte" },
            { key: "F", text: "Organizar pessoas e prazos", area: "Gestão" }
        ]
    },
    {
        id: 2,
        question: "Qual atividade parece mais interessante para você?",
        options: [
            { key: "A", text: "Criar um aplicativo", area: "Desenvolvimento" },
            { key: "B", text: "Montar uma rede", area: "Redes" },
            { key: "C", text: "Investigar vulnerabilidades", area: "Segurança" },
            { key: "D", text: "Criar um painel de dados", area: "Dados e IA" },
            { key: "E", text: "Atender e orientar usuários", area: "Suporte" },
            { key: "F", text: "Coordenar uma entrega", area: "Gestão" }
        ]
    },
    {
        id: 3,
        question: "Em um projeto em grupo, você naturalmente tende a:",
        options: [
            { key: "A", text: "Implementar funcionalidades", area: "Desenvolvimento" },
            { key: "B", text: "Garantir que a estrutura funcione", area: "Redes" },
            { key: "C", text: "Pensar nos riscos", area: "Segurança" },
            { key: "D", text: "Medir resultados", area: "Dados e IA" },
            { key: "E", text: "Traduzir problemas para as pessoas", area: "Suporte" },
            { key: "F", text: "Organizar o caminho", area: "Gestão" }
        ]
    },
    {
        id: 4,
        question: "Que tipo de resultado mais motiva você?",
        options: [
            { key: "A", text: "Ver um sistema funcionando", area: "Desenvolvimento" },
            { key: "B", text: "Ver tudo conectado", area: "Redes" },
            { key: "C", text: "Evitar incidentes", area: "Segurança" },
            { key: "D", text: "Transformar dados em decisão", area: "Dados e IA" },
            { key: "E", text: "Resolver a dor de alguém", area: "Suporte" },
            { key: "F", text: "Fazer o projeto acontecer", area: "Gestão" }
        ]
    },
    {
        id: 5,
        question: "Qual habilidade você mais gostaria de desenvolver agora?",
        options: [
            { key: "A", text: "Programação", area: "Desenvolvimento" },
            { key: "B", text: "Infraestrutura", area: "Redes" },
            { key: "C", text: "Cibersegurança", area: "Segurança" },
            { key: "D", text: "Dados e IA", area: "Dados e IA" },
            { key: "E", text: "Suporte técnico", area: "Suporte" },
            { key: "F", text: "Gestão de projetos", area: "Gestão" }
        ]
    },
    {
        id: 6,
        question: "Como você prefere estudar?",
        options: [
            { key: "A", text: "Criando projetos", area: "Desenvolvimento" },
            { key: "B", text: "Configurando ambientes", area: "Redes" },
            { key: "C", text: "Simulando ataques e defesas", area: "Segurança" },
            { key: "D", text: "Analisando conjuntos de dados", area: "Dados e IA" },
            { key: "E", text: "Resolvendo casos reais", area: "Suporte" },
            { key: "F", text: "Planejando etapas", area: "Gestão" }
        ]
    },
    {
        id: 7,
        question: "Qual rotina parece mais confortável?",
        options: [
            { key: "A", text: "Foco profundo em código", area: "Desenvolvimento" },
            { key: "B", text: "Monitoramento e manutenção", area: "Redes" },
            { key: "C", text: "Investigação constante", area: "Segurança" },
            { key: "D", text: "Exploração analítica", area: "Dados e IA" },
            { key: "E", text: "Contato com pessoas", area: "Suporte" },
            { key: "F", text: "Reuniões e decisões", area: "Gestão" }
        ]
    },
    {
        id: 8,
        question: "Que frase combina mais com você?",
        options: [
            { key: "A", text: "Quero construir soluções", area: "Desenvolvimento" },
            { key: "B", text: "Quero manter sistemas funcionando", area: "Redes" },
            { key: "C", text: "Quero proteger ambientes", area: "Segurança" },
            { key: "D", text: "Quero descobrir padrões", area: "Dados e IA" },
            { key: "E", text: "Quero ajudar usuários", area: "Suporte" },
            { key: "F", text: "Quero liderar entregas", area: "Gestão" }
        ]
    }
];

const AREA_DETAILS = {
    "Desenvolvimento": {
        icon: <Code size={48} />,
        color: "#7c6ffa",
        description: "Você nasceu para criar! Sua afinidade está em transformar lógica em realidade através do código. O mundo do desenvolvimento (Front-end, Back-end, Mobile) é o seu lugar.",
        path: "Foque em aprender linguagens como JavaScript, Python ou Java e comece a construir seus próprios projetos."
    },
    "Redes": {
        icon: <Network size={48} />,
        color: "#3b82f6",
        description: "Você gosta de ver tudo conectado e funcionando. Sua mente entende a infraestrutura que sustenta a internet. O caminho de Redes e Cloud Computing é ideal para você.",
        path: "Certificações como Cisco CCNA e conhecimentos em AWS/Azure serão seus grandes diferenciais."
    },
    "Segurança": {
        icon: <ShieldCheck size={48} />,
        color: "#10b981",
        description: "Você tem o olhar atento de um protetor. Sua curiosidade em encontrar falhas e proteger sistemas faz de você um candidato nato para Cibersegurança.",
        path: "Estude sobre ethical hacking, segurança de redes e criptografia para começar sua jornada como analista de segurança."
    },
    "Dados e IA": {
        icon: <Database size={48} />,
        color: "#f59e0b",
        description: "Padrões e dados são o seu combustível. Você prefere tomar decisões baseadas em evidências e adora a ideia de máquinas que aprendem.",
        path: "Aprofunde-se em Python (Pandas, Scikit-learn), SQL e estatística para dominar a ciência de dados e IA."
    },
    "Suporte": {
        icon: <LifeBuoy size={48} />,
        color: "#ef4444",
        description: "Sua motivação é ajudar pessoas. Você tem a paciência e a didática necessárias para traduzir o complexo 'tecniquês' para o usuário final.",
        path: "Comece como analista de suporte N1/N2, aprenda sobre ITIL e desenvolva suas soft skills de comunicação."
    },
    "Gestão": {
        icon: <Users size={48} />,
        color: "#ec4899",
        description: "Você é um líder por natureza. Organizar o caos, definir metas e garantir que o time chegue ao objetivo é o que te move.",
        path: "Estude metodologias ágeis (Scrum, Kanban) e gestão de projetos para se tornar um Product Owner ou Scrum Master."
    }
};

const TechAffinityTest = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(0); // 0: Start, 1: Quiz, 2: Result
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const [result, setResult] = useState(null);

    const handleStart = () => setStep(1);

    const handleAnswer = (optionKey) => {
        const newAnswers = { ...answers, [currentQuestion]: optionKey };
        setAnswers(newAnswers);

        if (currentQuestion < QUESTIONS.length - 1) {
            setCurrentQuestion(prev => prev + 1);
        } else {
            calculateResult(newAnswers);
        }
    };

    const calculateResult = (allAnswers) => {
        const counts = {};
        Object.values(allAnswers).forEach(key => {
            const area = QUESTIONS[0].options.find(opt => opt.key === key).area;
            counts[area] = (counts[area] || 0) + 1;
        });

        const winningArea = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
        setResult(winningArea);
        setStep(2);
    };

    const handleRestart = () => {
        setStep(0);
        setCurrentQuestion(0);
        setAnswers({});
        setResult(null);
    };

    const progress = ((currentQuestion + 1) / QUESTIONS.length) * 100;

    return (
        <div className="affinity-test-page" style={{ 
            minHeight: '100vh', 
            background: 'var(--bg-color)', 
            color: 'var(--text-primary)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem'
        }}>
            {/* Background Decor */}
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none', opacity: 0.4 }}>
                <div style={{ position: 'absolute', top: '10%', left: '5%', width: '400px', height: '400px', background: 'var(--primary-color)', filter: 'blur(150px)', borderRadius: '50%', opacity: 0.1 }}></div>
                <div style={{ position: 'absolute', bottom: '10%', right: '5%', width: '400px', height: '400px', background: 'var(--secondary-color)', filter: 'blur(150px)', borderRadius: '50%', opacity: 0.1 }}></div>
            </div>

            <div className="test-container" style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '800px' }}>
                
                {/* STEP 0: START */}
                {step === 0 && (
                    <div style={{ textAlign: 'center', animation: 'fadeIn 0.8s ease' }}>
                        <div style={{ display: 'inline-flex', padding: '1rem', background: 'rgba(124, 111, 250, 0.1)', borderRadius: '24px', marginBottom: '2rem' }}>
                            <Brain size={64} color="var(--primary-color)" />
                        </div>
                        <h1 style={{ fontSize: '3.5rem', marginBottom: '1.5rem', fontWeight: 800 }}>
                            Qual o seu <span className="text-gradient-primary">Caminho na TI?</span>
                        </h1>
                        <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '3rem', maxWidth: '600px', margin: '0 auto 3rem' }}>
                            Responda 8 questões rápidas e descubra qual área da tecnologia mais combina com o seu perfil natural.
                        </p>
                        <button className="btn btn-primary" onClick={handleStart} style={{ padding: '1.2rem 4rem', fontSize: '1.2rem', gap: '10px' }}>
                            Começar Teste <ArrowRight size={24} />
                        </button>
                    </div>
                )}

                {/* STEP 1: QUIZ */}
                {step === 1 && (
                    <div style={{ animation: 'fadeIn 0.5s ease' }}>
                        {/* Progress Header */}
                        <div style={{ marginBottom: '3rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                <span>Questão {currentQuestion + 1} de {QUESTIONS.length}</span>
                                <span>{Math.round(progress)}% Completo</span>
                            </div>
                            <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                                <div style={{ height: '100%', background: 'var(--primary-color)', width: `${progress}%`, transition: 'width 0.4s ease' }}></div>
                            </div>
                        </div>

                        {/* Question Card */}
                        <div className="card-glass" style={{ padding: '3rem' }}>
                            <h2 style={{ fontSize: '1.8rem', marginBottom: '2.5rem', lineHeight: 1.4 }}>
                                {QUESTIONS[currentQuestion].question}
                            </h2>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                                {QUESTIONS[currentQuestion].options.map((option) => (
                                    <button 
                                        key={option.key} 
                                        className="quiz-option-btn"
                                        onClick={() => handleAnswer(option.key)}
                                        style={{
                                            padding: '1.2rem 2rem',
                                            background: 'rgba(255,255,255,0.03)',
                                            border: '1px solid var(--border-color)',
                                            borderRadius: '16px',
                                            color: 'var(--text-primary)',
                                            textAlign: 'left',
                                            fontSize: '1.1rem',
                                            transition: 'all 0.2s ease',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '1.5rem'
                                        }}
                                    >
                                        <div style={{ 
                                            width: '32px', height: '32px', borderRadius: '8px', 
                                            background: 'rgba(124, 111, 250, 0.1)', color: 'var(--primary-color)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontWeight: 'bold', fontSize: '0.9rem'
                                        }}>
                                            {option.key}
                                        </div>
                                        {option.text}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Navigation */}
                        <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-between' }}>
                            <button 
                                disabled={currentQuestion === 0}
                                onClick={() => setCurrentQuestion(prev => prev - 1)}
                                style={{ 
                                    background: 'transparent', border: 'none', color: 'var(--text-secondary)', 
                                    display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer',
                                    opacity: currentQuestion === 0 ? 0.3 : 1
                                }}
                            >
                                <ArrowLeft size={18} /> Voltar
                            </button>
                            <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Seja espontâneo!</span>
                        </div>
                    </div>
                )}

                {/* STEP 2: RESULT */}
                {step === 2 && result && (
                    <div style={{ animation: 'fadeIn 1s ease', textAlign: 'center' }}>
                        <div style={{ marginBottom: '2rem' }}>
                            <div style={{ 
                                display: 'inline-flex', padding: '2rem', 
                                background: `${AREA_DETAILS[result].color}22`, 
                                border: `2px solid ${AREA_DETAILS[result].color}44`,
                                borderRadius: '32px', marginBottom: '1.5rem', color: AREA_DETAILS[result].color
                            }}>
                                {AREA_DETAILS[result].icon}
                            </div>
                            <span style={{ display: 'block', color: 'var(--primary-color)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                                Resultado Encontrado!
                            </span>
                            <h2 style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>
                                Sua área é <span style={{ color: AREA_DETAILS[result].color }}>{result}</span>
                            </h2>
                        </div>

                        <div className="card-glass" style={{ padding: '3rem', marginBottom: '3rem', textAlign: 'left', borderTop: `6px solid ${AREA_DETAILS[result].color}` }}>
                            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', marginBottom: '2rem' }}>
                                <Sparkles size={24} color={AREA_DETAILS[result].color} style={{ flexShrink: 0, marginTop: '5px' }} />
                                <p style={{ fontSize: '1.25rem', lineHeight: 1.6, color: 'var(--text-primary)' }}>
                                    {AREA_DETAILS[result].description}
                                </p>
                            </div>
                            
                            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '2rem', borderRadius: '20px' }}>
                                <h4 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem', color: 'var(--text-heading)' }}>
                                    <Rocket size={20} /> Próximos Passos:
                                </h4>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                                    {AREA_DETAILS[result].path}
                                </p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <button className="btn btn-primary" onClick={handleRestart} style={{ gap: '10px' }}>
                                <RefreshCcw size={20} /> Refazer Teste
                            </button>
                            <button className="btn btn-secondary" onClick={() => navigate('/')} style={{ gap: '10px' }}>
                                Voltar ao Portfólio
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <style>{`
                .quiz-option-btn:hover {
                    background: rgba(124, 111, 250, 0.08) !important;
                    border-color: var(--primary-color) !important;
                    transform: translateX(10px);
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                @media (max-width: 600px) {
                    h1 { font-size: 2.5rem !important; }
                    h2 { font-size: 2rem !important; }
                    .card-glass { padding: 1.5rem !important; }
                }
            `}</style>
        </div>
    );
};

export default TechAffinityTest;

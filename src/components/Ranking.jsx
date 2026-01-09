import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { Trophy, Medal, Clock, User } from 'lucide-react';

const Ranking = () => {
    const [ranks, setRanks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        try {
            // Order by time (ascending - faster is better)
            const q = query(collection(db, "quiz_results"), orderBy("timeSeconds", "asc"), limit(10));
            const unsubscribe = onSnapshot(q, (snapshot) => {
                const results = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setRanks(results);
                setLoading(false);
            }, (error) => {
                console.error("Ranking error:", error);
                setLoading(false);
            });
            return () => unsubscribe();
        } catch (e) {
            console.log("Firebase not ready");
            setLoading(false);
        }
    }, []);

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}m ${s}s`;
    };

    const getRankIcon = (index) => {
        if (index === 0) return <Trophy size={20} color="#fbbf24" fill="#fbbf24" />; // Gold
        if (index === 1) return <Medal size={20} color="#94a3b8" fill="#94a3b8" />; // Silver
        if (index === 2) return <Medal size={20} color="#b45309" fill="#b45309" />; // Bronze
        return <span className="rank-number">#{index + 1}</span>;
    };

    return (
        <div className="ranking-container">
            <div className="ranking-header">
                <h3>🏆 Hall da Fama - Top 10</h3>
                <p>Os mais rápidos a escapar da forca</p>
            </div>

            <div className="ranking-list">
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '1rem', color: 'rgba(255,255,255,0.5)' }}>Carregando ranking...</div>
                ) : ranks.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '1rem', color: 'rgba(255,255,255,0.5)' }}>Seja o primeiro a vencer!</div>
                ) : (
                    ranks.map((entry, index) => (
                        <div key={entry.id} className={`ranking-item rank-${index + 1}`}>
                            <div className="rank-position">
                                {getRankIcon(index)}
                            </div>
                            <div className="rank-info">
                                <div className="rank-name">{entry.name}</div>
                                <div className="rank-time">
                                    <Clock size={14} style={{ marginRight: '4px' }} />
                                    {formatTime(entry.timeSeconds)}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <style>{`
                .ranking-container {
                    background: rgba(15, 23, 42, 0.6);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 16px;
                    padding: 1.5rem;
                    max-width: 400px;
                    width: 100%;
                    margin: 0 auto;
                    backdrop-filter: blur(10px);
                }
                .ranking-header {
                    text-align: center;
                    margin-bottom: 1.5rem;
                    border-bottom: 1px solid rgba(255,255,255,0.1);
                    padding-bottom: 1rem;
                }
                .ranking-header h3 {
                    margin: 0;
                    color: #fff;
                    font-size: 1.2rem;
                }
                .ranking-header p {
                    margin: 0.5rem 0 0;
                    font-size: 0.85rem;
                    color: var(--text-secondary);
                }
                .ranking-list {
                    display: flex;
                    flex-direction: column;
                    gap: 0.8rem;
                    max-height: 400px;
                    overflow-y: auto;
                    padding-right: 5px;
                }
                /* Scrollbar styling */
                .ranking-list::-webkit-scrollbar {
                    width: 4px;
                }
                .ranking-list::-webkit-scrollbar-thumb {
                    background: rgba(255,255,255,0.2);
                    border-radius: 4px;
                }

                .ranking-item {
                    display: flex;
                    align-items: center;
                    padding: 0.8rem;
                    background: rgba(255,255,255,0.03);
                    border-radius: 8px;
                    transition: transform 0.2s;
                    border: 1px solid transparent;
                }
                .ranking-item:hover {
                    background: rgba(255,255,255,0.08);
                    transform: translateX(5px);
                }
                
                /* Top 3 Highlighting */
                .rank-1 { background: linear-gradient(90deg, rgba(251, 191, 36, 0.1), transparent); border-color: rgba(251, 191, 36, 0.3); }
                .rank-2 { background: linear-gradient(90deg, rgba(148, 163, 184, 0.1), transparent); border-color: rgba(148, 163, 184, 0.3); }
                .rank-3 { background: linear-gradient(90deg, rgba(180, 83, 9, 0.1), transparent); border-color: rgba(180, 83, 9, 0.3); }

                .rank-position {
                    width: 30px;
                    display: flex;
                    justify-content: center;
                    margin-right: 1rem;
                    font-weight: bold;
                    color: #fff;
                }
                .rank-number {
                    color: var(--text-secondary);
                    font-size: 0.9rem;
                }
                .rank-info {
                    flex: 1;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .rank-name {
                    font-weight: 500;
                    color: #fff;
                    font-size: 0.95rem;
                }
                .rank-time {
                    display: flex;
                    align-items: center;
                    font-size: 0.85rem;
                    color: var(--primary-color);
                    background: rgba(99, 102, 241, 0.1);
                    padding: 2px 8px;
                    border-radius: 12px;
                }

                @media (max-width: 480px) {
                    .ranking-container {
                        padding: 1rem;
                    }
                    .rank-name {
                        max-width: 120px;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    }
                }
            `}</style>
        </div>
    );
};

export default Ranking;

/**
 * Gerenciador de Progresso Local para Hackers do Bem
 * Salva e recupera as medalhas e status de missões completadas.
 */

const KEY = 'hdb_progress';

export const saveProgress = (moduleId, badges = [], score = 0) => {
  const current = getProgress();
  const moduleData = current.modules[moduleId] || { badges: [], topScore: 0, completions: 0 };

  // Unificando badges sem duplicatas
  const updatedBadges = [...new Set([...moduleData.badges, ...badges])];
  
  current.modules[moduleId] = {
    badges: updatedBadges,
    topScore: Math.max(moduleData.topScore, score),
    completions: moduleData.completions + 1,
    lastUpdate: Date.now()
  };

  // Ganhar medalhas globais agregadas
  const allBadges = Object.values(current.modules).flatMap(m => m.badges);
  current.globalBadges = [...new Set(allBadges)];
  
  localStorage.setItem(KEY, JSON.stringify(current));
  return current;
};

export const getProgress = () => {
  const data = localStorage.getItem(KEY);
  if (!data) return { modules: {}, globalBadges: [], level: 1 };
  try {
    return JSON.parse(data);
  } catch (e) {
    return { modules: {}, globalBadges: [], level: 1 };
  }
};

export const clearProgress = () => {
  localStorage.removeItem(KEY);
  window.location.reload();
};

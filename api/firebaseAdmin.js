import admin from 'firebase-admin';

if (!admin.apps.length) {
  try {
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
      console.log('Firebase Admin inicializado com Service Account.');
    } else {
      // Fallback para desenvolvimento local ou se as credenciais do ambiente estiverem disponíveis por outros meios
      admin.initializeApp({
        projectId: process.env.VITE_FIREBASE_PROJECT_ID || 'portfolio-b6e32'
      });
      console.log('Firebase Admin inicializado apenas com ProjectID (fallback).');
    }
  } catch (error) {
    console.error('Erro ao inicializar Firebase Admin:', error);
  }
}

export const db = admin.firestore();
export { admin };

/**
 * @file useSecurity.js
 * @description Hook de segurança para proteção do portfolio.
 * 
 * Protege contra:
 * - Abertura do DevTools via F12 / Ctrl+Shift+I/J/C
 * - Visualização do código-fonte via Ctrl+U
 * - Salvamento e impressão da página via Ctrl+S / Ctrl+P
 * - Menu de contexto (botão direito)
 * 
 * NÃO bloqueia: Ctrl+C, Ctrl+V, seleção de texto (acessibilidade)
 */
import { useEffect } from 'react';

export const useSecurity = () => {
    useEffect(() => {
        // 1. Disable Right Click
        const handleContextMenu = (e) => {
            e.preventDefault();
        };

        // 2. Disable Keyboard Shortcuts (DevTools, View Source, Save, Print)
        const handleKeyDown = (e) => {
            // F12
            if (e.key === 'F12') {
                e.preventDefault();
            }
            // Ctrl + Shift + I (DevTools)
            if (e.ctrlKey && e.shiftKey && e.key === 'I') {
                e.preventDefault();
            }
            // Ctrl + Shift + C (Inspect Element)
            if (e.ctrlKey && e.shiftKey && e.key === 'C') {
                e.preventDefault();
            }
            // Ctrl + Shift + J (Console)
            if (e.ctrlKey && e.shiftKey && e.key === 'J') {
                e.preventDefault();
            }
            // Ctrl + U (View Source)
            if (e.ctrlKey && e.key === 'u') {
                e.preventDefault();
            }
            // Ctrl + S (Save)
            if (e.ctrlKey && e.key === 's') {
                e.preventDefault();
            }
            // Ctrl + P (Print)
            if (e.ctrlKey && e.key === 'p') {
                e.preventDefault();
            }
        };

        document.addEventListener('contextmenu', handleContextMenu);
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('contextmenu', handleContextMenu);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);
};

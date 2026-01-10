import { useEffect } from 'react';

export const useSecurity = () => {
    useEffect(() => {
        // 1. Disable Right Click
        const handleContextMenu = (e) => {
            e.preventDefault();
        };

        // 2. Disable Keyboard Shortcuts (F12, Ctrl+Shift+I, Ctrl+U, Ctrl+C, Ctrl+V, Ctrl+S)
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
            // Ctrl + C (Copy) - Prevent copying text
            if (e.ctrlKey && e.key === 'c') {
                e.preventDefault();
            }
            // Ctrl + V (Paste) - Prevent pasting
            if (e.ctrlKey && e.key === 'v') {
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

        // 3. Disable Text Selection via JS event (backup to CSS)
        const handleSelectStart = (e) => {
            e.preventDefault();
        };

        document.addEventListener('contextmenu', handleContextMenu);
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('selectstart', handleSelectStart);

        return () => {
            document.removeEventListener('contextmenu', handleContextMenu);
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('selectstart', handleSelectStart);
        };
    }, []);
};

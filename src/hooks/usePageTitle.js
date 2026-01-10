import { useEffect, useRef } from 'react';

export const usePageTitle = () => {
    const defaultTitle = useRef(document.title);

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                document.title = "Ei, volta aqui! 😭👨‍💻";
            } else {
                document.title = "✨ Codando o Futuro...";
                setTimeout(() => {
                    document.title = defaultTitle.current;
                }, 2000);
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);
};

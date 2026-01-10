import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = () => {
    const [theme, setTheme] = useState('dark');

    useEffect(() => {
        // Check localStorage or system preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            setTheme(savedTheme);
            document.documentElement.setAttribute('data-theme', savedTheme);
        } else {
            // Default to dark
            setTheme('dark');
            document.documentElement.setAttribute('data-theme', 'dark');
        }
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    };

    return (
        <button
            onClick={toggleTheme}
            className="theme-toggle"
            aria-label="Alternar Tema"
        >
            {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}

            <style>{`
                .theme-toggle {
                    position: fixed;
                    bottom: 2rem;
                    right: 2rem;
                    z-index: 9999;
                    background: var(--surface-color);
                    border: 1px solid var(--border-color);
                    color: var(--text-primary);
                    padding: 0.8rem;
                    border-radius: 50%;
                    cursor: pointer;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .theme-toggle:hover {
                    transform: scale(1.1) rotate(15deg);
                    background: var(--primary-color);
                    color: #fff;
                    border-color: var(--primary-color);
                }
                
                [data-theme="light"] .theme-toggle {
                    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                    background: #fff;
                    color: #0f172a;
                }
                [data-theme="light"] .theme-toggle:hover {
                     background: var(--primary-color);
                     color: #fff;
                }
            `}</style>
        </button>
    );
};

export default ThemeToggle;

import { describe, expect, it } from 'vitest';
import { sitePath } from '../src/utils/sitePath.js';

describe('caminho do GitHub Pages', () => {
    it('prefixa o repositório só quando a base não é a raiz', () => {
        expect(sitePath('/blog', '/portfolio/')).toBe('/portfolio/blog');
        expect(sitePath('/blog', '/')).toBe('/blog');
        expect(sitePath('/portfolio/blog', '/portfolio/')).toBe('/portfolio/blog');
        expect(sitePath('https://alexsanderfarias.vercel.app', '/portfolio/')).toBe('https://alexsanderfarias.vercel.app');
    });
});

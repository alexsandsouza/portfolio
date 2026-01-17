import React, { useEffect } from 'react';

const SEO = ({ title, description, image }) => {
    useEffect(() => {
        // Save original values
        const originalTitle = document.title;
        const originalDescription = document.querySelector('meta[name="description"]')?.getAttribute('content');
        const originalOgTitle = document.querySelector('meta[property="og:title"]')?.getAttribute('content');
        const originalOgDesc = document.querySelector('meta[property="og:description"]')?.getAttribute('content');
        const originalOgImage = document.querySelector('meta[property="og:image"]')?.getAttribute('content');

        // Update Title
        if (title) {
            document.title = title;
            document.querySelector('meta[property="og:title"]')?.setAttribute('content', title);
            document.querySelector('meta[property="twitter:title"]')?.setAttribute('content', title);
        }

        // Update Description
        if (description) {
            document.querySelector('meta[name="description"]')?.setAttribute('content', description);
            document.querySelector('meta[property="og:description"]')?.setAttribute('content', description);
            document.querySelector('meta[property="twitter:description"]')?.setAttribute('content', description);
        }

        // Update Image
        if (image) {
            document.querySelector('meta[property="og:image"]')?.setAttribute('content', image);
            document.querySelector('meta[property="twitter:image"]')?.setAttribute('content', image);
        }

        // Cleanup function to reset when component unmounts (optional, but good for SPAs)
        return () => {
            document.title = originalTitle;
            if (originalDescription) document.querySelector('meta[name="description"]')?.setAttribute('content', originalDescription);
            if (originalOgTitle) document.querySelector('meta[property="og:title"]')?.setAttribute('content', originalOgTitle);
            if (originalOgDesc) document.querySelector('meta[property="og:description"]')?.setAttribute('content', originalOgDesc);
            if (originalOgImage) document.querySelector('meta[property="og:image"]')?.setAttribute('content', originalOgImage);
        };
    }, [title, description, image]);

    return null;
};

export default SEO;

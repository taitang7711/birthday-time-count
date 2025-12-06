// Load navigation component
async function loadNavigation() {
    const navPlaceholder = document.getElementById('nav-placeholder');
    if (navPlaceholder) {
        try {
            const response = await fetch('/components/navigation.html');
            const html = await response.text();
            navPlaceholder.innerHTML = html;
            
            // Execute scripts in loaded HTML
            const scripts = navPlaceholder.querySelectorAll('script');
            scripts.forEach(script => {
                const newScript = document.createElement('script');
                newScript.textContent = script.textContent;
                document.body.appendChild(newScript);
            });
        } catch (error) {
            console.error('Failed to load navigation:', error);
        }
    }
}

// Load when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadNavigation);
} else {
    loadNavigation();
}

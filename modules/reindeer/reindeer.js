// Reindeer Story Tab Logic
console.log('🦌 Tuần Lộc story module loaded');

// Story parts animation on scroll
const storyParts = [
    '.story-intro',
    '.story-first-speak',
    '.story-second-speak',
    '.story-message',
    '.story-ending'
];

let revealedParts = new Set();

function revealStoryOnScroll() {
    storyParts.forEach((selector, index) => {
        const element = document.querySelector(selector);
        if (!element) return;
        
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        // Check if element is in viewport
        if (rect.top < windowHeight * 0.8 && rect.bottom >= 0) {
            if (!revealedParts.has(selector)) {
                setTimeout(() => {
                    element.classList.add('visible');
                    revealedParts.add(selector);
                }, index * 150); // Stagger animation
            }
        }
    });
}

// Hug animation
function animateHug() {
    const hugIcon = document.querySelector('.hug-icon');
    if (!hugIcon) return;
    
    setInterval(() => {
        hugIcon.style.transform = 'scale(1.3)';
        setTimeout(() => {
            hugIcon.style.transform = 'scale(1)';
        }, 500);
    }, 3000);
}

// Gentle floating animation for deer images
function initDeerFloating() {
    const deerImages = document.querySelectorAll('.story-deer, .reindeer-img');
    deerImages.forEach((deer, index) => {
        deer.style.animationDelay = `${index * 0.5}s`;
    });
}

// Initialize on load
window.addEventListener('load', () => {
    // Initial reveal
    revealStoryOnScroll();
    
    // Animate hug icon
    setTimeout(animateHug, 2000);
    
    // Init deer floating
    initDeerFloating();
    
    // Add subtle pulse to intro text
    const introText = document.querySelector('.intro-text');
    if (introText) {
        setTimeout(() => {
            introText.classList.add('pulse');
        }, 500);
    }
});

// Reveal story parts on scroll
window.addEventListener('scroll', revealStoryOnScroll);

// Add parallax effect to deer images (very subtle)
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const deerImages = document.querySelectorAll('.story-deer, .reindeer-img');
    
    deerImages.forEach((deer, index) => {
        const speed = 0.1 + (index * 0.05); // Different speeds for depth
        const yPos = -(scrolled * speed);
        deer.style.transform = `translateY(${yPos}px)`;
    });
});

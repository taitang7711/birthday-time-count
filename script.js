// Main App Logic - Tab Switching

function switchTab(tabName) {
    // Remove active class from all tabs and contents
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => btn.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));
    
    // Add active class to selected tab
    const selectedBtn = document.querySelector(`.tab-btn[data-tab="${tabName}"]`);
    const selectedContent = document.getElementById(`${tabName}-tab`);
    
    if (selectedBtn) selectedBtn.classList.add('active');
    if (selectedContent) selectedContent.classList.add('active');
    
    // Clear intervals when switching tabs
    if (typeof counterInterval !== 'undefined' && counterInterval) {
        clearInterval(counterInterval);
    }
    if (typeof dailyInterval !== 'undefined' && dailyInterval) {
        clearInterval(dailyInterval);
    }
    
    // Initialize tab-specific content
    if (tabName === 'birthday') {
        setTimeout(() => startCounter(), 100);
    } else if (tabName === 'daily') {
        initDailyTab();
    }
}

// Initialize on page load
window.addEventListener('load', () => {
    // Set default active tab
    switchTab('daily');
});

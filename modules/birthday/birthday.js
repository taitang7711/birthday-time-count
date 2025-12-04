// Birthday Counter Logic
let counterInterval;

function startCounter() {
    const birthdayInput = document.getElementById('birthday');
    const birthdayValue = birthdayInput.value;
    
    if (!birthdayValue) {
        alert('Vui lòng chọn ngày sinh của bạn! 💕');
        return;
    }
    
    const birthday = new Date(birthdayValue);
    
    if (birthday > new Date()) {
        alert('Ngày sinh không thể ở tương lai! 🌸');
        return;
    }
    
    // Hiển thị kết quả
    const resultSection = document.getElementById('resultSection');
    resultSection.style.display = 'block';
    
    // Xóa interval cũ nếu có
    if (counterInterval) {
        clearInterval(counterInterval);
    }
    
    // Tạo animation cho button
    const btn = document.querySelector('#birthday-tab .calculate-btn');
    btn.style.transform = 'scale(0.95)';
    setTimeout(() => {
        btn.style.transform = 'scale(1)';
    }, 100);
    
    // Cập nhật đếm ngược
    updateCounter(birthday);
    counterInterval = setInterval(() => updateCounter(birthday), 1000);
}

function updateCounter(birthday) {
    const now = new Date();
    const diff = now - birthday;
    
    if (diff < 0) {
        clearInterval(counterInterval);
        return;
    }
    
    // Tính năm và tháng chính xác
    let years = now.getFullYear() - birthday.getFullYear();
    let months = now.getMonth() - birthday.getMonth();
    let remainingDays = now.getDate() - birthday.getDate();
    
    if (remainingDays < 0) {
        months--;
        const lastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        remainingDays += lastMonth.getDate();
    }
    
    if (months < 0) {
        years--;
        months += 12;
    }
    
    const remainingHours = now.getHours() - birthday.getHours();
    const remainingMinutes = now.getMinutes() - birthday.getMinutes();
    const remainingSeconds = now.getSeconds() - birthday.getSeconds();
    
    let finalHours = remainingHours;
    let finalMinutes = remainingMinutes;
    let finalSeconds = remainingSeconds;
    
    if (finalSeconds < 0) {
        finalSeconds += 60;
        finalMinutes--;
    }
    
    if (finalMinutes < 0) {
        finalMinutes += 60;
        finalHours--;
    }
    
    if (finalHours < 0) {
        finalHours += 24;
        remainingDays--;
    }
    
    // Cập nhật UI với animation
    updateElement('years', years);
    updateElement('months', months);
    updateElement('days', remainingDays);
    updateElement('hours', Math.abs(finalHours));
    updateElement('minutes', Math.abs(finalMinutes));
    updateElement('seconds', Math.abs(finalSeconds));
}

function updateElement(id, value) {
    const element = document.getElementById(id);
    if (!element) return;
    
    const currentValue = element.textContent;
    
    if (currentValue !== value.toString()) {
        element.style.transform = 'scale(1.2)';
        element.style.color = '#ff6ec7';
        
        setTimeout(() => {
            element.textContent = value;
            element.style.transform = 'scale(1)';
        }, 150);
    }
}

// Auto start on load
window.addEventListener('load', () => {
    const activeTab = document.querySelector('.tab-content.active');
    if (activeTab && activeTab.id === 'birthday-tab') {
        startCounter();
    }
});

// Daily Counter Logic
let dailyInterval;

function startDailyCounter() {
    const startDateInput = document.getElementById('startDate');
    const startDateValue = startDateInput.value;
    
    if (!startDateValue) {
        alert('Vui lòng chọn ngày bắt đầu! 💕');
        return;
    }
    
    const startDate = new Date(startDateValue);
    
    if (startDate > new Date()) {
        alert('Ngày bắt đầu không thể ở tương lai! 🌸');
        return;
    }
    
    // Hiển thị kết quả
    const resultSection = document.getElementById('dailyResultSection');
    resultSection.style.display = 'block';
    
    // Xóa interval cũ nếu có
    if (dailyInterval) {
        clearInterval(dailyInterval);
    }
    
    // Tạo animation cho button
    const btn = document.querySelector('#daily-tab .calculate-btn');
    btn.style.transform = 'scale(0.95)';
    setTimeout(() => {
        btn.style.transform = 'scale(1)';
    }, 100);
    
    // Cập nhật daily counter
    updateDailyCounter(startDate);
    dailyInterval = setInterval(() => updateDailyCounter(startDate), 1000);
}

function updateDailyCounter(startDate) {
    const now = new Date();
    const diff = now - startDate;
    
    if (diff < 0) {
        clearInterval(dailyInterval);
        return;
    }
    
    // Tính toán thời gian
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30.44); // Trung bình 30.44 ngày/tháng
    
    const remainingHours = hours % 24;
    const remainingMinutes = minutes % 60;
    const remainingSeconds = seconds % 60;
    
    // Cập nhật UI với animation
    updateDailyElement('totalDays', days);
    updateDailyElement('totalWeeks', weeks);
    updateDailyElement('totalMonths', months);
    updateDailyElement('dailyHours', remainingHours);
    updateDailyElement('dailyMinutes', remainingMinutes);
    updateDailyElement('dailySeconds', remainingSeconds);
}

function updateDailyElement(id, value) {
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

// Set default date to today when tab is activated
function initDailyTab() {
    const startDateInput = document.getElementById('startDate');
    if (!startDateInput.value) {
        const today = new Date();
        startDateInput.value = today.toISOString().split('T')[0];
    }
}

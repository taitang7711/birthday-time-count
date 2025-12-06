// Countdown module
console.log('🚀 Countdown module loading...');

// Lunar New Year dates (2025-2030)
const lunarNewYearDates = {
    2025: new Date(2025, 0, 29), // Jan 29, 2025
    2026: new Date(2026, 1, 17), // Feb 17, 2026
    2027: new Date(2027, 1, 6),  // Feb 6, 2027
    2028: new Date(2028, 0, 26), // Jan 26, 2028
    2029: new Date(2029, 1, 13), // Feb 13, 2029
    2030: new Date(2030, 1, 3)   // Feb 3, 2030
};

// Generic countdown function
function updateCountdown(eventId, targetMonth, targetDay, messages) {
    const now = new Date();
    const currentYear = now.getFullYear();
    
    let targetDate = new Date(currentYear, targetMonth, targetDay, 0, 0, 0);
    
    // If event has passed this year, target next year
    if (now > targetDate) {
        targetDate = new Date(currentYear + 1, targetMonth, targetDay, 0, 0, 0);
    }
    
    const timeDiff = targetDate - now;
    
    // Calculate time units
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
    
    // Update DOM
    const daysEl = document.getElementById(`${eventId}-days`);
    const hoursEl = document.getElementById(`${eventId}-hours`);
    const minutesEl = document.getElementById(`${eventId}-minutes`);
    const secondsEl = document.getElementById(`${eventId}-seconds`);
    const messageEl = document.getElementById(`${eventId}-message`);
    
    if (daysEl) daysEl.textContent = days.toString().padStart(2, '0');
    if (hoursEl) hoursEl.textContent = hours.toString().padStart(2, '0');
    if (minutesEl) minutesEl.textContent = minutes.toString().padStart(2, '0');
    if (secondsEl) secondsEl.textContent = seconds.toString().padStart(2, '0');
    
    // Update message based on time remaining
    if (messageEl) {
        if (days === 0 && hours === 0 && minutes === 0 && seconds === 0) {
            messageEl.textContent = messages.today;
            messageEl.style.color = '#0EA5E9';
            messageEl.style.fontWeight = '700';
        } else if (days === 0) {
            messageEl.textContent = messages.sameDay;
            messageEl.style.color = '#38BDF8';
        } else if (days === 1) {
            messageEl.textContent = messages.tomorrow;
            messageEl.style.color = '#0EA5E9';
        } else if (days <= 7) {
            messageEl.textContent = `${messages.week} ${days} ngày!`;
        } else if (days <= 30) {
            messageEl.textContent = `💙 Còn ${days} ngày`;
        } else {
            messageEl.textContent = `📅 Còn ${days} ngày`;
        }
    }
}

// Lunar New Year countdown (with dynamic date)
function updateLunarCountdown() {
    const now = new Date();
    const currentYear = now.getFullYear();
    
    // Find next Lunar New Year
    let targetDate = lunarNewYearDates[currentYear];
    let targetYear = currentYear;
    
    if (!targetDate || now > targetDate) {
        targetYear = currentYear + 1;
        targetDate = lunarNewYearDates[targetYear];
    }
    
    if (!targetDate) {
        // Fallback if year not in our list
        targetDate = new Date(targetYear, 0, 29);
    }
    
    // Update date badge
    const lunarDateEl = document.getElementById('lunar-date');
    if (lunarDateEl) {
        const options = { day: 'numeric', month: 'long' };
        lunarDateEl.textContent = targetDate.toLocaleDateString('vi-VN', options);
    }
    
    const timeDiff = targetDate - now;
    
    // Calculate time units
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
    
    // Update DOM
    const daysEl = document.getElementById('lunar-days');
    const hoursEl = document.getElementById('lunar-hours');
    const minutesEl = document.getElementById('lunar-minutes');
    const secondsEl = document.getElementById('lunar-seconds');
    const messageEl = document.getElementById('lunar-message');
    
    if (daysEl) daysEl.textContent = days.toString().padStart(2, '0');
    if (hoursEl) hoursEl.textContent = hours.toString().padStart(2, '0');
    if (minutesEl) minutesEl.textContent = minutes.toString().padStart(2, '0');
    if (secondsEl) secondsEl.textContent = seconds.toString().padStart(2, '0');
    
    // Update message
    if (messageEl) {
        if (days === 0 && hours === 0 && minutes === 0 && seconds === 0) {
            messageEl.textContent = '🎊 Chúc mừng năm mới! 🧧';
            messageEl.style.color = '#DC2626';
            messageEl.style.fontWeight = '700';
        } else if (days === 0) {
            messageEl.textContent = '🧧 Tết là hôm nay!';
            messageEl.style.color = '#EF4444';
        } else if (days === 1) {
            messageEl.textContent = '⏰ Mai là Tết rồi!';
            messageEl.style.color = '#F87171';
        } else if (days <= 7) {
            messageEl.textContent = `🎆 Sắp đến Tết, còn ${days} ngày!`;
        } else if (days <= 30) {
            messageEl.textContent = `🏮 Còn ${days} ngày đến Tết`;
        } else {
            messageEl.textContent = `📅 Còn ${days} ngày đến Tết Nguyên Đán`;
        }
    }
}

// Update all countdowns
function updateAllCountdowns() {
    // Birthday - August 4
    updateCountdown('birthday', 7, 4, {
        today: '🎉 Chúc mừng sinh nhật! 🎂',
        sameDay: '🎂 Sinh nhật là hôm nay!',
        tomorrow: '⏰ Còn 1 ngày nữa thôi!',
        week: '🎈 Còn'
    });
    
    // Christmas - December 25
    updateCountdown('christmas', 11, 25, {
        today: '🎅 Giáng sinh vui vẻ! 🎄',
        sameDay: '🎄 Noel là hôm nay!',
        tomorrow: '⏰ Mai là Noel rồi!',
        week: '🎁 Sắp đến Noel, còn'
    });
    
    // Valentine - February 14
    updateCountdown('valentine', 1, 14, {
        today: '💕 Happy Valentine! 💝',
        sameDay: '💝 Valentine là hôm nay!',
        tomorrow: '⏰ Mai là Valentine!',
        week: '💖 Sắp đến Valentine, còn'
    });
    
    // New Year - January 1
    updateCountdown('newyear', 0, 1, {
        today: '🎊 Chúc mừng năm mới! 🎉',
        sameDay: '🎆 Tết Dương Lịch là hôm nay!',
        tomorrow: '⏰ Mai là năm mới rồi!',
        week: '🎇 Sắp sang năm mới, còn'
    });
    
    // Driving Test - December 9
    updateCountdown('driving', 11, 9, {
        today: '🎯 Hôm nay thi! Chúc bạn thành công! 🚗',
        sameDay: '🚗 Thi lái xe là hôm nay!',
        tomorrow: '⏰ Mai thi rồi, chuẩn bị thôi!',
        week: '💪 Sắp thi rồi, còn'
    });
    
    // Lunar New Year
    updateLunarCountdown();
}

// Animation for countdown icon
document.addEventListener('DOMContentLoaded', () => {
    const icon = document.querySelector('.countdown-icon');
    
    if (icon) {
        setInterval(() => {
            icon.style.transform = 'scale(1.1) rotate(5deg)';
            setTimeout(() => {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }, 500);
        }, 2000);
    }

    // Start all countdowns
    updateAllCountdowns();
    setInterval(updateAllCountdowns, 1000);

    // Animate feature items
    const featureItems = document.querySelectorAll('.feature-item');
    featureItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        setTimeout(() => {
            item.style.transition = 'all 0.5s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, 200 * (index + 1));
    });
    
    // Animate countdown cards
    const countdownCards = document.querySelectorAll('.countdown-card');
    countdownCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.9)';
        setTimeout(() => {
            card.style.transition = 'all 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
        }, 200 * index);
    });
});

// Daily Counter Logic
let dailyInterval;
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
let selectedDate = new Date();
let currentMoodData = {};

// Lưu ngày bắt đầu vào database
async function saveStartDateToDB(startDate) {
    try {
        const response = await fetch('/api/daily/start-date', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ startDate })
        });
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error saving start date:', error);
        return { success: false, error: error.message };
    }
}

// Lấy ngày bắt đầu từ database
async function loadStartDateFromDB() {
    try {
        const response = await fetch('/api/daily/start-date');
        const result = await response.json();
        if (result.success && result.data) {
            return result.data.start_date;
        }
        return null;
    } catch (error) {
        console.error('Error loading start date:', error);
        return null;
    }
}

async function startDailyCounter() {
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
    
    // Lưu ngày bắt đầu vào database
    const saveResult = await saveStartDateToDB(startDateValue);
    if (saveResult.success) {
        console.log('✅ Đã lưu ngày bắt đầu vào database');
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

// Lưu mood vào database
async function saveMoodToDB(moodDate, moodValue, moodName, note = '') {
    try {
        const response = await fetch('/api/daily/mood', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ moodDate, moodValue, moodName, note })
        });
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error saving mood:', error);
        return { success: false, error: error.message };
    }
}

// Lấy moods của tháng từ database
async function loadMoodsByMonth(year, month) {
    try {
        const response = await fetch(`/api/daily/moods?year=${year}&month=${month}`);
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error loading moods:', error);
        return { success: false, error: error.message };
    }
}

// Render Calendar
function renderCalendar() {
    const year = currentYear;
    const month = currentMonth;
    
    // Update title
    document.getElementById('calendarTitle').textContent = `${month + 1}/${year}`;
    
    // Get first day of month and number of days
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    
    // Adjust first day (Monday = 0)
    const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1;
    
    // Clear calendar
    const calendarDays = document.getElementById('calendarDays');
    calendarDays.innerHTML = '';
    
    // Add empty cells for days before month starts
    for (let i = 0; i < adjustedFirstDay; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day empty';
        calendarDays.appendChild(emptyDay);
    }
    
    // Add days of month
    for (let day = 1; day <= daysInMonth; day++) {
        const dayDiv = document.createElement('div');
        dayDiv.className = 'calendar-day';
        
        const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        
        // Check if has mood data and show emoji
        if (currentMoodData[dateKey]) {
            dayDiv.classList.add('has-mood');
            const emojiSpan = document.createElement('span');
            emojiSpan.className = 'day-emoji';
            emojiSpan.textContent = currentMoodData[dateKey].emoji;
            dayDiv.appendChild(emojiSpan);
            
            const dayNumber = document.createElement('span');
            dayNumber.className = 'day-number';
            dayNumber.textContent = day;
            dayDiv.appendChild(dayNumber);
            
            // Add note indicator if has note
            if (currentMoodData[dateKey].note && currentMoodData[dateKey].note.trim()) {
                const noteIndicator = document.createElement('span');
                noteIndicator.className = 'note-indicator';
                noteIndicator.textContent = '📝';
                noteIndicator.title = 'Có ghi chú';
                noteIndicator.onclick = (e) => {
                    e.stopPropagation();
                    showNotePopup(dateKey, currentMoodData[dateKey].note);
                };
                dayDiv.appendChild(noteIndicator);
            }
        } else {
            dayDiv.textContent = day;
        }
        
        // Check if today
        if (day === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
            dayDiv.classList.add('today');
        }
        
        // Check if selected
        if (day === selectedDate.getDate() && month === selectedDate.getMonth() && year === selectedDate.getFullYear()) {
            dayDiv.classList.add('selected');
        }
        
        dayDiv.onclick = () => selectDate(day);
        calendarDays.appendChild(dayDiv);
    }
}

// Change month
function changeMonth(delta) {
    currentMonth += delta;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    } else if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    renderCalendar();
    loadMonthMoods();
}

// Select date
function selectDate(day) {
    selectedDate = new Date(currentYear, currentMonth, day);
    renderCalendar();
    updateMoodDate();
    loadDayMood();
}

// Update mood date display
function updateMoodDate() {
    const dateStr = `${currentYear}/${String(currentMonth + 1).padStart(2, '0')}/${String(selectedDate.getDate()).padStart(2, '0')}`;
    document.getElementById('moodDate').textContent = dateStr;
}

// Select mood
async function selectMood(value, name, emoji) {
    // Remove previous selection
    document.querySelectorAll('.mood-emoji').forEach(el => el.classList.remove('selected'));
    
    // Add selection to clicked mood
    event.target.closest('.mood-option').querySelector('.mood-emoji').classList.add('selected');
    
    // Update jar
    document.getElementById('jarMoodEmoji').textContent = emoji;
    document.getElementById('jarLabel').textContent = name;
    
    // Get note if exists
    const noteTextarea = document.getElementById('moodNote');
    const note = noteTextarea ? noteTextarea.value : '';
    
    // Save to database
    const dateKey = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;
    const result = await saveMoodToDB(dateKey, value, name, note);
    
    if (result.success) {
        console.log('✅ Mood saved successfully');
        currentMoodData[dateKey] = { value, name, emoji, note };
        renderCalendar(); // Re-render to show note indicator
        drawMoodChart();
    }
}

// Load day mood
async function loadDayMood() {
    const dateKey = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;
    
    if (currentMoodData[dateKey]) {
        const mood = currentMoodData[dateKey];
        updateMoodUI(mood.value, mood.name, mood.emoji, mood.note || '');
    } else {
        // Default mood
        updateMoodUI(6, 'Pleasant', '😊', '');
    }
}

// Update mood UI
function updateMoodUI(value, name, emoji, note = '') {
    // Remove all selections
    document.querySelectorAll('.mood-emoji').forEach(el => {
        el.classList.remove('selected');
        el.parentElement.querySelector('.mood-name')?.remove();
    });
    
    // Add selection
    const moodOption = document.querySelector(`[data-mood="${value}"]`);
    if (moodOption) {
        const emojiEl = moodOption.querySelector('.mood-emoji');
        emojiEl.classList.add('selected');
        
        // Add name label if not exists
        if (!moodOption.querySelector('.mood-name')) {
            const nameEl = document.createElement('div');
            nameEl.className = 'mood-name';
            nameEl.textContent = name;
            moodOption.appendChild(nameEl);
        }
    }
    
    // Update jar
    document.getElementById('jarMoodEmoji').textContent = emoji;
    document.getElementById('jarLabel').textContent = name;
    
    // Update note
    const noteTextarea = document.getElementById('moodNote');
    if (noteTextarea) {
        noteTextarea.value = note;
    }
    
    // Show/hide delete button
    const dateKey = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;
    const deleteMoodBtn = document.getElementById('deleteMoodBtn');
    if (deleteMoodBtn) {
        deleteMoodBtn.style.display = currentMoodData[dateKey] ? 'inline-block' : 'none';
    }
}

// Load month moods
async function loadMonthMoods() {
    const result = await loadMoodsByMonth(currentYear, currentMonth + 1);
    
    if (result.success && result.data) {
        currentMoodData = {};
        result.data.forEach(mood => {
            currentMoodData[mood.mood_date] = {
                value: mood.mood_value,
                name: mood.mood_name,
                emoji: getMoodEmoji(mood.mood_value),
                note: mood.note || ''
            };
        });
        renderCalendar();
        drawMoodChart();
    }
}

// Get mood emoji by value
function getMoodEmoji(value) {
    const emojis = ['', '😤', '😢', '😔', '😐', '😌', '😊', '😄'];
    return emojis[value] || '😊';
}

// Draw mood chart
function drawMoodChart() {
    const canvas = document.getElementById('moodChart');
    const ctx = canvas.getContext('2d');
    
    // Set canvas size responsive
    const container = canvas.parentElement;
    canvas.width = container.offsetWidth;
    canvas.height = window.innerWidth <= 480 ? 120 : 150;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Get mood data for the month
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const data = [];
    
    for (let day = 1; day <= daysInMonth; day++) {
        const dateKey = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        if (currentMoodData[dateKey]) {
            data.push({ day, value: currentMoodData[dateKey].value });
        }
    }
    
    if (data.length === 0) return;
    
    // Calculate average
    const avg = data.reduce((sum, d) => sum + d.value, 0) / data.length;
    const avgEmoji = getMoodEmoji(Math.round(avg));
    document.querySelector('.avg-emoji').textContent = avgEmoji;
    
    // Draw chart
    const padding = 10;
    const chartWidth = canvas.width - padding * 2;
    const chartHeight = canvas.height - padding * 2;
    const xStep = chartWidth / daysInMonth;
    
    // Draw grid lines
    ctx.strokeStyle = '#E0E0E0';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
        const y = padding + (chartHeight / 4) * i;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(canvas.width - padding, y);
        ctx.stroke();
    }
    
    // Draw line
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    ctx.beginPath();
    data.forEach((point, index) => {
        const x = padding + point.day * xStep;
        const y = padding + chartHeight - ((point.value - 1) / 6) * chartHeight;
        
        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    ctx.stroke();
    
    // Draw points
    data.forEach(point => {
        const x = padding + point.day * xStep;
        const y = padding + chartHeight - ((point.value - 1) / 6) * chartHeight;
        
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
    });
}

// Show note popup
function showNotePopup(dateKey, note) {
    // Create popup if not exists
    let popup = document.getElementById('notePopup');
    if (!popup) {
        popup = document.createElement('div');
        popup.id = 'notePopup';
        popup.className = 'note-popup';
        popup.innerHTML = `
            <div class="note-popup-overlay" onclick="closeNotePopup()"></div>
            <div class="note-popup-content">
                <div class="note-popup-header">
                    <h3 class="note-popup-title">📝 Ghi chú</h3>
                    <button class="note-popup-close" onclick="closeNotePopup()">✕</button>
                </div>
                <div class="note-popup-date" id="notePopupDate"></div>
                <div class="note-popup-body" id="notePopupBody"></div>
            </div>
        `;
        document.body.appendChild(popup);
    }
    
    // Format date
    const [year, month, day] = dateKey.split('-');
    const dateStr = `${day}/${month}/${year}`;
    
    // Update content
    document.getElementById('notePopupDate').textContent = dateStr;
    document.getElementById('notePopupBody').textContent = note;
    
    // Show popup
    popup.style.display = 'flex';
}

// Close note popup
function closeNotePopup() {
    const popup = document.getElementById('notePopup');
    if (popup) {
        popup.style.display = 'none';
    }
}

// Delete mood
async function deleteMood() {
    if (!confirm('Bạn có chắc muốn xóa cảm xúc và ghi chú của ngày này?')) {
        return;
    }
    
    const dateKey = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;
    
    try {
        const response = await fetch(`/api/daily/mood?date=${dateKey}`, {
            method: 'DELETE'
        });
        const result = await response.json();
        
        if (result.success) {
            console.log('✅ Mood deleted successfully');
            delete currentMoodData[dateKey];
            
            // Reset UI
            updateMoodUI(6, 'Pleasant', '😊', '');
            document.getElementById('deleteMoodBtn').style.display = 'none';
            
            // Re-render
            renderCalendar();
            drawMoodChart();
            renderJournalList();
        }
    } catch (error) {
        console.error('Error deleting mood:', error);
        alert('Có lỗi khi xóa. Vui lòng thử lại!');
    }
}

// Toggle journal view (all vs current month)
let showAllJournal = false;
function toggleJournalView() {
    showAllJournal = !showAllJournal;
    const toggleText = document.getElementById('journalToggleText');
    toggleText.textContent = showAllJournal ? 'Chỉ tháng này' : 'Hiển thị tất cả';
    renderJournalList();
}

// Render journal list
function renderJournalList() {
    const journalList = document.getElementById('journalList');
    if (!journalList) return;
    
    // Get entries
    let entries = [];
    
    if (showAllJournal) {
        // Get all entries from currentMoodData
        entries = Object.entries(currentMoodData).map(([date, data]) => ({
            date,
            ...data
        }));
    } else {
        // Get current month entries
        const monthStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`;
        entries = Object.entries(currentMoodData)
            .filter(([date]) => date.startsWith(monthStr))
            .map(([date, data]) => ({
                date,
                ...data
            }));
    }
    
    // Filter entries with notes
    entries = entries.filter(entry => entry.note && entry.note.trim());
    
    // Sort by date descending
    entries.sort((a, b) => b.date.localeCompare(a.date));
    
    // Render
    if (entries.length === 0) {
        journalList.innerHTML = '<div class="journal-empty">Chưa có ghi chú nào 📝</div>';
        return;
    }
    
    journalList.innerHTML = entries.map(entry => {
        const [year, month, day] = entry.date.split('-');
        const dateStr = `${day}/${month}/${year}`;
        const notePreview = entry.note.length > 100 ? entry.note.substring(0, 100) + '...' : entry.note;
        
        return `
            <div class="journal-entry" onclick="selectDateFromJournal('${entry.date}')">
                <div class="journal-entry-header">
                    <span class="journal-date">${dateStr}</span>
                    <span class="journal-mood">${entry.emoji} ${entry.name}</span>
                </div>
                <div class="journal-entry-note">${notePreview}</div>
            </div>
        `;
    }).join('');
}

// Select date from journal
function selectDateFromJournal(dateKey) {
    const [year, month, day] = dateKey.split('-');
    currentYear = parseInt(year);
    currentMonth = parseInt(month) - 1;
    selectedDate = new Date(currentYear, currentMonth, parseInt(day));
    
    renderCalendar();
    updateMoodDate();
    loadDayMood();
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Save current mood (called when note changes)
async function saveCurrentMood() {
    // Get current selected mood
    const selectedMoodEl = document.querySelector('.mood-emoji.selected');
    if (!selectedMoodEl) return;
    
    const moodOption = selectedMoodEl.closest('.mood-option');
    const value = parseInt(moodOption.dataset.mood);
    const name = moodOption.dataset.name;
    const emoji = selectedMoodEl.textContent;
    
    // Get note
    const noteTextarea = document.getElementById('moodNote');
    const note = noteTextarea ? noteTextarea.value : '';
    
    // Save to database
    const dateKey = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;
    const result = await saveMoodToDB(dateKey, value, name, note);
    
    if (result.success) {
        console.log('✅ Note saved successfully');
        currentMoodData[dateKey] = { value, name, emoji, note };
        renderCalendar(); // Re-render to show/hide note indicator
    }
}

// Set default date to today when tab is activated
async function initDailyTab() {
    // Initialize calendar
    selectedDate = new Date();
    currentMonth = selectedDate.getMonth();
    currentYear = selectedDate.getFullYear();
    
    renderCalendar();
    updateMoodDate();
    
    // Load moods for current month
    await loadMonthMoods();
    
    // Load today's mood
    await loadDayMood();
    
    // Render journal
    renderJournalList();
    
    // Add resize listener for chart
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            drawMoodChart();
        }, 250);
    });
}

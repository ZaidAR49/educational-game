import { scenarios } from '../../data/questions.js';

// ===== المتغيرات العامة =====
let currentScenarioIndex = 0;
let score = 0;
let hasAnswered = false;

// ===== عناصر الصفحة =====
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const resultScreen = document.getElementById('result-screen');

const scoreElement = document.getElementById('score');
const currentScenarioElement = document.getElementById('current-scenario');
const totalScenariosElement = document.getElementById('total-scenarios');
const progressBar = document.getElementById('progress-bar');

const scenarioIcon = document.getElementById('scenario-icon');
const scenarioTitle = document.getElementById('scenario-title');
const scenarioDescription = document.getElementById('scenario-description');
const choicesContainer = document.getElementById('choices-container');

const feedbackModal = document.getElementById('feedback-modal');
const feedbackIcon = document.getElementById('feedback-icon');
const feedbackTitle = document.getElementById('feedback-title');
const feedbackMessage = document.getElementById('feedback-message');
const tipText = document.getElementById('tip-text');
const feedbackBtn = document.getElementById('feedback-btn');

const resultBadge = document.getElementById('result-badge');
const resultTitle = document.getElementById('result-title');
const resultSubtitle = document.getElementById('result-subtitle');
const finalScore = document.getElementById('final-score');
const maxScore = document.getElementById('max-score');
const resultMessage = document.getElementById('result-message');
const confettiContainer = document.getElementById('confetti');

// ===== دالة بدء اللعبة =====
function startGame() {
    // إعادة تعيين المتغيرات
    currentScenarioIndex = 0;
    score = 0;
    hasAnswered = false;
    
    // تحديث العدد الإجمالي للمواقف
    totalScenariosElement.textContent = scenarios.length;
    maxScore.textContent = scenarios.length * 10;
    
    // إخفاء شاشة البداية وإظهار شاشة اللعبة
    switchScreen(startScreen, gameScreen);
    
    // عرض الموقف الأول
    displayScenario();
}

// ===== دالة عرض الموقف الحالي =====
function displayScenario() {
    const scenario = scenarios[currentScenarioIndex];
    hasAnswered = false;
    
    // تحديث المعلومات العلوية
    scoreElement.textContent = score;
    currentScenarioElement.textContent = currentScenarioIndex + 1;
    
    // تحديث شريط التقدم
    const progress = ((currentScenarioIndex) / scenarios.length) * 100;
    progressBar.style.width = `${progress}%`;
    
    // تحديث بطاقة الموقف
    scenarioIcon.textContent = scenario.icon;
    scenarioTitle.textContent = scenario.title;
    scenarioDescription.textContent = scenario.description;
    
    // إنشاء أزرار الخيارات
    choicesContainer.innerHTML = '';
    scenario.choices.forEach((choice, index) => {
        const button = document.createElement('button');
        button.className = 'choice-btn';
        button.innerHTML = `
            <span class="choice-icon">${choice.icon}</span>
            <span class="choice-text">${choice.text}</span>
        `;
        button.onclick = () => selectChoice(index);
        choicesContainer.appendChild(button);
    });
    
    // إخفاء نافذة النتيجة
    feedbackModal.classList.remove('active');
    
    // إضافة تأثير الظهور
    document.getElementById('scenario-card').style.animation = 'none';
    setTimeout(() => {
        document.getElementById('scenario-card').style.animation = 'slideIn 0.5s ease';
    }, 10);
}

// ===== دالة اختيار الإجابة =====
function selectChoice(choiceIndex) {
    // منع الاختيار المتعدد
    if (hasAnswered) return;
    hasAnswered = true;
    
    const scenario = scenarios[currentScenarioIndex];
    const choice = scenario.choices[choiceIndex];
    const buttons = choicesContainer.querySelectorAll('.choice-btn');
    
    // تعطيل جميع الأزرار
    buttons.forEach(btn => {
        btn.style.pointerEvents = 'none';
    });
    
    // تحديد الزر المختار
    const selectedButton = buttons[choiceIndex];
    
    if (choice.isCorrect) {
        // إجابة صحيحة
        selectedButton.classList.add('correct');
        score += choice.points;
        scoreElement.textContent = score;
        
        // عرض رسالة النجاح
        showFeedback(choice.feedback, true);
    } else {
        // إجابة خاطئة
        selectedButton.classList.add('wrong');
        
        // إظهار الإجابة الصحيحة
        scenario.choices.forEach((c, i) => {
            if (c.isCorrect) {
                buttons[i].classList.add('correct');
            }
        });
        
        // عرض رسالة التوضيح
        showFeedback(choice.feedback, false);
    }
}

// ===== دالة عرض رسالة النتيجة =====
function showFeedback(feedback, isSuccess) {
    feedbackIcon.textContent = isSuccess ? '✅' : '💡';
    feedbackTitle.textContent = feedback.title;
    feedbackTitle.className = `feedback-title ${isSuccess ? 'success' : 'warning'}`;
    feedbackMessage.textContent = feedback.message;
    tipText.textContent = feedback.tip;
    
    // تحديث نص الزر
    if (currentScenarioIndex >= scenarios.length - 1) {
        feedbackBtn.textContent = '🏆 عرض النتيجة';
    } else {
        feedbackBtn.textContent = 'التالي ←';
    }
    
    // إظهار النافذة مع تأخير بسيط
    setTimeout(() => {
        feedbackModal.classList.add('active');
    }, 800);
}

// ===== دالة الانتقال للموقف التالي =====
function nextScenario() {
    currentScenarioIndex++;
    
    if (currentScenarioIndex >= scenarios.length) {
        // انتهاء اللعبة
        showResults();
    } else {
        // عرض الموقف التالي
        displayScenario();
    }
}

// ===== دالة عرض النتائج النهائية =====
function showResults() {
    // تحديث شريط التقدم للنهاية
    progressBar.style.width = '100%';
    
    // حساب النسبة المئوية
    const maxPossibleScore = scenarios.length * 10;
    const percentage = (score / maxPossibleScore) * 100;
    
    // تحديث النتيجة
    finalScore.textContent = score;
    
    // تحديد الرسالة والشارة بناءً على النتيجة
    if (percentage >= 80) {
        resultBadge.textContent = '🏆';
        resultTitle.textContent = 'مبروك يا بطل!';
        resultSubtitle.textContent = 'أنت بطل القرارات الصحيحة!';
        resultMessage.textContent = '🌟 أداء رائع! أنت تعرف كيف تحمي نفسك وتتخذ القرارات الصحيحة!';
    } else if (percentage >= 50) {
        resultBadge.textContent = '⭐';
        resultTitle.textContent = 'أحسنت!';
        resultSubtitle.textContent = 'أداء جيد جداً!';
        resultMessage.textContent = '💪 أنت في الطريق الصحيح! استمر في التعلم واتخاذ القرارات الحكيمة!';
    } else {
        resultBadge.textContent = '🌱';
        resultTitle.textContent = 'لا بأس!';
        resultSubtitle.textContent = 'كل تجربة فرصة للتعلم!';
        resultMessage.textContent = '📚 تعلمت أشياء مهمة! جرب مرة أخرى لتحسين نتيجتك!';
    }
    
    // الانتقال لشاشة النتائج
    switchScreen(gameScreen, resultScreen);
    
    // إضافة تأثير الاحتفال
    if (percentage >= 50) {
        createConfetti();
    }
}

// ===== دالة إنشاء تأثير الاحتفال =====
function createConfetti() {
    confettiContainer.innerHTML = '';
    const colors = ['#2ecc71', '#3498db', '#f39c12', '#e74c3c', '#9b59b6', '#1abc9c'];
    
    for (let i = 0; i < 50; i++) {
        const piece = document.createElement('div');
        piece.className = 'confetti-piece';
        piece.style.left = `${Math.random() * 100}%`;
        piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        piece.style.animationDelay = `${Math.random() * 2}s`;
        piece.style.animationDuration = `${2 + Math.random() * 2}s`;
        confettiContainer.appendChild(piece);
    }
    
    // إزالة التأثير بعد 4 ثواني
    setTimeout(() => {
        confettiContainer.innerHTML = '';
    }, 4000);
}

// ===== دالة إعادة اللعب =====
function restartGame() {
    switchScreen(resultScreen, startScreen);
}

// ===== دالة مشاركة النتيجة =====
function shareResult() {
    const gameUrl = window.location.href;
    const text = `🛡️ لعبت لعبة "بطل القرارات الصحيحة" من جمعية حماية الأسرة وحصلت على ${score} نقطة! 🌟\n\n🎮 جرب الآن:\n${gameUrl}`;
    
    // التحقق من دعم المشاركة
    if (navigator.share) {
        navigator.share({
            title: 'بطل القرارات الصحيحة',
            text: text,
            url: gameUrl
        }).catch(() => {
            // المستخدم ألغى المشاركة أو حدث خطأ
            fallbackShare(text);
        });
    } else {
        fallbackShare(text);
    }
}

// ===== دالة بديلة للمشاركة =====
function fallbackShare(text) {
    // نسخ النص إلى الحافظة
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            alert('✅ تم نسخ النتيجة! يمكنك لصقها ومشاركتها مع أصدقائك.');
        }).catch(() => {
            alert('📋 شارك نتيجتك:\n\n' + text);
        });
    } else {
        alert('📋 شارك نتيجتك:\n\n' + text);
    }
}

// ===== دالة التبديل بين الشاشات =====
function switchScreen(fromScreen, toScreen) {
    fromScreen.classList.remove('active');
    toScreen.classList.add('active');
}

// ===== تهيئة اللعبة عند تحميل الصفحة =====
document.addEventListener('DOMContentLoaded', function() {
    // تحديث العدد الإجمالي للمواقف في شاشة البداية
    totalScenariosElement.textContent = scenarios.length;
    maxScore.textContent = scenarios.length * 10;
    
    // إضافة تأثيرات لوحة المفاتيح للوصول
    document.addEventListener('keydown', function(e) {
        // الضغط على Enter لبدء اللعبة في شاشة البداية
        if (startScreen.classList.contains('active') && e.key === 'Enter') {
            startGame();
        }
        
        // الضغط على الأرقام 1-3 لاختيار الإجابة
        if (gameScreen.classList.contains('active') && !feedbackModal.classList.contains('active')) {
            const num = parseInt(e.key);
            if (num >= 1 && num <= 3) {
                const buttons = choicesContainer.querySelectorAll('.choice-btn');
                if (buttons[num - 1]) {
                    buttons[num - 1].click();
                }
            }
        }
        
        // الضغط على Enter أو Space للمتابعة
        if (feedbackModal.classList.contains('active') && (e.key === 'Enter' || e.key === ' ')) {
            nextScenario();
        }
    });
});

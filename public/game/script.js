/**
 * ===== لعبة بطل القرارات الصحيحة =====
 * حملة توعوية ضد المخدرات
 * من إنتاج: جمعية حماية الأسرة
 */

// ===== بيانات المواقف والسيناريوهات =====
const scenarios = [
    {
        id: 1,
        icon: "🏫",
        title: "في المدرسة",
        description: "صديقك في المدرسة يعرض عليك تجربة شيء غريب يقول إنه سيجعلك تشعر بالسعادة. ماذا تفعل؟",
        choices: [
            {
                text: "أرفض بأدب وأبتعد عنه",
                icon: "🛡️",
                isCorrect: true,
                feedback: {
                    title: "أحسنت! قرار رائع! 🌟",
                    message: "رفضك كان شجاعاً وذكياً. الصديق الحقيقي لا يعرض عليك أشياء تضرك.",
                    tip: "تذكر: الرفض ليس ضعفاً، بل هو قوة وحكمة. أنت تحمي نفسك وصحتك!"
                },
                points: 10
            },
            {
                text: "أوافق لأن صديقي يقول إنها آمنة",
                icon: "❌",
                isCorrect: false,
                feedback: {
                    title: "انتبه! 🤔",
                    message: "الأشياء المجهولة قد تكون خطيرة جداً على صحتك. لا يمكننا الوثوق بكل ما يقوله الآخرون.",
                    tip: "نصيحة: إذا عرض عليك أحد شيئاً غريباً، قل لا بثقة وأخبر شخصاً بالغاً تثق به."
                },
                points: 0
            },
            {
                text: "أخبر المعلم أو المرشد الطلابي",
                icon: "👨‍🏫",
                isCorrect: true,
                feedback: {
                    title: "ممتاز! قرار حكيم! 🏆",
                    message: "إخبار شخص بالغ يساعد في حماية الجميع. أنت بطل حقيقي!",
                    tip: "الكبار موجودون لمساعدتك. لا تخف من طلب المساعدة عند الحاجة."
                },
                points: 10
            }
        ]
    },
    {
        id: 2,
        icon: "🏠",
        title: "في الحي",
        description: "شخص غريب في الحي يعرض عليك حلوى مجانية ويقول إنها لذيذة جداً. ماذا تختار؟",
        choices: [
            {
                text: "أقبل الحلوى لأنها مجانية",
                icon: "🍬",
                isCorrect: false,
                feedback: {
                    title: "توقف! ⚠️",
                    message: "قبول أشياء من غرباء قد يكون خطيراً. بعض الأشخاص يستخدمون الحلوى لإخفاء أشياء ضارة.",
                    tip: "قاعدة ذهبية: لا تقبل أي شيء من شخص غريب، حتى لو بدا لطيفاً."
                },
                points: 0
            },
            {
                text: "أرفض وأذهب إلى البيت فوراً",
                icon: "🏃",
                isCorrect: true,
                feedback: {
                    title: "قرار ذكي! 🌟",
                    message: "حماية نفسك من الغرباء أمر مهم جداً. البيت هو المكان الآمن.",
                    tip: "إذا أصر الشخص الغريب، اركض إلى أقرب مكان آمن وأخبر والديك."
                },
                points: 10
            },
            {
                text: "أرفض وأخبر والديّ عن هذا الشخص",
                icon: "👨‍👩‍👧",
                isCorrect: true,
                feedback: {
                    title: "بطل حقيقي! 🏅",
                    message: "إخبار والديك يساعدهم على حمايتك وحماية الأطفال الآخرين في الحي.",
                    tip: "والداك دائماً في صفك. أخبرهما بكل شيء غريب يحدث معك."
                },
                points: 10
            }
        ]
    },
    {
        id: 3,
        icon: "📱",
        title: "على الإنترنت",
        description: "شخص على الإنترنت يقول لك أنه يعرف طريقة سرية للشعور بالسعادة ويريد إرسالها لك. ماذا تفعل؟",
        choices: [
            {
                text: "أحظر هذا الشخص فوراً",
                icon: "🚫",
                isCorrect: true,
                feedback: {
                    title: "تصرف سليم! 👏",
                    message: "حظر الأشخاص المشبوهين على الإنترنت يحميك من المشاكل.",
                    tip: "الإنترنت فيه أشخاص جيدون وأشخاص سيئون. كن حذراً دائماً!"
                },
                points: 10
            },
            {
                text: "أطلب منه أن يرسلها لي",
                icon: "📩",
                isCorrect: false,
                feedback: {
                    title: "احذر! 🔴",
                    message: "الغرباء على الإنترنت قد يحاولون خداعك. لا تثق بوعود غريبة من أشخاص لا تعرفهم.",
                    tip: "السعادة الحقيقية تأتي من الأشياء الجميلة في حياتك: العائلة، الأصدقاء، الهوايات."
                },
                points: 0
            },
            {
                text: "أخبر والديّ وأُريهم الرسالة",
                icon: "👨‍👩‍👦",
                isCorrect: true,
                feedback: {
                    title: "قرار حكيم جداً! 🌟",
                    message: "مشاركة والديك تساعدهم على حمايتك وتعليمك كيف تتعامل مع هذه المواقف.",
                    tip: "والداك خبراء في حمايتك. دعهم يساعدونك في عالم الإنترنت."
                },
                points: 10
            }
        ]
    },
    {
        id: 4,
        icon: "⚽",
        title: "في النادي الرياضي",
        description: "زميلك في النادي يقول إن هناك حبوباً تجعلك أقوى وأسرع في الرياضة. ماذا تقرر؟",
        choices: [
            {
                text: "أرفض وأقول له أن التدريب هو الطريقة الصحيحة",
                icon: "💪",
                isCorrect: true,
                feedback: {
                    title: "بطل رياضي حقيقي! 🏆",
                    message: "التدريب الجاد والأكل الصحي هما سر القوة الحقيقية، وليس الحبوب المجهولة.",
                    tip: "الأبطال الحقيقيون يبنون قوتهم بالجهد والتدريب، وليس بالغش أو الحبوب."
                },
                points: 10
            },
            {
                text: "أجرب الحبوب لأصبح أقوى",
                icon: "💊",
                isCorrect: false,
                feedback: {
                    title: "خطر! ⚠️",
                    message: "الحبوب المجهولة قد تضر بصحتك وجسمك. القوة الحقيقية لا تأتي من حبوب!",
                    tip: "جسمك أمانة. حافظ عليه بالتدريب الصحيح والغذاء المتوازن والنوم الكافي."
                },
                points: 0
            },
            {
                text: "أسأل المدرب عن رأيه",
                icon: "👨‍🏫",
                isCorrect: true,
                feedback: {
                    title: "تفكير سليم! 🎯",
                    message: "المدرب خبير ويعرف ما هو مفيد وما هو ضار. سؤاله قرار ذكي!",
                    tip: "دائماً استشر الخبراء والكبار قبل تجربة أي شيء جديد يتعلق بصحتك."
                },
                points: 10
            }
        ]
    },
    {
        id: 5,
        icon: "🎉",
        title: "في حفلة عيد ميلاد",
        description: "في حفلة، أحد الأشخاص يعرض عليك مشروباً ويقول إنه سيجعلك مرتاحاً. ماذا تفعل؟",
        choices: [
            {
                text: "أشرب فقط العصير الذي أعرفه",
                icon: "🧃",
                isCorrect: true,
                feedback: {
                    title: "اختيار ممتاز! 🌟",
                    message: "شرب المشروبات المعروفة فقط يحميك من أي خطر.",
                    tip: "في الحفلات، اشرب فقط ما تعرفه ومن مصدر موثوق مثل والديك أو أصحاب الحفلة."
                },
                points: 10
            },
            {
                text: "أقبل المشروب لأكون لطيفاً",
                icon: "🥤",
                isCorrect: false,
                feedback: {
                    title: "انتبه! 🚨",
                    message: "قبول مشروبات مجهولة قد يكون خطيراً. اللطف لا يعني قبول كل شيء!",
                    tip: "من حقك أن ترفض أي شيء لا تعرفه. الرفض المهذب ليس وقاحة."
                },
                points: 0
            },
            {
                text: "أرفض وأخبر شخصاً بالغاً في الحفلة",
                icon: "🗣️",
                isCorrect: true,
                feedback: {
                    title: "شجاع ومسؤول! 💪",
                    message: "إخبار شخص بالغ يساعد في حماية الجميع في الحفلة.",
                    tip: "الشجاعة هي أن تفعل الصواب حتى لو كان صعباً."
                },
                points: 10
            }
        ]
    },
    {
        id: 6,
        icon: "😰",
        title: "عندما تشعر بالضغط",
        description: "تشعر بالتوتر بسبب الامتحانات. صديق يقول إن لديه شيئاً يخفف التوتر بسرعة. ماذا تختار؟",
        choices: [
            {
                text: "أمارس الرياضة أو أتحدث مع عائلتي",
                icon: "🏃‍♂️",
                isCorrect: true,
                feedback: {
                    title: "طريقة صحية وذكية! 🌈",
                    message: "الرياضة والتحدث مع العائلة من أفضل الطرق للتخلص من التوتر بشكل آمن.",
                    tip: "التوتر طبيعي. تعامل معه بطرق صحية: الرياضة، التنفس العميق، التحدث مع من تحب."
                },
                points: 10
            },
            {
                text: "أجرب ما يقدمه صديقي",
                icon: "❓",
                isCorrect: false,
                feedback: {
                    title: "توقف وفكر! 🤔",
                    message: "الأشياء المجهولة قد تزيد مشاكلك بدلاً من حلها. هناك طرق آمنة للتعامل مع التوتر.",
                    tip: "التوتر يمكن التغلب عليه بطرق صحية. لا تحتاج لأي شيء مجهول أو خطير."
                },
                points: 0
            },
            {
                text: "أتحدث مع المرشد الطلابي في المدرسة",
                icon: "💬",
                isCorrect: true,
                feedback: {
                    title: "قرار ناضج! 🎓",
                    message: "المرشد الطلابي متخصص في مساعدة الطلاب على التعامل مع الضغوط.",
                    tip: "طلب المساعدة من المتخصصين علامة على الذكاء والنضج، وليس الضعف."
                },
                points: 10
            }
        ]
    }
];

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

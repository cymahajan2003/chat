document.addEventListener('DOMContentLoaded', () => {
    const welcomeSection = document.querySelector('.welcome-section');
    const translationSection = document.querySelector('.translation-section');
    const inputText = document.getElementById('inputText');
    const outputText = document.getElementById('outputText');
    const sourceLang = document.getElementById('sourceLang');
    const targetLang = document.getElementById('targetLang');
    const useKeyboardBtn = document.getElementById('useKeyboard');

    let timeoutId;

    function showTranslation() {
        welcomeSection.classList.add('fade-out');
        setTimeout(() => {
            welcomeSection.style.display = 'none';
            translationSection.style.display = 'block';
            translationSection.classList.add('fade-in');
            setTimeout(() => translationSection.classList.remove('fade-in'), 500);
        }, 500);
    }

    async function translateText() {
        const text = inputText.value.trim();
        if (!text) {
            outputText.textContent = '';
            return;
        }

        try {
            const response = await fetch('/translate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text: text,
                    source_lang: sourceLang.value,
                    target_lang: targetLang.value
                })
            });

            const data = await response.json();
            
            if (data.error) {
                outputText.textContent = 'Error: ' + data.error;
            } else {
                outputText.textContent = data.translated_text;
            }
        } catch (error) {
            outputText.textContent = 'Error: ' + error.message;
        }
    }

    function debounce(func, wait) {
        return function executedFunction(...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), wait);
        };
    }

    // Translation logic only applies when translation section is visible
    if (translationSection.style.display !== 'none') {
        inputText.addEventListener('input', debounce(translateText, 500));
        sourceLang.addEventListener('change', translateText);
        targetLang.addEventListener('change', translateText);
        useKeyboardBtn.addEventListener('click', () => {
            inputText.focus();
        });
    }
});
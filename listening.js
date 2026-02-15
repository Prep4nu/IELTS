// Correct answers for listening questions
// Allows multiple acceptable answers for flexibility
const correctListeningAnswers = {
    q1: ['insects'],
    q2: ['behaviour', 'behavior'],
    q3: ['father'],
    q4: ['complex', 'complicated'],
    q5: ['reproduction', 'breeding'],
    q6: ['control'],
    q7: ['duck', 'ducks'],
    q8: ['language'],
    q9: ['food'],
    q10: ['cost', 'costs', 'price', 'prices', 'bill', 'bills']
};

function checkListeningAnswers() {
    let correct = 0;
    const totalQuestions = 10;
    let allAnswered = true;
    const resultDiv = document.getElementById('result');
    
    // Save answers to localStorage before checking
    saveAnswersToLocalStorage();
    
    // Check all answers
    for (let i = 1; i <= totalQuestions; i++) {
        const input = document.querySelector(`input[name="q${i}"]`);
        const userAnswer = input.value.trim().toLowerCase();
        
        if (userAnswer === '') {
            allAnswered = false;
            break;
        }
        
        const acceptableAnswers = correctListeningAnswers[`q${i}`].map(ans => ans.toLowerCase());
        const isCorrect = acceptableAnswers.includes(userAnswer);
        
        if (isCorrect) {
            correct++;
            input.style.backgroundColor = '#d4edda'; // Light green
        } else {
            input.style.backgroundColor = '#f8d7da'; // Light red
            input.title = `Acceptable answers: ${correctListeningAnswers[`q${i}`].join(', ')}`;
        }
    }
    
    // Display result
    if (!allAnswered) {
        resultDiv.textContent = '⚠️ Please answer all questions!';
        resultDiv.className = 'result partial';
        resultDiv.style.display = 'block';
        return;
    }
    
    const percentage = Math.round((correct / totalQuestions) * 100);
    let resultMessage = `✓ You scored ${correct}/${totalQuestions} (${percentage}%)`;
    
    if (correct === totalQuestions) {
        resultDiv.textContent = resultMessage + ' - Perfect! 🎉';
        resultDiv.className = 'result success';
    } else if (correct >= totalQuestions * 0.7) {
        resultDiv.textContent = resultMessage + ' - Great job!';
        resultDiv.className = 'result partial';
    } else if (correct >= totalQuestions * 0.5) {
        resultDiv.textContent = resultMessage + ' - Good try!';
        resultDiv.className = 'result partial';
    } else {
        resultDiv.textContent = resultMessage + ' - Keep practicing!';
        resultDiv.className = 'result failed';
    }
    
    resultDiv.style.display = 'block';
    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function resetListeningAnswers() {
    // Clear all inputs
    document.querySelectorAll('input[type="text"]').forEach(input => {
        input.value = '';
        input.style.backgroundColor = '';
        input.title = '';
    });
    
    // Clear result message
    document.getElementById('result').style.display = 'none';
    
    // Clear localStorage
    localStorage.removeItem('listeningAnswers');
}

function saveAnswersToLocalStorage() {
    const answers = {};
    for (let i = 1; i <= 10; i++) {
        const input = document.querySelector(`input[name="q${i}"]`);
        answers[`q${i}`] = input.value.trim();
    }
    localStorage.setItem('listeningAnswers', JSON.stringify(answers));
}

// Audio speed control
window.addEventListener('load', function() {
    const audioPlayer = document.getElementById('audioPlayer');
    const speedButtons = document.querySelectorAll('.speed-btn');
    
    if (audioPlayer && speedButtons.length > 0) {
        speedButtons.forEach(button => {

// Shared audio persistence: restore shared audio and allow upload to persist it
(function(){
    const KEY = 'sharedAudioData';
    window.addEventListener('load', function() {
        const audioPlayer = document.getElementById('audioPlayer');
        if (!audioPlayer) return;
        try {
            const data = localStorage.getItem(KEY);
            if (data) {
                const src = audioPlayer.querySelector('source');
                if (src) { src.src = data; audioPlayer.load(); }
                else { audioPlayer.src = data; audioPlayer.load(); }
            } else {
                // fallback to project-local audio file if present
                const src = audioPlayer.querySelector('source');
                if (src) { src.src = 'audiohw.mp3'; audioPlayer.load(); }
                else { audioPlayer.src = 'audiohw.mp3'; audioPlayer.load(); }
            }
        } catch(e) {}

        // upload input removed from UI; audio persists via localStorage if previously uploaded, otherwise fallback to audiohw.mp3
    });
})();
            button.addEventListener('click', function() {
                const speed = parseFloat(this.getAttribute('data-speed'));
                audioPlayer.playbackRate = speed;
                
                // Update active button
                speedButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
            });
        });
    }
});

// Resizable panels for Reading
const resizer = document.getElementById('resizer');
if (resizer) {
    const leftPanel = document.getElementById('passage-section');
    const rightPanel = document.getElementById('questions-section');
    const container = document.getElementById('container');

    let isResizing = false;

    resizer.addEventListener('mousedown', () => {
        isResizing = true;
        resizer.classList.add('active');
    });

    document.addEventListener('mousemove', (e) => {
        if (!isResizing) return;

        const containerRect = container.getBoundingClientRect();
        const newLeftWidth = e.clientX - containerRect.left;
        const containerWidth = containerRect.width;

        // Set minimum and maximum widths
        const minWidth = 200;
        const maxWidth = containerWidth - 200;

        if (newLeftWidth >= minWidth && newLeftWidth <= maxWidth) {
            leftPanel.style.flex = `0 0 ${newLeftWidth}px`;
            rightPanel.style.flex = `1`;
        }
    });

    document.addEventListener('mouseup', () => {
        isResizing = false;
        resizer.classList.remove('active');
    });
}

// Resizable panels for Transcript
const transcriptResizer = document.getElementById('resizer');
if (transcriptResizer && document.getElementById('transcript-container')) {
    const transcriptSection = document.getElementById('transcript-section');
    const answersSection = document.getElementById('answers-section');
    const transcriptContainer = document.getElementById('transcript-container');

    let isResizing = false;

    transcriptResizer.addEventListener('mousedown', () => {
        isResizing = true;
        transcriptResizer.classList.add('active');
    });

    document.addEventListener('mousemove', (e) => {
        if (!isResizing) return;

        const containerRect = transcriptContainer.getBoundingClientRect();
        const newLeftWidth = e.clientX - containerRect.left;
        const containerWidth = containerRect.width;

        // Set minimum and maximum widths
        const minWidth = 200;
        const maxWidth = containerWidth - 200;

        if (newLeftWidth >= minWidth && newLeftWidth <= maxWidth) {
            transcriptSection.style.flex = `0 0 ${newLeftWidth}px`;
            answersSection.style.flex = `1`;
        }
    });

    document.addEventListener('mouseup', () => {
        isResizing = false;
        transcriptResizer.classList.remove('active');
    });
}

// Correct answers for the questions (each question requires selecting 2 correct answers)
const correctAnswers = {
    q12: ['b', 'g'],  // They can predict areas that may cause trouble in the future, They are more skilled in personal relationships
    q34: ['c', 'e']   // They do not stay with the same company for very long, They are not as well educated as older workers
};

function checkAnswers() {
    let correct = 0;
    let total = 2;
    let allAnswered = true;

    // Check Q1-2 and Q3-4 (all checkboxes)
    for (let question of ['q12', 'q34']) {
        const selected = document.querySelectorAll(`input[name="${question}"]:checked`);
        
        if (selected.length !== 2) {
            allAnswered = false;
            break;
        }
        
        let answers = Array.from(selected).map(el => el.value).sort();
        let correctAnswersSorted = correctAnswers[question].sort();
        
        if (JSON.stringify(answers) === JSON.stringify(correctAnswersSorted)) {
            correct++;
        }
    }

    // Display result
    const resultDiv = document.getElementById('result');
    
    if (!allAnswered) {
        resultDiv.textContent = '⚠️ Please select exactly TWO answers for each question!';
        resultDiv.className = 'result partial';
        resultDiv.style.display = 'block';
        return;
    }

    const score = correct;
    const percentage = Math.round((score / total) * 100);

    let resultMessage = `✓ You scored ${score}/${total} (${percentage}%)`;
    
    // Highlight correct answers
    highlightAnswers();

    if (score === total) {
        resultDiv.textContent = resultMessage + ' - Perfect! 🎉';
        resultDiv.className = 'result success';
    } else if (score >= total * 0.5) {
        resultDiv.textContent = resultMessage + ' - Good try!';
        resultDiv.className = 'result partial';
    } else {
        resultDiv.textContent = resultMessage + ' - Keep practicing!';
        resultDiv.className = 'result failed';
    }

    resultDiv.style.display = 'block';
    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function highlightAnswers() {
    for (let question of ['q12', 'q34']) {
        const options = document.querySelectorAll(`input[name="${question}"]`);
        const correctAnswersList = correctAnswers[question];

        options.forEach(option => {
            const label = option.closest('.option');
            
            if (correctAnswersList.includes(option.value)) {
                if (option.checked) {
                    label.style.backgroundColor = '#d4edda';
                } else {
                    label.style.backgroundColor = '';
                }
            } else {
                if (option.checked) {
                    label.style.backgroundColor = '#f8d7da';
                } else {
                    label.style.backgroundColor = '';
                }
            }
        });
    }
}

// Reset answers when called
function resetAnswers() {
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
    });
    
    document.querySelectorAll('.option').forEach(option => {
        option.style.backgroundColor = '';
    });
    
    document.getElementById('result').style.display = 'none';
}

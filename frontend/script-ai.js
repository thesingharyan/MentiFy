let currentIndex = 0;
let answerResults = [];

const questions = [
    "How was your day?",
    "How is your sleep cycle?",
    "Do you feel stress sometimes?",
    "Do you feel crying sometimes for no reason?",
    "Do you want to tell something more?"
];

const questionDivs = [
    document.getElementById("question1"),
    document.getElementById("question2"),
    document.getElementById("question3"),
    document.getElementById("question4"),
    document.getElementById("question5")
];

const inputs = [
    document.getElementById("q1"),
    document.getElementById("q2"),
    document.getElementById("q3"),
    document.getElementById("q4"),
    document.getElementById("q5")
];

const questionTitle = document.getElementById("questionTitle");
const output = document.getElementById("output");
const progressBar = document.querySelector(".progress-bar");
const nextButton = document.querySelector(".analyze-btn");

// INIT
window.onload = function () {
    showQuestion();
};

// SHOW ONLY CURRENT QUESTION
function showQuestion() {

    // hide all questions
    for (let i = 0; i < questionDivs.length; i++) {
        questionDivs[i].style.display = "none";
    }

    // show current
    questionDivs[currentIndex].style.display = "block";

    questionTitle.innerText = `Question ${currentIndex + 1} of 5`;

    progressBar.style.width = ((currentIndex / 5) * 100) + "%";
}

// NEXT BUTTON
function submitAnswer() {

    let answer = inputs[currentIndex].value.trim();

    if (!answer) {
        alert("Please answer before continuing.");
        return;
    }

    nextButton.disabled = true;
    nextButton.innerText = "Saving answer...";

    fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            question: questions[currentIndex],
            answer: answer
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data.error) {
            throw new Error(data.error);
        }

        answerResults.push({
            question: questions[currentIndex],
            answer,
            prediction: data.prediction,
            confidence: data.confidence
        });

        currentIndex++;
        progressBar.style.width = `${Math.min((currentIndex / 5) * 100, 100)}%`;

        if (currentIndex < 5) {
            showQuestion();
            nextButton.innerText = "Next Question →";
        } else {
            nextButton.innerText = "Get Final Result";
            getFinalResult();
        }
    })
    .catch(err => {
        console.error(err);
        alert("Unable to submit your answer right now. Please try again.");
        nextButton.innerText = "Next Question →";
    })
    .finally(() => {
        nextButton.disabled = false;
    });
}

// FINAL RESULT
function getFinalResult() {

    progressBar.style.width = "100%";

    fetch("http://127.0.0.1:5000/final", {
        method: "POST"
    })
    .then(res => res.json())
    .then(data => {
        if (data.error) {
            throw new Error(data.error);
        }

        const insight = data.insights || {};
        const summary = insight.summary || "We could not generate a summary at this time.";
        const recommendations = (insight.recommendations || []).map(item => `<li>${item}</li>`).join("");
        const habits = (insight.daily_habits || []).map(item => `<li>${item}</li>`).join("");
        const causes = (insight.possible_causes || []).map(item => `<li>${item}</li>`).join("");
        const displayPrediction = data.display_prediction || data.overall_prediction;
        const confidence = formatConfidence(data.confidence || getAverageConfidence());

        const resultClass = getResultClass(displayPrediction);

        document.querySelector('.hero').style.display = 'none';
        document.querySelector('.glass-card').style.display = 'none';
        document.body.classList.add('result-visible');

        const chartLabels = [
            'Normal',
            'Stress',
            'Anxiety',
            'Depression',
            'Bipolar',
            'Suicidal',
            'Personality disorder'
        ];

        const chartData = chartLabels.reduce((acc, label) => {
            acc[label] = 0;
            return acc;
        }, {});

        answerResults.forEach(item => {
            if (chartData[item.prediction] !== undefined) {
                chartData[item.prediction] += 1;
            } else {
                chartData[item.prediction] = (chartData[item.prediction] || 0) + 1;
            }
        });

        output.innerHTML = `
            <section class="result-fullscreen ${resultClass}">
                <div class="result-header">
                    <div>
                        <h1>Mentify AI</h1>
                        <p>Mentify AI is an 87.29% accurate mental wellness engine built on a fine-tuned DistilBERT model trained over 55k+ rows. It predicts one of seven classes: Normal, Stress, Anxiety, Depression, Bipolar, Suicidal, Personality disorder.</p>
                    </div>
                </div>

                <div class="result-top">
                    <div class="prediction-card ${resultClass}">
                        <h2>Final Prediction</h2>
                        <p class="final-prediction-text">${displayPrediction}</p>
                        <p class="confidence-text"><strong>Confidence:</strong> ${confidence}</p>
                        <p class="result-tag">Overall class from the model</p>
                    </div>
                </div>

                <div class="chart-wrapper">
                    <div class="result-chart-card ${resultClass}">
                        <div class="chart-header">
                            <h3>Wellness Snapshot</h3>
                            <p>View how your answers were classified across all seven categories.</p>
                        </div>
                        <canvas id="resultsChart" width="360" height="360"></canvas>
                        <div class="chart-legend"></div>
                    </div>
                </div>

                <div class="result-grid">
                    <div class="section-card summary-card ${resultClass}">
                        <h3>Summary</h3>
                        <p>${summary}</p>
                    </div>
                    <div class="section-card ${resultClass}">
                        <h3>Possible Causes</h3>
                        <ul>${causes}</ul>
                    </div>
                    <div class="section-card ${resultClass}">
                        <h3>Recommendations</h3>
                        <ul>${recommendations}</ul>
                    </div>
                    <div class="section-card ${resultClass}">
                        <h3>Daily Habit Tips</h3>
                        <ul>${habits}</ul>
                    </div>
                </div>

                <p class="disclaimer">${insight.disclaimer || "This is not a medical diagnosis. If you are struggling, consider speaking to a qualified mental health professional."}</p>
            </section>
        `;

        drawChart(chartData);
        nextButton.style.display = "none";
    })
    .catch(err => {
        console.error(err);
        alert("Unable to generate the final report right now. Please try again.");
        nextButton.disabled = false;
        nextButton.innerText = "Get Final Result";
    });
}

function getResultClass(prediction) {
    const redLabels = ["Depression", "Bipolar", "Suicidal"];
    const yellowLabels = ["Stress", "Anxiety", "Personality disorder"];

    if (prediction === "Normal") {
        return "result-green";
    }
    if (yellowLabels.includes(prediction)) {
        return "result-yellow";
    }
    if (redLabels.includes(prediction)) {
        return "result-red";
    }
    return "result-yellow";
}

function getAverageConfidence() {
    if (!answerResults.length) return null;
    const valid = answerResults
        .map(item => Number(item.confidence))
        .filter(value => !Number.isNaN(value));
    if (!valid.length) return null;
    const avg = valid.reduce((sum, value) => sum + value, 0) / valid.length;
    return avg;
}

function formatConfidence(value) {
    if (value == null) {
        return 'N/A';
    }
    let num = Number(value);
    if (Number.isNaN(num)) {
        return 'N/A';
    }
    if (num <= 1) {
        num = num * 100;
    }
    return `${Math.round(num)}%`;
}

function drawChart(data) {
    const canvas = document.getElementById('resultsChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const labels = Object.keys(data);
    const values = Object.values(data);

    if (!labels.length) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#cbd5e1';
        ctx.font = '16px Poppins';
        ctx.textAlign = 'center';
        ctx.fillText('No data available', canvas.width / 2, canvas.height / 2);
        return;
    }

    const colors = {
        'Normal': '#22c55e',
        'Stress': '#f59e0b',
        'Anxiety': '#38bdf8',
        'Depression': '#ef4444',
        'Bipolar': '#fb923c',
        'Suicidal': '#be185d',
        'Personality disorder': '#8b5cf6',
        'Default': '#64748b'
    };

    const total = values.reduce((sum, value) => sum + value, 0);
    let startAngle = -0.5 * Math.PI;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    labels.forEach((label, index) => {
        const value = values[index];
        const sliceAngle = (value / total) * 2 * Math.PI;
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, 140, startAngle, startAngle + sliceAngle);
        ctx.lineTo(canvas.width / 2, canvas.height / 2);
        ctx.fillStyle = colors[label] || colors.Default;
        ctx.fill();
        startAngle += sliceAngle;
    });

    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, 90, 0, 2 * Math.PI);
    ctx.fillStyle = '#0f172a';
    ctx.fill();

    const legendContainer = document.querySelector('.chart-legend');
    if (legendContainer) {
        legendContainer.innerHTML = labels.map((label, index) => {
            const color = colors[label] || colors.Default;
            const value = values[index];
            const percentage = Math.round((value / total) * 100);
            return `<div class="legend-item"><span class="legend-dot" style="background:${color}"></span><strong>${label}</strong><span>${percentage}%</span></div>`;
        }).join('');
    }
}

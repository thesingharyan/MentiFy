🧠 Mentify AI — Mental Wellness Assistant

Mentify AI is an intelligent mental wellness web application that uses a fine-tuned DistilBERT model along with Google Gemini LLM to analyze user emotions and provide personalized mental health insights.

It collects user responses through guided questions and a short MCQ-based test, predicts mental health conditions using AI, and generates deeper suggestions using LLM-based reasoning.


🚀 System Flow
User answers 5 guided mental wellness questions
Each response is analyzed using a fine-tuned DistilBERT model
The model generates predictions for each input
All responses along with predictions are sent to Google Gemini LLM
Gemini LLM generates a detailed mental wellness report including:
Summary
Possible causes
Recommendations
Daily habits
Risk level assessment
User also completes a 10-question MCQ test for additional behavioral insight


⚙️ Tech Stack Used
🔹 Frontend
HTML
CSS
JavaScript
🔹 Backend
Flask (Python)
REST APIs for prediction and analysis
🔹 Machine Learning
PyTorch
Transformers (HuggingFace)
NumPy
Pandas
Scikit-learn
🔹 AI Services
Google Gemini API (google-genai)


🤖 AI/ML Components
🧠 1. DistilBERT Model
Model: DistilBertForSequenceClassification
Fine-tuned on Kaggle dataset (55,000 rows)
Accuracy: 87%
Classifies text into 7 categories:
Anxiety
Bipolar
Depression
Normal
Personality Disorder
Stress
Suicidal

🔗 Hugging Face Model:

[https://huggingface.co/<your-model-link-here>](https://huggingface.co/anisha-14/Mentify-DistilBERT)


🧠 2. Google Gemini LLM
Used for generating deep psychological insights
Takes user answers + model predictions
Generates structured mental wellness report


👨‍💻 Contributors
Anisha Rawat
Aryan Singh


⭐ If you like this project, please consider giving it a star on GitHub — it really helps and is much appreciated!

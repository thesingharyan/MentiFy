# 🧠 MentiFy - the mentalGUARDIAN

MentiFy is an AI-powered mental wellness web application that analyzes user responses using a **fine-tuned DistilBERT** model and generates personalized mental health insights with **Google Gemini LLM**. Through guided questions and a short behavioral assessment, the system provides users with an AI-assisted mental wellness report.

---

## 🚀 System Flow

1. User answers **5 guided mental wellness questions**.
2. Each response is analyzed using a **fine-tuned DistilBERT** model.
3. The model predicts one of **7 mental health categories** for each response.
4. All responses and predictions are sent to **Google Gemini LLM**.
5. Gemini generates a personalized report including:

   * Mental wellness summary
   * Possible causes
   * Personalized recommendations
   * Healthy daily habits
   * Risk level assessment
6. The user also completes a **10-question MCQ-based behavioral assessment** for additional insights.

---

## ⚙️ Tech Stack

### 🌐 Frontend

* HTML
* CSS
* JavaScript

### ⚡ Backend

* Flask
* REST APIs

### 🤖 Machine Learning

* Fine-tuned DistilBERT
* PyTorch
* Hugging Face Transformers
* Scikit-learn
* NumPy
* Pandas

### 🧠 AI Integration

* Google Gemini API (`google-genai`)

---

## 🤖 AI Models

### 🧠 Fine-tuned DistilBERT

* **Architecture:** DistilBertForSequenceClassification
* **Training Dataset:** Kaggle Mental Health Dataset (~55,000 samples)
* **Accuracy:** **87%**
* **Classification Categories:**

  * Anxiety
  * Bipolar
  * Depression
  * Normal
  * Personality Disorder
  * Stress
  * Suicidal

### 🤖 Google Gemini LLM

Generates a personalized mental wellness report based on:

* User responses
* DistilBERT predictions
* Behavioral assessment

The report includes practical recommendations and wellness insights tailored to the user's responses.

---

## 🤗 Fine-tuned DistilBERT Model

**Hugging Face Model**

https://huggingface.co/anisha-14/Mentify-DistilBERT

---

## 📓 Google Colab Training Notebook

The complete notebook used to train and fine-tune the DistilBERT model is available here:

https://colab.research.google.com/drive/1ds8LwlH5gBoMOYptxi-l2LJUfT9z30Jf?usp=sharing

---

👨‍💻 Authors

Anisha Rawat
Aryan Singh

⭐ **If you found this project helpful, consider giving this repository a Star! Your support helps us continue improving MentiFy.**

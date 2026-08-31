**🧠 Mental Health Score Prediction**

A machine-learning-based web application that predicts a mental health score from lifestyle, academic, and social-media usage patterns.

The project takes user information such as screen usage, phone unlocks, study hours, physical activity, sleep, stress level, academic level, and social-media preferences, processes the data through a trained machine learning model, and returns an interactive predicted score.

⚠️**Disclaimer**: This project is intended for educational and predictive purposes only. It is not a medical diagnostic tool and should not be used as a substitute for professional medical advice.

🌐**Live Demo**

**Try the application:**
https://mental-health-score-1-ezdw.onrender.com

**GitHub Repository:**
https://github.com/mansithakur18/Mental-Health-Score

**✨ Features**
🧠 Machine-learning-based mental health score prediction

📱 Uses social-media usage patterns as input

😴 Considers sleep and physical activity

📚 Considers study hours and academic level

🧠 Includes perceived stress level

🔓 Considers daily phone unlock frequency

🌍 Handles country information with country grouping

⚡ FastAPI REST API

✅ Pydantic input validation

🎨 Interactive responsive web interface

📊 Visual prediction result

🚀 Deployed using Render

## 🔄 How It Works

**The application follows this workflow:**

```text
                    USER
                     │
                     ▼
          ┌─────────────────────┐
          │   Web Interface     │
          │ HTML/CSS/JavaScript │
          └──────────┬──────────┘
                     │
                     ▼
          ┌─────────────────────┐
          │    FastAPI API      │
          │     /predict        │
          └──────────┬──────────┘
                     │
                     ▼
          ┌─────────────────────┐
          │ Pydantic Validation │
          └──────────┬──────────┘
                     │
                     ▼
          ┌─────────────────────┐
          │ Data Processing     │
          │      Pandas         │
          └──────────┬──────────┘
                     │
                     ▼
          ┌─────────────────────┐
          │ Trained ML Model    │
          │   Scikit-learn      │
          └──────────┬──────────┘
                     │
                     ▼
          ┌─────────────────────┐
          │ Predicted Mental    │
          │    Health Score     │
          └─────────────────────┘
```

## 📋 Input Features

The application accepts the following information:

| Feature | Description |
|---|---|
| `Age` | User age |
| `Gender` | Gender category |
| `Country` | User's country |
| `Academic_Level` | High School, Undergraduate, or Graduate |
| `Most_Used_Platform` | Primary social-media platform |
| `Purpose_Of_Use` | Networking, Education, Entertainment, or News |
| `Avg_Daily_Usage_Hours` | Average social-media usage in hours |
| `Daily_Unlocks` | Number of phone unlocks per day |
| `Study_Hours` | Daily study hours |
| `Physical_Activity_Hours` | Physical activity hours |
| `Sleep_Hours_Per_Night` | Average sleep hours per night |
| `Stress_Level` | Low, Medium, High, or Very High |

**🤖 Machine Learning**

The trained machine-learning model is stored as:

`Mental_Health_Model.pkl`

The model is loaded using joblib and used by the FastAPI backend to generate predictions.

The application creates a structured Pandas DataFrame from the validated user input before passing it to the trained model.

The prediction is returned as a numerical score rounded to two decimal places.

**🌍 Country Grouping**

The application handles country information by grouping countries into a predefined set of top countries.

The supported grouped countries include:

Other
India
USA
Canada
Australia
UK
Germany
Mexico
Turkey
France

Countries outside this list are grouped into:

Other

This helps maintain consistency with the features expected by the trained model.

⚙️ **Backend**

The backend is built using FastAPI.
### API Endpoint

`POST /predict`

The API accepts validated JSON input and returns:

{
  "predicted_mental_health_score": 6.06
}
API Documentation

When running locally, FastAPI automatically provides interactive API documentation at:

`http://127.0.0.1:8000/docs`

🛠️ **Technology Stack**
Machine Learning
Python
Pandas
NumPy
Scikit-learn
Joblib
Backend
FastAPI
Pydantic
Uvicorn
Frontend
HTML
CSS
JavaScript
Deployment
Render
Version Control
Git
GitHub

## 📁 Project Structure

```text
Mental-Health-Score/
│
├── Mental_Health_Model.pkl
│   └── Trained machine learning model
│
├── Mental_health.ipynb
│   └── Data analysis and model development
│
├── Student Social Media And Mental Health Impact.csv
│   └── Dataset
│
├── main.py
│   └── FastAPI backend and prediction API
│
├── index.html
│   └── Web application structure
│
├── style.css
│   └── User interface styling and animations
│
├── script.js
│   └── Frontend interaction and API communication
│
├── requirements.txt
│   └── Python dependencies
│
├── runtime.txt
│   └── Deployment Python runtime configuration
│
└── README.md
    └── Project documentation
```
        
🚀 **Run Locally**

### 1. Clone the repository

```bash
git clone https://github.com/mansithakur18/Mental-Health-Score.git
```

### 2. Open the project

```bash
cd Mental-Health-Score
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Start the FastAPI server

```bash
python -m uvicorn main:app --reload
```

### 5. Open the application

```text
http://127.0.0.1:8000/
```

### 6. Open API documentation

```text
http://127.0.0.1:8000/docs
```
🔌 **API Example**

### Request

```json
{
  "Age": 21,
  "Gender": "Female",
  "Country": "India",
  "Academic_Level": "Undergraduate",
  "Most_Used_Platform": "Instagram",
  "Purpose_Of_Use": "Entertainment",
  "Avg_Daily_Usage_Hours": 5,
  "Daily_Unlocks": 60,
  "Study_Hours": 4,
  "Physical_Activity_Hours": 1,
  "Sleep_Hours_Per_Night": 7,
  "Stress_Level": "Medium"
}
```

### Response

```json
{
  "predicted_mental_health_score": 6.06
}
```

The exact prediction will vary depending on the input values and trained model.

🎨 **User Interface**

The application provides an interactive interface where users can enter their information and receive the predicted score.

The UI was designed with:

Dark/black visual theme
Fuchsia and baby-pink accents
Animated background elements
Interactive stress-level selection
Animated prediction gauge
Responsive layout
Separate loading, result, and error states

🚀 **Deployment**

The application is deployed using Render.

**Live Application**

https://mental-health-score-1-ezdw.onrender.com

The deployed application connects the frontend with the FastAPI backend and loads the trained machine-learning model to generate predictions.

Note: Free hosting services may temporarily put inactive services to sleep, so the first request after inactivity can take longer.

📚**What I Learned**

This project helped me gain practical experience in:

Building and using machine-learning models
Data preprocessing
Feature engineering
Working with categorical data
Saving and loading ML models using Joblib
Building REST APIs with FastAPI
Validating API inputs using Pydantic
Connecting frontend and backend
Handling CORS
Creating interactive frontend interfaces
Deploying a machine-learning application
Debugging dependency and deployment issues
Using Git and GitHub for version control

🔮 **Future Improvements**

Possible future improvements include:

Improving model performance through additional experimentation
Adding model evaluation metrics to the application
Adding prediction history
Adding visual analytics and charts
Improving accessibility
Adding authentication
Adding a database for storing user sessions
Exploring more advanced machine-learning models
Adding automated testing
Improving deployment and monitoring


👩‍💻 **Author**

Mansi Thakur

**GitHub:**
https://github.com/mansithakur18

**LinkedIn:**
https://www.linkedin.com/in/mansi-thakur18



Source Code:
https://github.com/mansithakur18/Mental-Health-Score

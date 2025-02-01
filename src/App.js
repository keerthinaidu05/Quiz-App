import React, { useState, useEffect } from 'react';
import './App.css';

// API URL for fetching quiz questions
const API_URL = "/crmsLa";

const App = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Fetched data:', data);

        if (!Array.isArray(data)) {
          throw new Error('Invalid data format: expected an array of questions');
        }

        setQuestions(data);
        setLoading(false);
        setError(null);
      } catch (error) {
        console.error('Error fetching quiz data:', error);
        setLoading(false);
        setError('Failed to load quiz questions. Please try again.');
      }
    };

    fetchQuizData();
  }, []);

  const startQuiz = () => {
    if (questions.length === 0) {
      setError('No questions available. Please try again.');
      return;
    }
    setQuizStarted(true);
    setScore(0);
    setCurrentQuestionIndex(0);
    setError(null);
  };

  const selectAnswer = (selectedIndex) => {
    if (!questions[currentQuestionIndex]) return;

    const currentQuestion = questions[currentQuestionIndex];
    if (currentQuestion.options[selectedIndex].is_correct) {
      setScore(score + 1);
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Quiz is finished
      setQuizStarted(false);
    }
  };

  const renderQuestion = () => {
    if (!questions || questions.length === 0) {
      return <p>No questions available.</p>;
    }

    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion) {
      return <p>Error loading question.</p>;
    }

    return (
      <div className="question-container">
        <h2>{currentQuestion.question}</h2>
        <ul className="options-list">
          {currentQuestion.options.map((option, index) => (
            <li 
              key={index}
              className="option-item"
              onClick={() => selectAnswer(index)}
            >
              {option.text}
            </li>
          ))}
        </ul>
        <p>Question {currentQuestionIndex + 1} of {questions.length}</p>
        <p>Current Score: {score}</p>
      </div>
    );
  };

  if (loading) {
    return <div className="app">Loading quiz questions...</div>;
  }

  if (error) {
    return (
      <div className="app">
        <p className="error">{error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <div className="app">
      {!quizStarted ? (
        <div>
          <h1> Welcome to Quiz!</h1>
          <button onClick={startQuiz}>Start Quiz</button>
          {score > 0 && <p>Previous Score: {score}/{questions.length}</p>}
        </div>
      ) : currentQuestionIndex < questions.length && currentQuestionIndex < 3 ? (
        renderQuestion()
      ) : (
        <div>
          <h2>Quiz Completed!</h2>
          <p>Your Final Score: {score}/{questions.length}</p>
          <button onClick={startQuiz}>Restart Quiz</button>
        </div>
      )}
    </div>
  );
};

export default App;

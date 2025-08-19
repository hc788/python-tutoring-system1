
import './App.css';

import React, { useState, useEffect } from 'react';
import { BookOpen, Award, Trophy, Star, CheckCircle, XCircle, RotateCcw, Download } from 'lucide-react';

// Mock GPT API for generating questions
const generateQuestions = async (level) => {
  const questionSets = {
    beginner: [
      {
        id: 1,
        question: "What is the correct way to print 'Hello World' in Python?",
        options: ["echo('Hello World')", "print('Hello World')", "console.log('Hello World')", "println('Hello World')"],
        correct: 1,
        explanation: "print() is the built-in function in Python to display output."
      },
      {
        id: 2,
        question: "Which of these is a valid Python variable name?",
        options: ["2variable", "variable-name", "variable_name", "variable name"],
        correct: 2,
        explanation: "Python variable names can contain letters, numbers, and underscores, but cannot start with a number or contain spaces/hyphens."
      },
      {
        id: 3,
        question: "What data type is the value 42 in Python?",
        options: ["string", "float", "int", "boolean"],
        correct: 2,
        explanation: "42 is an integer (int) in Python."
      },
      {
        id: 4,
        question: "How do you create a comment in Python?",
        options: ["// This is a comment", "/* This is a comment */", "# This is a comment", "<!-- This is a comment -->"],
        correct: 2,
        explanation: "Python uses the # symbol for single-line comments."
      },
      {
        id: 5,
        question: "What will len('Python') return?",
        options: ["5", "6", "7", "Error"],
        correct: 1,
        explanation: "len() returns the number of characters in a string. 'Python' has 6 characters."
      },
      {
        id: 6,
        question: "Which operator is used for exponentiation in Python?",
        options: ["^", "**", "exp", "pow"],
        correct: 1,
        explanation: "** is the exponentiation operator in Python (e.g., 2**3 = 8)."
      },
      {
        id: 7,
        question: "What is the output of: print(type(3.14))?",
        options: ["<class 'int'>", "<class 'float'>", "<class 'decimal'>", "<class 'number'>"],
        correct: 1,
        explanation: "3.14 is a floating-point number, so type() returns <class 'float'>."
      },
      {
        id: 8,
        question: "How do you get user input in Python?",
        options: ["input()", "get()", "read()", "scanf()"],
        correct: 0,
        explanation: "input() is the built-in function to get user input in Python."
      },
      {
        id: 9,
        question: "What does the 'in' operator do?",
        options: ["Imports a module", "Checks membership", "Defines a function", "Creates a loop"],
        correct: 1,
        explanation: "The 'in' operator checks if a value exists in a sequence (like a list or string)."
      },
      {
        id: 10,
        question: "Which method converts a string to lowercase?",
        options: ["lower()", "lowercase()", "toLower()", "downcase()"],
        correct: 0,
        explanation: "The lower() method converts all characters in a string to lowercase."
      }
    ],
    intermediate: [
      {
        id: 1,
        question: "What is the output of: [1, 2, 3] + [4, 5, 6]?",
        options: ["[5, 7, 9]", "[1, 2, 3, 4, 5, 6]", "Error", "[15]"],
        correct: 1,
        explanation: "The + operator concatenates lists in Python."
      },
      {
        id: 2,
        question: "What does list comprehension [x*2 for x in range(3)] produce?",
        options: ["[0, 2, 4]", "[2, 4, 6]", "[0, 1, 2]", "[1, 2, 3]"],
        correct: 0,
        explanation: "range(3) gives [0,1,2], and x*2 gives [0,2,4]."
      },
      {
        id: 3,
        question: "Which is the correct way to handle exceptions?",
        options: ["catch/throw", "try/except", "try/catch", "handle/error"],
        correct: 1,
        explanation: "Python uses try/except blocks for exception handling."
      },
      {
        id: 4,
        question: "What is a lambda function?",
        options: ["A named function", "An anonymous function", "A class method", "A module function"],
        correct: 1,
        explanation: "Lambda functions are anonymous functions defined with the lambda keyword."
      },
      {
        id: 5,
        question: "What does the zip() function do?",
        options: ["Compresses files", "Combines iterables", "Sorts lists", "Filters data"],
        correct: 1,
        explanation: "zip() combines multiple iterables element-wise into tuples."
      },
      {
        id: 6,
        question: "What is the difference between '==' and 'is'?",
        options: ["No difference", "== checks value, is checks identity", "== checks identity, is checks value", "Both are deprecated"],
        correct: 1,
        explanation: "== compares values for equality, while 'is' checks if two variables refer to the same object."
      },
      {
        id: 7,
        question: "What does *args allow in a function?",
        options: ["Keyword arguments", "Variable number of arguments", "Default arguments", "Type hints"],
        correct: 1,
        explanation: "*args allows a function to accept a variable number of positional arguments."
      },
      {
        id: 8,
        question: "Which data structure is mutable?",
        options: ["tuple", "string", "list", "frozenset"],
        correct: 2,
        explanation: "Lists are mutable (can be changed), while tuples, strings, and frozensets are immutable."
      },
      {
        id: 9,
        question: "What is a decorator in Python?",
        options: ["A design pattern", "A function modifier", "A class attribute", "A loop construct"],
        correct: 1,
        explanation: "Decorators are functions that modify or enhance other functions."
      },
      {
        id: 10,
        question: "What does the enumerate() function return?",
        options: ["Just indices", "Just values", "Index-value pairs", "Sorted values"],
        correct: 2,
        explanation: "enumerate() returns pairs of (index, value) for each item in an iterable."
      }
    ],
    advanced: [
      {
        id: 1,
        question: "What is the Global Interpreter Lock (GIL)?",
        options: ["A thread synchronization mechanism", "A memory management tool", "A debugging feature", "A package manager"],
        correct: 0,
        explanation: "GIL is a mutex that protects access to Python objects, preventing multiple threads from executing Python bytecode simultaneously."
      },
      {
        id: 2,
        question: "What is the purpose of __slots__ in a class?",
        options: ["Define methods", "Restrict attributes and save memory", "Create inheritance", "Handle exceptions"],
        correct: 1,
        explanation: "__slots__ restricts which attributes can be added to instances and reduces memory usage."
      },
      {
        id: 3,
        question: "What does the @property decorator do?",
        options: ["Creates class variables", "Makes methods act like attributes", "Defines static methods", "Handles inheritance"],
        correct: 1,
        explanation: "@property allows methods to be accessed like attributes while maintaining getter/setter functionality."
      },
      {
        id: 4,
        question: "What is monkey patching?",
        options: ["Debugging technique", "Dynamic modification of classes/modules", "Error handling", "Code optimization"],
        correct: 1,
        explanation: "Monkey patching is dynamically modifying a class or module at runtime."
      },
      {
        id: 5,
        question: "What is the difference between shallow and deep copy?",
        options: ["No difference", "Shallow copies references, deep copies objects recursively", "Deep copies references, shallow copies objects", "Both create new objects"],
        correct: 1,
        explanation: "Shallow copy creates a new object but references to nested objects remain the same. Deep copy recursively copies all nested objects."
      },
      {
        id: 6,
        question: "What is a metaclass?",
        options: ["A parent class", "A class that creates classes", "An abstract class", "A utility class"],
        correct: 1,
        explanation: "A metaclass is a class whose instances are classes themselves. It defines how classes are created."
      },
      {
        id: 7,
        question: "What does yield do in a function?",
        options: ["Returns a value", "Creates a generator", "Raises an exception", "Defines a variable"],
        correct: 1,
        explanation: "yield makes a function a generator, allowing it to produce values lazily on demand."
      },
      {
        id: 8,
        question: "What is the purpose of asyncio?",
        options: ["Threading", "Asynchronous programming", "Parallel processing", "Memory management"],
        correct: 1,
        explanation: "asyncio is a library for writing asynchronous, concurrent code using async/await syntax."
      },
      {
        id: 9,
        question: "What is a context manager?",
        options: ["A design pattern for resource management", "A debugging tool", "A type of decorator", "A data structure"],
        correct: 0,
        explanation: "Context managers handle resource allocation and cleanup automatically using with statements."
      },
      {
        id: 10,
        question: "What does the __call__ method do?",
        options: ["Calls other methods", "Makes objects callable like functions", "Handles inheritance", "Manages memory"],
        correct: 1,
        explanation: "__call__ allows an object to be called like a function by defining obj() behavior."
      }
    ]
  };
  
  return questionSets[level] || [];
};

const PythonTutoringSystem = () => {
  const [currentLevel, setCurrentLevel] = useState('');
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [isComplete, setIsComplete] = useState(false);
  const [earnedBadge, setEarnedBadge] = useState(null);
  const [userBadges, setUserBadges] = useState({ silver: false, gold: false, platinum: false });
  const [loading, setLoading] = useState(false);

  const levelRequirements = {
    beginner: { threshold: 7, badge: 'silver', name: 'Silver' },
    intermediate: { threshold: 8, badge: 'gold', name: 'Gold' },
    advanced: { threshold: 9, badge: 'platinum', name: 'Platinum' }
  };

  const startTest = async (level) => {
    setLoading(true);
    setCurrentLevel(level);
    setCurrentQuestionIndex(0);
    setScore(0);
    setUserAnswers([]);
    setIsComplete(false);
    setShowResult(false);
    setEarnedBadge(null);
    
    const generatedQuestions = await generateQuestions(level);
    setQuestions(generatedQuestions);
    setLoading(false);
  };

  const submitAnswer = () => {
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.correct;
    
    const newAnswer = {
      questionId: currentQuestion.id,
      selected: selectedAnswer,
      correct: currentQuestion.correct,
      isCorrect
    };
    
    setUserAnswers([...userAnswers, newAnswer]);
    
    if (isCorrect) {
      setScore(score + 1);
    }
    
    setShowResult(true);
  };

  const nextQuestion = () => {
    setSelectedAnswer(null);
    setShowResult(false);
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      completeTest();
    }
  };

  const completeTest = () => {
    const finalScore = score + (selectedAnswer === questions[currentQuestionIndex].correct ? 1 : 0);
    const level = currentLevel;
    const requirement = levelRequirements[level];
    
    if (finalScore >= requirement.threshold) {
      const badgeToEarn = requirement.badge;
      if (!userBadges[badgeToEarn]) {
        setEarnedBadge({
          type: badgeToEarn,
          name: requirement.name,
          level: level
        });
        setUserBadges(prev => ({ ...prev, [badgeToEarn]: true }));
      }
    }
    
    setIsComplete(true);
  };

  const resetTest = () => {
    setCurrentLevel('');
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setUserAnswers([]);
    setIsComplete(false);
    setEarnedBadge(null);
  };

  const generateCertificate = () => {
    if (!earnedBadge) return;
    
    const certificateContent = `
CERTIFICATE OF ACHIEVEMENT

This certifies that the bearer has successfully completed the
${earnedBadge.level.toUpperCase()} LEVEL Python Programming Assessment

Badge Earned: ${earnedBadge.name}
Level: ${earnedBadge.level}
Score: ${score}/${questions.length}
Date: ${new Date().toLocaleDateString()}

Congratulations on your achievement!
    `.trim();
    
    const blob = new Blob([certificateContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `python-${earnedBadge.level}-certificate.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const canTakeLevel = (level) => {
    if (level === 'beginner') return true;
    if (level === 'intermediate') return userBadges.silver;
    if (level === 'advanced') return userBadges.gold;
    return false;
  };

  const getBadgeIcon = (badgeType) => {
    switch (badgeType) {
      case 'silver': return <Award className="text-gray-400" size={24} />;
      case 'gold': return <Trophy className="text-yellow-500" size={24} />;
      case 'platinum': return <Star className="text-purple-500" size={24} />;
      default: return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Generating questions...</p>
        </div>
      </div>
    );
  }

  if (!currentLevel) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <BookOpen className="text-indigo-600" size={48} />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Python Learning Hub</h1>
            <p className="text-xl text-gray-600">Master Python programming with our intelligent tutoring system</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Badges</h2>
            <div className="flex space-x-6">
              <div className={`flex items-center space-x-2 ${userBadges.silver ? 'text-gray-800' : 'text-gray-400'}`}>
                {getBadgeIcon('silver')}
                <span>Silver Badge</span>
              </div>
              <div className={`flex items-center space-x-2 ${userBadges.gold ? 'text-gray-800' : 'text-gray-400'}`}>
                {getBadgeIcon('gold')}
                <span>Gold Badge</span>
              </div>
              <div className={`flex items-center space-x-2 ${userBadges.platinum ? 'text-gray-800' : 'text-gray-400'}`}>
                {getBadgeIcon('platinum')}
                <span>Platinum Badge</span>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Beginner Level */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-green-500 p-4">
                <h3 className="text-xl font-semibold text-white">Beginner</h3>
                <p className="text-green-100">Python basics and fundamentals</p>
              </div>
              <div className="p-6">
                <div className="mb-4">
                  <p className="text-gray-600 mb-2">Requirements:</p>
                  <p className="text-sm text-gray-500">Score 7/10 to earn Silver Badge</p>
                </div>
                <button
                  onClick={() => startTest('beginner')}
                  disabled={!canTakeLevel('beginner')}
                  className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors disabled:bg-gray-300"
                >
                  Start Beginner Test
                </button>
              </div>
            </div>

            {/* Intermediate Level */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-yellow-500 p-4">
                <h3 className="text-xl font-semibold text-white">Intermediate</h3>
                <p className="text-yellow-100">Data structures and functions</p>
              </div>
              <div className="p-6">
                <div className="mb-4">
                  <p className="text-gray-600 mb-2">Requirements:</p>
                  <p className="text-sm text-gray-500">Silver Badge + Score 8/10 for Gold</p>
                </div>
                <button
                  onClick={() => startTest('intermediate')}
                  disabled={!canTakeLevel('intermediate')}
                  className="w-full bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 transition-colors disabled:bg-gray-300"
                >
                  {canTakeLevel('intermediate') ? 'Start Intermediate Test' : 'Requires Silver Badge'}
                </button>
              </div>
            </div>

            {/* Advanced Level */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-purple-500 p-4">
                <h3 className="text-xl font-semibold text-white">Advanced</h3>
                <p className="text-purple-100">Advanced concepts and patterns</p>
              </div>
              <div className="p-6">
                <div className="mb-4">
                  <p className="text-gray-600 mb-2">Requirements:</p>
                  <p className="text-sm text-gray-500">Gold Badge + Score 9/10 for Platinum</p>
                </div>
                <button
                  onClick={() => startTest('advanced')}
                  disabled={!canTakeLevel('advanced')}
                  className="w-full bg-purple-500 text-white py-2 px-4 rounded-lg hover:bg-purple-600 transition-colors disabled:bg-gray-300"
                >
                  {canTakeLevel('advanced') ? 'Start Advanced Test' : 'Requires Gold Badge'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isComplete) {
    const finalScore = userAnswers.length > 0 ? userAnswers.filter(a => a.isCorrect).length : score;
    const passed = finalScore >= levelRequirements[currentLevel].threshold;

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            {passed && earnedBadge ? (
              <div>
                <div className="mb-6">
                  {getBadgeIcon(earnedBadge.type)}
                </div>
                <h2 className="text-3xl font-bold text-green-600 mb-4">🎉 Congratulations!</h2>
                <p className="text-xl text-gray-700 mb-6">You've earned the {earnedBadge.name} Badge!</p>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <p className="text-green-800">Level: {currentLevel}</p>
                  <p className="text-green-800">Score: {finalScore}/{questions.length}</p>
                  <p className="text-green-800">Badge: {earnedBadge.name}</p>
                </div>
                <div className="space-y-4">
                  <button
                    onClick={generateCertificate}
                    className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Download size={16} />
                    <span>Download Certificate</span>
                  </button>
                  <button
                    onClick={resetTest}
                    className="w-full bg-indigo-500 text-white py-2 px-4 rounded-lg hover:bg-indigo-600 transition-colors"
                  >
                    Back to Main Menu
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <XCircle className="text-red-500 mx-auto mb-4" size={48} />
                <h2 className="text-2xl font-bold text-red-600 mb-4">Try Again!</h2>
                <p className="text-gray-700 mb-6">
                  You scored {finalScore}/{questions.length}. You need at least {levelRequirements[currentLevel].threshold} to pass.
                </p>
                <div className="space-y-4">
                  <button
                    onClick={() => startTest(currentLevel)}
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2"
                  >
                    <RotateCcw size={16} />
                    <span>Try Again</span>
                  </button>
                  <button
                    onClick={resetTest}
                    className="w-full bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Back to Main Menu
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  
  if (!currentQuestion) {
    return <div className="p-6 text-center">Loading questions...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800 capitalize">{currentLevel} Level</h2>
              <span className="text-sm text-gray-500">
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-6">{currentQuestion.question}</h3>
            
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedAnswer(index)}
                  disabled={showResult}
                  className={`w-full text-left p-4 rounded-lg border transition-colors ${
                    selectedAnswer === index
                      ? showResult
                        ? index === currentQuestion.correct
                          ? 'bg-green-100 border-green-500 text-green-800'
                          : 'bg-red-100 border-red-500 text-red-800'
                        : 'bg-indigo-100 border-indigo-500 text-indigo-800'
                      : showResult && index === currentQuestion.correct
                        ? 'bg-green-100 border-green-500 text-green-800'
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-medium">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span>{option}</span>
                    {showResult && (
                      <div className="ml-auto">
                        {index === currentQuestion.correct ? (
                          <CheckCircle className="text-green-500" size={20} />
                        ) : selectedAnswer === index ? (
                          <XCircle className="text-red-500" size={20} />
                        ) : null}
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {showResult && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">{currentQuestion.explanation}</p>
            </div>
          )}

          <div className="flex justify-between">
            <button
              onClick={resetTest}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Exit Test
            </button>
            
            {!showResult ? (
              <button
                onClick={submitAnswer}
                disabled={selectedAnswer === null}
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-gray-300"
              >
                Submit Answer
              </button>
            ) : (
              <button
                onClick={nextQuestion}
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Test'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;



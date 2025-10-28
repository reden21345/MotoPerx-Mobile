// QuizGame.js - Main Container Component
import React, { useState, useEffect, useRef } from "react";
import { View, Alert, Animated } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { quizGameStyles as styles } from "../../styles/QuizGame";
import {
  getQuizQuestions,
  submitQuizAnswers,
  getUserQuizHistory,
  getQuizLeaderboard,
} from "../../redux/actions/gameAction";

import QuizHeader from "../../components/games/quiz/QuizHeader";
import QuizMenu from "../../components/games/quiz/QuizMenu";
import QuizQuestion from "../../components/games/quiz/QuizQuestion";
import QuizResult from "../../components/games/quiz/QuizResult";
import QuizHistory from "../../components/games/quiz/QuizHistory";
import QuizLeaderboard from "../../components/games/quiz/QuizLeaderboard";

const QuizGame = ({ navigation }) => {
  const dispatch = useDispatch();
  const {
    questions,
    quizResult,
    quizHistory,
    quizLeaderboard,
    loading,
    weekStart,
  } = useSelector((state) => state.games);

  const [gameState, setGameState] = useState("menu");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [questionStartTime, setQuestionStartTime] = useState(null);
  const [isCompetitive, setIsCompetitive] = useState(false);
  const [timer, setTimer] = useState(60);
  const [competitiveTries, setCompetitiveTries] = useState(0);

  const progressAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const timerInterval = useRef(null);

  useEffect(() => {
    dispatch(getUserQuizHistory());
    dispatch(getQuizLeaderboard());

    return () => {
      if (timerInterval.current) {
        clearInterval(timerInterval.current);
      }
    };
  }, [dispatch]);

  useEffect(() => {
    if (quizHistory) {
      const weeklyCompetitive = quizHistory.filter(
        (q) => q.isCompetitive && q.weekStart === weekStart
      );
      setCompetitiveTries(weeklyCompetitive.length);
    }
  }, [quizHistory, weekStart]);

  useEffect(() => {
    if (gameState === "quiz" && questions && questions.length > 0) {
      Animated.timing(progressAnim, {
        toValue: (currentQuestionIndex + 1) / questions.length,
        duration: 300,
        useNativeDriver: false,
      }).start();

      setQuestionStartTime(Date.now());
      setTimer(60);

      timerInterval.current = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            handleTimeout();
            return 60;
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        if (timerInterval.current) {
          clearInterval(timerInterval.current);
        }
      };
    }
  }, [currentQuestionIndex, gameState, questions]);

  const startQuiz = async (competitive = false) => {
    if (competitive && competitiveTries >= 3) {
      Alert.alert(
        "Limit Reached",
        "You've used all 3 competitive attempts this week. Try practice mode or wait for next week!",
        [{ text: "OK" }]
      );
      return;
    }

    setIsCompetitive(competitive);
    setGameState("quiz");
    setCurrentQuestionIndex(0);
    setSelectedAnswers([]);

    try {
      await dispatch(getQuizQuestions({ limit: 10 })).unwrap();
    } catch (error) {
      Alert.alert("Error", "Failed to load questions. Please try again.");
      setGameState("menu");
    }
  };

  const handleTimeout = () => {
    const timeTaken = 60;
    handleAnswerSelect(null, timeTaken);
  };

  const handleAnswerSelect = (answer, customTime = null) => {
    if (timerInterval.current) {
      clearInterval(timerInterval.current);
    }

    const timeTaken = customTime || (Date.now() - questionStartTime) / 1000;

    const newAnswer = {
      questionId: questions[currentQuestionIndex]._id,
      selectedAnswer: answer,
      timeTaken: Math.round(timeTaken),
    };

    const updatedAnswers = [...selectedAnswers, newAnswer];
    setSelectedAnswers(updatedAnswers);

    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        finishQuiz(updatedAnswers);
      }
    }, 500);
  };

  const finishQuiz = async (answers) => {
    if (timerInterval.current) {
      clearInterval(timerInterval.current);
    }

    setGameState("result");

    try {
      await dispatch(
        submitQuizAnswers({
          answers,
          isCompetitive,
        })
      ).unwrap();

      dispatch(getUserQuizHistory());
      dispatch(getQuizLeaderboard());
    } catch (error) {
      Alert.alert("Error", error || "Failed to submit quiz. Please try again.");
    }
  };

  const handleBackPress = () => {
    if (gameState === "quiz") {
      Alert.alert("Exit Quiz", "Are you sure? Your progress will be lost.", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Exit",
          onPress: () => {
            if (timerInterval.current) {
              clearInterval(timerInterval.current);
            }
            navigation.goBack();
          },
        },
      ]);
    } else {
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <QuizHeader onBackPress={handleBackPress} />

      {gameState === "menu" && (
        <QuizMenu
          quizHistory={quizHistory}
          competitiveTries={competitiveTries}
          onStartQuiz={startQuiz}
          onViewHistory={() => {
            dispatch(getUserQuizHistory());
            setGameState("history");
          }}
          onViewLeaderboard={() => {
            dispatch(getQuizLeaderboard());
            setGameState("leaderboard");
          }}
        />
      )}

      {gameState === "quiz" && (
        <QuizQuestion
          questions={questions}
          currentQuestionIndex={currentQuestionIndex}
          timer={timer}
          progressAnim={progressAnim}
          onAnswerSelect={handleAnswerSelect}
          loading={loading}
        />
      )}

      {gameState === "result" && (
        <QuizResult
          quizResult={quizResult}
          isCompetitive={isCompetitive}
          onBackToMenu={() => setGameState("menu")}
          onViewLeaderboard={() => {
            dispatch(getQuizLeaderboard());
            setGameState("leaderboard");
          }}
        />
      )}

      {gameState === "history" && (
        <QuizHistory
          quizHistory={quizHistory}
          onBackToMenu={() => setGameState("menu")}
        />
      )}

      {gameState === "leaderboard" && (
        <QuizLeaderboard
          quizLeaderboard={quizLeaderboard}
          weekStart={weekStart}
          onBackToMenu={() => setGameState("menu")}
        />
      )}
    </View>
  );
};

export default QuizGame;

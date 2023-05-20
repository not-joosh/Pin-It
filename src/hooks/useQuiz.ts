import { useState } from "react";
import { useToast } from "@chakra-ui/react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, userRef } from "../store/firebaseConfig";
import { useNavigate } from "react-router-dom";
import { HOME } from "../lib/routes";

interface Choice {
    question: string;
    choice: string;
};

interface UserData { 
    quizzes: Quiz[];
    flashCardsBuffer: [];
    email: string;
    fullName: string;
    username: string;
    id: string;
};

type FormData = {
    choices: Choice[];
};

interface FlashCardBuffer {
    flashcardsBuffer: FlashCard[];
    quizzes: Quiz[];
};

interface FlashCard {
    answer: string;
    question: string;
    options: string[];
    wasAnsweredCorrect: boolean; 
};

interface Quiz {
    quizName: string;
    flashCards: FlashCard[];
    results: { score: string; timestamp: string }[];    
};

export const useQuiz = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const toast = useToast();
    const navigate =  useNavigate();

    const finishQuiz = async (flashCardResponses: FormData) => {
        try {  
            setIsLoading(true);
            let score = 0;

            // Retrieve the answer key from localStorage or wherever it's stored
            const answerKey: Quiz = JSON.parse(localStorage.getItem("selectedQuiz") || "");
            const quizName = answerKey.quizName;

            // Calculate the score and mark the answers
            for (const response of flashCardResponses.choices) {
                const { question, choice } = response;
                const flashCard = answerKey.flashCards.find((card) => card.question === question);

                if (flashCard && flashCard.answer === choice) {
                    score++;
                flashCard.wasAnsweredCorrect = true;
                } else if (flashCard) {
                    flashCard.wasAnsweredCorrect = false;
                }
            }

            // Save the quiz results to Firestore
            const userId = auth.currentUser?.uid;
            const userDocRef = doc(userRef, userId);
            const userDocSnap = await getDoc(userDocRef);

            if (userDocSnap.exists()) {
                const userData = userDocSnap.data() as FlashCardBuffer;
                const quizResult = {
                    score: `${score}/${flashCardResponses.choices.length}`,
                    timestamp: new Date().toISOString(),
                };
                const existingQuiz = userData.quizzes.find((quiz) => quiz.quizName === quizName);
                if (existingQuiz) {
                    if (existingQuiz.results) {
                        existingQuiz.results.push(quizResult);
                    } else {
                        existingQuiz.results = [quizResult];
                    }
                } else {
                    userData.quizzes.push({
                        quizName: quizName,
                        flashCards: answerKey.flashCards,
                        results: [quizResult],
                    });
                }

                await updateDoc(userDocRef, {
                    quizzes: userData.quizzes,
                });

                // Save the marked answers in localStorage
                const markedAnswers = answerKey.flashCards.map((card) => ({
                    ...card,
                    wasAnsweredCorrect: card.wasAnsweredCorrect ?? false,
                }));

                localStorage.setItem("markedAnswers", JSON.stringify(markedAnswers));

                toast({
                    title: "Quiz graded successfully!",
                    description: `SCORE: [${score}/${flashCardResponses.choices.length}] on QUIZ:'${quizName}'`,
                    status: "success",
                    isClosable: true,
                    position: "top",
                    duration: 10000,
                });
            } else {
                throw new Error("User document not found");
            }
        } catch(error: unknown) {
            if(error instanceof Error)
                toast({
                    title: 'Quiz Result failed to save!',
                    status: 'error',
                    isClosable: true,
                    position: 'top',
                    description: error.message,
                    duration: 3000,
                });
        } finally { // 
            setIsLoading(false);
        }
    };
    const createQuiz = async (quizName: string) => {
        try { // 
            setIsLoading(true);
            const userDocRef = doc(userRef, auth.currentUser?.uid);
            const userDocSnap = await getDoc(userDocRef);

            if (userDocSnap.exists()) {
                const userData = userDocSnap.data() as FlashCardBuffer;

                const quiz: Quiz = {
                    quizName: quizName,
                    flashCards: userData.flashcardsBuffer,
                    results: []
                };
                let updatedQuizzes = [quiz, ...userData.quizzes];

                await updateDoc(userDocRef, {
                    quizzes: updatedQuizzes,
                    flashcardsBuffer: [],
                });
                localStorage.removeItem('hasMadeCard');
                toast({
                    title: 'Quiz Created Successfully!',
                    status: 'success',
                    isClosable: true,
                    position: 'top',
                    duration: 3000,
                }); 
            } else {
                throw new Error('User document not found');
            }
            toast({
                title: 'Flashcard Created Successfully!',
                status: 'success',
                isClosable: true,
                position: 'top',
                duration: 3000,
            });
            navigate(HOME);
        } catch(error: unknown) {
            if(error instanceof Error)
                toast({
                    title: 'Flashcard Creattion failed!',
                    status: 'error',
                    isClosable: true,
                    position: 'top',
                    description: error.message,
                    duration: 3000,
                });
        } finally {
            setIsLoading(false);
        }
    };
    const deleteQuiz = async(quizName: string) => {
        try { 
            setIsLoading(true);
            const userDoc = doc(userRef, auth.currentUser?.uid);
            const userSnapshot = await getDoc(userDoc);
            const userData = userSnapshot.data() as UserData;
            // Find the index of the quiz with the specified name
            const quizIndex = userData?.quizzes.findIndex((quiz: Quiz) => quiz.quizName === quizName);

            if (quizIndex !== undefined && quizIndex > -1) {
                // Remove the quiz from the quizzes array
                userData.quizzes.splice(quizIndex, 1);
                // Update the user document in Firebase
                await updateDoc(userDoc, {
                    quizzes: userData.quizzes
                });
            }
            toast({
                title: 'Quiz Deleted Successfully!',
                status: 'success',
                isClosable: true,
                position: 'top',
                duration: 3000,
            });
        } catch(error: unknown) {
            if(error instanceof Error) 
                toast({
                    title: 'Quiz Deletion failed!',
                    status: 'error',
                    isClosable: true,
                    position: 'top',
                    description: error.message,
                    duration: 3000,
                });
        } finally { 
            setIsLoading(false);
        }
    };  
    return { createQuiz, isLoading, finishQuiz, deleteQuiz };
};
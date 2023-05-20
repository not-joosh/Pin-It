import { useState } from "react";
import { useToast } from "@chakra-ui/react";
import { auth, userRef } from "../store/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";

interface FlashCardBuffer {
    flashcardsBuffer: FlashCard[];
};
interface FlashCard {
    answer: string;
    question: string;
    options: string[];
};

export const useFlashcard = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const toast = useToast();

    const createFlashCard = async (question: string, answer: string, option1: string, option2: string, option3: string) => {
        try {
            setIsLoading(true);
            let requestedArr: string[] = [];
            if (option1.length > 0) requestedArr.push(option1);
            if (option2.length > 0) requestedArr.push(option2);
            if (option3.length > 0) requestedArr.push(option3);
        
            const flashcardData: FlashCard = {
                question: question,
                answer: answer,
                options: requestedArr,
            };
      
            const userDocRef = doc(userRef, auth.currentUser?.uid);
            const userDocSnap = await getDoc(userDocRef);
            if (userDocSnap.exists()) {
                const userData = userDocSnap.data() as FlashCardBuffer;
                let updatedBufferArr: FlashCard[] = [];
                if (Array.isArray(userData.flashcardsBuffer)) {
                    // If flashcardsBuffer is already an array, prepend the new flashcardData
                    updatedBufferArr = [flashcardData, ...userData.flashcardsBuffer];
                } else {
                    // If flashcardsBuffer is not an array, create a new array with the new flashcardData
                    updatedBufferArr = [flashcardData];
                }
                await updateDoc(userDocRef, {
                    flashcardsBuffer: updatedBufferArr,
                });
            } else {
                throw new Error('Something went wrong...');
            }
            localStorage.setItem('hasMadeCard', 'true');
            toast({
                title: 'Flashcard Created Successfully!',
                status: 'success',
                isClosable: true,
                position: 'top',
                duration: 3000,
            });
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast({
                    title: 'Flashcard creation failed!',
                    status: 'error',
                    isClosable: true,
                    position: 'top',
                    description: error.message,
                    duration: 3000,
                });
            }
        } finally {
            setIsLoading(false);
        }
    };

    const clearBuffer = async() => {
        try {
            setIsLoading(true);
            const userID = localStorage.getItem('userUid') || auth.currentUser?.uid;
            const userDocRef = doc(userRef, userID);
            await updateDoc(userDocRef, {
                flashcardsBuffer: [],
            });
            localStorage.removeItem('hasMadeCard');
            toast({
                title: 'Quiz Creation Cancelled Successfully!',
                status: 'success',
                isClosable: true,
                position: 'top',
                duration: 3000,
            }); 
        } catch(error: unknown) {
            if(error instanceof Error)
                toast({
                    title: 'Quiz Creation Cancellation failed!',
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
    return { createFlashCard, isLoading, clearBuffer};
};
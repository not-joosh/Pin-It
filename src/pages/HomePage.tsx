import { useEffect, useState } from "react";
import { BackDrop } from "../components/decorations/BackDrop";
import { useNavigate } from "react-router-dom";
import { auth, userRef } from "../store/firebaseConfig";
import { CREATEQUIZ, LANDINGPAGE, STARTQUIZ, VIEWQUIZ } from "../lib/routes";
import { onSnapshot, query, where } from "firebase/firestore";
import { useAuth } from "../hooks/useAuth";
import { clientState } from "../store/storeConfig";
import { useLocalStorageListener } from "../lib/helpers/LocalStorageListener";
import { AnimatePresence, motion } from "framer-motion";
import { fadeAnimation, slideAnimation } from "../lib/helpers/motion";
import { useFlashcard } from "../hooks/useFlashcard";
import { useToast } from "@chakra-ui/react";
import { lofiTwo } from "../assets/assetsConfig";

interface Flashcard {
    option1: string;
    option2: string;    
    option3: string;
    option4: string;
    question: string;
    answer: string;
}; export type { Flashcard };

interface Quiz {
    quizName: string;
    flashcards: Flashcard[];
}; export type { Quiz };

const MainContent = () => {
    const [quizzes, setQuizzes] = useState<Quiz[] | null>(null);
    const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
    const {tryLogout} = useAuth();
    const toast = useToast();
    const navigate = useNavigate();
  
    const handleLogout = async () => {
        try {
            // Logging them out, redirecting to landpage
            await tryLogout(LANDINGPAGE);
        } catch(error: unknown) {   
            if(error instanceof Error) console.log(error.message);
        }
    }

    const handleStartQuiz = () => {
        if (!selectedQuiz) {
            toast({
                title: "Quiz failed to Start!",
                status: "error",
                isClosable: true,
                position: "top",
                description: "Please select a quiz first.",
                duration: 3000,
            });
            return;
        }
        localStorage.setItem("selectedQuiz", JSON.stringify(selectedQuiz));
        navigate(STARTQUIZ);
    };

    useEffect(() => {   
        const userId = auth.currentUser?.uid || localStorage.getItem("userUid");
        if (!userId) return; 

        const unsubscribe = onSnapshot(
            query(userRef, where("id", "==", userId)), (snapshot) => {
                const userData = snapshot.docs[0]?.data();
                if (userData) {
                    setQuizzes(userData.quizzes);
                    localStorage.setItem("quizzes", JSON.stringify(userData.quizzes));
                }
            }
        );

        const storedQuizzes = localStorage.getItem("quizzes");
        clientState.isValidLocalChange = true;
        clientState.quizzes = storedQuizzes? JSON.parse(storedQuizzes) : null;
        clientState.isValidLocalChange = false;
        if (storedQuizzes) setQuizzes(JSON.parse(storedQuizzes));
        return () => unsubscribe();
    }, []);
    useEffect(() => {
        const audio = new Audio(lofiTwo);
        audio.loop = true;
        audio.play();
        return () => {
            audio.pause();
            audio.currentTime = 0;
        };
    }, []);
    return (
        <>
            <AnimatePresence>
                <motion.div {...fadeAnimation}>
                    <button className="logoutBtn" onClick={() => handleLogout()}>Logout</button>
                </motion.div>
                <div className="mainContent">
                    <motion.div {...slideAnimation('down')}>
                        <div className="mcSelectedQuizDiv">
                            Selected Quiz: {" "}
                            <span style = {{color: 'red'}}>
                                {selectedQuiz ? selectedQuiz.quizName : "No Quiz Selected"}
                            </span>
                        </div>
                    </motion.div>
                    <motion.div {...slideAnimation('up')}>
                        <select
                            onChange={(e) => {
                                const selectedQuizName = e.target.value;
                                const quiz = quizzes?.find((quiz) => quiz.quizName === selectedQuizName);
                                setSelectedQuiz(quiz || null);
                            }}
                        >
                        <option className="mcDropDownOptions" value="">Select Quiz</option>
                        {quizzes?.map((quiz) => (
                            <option style = {{color: 'black'}} key={quiz.quizName} value={quiz.quizName}>
                                {quiz.quizName} 
                            </option>
                        ))}
                        </select>
                    </motion.div>
                    <motion.div {...slideAnimation('up')}>
                        <button className="mcButton" onClick = {() => handleStartQuiz()}>Start Quiz</button>
                        <button className="mcButton" onClick = {() => navigate(VIEWQUIZ)}>View Quizzes</button>
                        <button className="mcButton" onClick = {() => navigate(CREATEQUIZ)}>Create Quiz</button>
                        {/* <button className="mcButton" onClick = {() => alert('Sorry! This has not yet been Implemented')}>View Progress</button> */}
                    </motion.div>
                </div>
            </AnimatePresence>
        </>
    );
};
export const HomePage = () => {
    const navigate = useNavigate();
    const {clearBuffer} = useFlashcard();
    const handleFireStoreSync = async () => {
        try {
            await clearBuffer();
        } catch(error: unknown) {
            if(error instanceof Error) console.log(error.message);
        }
    };
    useEffect(() => {
        const refresh = localStorage.getItem('hasMadeCard');
        if(refresh) handleFireStoreSync();
        const userId = auth.currentUser?.uid || localStorage.getItem("userUid");
        if(!userId) navigate(LANDINGPAGE)
    }, []);

    useEffect(() => {
        const audio = new Audio(lofiTwo);
        audio.loop = true;
        audio.play();
        return () => {
            audio.pause();
            audio.currentTime = 0;
        };
    }, []);

    useLocalStorageListener();

    return <BackDrop componentIN = {<MainContent />}/>
};



    /*
       Logic:
        This is what the data in the firebase looks like:
        Collection: 
            userAssets
            Documents:
                wMMRTE3hokakFMLAtpuLlUpPco72
                DOCUMENTT FIELDS:
                    email: "notjoosh@gmail.com"
                    fullName: "Josh Ratificar"
                    id: "wMMRTE3hokakFMLAtpuLlUpPco72"
                    quizzes: [
                    0 - {
                        flashcards[
                            0 - {
                                answer: "Grape"
                                option1: "Apple"
                                option2: "Orange"
                                option3: "Kiwi"
                                option4: "Grape"
                                question: "Which fruit is purple?"
                            }
                            1 - {
                                answer: "blue"
                                option1: "red"
                                option2: "white"
                                option3: "blue"
                                option4: "orange"
                                question: "What color is the sky in Arizona?"
                            }
                            2 - {
                                answer: "Rodjean"
                                option1: "Holchi"
                                option2: "Mohan"
                                option3: "Ben"
                                option4: "Rodjean"
                                question: "Which of these people are the cutest mfs ever?"
                            }
                        ]
                        quizName: "Electronics Circuits | Logic Gates"
                    }
                ]
                username: "not.joosh"

            -------
            userRef is defined as: export const userRef = collection(db, 'userAssets');
            This is what i need to happen, In a use effect, i need to grab all of the quizzes using
            onSnapshot for real time.
            After the grab, we need to push all the quizzes object into local storaeg. This is important
            because if hey refresh, we need to be able to render which selected quiz they grabbed and lso still have 
            access to all the quizzes.
            I also need to implement a drop down that displays all of the quiz names. If they click it, it should set the selecteedQuiz state.
       */
      
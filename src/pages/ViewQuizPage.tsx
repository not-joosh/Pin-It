import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../store/firebaseConfig";
import { HOME, LANDINGPAGE } from "../lib/routes";
import { useLocalStorageListener } from "../lib/helpers/LocalStorageListener";
import { BackDrop } from "../components/decorations/BackDrop";
import { AnimatePresence, motion } from "framer-motion";
import { userRef } from "../store/firebaseConfig";
import { onSnapshot, query, where } from "firebase/firestore";
import { Quiz } from "./HomePage";
import { clientState } from "../store/storeConfig";
import { LoadingIcon } from "../components/decorations/Loading/LoadingIcon";
import { useQuiz } from "../hooks/useQuiz";
import { ConfirmDeletionModal } from "../components/ConfirmDeletionModl";
import "../stylesheets/ViewQuizPage.css";

const MainContent = () => {
    const [quizzes, setQuizzes] = useState<Quiz[] | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [askForConfirmation, setAskForConfirmation] = useState<boolean>(false);
    const [selectedQuizName, setSelectedQuizName] = useState<string>('');
    const {deleteQuiz} = useQuiz();
    const navigate = useNavigate();

    const handleQuizDelete = async (quizName: string) => {
        try {
            setIsLoading(true);
            setAskForConfirmation(false);
            await deleteQuiz(quizName);
        } catch(error: unknown) {
            if(error instanceof Error) console.log(error.message);
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        const userId = auth.currentUser?.uid || localStorage.getItem("userUid");
        if (!userId) return;
        const unsubscribe = onSnapshot(query(userRef, where("id", "==", userId)), (snapshot) => {
            const userData = snapshot.docs[0]?.data();
            if (userData) {
                setQuizzes(userData.quizzes);
                localStorage.setItem("quizzes", JSON.stringify(userData.quizzes));
            }
        });
        const storedQuizzes = localStorage.getItem("quizzes");
        clientState.isValidLocalChange = true;
        clientState.quizzes = storedQuizzes ? JSON.parse(storedQuizzes) : null;
        clientState.isValidLocalChange = false;
        if (storedQuizzes) setQuizzes(JSON.parse(storedQuizzes));
        return () => unsubscribe();
    }, []);

    return (
        <AnimatePresence>
            {isLoading && <LoadingIcon />}
            {askForConfirmation && <ConfirmDeletionModal handleConfirmation = {(quizName) => handleQuizDelete(quizName)} quizName={selectedQuizName} handleExit = {(exitBool) => setAskForConfirmation(exitBool)}/>}
            {askForConfirmation && (
                <div className = 'transparntDarkBackgroundDiv' onClick={()=> setAskForConfirmation(false)} style = {{
                    width: '100%',
                    height: '100%',
                    alignItems: 'center',
                    zIndex: '12',
                    position: 'fixed',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    border: 'none',
                    borderRadius: '0%',
                }}/>
            )}
            <button className="returnBtn" onClick={() => navigate(HOME)}>
                Go Back
            </button>
            <div className="quizContainer">
                <div className="quizTitle" style ={{color: 'white'}}>DELETE A QUIZ </div>
                {quizzes && 
                quizzes.map((quiz) => (
                    <motion.div
                        key={quiz.quizName}
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        className="quizCard"
                    >
                    <div className="quizCardContent">
                        <div className="quizTitle">{quiz.quizName}</div>
                        <div className="deleteButton" onClick={() => {setAskForConfirmation(true); setSelectedQuizName(quiz.quizName)}}>
                            X
                        </div>
                    </div>
                    </motion.div>
                ))}
            </div>
        </AnimatePresence>
    );
};

export const ViewQuizPage = () => {
    const navigate = useNavigate();
    useEffect(() => {
        const userId = auth.currentUser?.uid || localStorage.getItem("userUid");
        if (!userId) navigate(LANDINGPAGE);
    }, []);

    useLocalStorageListener();

    return <BackDrop componentIN={<MainContent />} />;
};
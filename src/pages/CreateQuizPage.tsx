import { useNavigate } from "react-router-dom";
import { BackDrop } from "../components/decorations/BackDrop";
import { useLocalStorageListener } from "../lib/helpers/LocalStorageListener";
import { auth } from "../store/firebaseConfig";
import { useEffect, useState } from "react";
import { HOME, LANDINGPAGE } from "../lib/routes";
import { AnimatePresence, motion } from "framer-motion";
import { fadeAnimation } from "../lib/helpers/motion";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from 'react-hook-form';
import { quizSchema } from "../lib/formValidation/CreateQuizValidation";
import { LoadingIcon } from "../components/decorations/Loading/LoadingIcon";
import { FlashCardForm } from "../components/FlashCardForm";
import { useQuiz } from "../hooks/useQuiz";
import '../stylesheets/QuizCreationStyle.css';
import { useFlashcard } from "../hooks/useFlashcard";
import { lofiTwo } from "../assets/assetsConfig";


interface QuizFormData {
    quizName: string;
}; export type {QuizFormData};

const MainContent = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [flashCardCount, setFlashCardCount] = useState<number>(0);
    const [isMakingFlashCard, setIsMakingFlashCard] = useState<boolean>(false);
    const [hasMadeCards, settHasMadeCards] = useState<boolean>(false);
    const {createQuiz} = useQuiz();
    const { clearBuffer } = useFlashcard();

    const navigate = useNavigate();

    const {register, handleSubmit, formState: {errors}} = useForm<QuizFormData>({
        resolver: yupResolver(quizSchema)
    });

    const handleQuizCreation = async (quizFormData: QuizFormData) => {
        try {
            setIsLoading(true); 
            await createQuiz(quizFormData.quizName);
            // We will try to create the quiz later, I have a custom hook. Ignore this for now.
        } catch(error: unknown) {
            if(error instanceof Error) console.log(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleNavigation = async() => {
        try {
            if(hasMadeCards) {console.log('IM HERE'); await clearBuffer();}
            navigate(HOME);
        } catch(error: unknown) { 
            if(error instanceof Error) console.log(error.message);
        }
    };
    useEffect(() => {
        const audio = new Audio(lofiTwo);
        audio.loop = true;
        audio.play();
        return () => {
            audio.pause();
            audio.currentTime = 0;
        };
    }, []);

    const handleFlashCardRequest = () => { setIsMakingFlashCard(true); };
    
    return (
        <AnimatePresence>
            {isLoading && <LoadingIcon />}
            <motion.div {...fadeAnimation}>
                <button className="returnBtn" onClick={() => handleNavigation()}>Go Back</button>
                <div>
                    {isMakingFlashCard && (
                        <div className = 'transparntDarkBackgroundDiv' onClick={()=> setIsMakingFlashCard(false)} style = {{
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
                    {isMakingFlashCard && (<FlashCardForm hasMadeCard = {(cardWasMade) => settHasMadeCards(cardWasMade)} manageFlashCardCount = {(incrementBy) => setFlashCardCount(flashCardCount + incrementBy)} handleExit = {(exitBool) => setIsMakingFlashCard(exitBool)} handlePropLoad = {(loadingState) => setIsLoading(loadingState)}/>) /*Display FlashCard Form */}
                    <motion.div {...fadeAnimation}> 
                        <div className = 'quizCreationFormContainer'>
                            <form onSubmit={handleSubmit(handleQuizCreation)}>
                                <div className = 'flashCardCount'>{flashCardCount} FlashCards</div>
                                <input {...register('quizName')} className = 'quizformNameInput' type = 'text' placeholder = 'Quiz Name'  />
                                {errors.quizName && <p style = {{color: 'red'}}>{errors.quizName.message}</p>}
                                <button type = 'button' className = 'quizformNameInput' onClick = {() => handleFlashCardRequest()}> + Add FlashCard </button>   
                                <input className = 'quizformNameInput' type = 'submit' value = 'Create Quiz'/>
                            </form>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export const CreateQuizPage = () => {
    const navigate = useNavigate();
    useEffect(() => {
        const userId = auth.currentUser?.uid || localStorage.getItem("userUid");
        if(!userId) navigate(LANDINGPAGE)
    }, []);

    useLocalStorageListener();

    return <BackDrop componentIN = {<MainContent />}/>
};

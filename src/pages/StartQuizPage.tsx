import { useEffect, useState } from "react";
import { useLocalStorageListener } from "../lib/helpers/LocalStorageListener";
import { HOME, LANDINGPAGE } from "../lib/routes";
import { auth } from "../store/firebaseConfig";
import { FlashCardComponent, Flashcard } from "../components/FlashCard";
import { useNavigate } from "react-router-dom";
import { useFlashcard } from "../hooks/useFlashcard";
import { QuizBackDrop } from "../components/decorations/QuizBackDrop";
import { BackDrop } from "../components/decorations/BackDrop";
import { useToast } from "@chakra-ui/react";
import { useMultiStepForm } from "../hooks/useMultiStepForm";
import { AnimatePresence, motion } from "framer-motion";
import { fadeAnimation } from "../lib/helpers/motion";
import { lofiOne } from "../assets/assetsConfig";
import { LoadingIcon } from "../components/decorations/Loading/LoadingIcon";
import { useQuiz } from "../hooks/useQuiz";
import { ResultsModal } from "../components/ResultsModal";

interface Quiz {
  quizName: string;
  flashCards: Flashcard[];
}

interface Choice {
  question: string;
  choice: string;
}

type FormData = {
  choices: Choice[];
};
const INITIAL_DATA: FormData = {
  choices: [],
};

const MainContent = () => {
    const [data, setData] = useState(INITIAL_DATA);
    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [showResults, setShowResults] = useState<boolean>(false);
    const { finishQuiz } = useQuiz();

    const { currentStepIndex, isFirstStep, isLastStep, next, back } = useMultiStepForm(quiz?.flashCards || []);
    const isNextDisabled = !data.choices.some((choice) => choice.question === quiz?.flashCards[currentStepIndex].question);
    const toast = useToast();
    const navigate = useNavigate();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            setIsLoading(true);
            await finishQuiz(data);
            setShowResults(true);
        } catch (error: unknown) {
            if (error instanceof Error) console.log(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    function updateFields(fields: any) {
        const { choices } = data;
        const { question, choice } = fields;
        const existingChoiceIndex = choices.findIndex(
            (c) => c.question === question
        );
        if (existingChoiceIndex !== -1) {
            // If the question already exists in the data state, update the choice
            const updatedChoices = [...choices];
            updatedChoices[existingChoiceIndex] = { question, choice };
            setData((prevData) => ({ ...prevData, choices: updatedChoices }));
        } else {
            // If the question doesn't exist, add a new choice to the data state
            const newChoices = [...choices, { question, choice }];
            setData((prevData) => ({ ...prevData, choices: newChoices }));
        }
    };

    const handleNavigation = () => {
        localStorage.removeItem("selectedQuiz");
        navigate(HOME);
    };

    useEffect(() => {
        const selectedQuiz = localStorage.getItem("selectedQuiz");
        if (!selectedQuiz) {
            toast({
                title: "Quiz failed to Start!",
                status: "error",
                isClosable: true,
                position: "top",
                description: "Please select a quiz first.",
                duration: 3000,
            });
            navigate(HOME);
        } else {
            const parsedQuiz = JSON.parse(selectedQuiz) as Quiz;
            setQuiz(parsedQuiz);
        }
    }, []);
    
    useEffect(() => {
        const audio = new Audio(lofiOne);
        audio.loop = true;
        audio.play();
        return () => {
            audio.pause();
            audio.currentTime = 0;
        };
    }, []);

    return (
        <AnimatePresence>
            {isLoading && <LoadingIcon />}
            {showResults && <ResultsModal confirmFinish = {() => {navigate(HOME)}}/>}
            <button className="returnBtn" onClick={handleNavigation}>Go Back</button>
            <div className="componentINSTUDY">
                {quiz && quiz.flashCards.length > 0 && (
                    <div>
                        <form onSubmit={handleSubmit}>  
                            <p className="smallText">{`${currentStepIndex + 1}/${quiz.flashCards.length}`}</p>
                            <div className="flashCardContainer">
                                <motion.div {...fadeAnimation}>
                                    <FlashCardComponent
                                        choices={data.choices}
                                        updateFields={updateFields}
                                        flashCard={quiz.flashCards[currentStepIndex]}
                                        isNextDisabled={isNextDisabled}
                                    />
                                </motion.div>
                                
                            </div>
                            <div className="buttonContainer">
                                <button type="button" className="quizButtonNavigation" disabled={isFirstStep} onClick={back}> Back </button>
                                {isLastStep ? (
                                    <input
                                        type= {isNextDisabled? 'button' : 'submit'}
                                        value = {isNextDisabled? 'Finish' : 'Finish'}
                                        className="quizButtonNavigation"
                                        style={{ background: "#a8f6ee", color: "black" }}
                                        onClick={() => {
                                            if(isNextDisabled) {
                                                toast({
                                                    title: "Quiz Incomplete",
                                                    status: "error",
                                                    isClosable: true,
                                                    position: "top",
                                                    description: "Please select an answer before submitting.",
                                                    duration: 3000,
                                                });
                                            }
                                        }}
                                    />
                                ) : (
                                    <button type="button" className="quizButtonNavigation" onClick = {() => {
                                        if (isNextDisabled) {
                                            toast({
                                                title: "Cannot Proceed",
                                                status: "error",
                                                isClosable: true,
                                                position: "top",
                                                description: "Please select an answer before proceeding.",
                                                duration: 3000,
                                            });
                                        } else {
                                            next();
                                        }
                                    }}>Next</button>
                                )}
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </AnimatePresence>
    );
};

export const StartQuizPage = () => {
    const navigate = useNavigate();
    const { clearBuffer } = useFlashcard();
    const handleFireStoreSync = async () => {
        try {
            await clearBuffer();
        } catch (error: unknown) {
            if (error instanceof Error) console.log(error.message);
        }
    };
    useEffect(() => {
        const refresh = localStorage.getItem("hasMadeCard");
        if (refresh) handleFireStoreSync();
        const userId = auth.currentUser?.uid || localStorage.getItem("userUid");
        if (!userId) navigate(LANDINGPAGE);
    }, []);

    useLocalStorageListener();

    return <BackDrop componentIN={<QuizBackDrop componentIN={<MainContent />}/>} />
};
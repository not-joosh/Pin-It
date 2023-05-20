import { useEffect, useState } from 'react';
import { clientState } from '../store/storeConfig';
interface FlashCard {
    answer: string;
    question: string;
    options: string[];
    wasAnsweredCorrect?: boolean;
};

interface ResultsModalProps {
    confirmFinish: () => void;
};

export const ResultsModal = ({ confirmFinish }: ResultsModalProps) => {
    const [markedAnswers, setMarkedAnswers] = useState<FlashCard[]>([]);

    const handleConfirmation = () => {
        clientState.isValidLocalChange = true;
        localStorage.removeItem('markedAnswers');
        localStorage.removeItem('selectedQuiz');
        clientState.isValidLocalChange = false;
        confirmFinish();
    };

    useEffect(() => {
        const markedAnswersFromLocalStorage: FlashCard[] = JSON.parse(localStorage.getItem('markedAnswers') || '[]');
        setMarkedAnswers(markedAnswersFromLocalStorage);
    }, []);

    return (
        <>
            <div className="modalBackGround" style={{ zIndex: 19, backgroundColor: 'rgba(0, 0, 0, .8)', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer'}} onClick={() => handleConfirmation()}> 
                <div className="flashCardsScrollableContainer" style={{ zIndex: 20, backgroundColor: 'white', border: '1px solid', borderColor: 'rgba(0, 0, 0, 1)', borderRadius: '8px', padding: '16px', width: '500px', maxHeight: '80vh', overflowY: 'auto' }}>
                    <div style={{color: 'black', fontWeight: 'bold'}}>YOUR RESULTS...</div>   
                    {markedAnswers.map((flashCard, index) => {
                        const { question, answer, wasAnsweredCorrect } = flashCard;

                        return (
                        <div key={index} style={{ border: `2px solid ${wasAnsweredCorrect ? 'green' : 'red'}`, padding: '8px', marginBottom: '16px' }}>
                            <h3>
                                Question: 
                                {` "${question}"`}
                            </h3>
                            {!wasAnsweredCorrect && <p style = {{color: 'blue', fontWeight: 'bold'}}>
                                Correct Answer:
                                <span style={{color: 'blueviolet', fontWeight: 'lighter'}}>{` `}{answer}</span>
                            </p>}
                        </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
};
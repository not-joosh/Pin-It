import { ReactElement, useEffect, useState } from 'react';
import { shuffle } from '../lib/helpers/shuffler';

interface Choice {
    question: string;
    choice: string;
};

export interface Flashcard extends ReactElement {
    question: string;
    answer: string;
    options: string[];
};

interface FlashCardProps {
    flashCard: Flashcard;
    choices: Choice[];
    updateFields: (fields: Choice) => void;
    isNextDisabled: boolean;
};

export const FlashCardComponent = ({ updateFields, choices, flashCard, isNextDisabled }: FlashCardProps) => {
    const [options, setOptions] = useState<any[]>([]);
    const [chosenChoice, setChosenChoice] = useState<string>('');
  
    const handleUpdate = (chosenChoice: string) => {
        const question = flashCard.question;
        const updatedChoice: Choice = { question, choice: chosenChoice };
        updateFields(updatedChoice);
        setChosenChoice(chosenChoice);
    };
  
    useEffect(() => {
        let answer = flashCard.answer;
        setOptions(shuffle([...flashCard.options, answer]));
    }, [flashCard]);
  
    useEffect(() => {
        const existingChoice = choices.find(
            (choice) => choice.question === flashCard.question
        );
        if (existingChoice) {
            setChosenChoice(existingChoice.choice);
        } else {
            setChosenChoice('');
        }
    }, [flashCard.question, choices]);
  
    return (
        <>
            <div>
                <div>{flashCard.question}</div>
                {options.map((option, index) => (
                    <label key={index}>
                        <input
                            type="radio"
                            value={option}
                            onChange={() => {
                                handleUpdate(option);
                            }}
                            checked={option === chosenChoice}
                        />
                        {option}
                        <br />
                    </label>
                ))}
            </div>
        </>
    );
};
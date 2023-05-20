import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { schema } from '../lib/formValidation/FlashCardFormValidation';
import { useEffect } from 'react';
import { useFlashcard } from '../hooks/useFlashcard';

interface FlashCardFormProps {
    handlePropLoad: (loadingState: boolean) => void;
    handleExit: (exitBool: boolean) => void;
    manageFlashCardCount: (incrementBy: number) => void;
    hasMadeCard: (cardWasMade: boolean) => void;
};

interface FlashCardFormData {
    answer: string;
    question: string;
    option1: string;
    option2: string;
    option3: string;
};

export const FlashCardForm = ({handlePropLoad, handleExit, manageFlashCardCount, hasMadeCard}: FlashCardFormProps) => {
    const {createFlashCard} = useFlashcard();

    const {handleSubmit, register, formState: {errors}} = useForm<FlashCardFormData>({
        resolver: yupResolver(schema)
    });
    
    const handleCardCreation = async (flashCardData: FlashCardFormData) => {
        try {
            handlePropLoad(true);
            await createFlashCard(
                flashCardData.question, flashCardData.answer, 
                flashCardData.option1, flashCardData.option2,
                flashCardData.option3,
            );
            manageFlashCardCount(1);
            hasMadeCard(true);
        } catch(error: unknown) {
            if(error instanceof Error) console.log(error.message);
        } finally {
            handlePropLoad(false);
            handleExit(false);
        }
    };

    useEffect(() => {
        console.log(errors);
    })

    return (
        <div className = 'flashCardFormContainer' style = {{zIndex: '13'}}>
            <div className = 'optionCount'>New Flashcard!</div>
            <form onSubmit={handleSubmit(handleCardCreation)}> 
                <input className = 'flashCardAnswerInput' type = 'text' placeholder = 'Question' {...register('question')}/>
                {errors.question && <p style = {{color: 'red'}}>{errors.question?.message}</p>}
                
                <input className = 'flashCardAnswerInput' type = 'text' placeholder = 'Answer' {...register('answer')}/>
                {errors.answer && <p style = {{color: 'red'}}>{errors.answer?.message}</p>}
                
                <input className = 'flashCardAnswerInput' type = 'text' placeholder = 'Option 1 (Optional)' {...register('option1')}/>
                <input className = 'flashCardAnswerInput' type = 'text' placeholder = 'Option 2 (Optional)' {...register('option2')}/>
                <input className = 'flashCardAnswerInput' type = 'text' placeholder = 'Option 3 (Optional)' {...register('option3')}/>
                <input className = 'flashCardAnswerInput' type = 'submit' value = 'Create Flashcard'/>
            </form>
        </div>
    );
};
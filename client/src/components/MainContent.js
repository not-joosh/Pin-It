import {useEffect, useState} from 'react'
export const MainContent = () => {
    // Flash Card Design:
    // Add flash card
    // edit flash card
    // check picks new flashcard
    
    // Adding Flash Card
    const [flashCards, setFlashCards] = useState([])
    const [question, setQuestion] = useState("")
    const [answer, setAnswer] = useState("")
    const [text, setText] = useState("")
    const addFlashCard = (event) => {
        const flashCard = {
            question: question,
            answer: answer,
            id: flashCards.length === 0 ? 1 : flashCards[flashCards.length - 1].id + 1
        }
        setFlashCards((prevFlashCards) => [...prevFlashCards, flashCard])
    }
    return (
        <div>
            <input placeholder ="Question . . ." onChange={(event) => {
                setQuestion(event.target.value)
            }}></input>
            <input placeholder="Answer . . ." onChange={(event) => {
                setAnswer(event.target.value)
            }}></input>
            <button onClick = {addFlashCard}>SUBMIT</button>
            <div>
                {flashCards.map((flashCard) => {
                    return (
                        <div>
                            <div>{"Question: " + flashCard.question}</div>
                            <div>{"Answer: " + flashCard.answer}</div>
                            <div>{"QUESTION ID: " + flashCard.id}</div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
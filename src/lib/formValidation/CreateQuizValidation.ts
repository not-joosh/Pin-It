import * as yup from 'yup';
export const quizSchema = yup.object().shape({
    quizName: yup.string().required("Please provide the Quiz Name"),
});

export const flashCardSchema = yup.object().shape({
    answer: yup.string().required("Please provide the flashcard answer"),
    question: yup.string().required("Please provide the flashcard question"),
});
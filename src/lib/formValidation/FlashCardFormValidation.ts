import * as yup from 'yup';

export const schema = yup.object().shape({
    answer: yup.string().required('Please provide an Answer.'),
    question: yup.string().required('Please provide a Question.'),
});
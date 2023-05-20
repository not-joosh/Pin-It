import { proxy } from 'valtio';

export const clientState = proxy({
    isValidLocalChange: false,
    quizzes: null,
});
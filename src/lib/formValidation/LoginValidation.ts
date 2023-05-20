import * as yup from 'yup';
export const schema = yup.object().shape({
    usernameOrEmail: yup.string().required("Please enter a valid username or email"),
    password: yup.string().required("Password field is Required..."),
});
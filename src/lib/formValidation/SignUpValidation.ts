import * as yup from 'yup';

export const schema = yup.object().shape({
    fullName: yup.string().required("Full name field required..."),
    email: yup.string().email("Email just be a valid email...").required("Email field required..."),
    password: yup.string().min(6, "Password must contain at least 6 characters...").required("Password field required..."),
    confirmPassword: yup.string().oneOf([yup.ref("password")], "Passwords must match...")
        .required("Please confirm your password..."),
    username: yup.string().min(3, "Username must be at least 3 characters...").max(15, "Username can contain a maximum of 15 characters...").notOneOf([""], "Username field required...")
        .matches(
            /^[a-zA-Z0-9_.-]*$/,
            `Username can only 
            contain letters, numbers, 
            underscores, periods, and dashes...`
        ).required()
});
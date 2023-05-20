import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { schema } from "../../lib/formValidation/SignUpValidation";
import { useAuth } from "../../hooks/useAuth";
import { useEffect } from "react";
import { HOME } from "../../lib/routes";

interface SignUpFormData {
    username: string;
    email: string;
    confirmPassword: string;
    password: string;
    fullName: string;
};

interface SignUpFormProps {
    handleLoadProp: (loadState: boolean) => void;
}

export const SignUpForm = ({handleLoadProp}: SignUpFormProps) => {
    const {tryRegister} = useAuth();
    const {register, handleSubmit, formState: {errors}} = useForm<SignUpFormData>({
        resolver: yupResolver(schema),
    }); 
    const handleRegister = async(dataIn: SignUpFormData) => {
        try {
            handleLoadProp(true);
            await tryRegister(dataIn.email, dataIn.username, dataIn.password, dataIn.fullName, HOME);
        } catch(error: unknown) {
            if(error instanceof Error) console.log(error.message);
        } finally {
            handleLoadProp(false);
        }
    };

    useEffect(() => {
        console.log(errors);
    })

    return (
        <>
            <form onSubmit={handleSubmit(handleRegister)}>
                <input type = 'text' placeholder = 'Full Name' {...register('fullName')}/>
                {errors.fullName && <p style={{ color: 'red' }}>{errors.fullName.message}</p>}

                <input type = 'text' placeholder = 'Username' {...register('username')}/>
                {errors.username && <p style={{ color: 'red' }}>{errors.username.message}</p>}

                <input type = 'text' placeholder = 'Email' {...register('email')}/>
                {errors.email && <p style={{ color: 'red' }}>{errors.email.message}</p>}

                <input type = 'password' placeholder = 'Password' {...register('password')}/>
                {errors.password && <p style={{ color: 'red' }}>{errors.password.message}</p>}

                <input type = 'password' placeholder = 'Confirm Password' {...register('confirmPassword')}/>
                {errors.confirmPassword && <p style={{ color: 'red' }}>{errors.confirmPassword.message}</p>}

                <input type = 'submit' value = 'Register Account'/>
            </form>
        </>
    );
};
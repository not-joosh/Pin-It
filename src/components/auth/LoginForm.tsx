import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import { SignUpForm } from './SignUpForm';
import { schema } from '../../lib/formValidation/LoginValidation';
import { useAuth } from '../../hooks/useAuth';
import { HOME } from '../../lib/routes';
import './AuthStyles.css';

interface LoginFormData {
    usernameOrEmail: string;
    password: string;
};

interface LoginFormProps {
    handleLoadProp: (loadState: boolean) => void;
    handleExit: () => void;
};

export const LoginForm = ({ handleLoadProp, handleExit }: LoginFormProps) => {
    const [registerRequest, setRegisterRequest] = useState<boolean>(false);
    const { tryLogin } = useAuth();

    const {register, handleSubmit, formState: {errors}} = useForm<LoginFormData>({
        resolver: yupResolver(schema)
    });

    const handleLogin = async (LoginData: LoginFormData) => {
        try { // Login the user
            handleLoadProp(true);
            await tryLogin(LoginData.usernameOrEmail, LoginData.password, HOME);
        } catch(error: unknown) {
            if(error instanceof Error) console.log(error.message);
        } finally {
            handleLoadProp(false);
        }
    };

    return (
        <>
            <div className="loginFormContainer">
                {!registerRequest && (
                    <>
                        <form onSubmit={handleSubmit(handleLogin)}>
                            <input type="text" placeholder="Email or Username" {...register('usernameOrEmail')} />
                            {errors.usernameOrEmail && <p style={{ color: 'red' }}>{errors.usernameOrEmail.message}</p>}

                            <input type="password" placeholder="Password" {...register('password')} />
                            {errors.password && <p style={{ color: 'red' }}>{errors.password.message}</p>}

                            <input type="submit" value="Login" className="submitButton" />
                        </form>
                        <button onClick={() => setRegisterRequest(true)}>Don't have an account? Create an Account.</button>
                    </>
                )}
                {registerRequest && <SignUpForm handleLoadProp = {handleLoadProp}/>}
            </div>
            <div className = 'transparntDarkBackgroundDiv' onClick={handleExit} style = {{
                width: '100%',
                height: '100%',
                alignItems: 'center',
                zIndex: '10',
                position: 'fixed',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                border: 'none',
                borderRadius: '0%',
            }}/>
        </>
    );
};
import { useEffect, useState } from 'react';
import { BackDrop } from '../components/decorations/BackDrop';
import { auth } from '../store/firebaseConfig';
import { useNavigate } from 'react-router';
import { HOME } from '../lib/routes';
import { LoginForm } from '../components/auth/LoginForm';
import { LoadingIcon } from '../components/decorations/Loading/LoadingIcon';
import { useLocalStorageListener } from '../lib/helpers/LocalStorageListener';
import { AnimatePresence, motion } from 'framer-motion';
import { slideAnimation } from '../lib/helpers/motion';

const MainContent = () => {
    const [LoginRequest, setLoginRequest] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const navigate = useNavigate();
    const handleClick = () => {
        if(auth.currentUser?.email) navigate(HOME);
        else setLoginRequest(true);
    };
    return (
        <>
            <AnimatePresence>
                {isLoading && <LoadingIcon />}
                {LoginRequest && 
                    <>
                        <div style = {{zIndex: '11'}}>
                            <LoginForm 
                                handleLoadProp = {(loadState) => setIsLoading(loadState)}
                                handleExit = {() => setLoginRequest(false)}
                            />
                        </div>
                    </>
                }
                <div className='mainContent'>
                    <motion.div {...slideAnimation('down')}>
                        <h1 className='mainContentTitle'>Pin It</h1>
                    </motion.div>
                    <motion.div {...slideAnimation('up')}>
                        <button className='mainContentButton' onClick={() => handleClick()}>GET STARTED</button>
                    </motion.div>
                </div>
            </AnimatePresence>
        </>
    );
};

export const LandingPage = () => {
    const navigate = useNavigate();
    useEffect(() => {
        const userId = auth.currentUser?.uid || localStorage.getItem("userUid");
        if(userId) navigate(HOME)
    }, []);

    useLocalStorageListener();

    return <BackDrop componentIN = {<MainContent />}/>
};
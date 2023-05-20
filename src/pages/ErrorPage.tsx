import { useLocalStorageListener } from '../lib/helpers/LocalStorageListener';
import { errorBG } from '../assets/assetsConfig';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from "framer-motion";
import { fadeAnimation } from '../lib/helpers/motion';
import { LANDINGPAGE } from '../lib/routes';
import { useEffect } from 'react';

export const ErrorPage = () => {
    const navigate = useNavigate();
    
    useEffect(() => {
        navigate(LANDINGPAGE);
    });

    useLocalStorageListener();

    return (
        <AnimatePresence>
            <motion.div {...fadeAnimation}>
                <div className = "error-page">
                    <img 
                        className = "error-img w-full h-full m-0 overflow-hidden box-border fixed pointer-events-none" 
                        src= {errorBG}
                    />
                    <button 
                        className = "error-redirect-btn fixed overflow-hidden cursor-pointer opacity-0" 
                        onClick = {() => navigate(LANDINGPAGE)} 
                        style = {{
                            zIndex: "5",
                            height: "10000px",
                            width: "10000px",
                        }}>    
                    </button>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};
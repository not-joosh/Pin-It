import { Parallax, ParallaxLayer } from "@react-spring/parallax";
import { quizSessionMOON, quizSessionMOUNTAINS1, quizSessionMOUNTAINS2, quizSessionROAD, quizSessionBG } from "../../assets/assetsConfig";
import "./QuizBackDropStyle.css";
import { useEffect, useRef, useState } from "react";

interface QuizBackDropProps {
    componentIN: JSX.Element;
};

export const QuizBackDrop = ({componentIN}: QuizBackDropProps) => {
    const parallaxContainerRef = useRef<HTMLDivElement>(null);
    const [mouseX, setMouseX] = useState(0);
    const [mouseY, setMouseY] = useState(0);
    const mouseXRef = useRef(0);
    const mouseYRef = useRef(0);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMouseX(e.clientX);
            setMouseY(e.clientY);
        };
        document.addEventListener("mousemove", handleMouseMove);
        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);

    useEffect(() => {
        const backDropElement = parallaxContainerRef.current;
        if (!backDropElement) return;
    }, []);

    useEffect(() => {
        const backDropElement = parallaxContainerRef.current;
        if (!backDropElement) return;

        const animateGlow = () => {
            const mouseX = mouseXRef.current;
            const mouseY = mouseYRef.current;
            backDropElement.style.setProperty('--mouse-x', mouseX + 'px');
            backDropElement.style.setProperty('--mouse-y', mouseY + 'px');
            requestAnimationFrame(animateGlow);
        };
        requestAnimationFrame(animateGlow);
    }, []);

    return (
        <div className="backDrop" ref={parallaxContainerRef}>
        <div className="backDropContainer">
            <Parallax
                className="parallax-container"
                pages={1}
                style={{
                    width: '100vw',
                    height: '100vh',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    overflow: 'hidden',
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    objectFit: 'fill'
                }}
            >
            <ParallaxLayer offset={0} speed={0} style={{ zIndex: 0 }}>
                <div className="layer background-layer">
                    <img src={quizSessionBG} alt="Background" />
                </div>
            </ParallaxLayer>
            <ParallaxLayer offset={0} speed={0.1} style={{ zIndex: 1 }}>
                <div className = "layer moon-layer">
                    <img className = 'moon' src ={quizSessionMOON} alt="Moon" style={{ transform: `translate(${mouseX * 0.01}px, ${mouseY * 0.01}px)` }} />
                </div>
            </ParallaxLayer>
            <ParallaxLayer offset={0} speed={-0.2} style={{ zIndex: 2 }}>
                <div className="layer mountains2-layer">
                    <img src={quizSessionMOUNTAINS2} alt="Mountains 2" />
                </div>
            </ParallaxLayer>
            <ParallaxLayer offset={0} speed={-0.3} style={{ zIndex: 3 }}>
                <div className="layer mountains1-layer">
                    <img src={quizSessionMOUNTAINS1} alt="Mountains 1" />
                </div>
            </ParallaxLayer>
            <ParallaxLayer offset={0} speed={-0.4} style={{ zIndex: 4 }}>
                <div className="layer road-layer">
                    <img src={quizSessionROAD} alt="Road" />
                </div>
            </ParallaxLayer>
            <ParallaxLayer offset={0} speed={-0.1} style={{ zIndex: 5 }}>
                <div className="layer glow-layer" style={{ transform: `translate(${mouseX}px, ${mouseY}px)` }} />
                <div className = 'componentINSERTION'>
                    {componentIN}
                </div>
            </ParallaxLayer>
            </Parallax>
            </div>
        </div>
    );
};

































// import { Parallax, ParallaxLayer } from "@react-spring/parallax";
// import { quizSessionMOON, quizSessionMOUNTAINS1, quizSessionMOUNTAINS2, quizSessionROAD, quizSessionBG } from "../../assets/assetsConfig";
// import "./QuizBackDropStyle.css";
// import { useEffect, useRef, useState } from "react";

// interface QuizBackDropProps {
//     componentIN: JSX.Element;
// };

// export const QuizBackDrop = ({componentIN}: QuizBackDropProps) => {
//     const parallaxContainerRef = useRef<HTMLDivElement>(null);
//     const [mouseX, setMouseX] = useState(0);
//     const [mouseY, setMouseY] = useState(0);
//     const mouseXRef = useRef(0);
//     const mouseYRef = useRef(0);

//     useEffect(() => {
//         const handleMouseMove = (e: MouseEvent) => {
//             setMouseX(e.clientX);
//             setMouseY(e.clientY);
//         };
//         document.addEventListener("mousemove", handleMouseMove);
//         return () => {
//             document.removeEventListener("mousemove", handleMouseMove);
//         };
//     }, []);

//     useEffect(() => {
//         const backDropElement = parallaxContainerRef.current;
//         if (!backDropElement) return;
//         const spans = backDropElement.querySelectorAll('.backDropBubbles span') as NodeListOf<HTMLSpanElement>;
//         const values = new Set<number>();
//         while (values.size < spans.length) {
//             const randomValue = Math.floor(Math.random() * 100) + 1; 
//             values.add(randomValue);
//         }
//         spans.forEach((span, index) => {
//             span.style.setProperty('--i', Array.from(values)[index].toString());
//         });
//     }, []);

//     useEffect(() => {
//         const backDropElement = parallaxContainerRef.current;
//         if (!backDropElement) return;

//         const animateGlow = () => {
//         const mouseX = mouseXRef.current;
//         const mouseY = mouseYRef.current;
//         backDropElement.style.setProperty('--mouse-x', mouseX + 'px');
//         backDropElement.style.setProperty('--mouse-y', mouseY + 'px');
//         requestAnimationFrame(animateGlow);
//         };

//         requestAnimationFrame(animateGlow);
//     }, []);

//     return (
//         <div className="backDrop" ref={parallaxContainerRef}>
//         <div className="backDropContainer">
//             <Parallax
//                 className="parallax-container"
//                 pages={1}
//                 style={{
//                     width: '100vw',
//                     height: '100vh',
//                     display: 'flex',
//                     justifyContent: 'center',
//                     alignItems: 'center',
//                     overflow: 'hidden',
//                     position: 'fixed',
//                     top: 0,
//                     left: 0,
//                 }}
//             >
//             <ParallaxLayer offset={0} speed={0} style={{ zIndex: 0 }}>
//                 <div className="layer background-layer">
//                     <img src={quizSessionBG} alt="Background" />
//                 </div>
//             </ParallaxLayer>
//             <ParallaxLayer offset={0} speed={0.1} style={{ zIndex: 1 }}>
//                 <div className = "layer moon-layer">
//                     <img className = 'moon' src ={quizSessionMOON} alt="Moon" style={{ transform: `translate(${mouseX * 0.01}px, ${mouseY * 0.01}px)` }} />
//                 </div>
//             </ParallaxLayer>
//             <ParallaxLayer offset={0} speed={-0.2} style={{ zIndex: 2 }}>
//                 <div className="layer mountains2-layer">
//                     <img src={quizSessionMOUNTAINS2} alt="Mountains 2" />
//                 </div>
//             </ParallaxLayer>
//             <ParallaxLayer offset={0} speed={-0.3} style={{ zIndex: 3 }}>
//                 <div className="layer mountains1-layer">
//                     <img src={quizSessionMOUNTAINS1} alt="Mountains 1" />
//                 </div>
//             </ParallaxLayer>
//             <ParallaxLayer offset={0} speed={-0.4} style={{ zIndex: 4 }}>
//                 <div className="layer road-layer">
//                     <img src={quizSessionROAD} alt="Road" />
//                 </div>
//             </ParallaxLayer>
//             <ParallaxLayer offset={0} speed={-0.1} style={{ zIndex: 5 }}>
//                 <div className="layer glow-layer" style={{ transform: `translate(${mouseX}px, ${mouseY}px)` }} />
//                 <div className = 'componentINSERTION'>
//                     {componentIN}
//                 </div>
//             </ParallaxLayer>
//             </Parallax>
//             </div>
//         </div>
//     );
// };



// import { quizSessionMOON, quizSessionMOUNTAINS1, quizSessionMOUNTAINS2, quizSessionROAD } from '../../assets/assetsConfig';
// import './QuizBackDropStyle.css';
// export const QuizBackDrop = ({componentIN}: QuizBackDropProps) => {
//     return (
//         <div>
//             <section>
//                 <div className = 'qBDContainer'>
//                     <div id = 'scene'>
//                         <div className = 'layer'><img src = {quizSessionMOON}/></div>
//                         <div className = 'layer'><img src = {quizSessionMOUNTAINS2}/></div>
//                         <div className = 'layer'><img src = {quizSessionMOUNTAINS1}/></div>
//                         <div className = 'layer'><img src = {quizSessionROAD}/></div>
//                     </div>
//                 </div>
//             </section>
//             <div>
//                 {componentIN}
//             </div>
//         </div>
//     );
// };
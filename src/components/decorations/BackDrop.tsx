import './BackDropStyle.css';
import { useEffect, useRef } from 'react';
interface BackDropProps {
  componentIN: JSX.Element;
}
export const BackDrop = ({componentIN}: BackDropProps) => {
  const backDropRef = useRef<HTMLDivElement>(null);
  const mouseXRef = useRef(0);
  const mouseYRef = useRef(0);
  
  useEffect(() => {
    const backDropElement = backDropRef.current;
    if (!backDropElement) return;
    const handleMouseMove = (event: MouseEvent) => {
      mouseXRef.current = event.clientX;
      mouseYRef.current = event.clientY;
    };
    const handleMouseLeave = () => {
      mouseXRef.current = 0;
      mouseYRef.current = 0;
    };
    backDropElement.addEventListener('mousemove', handleMouseMove);
    backDropElement.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      backDropElement.removeEventListener('mousemove', handleMouseMove);
      backDropElement.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  useEffect(() => {
    const spans = document.querySelectorAll('.backDropBubbles span') as NodeListOf<HTMLSpanElement>;
    const values = new Set<number>();
    while (values.size < spans.length) {
      const randomValue = Math.floor(Math.random() * 100) + 1; 
      values.add(randomValue);
    }
    spans.forEach((span, index) => {
      span.style.setProperty('--i', Array.from(values)[index].toString());
    });
  }, []);

  useEffect(() => {
    const animateGlow = () => {
      const backDropElement = backDropRef.current;
      if (!backDropElement) return;
      const mouseX = mouseXRef.current;
      const mouseY = mouseYRef.current;
      backDropElement.style.setProperty('--mouse-x', mouseX + 'px');
      backDropElement.style.setProperty('--mouse-y', mouseY + 'px');
      requestAnimationFrame(animateGlow);
    };

    requestAnimationFrame(animateGlow);
  }, []);

  return (
    <div className='backDrop' ref={backDropRef}>
      <div className='backDropContainer'>
        {componentIN}
        <div className='backDropBubbles'>
          {[...Array(50)].map((_, index) => (
            <span key={index}></span>
          ))}
        </div>
      </div>
    </div>
  );
};

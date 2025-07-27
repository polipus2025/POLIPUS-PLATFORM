import { useEffect, useRef } from 'react';

interface MatrixBackgroundProps {
  children: React.ReactNode;
}

export default function MatrixBackground({ children }: MatrixBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Matrix characters (numbers 0-9 and some binary-like symbols)
    const chars = '0123456789010101001100110101010011001101010100110011010101001100110101';
    const charArray = chars.split('');

    const fontSize = 16;
    const columns = Math.floor(canvas.width / fontSize);
    
    // Array to track the y position of each column
    const drops: number[] = [];
    
    // Initialize drops array
    for (let x = 0; x < columns; x++) {
      drops[x] = Math.random() * canvas.height;
    }

    // Start animation immediately
    draw();

    const draw = () => {
      // Create trailing effect by drawing a semi-transparent black rectangle
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Set text properties - make characters more visible
      ctx.fillStyle = '#00ff41'; // Bright Matrix green
      ctx.font = `bold ${fontSize}px 'Courier New', monospace`;
      ctx.shadowColor = '#00ff41';
      ctx.shadowBlur = 2;

      // Draw characters
      for (let i = 0; i < drops.length; i++) {
        // Random character from the array
        const text = charArray[Math.floor(Math.random() * charArray.length)];
        
        // Draw the character
        ctx.fillText(text, i * fontSize, drops[i]);

        // Move the drop down
        if (drops[i] > canvas.height && Math.random() > 0.98) {
          drops[i] = 0;
        }
        drops[i] += fontSize;
      }
    };

    // Animation loop
    const interval = setInterval(draw, 80);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Matrix effect canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-0 pointer-events-none"
        style={{ background: '#000000' }}
      />
      
      {/* Content overlay */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
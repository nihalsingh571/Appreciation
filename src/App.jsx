import { useState, useEffect, useRef } from 'react'
import './App.css'

function App() {
  const [showGreeting, setShowGreeting] = useState(false)
  const [showChaseMessage, setShowChaseMessage] = useState(false)
  const [hoverTime, setHoverTime] = useState(0)
  const [theme, setTheme] = useState('light')
  const [confessionMessage, setConfessionMessage] = useState('')
  const [showConfessionModal, setShowConfessionModal] = useState(false)
  const [showHearts, setShowHearts] = useState(false)
  const [mascotState, setMascotState] = useState('neutral')
  const [confessionHistory, setConfessionHistory] = useState([])
  
  const noButtonRef = useRef(null)
  const hoverTimerRef = useRef(null)
  const chaseTimerRef = useRef(null)
  const typewriterRef = useRef(null)

  const themes = {
    light: 'bg-light-pink',
    dark: 'bg-gray-900',
    love: 'bg-gradient-to-r from-pink-500 to-red-500'
  }

  const handleYesClick = () => {
    setShowHearts(true)
    setMascotState('happy')
    setShowConfessionModal(true)
    // Auto-hide hearts after 3 seconds
    setTimeout(() => setShowHearts(false), 3000)
  }

  const handleNoHover = () => {
    if (!noButtonRef.current) return;
  
    const button = noButtonRef.current;
    const container = button.parentElement;
    const containerRect = container.getBoundingClientRect();
  
    const maxLeft = container.offsetWidth - button.offsetWidth;
    const maxTop = container.offsetHeight - button.offsetHeight;
  
    const difficulty = Math.min(hoverTime * 0.2, 1);
  
    let newX = Math.random() * maxLeft;
    let newY = Math.random() * maxTop;
  
    if (difficulty > 0.5) {
      newX = Math.random() > 0.5 ? 0 : maxLeft;
      newY = Math.random() > 0.5 ? 0 : maxTop;
    }
  
    button.style.position = 'absolute';
    button.style.left = `${newX}px`;
    button.style.top = `${newY}px`;
    button.style.zIndex = 10;
  
    if (!hoverTimerRef.current) {
      hoverTimerRef.current = setInterval(() => {
        setHoverTime(prev => {
          if (prev >= 10) {
            setShowChaseMessage(true);
            setMascotState('laughing');
            clearInterval(hoverTimerRef.current);
            hoverTimerRef.current = null;
            chaseTimerRef.current = setTimeout(() => {
              setShowChaseMessage(false);
              setMascotState('neutral');
            }, 3000);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
  };
  

  const handleConfessionSubmit = () => {
    const newConfession = {
      date: new Date().toLocaleDateString(),
      message: confessionMessage
    }
    setConfessionHistory(prev => [...prev, newConfession])
    setShowConfessionModal(false)
    setShowGreeting(true)
    setConfessionMessage('')
  }

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme)
  }

  const handleNoLeave = () => {
    if (hoverTimerRef.current) {
      clearInterval(hoverTimerRef.current)
      hoverTimerRef.current = null
    }
    setHoverTime(0)
  }

  useEffect(() => {
    return () => {
      if (hoverTimerRef.current) clearInterval(hoverTimerRef.current)
      if (chaseTimerRef.current) clearTimeout(chaseTimerRef.current)
    }
  }, [])

  return (
    <div className={`min-h-screen ${themes[theme]} flex items-center justify-center relative overflow-hidden transition-colors duration-500`}>
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4 flex gap-2">
        <button onClick={() => handleThemeChange('light')} className="theme-btn light">☀️</button>
        <button onClick={() => handleThemeChange('dark')} className="theme-btn dark">🌙</button>
        <button onClick={() => handleThemeChange('love')} className="theme-btn love">❤️</button>
      </div>

      <div className="neon-box animate-fade-in">
        <h1 className="text-4xl font-bold text-center mb-8 text-pink-600 typewriter">
          Do you like me?
        </h1>
        
        {/* Mascot */}
        <div className={`mascot ${mascotState}`}>
          {mascotState === 'happy' && '😊'}
          {mascotState === 'laughing' && '😄'}
          {mascotState === 'neutral' && '😊'}
        </div>

        <div className="button-container relative w-[300px] h-[120px] mx-auto">
          <button
            onClick={handleYesClick}
            className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105"
          >
            Yes
          </button>
          <button
            ref={noButtonRef}
            onMouseEnter={handleNoHover}
            onMouseLeave={handleNoLeave}
            className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105 absolute"
            style={{ zIndex: 10 }}
          >
            No
          </button>

        </div>
      </div>

      {/* Confession Modal */}
      {showConfessionModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl text-center animate-fade-in max-w-md w-full">
            <h2 className="text-3xl font-bold text-pink-600 mb-4">Share your feelings! 💖</h2>
            <textarea
              value={confessionMessage}
              onChange={(e) => setConfessionMessage(e.target.value)}
              className="w-full p-4 border-2 border-pink-200 rounded-lg mb-4 focus:border-pink-500 focus:outline-none"
              placeholder="Write your message here..."
              rows="4"
            />
            <button
              onClick={handleConfessionSubmit}
              className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-full transition-all duration-300"
            >
              Send Love 💝
            </button>
          </div>
        </div>
      )}

      {/* Greeting Modal */}
      {showGreeting && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl text-center animate-fade-in">
            <h2 className="text-3xl font-bold text-pink-600 mb-4">Thank you! 💖</h2>
            <p className="text-gray-600">You made my day! 🌸</p>
            {confessionMessage && (
              <p className="mt-4 text-pink-500 italic">"{confessionMessage}"</p>
            )}
          </div>
        </div>
      )}

      {/* Chase Message */}
      {showChaseMessage && (
        <div className="chase-message animate-slide-down">
          {hoverTime > 5 ? "Too slow! 😜" : "Try harder! 😏"}
        </div>
      )}

      {/* Heart Explosion */}
      {showHearts && (
        <div className="heart-explosion">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="heart-particle" style={{
              '--delay': `${i * 0.1}s`,
              '--x': `${Math.random() * 100}%`,
              '--y': `${Math.random() * 100}%`
            }}>❤️</div>
          ))}
        </div>
      )}

      {/* Confession History */}
      {confessionHistory.length > 0 && (
        <div className="confession-history">
          <h3 className="text-xl font-bold mb-4">Love Notes 💌</h3>
          {confessionHistory.map((confession, index) => (
            <div key={index} className="confession-card">
              <p className="date">{confession.date}</p>
              <p className="message">{confession.message}</p>
            </div>
          ))}
        </div>
      )}

      {/* Floating Elements */}
      <div className="floating-emoji" style={{ top: '10%', left: '10%' }}>🌸</div>
      <div className="floating-emoji" style={{ top: '20%', right: '15%' }}>💖</div>
      <div className="floating-emoji" style={{ bottom: '15%', left: '20%' }}>✨</div>
      <div className="floating-emoji" style={{ bottom: '25%', right: '10%' }}>🌟</div>
    </div>
  )
}

export default App
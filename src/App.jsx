import { useState, useEffect, useRef } from 'react'
import './App.css'

function App() {
  const [showGreeting, setShowGreeting] = useState(false)
  const [showChaseMessage, setShowChaseMessage] = useState(false)
  const [hoverTime, setHoverTime] = useState(0)
  const noButtonRef = useRef(null)
  const hoverTimerRef = useRef(null)
  const chaseTimerRef = useRef(null)

  const handleYesClick = () => {
    setShowGreeting(true)
  }

  const handleNoHover = (e) => {
    if (!noButtonRef.current) return

    const button = noButtonRef.current
    const buttonRect = button.getBoundingClientRect()
    const windowWidth = window.innerWidth
    const windowHeight = window.innerHeight

    // Calculate new position within window bounds
    let newX = Math.random() * (windowWidth - buttonRect.width)
    let newY = Math.random() * (windowHeight - buttonRect.height)

    // Ensure button stays within window bounds
    newX = Math.max(0, Math.min(newX, windowWidth - buttonRect.width))
    newY = Math.max(0, Math.min(newY, windowHeight - buttonRect.height))

    button.style.position = 'fixed'
    button.style.left = `${newX}px`
    button.style.top = `${newY}px`

    // Start hover timer
    if (!hoverTimerRef.current) {
      hoverTimerRef.current = setInterval(() => {
        setHoverTime(prev => {
          if (prev >= 10) {
            setShowChaseMessage(true)
            clearInterval(hoverTimerRef.current)
            // Auto hide after 3 seconds
            chaseTimerRef.current = setTimeout(() => {
              setShowChaseMessage(false)
            }, 3000)
            return 0
          }
          return prev + 1
        })
      }, 1000)
    }
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
      if (hoverTimerRef.current) {
        clearInterval(hoverTimerRef.current)
      }
      if (chaseTimerRef.current) {
        clearTimeout(chaseTimerRef.current)
      }
    }
  }, [])

  return (
    <div className="min-h-screen bg-light-pink flex items-center justify-center relative overflow-hidden">
      <div className="neon-box animate-fade-in">
        <h1 className="text-4xl font-bold text-center mb-8 text-pink-600">
          Do you like me?
        </h1>
        <div className="button-container relative">
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
            className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105"
          >
            No
          </button>
        </div>
      </div>

      {showGreeting && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl text-center animate-fade-in">
            <h2 className="text-3xl font-bold text-pink-600 mb-4">Thank you! 💖</h2>
            <p className="text-gray-600">You made my day! 🌸</p>
          </div>
        </div>
      )}

      {showChaseMessage && (
        <div className="chase-message animate-slide-down">
          Why are you running away? 😢
        </div>
      )}

      {/* Floating emojis */}
      <div className="floating-emoji" style={{ top: '10%', left: '10%' }}>🌸</div>
      <div className="floating-emoji" style={{ top: '20%', right: '15%' }}>💖</div>
      <div className="floating-emoji" style={{ bottom: '15%', left: '20%' }}>✨</div>
      <div className="floating-emoji" style={{ bottom: '25%', right: '10%' }}>🌟</div>
    </div>
  )
}

export default App
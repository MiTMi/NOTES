import { useState, useEffect } from 'react'
import { Clock } from 'lucide-react'

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date()
      
      // Get next midnight (tomorrow at 12:00 AM)
      const tomorrow = new Date(now)
      tomorrow.setDate(tomorrow.getDate() + 1)
      tomorrow.setHours(0, 0, 0, 0)
      
      // Calculate time remaining until midnight
      const timeUntilMidnight = tomorrow.getTime() - now.getTime()
      
      // 5 hours in milliseconds
      const fiveHoursMs = 5 * 60 * 60 * 1000
      
      // Find how much time is left in the current 5-hour cycle
      const timeInCurrentCycle = timeUntilMidnight % fiveHoursMs
      
      // If we're at exactly a cycle boundary, start a new 5-hour cycle
      const timeRemaining = timeInCurrentCycle === 0 ? fiveHoursMs : timeInCurrentCycle
      
      if (timeRemaining <= 0) {
        return { hours: 5, minutes: 0, seconds: 0 }
      }
      
      const hours = Math.floor(timeRemaining / (1000 * 60 * 60))
      const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000)
      
      return { hours, minutes, seconds }
    }

    // Update immediately
    setTimeLeft(calculateTimeLeft())

    // Update every second
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (time: number) => time.toString().padStart(2, '0')

  return (
    <div className="flex items-center justify-center space-x-3 bg-gradient-to-r from-coral-500/10 via-accent-blue/10 to-accent-purple/10 border border-coral-500/20 rounded-xl px-6 py-4 backdrop-blur-sm">
      <Clock className="w-5 h-5 text-coral-500" />
      <div className="text-center">
        <div className="text-xs text-gray-600 dark:text-gray-400 mb-1 font-medium">
          Next Reset In
        </div>
        <div className="font-mono text-xl font-bold text-gray-900 dark:text-white">
          {formatTime(timeLeft.hours)}:
          {formatTime(timeLeft.minutes)}:
          {formatTime(timeLeft.seconds)}
        </div>
      </div>
    </div>
  )
}

export default CountdownTimer
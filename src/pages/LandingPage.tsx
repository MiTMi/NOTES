import { Link } from 'react-router-dom'
import { PenTool, Sparkles, Shield, Zap, ArrowRight, Check } from 'lucide-react'
import ThemeToggle from '../components/ThemeToggle'

const LandingPage = () => {
  const features = [
    {
      icon: <PenTool className="w-6 h-6" />,
      title: 'Rich Text Editor',
      description: 'Create beautiful notes with our powerful real-time editor'
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Secure & Private',
      description: 'Your notes are safely stored and accessible only by you'
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Lightning Fast',
      description: 'Experience instant loading and real-time synchronization'
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: 'Beautiful Design',
      description: 'Clean, modern interface with dark mode support'
    }
  ]

  const pricingPlans = [
    {
      name: 'Free',
      price: '$0',
      features: ['Up to 50 notes', 'Basic formatting', 'Web access', 'Dark mode'],
      highlighted: false
    },
    {
      name: 'Pro',
      price: '$9',
      features: ['Unlimited notes', 'Advanced formatting', 'Priority support', 'Export options', 'Collaboration'],
      highlighted: true
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-dark-bg dark:to-gray-900">
      {/* Navigation */}
      <nav className="flex justify-between items-center px-6 lg:px-12 py-6">
        <div className="flex items-center space-x-2">
          <PenTool className="w-8 h-8 text-primary-600" />
          <span className="text-2xl font-bold text-gray-900 dark:text-white">NoteFlow</span>
        </div>
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <Link to="/signin" className="btn-secondary">
            Sign In
          </Link>
          <Link to="/signup" className="btn-primary hidden sm:inline-block">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-6 lg:px-12 py-20 text-center max-w-6xl mx-auto">
        <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 animate-fade-in">
          Your thoughts,{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-primary-700">
            beautifully organized
          </span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-3xl mx-auto animate-slide-up">
          Experience the perfect note-taking app with a clean design, powerful features, and seamless synchronization across all your devices.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-scale-in">
          <Link to="/signup" className="btn-primary text-lg px-8 py-3 flex items-center justify-center">
            Start Writing Free
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
          <a href="#features" className="btn-secondary text-lg px-8 py-3">
            Learn More
          </a>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-6 lg:px-12 py-20 max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-16">
          Everything you need to capture ideas
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="card hover:transform hover:-translate-y-2"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/20 rounded-lg flex items-center justify-center text-primary-600 dark:text-primary-400 mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2 dark:text-white">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section className="px-6 lg:px-12 py-20 max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-16">
          Simple, transparent pricing
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          {pricingPlans.map((plan, index) => (
            <div
              key={index}
              className={`card ${
                plan.highlighted
                  ? 'border-2 border-primary-500 transform scale-105'
                  : 'border border-gray-200 dark:border-gray-700'
              }`}
            >
              {plan.highlighted && (
                <div className="bg-primary-500 text-white text-sm font-semibold px-3 py-1 rounded-full inline-block mb-4">
                  Most Popular
                </div>
              )}
              <h3 className="text-2xl font-bold mb-2 dark:text-white">{plan.name}</h3>
              <div className="text-4xl font-bold mb-6 dark:text-white">
                {plan.price}
                <span className="text-lg font-normal text-gray-600 dark:text-gray-400">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center text-gray-700 dark:text-gray-300">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                to="/signup"
                className={`w-full block text-center py-3 rounded-lg font-semibold transition-all duration-200 ${
                  plan.highlighted
                    ? 'bg-primary-600 text-white hover:bg-primary-700'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                Get Started
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 lg:px-12 py-12 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <PenTool className="w-6 h-6 text-primary-600" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">NoteFlow</span>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            © 2024 NoteFlow. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
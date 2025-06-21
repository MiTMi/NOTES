import { Link } from 'react-router-dom'
import { PenTool, ArrowRight, Sparkles, Users, Shield, Zap } from 'lucide-react'
import ThemeToggle from '../components/ThemeToggle'
import CountdownTimer from '../components/CountdownTimer'

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-navy-dark dark:via-navy-light dark:to-navy-dark overflow-hidden relative">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-64 h-64 bg-accent-blue/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-coral-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent-purple/5 rounded-full blur-3xl" />
      </div>

      {/* Navigation */}
      <nav className="relative z-20 px-6 lg:px-12 py-6">
        <div className="max-w-[1400px] mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-gradient-to-br from-coral-500 to-coral-600 rounded-2xl shadow-lg shadow-coral-500/25">
              <PenTool className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">NoteFlow</span>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Link to="/signin" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white font-medium transition-colors">
              Sign In
            </Link>
            <Link to="/signup" className="bg-coral-500 hover:bg-coral-600 text-white font-semibold py-2.5 px-6 rounded-full shadow-lg shadow-coral-500/25 hover:shadow-xl hover:shadow-coral-500/30 transform hover:-translate-y-0.5 transition-all duration-200">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-6 lg:px-12 pt-12 pb-24">
        <div className="max-w-[1400px] mx-auto grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-left space-y-8 animate-fade-in">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
              <span className="text-gray-900 dark:text-white">The</span>{' '}
              <span className="relative inline-block">
                <span className="relative z-10 text-accent-yellow">Easy</span>
                <svg className="absolute -inset-2 w-full h-full" viewBox="0 0 200 60">
                  <rect x="5" y="5" width="190" height="50" rx="8" fill="none" stroke="#f4d03f" strokeWidth="3" strokeDasharray="5,5" className="animate-pulse-slow" />
                </svg>
              </span>{' '}
              <span className="text-gray-900 dark:text-white">Way</span>
              <br />
              <span className="text-gray-900 dark:text-white">to Take</span>{' '}
              <span className="text-accent-yellow font-extrabold">Notes</span>
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-lg leading-relaxed">
              Capture your thoughts, organize your ideas, and collaborate with your team - all in one beautiful, intuitive app.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/signup" className="group inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-coral-500 to-coral-600 rounded-full shadow-xl shadow-coral-500/25 hover:shadow-2xl hover:shadow-coral-500/30 transform hover:-translate-y-0.5 transition-all duration-200">
                <span>Start Writing Free</span>
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

          </div>

          {/* Right Illustration */}
          <div className="relative h-[600px] hidden lg:block">
            {/* Main Notebook */}
            <div className="absolute top-10 right-10 z-30 animate-float">
              <div className="w-72 h-96 bg-gradient-to-br from-white/95 to-white/90 rounded-2xl shadow-2xl transform rotate-6 hover:rotate-3 transition-transform duration-300">
                <div className="h-full p-8 relative">
                  {/* Notebook spiral binding */}
                  <div className="absolute left-0 top-0 bottom-0 w-12 bg-gray-200 rounded-l-2xl">
                    <div className="flex flex-col justify-evenly h-full py-4">
                      {[...Array(12)].map((_, i) => (
                        <div key={i} className="w-8 h-8 mx-auto rounded-full bg-gray-400" />
                      ))}
                    </div>
                  </div>
                  {/* Notebook lines */}
                  <div className="ml-8 space-y-4">
                    <div className="h-2 bg-gray-300 rounded w-3/4" />
                    <div className="h-2 bg-gray-300 rounded w-full" />
                    <div className="h-2 bg-gray-300 rounded w-2/3" />
                    <div className="h-2 bg-coral-500 rounded w-1/2" />
                    <div className="h-2 bg-gray-300 rounded w-5/6" />
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Pencil - Modern Design */}
            <div className="absolute top-32 left-10 z-40 animate-float-slow" style={{ animationDelay: '0.5s' }}>
              <div className="transform rotate-45 hover:rotate-12 transition-transform duration-500">
                <div className="relative group">
                  {/* Pencil Shadow */}
                  <div className="absolute inset-0 bg-gray-900/20 rounded-lg blur-xl transform translate-y-4" />
                  
                  {/* Pencil Body */}
                  <div className="relative flex">
                    {/* Wood tip */}
                    <div className="w-8 h-16 bg-gradient-to-br from-orange-200 to-orange-300 rounded-l-full">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-l-full" />
                    </div>
                    
                    {/* Main body with hexagonal shape */}
                    <div className="w-40 h-16 relative bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-400">
                      {/* Top edge */}
                      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-yellow-300 via-yellow-400 to-orange-300" />
                      {/* Bottom edge */}
                      <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-yellow-600 via-yellow-700 to-orange-600" />
                      {/* Brand text */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-gray-800/40 font-bold text-xs tracking-wider">NOTEFLOW</span>
                      </div>
                    </div>
                    
                    {/* Metal ferrule */}
                    <div className="w-12 h-16 bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 relative">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-white/20" />
                      {/* Crimp lines */}
                      <div className="absolute inset-x-0 top-4 h-8 flex flex-col justify-around">
                        <div className="h-0.5 bg-gray-600/30" />
                        <div className="h-0.5 bg-gray-600/30" />
                      </div>
                    </div>
                    
                    {/* Eraser */}
                    <div className="w-6 h-16 bg-gradient-to-r from-pink-400 to-pink-500 rounded-r-full">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-white/20 rounded-r-full" />
                    </div>
                  </div>
                  
                  {/* Lead/Graphite tip */}
                  <div className="absolute -left-4 top-1/2 -translate-y-1/2">
                    <div className="w-0 h-0 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent border-r-[12px] border-r-gray-800" />
                  </div>
                </div>
              </div>
            </div>

            {/* Small floating notes */}
            <div className="absolute bottom-40 right-40 z-20 animate-float" style={{ animationDelay: '2s' }}>
              <div className="w-32 h-32 bg-gradient-to-br from-accent-blue to-blue-500 rounded-xl shadow-lg transform rotate-12 p-4">
                <div className="space-y-2">
                  <div className="h-2 bg-white/60 rounded w-full" />
                  <div className="h-2 bg-white/60 rounded w-3/4" />
                  <div className="h-2 bg-white/60 rounded w-1/2" />
                </div>
              </div>
            </div>

            {/* Floating sticky note */}
            <div className="absolute top-20 left-60 z-25 animate-float-slow" style={{ animationDelay: '1.5s' }}>
              <div className="w-24 h-24 bg-coral-500 rounded shadow-lg transform -rotate-6 p-3">
                <div className="space-y-1">
                  <div className="h-1 bg-white/40 rounded w-full" />
                  <div className="h-1 bg-white/40 rounded w-3/4" />
                </div>
              </div>
            </div>

            {/* UI Window */}
            <div className="absolute bottom-10 left-0 z-15 animate-float" style={{ animationDelay: '1s' }}>
              <div className="w-64 h-48 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl p-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 bg-coral-500 rounded-full" />
                  <div className="w-3 h-3 bg-accent-yellow rounded-full" />
                  <div className="w-3 h-3 bg-accent-green rounded-full" />
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-white/20 rounded w-full" />
                  <div className="h-3 bg-white/20 rounded w-3/4" />
                  <div className="h-3 bg-accent-yellow/40 rounded w-1/2" />
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-60 right-20 z-10">
              <Sparkles className="w-10 h-10 text-accent-yellow animate-pulse-slow" />
            </div>
            <div className="absolute bottom-20 left-40 z-10">
              <div className="w-6 h-6 bg-accent-purple rounded-full animate-pulse-slow" />
            </div>
            <div className="absolute top-80 left-10 z-10">
              <div className="w-4 h-4 bg-coral-500 rounded-full animate-float" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative z-10 px-6 lg:px-12 py-24">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Everything you need, nothing you don't
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Simple, powerful features that help you focus on what matters
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Zap className="w-8 h-8" />,
                title: 'Lightning Fast',
                description: 'Real-time sync across all your devices',
                bgColor: 'bg-accent-yellow/20',
                iconColor: 'text-accent-yellow'
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: 'Secure & Private',
                description: 'End-to-end encryption for your peace of mind',
                bgColor: 'bg-accent-blue/20',
                iconColor: 'text-accent-blue'
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: 'Team Collaboration',
                description: 'Share and work together seamlessly',
                bgColor: 'bg-coral-500/20',
                iconColor: 'text-coral-500'
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="group relative bg-white/80 dark:bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-gray-200 dark:border-white/10 hover:bg-white dark:hover:bg-white/10 hover:border-gray-300 dark:hover:border-white/20 transition-all duration-300 hover:-translate-y-1 shadow-lg"
              >
                <div className={`w-16 h-16 ${feature.bgColor} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <div className={feature.iconColor}>{feature.icon}</div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 lg:px-12 py-24">
        <div className="max-w-[1400px] mx-auto text-center">
          <div className="relative">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-8">
              Ready to transform how you take notes?
            </h2>
            <div className="absolute -top-8 -right-8 animate-float">
              <Sparkles className="w-12 h-12 text-accent-yellow" />
            </div>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-10">
            Join thousands who've already made the switch
          </p>
          <Link to="/signup" className="group inline-flex items-center justify-center px-10 py-5 text-xl font-semibold text-white bg-gradient-to-r from-coral-500 to-coral-600 rounded-full shadow-2xl shadow-coral-500/30 hover:shadow-coral-500/40 transform hover:-translate-y-1 transition-all duration-200">
            <span>Get Started Now</span>
            <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 lg:px-12 py-12 border-t border-gray-200 dark:border-white/10">
        <div className="max-w-[1400px] mx-auto">
          {/* Countdown Timer - Center */}
          <div className="flex justify-center mb-8">
            <CountdownTimer />
          </div>
          
          {/* Footer Content */}
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="p-2 bg-gradient-to-br from-coral-500 to-coral-600 rounded-xl">
                <PenTool className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">NoteFlow</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              © 2024 NoteFlow. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
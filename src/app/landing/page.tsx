import React from 'react';

const MathLearningPlatform: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section with Colored Background */}
      <div className="relative min-h-screen bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-600 overflow-hidden">
        {/* Fuzzy Texture Overlay */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.4'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Floating Gradient Circles */}
        <div className="absolute inset-0">
          {/* Large circle - top right */}
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-emerald-300/40 to-transparent rounded-full blur-3xl"></div>
          
          {/* Medium circle - middle left */}
          <div className="absolute top-1/3 -left-32 w-80 h-80 bg-gradient-to-tr from-teal-300/30 to-emerald-200/20 rounded-full blur-2xl"></div>
          
          {/* Small circle - bottom center */}
          <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 w-64 h-64 bg-gradient-to-t from-emerald-600/20 to-emerald-400/30 rounded-full blur-xl"></div>
          
          {/* Accent circles */}
          <div className="absolute top-1/4 right-1/4 w-48 h-48 bg-gradient-to-bl from-teal-200/25 to-transparent rounded-full blur-2xl"></div>
          <div className="absolute bottom-1/3 right-1/3 w-56 h-56 bg-gradient-to-tr from-emerald-300/20 to-emerald-500/10 rounded-full blur-xl"></div>
        </div>

        {/* Grid Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="grid grid-cols-12 h-full">
            {Array.from({ length: 144 }).map((_, i) => (
              <div key={i} className="border border-white/20"></div>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <nav className="relative z-10 flex justify-between items-center px-8 py-6">
          <div className="text-2xl font-bold text-white">MathIQ</div>
          <div className="hidden md:flex space-x-8 text-sm font-medium text-white/80">
            <a href="#" className="hover:text-white transition-colors">Features</a>
            <a href="#" className="hover:text-white transition-colors">Curriculum</a>
            <a href="#" className="hover:text-white transition-colors">Pricing</a>
            <a href="#" className="hover:text-white transition-colors">About</a>
          </div>
          <div className="flex space-x-4">
            <button className="text-sm font-medium text-white/80 hover:text-white transition-colors">
              Sign In
            </button>
            <button className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 text-sm font-medium hover:bg-white/30 transition-colors border border-white/30">
              Get Started
            </button>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 px-8 py-20 lg:py-32">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="text-sm font-medium text-emerald-100 tracking-wide uppercase">
                  AI-Powered Learning
                </div>
                <h1 className="text-5xl lg:text-7xl font-black leading-none">
                  <span className="text-white">the future of</span>
                  <br />
                  <span className="text-white font-outline">MATH</span>
                  <br />
                  <span className="text-emerald-100 font-light">education</span>
                </h1>
                <p className="text-lg text-emerald-50 max-w-lg leading-relaxed">
                  Adaptive AI technology that personalizes math learning for every student. 
                  From basic arithmetic to advanced calculus, our platform adjusts to your pace.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-white text-emerald-600 px-8 py-4 font-semibold hover:bg-emerald-50 transition-colors text-lg shadow-lg">
                  Start Learning Free
                </button>
                <button className="border-2 border-white text-white px-8 py-4 font-semibold hover:bg-white/10 transition-colors text-lg backdrop-blur-sm">
                  Watch Demo
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 pt-8 border-t border-white/20">
                <div>
                  <div className="text-2xl font-bold text-white">50K+</div>
                  <div className="text-sm text-emerald-100 font-medium">Active Students</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">94%</div>
                  <div className="text-sm text-emerald-100 font-medium">Success Rate</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">1M+</div>
                  <div className="text-sm text-emerald-100 font-medium">Problems Solved</div>
                </div>
              </div>
            </div>

            {/* Right Visual Element */}
            <div className="relative">
              {/* Large Mathematical Symbol Container */}
              <div className="relative bg-white/10 backdrop-blur-md border border-white/20 w-96 h-96 mx-auto flex items-center justify-center shadow-2xl">
                <div className="text-white text-9xl font-light">π</div>
                
                {/* Floating Cards */}
                <div className="absolute -top-4 -left-4 bg-white/95 backdrop-blur-sm p-4 shadow-xl transform -rotate-12 border border-white/40">
                  <div className="text-sm font-mono text-gray-700">
                    <div>f(x) = x² + 2x + 1</div>
                    <div className="text-emerald-600 font-semibold mt-2">✓ Solved</div>
                  </div>
                </div>
                
                <div className="absolute -bottom-4 -right-4 bg-white/95 backdrop-blur-sm p-4 shadow-xl transform rotate-12 border border-white/40">
                  <div className="text-sm font-mono text-gray-700">
                    <div>∫ x² dx = x³/3 + C</div>
                    <div className="text-emerald-600 font-semibold mt-2">AI Hint</div>
                  </div>
                </div>
                
                <div className="absolute top-1/2 -right-8 bg-white/20 backdrop-blur-sm p-3 shadow-lg border border-white/30">
                  <div className="w-6 h-6 bg-white/30 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>

              {/* Subtle Grid Overlay */}
              <div className="absolute inset-0 pointer-events-none opacity-5">
                <div className="grid grid-cols-8 grid-rows-8 h-full">
                  {Array.from({ length: 64 }).map((_, i) => (
                    <div key={i} className="border border-white"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section - White Background */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose MathIQ?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our AI-driven approach combines proven pedagogical methods with cutting-edge technology
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-emerald-100 flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Adaptive Learning</h3>
              <p className="text-gray-600">
                AI algorithms adjust difficulty and pacing based on individual learning patterns and progress.
              </p>
            </div>

            <div className="bg-gray-50 p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-emerald-100 flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Instant Feedback</h3>
              <p className="text-gray-600">
                Get immediate explanations and step-by-step solutions for every problem you encounter.
              </p>
            </div>

            <div className="bg-gray-50 p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-emerald-100 flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Progress Tracking</h3>
              <p className="text-gray-600">
                Comprehensive analytics help students and teachers monitor learning progress and identify areas for improvement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-4xl mx-auto text-center px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Ready to Transform Your Math Learning?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of students already achieving better results with AI-powered math education.
          </p>
          <button className="bg-emerald-600 text-white px-8 py-4 text-lg font-semibold hover:bg-emerald-700 transition-colors shadow-lg">
            Start Your Free Trial
          </button>
        </div>
      </section>
    </div>
  );
};

export default MathLearningPlatform;
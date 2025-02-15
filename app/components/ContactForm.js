import React from 'react';
import { Mail, Phone, MessageSquare } from 'lucide-react';

const ContactForm = () => {
  return (
    <div className="min-h-screen py-12 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left Column */}
          <div className="space-y-8">
            <div className="inline-flex p-3 rounded-lg">
              <Mail className="w-6 h-6 text-blue-500" />
            </div>
            
            <h1 className="text-5xl font-bold text-white">Contact us</h1>
            
            <p className="text-lg text-gray-400">
              We are always looking for ways to improve our products and services. 
              Contact us and let us know how we can help you.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 text-gray-400">
              <a href="mailto:contact@yoursaas.ai" className="hover:text-blue-400 transition-colors">
                contact@yoursaas.ai
              </a>
              <span className="hidden sm:inline">•</span>
              <a href="tel:+1800123XX21" className="hover:text-blue-400 transition-colors">
                +1 (800) 123 XX21
              </a>
              <span className="hidden sm:inline">•</span>
              <a href="mailto:support@yoursaas.ai" className="hover:text-blue-400 transition-colors">
                support@yoursaas.ai
              </a>
            </div>

            {/* World Map SVG */}
            <div className="relative mt-12">
              <div className="text-center absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full mb-4">
                <div className="bg-gray-800 text-white px-4 py-2 rounded-lg inline-flex items-center">
                  <span>We are here</span>
                  <div className="w-px h-12 bg-blue-500 absolute top-full left-1/2 transform -translate-x-1/2" />
                </div>
              </div>
              <svg viewBox="0 0 1024 512" className="w-full h-auto text-gray-800">
                <path
                  d="M0,256 L1024,256 M0,128 L1024,128 M0,384 L1024,384"
                  stroke="currentColor"
                  strokeWidth="0.5"
                  fill="none"
                />
                <path
                  d="M256,0 L256,512 M512,0 L512,512 M768,0 L768,512"
                  stroke="currentColor"
                  strokeWidth="0.5"
                  fill="none"
                />
                <path
                  d="M472,252 C532,252 582,292 582,342"
                  stroke="rgb(59, 130, 246)"
                  strokeWidth="2"
                  fill="none"
                />
                <circle
                  cx="582"
                  cy="342"
                  r="4"
                  fill="rgb(59, 130, 246)"
                />
              </svg>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="bg-gray-900/50 rounded-3xl p-8 backdrop-blur-sm border border-gray-800">
            <form className="space-y-6">
              <div>
                <label className="block text-gray-300 mb-2">Full name</label>
                <input
                  type="text"
                  className="w-full bg-gray-800 rounded-lg px-4 py-3 border border-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors placeholder:text-gray-500"
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Email Address</label>
                <input
                  type="email"
                  className="w-full bg-gray-800 rounded-lg px-4 py-3 border border-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors placeholder:text-gray-500"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Company</label>
                <input
                  type="text"
                  className="w-full bg-gray-800 rounded-lg px-4 py-3 border border-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors placeholder:text-gray-500"
                  placeholder="Your company name"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Message</label>
                <textarea
                  rows={4}
                  className="w-full bg-gray-800 rounded-lg px-4 py-3 border border-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors placeholder:text-gray-500"
                  placeholder="Type your message here"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white rounded-lg px-4 py-3 font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
import { ArrowRight } from 'lucide-react'

const Hero = () => {
  return (
    <div>
        <section className="pt-32 pb-20 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-6xl md:text-7xl font-bold text-gray-900 leading-tight hover:text-yellow-600 transition-colors duration-300">
                Manage Your Expenses Effortlessly
              </h1>
              <p className="text-xl text-gray-700 hover:text-gray-900 transition-colors duration-300">
                Track and manage your expenses with FlowXpense, the ultimate expense tracking solution.
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="px-8 py-4 bg-gray-900 text-yellow-400 rounded-full font-bold text-lg hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center gap-2 shadow-lg hover:shadow-2xl">
                  Get Started <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
                <button className="px-8 py-4 bg-yellow-400 text-gray-900 rounded-full font-bold text-lg border-2 border-gray-900 hover:bg-yellow-300 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-2xl">
                  Grow With Us
                </button>
              </div>
            </div>
            
            <div className="relative group">
              {/* Image Placeholder with hover effect */}
              
                <div className="aspect-square flex items-center justify-center bg-gradient-to-br from-yellow-100 to-yellow-300 relative overflow-hidden">
                  {/* Background image layer */}
                  <div className="absolute inset-0 z-0">
                    <img src='/lineArt.png' alt='Career Path Illustration' className="w-full h-full object-cover opacity-80 transition-opacity duration-500 group-hover:opacity-100" />
                  </div>

                  {/* Animated decorative shapes layer */}
                  <div className="absolute inset-0 z-10">
                    <div className="absolute top-10 left-10 w-20 h-20 bg-pink-300 rounded-full opacity-50 transition-transform duration-500 group-hover:scale-150 group-hover:translate-x-4"></div>
                    <div className="absolute bottom-10 right-10 w-32 h-32 bg-blue-300 rounded-full opacity-40 transition-transform duration-500 group-hover:scale-150 group-hover:-translate-x-4"></div>
                    <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-purple-300 rounded-full opacity-30 transition-transform duration-700 group-hover:rotate-180"></div>
                  </div>
                  
                  {/* <div className="relative z-10 text-center p-8">
                    <Users className="w-32 h-32 mx-auto text-gray-800 mb-4 transition-all duration-500 group-hover:scale-110 group-hover:rotate-12" />
                    <p className="text-2xl font-bold text-gray-800 transition-all duration-300 group-hover:text-3xl">Your Career Journey</p>
                    <p className="text-gray-700 mt-2 transition-opacity duration-300 group-hover:opacity-0">Starts Here</p>
                  </div> */}
                </div>
             
              
              {/* Floating decorative elements */}
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-yellow-400 rounded-full border-4 border-gray-900 transition-all duration-300 group-hover:scale-125 group-hover:rotate-45 animate-pulse"></div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-pink-400 rounded-lg border-4 border-gray-900 transition-all duration-300 group-hover:scale-125 group-hover:-rotate-45"></div>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}

export default Hero
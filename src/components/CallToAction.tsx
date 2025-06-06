import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function CallToActionSection() {
  const benefits = [
    "Instant AI feedback on your solutions",
    "Step-by-step problem guidance",
    "Track progress across all topics",
    "Join collaborative classrooms",
    "Access thousands of practice problems",
    "Get personalized learning recommendations"
  ];

  return (
    <section className="relative overflow-hidden container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 bg-black">
      {/* Background elements matching your style */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-br from-green-500 to-transparent rounded-full opacity-30 blur-3xl animate-pulse" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-gradient-to-tr from-green-400 to-transparent rounded-full opacity-20 blur-2xl animate-pulse animation-delay-2000" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-green-500 to-transparent rounded-full opacity-10 blur-3xl animate-[pulse_10s_ease-in-out_infinite]" />

      <div className="relative z-10">
        {/* Stats Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 drop-shadow-md">
            Join the Future of Math Learning
          </h2>
          <p className="text-lg text-gray-300 font-light max-w-2xl mx-auto mb-12">
            Soon thousands of students and educators will be transforming their mathematical learning experience with Numerus.
          </p>
          
          {/* <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8 mb-12">
            {stats.map((stat, index) => (
              <Card key={index} className="border-0 shadow-lg bg-gray-900/50 backdrop-blur-sm">
                <CardContent className="text-center py-8">
                  <div className="flex justify-center mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-600">
                      <stat.icon className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-white mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-400 font-light">
                    {stat.label}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div> */}
        </div>

        {/* Main CTA Card */}
        <Card className="border-0 shadow-xl px-8 bg-gradient-to-r from-gray-900 to-gray-800 backdrop-blur-sm">
          <CardContent className="py-12 sm:py-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Left side - Benefits */}
              <div>
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-6 drop-shadow-md">
                  Everything You Need to Excel in Mathematics
                </h3>
                <div className="space-y-3 mb-8">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300 font-light">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right side - CTA */}
              <div className="text-center lg:text-left">
                <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-8 shadow-2xl">
                  <h4 className="text-xl sm:text-2xl font-bold text-white mb-4">
                    Ready to Get Started?
                  </h4>
                  <p className="text-green-100 mb-6 font-light">
                    Create your free account today and start solving problems with AI-powered assistance.
                  </p>
                  
                  <div className="space-y-4">
                    <Button
                      size="lg"
                      className="w-full h-12 bg-white text-green-600 font-bold hover:bg-gray-100 hover:text-green-700 transition-all duration-300 hover:scale-105 group"
                      asChild
                    >
                      <Link href="/login" className="flex items-center justify-center">
                        Start Learning for Free
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                    
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full h-12 bg-white border-white/50 text-black hover:bg-white/10 hover:text-white hover:border-white transition-colors"
                      asChild
                    >
                      <Link href="/explore">
                        Explore Sample Problems
                      </Link>
                    </Button>
                  </div>

                  {/* <div className="mt-6 text-center">
                    <p className="text-green-100 text-sm font-light">
                      No credit card required • Free forever plan available
                    </p>
                  </div> */}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
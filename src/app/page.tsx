import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import FloatingMath from "@/components/ui/floating-numbers";
import { BookOpen, Users, TrendingUp, Brain, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-accent">
      {/* Hero Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="relative z-10 container mx-auto px-4 md:px-6 flex flex-col items-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent text-white drop-shadow-xl mb-6">
            <Brain className="h-8 w-8" />
          </div>
          <FloatingMath />

          <div className="max-w-4xl mx-auto">
            <span className="relative inline-block bg-clip-text text-4xl sm:text-5xl lg:text-6xl font-bold text-white drop-shadow-lg">
              AI-Powered Learning
            </span>
            <h2 className="relative inline-block bg-clip-text text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 drop-shadow-lg">
              Made Simple
            </h2>
            <p className="text-xl text-gray-300 mb-12 font-light animate-fadeInTranslateY duration-[1s] delay-[1s]">
              Create, solve and learn from mathematical problems with the help
              of artificial intelligence. Join classrooms, track progress, and
              get personalized feedback.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="h-12 px-8 hover:bg-primary/80"
                asChild
              >
                <Link href="/explore">
                  Explore Problems
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 px-8 hover:text-white hover:bg-accent/60"
                asChild
              >
                <Link href="/signup">Get Started Free</Link>
              </Button>
            </div>
            <div
              className="inline-block group relative 
                       p-px rounded-2xl backdrop-blur-lg overflow-hidden shadow-2xl 
                       hover:shadow-purple-500/25 transition-all animate-fadeInScale duration-[800ms] delay-[2500ms]"
            ></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 drop-shadow-md">
            Why Choose AI Teach?
          </h2>
          <p className="text-lg text-gray-300 font-light max-w-2xl mx-auto">
            Experience the future of education with our AI-powered platform
            designed for students and educators.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-600">
                  <BookOpen className="h-6 w-6" />
                </div>
              </div>
              <CardTitle className="text-xl">Smart Problem Solving</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center text-base leading-relaxed">
                Upload handwritten solutions and get instant AI feedback. Learn
                from mistakes with step-by-step guidance and personalized hints.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-600">
                  <Users className="h-6 w-6" />
                </div>
              </div>
              <CardTitle className="text-xl">Collaborative Learning</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center text-base leading-relaxed">
                Join classrooms, share problems, and learn together. Teachers
                can create assignments and track student progress in real-time.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-600">
                  <TrendingUp className="h-6 w-6" />
                </div>
              </div>
              <CardTitle className="text-xl">Progress Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center text-base leading-relaxed">
                Monitor your learning journey with detailed analytics. See
                completion rates, difficulty progression, and areas for
                improvement.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <Card className="border-0 shadow-xl bg-gradient-to-r from-secondary to-accent text-white">
          <CardContent className="text-center py-12 sm:py-16">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 font-cambria-math">
              Ready to Transform Your Learning?
            </h2>
            <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
              Join thousands of students and educators already using AI Teach to
              enhance their mathematical learning experience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="default"
                className="h-12 px-8 bg-accent text-white hover:bg-accent/80 hover:text-white transition-colors"
                asChild
              >
                <Link href="/signup">Start Learning Today</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 px-8 border-white text-accent hover:bg-white hover:text-secondary"
                asChild
              >
                <Link href="/explore">Browse Problems</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        <FloatingMath />
      </section>
    </div>
  );
}

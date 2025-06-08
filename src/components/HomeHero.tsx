import Link from "next/link";
import { Button } from "@/components/ui/button";
import FloatingMath from "@/components/floating-numbers";

export default function HomeHero() {
  return (
    <section className="relative z-10 h-screen flex flex-col items-center justify-center text-center bg-black px-4 sm:px-6 lg:px-8">
      <FloatingMath />
      <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-br from-green-500 to-transparent rounded-full opacity-30 blur-3xl animate-pulse" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-gradient-to-tr from-green-400 to-transparent rounded-full opacity-10 blur-2xl animate-pulse animation-delay-2000" />

      <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-gradient-to-bl from-green-500 to-transparent rounded-full opacity-15 blur-3xl animate-[pulse_8s_ease-in-out_infinite]" />

      <div className="absolute top-3/4 left-1/3 w-64 h-64 bg-gradient-to-tl from-emerald-400 to-transparent rounded-full opacity-10 blur-2xl animate-[pulse_6s_ease-in-out_infinite_1s]" />

      <div className="absolute bottom-1/4 left-10 w-56 h-56 bg-gradient-to-t from-green-400 to-transparent rounded-full opacity-10 blur-3xl animate-[pulse_10s_ease-in-out_infinite_1.5s]" />


      <div className="z-20 space-y-6 max-w-3xl">
        <h1 className="text-6xl md:text-8xl font-extrabold mb-4">
          <span
            className="
              relative inline-block 
              bg-clip-text text-transparent 
              bg-gradient-to-r from-green-400 via-green-500 to-green-400 
              drop-shadow-[0_0_20px_rgba(34,197,94,0.8)] 
              animate-gradient-x
            "
          >
            Numerus
          </span>
        </h1>

        <p className="text-lg md:text-xl text-gray-300 mb-8">
          Create, practice, and learn from mathematical problems with the help of
          artificial intelligence. Join classrooms, solve problems, and get
           feedback.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">

          <Link href="/explore">
            <Button
              type="button"
              className="
                bg-white text-black font-bold 
                h-10 px-6 py-3 rounded-md transition-all duration-300 
                hover:bg-gray-100 hover:scale-105
              "
            >
              Explore Problems
            </Button>
          </Link>
          <Link href="/login">
            <Button
              type="button"
              className="
                bg-green-500 hover:bg-green-600 text-white font-bold 
                h-10 px-6 py-3 rounded-md transition-all duration-300 
                drop-shadow-[0_0_20px_rgba(34,197,94,0.7)] hover:scale-105
              "
            >
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

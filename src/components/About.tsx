import { Card, CardContent } from "@/components/ui/card";
import { Brain, Users } from "lucide-react";

const MathDisplay = ({ problem, solution, highlighted = false } : { problem : string, solution: string, highlighted? : boolean }) => (
  <div className={`bg-gray-900 rounded-lg p-4 border-l-4 ${highlighted ? 'border-green-500 shadow-lg' : 'border-gray-600'} transition-all duration-300`}>
    <div className="font-mono text-sm text-gray-300 mb-2">Problem:</div>
    <div className="text-white font-cambria-math text-lg mb-3">{problem}</div>
    <div className="font-mono text-sm text-gray-300 mb-2">Solution:</div>
    <div className="text-green-400 font-cambria-math">{solution}</div>
    {highlighted && (
      <div className="mt-3 text-xs text-green-300 flex items-center">
        <Brain className="h-3 w-3 mr-1" />
        AI Feedback: Great work! Consider exploring alternative methods.
      </div>
    )}
  </div>
);

const ClassroomCard = ({ title, problems, students } : { title : string, problems : number, students : number }) => (
  <Card className="bg-gray-800 border-gray-700 hover:border-green-500 transition-colors">
    <CardContent className="p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-white font-semibold">{title}</h4>
        <Users className="h-4 w-4 text-green-400" />
      </div>
      <div className="text-sm text-gray-400 mb-2">{problems} problems assigned</div>
      <div className="text-sm text-gray-400">{students} students enrolled</div>
      <div className="mt-3 h-2 bg-gray-700 rounded-full overflow-hidden">
        <div className="h-full bg-green-500 rounded-full" style={{ width: '73%' }} />
      </div>
    </CardContent>
  </Card>
);

export default function About() {
  const showcases = [
    {
      title: "Upload & Solve Problems",
      description: "Upload handwritten math problems or type them directly. Our AI analyzes your work and provides instant feedback with step-by-step guidance.",
      alignment: "left",
      component: (
        <div className="space-y-4">
          <MathDisplay 
            problem="∫ x² dx"
            solution="x³/3 + C"
            highlighted={true}
          />
          <MathDisplay 
            problem="lim(x→0) sin(x)/x"
            solution="1"
          />
        </div>
      ),
    },
    {
      title: "Join Interactive Classrooms",
      description: "Collaborate with classmates and teachers in virtual classrooms. Share problems, track progress, and learn together in real-time.",
      alignment: "right",
      component: (
        <div className="grid grid-cols-1 gap-4">
          <ClassroomCard title="Calculus I - Fall 2025" problems={24} students={32} />
          <ClassroomCard title="Linear Algebra" problems={18} students={28} />
          <ClassroomCard title="Statistics 101" problems={15} students={45} />
        </div>
      ),
    },
    {
      title: "Track Your Progress",
      description: "Monitor your learning journey with detailed analytics. See your completion rates, difficulty progression, and identify areas for improvement.",
      alignment: "left",
      component: (
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">89%</div>
                <div className="text-sm text-gray-400">Completion Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">156</div>
                <div className="text-sm text-gray-400">Problems Solved</div>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-300">Algebra</span>
                  <span className="text-green-400">95%</span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: '95%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-300">Calculus</span>
                  <span className="text-yellow-400">72%</span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full">
                  <div className="h-full bg-yellow-500 rounded-full" style={{ width: '72%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-300">Statistics</span>
                  <span className="text-red-400">45%</span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full">
                  <div className="h-full bg-red-500 rounded-full" style={{ width: '45%' }} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ),
    },
  ];

  return (
    <section className="relative overflow-hidden container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 bg-black">
      {/* Background elements matching your style */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-br from-green-500 to-transparent rounded-full opacity-30 blur-3xl animate-pulse" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-gradient-to-tr from-green-400 to-transparent rounded-full opacity-20 blur-2xl animate-pulse animation-delay-2000" />
      <div className="absolute top-3/4 left-1/3 w-64 h-64 bg-gradient-to-tl from-emerald-400 to-transparent rounded-full opacity-20 blur-2xl animate-[pulse_6s_ease-in-out_infinite_1s]" />
      <div className="absolute top-10 right-1/3 w-48 h-48 bg-gradient-to-r from-green-300 to-transparent rounded-full opacity-15 blur-xl animate-[pulse_7s_ease-in-out_infinite_2s]" />

      <div className="relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 drop-shadow-md">
            What is Numerus?
          </h2>
          <p className="text-lg text-gray-300 font-light max-w-2xl mx-auto">
            Your AI-powered mathematics learning companion that transforms how you solve problems and learn concepts.
          </p>
        </div>

        <div className="max-w-6xl mx-auto space-y-16 lg:space-y-24">
          {showcases.map((showcase, index) => (
            <div
              key={index}
              className={`flex flex-col ${showcase.alignment === "right" ? "lg:flex-row-reverse" : "lg:flex-row"} items-center gap-8 lg:gap-12`}
            >
              <div className="w-full lg:w-1/2">
                <h3 className="text-2xl sm:text-3xl font-bold mb-4 text-white drop-shadow-md">
                  {showcase.title}
                </h3>
                <p className="text-lg text-gray-300 font-light leading-relaxed">
                  {showcase.description}
                </p>
              </div>
              <div className="w-full lg:w-1/2">
                {showcase.component}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
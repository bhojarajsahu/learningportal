import Link from "next/link";
import Image from "next/image";
import { FiBook, FiCode, FiLayers, FiAward, FiUsers, FiLayout } from "react-icons/fi";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="py-12 md:py-20">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-csharp-blue-500 to-csharp-purple-500 text-transparent bg-clip-text">
              Learn C# Programming Visually
            </h1>
            <p className="text-xl text-gray-700 dark:text-gray-300">
              Master C# programming through interactive visual examples, hands-on exercises, and comprehensive tutorials.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/beginner/introduction" className="btn-primary">
                Start Learning
              </Link>
              <Link href="/playground" className="btn-secondary">
                Try C# Online
              </Link>
            </div>
          </div>
          <div className="relative h-[300px] md:h-[400px] bg-gradient-to-br from-csharp-blue-100 to-csharp-purple-100 dark:from-csharp-blue-900/30 dark:to-csharp-purple-900/30 rounded-lg shadow-lg overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="p-8 text-center">
                <div className="text-6xl font-mono font-bold text-csharp-blue-500 dark:text-csharp-blue-400">C#</div>
                <div className="mt-4 animate-pulse">
                  <code className="text-sm md:text-base bg-white/90 dark:bg-gray-800/90 px-4 py-2 rounded-md shadow-md">
                    Console.WriteLine("Hello, World!");
            </code>
                </div>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-csharp-blue-500/10 to-transparent"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-gray-50 dark:bg-gray-800/50 rounded-xl my-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">Interactive Learning Features</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Everything you need to master C# programming</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: <FiCode className="w-6 h-6 text-csharp-blue-500" />,
              title: "Interactive Code Editor",
              description: "Write, test, and debug C# code directly in your browser with real-time feedback"
            },
            {
              icon: <FiLayers className="w-6 h-6 text-csharp-blue-500" />,
              title: "Visual Concept Maps",
              description: "Understand complex concepts with interactive visualizations and diagrams"
            },
            {
              icon: <FiBook className="w-6 h-6 text-csharp-blue-500" />,
              title: "Comprehensive Tutorials",
              description: "Step-by-step guides from beginner to advanced concepts with practical examples"
            },
            {
              icon: <FiAward className="w-6 h-6 text-csharp-purple-500" />,
              title: "Skill Assessment",
              description: "Track your progress with interactive quizzes and coding challenges"
            },
            {
              icon: <FiLayout className="w-6 h-6 text-csharp-purple-500" />,
              title: "Memory Visualizations",
              description: "See how memory allocation and garbage collection work with animated diagrams"
            },
            {
              icon: <FiUsers className="w-6 h-6 text-csharp-purple-500" />,
              title: "Community Support",
              description: "Connect with other learners, ask questions, and share your knowledge"
            }
          ].map((feature, index) => (
            <div key={index} className="card hover:shadow-lg transition-shadow">
              <div className="flex flex-col items-center text-center">
                <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Learning Path Section */}
      <section className="py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">C# Learning Path</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Follow our structured path to master C# step by step</p>
        </div>
        <div className="relative">
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-csharp-blue-500 to-csharp-purple-500 hidden md:block"></div>
          <div className="space-y-12">
            {[
              {
                level: "Beginner",
                description: "Start with C# fundamentals, syntax basics, and simple programs",
                topics: ["C# Syntax", "Variables & Data Types", "Control Structures", "Basic Classes"],
                color: "csharp-blue"
              },
              {
                level: "Intermediate",
                description: "Explore object-oriented programming, LINQ, and collections",
                topics: ["Object-Oriented Programming", "Collections & Generics", "LINQ", "Exception Handling"],
                color: "csharp-blue"
              },
              {
                level: "Advanced",
                description: "Master advanced techniques like async programming and design patterns",
                topics: ["Asynchronous Programming", "Memory Management", "Reflection", "Design Patterns"],
                color: "csharp-purple"
              }
            ].map((path, index) => (
              <div key={index} className="md:grid md:grid-cols-5 items-center">
                <div className={`md:col-span-2 ${index % 2 === 1 ? 'md:order-2' : ''}`}>
                  <div className={`p-6 bg-${path.color}-50 dark:bg-${path.color}-900/30 rounded-lg shadow relative`}>
                    <h3 className={`text-2xl font-bold text-${path.color}-600 dark:text-${path.color}-400`}>
                      {path.level}
                    </h3>
                    <p className="my-2 text-gray-700 dark:text-gray-300">{path.description}</p>
                    <ul className="list-disc list-inside text-gray-600 dark:text-gray-400">
                      {path.topics.map((topic, i) => (
                        <li key={i}>{topic}</li>
                      ))}
                    </ul>
                    <Link href={`/${path.level.toLowerCase()}`} className={`mt-4 inline-block text-${path.color}-600 dark:text-${path.color}-400 font-medium hover:underline`}>
                      Start this level →
                    </Link>
                  </div>
                </div>
                <div className="hidden md:flex md:col-span-1 justify-center">
                  <div className={`w-10 h-10 rounded-full bg-${path.color}-500 flex items-center justify-center text-white font-bold`}>
                    {index + 1}
                  </div>
                </div>
                <div className={`md:col-span-2 ${index % 2 === 1 ? 'md:order-1' : ''} hidden md:block`}>
                  {/* This space intentionally left for visual balance */}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-12 bg-gradient-to-r from-csharp-blue-500 to-csharp-purple-500 rounded-xl my-12 text-white">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Ready to Start Your C# Journey?</h2>
          <p className="mt-4 text-white/80 max-w-2xl mx-auto">
            Join thousands of developers who are mastering C# with our visual and interactive learning platform. Start coding today!
          </p>
          <div className="mt-8">
            <Link href="/beginner/introduction" className="bg-white text-csharp-blue-700 hover:bg-gray-100 px-6 py-3 rounded-full font-bold transition-colors shadow-lg">
              Get Started for Free
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

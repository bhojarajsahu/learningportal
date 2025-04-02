import React from 'react';
import { FiBook, FiCode, FiCpu, FiDatabase } from 'react-icons/fi';
import LessonLayout from '@/components/LessonLayout';
import CodeEditor from '@/components/CodeEditor';

const beginnerSidebarItems = [
  {
    title: 'Getting Started',
    href: '/beginner',
    icon: <FiBook className="w-4 h-4" />,
    children: [
      { title: 'Introduction to C#', href: '/beginner/introduction' },
      { title: 'Setting Up Your Environment', href: '/beginner/setup' },
      { title: 'Your First C# Program', href: '/beginner/first-program' },
    ]
  },
  {
    title: 'C# Basics',
    href: '/beginner/basics',
    icon: <FiCode className="w-4 h-4" />,
    children: [
      { title: 'Variables and Data Types', href: '/beginner/data-types' },
      { title: 'Operators', href: '/beginner/operators' },
      { title: 'Type Conversion', href: '/beginner/type-conversion' },
    ]
  },
  {
    title: 'Control Structures',
    href: '/beginner/control',
    icon: <FiCpu className="w-4 h-4" />,
    children: [
      { title: 'If Statements', href: '/beginner/if-statements' },
      { title: 'Switch Statements', href: '/beginner/switch' },
      { title: 'Loops', href: '/beginner/loops' },
    ]
  },
  {
    title: 'Functions and Methods',
    href: '/beginner/functions',
    icon: <FiDatabase className="w-4 h-4" />,
    children: [
      { title: 'Methods Basics', href: '/beginner/methods' },
      { title: 'Parameters and Return Values', href: '/beginner/parameters' },
      { title: 'Method Overloading', href: '/beginner/overloading' },
    ]
  }
];

const firstProgramCode = `using System;

class Program
{
    static void Main(string[] args)
    {
        // Print a welcome message
        Console.WriteLine("Welcome to C# Programming!");
        
        // Get user input
        Console.Write("Please enter your name: ");
        string name = Console.ReadLine();
        
        // Print a personalized message
        Console.WriteLine($"Hello, {name}! Welcome to your first C# program!");
        
        // Wait for user to press a key before closing
        Console.WriteLine("\nPress any key to exit...");
        Console.ReadKey();
    }
}`;

const programExplanation = `1. using System; - Imports the System namespace, which contains basic types and operations
2. class Program - Defines a class named Program
3. static void Main(string[] args) - The entry point of the program
4. Console.WriteLine() - Prints text to the console and adds a new line
5. Console.Write() - Prints text without adding a new line
6. Console.ReadLine() - Reads user input from the console
7. Console.ReadKey() - Waits for a key press before closing`;

export default function FirstProgramPage() {
  return (
    <LessonLayout
      title="Your First C# Program"
      level="beginner"
      sidebarItems={beginnerSidebarItems}
      prev={{ href: '/beginner/setup', title: 'Setting Up Your Environment' }}
      next={{ href: '/beginner/data-types', title: 'Variables and Data Types' }}
    >
      <div className="prose max-w-none">
        <h1>Your First C# Program</h1>
        <p>
          Now that you have your development environment set up, let's create your first C# program.
          This program will demonstrate basic input and output operations.
        </p>

        <h2>The Program</h2>
        <p>
          Here's a simple program that asks for your name and displays a personalized greeting:
        </p>

        <div className="my-4">
          <CodeEditor
            initialCode={firstProgramCode}
            language="csharp"
            readOnly={true}
            title="First C# Program"
          />
        </div>

        <h2>Understanding the Code</h2>
        <p>
          Let's break down each part of the program:
        </p>

        <div className="my-4">
          <CodeEditor
            initialCode={programExplanation}
            language="text"
            readOnly={true}
            title="Code Explanation"
          />
        </div>

        <h2>Running the Program</h2>
        <ol>
          <li>Create a new console project using the command line:
            <pre>dotnet new console -n MyFirstProgram</pre>
          </li>
          <li>Replace the contents of Program.cs with the code above</li>
          <li>Run the program using:
            <pre>dotnet run</pre>
          </li>
        </ol>

        <h2>Program Output</h2>
        <p>
          When you run the program, it will:
        </p>
        <ol>
          <li>Display a welcome message</li>
          <li>Ask for your name</li>
          <li>Display a personalized greeting</li>
          <li>Wait for a key press before closing</li>
        </ol>

        <h2>Key Concepts</h2>
        <ul>
          <li><strong>Program Structure:</strong> Every C# program must have a Main method as its entry point</li>
          <li><strong>Input/Output:</strong> Console.WriteLine() and Console.ReadLine() for basic I/O</li>
          <li><strong>String Interpolation:</strong> Using $ before strings to embed variables</li>
          <li><strong>Comments:</strong> Using // for single-line comments</li>
        </ul>

        <h2>Next Steps</h2>
        <p>
          In the next lesson, we'll learn about variables and data types in C#,
          which will allow us to store and manipulate different kinds of information in our programs.
        </p>
      </div>
    </LessonLayout>
  );
} 
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

const methodsExample = `using System;

class Program
{
    static void Main(string[] args)
    {
        // Calling methods
        SayHello();
        
        DisplayMessage("Welcome to C# Methods!");
        
        string name = "Alice";
        GreetUser(name);
        
        int sum = AddNumbers(5, 3);
        Console.WriteLine($"Sum: {sum}");
        
        double circleArea = CalculateCircleArea(2.5);
        Console.WriteLine($"Circle area: {circleArea:F2}");
        
        bool isEven = IsEvenNumber(42);
        Console.WriteLine($"Is 42 even? {isEven}");
    }
    
    // Method with no parameters and no return value
    static void SayHello()
    {
        Console.WriteLine("Hello, world!");
    }
    
    // Method with one parameter and no return value
    static void DisplayMessage(string message)
    {
        Console.WriteLine(message);
    }
    
    // Method with one parameter and no return value
    static void GreetUser(string userName)
    {
        Console.WriteLine($"Hello, {userName}!");
    }
    
    // Method with parameters and a return value
    static int AddNumbers(int a, int b)
    {
        return a + b;
    }
    
    // Method with parameter and a return value
    static double CalculateCircleArea(double radius)
    {
        return Math.PI * radius * radius;
    }
    
    // Method that returns a boolean
    static bool IsEvenNumber(int number)
    {
        return number % 2 == 0;
    }
}`;

export default function MethodsPage() {
  return (
    <LessonLayout
      title="Methods Basics in C#"
      level="beginner"
      sidebarItems={beginnerSidebarItems}
      prev={{ href: '/beginner/loops', title: 'Loops' }}
      next={{ href: '/beginner/parameters', title: 'Parameters and Return Values' }}
    >
      <div className="prose max-w-none">
        <h1>Methods Basics in C#</h1>
        <p>
          Methods are blocks of code that perform specific tasks and can be reused throughout your program.
          They help organize code, promote reusability, and make programs more maintainable.
        </p>

        <h2>What is a Method?</h2>
        <p>
          A method is a self-contained block of code designed to perform a specific task.
          Methods can receive data through parameters, process that data, and optionally return results.
        </p>

        <h2>Method Anatomy</h2>
        <p>A typical method declaration consists of:</p>
        <ul>
          <li><strong>Access modifier:</strong> Controls visibility (e.g., public, private)</li>
          <li><strong>Return type:</strong> The type of value the method returns (or void for no return)</li>
          <li><strong>Method name:</strong> Name of the method (follow naming conventions)</li>
          <li><strong>Parameters:</strong> Input values the method needs (optional)</li>
          <li><strong>Method body:</strong> Code that executes when the method is called</li>
        </ul>

        <div className="my-4">
          <pre className="bg-gray-100 p-4 rounded-md">
            <code>
              {`access_modifier return_type MethodName(parameter_list)
{
    // Method body
    return value; // Optional return statement
}`}
            </code>
          </pre>
        </div>

        <h2>Example Program</h2>
        <p>
          Here's a program demonstrating various types of methods:
        </p>

        <div className="my-4">
          <CodeEditor
            initialCode={methodsExample}
            language="csharp"
            readOnly={true}
            title="Methods Example"
          />
        </div>

        <h2>Types of Methods</h2>
        <ul>
          <li><strong>Methods with no parameters:</strong> <code>SayHello()</code></li>
          <li><strong>Methods with parameters:</strong> <code>DisplayMessage(string message)</code></li>
          <li><strong>Methods that return values:</strong> <code>AddNumbers(int a, int b)</code></li>
          <li><strong>Methods that don't return values (void):</strong> <code>GreetUser(string userName)</code></li>
        </ul>

        <h2>Why Use Methods?</h2>
        <ul>
          <li><strong>Code organization:</strong> Break down complex problems into manageable pieces</li>
          <li><strong>Reusability:</strong> Write code once and use it multiple times</li>
          <li><strong>Maintainability:</strong> Easier to fix bugs and make changes</li>
          <li><strong>Readability:</strong> Makes code more understandable</li>
          <li><strong>Modularity:</strong> Self-contained units that focus on specific tasks</li>
        </ul>

        <h2>Method Naming Conventions</h2>
        <ul>
          <li>Use PascalCase (e.g., <code>CalculateArea</code>)</li>
          <li>Use verbs or verb phrases to describe the action</li>
          <li>Make names clear and descriptive of what the method does</li>
          <li>Avoid generic names or abbreviations</li>
        </ul>

        <h2>Best Practices</h2>
        <ul>
          <li>Keep methods focused on a single task (Single Responsibility Principle)</li>
          <li>Limit method length (generally under 20-30 lines)</li>
          <li>Use descriptive method names</li>
          <li>Document complex methods with comments</li>
          <li>Use appropriate access modifiers</li>
          <li>Avoid side effects when possible</li>
        </ul>

        <h2>Common Pitfalls</h2>
        <ul>
          <li>Creating methods that are too large or do too many things</li>
          <li>Overusing global variables instead of parameters</li>
          <li>Not handling error cases</li>
          <li>Duplicate code in multiple methods</li>
          <li>Poor naming that doesn't indicate the method's purpose</li>
        </ul>

        <h2>Next Steps</h2>
        <p>
          In the next lesson, we'll explore parameters and return values in more detail,
          learning about different parameter types and how to work with return values.
        </p>
      </div>
    </LessonLayout>
  );
} 
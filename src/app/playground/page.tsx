"use client";

import React, { useState } from 'react';
import CodeEditor from '@/components/CodeEditor';

// Example C# code templates
const codeTemplates = [
  {
    name: 'Hello World',
    code: `using System;

class Program
{
    static void Main(string[] args)
    {
        // Simple Hello World program
        Console.WriteLine("Hello, World!");
    }
}`
  },
  {
    name: 'Variables and Data Types',
    code: `using System;

class Program
{
    static void Main(string[] args)
    {
        // Declaring variables of different types
        int number = 10;
        double pi = 3.14159;
        char letter = 'A';
        string message = "C# is fun!";
        bool isLearning = true;
        
        // Displaying variable values
        Console.WriteLine("Number: " + number);
        Console.WriteLine("Pi: " + pi);
        Console.WriteLine("Letter: " + letter);
        Console.WriteLine("Message: " + message);
        Console.WriteLine("Is learning C#: " + isLearning);
    }
}`
  },
  {
    name: 'Conditional Statements',
    code: `using System;

class Program
{
    static void Main(string[] args)
    {
        // Example of if-else statement
        int number = 15;
        
        if (number > 10)
        {
            Console.WriteLine("Number is greater than 10");
        }
        else if (number == 10)
        {
            Console.WriteLine("Number is equal to 10");
        }
        else
        {
            Console.WriteLine("Number is less than 10");
        }
        
        // Using the ternary operator
        string result = (number % 2 == 0) ? "Even" : "Odd";
        Console.WriteLine("The number is " + result);
    }
}`
  },
  {
    name: 'Loops',
    code: `using System;

class Program
{
    static void Main(string[] args)
    {
        // For loop example
        Console.WriteLine("For loop:");
        for (int i = 1; i <= 5; i++)
        {
            Console.WriteLine("Iteration " + i);
        }
        
        // While loop example
        Console.WriteLine("\\nWhile loop:");
        int count = 1;
        while (count <= 3)
        {
            Console.WriteLine("Count: " + count);
            count++;
        }
        
        // Do-while loop example
        Console.WriteLine("\\nDo-while loop:");
        int j = 1;
        do
        {
            Console.WriteLine("Value: " + j);
            j++;
        } while (j <= 3);
    }
}`
  }
];

export default function PlaygroundPage() {
  const [selectedTemplate, setSelectedTemplate] = useState(codeTemplates[0]);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-csharp-blue-600 dark:text-csharp-blue-400 mb-4">
            C# Code Playground
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Write, edit, and execute C# code directly in your browser
          </p>
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Choose a Template:
          </label>
          <div className="flex flex-wrap gap-2">
            {codeTemplates.map((template, index) => (
              <button
                key={index}
                onClick={() => setSelectedTemplate(template)}
                className={`px-3 py-2 text-sm rounded-md transition-colors ${
                  selectedTemplate.name === template.name
                    ? 'bg-csharp-blue-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {template.name}
              </button>
            ))}
          </div>
        </div>
        
        <div className="mb-8">
          <CodeEditor
            initialCode={selectedTemplate.code}
            title="C# Code Editor"
            height="500px"
          />
        </div>
        
        <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">About the C# Playground</h2>
          <p className="mb-3">
            This interactive playground allows you to experiment with C# code directly in your browser.
            Select a template to start with, modify the code, and run it to see the results.
          </p>
          <p className="mb-3">
            Note: This playground uses a client-side code execution simulation for demonstration purposes.
            For a full C# development experience, we recommend using Visual Studio or VS Code with the C# extension.
          </p>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow">
              <h3 className="font-bold mb-2">Tips:</h3>
              <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400">
                <li>Use templates as starting points for experimenting</li>
                <li>The output panel shows your program's console output</li>
                <li>Click the fullscreen button for a larger editor</li>
              </ul>
            </div>
            <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow">
              <h3 className="font-bold mb-2">Limitations:</h3>
              <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400">
                <li>Only Console.WriteLine output is simulated</li>
                <li>File I/O operations are not supported</li>
                <li>External libraries cannot be imported</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
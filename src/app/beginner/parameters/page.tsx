"use client";

import React from 'react';
import LessonLayout from '@/components/LessonLayout';
import CodeEditor from '@/components/CodeEditor';
import { FiBook, FiCode, FiCpu, FiDatabase } from 'react-icons/fi';

// Sidebar configuration for beginner section
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

// Sample code examples
const basicParametersCode = `using System;

class Program
{
    static void Main(string[] args)
    {
        // Calling a method with parameters
        int sum = Add(5, 10);
        Console.WriteLine($"Sum: {sum}");
        
        // Another example with string parameters
        string message = Greet("John", "Smith");
        Console.WriteLine(message);
        
        Console.ReadKey();
    }
    
    // Method with parameters that returns a value
    static int Add(int a, int b)
    {
        return a + b;
    }
    
    // Method with parameters that returns a string
    static string Greet(string firstName, string lastName)
    {
        return $"Hello, {firstName} {lastName}!";
    }
}`;

const parameterTypesCode = `using System;

class Program
{
    static void Main(string[] args)
    {
        // Value parameters
        int number = 5;
        ModifyValue(number);
        Console.WriteLine($"After ModifyValue: {number}"); // Still 5
        
        // Reference parameters
        int refNumber = 5;
        ModifyRef(ref refNumber);
        Console.WriteLine($"After ModifyRef: {refNumber}"); // Now 10
        
        // Out parameters
        int result;
        bool success = TryParse("123", out result);
        Console.WriteLine($"Parsing success: {success}, Result: {result}");
        
        // Optional parameters
        DisplayInfo("John"); // Uses default value
        DisplayInfo("Jane", 30); // Provides both values
        
        // Named parameters
        CalculateArea(height: 5, width: 10); // Order doesn't matter with named parameters
    }
    
    // Value parameter example
    static void ModifyValue(int x)
    {
        x = x * 2; // Only changes local copy
    }
    
    // Reference parameter example
    static void ModifyRef(ref int x)
    {
        x = x * 2; // Changes original variable
    }
    
    // Out parameter example
    static bool TryParse(string input, out int result)
    {
        try
        {
            result = int.Parse(input);
            return true;
        }
        catch
        {
            result = 0;
            return false;
        }
    }
    
    // Optional parameter example
    static void DisplayInfo(string name, int age = 25)
    {
        Console.WriteLine($"Name: {name}, Age: {age}");
    }
    
    // Named parameter example
    static void CalculateArea(int width, int height)
    {
        int area = width * height;
        Console.WriteLine($"Area: {area}");
    }
}`;

const returnTypesCode = `using System;

class Program
{
    static void Main(string[] args)
    {
        // Void return type
        PrintMessage("Hello, World!");
        
        // Value return type
        int result = Add(5, 10);
        Console.WriteLine($"Result: {result}");
        
        // Boolean return type
        bool isEven = IsEven(4);
        Console.WriteLine($"Is 4 even? {isEven}");
        
        // String return type
        string fullName = GetFullName("John", "Smith");
        Console.WriteLine(fullName);
        
        // Tuple return type (C# 7.0+)
        var person = GetPersonDetails("Jane", 30);
        Console.WriteLine($"Name: {person.name}, Age: {person.age}");
    }
    
    // Void return type (doesn't return a value)
    static void PrintMessage(string message)
    {
        Console.WriteLine(message);
    }
    
    // Integer return type
    static int Add(int a, int b)
    {
        return a + b;
    }
    
    // Boolean return type
    static bool IsEven(int number)
    {
        return number % 2 == 0;
    }
    
    // String return type
    static string GetFullName(string firstName, string lastName)
    {
        return $"{firstName} {lastName}";
    }
    
    // Tuple return type
    static (string name, int age) GetPersonDetails(string name, int age)
    {
        return (name, age);
    }
}`;

export default function ParametersPage() {
  return (
    <LessonLayout 
      title="Parameters and Return Values"
      level="beginner"
      sidebarItems={beginnerSidebarItems}
      prev={{ href: '/beginner/methods', title: 'Methods Basics' }}
      next={{ href: '/beginner/overloading', title: 'Method Overloading' }}
    >
      <h1>Parameters and Return Values in C#</h1>
      
      <p>
        Parameters and return values are essential components of methods in C#. They allow methods to 
        receive input data, process it, and then return results. This lesson explores how to work with 
        different types of parameters and return values in C# methods.
      </p>

      <h2>Basic Parameters and Return Values</h2>
      
      <p>
        In its simplest form, a method can accept parameters (input values) and return a value as a result.
        Let's look at some basic examples:
      </p>

      <CodeEditor 
        initialCode={basicParametersCode}
        title="Basic Parameters and Return Values"
        readOnly={true}
      />

      <h2>Parameter Types</h2>
      
      <p>
        C# supports several different types of parameters:
      </p>

      <ul>
        <li><strong>Value parameters</strong>: The default behavior, where methods receive a copy of the original value</li>
        <li><strong>Reference parameters</strong>: Using the <code>ref</code> keyword to modify the original variable</li>
        <li><strong>Output parameters</strong>: Using the <code>out</code> keyword to output values from a method</li>
        <li><strong>Optional parameters</strong>: Parameters with default values that can be omitted when calling the method</li>
        <li><strong>Named parameters</strong>: Specify parameters by name rather than position</li>
      </ul>

      <CodeEditor 
        initialCode={parameterTypesCode}
        title="Different Parameter Types"
        readOnly={true}
      />

      <h2>Return Types</h2>
      
      <p>
        Methods in C# can return various types of values, or no value at all (void).
        Here are examples of different return types:
      </p>

      <CodeEditor 
        initialCode={returnTypesCode}
        title="Different Return Types"
        readOnly={true}
      />

      <h2>Key Concepts</h2>
      
      <p>
        Here are the key concepts to remember about parameters and return values:
      </p>

      <ul>
        <li>Methods can have multiple parameters but only one return value (though it can be a complex type like a tuple)</li>
        <li>Use <code>ref</code> parameters when you need to modify the original variable</li>
        <li>Use <code>out</code> parameters when a method needs to return multiple values</li>
        <li>Optional parameters must be defined at the end of the parameter list</li>
        <li>Named parameters make method calls more readable, especially when a method has many parameters</li>
        <li>The <code>void</code> keyword indicates that a method doesn't return a value</li>
      </ul>

      <h2>Best Practices</h2>
      
      <ul>
        <li>Limit the number of parameters (3-4 maximum is a good rule of thumb)</li>
        <li>Use descriptive parameter names</li>
        <li>Consider using objects or structs to pass multiple related values instead of many parameters</li>
        <li>Avoid using <code>ref</code> and <code>out</code> parameters when possible, as they can make code harder to understand</li>
        <li>Provide a meaningful name for tuple members when returning multiple values</li>
      </ul>

      <div className="bg-csharp-blue-50 dark:bg-csharp-blue-900/20 p-4 rounded-lg mt-6">
        <h3 className="text-csharp-blue-700 dark:text-csharp-blue-400">Practice Exercise</h3>
        <p>
          Try creating a method that calculates a person's BMI (Body Mass Index) with height and weight parameters,
          and returns both the BMI value and a string indicating whether the person is underweight, normal, overweight,
          or obese. Use tuple return types for this exercise.
        </p>
      </div>

      <div className="mt-8">
        <p>
          In the next lesson, we'll explore method overloading, which allows you to define multiple methods
          with the same name but different parameters.
        </p>
      </div>
    </LessonLayout>
  );
} 
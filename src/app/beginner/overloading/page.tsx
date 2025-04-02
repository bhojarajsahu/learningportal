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
const overloadingBasicsCode = `using System;

class Program
{
    static void Main(string[] args)
    {
        // Using different overloads of the Add method
        int sum1 = Add(5, 10);
        Console.WriteLine($"Sum of two integers: {sum1}");
        
        int sum2 = Add(5, 10, 15);
        Console.WriteLine($"Sum of three integers: {sum2}");
        
        double sum3 = Add(5.5, 10.5);
        Console.WriteLine($"Sum of two doubles: {sum3}");
        
        string combinedString = Add("Hello, ", "World!");
        Console.WriteLine($"Combined string: {combinedString}");
        
        Console.ReadKey();
    }
    
    // Method overloads with different number of parameters
    static int Add(int a, int b)
    {
        return a + b;
    }
    
    static int Add(int a, int b, int c)
    {
        return a + b + c;
    }
    
    // Method overloads with different types of parameters
    static double Add(double a, double b)
    {
        return a + b;
    }
    
    static string Add(string a, string b)
    {
        return a + b;
    }
}`;

const constructorOverloadingCode = `using System;

class Person
{
    // Properties
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public int Age { get; set; }
    
    // Default constructor
    public Person()
    {
        FirstName = "Unknown";
        LastName = "Unknown";
        Age = 0;
    }
    
    // Constructor with name parameters
    public Person(string firstName, string lastName)
    {
        FirstName = firstName;
        LastName = lastName;
        Age = 0;
    }
    
    // Constructor with all parameters
    public Person(string firstName, string lastName, int age)
    {
        FirstName = firstName;
        LastName = lastName;
        Age = age;
    }
    
    // Method to display person info
    public void DisplayInfo()
    {
        Console.WriteLine($"Name: {FirstName} {LastName}, Age: {Age}");
    }
}

class Program
{
    static void Main(string[] args)
    {
        // Using different constructors
        Person person1 = new Person();
        Person person2 = new Person("John", "Smith");
        Person person3 = new Person("Jane", "Doe", 30);
        
        // Display information
        Console.WriteLine("Person 1:");
        person1.DisplayInfo();
        
        Console.WriteLine("\\nPerson 2:");
        person2.DisplayInfo();
        
        Console.WriteLine("\\nPerson 3:");
        person3.DisplayInfo();
        
        Console.ReadKey();
    }
}`;

const overloadResolutionCode = `using System;

class Program
{
    static void Main(string[] args)
    {
        // Example of method overload resolution
        DisplayValue(10);       // Calls DisplayValue(int)
        DisplayValue(10.5);     // Calls DisplayValue(double)
        DisplayValue("Hello");  // Calls DisplayValue(string)
        
        // This can be ambiguous in some cases
        ShowInfo(1, 2);         // Which method gets called?
        ShowInfo(1.0, 2);       // Calls ShowInfo(double, int)
        
        // The compiler chooses the best match
        Process(5);             // Calls Process(int)
        Process((short)5);      // Calls Process(short)
        Process((long)5);       // Calls Process(long)
        
        Console.ReadKey();
    }
    
    static void DisplayValue(int value)
    {
        Console.WriteLine($"Integer value: {value}");
    }
    
    static void DisplayValue(double value)
    {
        Console.WriteLine($"Double value: {value}");
    }
    
    static void DisplayValue(string value)
    {
        Console.WriteLine($"String value: {value}");
    }
    
    // Potential for ambiguity
    static void ShowInfo(int a, double b)
    {
        Console.WriteLine($"Method 1: {a}, {b}");
    }
    
    static void ShowInfo(double a, int b)
    {
        Console.WriteLine($"Method 2: {a}, {b}");
    }
    
    // Overloads with different numeric types
    static void Process(short value)
    {
        Console.WriteLine($"Processing short: {value}");
    }
    
    static void Process(int value)
    {
        Console.WriteLine($"Processing int: {value}");
    }
    
    static void Process(long value)
    {
        Console.WriteLine($"Processing long: {value}");
    }
}`;

export default function OverloadingPage() {
  return (
    <LessonLayout 
      title="Method Overloading"
      level="beginner"
      sidebarItems={beginnerSidebarItems}
      prev={{ href: '/beginner/parameters', title: 'Parameters and Return Values' }}
      next={{ href: '/intermediate', title: 'Intermediate C# Programming' }}
    >
      <h1>Method Overloading in C#</h1>
      
      <p>
        Method overloading is a powerful feature in C# that allows you to define multiple methods with the same name 
        but different parameters. This enables you to provide different implementations of a method based on the types 
        and number of arguments passed to it.
      </p>

      <h2>What is Method Overloading?</h2>
      
      <p>
        Method overloading occurs when a class has multiple methods with the same name but different parameter lists. 
        The compiler determines which method to call based on the arguments passed when the method is invoked.
      </p>

      <p>
        Methods can be overloaded based on:
      </p>

      <ul>
        <li>The number of parameters</li>
        <li>The types of parameters</li>
        <li>The order of parameters</li>
      </ul>

      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg my-4">
        <p className="font-semibold">Note:</p>
        <p>
          Methods cannot be overloaded based on return type alone. The parameter list must be different
          for overloading to work.
        </p>
      </div>

      <h2>Basic Method Overloading</h2>
      
      <p>
        Let's look at examples of how to overload methods in C#:
      </p>

      <CodeEditor 
        initialCode={overloadingBasicsCode}
        title="Basic Method Overloading"
        readOnly={true}
      />

      <p>
        In this example, we've created four different versions of the <code>Add</code> method:
      </p>

      <ul>
        <li>One that adds two integers</li>
        <li>One that adds three integers</li>
        <li>One that adds two doubles</li>
        <li>One that concatenates two strings</li>
      </ul>

      <p>
        The compiler automatically selects the appropriate method based on the arguments provided.
      </p>

      <h2>Constructor Overloading</h2>
      
      <p>
        Constructors can also be overloaded, allowing objects to be initialized in different ways:
      </p>

      <CodeEditor 
        initialCode={constructorOverloadingCode}
        title="Constructor Overloading"
        readOnly={true}
      />

      <p>
        This is particularly useful for creating flexible classes that can be instantiated with different
        sets of initial values.
      </p>

      <h2>Method Overload Resolution</h2>
      
      <p>
        When you call an overloaded method, the C# compiler determines which method to invoke based on a set of rules. 
        This process is called "overload resolution."
      </p>

      <CodeEditor 
        initialCode={overloadResolutionCode}
        title="Method Overload Resolution"
        readOnly={true}
      />

      <h2>Benefits of Method Overloading</h2>
      
      <ul>
        <li><strong>Improved readability</strong>: Using the same name for related operations makes code more intuitive</li>
        <li><strong>Flexibility</strong>: Allows clients to call a method in a way that's most convenient for them</li>
        <li><strong>Simplicity</strong>: Avoids having to remember multiple method names for similar operations</li>
      </ul>

      <h2>Best Practices</h2>
      
      <ul>
        <li>Only overload methods when the operations are conceptually the same but take different forms of input</li>
        <li>Ensure that overloaded methods behave consistently with each other</li>
        <li>Avoid ambiguous overloads that could confuse the compiler or other developers</li>
        <li>Consider using optional parameters instead of overloads when appropriate</li>
      </ul>

      <div className="bg-csharp-blue-50 dark:bg-csharp-blue-900/20 p-4 rounded-lg mt-6">
        <h3 className="text-csharp-blue-700 dark:text-csharp-blue-400">Practice Exercise</h3>
        <p>
          Create a <code>Calculator</code> class with overloaded methods for calculating areas of different shapes:
        </p>
        <ul>
          <li><code>CalculateArea(double radius)</code> for circles</li>
          <li><code>CalculateArea(double length, double width)</code> for rectangles</li>
          <li><code>CalculateArea(double baseLength, double height, string shape)</code> for triangles and other shapes</li>
        </ul>
      </div>

      <div className="mt-8">
        <p>
          Congratulations! You've completed the beginner section of our C# learning path. 
          You now understand the fundamentals of C# programming, including variables, control structures, 
          and methods.
        </p>
        <p>
          Next, you can move on to the <a href="/intermediate" className="text-csharp-blue-600 dark:text-csharp-blue-400 hover:underline">Intermediate section</a>,
          where you'll learn about more advanced concepts like object-oriented programming, exception handling, 
          and working with collections.
        </p>
      </div>
    </LessonLayout>
  );
} 
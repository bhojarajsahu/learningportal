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

const typeConversionExample = `using System;

class Program
{
    static void Main(string[] args)
    {
        // Implicit Conversion (Widening)
        int myInt = 9;
        double myDouble = myInt;  // Automatic conversion from int to double
        Console.WriteLine($"Int to Double: {myDouble}");  // 9.0
        
        // Explicit Conversion (Narrowing)
        double myDouble2 = 9.78;
        int myInt2 = (int)myDouble2;  // Manual conversion from double to int
        Console.WriteLine($"Double to Int: {myInt2}");  // 9
        
        // String to Number Conversion
        string numberString = "123";
        int number = int.Parse(numberString);  // Using Parse
        Console.WriteLine($"String to Int: {number}");
        
        // Number to String Conversion
        int num = 42;
        string numString = num.ToString();  // Using ToString()
        Console.WriteLine($"Int to String: {numString}");
        
        // TryParse Example (Safe conversion)
        string invalidNumber = "abc";
        int result;
        bool success = int.TryParse(invalidNumber, out result);
        Console.WriteLine($"TryParse success: {success}");  // false
        
        // Convert Class Example
        string strNumber = "456";
        int convertedNumber = Convert.ToInt32(strNumber);
        Console.WriteLine($"Convert.ToInt32: {convertedNumber}");
        
        // Boxing and Unboxing
        int value = 42;
        object boxed = value;  // Boxing
        int unboxed = (int)boxed;  // Unboxing
        Console.WriteLine($"Boxed value: {boxed}");
        Console.WriteLine($"Unboxed value: {unboxed}");
    }
}`;

const conversionTable = `| From Type | To Type | Method | Example |
|-----------|---------|---------|---------|
| int       | double  | Implicit | double d = 42; |
| double    | int     | Cast | int i = (int)42.5; |
| string    | int     | Parse | int i = int.Parse("42"); |
| string    | int     | TryParse | int.TryParse("42", out int i); |
| int       | string  | ToString | string s = 42.ToString(); |
| object    | int     | Cast | int i = (int)obj; |
| decimal   | double  | Cast | double d = (double)42.5m; |`;

export default function TypeConversionPage() {
  return (
    <LessonLayout
      title="Type Conversion in C#"
      level="beginner"
      sidebarItems={beginnerSidebarItems}
      prev={{ href: '/beginner/operators', title: 'Operators' }}
      next={{ href: '/beginner/if-statements', title: 'If Statements' }}
    >
      <div className="prose max-w-none">
        <h1>Type Conversion in C#</h1>
        <p>
          Type conversion is the process of converting a value from one data type to another.
          C# provides both implicit and explicit conversion methods.
        </p>

        <h2>Types of Conversion</h2>
        <ul>
          <li><strong>Implicit Conversion:</strong> Automatically converts smaller types to larger types</li>
          <li><strong>Explicit Conversion:</strong> Manual conversion that might result in data loss</li>
          <li><strong>String Conversion:</strong> Converting between strings and other types</li>
          <li><strong>Boxing/Unboxing:</strong> Converting between value types and reference types</li>
        </ul>

        <h2>Example Program</h2>
        <p>
          Here's a program demonstrating various type conversion methods:
        </p>

        <div className="my-4">
          <CodeEditor
            initialCode={typeConversionExample}
            language="csharp"
            readOnly={true}
            title="Type Conversion Example"
          />
        </div>

        <h2>Common Conversion Methods</h2>
        <div className="my-4">
          <CodeEditor
            initialCode={conversionTable}
            language="text"
            readOnly={true}
            title="Conversion Methods"
          />
        </div>

        <h2>Conversion Methods</h2>
        <h3>Parse and TryParse</h3>
        <ul>
          <li><code>Parse()</code>: Converts string to number (throws exception if invalid)</li>
          <li><code>TryParse()</code>: Safely converts string to number (returns bool indicating success)</li>
        </ul>

        <h3>Convert Class</h3>
        <p>
          The <code>Convert</code> class provides methods for converting between different types:
        </p>
        <ul>
          <li><code>Convert.ToInt32()</code></li>
          <li><code>Convert.ToDouble()</code></li>
          <li><code>Convert.ToString()</code></li>
          <li><code>Convert.ToBoolean()</code></li>
        </ul>

        <h2>Best Practices</h2>
        <ul>
          <li>Use implicit conversion when possible (no data loss)</li>
          <li>Use explicit conversion when necessary (be aware of potential data loss)</li>
          <li>Use TryParse instead of Parse for safer string-to-number conversion</li>
          <li>Check for null before conversion when working with nullable types</li>
          <li>Use appropriate conversion method based on the data type</li>
        </ul>

        <h2>Common Pitfalls</h2>
        <ul>
          <li>Data loss in narrowing conversions</li>
          <li>Overflow in numeric conversions</li>
          <li>Format exceptions in string parsing</li>
          <li>Null reference exceptions in boxing/unboxing</li>
        </ul>

        <h2>Next Steps</h2>
        <p>
          In the next lesson, we'll learn about control structures in C#,
          starting with if statements for making decisions in our programs.
        </p>
      </div>
    </LessonLayout>
  );
} 
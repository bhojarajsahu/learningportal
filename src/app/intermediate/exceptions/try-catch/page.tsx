import React from 'react';
import { FiBook, FiCode, FiGitBranch, FiPackage, FiServer, FiDatabase } from 'react-icons/fi';
import LessonLayout from '@/components/LessonLayout';
import CodeEditor from '@/components/CodeEditor';

const sidebarItems = [
  {
    title: 'Exception Handling',
    href: '/intermediate/exceptions',
    icon: <FiGitBranch className="w-4 h-4" />,
    children: [
      { title: 'Try-Catch Blocks', href: '/intermediate/exceptions/try-catch' },
      { title: 'Custom Exceptions', href: '/intermediate/exceptions/custom' },
      { title: 'Exception Best Practices', href: '/intermediate/exceptions/best-practices' },
    ]
  },
];

const basicTryCatchCode = `using System;

class Program
{
    static void Main(string[] args)
    {
        try
        {
            // Code that might throw an exception
            Console.Write("Enter a number: ");
            string input = Console.ReadLine();
            int number = int.Parse(input);
            Console.WriteLine($"You entered: {number}");
        }
        catch (Exception ex)
        {
            // Handle the exception
            Console.WriteLine("An error occurred!");
            Console.WriteLine($"Error message: {ex.Message}");
        }
        
        Console.WriteLine("Program continues execution...");
        Console.ReadKey();
    }
}`;

const specificExceptionsCode = `using System;
using System.IO;

class Program
{
    static void Main(string[] args)
    {
        try
        {
            // Code that might throw an exception
            Console.Write("Enter a number: ");
            string input = Console.ReadLine();
            int number = int.Parse(input);
            
            // File operation that might throw an exception
            string content = File.ReadAllText("nonexistent.txt");
            Console.WriteLine(content);
        }
        catch (FormatException ex)
        {
            // Handle format exceptions (e.g., invalid number format)
            Console.WriteLine("You entered an invalid number format!");
            Console.WriteLine($"Error details: {ex.Message}");
        }
        catch (FileNotFoundException ex)
        {
            // Handle file not found exceptions
            Console.WriteLine("The requested file was not found!");
            Console.WriteLine($"Error details: {ex.Message}");
        }
        catch (Exception ex)
        {
            // Handle any other exceptions
            Console.WriteLine("An unexpected error occurred!");
            Console.WriteLine($"Error details: {ex.Message}");
        }
        
        Console.WriteLine("Program continues execution...");
        Console.ReadKey();
    }
}`;

const finallyBlockCode = `using System;
using System.IO;

class Program
{
    static void Main(string[] args)
    {
        StreamReader reader = null;
        
        try
        {
            // Attempt to open and read a file
            reader = new StreamReader("example.txt");
            string content = reader.ReadToEnd();
            Console.WriteLine(content);
        }
        catch (FileNotFoundException ex)
        {
            Console.WriteLine("The file was not found!");
            Console.WriteLine($"Error details: {ex.Message}");
        }
        catch (Exception ex)
        {
            Console.WriteLine("An error occurred while reading the file!");
            Console.WriteLine($"Error details: {ex.Message}");
        }
        finally
        {
            // This code always executes, regardless of whether an exception occurred
            if (reader != null)
            {
                reader.Close();
                Console.WriteLine("StreamReader closed successfully.");
            }
        }
        
        Console.WriteLine("Program continues execution...");
        Console.ReadKey();
    }
}`;

const usingStatementCode = `using System;
using System.IO;

class Program
{
    static void Main(string[] args)
    {
        try
        {
            // Using statement automatically handles resource disposal
            using (StreamReader reader = new StreamReader("example.txt"))
            {
                string content = reader.ReadToEnd();
                Console.WriteLine(content);
            } // reader.Dispose() is automatically called here
            
            // C# 8.0+ simplified using statement
            using var writer = new StreamWriter("output.txt");
            writer.WriteLine("Hello, World!");
            // writer.Dispose() is called at the end of the current scope
        }
        catch (Exception ex)
        {
            Console.WriteLine("An error occurred!");
            Console.WriteLine($"Error details: {ex.Message}");
        }
        
        Console.WriteLine("Program continues execution...");
        Console.ReadKey();
    }
}`;

const exceptionPropertiesCode = `using System;

class Program
{
    static void Main(string[] args)
    {
        try
        {
            // Generate a division by zero exception
            int result = Divide(10, 0);
        }
        catch (Exception ex)
        {
            // Access various exception properties
            Console.WriteLine($"Message: {ex.Message}");
            Console.WriteLine($"Source: {ex.Source}");
            Console.WriteLine($"StackTrace: {ex.StackTrace}");
            Console.WriteLine($"TargetSite: {ex.TargetSite}");
            
            // Check for inner exception
            if (ex.InnerException != null)
            {
                Console.WriteLine($"Inner Exception: {ex.InnerException.Message}");
            }
        }
        
        Console.ReadKey();
    }
    
    static int Divide(int a, int b)
    {
        return a / b; // This will throw DivideByZeroException when b is 0
    }
}`;

export default function TryCatchPage() {
  return (
    <LessonLayout 
      title="Try-Catch Blocks"
      level="intermediate"
      sidebarItems={sidebarItems}
      next={{ href: '/intermediate/exceptions/custom', title: 'Custom Exceptions' }}
    >
      <div className="prose dark:prose-invert max-w-none">
        <h1>Exception Handling with Try-Catch Blocks in C#</h1>
        
        <p>
          Exception handling is a crucial aspect of writing robust C# applications. It allows your programs 
          to gracefully handle errors and unexpected situations that occur during execution, rather than 
          crashing abruptly. The primary mechanism for exception handling in C# is the try-catch block.
        </p>

        <h2>Basic Try-Catch Structure</h2>
        
        <p>
          A basic try-catch block consists of a <code>try</code> block that contains code that might throw 
          exceptions, followed by one or more <code>catch</code> blocks that handle those exceptions:
        </p>

        <CodeEditor 
          initialCode={basicTryCatchCode}
          language="csharp"
          readOnly={true}
        />

        <p>
          In this example, if the user enters something that can't be parsed as an integer (like "abc"), 
          a <code>FormatException</code> will be thrown. Instead of crashing, the program catches the exception 
          and displays an error message, then continues execution.
        </p>

        <h2>Handling Specific Exceptions</h2>
        
        <p>
          You can have multiple <code>catch</code> blocks to handle different types of exceptions differently. 
          The more specific exception types should come before more general ones:
        </p>

        <CodeEditor 
          initialCode={specificExceptionsCode}
          language="csharp"
          readOnly={true}
        />

        <p>
          This approach allows you to provide specific error messages and handling logic for different 
          types of exceptions. The <code>Exception</code> catch block at the end acts as a fallback for 
          any exceptions not explicitly handled above.
        </p>

        <h2>The Finally Block</h2>
        
        <p>
          The <code>finally</code> block contains code that always executes, regardless of whether an 
          exception occurred or was caught. It's typically used for cleanup operations, such as closing 
          files or releasing resources:
        </p>

        <CodeEditor 
          initialCode={finallyBlockCode}
          language="csharp"
          readOnly={true}
        />

        <p>
          The <code>finally</code> block ensures that resources are properly cleaned up, even if an 
          exception occurs. This helps prevent resource leaks in your application.
        </p>

        <h2>Using Statement</h2>
        
        <p>
          For objects that implement <code>IDisposable</code>, C# provides the <code>using</code> statement 
          as a cleaner alternative to try-finally blocks for resource management:
        </p>

        <CodeEditor 
          initialCode={usingStatementCode}
          language="csharp"
          readOnly={true}
        />

        <p>
          The <code>using</code> statement automatically calls the <code>Dispose()</code> method on the 
          resource when execution leaves the scope, ensuring proper cleanup even if an exception occurs.
        </p>

        <h2>Exception Properties</h2>
        
        <p>
          Exception objects provide various properties that can help with debugging and error reporting:
        </p>

        <CodeEditor 
          initialCode={exceptionPropertiesCode}
          language="csharp"
          readOnly={true}
        />

        <h2>Best Practices</h2>
        
        <ul>
          <li>Only catch exceptions you can handle effectively</li>
          <li>Catch specific exception types rather than just <code>Exception</code></li>
          <li>Maintain the original exception information when re-throwing or logging</li>
          <li>Use <code>finally</code> or <code>using</code> statements to ensure resources are properly released</li>
          <li>Don't use exceptions for normal program flow control</li>
        </ul>

        <div className="bg-csharp-blue-50 dark:bg-csharp-blue-900/20 p-4 rounded-lg mt-6">
          <h3 className="text-csharp-blue-700 dark:text-csharp-blue-400">Practice Exercise</h3>
          <p>
            Create a simple calculator program that takes two numbers and an operation (+, -, *, /) as input. 
            Use exception handling to handle potential errors such as:
          </p>
          <ul>
            <li>Invalid number formats</li>
            <li>Division by zero</li>
            <li>Unsupported operations</li>
          </ul>
        </div>

        <div className="mt-8">
          <p>
            In the next lesson, we'll explore how to create custom exception types for more specific error 
            handling in your applications.
          </p>
        </div>
      </div>
    </LessonLayout>
  );
} 
import React from 'react';
import { FiClock, FiCode, FiGitBranch, FiPackage, FiServer } from 'react-icons/fi';
import LessonLayout from '@/components/LessonLayout';
import CodeEditor from '@/components/CodeEditor';
import { SidebarItem } from '@/types/sidebar';

const sidebarItems: SidebarItem[] = [
  {
    title: 'Asynchronous Programming',
    href: '/advanced/async',
    icon: <FiClock />,
    children: [
      { title: 'Async/Await Basics', href: '/advanced/async/basics', icon: <FiCode /> },
      { title: 'Task Parallel Library', href: '/advanced/async/tpl', icon: <FiGitBranch /> },
      { title: 'Async Streams', href: '/advanced/async/streams', icon: <FiPackage /> },
      { title: 'Async Patterns', href: '/advanced/async/patterns', icon: <FiServer /> },
    ],
  },
];

const asyncExampleCode = `public class AsyncExample
{
    // Synchronous method
    public int CalculateSum(int[] numbers)
    {
        return numbers.Sum();
    }

    // Asynchronous method
    public async Task<int> CalculateSumAsync(int[] numbers)
    {
        return await Task.Run(() => numbers.Sum());
    }

    // Async method with multiple operations
    public async Task<Dictionary<string, int>> ProcessDataAsync()
    {
        var result = new Dictionary<string, int>();

        // Simulate multiple async operations
        var task1 = Task.Run(() => CalculateSum(new[] { 1, 2, 3, 4, 5 }));
        var task2 = Task.Run(() => CalculateSum(new[] { 6, 7, 8, 9, 10 }));
        var task3 = Task.Run(() => CalculateSum(new[] { 11, 12, 13, 14, 15 }));

        // Wait for all tasks to complete
        await Task.WhenAll(task1, task2, task3);

        result["first"] = task1.Result;
        result["second"] = task2.Result;
        result["third"] = task3.Result;

        return result;
    }

    // Async method with error handling
    public async Task<string> FetchDataAsync(string url)
    {
        try
        {
            using (var client = new HttpClient())
            {
                return await client.GetStringAsync(url);
            }
        }
        catch (HttpRequestException ex)
        {
            // Log the error
            Console.WriteLine($"Error fetching data: {ex.Message}");
            throw; // Re-throw the exception
        }
    }
}`;

const conceptMapNodes = [
  { id: 'async', label: 'Async/Await', type: 'concept' },
  { id: 'task', label: 'Task', type: 'component' },
  { id: 'await', label: 'Await', type: 'keyword' },
  { id: 'parallel', label: 'Parallel Processing', type: 'concept' },
  { id: 'error', label: 'Error Handling', type: 'concept' },
];

const conceptMapLinks = [
  { source: 'async', target: 'task', label: 'returns' },
  { source: 'async', target: 'await', label: 'uses' },
  { source: 'async', target: 'parallel', label: 'enables' },
  { source: 'async', target: 'error', label: 'requires' },
];

export default function AsyncBasicsPage() {
  return (
    <LessonLayout
      level="advanced"
      title="Async/Await Basics"
      sidebarItems={sidebarItems}
    >
      <div className="prose max-w-none">
        <h1>Async/Await in C#</h1>
        <p>
          Asynchronous programming in C# allows you to write non-blocking code that can handle multiple operations concurrently.
          The async/await pattern makes it easy to write and understand asynchronous code.
        </p>

        <h2>What is Async/Await?</h2>
        <p>
          Async/await is a language feature that allows you to write asynchronous code in a synchronous style.
          It helps you write code that can perform long-running operations without blocking the main thread.
        </p>

        <h2>Basic Example</h2>
        <p>
          Here's a simple example of an async method:
        </p>

        <div className="my-4">
          <CodeEditor
            initialCode={asyncExampleCode}
            language="csharp"
            readOnly={true}
          />
        </div>

        <h2>Using Async Methods</h2>
        <p>
          Here's how you would use these async methods:
        </p>

        <div className="my-4">
          <CodeEditor
            initialCode={`// Create an instance
var example = new AsyncExample();

// Simple async operation
int sum = await example.CalculateSumAsync(new[] { 1, 2, 3, 4, 5 });
Console.WriteLine($"Sum: {sum}");

// Multiple async operations
var results = await example.ProcessDataAsync();
Console.WriteLine($"First sum: {results["first"]}");
Console.WriteLine($"Second sum: {results["second"]}");
Console.WriteLine($"Third sum: {results["third"]}");

// Async operation with error handling
try
{
    string data = await example.FetchDataAsync("https://api.example.com/data");
    Console.WriteLine($"Fetched data: {data}");
}
catch (Exception ex)
{
    Console.WriteLine($"Error: {ex.Message}");
}`}
            language="csharp"
            readOnly={true}
          />
        </div>

        <h2>Key Components</h2>
        <ul>
          <li><strong>async keyword:</strong> Marks a method as asynchronous</li>
          <li><strong>await keyword:</strong> Pauses execution until an async operation completes</li>
          <li><strong>Task:</strong> Represents an asynchronous operation</li>
          <li><strong>Task&lt;T&gt;:</strong> Represents an asynchronous operation that returns a value</li>
        </ul>

        <h2>Using Async Methods</h2>
        <p>
          Here's how you would use these async methods:
        </p>

        <div className="my-4">
          <CodeEditor
            initialCode={`// Create an instance
var example = new AsyncExample();

// Simple async operation
int sum = await example.CalculateSumAsync(new[] { 1, 2, 3, 4, 5 });
Console.WriteLine($"Sum: {sum}");

// Multiple async operations
var results = await example.ProcessDataAsync();
Console.WriteLine($"First sum: {results["first"]}");
Console.WriteLine($"Second sum: {results["second"]}");
Console.WriteLine($"Third sum: {results["third"]}");

// Async operation with error handling
try
{
    string data = await example.FetchDataAsync("https://api.example.com/data");
    Console.WriteLine($"Fetched data: {data}");
}
catch (Exception ex)
{
    Console.WriteLine($"Error: {ex.Message}");
}`}
            language="csharp"
            readOnly={true}
          />
        </div>

        <h2>Error Handling in Async Code</h2>
        <p>
          Here's how to properly handle errors in async methods:
        </p>

        <div className="my-4">
          <CodeEditor
            initialCode={`public async Task<string> FetchDataWithErrorHandlingAsync()
{
    try
    {
        using (var client = new HttpClient())
        {
            return await client.GetStringAsync("https://api.example.com/data");
        }
    }
    catch (HttpRequestException ex)
    {
        // Handle specific HTTP errors
        Console.WriteLine($"HTTP Error: {ex.Message}");
        return null;
    }
    catch (Exception ex)
    {
        // Handle other errors
        Console.WriteLine($"Error: {ex.Message}");
        throw; // Re-throw to let caller handle
    }
}`}
            language="csharp"
            readOnly={true}
          />
        </div>

        <h2>Key Concepts</h2>
        <ul>
          <li><strong>Non-blocking:</strong> Async operations don't block the main thread</li>
          <li><strong>Task-based:</strong> All async operations return a Task or Task&lt;T&gt;</li>
          <li><strong>Exception Handling:</strong> Use try-catch blocks with async methods</li>
          <li><strong>Parallel Operations:</strong> Run multiple async operations concurrently</li>
        </ul>

        <h2>Best Practices</h2>
        <ul>
          <li>Always use async/await together - don't mix with .Result or .Wait()</li>
          <li>Use async void only for event handlers</li>
          <li>Return Task or Task&lt;T&gt; for all other async methods</li>
          <li>Use ConfigureAwait(false) in library code</li>
          <li>Handle exceptions appropriately in async methods</li>
        </ul>
      </div>
    </LessonLayout>
  );
} 
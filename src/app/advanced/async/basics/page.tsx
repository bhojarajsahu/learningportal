import React from 'react';
import { FiZap, FiCpu, FiActivity, FiCheckSquare } from 'react-icons/fi';
import LessonLayout from '@/components/LessonLayout';
import CodeEditor from '@/components/CodeEditor';

const sidebarItems = [
  {
    title: 'Asynchronous Programming',
    href: '/advanced/async',
    icon: <FiZap className="w-4 h-4" />,
    children: [
      { title: 'Async/Await Fundamentals', href: '/advanced/async/basics' },
      { title: 'Task Parallel Library', href: '/advanced/async/tpl' },
      { title: 'Async Streams', href: '/advanced/async/streams' },
      { title: 'Async Best Practices', href: '/advanced/async/best-practices' },
    ]
  },
];

const synchronousCode = `using System;
using System.Net.Http;
using System.Threading;

class Program
{
    static void Main(string[] args)
    {
        Console.WriteLine("Starting application...");
        
        // Synchronous method calls
        string data = DownloadData("https://example.com");
        Console.WriteLine("Downloaded: " + data.Substring(0, 50) + "...");
        
        string processedData = ProcessData(data);
        Console.WriteLine("Processed: " + processedData.Substring(0, 50) + "...");
        
        SaveData(processedData);
        Console.WriteLine("Data saved successfully!");
        
        Console.WriteLine("Application completed!");
        Console.ReadKey();
    }
    
    static string DownloadData(string url)
    {
        Console.WriteLine("Downloading data...");
        
        // Simulate a time-consuming operation
        using (HttpClient client = new HttpClient())
        {
            // This is a blocking call - the thread waits here
            string result = client.GetStringAsync(url).Result;
            return result;
        }
    }
    
    static string ProcessData(string data)
    {
        Console.WriteLine("Processing data...");
        
        // Simulate CPU-bound work
        Thread.Sleep(2000); // Pretend this is actual processing
        
        return "Processed: " + data;
    }
    
    static void SaveData(string data)
    {
        Console.WriteLine("Saving data...");
        
        // Simulate saving to database or file
        Thread.Sleep(1000); // Pretend this is disk I/O
    }
}`;

const asyncAwaitCode = `using System;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;

class Program
{
    static async Task Main(string[] args)
    {
        Console.WriteLine("Starting application...");
        
        // Asynchronous method calls with await
        string data = await DownloadDataAsync("https://example.com");
        Console.WriteLine("Downloaded: " + data.Substring(0, 50) + "...");
        
        string processedData = await ProcessDataAsync(data);
        Console.WriteLine("Processed: " + processedData.Substring(0, 50) + "...");
        
        await SaveDataAsync(processedData);
        Console.WriteLine("Data saved successfully!");
        
        Console.WriteLine("Application completed!");
        Console.ReadKey();
    }
    
    static async Task<string> DownloadDataAsync(string url)
    {
        Console.WriteLine("Downloading data...");
        
        // Non-blocking asynchronous call
        using (HttpClient client = new HttpClient())
        {
            string result = await client.GetStringAsync(url);
            return result;
        }
    }
    
    static async Task<string> ProcessDataAsync(string data)
    {
        Console.WriteLine("Processing data...");
        
        // Simulate CPU-bound work on a background thread
        return await Task.Run(() => {
            Thread.Sleep(2000); // Pretend this is actual processing
            return "Processed: " + data;
        });
    }
    
    static async Task SaveDataAsync(string data)
    {
        Console.WriteLine("Saving data...");
        
        // Simulate saving to database or file
        await Task.Delay(1000); // Asynchronous equivalent of Thread.Sleep
    }
}`;

const asyncPatternCode = `using System;
using System.IO;
using System.Net.Http;
using System.Threading.Tasks;

class Program
{
    static async Task Main(string[] args)
    {
        Console.WriteLine("Demonstrating async pattern examples...");
        
        // Example 1: Sequential async operations
        await Example1_SequentialAsync();
        
        // Example 2: Parallel async operations
        await Example2_ParallelAsync();
        
        // Example 3: Exception handling
        await Example3_ExceptionHandlingAsync();
        
        // Example 4: Cancellation
        await Example4_CancellationAsync();
        
        Console.WriteLine("All examples completed!");
        Console.ReadKey();
    }
    
    static async Task Example1_SequentialAsync()
    {
        Console.WriteLine("\\nExample 1: Sequential async operations");
        
        // These operations happen one after another
        string text = await ReadFileAsync("example.txt");
        await Task.Delay(500); // Simulate some processing
        await WriteFileAsync("output.txt", text.ToUpper());
        
        Console.WriteLine("Sequential operations completed!");
    }
    
    static async Task Example2_ParallelAsync()
    {
        Console.WriteLine("\\nExample 2: Parallel async operations");
        
        // Start multiple operations at once
        Task<string> webTask = DownloadStringAsync("https://example.com");
        Task<string> fileTask = ReadFileAsync("example.txt");
        
        // Wait for both tasks to complete
        await Task.WhenAll(webTask, fileTask);
        
        // Now we can safely access the results
        Console.WriteLine($"Downloaded {webTask.Result.Length} bytes");
        Console.WriteLine($"Read {fileTask.Result.Length} bytes from file");
        
        Console.WriteLine("Parallel operations completed!");
    }
    
    static async Task Example3_ExceptionHandlingAsync()
    {
        Console.WriteLine("\\nExample 3: Exception handling");
        
        try
        {
            // This will throw an exception
            string result = await DownloadStringAsync("https://invalid-url");
        }
        catch (HttpRequestException ex)
        {
            Console.WriteLine($"Caught exception: {ex.Message}");
        }
        
        Console.WriteLine("Exception handling completed!");
    }
    
    static async Task Example4_CancellationAsync()
    {
        Console.WriteLine("\\nExample 4: Cancellation");
        
        using (var cts = new System.Threading.CancellationTokenSource())
        {
            // Set a timeout
            cts.CancelAfter(1000);
            
            try
            {
                // This operation would take 5 seconds but will be cancelled
                await LongRunningOperationAsync(cts.Token);
            }
            catch (TaskCanceledException)
            {
                Console.WriteLine("Operation was cancelled as expected");
            }
        }
        
        Console.WriteLine("Cancellation example completed!");
    }
    
    // Helper methods
    static async Task<string> ReadFileAsync(string path)
    {
        Console.WriteLine($"Reading file {path}...");
        
        // Simulate file reading
        await Task.Delay(1000);
        return $"Content of {path}";
    }
    
    static async Task WriteFileAsync(string path, string content)
    {
        Console.WriteLine($"Writing to file {path}...");
        
        // Simulate file writing
        await Task.Delay(1000);
        Console.WriteLine($"Wrote {content.Length} bytes to {path}");
    }
    
    static async Task<string> DownloadStringAsync(string url)
    {
        Console.WriteLine($"Downloading from {url}...");
        
        using (HttpClient client = new HttpClient())
        {
            return await client.GetStringAsync(url);
        }
    }
    
    static async Task LongRunningOperationAsync(System.Threading.CancellationToken token)
    {
        Console.WriteLine("Starting long operation...");
        
        for (int i = 0; i < 5; i++)
        {
            // Check for cancellation before each step
            token.ThrowIfCancellationRequested();
            
            Console.WriteLine($"Operation step {i + 1}/5...");
            await Task.Delay(1000, token);
        }
        
        Console.WriteLine("Long operation completed!");
    }
}`;

const taskCompletionSourceCode = `using System;
using System.Threading;
using System.Threading.Tasks;

class Program
{
    static async Task Main(string[] args)
    {
        Console.WriteLine("Demonstrating TaskCompletionSource...");
        
        // Example 1: Basic TCS usage
        Task<string> resultTask = GetResultAsync();
        string result = await resultTask;
        Console.WriteLine($"Result: {result}");
        
        // Example 2: Converting callback-based API to async/await
        Task<int> dataTask = GetDataFromCallbackBasedApiAsync();
        int data = await dataTask;
        Console.WriteLine($"Data from callback API: {data}");
        
        // Example 3: Adding timeout to an operation
        try
        {
            string resultWithTimeout = await GetResultWithTimeoutAsync(1500);
            Console.WriteLine($"Result with timeout: {resultWithTimeout}");
        }
        catch (TimeoutException)
        {
            Console.WriteLine("Operation timed out as expected");
        }
        
        Console.WriteLine("All examples completed!");
        Console.ReadKey();
    }
    
    // Example 1: Basic TaskCompletionSource usage
    static Task<string> GetResultAsync()
    {
        var tcs = new TaskCompletionSource<string>();
        
        // Simulate work on a background thread
        ThreadPool.QueueUserWorkItem(_ =>
        {
            try
            {
                Console.WriteLine("Working on background thread...");
                Thread.Sleep(1000); // Simulate work
                
                // Set the result - this completes the task
                tcs.SetResult("Task completed successfully!");
            }
            catch (Exception ex)
            {
                // If an exception occurs, propagate it to the task
                tcs.SetException(ex);
            }
        });
        
        // Return the task immediately, while work continues on background thread
        return tcs.Task;
    }
    
    // Example 2: Converting callback-based API to async/await
    static Task<int> GetDataFromCallbackBasedApiAsync()
    {
        var tcs = new TaskCompletionSource<int>();
        
        // Simulate a callback-based API
        LegacyApiWithCallback(
            result => tcs.SetResult(result),  // Success callback
            error => tcs.SetException(new Exception(error))  // Error callback
        );
        
        return tcs.Task;
    }
    
    // Simulate a legacy API that uses callbacks
    static void LegacyApiWithCallback(Action<int> onSuccess, Action<string> onError)
    {
        ThreadPool.QueueUserWorkItem(_ =>
        {
            Console.WriteLine("Legacy API processing...");
            Thread.Sleep(1000);
            
            // Simulate successful completion
            if (DateTime.Now.Millisecond % 10 != 0)  // 90% success rate
            {
                onSuccess(42);
            }
            else
            {
                onError("Legacy API error");
            }
        });
    }
    
    // Example 3: Adding timeout to an operation
    static async Task<string> GetResultWithTimeoutAsync(int timeoutMs)
    {
        var tcs = new TaskCompletionSource<string>();
        
        // Start the operation
        ThreadPool.QueueUserWorkItem(_ =>
        {
            Thread.Sleep(2000); // Always takes 2 seconds
            tcs.TrySetResult("Operation completed");
        });
        
        // Create a timeout task
        var timeoutTask = Task.Delay(timeoutMs);
        
        // Wait for either the operation to complete or timeout
        Task completedTask = await Task.WhenAny(tcs.Task, timeoutTask);
        
        if (completedTask == timeoutTask)
        {
            // If timeout task completed first, the operation timed out
            throw new TimeoutException($"Operation timed out after {timeoutMs}ms");
        }
        
        // Operation completed successfully, return the result
        return await tcs.Task;
    }
}`;

export default function AsyncBasicsPage() {
  return (
    <LessonLayout 
      title="Async/Await Fundamentals"
      level="advanced"
      sidebarItems={sidebarItems}
      next={{ href: '/advanced/async/tpl', title: 'Task Parallel Library' }}
    >
      <div className="prose dark:prose-invert max-w-none">
        <h1>Async/Await Fundamentals in C#</h1>
        
        <p>
          Asynchronous programming is a powerful paradigm that allows your applications to remain responsive 
          while performing time-consuming operations. C# has evolved one of the most elegant and developer-friendly 
          approaches to async programming with its async/await pattern.
        </p>

        <h2>The Need for Asynchronous Programming</h2>
        
        <p>
          Let's first look at a traditional synchronous approach to understand why asynchronous programming is needed:
        </p>

        <CodeEditor 
          initialCode={synchronousCode}
          language="csharp"
          readOnly={true}
        />

        <p>
          In this synchronous code:
        </p>

        <ul>
          <li>The application's main thread is blocked during network downloads</li>
          <li>The UI (if this were a UI application) would freeze during these operations</li>
          <li>Resources are wasted as the thread sits idle during I/O operations</li>
          <li>Operations happen sequentially, even if they could run in parallel</li>
        </ul>

        <h2>The Async/Await Pattern</h2>
        
        <p>
          Now let's look at the same operations using the async/await pattern:
        </p>

        <CodeEditor 
          initialCode={asyncAwaitCode}
          language="csharp"
          readOnly={true}
        />

        <p>
          With async/await:
        </p>

        <ul>
          <li>The main thread is not blocked during I/O operations</li>
          <li>The UI would remain responsive during these operations</li>
          <li>Resources are used efficiently as threads are released during waiting</li>
          <li>The code still reads sequentially, making it easy to understand</li>
        </ul>

        <h2>Key Concepts in Async Programming</h2>
        
        <h3>Task and Task&lt;T&gt;</h3>
        <p>
          <code>Task</code> represents an asynchronous operation that doesn't return a value, while 
          <code>Task&lt;T&gt;</code> represents an asynchronous operation that returns a value of type T.
          Tasks are the foundation of the async model in C#.
        </p>

        <h3>async and await Keywords</h3>
        <p>
          The <code>async</code> modifier indicates that a method contains asynchronous operations. The 
          <code>await</code> operator suspends execution of the method until the awaited task completes, 
          without blocking the thread.
        </p>

        <h3>ConfigureAwait</h3>
        <p>
          By default, after an awaited task completes, the continuation (code after the await) runs on the original 
          context (e.g., UI thread in a desktop app). Using <code>ConfigureAwait(false)</code> indicates that the 
          continuation doesn't need to run on the original context, which can improve performance.
        </p>

        <h2>Common Async Patterns</h2>
        
        <p>
          Let's look at some common patterns when working with async code:
        </p>

        <CodeEditor 
          initialCode={asyncPatternCode}
          language="csharp"
          readOnly={true}
        />

        <p>
          This example demonstrates:
        </p>

        <ul>
          <li><strong>Sequential operations</strong>: Executing async operations one after another</li>
          <li><strong>Parallel operations</strong>: Starting multiple async operations at once and waiting for all to complete</li>
          <li><strong>Exception handling</strong>: Properly catching exceptions in async code</li>
          <li><strong>Cancellation</strong>: Supporting cancellation in long-running operations</li>
        </ul>

        <h2>TaskCompletionSource</h2>
        
        <p>
          <code>TaskCompletionSource</code> is a powerful tool that allows you to create a Task that you 
          manually control. It's useful for:
        </p>

        <ul>
          <li>Converting callback-based APIs to Task-based async patterns</li>
          <li>Creating custom async operations</li>
          <li>Implementing timeouts and other advanced patterns</li>
        </ul>

        <CodeEditor 
          initialCode={taskCompletionSourceCode}
          language="csharp"
          readOnly={true}
        />

        <h2>Best Practices for Async Programming</h2>
        
        <ul>
          <li><strong>Async all the way</strong>: Avoid mixing synchronous and asynchronous code</li>
          <li><strong>Use ConfigureAwait(false)</strong>: In library code to avoid context switching</li>
          <li><strong>Consider using ValueTask&lt;T&gt;</strong>: For high-performance scenarios to reduce allocations</li>
          <li><strong>Always handle exceptions</strong>: Unhandled exceptions in async methods can be lost</li>
          <li><strong>Support cancellation</strong>: For long-running operations to allow users to cancel</li>
          <li><strong>Avoid async void</strong>: Except for event handlers, as exceptions can't be caught</li>
        </ul>

        <div className="bg-csharp-blue-50 dark:bg-csharp-blue-900/20 p-4 rounded-lg mt-6">
          <h3 className="text-csharp-blue-700 dark:text-csharp-blue-400">Practice Exercise</h3>
          <p>
            Create a console application that performs the following operations asynchronously:
          </p>
          <ol>
            <li>Download content from multiple web pages in parallel</li>
            <li>Save each page's content to a file</li>
            <li>Count the total number of words across all downloaded pages</li>
            <li>Implement a timeout and cancellation support</li>
          </ol>
          <p>
            Ensure your application remains responsive and handles errors gracefully.
          </p>
        </div>

        <div className="mt-8">
          <p>
            In the next lesson, we'll explore the Task Parallel Library (TPL) for more advanced 
            asynchronous and parallel programming scenarios.
          </p>
        </div>
      </div>
    </LessonLayout>
  );
} 
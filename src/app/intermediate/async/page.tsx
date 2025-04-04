import React from 'react';
import { FiClock, FiCpu, FiDatabase } from 'react-icons/fi';
import LessonLayout from '@/components/LessonLayout';
import CodeEditor from '@/components/CodeEditor';

const sidebarItems = [
  {
    title: 'Intermediate',
    href: '/intermediate',
    icon: <FiCpu className="w-4 h-4" />,
    children: [
      { title: 'LINQ', href: '/intermediate/linq' },
      { title: 'Asynchronous Programming', href: '/intermediate/async' },
      { title: 'Entity Framework Core', href: '/intermediate/entity-framework' },
    ]
  },
];

const basicAsyncCode = `using System;
using System.Threading.Tasks;

namespace AsyncProgramming
{
    class Program
    {
        static async Task Main()
        {
            Console.WriteLine("Starting the program...");
            
            // Call an async method
            await DoWorkAsync();
            
            Console.WriteLine("Program completed!");
        }
        
        static async Task DoWorkAsync()
        {
            Console.WriteLine($"Starting work on thread {Thread.CurrentThread.ManagedThreadId}");
            
            // Simulate async work with Task.Delay
            await Task.Delay(2000);
            
            Console.WriteLine($"Work completed on thread {Thread.CurrentThread.ManagedThreadId}");
        }
    }
}`;

const asyncAwaitCode = `using System;
using System.Net.Http;
using System.Threading.Tasks;

namespace AsyncAwaitExample
{
    class Program
    {
        static async Task Main()
        {
            // Without async/await - callback-based approach
            Console.WriteLine("\\nWithout async/await (using ContinueWith):");
            FetchDataWithoutAsyncAwait()
                .ContinueWith(t => {
                    if (t.IsFaulted)
                        Console.WriteLine($"Error: {t.Exception.InnerException.Message}");
                    else
                        Console.WriteLine($"Data length: {t.Result.Length}");
                });
            
            // Using async/await - sequential calls
            Console.WriteLine("\\nWith async/await (sequential):");
            try
            {
                string data1 = await FetchDataAsync("https://example.com/api/data1");
                Console.WriteLine($"Data1 length: {data1.Length}");
                
                string data2 = await FetchDataAsync("https://example.com/api/data2");
                Console.WriteLine($"Data2 length: {data2.Length}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
            }
            
            // Using async/await - parallel calls
            Console.WriteLine("\\nWith async/await (parallel):");
            try
            {
                Task<string> task1 = FetchDataAsync("https://example.com/api/data1");
                Task<string> task2 = FetchDataAsync("https://example.com/api/data2");
                
                // Wait for both tasks to complete
                string[] results = await Task.WhenAll(task1, task2);
                
                Console.WriteLine($"Data1 length: {results[0].Length}");
                Console.WriteLine($"Data2 length: {results[1].Length}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
            }
        }
        
        static Task<string> FetchDataWithoutAsyncAwait()
        {
            var client = new HttpClient();
            return client.GetStringAsync("https://example.com/api/data");
        }
        
        static async Task<string> FetchDataAsync(string url)
        {
            var client = new HttpClient();
            Console.WriteLine($"Fetching data from {url}...");
            
            // Simulate network latency
            await Task.Delay(1000);
            
            // Make the actual HTTP request
            return await client.GetStringAsync(url);
        }
    }
}`;

const asyncPatternsCode = `using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;

namespace AsyncPatterns
{
    class Program
    {
        static async Task Main()
        {
            // 1. Task.WhenAll - run multiple operations in parallel
            await DemoTaskWhenAll();
            
            // 2. Task.WhenAny - get results as soon as they're available
            await DemoTaskWhenAny();
            
            // 3. Cancellation support
            await DemoCancellation();
            
            // 4. Progress reporting
            await DemoProgress();
            
            // 5. Exception handling
            await DemoExceptionHandling();
            
            // 6. ValueTask for performance optimization
            await DemoValueTask();
        }
        
        static async Task DemoTaskWhenAll()
        {
            Console.WriteLine("\\nTask.WhenAll Demo:");
            
            // Create multiple tasks
            var tasks = new List<Task<string>>();
            for (int i = 1; i <= 3; i++)
            {
                int delay = i * 500;
                tasks.Add(SimulateApiCall($"api/resource{i}", delay));
            }
            
            // Start all tasks and wait for all to complete
            Console.WriteLine("Starting all API calls in parallel...");
            var startTime = DateTime.Now;
            
            string[] results = await Task.WhenAll(tasks);
            
            var duration = DateTime.Now - startTime;
            Console.WriteLine($"All API calls completed in {duration.TotalMilliseconds}ms");
            Console.WriteLine($"Total data retrieved: {results.Sum(s => s.Length)} characters");
        }
        
        static async Task DemoTaskWhenAny()
        {
            Console.WriteLine("\\nTask.WhenAny Demo:");
            
            // Create multiple tasks with varying completion times
            var task1 = SimulateApiCall("api/fast", 500);
            var task2 = SimulateApiCall("api/medium", 1000);
            var task3 = SimulateApiCall("api/slow", 1500);
            
            var tasks = new[] { task1, task2, task3 };
            var pendingTasks = new List<Task<string>>(tasks);
            
            Console.WriteLine("Waiting for tasks to complete...");
            
            // Process results as they arrive
            while (pendingTasks.Count > 0)
            {
                var completedTask = await Task.WhenAny(pendingTasks);
                pendingTasks.Remove(completedTask);
                
                try
                {
                    string result = await completedTask;
                    Console.WriteLine($"Task completed: {result}");
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Task failed: {ex.Message}");
                }
                
                Console.WriteLine($"{pendingTasks.Count} tasks remaining...");
            }
            
            Console.WriteLine("All tasks have completed.");
        }
        
        static async Task DemoCancellation()
        {
            Console.WriteLine("\\nCancellation Demo:");
            
            // Create a cancellation token source with timeout
            using var cts = new CancellationTokenSource();
            cts.CancelAfter(800); // Cancel after 800ms
            
            try
            {
                Console.WriteLine("Starting a cancelable operation...");
                await SimulateLongRunningTask(2000, cts.Token);
                Console.WriteLine("Operation completed successfully.");
            }
            catch (OperationCanceledException)
            {
                Console.WriteLine("Operation was canceled.");
            }
        }
        
        static async Task DemoProgress()
        {
            Console.WriteLine("\\nProgress Reporting Demo:");
            
            // Create a progress handler
            var progress = new Progress<int>(percent => 
                Console.WriteLine($"Progress: {percent}%"));
            
            await SimulateFileDownload(progress);
            
            Console.WriteLine("Download completed.");
        }
        
        static async Task DemoExceptionHandling()
        {
            Console.WriteLine("\\nException Handling Demo:");
            
            try
            {
                // Handle a specific exception
                await Task.Run(() => throw new InvalidOperationException("Test exception"));
            }
            catch (InvalidOperationException ex)
            {
                Console.WriteLine($"Caught specific exception: {ex.Message}");
            }
            
            try
            {
                // Handle exceptions from multiple tasks
                var task1 = Task.Run(() => "Success");
                var task2 = Task.Run<string>(() => throw new Exception("Task 2 failed"));
                var task3 = Task.Run<string>(() => throw new Exception("Task 3 failed"));
                
                try
                {
                    string[] results = await Task.WhenAll(task1, task2, task3);
                }
                catch (Exception)
                {
                    // Check individual task status
                    if (task1.IsFaulted)
                        Console.WriteLine($"Task 1 failed: {task1.Exception?.InnerException.Message}");
                    else if (task1.IsCompleted)
                        Console.WriteLine($"Task 1 succeeded: {task1.Result}");
                    
                    if (task2.IsFaulted)
                        Console.WriteLine($"Task 2 failed: {task2.Exception?.InnerException.Message}");
                    
                    if (task3.IsFaulted)
                        Console.WriteLine($"Task 3 failed: {task3.Exception?.InnerException.Message}");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Unexpected exception: {ex.Message}");
            }
        }
        
        static async Task DemoValueTask()
        {
            Console.WriteLine("\\nValueTask Demo:");
            
            // ValueTask is more efficient when the result might be immediately available
            ValueTask<int> cachedTask = GetValueWithCaching(1); // Usually cached
            ValueTask<int> uncachedTask = GetValueWithCaching(100); // Not cached
            
            int result1 = await cachedTask;
            int result2 = await uncachedTask;
            
            Console.WriteLine($"Cached result: {result1}, Uncached result: {result2}");
        }
        
        // Helper methods
        static async Task<string> SimulateApiCall(string endpoint, int delay)
        {
            await Task.Delay(delay);
            return $"Data from {endpoint} after {delay}ms";
        }
        
        static async Task SimulateLongRunningTask(int duration, CancellationToken token)
        {
            // Check cancellation before starting
            token.ThrowIfCancellationRequested();
            
            int elapsed = 0;
            while (elapsed < duration)
            {
                // Simulate work
                await Task.Delay(100, token);
                elapsed += 100;
                
                // Check cancellation during work
                token.ThrowIfCancellationRequested();
            }
        }
        
        static async Task SimulateFileDownload(IProgress<int> progress)
        {
            for (int i = 0; i <= 100; i += 10)
            {
                await Task.Delay(100); // Simulate work
                progress.Report(i); // Report progress
            }
        }
        
        static Dictionary<int, int> _cache = new Dictionary<int, int>();
        
        static ValueTask<int> GetValueWithCaching(int key)
        {
            // If the value is cached, return immediately without creating a Task
            if (_cache.TryGetValue(key, out int cachedValue))
            {
                Console.WriteLine($"Value for key {key} was cached");
                return new ValueTask<int>(cachedValue);
            }
            
            // Otherwise, calculate the value asynchronously
            return new ValueTask<int>(CalculateValueAsync(key));
        }
        
        static async Task<int> CalculateValueAsync(int key)
        {
            Console.WriteLine($"Calculating value for key {key}...");
            await Task.Delay(100); // Simulate calculation
            int result = key * 10;
            _cache[key] = result; // Cache the result
            return result;
        }
    }
}`;

const bestPracticesCode = `using System;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;

namespace AsyncBestPractices
{
    public class AsyncBestPractices
    {
        // GOOD: Method names end with Async suffix
        public async Task<string> GetUserDataAsync(int userId)
        {
            // GOOD: ConfigureAwait(false) when you don't need the context
            var userData = await FetchFromDatabaseAsync(userId)
                .ConfigureAwait(false);
                
            return userData;
        }
        
        // GOOD: Provide cancellation support
        public async Task<string> GetUserDataWithCancellationAsync(
            int userId, 
            CancellationToken cancellationToken = default)
        {
            // Check cancellation before expensive operation
            cancellationToken.ThrowIfCancellationRequested();
            
            return await FetchFromDatabaseAsync(userId, cancellationToken)
                .ConfigureAwait(false);
        }
        
        // BAD: Async void - avoid except for event handlers
        // This can't be awaited and exceptions can't be caught
        public async void ProcessUserDataFireAndForget(int userId)
        {
            var data = await FetchFromDatabaseAsync(userId);
            // If exception occurs here, it can crash the application
        }
        
        // GOOD: Use Task instead of void
        public Task ProcessUserDataAsync(int userId)
        {
            return FetchFromDatabaseAsync(userId)
                .ContinueWith(task => {
                    // Process data
                });
        }
        
        // BAD: Blocking on async code - can lead to deadlocks
        public string GetUserDataBlocking(int userId)
        {
            // AVOID: .Result and .Wait() can cause deadlocks
            return FetchFromDatabaseAsync(userId).Result;
        }
        
        // GOOD: Proper async exception handling
        public async Task<string> GetUserDataWithRetryAsync(int userId)
        {
            int maxRetries = 3;
            int delay = 500;
            
            for (int i = 0; i < maxRetries; i++)
            {
                try
                {
                    return await FetchFromDatabaseAsync(userId)
                        .ConfigureAwait(false);
                }
                catch (HttpRequestException ex) when (i < maxRetries - 1)
                {
                    // Log the exception
                    Console.WriteLine($"Attempt {i+1} failed: {ex.Message}");
                    
                    // Wait before retrying
                    await Task.Delay(delay * (i + 1))
                        .ConfigureAwait(false);
                }
            }
            
            // Last attempt - let any exceptions propagate
            return await FetchFromDatabaseAsync(userId)
                .ConfigureAwait(false);
        }
        
        // Simulating external async operations
        private async Task<string> FetchFromDatabaseAsync(
            int userId, 
            CancellationToken cancellationToken = default)
        {
            await Task.Delay(1000, cancellationToken);
            return $"User data for ID {userId}";
        }
    }
    
    public class AsyncAntiPatterns
    {
        // ANTI-PATTERN: Async all the way
        private async Task<int> CountUsersAsync()
        {
            return await Task.FromResult(100); // Unnecessary await
        }
        
        // BETTER VERSION: Don't await Task.FromResult
        private Task<int> CountUsersBetterAsync()
        {
            return Task.FromResult(100);
        }
        
        // ANTI-PATTERN: Async/await in simple loops
        private async Task<int> SumNumbersAsync(int[] numbers)
        {
            int sum = 0;
            foreach (var number in numbers)
            {
                sum += await Task.FromResult(number); // Unnecessary async/await
            }
            return sum;
        }
        
        // BETTER VERSION: No async/await for synchronous work
        private Task<int> SumNumbersBetterAsync(int[] numbers)
        {
            int sum = numbers.Sum();
            return Task.FromResult(sum);
        }
        
        // ANTI-PATTERN: Not using Task.WhenAll for parallel operations
        private async Task<int> GetTotalSequentialAsync()
        {
            int count1 = await GetCountAsync("db1");
            int count2 = await GetCountAsync("db2");
            int count3 = await GetCountAsync("db3");
            
            return count1 + count2 + count3;
        }
        
        // BETTER VERSION: Parallel execution with Task.WhenAll
        private async Task<int> GetTotalParallelAsync()
        {
            var task1 = GetCountAsync("db1");
            var task2 = GetCountAsync("db2");
            var task3 = GetCountAsync("db3");
            
            int[] counts = await Task.WhenAll(task1, task2, task3);
            return counts.Sum();
        }
        
        // Helper method
        private async Task<int> GetCountAsync(string dbName)
        {
            await Task.Delay(1000); // Simulate DB query
            return new Random().Next(100);
        }
    }
}`;

export default function AsyncProgrammingPage() {
  return (
    <LessonLayout 
      title="Asynchronous Programming in C#"
      level="intermediate"
      sidebarItems={sidebarItems}
      next={{ href: '/intermediate/entity-framework', title: 'Entity Framework Core' }}
    >
      <div className="prose dark:prose-invert max-w-none">
        <h1>Asynchronous Programming in C#</h1>
        
        <p>
          Asynchronous programming is a programming paradigm that allows operations to execute independently 
          of the main application thread. In C#, it's essential for building responsive applications 
          and efficiently utilizing system resources.
        </p>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg my-4">
          <h3 className="text-xl font-semibold">Key Concepts</h3>
          <ul className="mt-2">
            <li><strong>Tasks</strong> - Represent asynchronous operations</li>
            <li><strong>async/await</strong> - Keywords that simplify working with asynchronous code</li>
            <li><strong>Thread Pool</strong> - Manages and recycles background threads</li>
            <li><strong>Task Parallelism</strong> - Running multiple operations concurrently</li>
            <li><strong>Continuation</strong> - Actions that execute after an async operation completes</li>
          </ul>
        </div>

        <h2>Understanding Tasks and async/await</h2>
        
        <p>
          The <code>Task</code> class represents an asynchronous operation. The <code>async</code> and <code>await</code> keywords 
          provide a clean way to work with Tasks without complex callbacks or continuation patterns.
        </p>

        <CodeEditor 
          initialCode={basicAsyncCode}
          language="csharp"
          readOnly={true}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
            <h3 className="text-yellow-700 dark:text-yellow-400">Tasks vs Threads</h3>
            <p className="mt-2">
              Tasks and threads are different concepts in asynchronous programming:
            </p>
            <ul className="mt-2">
              <li><strong>Thread</strong>: A sequence of instructions that can be executed independently</li>
              <li><strong>Task</strong>: A higher-level abstraction representing an asynchronous operation</li>
              <li>Tasks can use threads from the thread pool as needed</li>
              <li>Tasks can run on the same thread or different threads</li>
              <li>Creating Tasks is less resource-intensive than creating threads</li>
            </ul>
          </div>
          
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <h3 className="text-green-700 dark:text-green-400">Task States</h3>
            <p className="mt-2">
              A Task has several possible states during its lifecycle:
            </p>
            <ul className="mt-2">
              <li><strong>Created</strong>: Task has been created but not started</li>
              <li><strong>WaitingForActivation</strong>: Task is waiting to be scheduled</li>
              <li><strong>Running</strong>: Task is currently executing</li>
              <li><strong>WaitingForChildrenToComplete</strong>: Task is waiting for child tasks</li>
              <li><strong>RanToCompletion</strong>: Task completed successfully</li>
              <li><strong>Faulted</strong>: Task threw an unhandled exception</li>
              <li><strong>Canceled</strong>: Task was canceled before completion</li>
            </ul>
          </div>
        </div>

        <h2>The Power of async/await</h2>
        
        <p>
          The <code>async</code> and <code>await</code> keywords transform asynchronous code into sequential-looking 
          code that is easier to read and maintain, while still preserving the benefits of asynchronous execution.
        </p>

        <CodeEditor 
          initialCode={asyncAwaitCode}
          language="csharp"
          readOnly={true}
        />

        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg my-4">
          <h4 className="text-purple-700 dark:text-purple-400 font-semibold">How async/await Works</h4>
          <p className="mt-2">
            When you use the <code>await</code> keyword:
          </p>
          <ol className="mt-2">
            <li>Code execution is suspended at the <code>await</code> point</li>
            <li>The current method returns to its caller</li>
            <li>The calling thread is free to perform other work</li>
            <li>When the awaited task completes, execution resumes from where it left off</li>
            <li>By default, execution resumes on the original context (UI thread for UI apps)</li>
          </ol>
          <p className="mt-2">
            This maintains responsiveness without blocking threads or using complex callbacks.
          </p>
        </div>

        <h2>Common Async Patterns</h2>
        
        <p>
          Here are some common patterns and techniques used in asynchronous programming with C#:
        </p>

        <CodeEditor 
          initialCode={asyncPatternsCode}
          language="csharp"
          readOnly={true}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <h3 className="text-blue-700 dark:text-blue-400">Task Composition</h3>
            <p className="mt-2">
              Combine multiple asynchronous operations:
            </p>
            <ul className="mt-2">
              <li><strong>Task.WhenAll</strong> - Run multiple tasks in parallel and wait for all to complete</li>
              <li><strong>Task.WhenAny</strong> - Wait for the first task to complete among multiple tasks</li>
              <li><strong>ContinueWith</strong> - Chain operations to execute after a task completes</li>
            </ul>
          </div>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <h3 className="text-blue-700 dark:text-blue-400">Control & Feedback</h3>
            <p className="mt-2">
              Manage async operations and provide feedback:
            </p>
            <ul className="mt-2">
              <li><strong>CancellationToken</strong> - Cancel long-running operations</li>
              <li><strong>IProgress&lt;T&gt;</strong> - Report progress of async operations</li>
              <li><strong>TaskCompletionSource</strong> - Create tasks manually completed by your code</li>
              <li><strong>Task.FromResult</strong> - Create pre-completed tasks</li>
            </ul>
          </div>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <h3 className="text-blue-700 dark:text-blue-400">Error Handling</h3>
            <p className="mt-2">
              Handle errors in asynchronous code:
            </p>
            <ul className="mt-2">
              <li><strong>Try-Catch</strong> - Works with await just like synchronous code</li>
              <li><strong>Task.Exception</strong> - Access exceptions from completed tasks</li>
              <li><strong>AggregateException</strong> - Contains multiple exceptions from parallel tasks</li>
              <li><strong>Task.IsFaulted/IsCanceled</strong> - Check task state</li>
            </ul>
          </div>
        </div>

        <h2>Best Practices and Pitfalls</h2>
        
        <p>
          Following best practices helps you write reliable, efficient asynchronous code and avoid common pitfalls.
        </p>

        <CodeEditor 
          initialCode={bestPracticesCode}
          language="csharp"
          readOnly={true}
        />

        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg my-6">
          <h3 className="text-gray-700 dark:text-gray-300 font-semibold">Async Best Practices Checklist</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
            <div>
              <h4 className="font-semibold">DO</h4>
              <ul className="mt-1">
                <li>✅ Use async/await for I/O-bound operations</li>
                <li>✅ Add Async suffix to async method names</li>
                <li>✅ Use ConfigureAwait(false) in library code</li>
                <li>✅ Provide cancellation support</li>
                <li>✅ Return Task/Task&lt;T&gt; instead of void</li>
                <li>✅ Implement proper exception handling</li>
                <li>✅ Use Task.WhenAll for parallel operations</li>
                <li>✅ Consider Task.WhenAny for timeouts</li>
                <li>✅ Use ValueTask for high-performance scenarios</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">DON'T</h4>
              <ul className="mt-1">
                <li>❌ Use async void (except for event handlers)</li>
                <li>❌ Block on async code with .Result or .Wait()</li>
                <li>❌ Use Task.Run for I/O-bound operations</li>
                <li>❌ Capture UI context when unnecessary</li>
                <li>❌ Create async wrappers for synchronous methods</li>
                <li>❌ Ignore returned tasks without awaiting</li>
                <li>❌ Use async/await for simple operations</li>
                <li>❌ Write overly complex async code</li>
                <li>❌ Create async methods that never await</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-csharp-blue-50 dark:bg-csharp-blue-900/20 p-4 rounded-lg mt-6">
          <h3 className="text-csharp-blue-700 dark:text-csharp-blue-400">Practice Exercise</h3>
          <p>
            Create a weather dashboard application that fetches data from multiple sources:
          </p>
          <ol className="mt-2">
            <li>Create a console application that simulates fetching weather data from:
              <ul className="ml-4 mt-1">
                <li>Current conditions API</li>
                <li>Forecast API</li>
                <li>Weather alerts API</li>
                <li>Historical data API</li>
              </ul>
            </li>
            <li>Implement async methods for each API call with proper delays to simulate network latency</li>
            <li>Use Task.WhenAll to fetch the data in parallel</li>
            <li>Implement a cancellation mechanism that allows the user to cancel the operation</li>
            <li>Add progress reporting to show the status of each API call</li>
            <li>Implement error handling for failed API calls</li>
            <li>Add a timeout mechanism that falls back to cached data if an API call takes too long</li>
            <li>Ensure the application remains responsive while fetching data</li>
          </ol>
          <p className="mt-2">
            This exercise will help you apply async/await concepts in a realistic scenario.
          </p>
        </div>
      </div>
    </LessonLayout>
  );
} 
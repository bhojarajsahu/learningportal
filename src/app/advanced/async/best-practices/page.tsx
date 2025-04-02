import React from 'react';
import { FiZap, FiCheckCircle, FiAlertTriangle, FiCode } from 'react-icons/fi';
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

const errorHandlingCode = `using System;
using System.Net.Http;
using System.Threading.Tasks;

class Program
{
    static async Task Main()
    {
        // BAD: Swallowing exceptions
        await BadErrorHandlingExampleAsync();
        
        // GOOD: Proper exception handling
        await GoodErrorHandlingExampleAsync();
        
        Console.ReadKey();
    }
    
    // BAD: Exception is caught but not properly handled
    static async Task BadErrorHandlingExampleAsync()
    {
        Console.WriteLine("\\nBAD error handling example:");
        try
        {
            // This will throw an exception
            using var client = new HttpClient();
            var response = await client.GetAsync("https://nonexistentwebsite.example");
            var content = await response.Content.ReadAsStringAsync();
            Console.WriteLine($"Response content: {content}");
        }
        catch (Exception)
        {
            // ANTI-PATTERN: Swallowing the exception
            Console.WriteLine("Something went wrong, but we're ignoring the details.");
            
            // No logging, no rethrowing, information is lost
        }
    }
    
    // GOOD: Proper exception handling with useful information
    static async Task GoodErrorHandlingExampleAsync()
    {
        Console.WriteLine("\\nGOOD error handling example:");
        try
        {
            // This will throw an exception
            using var client = new HttpClient();
            var response = await client.GetAsync("https://nonexistentwebsite.example");
            
            // Check status code before proceeding
            response.EnsureSuccessStatusCode();
            
            var content = await response.Content.ReadAsStringAsync();
            Console.WriteLine($"Response content: {content}");
        }
        catch (HttpRequestException ex)
        {
            // Specific exception type caught
            Console.WriteLine($"Network error occurred: {ex.Message}");
            
            // In a real app, you would log the exception details
            // LogException(ex);
            
            // And possibly rethrow or return a meaningful error to the caller
            return; // Or return an error result
        }
        catch (TaskCanceledException ex)
        {
            // Handle timeout or cancellation specifically
            Console.WriteLine($"Request was cancelled or timed out: {ex.Message}");
            return;
        }
        catch (Exception ex)
        {
            // Fallback for unexpected exceptions
            Console.WriteLine($"Unexpected error: {ex.GetType().Name} - {ex.Message}");
            
            // Always include the original exception when rethrowing
            // throw new ApplicationException("Failed to retrieve data", ex);
            return;
        }
    }
}`;

const cancellationCode = `using System;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;

class Program
{
    static async Task Main()
    {
        // Example 1: Basic cancellation with timeout
        Console.WriteLine("Example 1: Basic cancellation with timeout");
        try
        {
            await TimeoutOperationAsync();
        }
        catch (OperationCanceledException)
        {
            Console.WriteLine("Operation was cancelled successfully");
        }
        
        // Example 2: User-initiated cancellation
        Console.WriteLine("\\nExample 2: User-initiated cancellation");
        await UserInitiatedCancellationAsync();
        
        // Example 3: Cancellation propagation
        Console.WriteLine("\\nExample 3: Cancellation propagation");
        await CancellationPropagationExampleAsync();
        
        Console.ReadKey();
    }
    
    // Example 1: Basic operation with timeout
    static async Task TimeoutOperationAsync()
    {
        // Create a cancellation token that automatically cancels after 2 seconds
        using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(2));
        
        Console.WriteLine("Starting long-running operation with 2-second timeout...");
        
        try
        {
            // Pass the token to the method that will be cancelled
            await LongRunningOperationAsync(cts.Token);
            Console.WriteLine("Operation completed successfully"); // Won't be reached
        }
        catch (OperationCanceledException)
        {
            Console.WriteLine("Operation timed out after 2 seconds");
            throw; // Rethrow to signal cancellation to caller
        }
    }
    
    // Example 2: User-initiated cancellation with separate cancellation task
    static async Task UserInitiatedCancellationAsync()
    {
        using var cts = new CancellationTokenSource();
        
        // Start a "user input" task that will cancel the operation after a delay
        // (simulating a user clicking "Cancel")
        _ = Task.Run(async () =>
        {
            await Task.Delay(1500); // Simulate user waiting 1.5 seconds
            Console.WriteLine("User clicked 'Cancel' button");
            cts.Cancel();
        });
        
        try
        {
            Console.WriteLine("Starting operation that can be cancelled by user...");
            await LongRunningOperationAsync(cts.Token);
            Console.WriteLine("Operation completed successfully"); // Won't be reached
        }
        catch (OperationCanceledException)
        {
            Console.WriteLine("Operation was cancelled by user");
        }
    }
    
    // Example 3: Proper cancellation propagation through multiple methods
    static async Task CancellationPropagationExampleAsync()
    {
        using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(3));
        
        try
        {
            Console.WriteLine("Starting multi-level operation with cancellation propagation...");
            await ParentOperationAsync(cts.Token);
            Console.WriteLine("Multi-level operation completed"); // Won't be reached
        }
        catch (OperationCanceledException)
        {
            Console.WriteLine("Multi-level operation was cancelled");
        }
    }
    
    // A long-running operation that supports cancellation
    static async Task LongRunningOperationAsync(CancellationToken cancellationToken)
    {
        for (int i = 0; i < 10; i++)
        {
            // Check cancellation before each significant operation
            cancellationToken.ThrowIfCancellationRequested();
            
            Console.WriteLine($"Operation in progress... {i*10}%");
            
            // Pass the token to all async methods that support it
            await Task.Delay(500, cancellationToken);
        }
    }
    
    // Parent operation that calls child operations
    static async Task ParentOperationAsync(CancellationToken cancellationToken)
    {
        await Task.Delay(500, cancellationToken); // Some work at parent level
        
        // Always propagate the cancellation token to child operations
        await ChildOperation1Async(cancellationToken);
        await ChildOperation2Async(cancellationToken);
    }
    
    static async Task ChildOperation1Async(CancellationToken cancellationToken)
    {
        // Some work in child operation 1
        Console.WriteLine("Child operation 1 started");
        await Task.Delay(1000, cancellationToken);
        Console.WriteLine("Child operation 1 completed");
    }
    
    static async Task ChildOperation2Async(CancellationToken cancellationToken)
    {
        // Some work in child operation 2
        Console.WriteLine("Child operation 2 started");
        await Task.Delay(2000, cancellationToken); // This will be cancelled
        Console.WriteLine("Child operation 2 completed"); // Won't be reached
    }
}`;

const asyncAntiPatternsCode = `using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;

class Program
{
    static async Task Main()
    {
        // Start with demonstration of anti-patterns
        await AntiPatternsExampleAsync();
        
        // Show better alternatives
        await BetterPracticesExampleAsync();
        
        Console.ReadKey();
    }
    
    static async Task AntiPatternsExampleAsync()
    {
        Console.WriteLine("ANTI-PATTERNS TO AVOID:");
        
        // ANTI-PATTERN 1: async void (except for event handlers)
        Console.WriteLine("\\nAnti-pattern 1: async void methods");
        try
        {
            AsyncVoidExample(); // Note: Cannot await this!
            
            // We have to add artificial delay to see the results
            // because we can't properly await an async void method
            await Task.Delay(1000);
        }
        catch (Exception)
        {
            Console.WriteLine("Exception from async void was not caught here!");
            // This won't catch exceptions from async void methods
        }
        
        // ANTI-PATTERN 2: Blocking on async code
        Console.WriteLine("\\nAnti-pattern 2: Blocking on async code");
        
        // This can lead to deadlocks in certain contexts (UI/ASP.NET)
        try
        {
            // DON'T DO THIS:
            var result = GetDataAsync().Result; // Blocking call
            Console.WriteLine($"Got result by blocking: {result}");
        }
        catch (AggregateException ex)
        {
            Console.WriteLine($"Blocking caused: {ex.InnerException?.Message}");
        }
        
        // ANTI-PATTERN 3: Async/await when not needed
        Console.WriteLine("\\nAnti-pattern 3: Unnecessary async/await");
        
        // Overhead without benefit:
        await UnnecessaryAsyncExample();
        
        // ANTI-PATTERN 4: Not using ConfigureAwait(false) in libraries
        Console.WriteLine("\\nAnti-pattern 4: Not using ConfigureAwait(false) in libraries");
        await LibraryMethodWithoutConfigureAwaitAsync();
    }
    
    static async Task BetterPracticesExampleAsync()
    {
        Console.WriteLine("\\nBETTER PRACTICES:");
        
        // BETTER 1: async Task instead of async void
        Console.WriteLine("\\nBetter practice 1: async Task instead of void");
        try
        {
            await AsyncTaskExample(); // Can be properly awaited
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Exception properly caught: {ex.Message}");
        }
        
        // BETTER 2: Async all the way
        Console.WriteLine("\\nBetter practice 2: Async all the way");
        var result = await GetDataAsync(); // Proper async/await
        Console.WriteLine($"Got result asynchronously: {result}");
        
        // BETTER 3: Only use async when needed
        Console.WriteLine("\\nBetter practice 3: Only use async when needed");
        var syncResult = GetSyncData();
        Console.WriteLine($"Got sync result directly: {syncResult}");
        
        // BETTER 4: Use ConfigureAwait(false) in libraries
        Console.WriteLine("\\nBetter practice 4: Using ConfigureAwait(false) in libraries");
        await LibraryMethodWithConfigureAwaitAsync();
    }
    
    // ANTI-PATTERN 1: async void
    static async void AsyncVoidExample()
    {
        Console.WriteLine("AsyncVoidExample started");
        await Task.Delay(500);
        
        try
        {
            throw new InvalidOperationException("Error in async void method");
        }
        catch (Exception ex)
        {
            // This exception can't be caught by the caller
            Console.WriteLine($"Exception in async void: {ex.Message}");
            // In a real app, this could crash the process
        }
    }
    
    // BETTER 1: async Task
    static async Task AsyncTaskExample()
    {
        Console.WriteLine("AsyncTaskExample started");
        await Task.Delay(500);
        
        throw new InvalidOperationException("Error in async Task method");
        // This exception can be caught by the caller
    }
    
    // Used for ANTI-PATTERN 2 and BETTER 2
    static async Task<string> GetDataAsync()
    {
        await Task.Delay(500); // Simulate work
        return "Async data";
    }
    
    // ANTI-PATTERN 3: Unnecessary async/await
    static async Task UnnecessaryAsyncExample()
    {
        // Unnecessary async/await adds overhead
        await Task.FromResult("Immediate result");
        
        // CPU-bound work doesn't benefit from async/await
        int result = 0;
        for (int i = 0; i < 100; i++)
        {
            result += i;
        }
        
        Console.WriteLine($"Calculated result: {result}");
    }
    
    // BETTER 3: Synchronous when appropriate
    static string GetSyncData()
    {
        // No async, no await needed for CPU-bound or immediate results
        return "Sync data";
    }
    
    // ANTI-PATTERN 4: Library method without ConfigureAwait
    static async Task LibraryMethodWithoutConfigureAwaitAsync()
    {
        // Bad in libraries - may cause deadlocks in certain contexts
        await Task.Delay(300);
        await Task.Delay(200);
        Console.WriteLine("Library method completed (without ConfigureAwait)");
    }
    
    // BETTER 4: Library method with ConfigureAwait
    static async Task LibraryMethodWithConfigureAwaitAsync()
    {
        // Good in libraries - avoids capturing context unnecessarily
        await Task.Delay(300).ConfigureAwait(false);
        await Task.Delay(200).ConfigureAwait(false);
        Console.WriteLine("Library method completed (with ConfigureAwait)");
    }
}`;

export default function AsyncBestPracticesPage() {
  return (
    <LessonLayout 
      title="Async Best Practices"
      level="advanced"
      sidebarItems={sidebarItems}
      prev={{ href: '/advanced/async/streams', title: 'Async Streams' }}
    >
      <div className="prose dark:prose-invert max-w-none">
        <h1>Async Programming Best Practices</h1>
        
        <p>
          Asynchronous programming in C# is powerful but comes with complexities and potential pitfalls.
          Following best practices ensures your async code is robust, efficient, and maintainable.
        </p>

        <h2>Error Handling</h2>
        
        <p>
          Proper error handling is crucial in asynchronous code. Unhandled exceptions in async methods
          can be difficult to debug and may crash your application.
        </p>

        <CodeEditor 
          initialCode={errorHandlingCode}
          language="csharp"
          readOnly={true}
        />

        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg my-4">
          <p className="font-semibold">Best Practices for Error Handling:</p>
          <ul className="mt-2">
            <li>Always handle exceptions in async methods</li>
            <li>Use specific exception types when catching exceptions</li>
            <li>Don't swallow exceptions without logging or recovery</li>
            <li>Use <code>EnsureSuccessStatusCode()</code> or check status codes in HTTP responses</li>
            <li>When rethrowing, use <code>throw;</code> to preserve the stack trace</li>
            <li>Consider using a global exception handler for unhandled exceptions</li>
          </ul>
        </div>

        <h2>Cancellation Support</h2>
        
        <p>
          Supporting cancellation allows your async operations to be responsive and prevents wasting
          resources on work that's no longer needed.
        </p>

        <CodeEditor 
          initialCode={cancellationCode}
          language="csharp"
          readOnly={true}
        />

        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg my-4">
          <p className="font-semibold">Best Practices for Cancellation:</p>
          <ul className="mt-2">
            <li>Always accept a CancellationToken parameter in public async methods</li>
            <li>Propagate cancellation tokens to downstream async calls</li>
            <li>Check cancellation regularly in long-running operations</li>
            <li>Use <code>CancellationTokenSource.CreateLinkedTokenSource()</code> to combine tokens</li>
            <li>Set timeouts using <code>CancellationTokenSource(TimeSpan)</code></li>
            <li>Dispose CancellationTokenSource instances to free resources</li>
            <li>Throw OperationCanceledException when cancellation is detected</li>
          </ul>
        </div>

        <h2>Common Anti-Patterns to Avoid</h2>
        
        <p>
          Understanding what not to do is as important as knowing best practices. Here are some common
          anti-patterns to avoid in async programming:
        </p>

        <CodeEditor 
          initialCode={asyncAntiPatternsCode}
          language="csharp"
          readOnly={true}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
            <h3 className="text-red-700 dark:text-red-400">Anti-Patterns to Avoid</h3>
            <ul className="mt-2">
              <li><strong>async void</strong> - Exceptions can't be caught by callers</li>
              <li><strong>Blocking on async code</strong> - Using .Result or .Wait() can cause deadlocks</li>
              <li><strong>Unnecessary async/await</strong> - Adds overhead without benefit</li>
              <li><strong>Sync over async</strong> - Blocking threads waiting for async results</li>
              <li><strong>Not using ConfigureAwait(false)</strong> - In libraries, this can cause context issues</li>
              <li><strong>Fire and forget</strong> - Starting async tasks without tracking or error handling</li>
            </ul>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <h3 className="text-green-700 dark:text-green-400">Best Practices</h3>
            <ul className="mt-2">
              <li><strong>Async all the way</strong> - Avoid mixing sync and async code</li>
              <li><strong>async Task</strong> - Use this instead of async void</li>
              <li><strong>ConfigureAwait(false)</strong> - In libraries to avoid context issues</li>
              <li><strong>Task-based API design</strong> - Return Task or Task&lt;T&gt; from methods</li>
              <li><strong>Async suffix</strong> - Name async methods with Async suffix</li>
              <li><strong>Avoid using async lambdas in LINQ</strong> - Use synchronous lambdas when possible</li>
            </ul>
          </div>
        </div>

        <h2>Performance Considerations</h2>
        
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg my-4">
          <p className="font-semibold">Optimizing Async Performance:</p>
          <ul className="mt-2">
            <li><strong>ValueTask vs Task</strong> - Use ValueTask for methods that complete synchronously sometimes</li>
            <li><strong>Minimize allocations</strong> - Each async state machine has an allocation cost</li>
            <li><strong>Task.WhenAll</strong> - Run independent operations in parallel</li>
            <li><strong>Consider Task.Run</strong> - Only for CPU-bound operations, not for I/O</li>
            <li><strong>CancellationToken</strong> - Cancel long-running operations to free resources</li>
            <li><strong>Memory usage</strong> - Be mindful of capturing large objects in async methods</li>
            <li><strong>Avoid over-parallelization</strong> - Too many concurrent tasks can degrade performance</li>
          </ul>
        </div>

        <h2>Testing Asynchronous Code</h2>
        
        <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg my-4">
          <p className="font-semibold">Tips for Testing Async Code:</p>
          <ul className="mt-2">
            <li>Use <code>async/await</code> in test methods to write natural tests</li>
            <li>Test both success and failure paths</li>
            <li>Test cancellation behavior</li>
            <li>Use test frameworks that support async (xUnit, NUnit, MSTest)</li>
            <li>Consider using fake/mock implementations for external dependencies</li>
            <li>Test with realistic timing (don't rely on Task.Delay(0))</li>
            <li>Test concurrent behavior with multiple simultaneous calls</li>
            <li>For testing UI code, use specialized UI test frameworks</li>
          </ul>
        </div>

        <h2>Advanced Considerations</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
            <h3 className="text-purple-700 dark:text-purple-400">Advanced Patterns</h3>
            <ul className="mt-2">
              <li><strong>Async factory methods</strong> - When constructors can't be async</li>
              <li><strong>Caching</strong> - Cache Task results for reuse</li>
              <li><strong>IAsyncDisposable</strong> - For resources requiring async cleanup</li>
              <li><strong>AsyncLazy&lt;T&gt;</strong> - Lazy initialization with async support</li>
              <li><strong>SemaphoreSlim</strong> - For controlling concurrency levels</li>
              <li><strong>Channels</strong> - For producer/consumer scenarios</li>
            </ul>
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
            <h3 className="text-yellow-700 dark:text-yellow-400">Framework-Specific</h3>
            <ul className="mt-2">
              <li><strong>ASP.NET Core</strong> - Use async controller actions for I/O-bound operations</li>
              <li><strong>WPF/WinForms</strong> - Update UI from continuations with proper context</li>
              <li><strong>Entity Framework</strong> - Use async methods for database operations</li>
              <li><strong>SignalR</strong> - Use async for hub methods</li>
              <li><strong>gRPC</strong> - Design services with async methods</li>
              <li><strong>Blazor</strong> - Use async/await for server interaction</li>
            </ul>
          </div>
        </div>

        <h2>Debugging Asynchronous Code</h2>
        
        <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg my-4">
          <p className="font-semibold">Tips for Debugging Async Code:</p>
          <ul className="mt-2">
            <li>Use <strong>Async Debugger</strong> tools in Visual Studio</li>
            <li>Enable <strong>Just My Code</strong> to skip framework code</li>
            <li>Use <strong>Tasks Window</strong> to see all running tasks</li>
            <li>Set <strong>Parallel Stacks</strong> to Tasks view</li>
            <li>Check for <strong>Deadlocks</strong> in the Threads window</li>
            <li>For ASP.NET, use <strong>Microsoft.AspNetCore.MiddlewareAnalysis</strong></li>
            <li>Look for <strong>Unobserved exceptions</strong> in Task finalizers</li>
            <li>Check for <strong>Synchronization context</strong> issues</li>
          </ul>
        </div>

        <div className="bg-csharp-blue-50 dark:bg-csharp-blue-900/20 p-4 rounded-lg mt-6">
          <h3 className="text-csharp-blue-700 dark:text-csharp-blue-400">Practice Exercise</h3>
          <p>
            Review an existing codebase and identify async anti-patterns. Refactor the code to follow
            best practices including:
          </p>
          <ul>
            <li>Replace any async void methods with async Task</li>
            <li>Add proper exception handling</li>
            <li>Add cancellation support to long-running operations</li>
            <li>Fix any blocking calls (Task.Result, Wait())</li>
            <li>Add ConfigureAwait(false) where appropriate</li>
            <li>Optimize performance using Task.WhenAll for parallel operations</li>
          </ul>
          <p>
            Write unit tests that verify the async behavior works correctly, including
            testing cancellation and error handling scenarios.
          </p>
        </div>

        <div className="mt-8">
          <p>
            Congratulations on completing the Asynchronous Programming module! You now have the knowledge
            to write efficient, responsive, and robust asynchronous code in C#. Remember that
            mastering async programming is an ongoing journey - keep practicing and refining your skills.
          </p>
        </div>
      </div>
    </LessonLayout>
  );
} 
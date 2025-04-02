import React from 'react';
import { FiZap, FiRefreshCw, FiFilter, FiArrowRight } from 'react-icons/fi';
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

const asyncStreamBasicsCode = `using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

class Program
{
    static async Task Main()
    {
        // Consume an async stream with await foreach
        Console.WriteLine("Consuming async stream with await foreach:");
        await foreach (var number in GenerateNumbersAsync(10))
        {
            Console.WriteLine($"Received: {number}");
        }
        
        // Consume with cancellation
        Console.WriteLine("\\nConsume with cancellation (will cancel after 3 items):");
        using var cts = new CancellationTokenSource();
        
        try
        {
            int count = 0;
            await foreach (var number in GenerateNumbersAsync(10).WithCancellation(cts.Token))
            {
                Console.WriteLine($"Received with cancellation: {number}");
                count++;
                
                if (count >= 3)
                {
                    Console.WriteLine("Cancelling the enumeration...");
                    cts.Cancel();
                }
            }
        }
        catch (OperationCanceledException)
        {
            Console.WriteLine("Enumeration was cancelled.");
        }
        
        Console.ReadKey();
    }
    
    // An async iterator method that yields values asynchronously
    static async IAsyncEnumerable<int> GenerateNumbersAsync(int count)
    {
        for (int i = 1; i <= count; i++)
        {
            // Simulate async work
            await Task.Delay(1000);
            
            // Yield a value back to the caller
            yield return i;
            
            Console.WriteLine($"After yielding {i}");
        }
    }
}`;

const asyncStreamWithCancellationCode = `using System;
using System.Collections.Generic;
using System.Runtime.CompilerServices;
using System.Threading;
using System.Threading.Tasks;

class Program
{
    static async Task Main()
    {
        Console.WriteLine("Starting async stream with cancellation example");
        
        // Setup cancellation with timeout after 3.5 seconds
        using var cts = new CancellationTokenSource(3500);
        
        try
        {
            // Enumerate the async stream with cancellation support
            await foreach (var item in GenerateAsyncData(cts.Token)
                                         .WithCancellation(cts.Token))
            {
                Console.WriteLine($"Received: {item}");
            }
            
            Console.WriteLine("Completed enumeration successfully");
        }
        catch (OperationCanceledException)
        {
            Console.WriteLine("The operation was cancelled");
        }
        
        // Manual cancellation example
        Console.WriteLine("\\nStarting manual cancellation example");
        using var manualCts = new CancellationTokenSource();
        
        // Start a task to cancel after receiving 3 items
        _ = Task.Run(async () =>
        {
            int count = 0;
            while (count < 3 && !manualCts.Token.IsCancellationRequested)
            {
                await Task.Delay(1500);
                count++;
            }
            Console.WriteLine("Triggering cancellation after 3 items");
            manualCts.Cancel();
        });
        
        try
        {
            await foreach (var item in GenerateAsyncData(manualCts.Token)
                                         .WithCancellation(manualCts.Token))
            {
                Console.WriteLine($"Manual example received: {item}");
            }
        }
        catch (OperationCanceledException)
        {
            Console.WriteLine("Manual cancellation was triggered");
        }
        
        Console.ReadKey();
    }
    
    // Note the [EnumeratorCancellation] attribute that propagates the cancellation token
    static async IAsyncEnumerable<string> GenerateAsyncData(
        [EnumeratorCancellation] CancellationToken cancellationToken = default)
    {
        for (int i = 1; i <= 10; i++)
        {
            // Check cancellation before expensive operation
            cancellationToken.ThrowIfCancellationRequested();
            
            // Simulate async work
            await Task.Delay(1000, cancellationToken);
            
            string result = $"Data item {i} at {DateTime.Now.ToLongTimeString()}";
            Console.WriteLine($"Generated: {result}");
            
            yield return result;
        }
    }
}`;

const realWorldExampleCode = `using System;
using System.Collections.Generic;
using System.IO;
using System.Net.Http;
using System.Runtime.CompilerServices;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;

// Sample record types
public record WeatherData(
    string City,
    double Temperature,
    int Humidity,
    string Conditions,
    DateTime Timestamp
);

public record LogEntry(
    DateTime Timestamp,
    string Level,
    string Message
);

class Program
{
    static readonly HttpClient httpClient = new HttpClient();
    
    static async Task Main()
    {
        // Example 1: Process a stream of sensor data
        Console.WriteLine("Processing weather data stream:");
        try
        {
            await ProcessWeatherDataAsync();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error processing weather data: {ex.Message}");
        }
        
        // Example 2: Continuously monitor a log file
        Console.WriteLine("\\nMonitoring log file:");
        using var cts = new CancellationTokenSource();
        
        // Cancel after 10 seconds for demo purposes
        cts.CancelAfter(10000);
        
        try
        {
            await MonitorLogFileAsync("application.log", cts.Token);
        }
        catch (OperationCanceledException)
        {
            Console.WriteLine("Log monitoring cancelled.");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error monitoring logs: {ex.Message}");
        }
        
        Console.ReadKey();
    }
    
    // Example 1: Process streaming weather data from an API
    static async Task ProcessWeatherDataAsync()
    {
        // Process up to 20 weather updates with a timeout of 30 seconds
        using var cts = new CancellationTokenSource(30000);
        
        int count = 0;
        await foreach (var weatherData in GetWeatherStreamAsync(cts.Token)
                                           .WithCancellation(cts.Token))
        {
            Console.WriteLine($"Weather update: {weatherData.City}, " +
                             $"{weatherData.Temperature}°C, {weatherData.Conditions}");
            
            // Process the data (in a real app, you might store it, analyze it, etc.)
            if (weatherData.Temperature > 30)
            {
                Console.WriteLine($"  ALERT: High temperature detected in {weatherData.City}!");
            }
            
            count++;
            if (count >= 5) break; // For demo, we'll just process 5 items
        }
    }
    
    // Example 2: Continuously monitor a log file for new entries
    static async Task MonitorLogFileAsync(string logFilePath, CancellationToken cancellationToken)
    {
        // Create the log file if it doesn't exist
        if (!File.Exists(logFilePath))
        {
            File.WriteAllText(logFilePath, ""); // Create empty file
            
            // Simulate adding some log entries for the demo
            _ = Task.Run(async () => 
            {
                await SimulateLogEntriesAsync(logFilePath, cancellationToken);
            }, cancellationToken);
        }
        
        // Monitor the log file for new entries
        await foreach (var logEntry in ReadLogFileStreamAsync(logFilePath, cancellationToken)
                                         .WithCancellation(cancellationToken))
        {
            // Process log entries as they arrive
            string levelIndicator = logEntry.Level switch
            {
                "ERROR" => "❌",
                "WARNING" => "⚠️",
                "INFO" => "ℹ️",
                _ => " "
            };
            
            Console.WriteLine($"{levelIndicator} [{logEntry.Timestamp:HH:mm:ss}] " +
                             $"[{logEntry.Level}] {logEntry.Message}");
            
            // In a real app, you might:
            // - Trigger alerts for ERROR entries
            // - Aggregate statistics
            // - Forward to a monitoring service
        }
    }
    
    // Simulate a stream of weather data (in a real app, this would come from an API)
    static async IAsyncEnumerable<WeatherData> GetWeatherStreamAsync(
        [EnumeratorCancellation] CancellationToken cancellationToken = default)
    {
        string[] cities = { "New York", "London", "Tokyo", "Sydney", "Paris" };
        string[] conditions = { "Sunny", "Cloudy", "Rainy", "Snowy", "Windy" };
        Random random = new Random();
        
        for (int i = 0; i < 20; i++)
        {
            cancellationToken.ThrowIfCancellationRequested();
            
            // Simulate network delay
            await Task.Delay(1000, cancellationToken);
            
            // Generate random weather data
            string city = cities[random.Next(cities.Length)];
            double temperature = Math.Round(random.NextDouble() * 40 - 5, 1); // -5°C to 35°C
            int humidity = random.Next(30, 95);
            string condition = conditions[random.Next(conditions.Length)];
            
            yield return new WeatherData(
                city,
                temperature,
                humidity,
                condition,
                DateTime.Now
            );
        }
    }
    
    // Read a log file as an async stream of entries
    static async IAsyncEnumerable<LogEntry> ReadLogFileStreamAsync(
        string logFilePath,
        [EnumeratorCancellation] CancellationToken cancellationToken = default)
    {
        // Keep track of the last position read
        long lastPosition = 0;
        
        while (!cancellationToken.IsCancellationRequested)
        {
            // Wait for file to be created if it doesn't exist yet
            while (!File.Exists(logFilePath) && !cancellationToken.IsCancellationRequested)
            {
                await Task.Delay(100, cancellationToken);
            }
            
            // Get current file length
            var fileInfo = new FileInfo(logFilePath);
            long currentLength = fileInfo.Length;
            
            // If file has grown, read the new content
            if (currentLength > lastPosition)
            {
                using (var stream = new FileStream(
                    logFilePath, FileMode.Open, FileAccess.Read, FileShare.ReadWrite))
                {
                    stream.Position = lastPosition;
                    using var reader = new StreamReader(stream);
                    
                    string line;
                    while ((line = await reader.ReadLineAsync()) != null)
                    {
                        if (string.IsNullOrWhiteSpace(line)) continue;
                        
                        try
                        {
                            // Try to parse the log entry - in a real app you'd have more robust parsing
                            var parts = line.Split('|');
                            if (parts.Length >= 3)
                            {
                                yield return new LogEntry(
                                    DateTime.Parse(parts[0].Trim()),
                                    parts[1].Trim(),
                                    parts[2].Trim()
                                );
                            }
                        }
                        catch (Exception ex)
                        {
                            Console.WriteLine($"Error parsing log entry: {ex.Message}");
                        }
                    }
                    
                    // Update the last position
                    lastPosition = stream.Position;
                }
            }
            
            // Wait before checking again
            await Task.Delay(500, cancellationToken);
        }
    }
    
    // Simulate writing log entries for the demo
    static async Task SimulateLogEntriesAsync(string logFilePath, CancellationToken cancellationToken)
    {
        string[] levels = { "INFO", "WARNING", "ERROR" };
        string[] messages = { 
            "Application started",
            "User logged in",
            "Database connection failed",
            "Cache miss for key 'user_preferences'",
            "Request processed in 235ms",
            "Memory usage above threshold",
            "API rate limit approaching"
        };
        
        Random random = new Random();
        
        using var writer = new StreamWriter(logFilePath, true);
        
        for (int i = 0; i < 20 && !cancellationToken.IsCancellationRequested; i++)
        {
            string level = levels[random.Next(levels.Length)];
            string message = messages[random.Next(messages.Length)];
            
            // Write a formatted log entry
            await writer.WriteLineAsync(
                $"{DateTime.Now:yyyy-MM-dd HH:mm:ss} | {level} | {message} #{i+1}");
            await writer.FlushAsync();
            
            // Wait between log entries
            await Task.Delay(random.Next(500, 2000), cancellationToken);
        }
    }
}`;

const asyncDisposableCode = `using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

class Program
{
    static async Task Main()
    {
        // Using an async disposable resource
        await using (var resource = new AsyncDisposableResource())
        {
            await resource.UseResourceAsync();
        } // The resource is asynchronously disposed here
        
        // Using an async enumerable that needs disposal
        Console.WriteLine("\\nUsing an async disposable stream");
        await using (var stream = new DisposableAsyncStream(5))
        {
            await foreach (var item in stream)
            {
                Console.WriteLine($"Received from disposable stream: {item}");
            }
        } // The stream is asynchronously disposed here
        
        // Using with an extension method 
        Console.WriteLine("\\nUsing an async enumerable with ConfigureAwait");
        await foreach (var item in GetNumbersAsync(5).ConfigureAwait(false))
        {
            Console.WriteLine($"Received with ConfigureAwait(false): {item}");
        }
        
        Console.ReadKey();
    }
    
    static async IAsyncEnumerable<int> GetNumbersAsync(int count)
    {
        for (int i = 1; i <= count; i++)
        {
            await Task.Delay(500);
            yield return i;
        }
    }
}

// A class implementing IAsyncDisposable
class AsyncDisposableResource : IAsyncDisposable
{
    public AsyncDisposableResource()
    {
        Console.WriteLine("AsyncDisposableResource: Constructor - Acquiring resource");
    }
    
    public async Task UseResourceAsync()
    {
        Console.WriteLine("AsyncDisposableResource: Using the resource");
        await Task.Delay(1000); // Simulate async work
        Console.WriteLine("AsyncDisposableResource: Finished using the resource");
    }
    
    public async ValueTask DisposeAsync()
    {
        Console.WriteLine("AsyncDisposableResource: Starting async cleanup");
        await Task.Delay(1000); // Simulate async cleanup work
        Console.WriteLine("AsyncDisposableResource: Cleanup completed");
    }
}

// An async stream that also implements IAsyncDisposable
class DisposableAsyncStream : IAsyncEnumerable<string>, IAsyncDisposable
{
    private readonly int _count;
    private bool _isDisposed;
    
    public DisposableAsyncStream(int count)
    {
        _count = count;
        Console.WriteLine("DisposableAsyncStream: Constructor - Initializing stream");
    }
    
    public async IAsyncEnumerator<string> GetAsyncEnumerator(
        CancellationToken cancellationToken = default)
    {
        if (_isDisposed)
            throw new ObjectDisposedException(nameof(DisposableAsyncStream));
            
        Console.WriteLine("DisposableAsyncStream: Starting enumeration");
        
        for (int i = 1; i <= _count; i++)
        {
            cancellationToken.ThrowIfCancellationRequested();
            
            // Simulate async work to produce each item
            await Task.Delay(700, cancellationToken);
            
            yield return $"Item {i} at {DateTime.Now.ToLongTimeString()}";
        }
        
        Console.WriteLine("DisposableAsyncStream: Finished enumeration");
    }
    
    public async ValueTask DisposeAsync()
    {
        if (!_isDisposed)
        {
            // Perform async cleanup
            Console.WriteLine("DisposableAsyncStream: Starting async cleanup");
            await Task.Delay(1000); // Simulate async cleanup
            
            _isDisposed = true;
            Console.WriteLine("DisposableAsyncStream: Cleanup completed");
        }
    }
}`;

export default function AsyncStreamsPage() {
  return (
    <LessonLayout 
      title="Async Streams"
      level="advanced"
      sidebarItems={sidebarItems}
      prev={{ href: '/advanced/async/tpl', title: 'Task Parallel Library' }}
      next={{ href: '/advanced/async/best-practices', title: 'Async Best Practices' }}
    >
      <div className="prose dark:prose-invert max-w-none">
        <h1>Async Streams in C#</h1>
        
        <p>
          Async streams (introduced in C# 8.0) combine the power of asynchronous programming with the
          simplicity of enumerable collections. They allow you to asynchronously generate and consume 
          sequences of data, which is particularly useful for scenarios like:
        </p>

        <ul>
          <li>Processing real-time data streams from sensors, APIs, or financial feeds</li>
          <li>Reading large files without loading the entire content into memory</li>
          <li>Processing paginated API responses that arrive over time</li>
          <li>Implementing reactive systems that handle ongoing events</li>
        </ul>

        <h2>Understanding Async Streams</h2>
        
        <p>
          Before async streams, developers had to choose between:
        </p>

        <ul>
          <li>
            <strong>IEnumerable&lt;T&gt;</strong>: Simple to use but synchronous, blocking while waiting for the next item
          </li>
          <li>
            <strong>Task&lt;IEnumerable&lt;T&gt;&gt;</strong>: Asynchronous but returns all items at once, not suitable for large or infinite streams
          </li>
          <li>
            <strong>Custom callbacks or IObservable&lt;T&gt;</strong>: Powerful but complex to implement correctly
          </li>
        </ul>

        <p>
          Async streams solve these problems by introducing:
        </p>

        <ul>
          <li>
            <strong>IAsyncEnumerable&lt;T&gt;</strong>: A sequence that can be enumerated asynchronously
          </li>
          <li>
            <strong>IAsyncEnumerator&lt;T&gt;</strong>: An enumerator that asynchronously yields values
          </li>
          <li>
            <strong>await foreach</strong>: A language feature to consume async streams
          </li>
          <li>
            <strong>async yield return</strong>: A way to produce async streams
          </li>
        </ul>

        <h2>Basic Async Streams</h2>
        
        <p>
          Let's look at the basics of creating and consuming async streams:
        </p>

        <CodeEditor 
          initialCode={asyncStreamBasicsCode}
          language="csharp"
          readOnly={true}
        />

        <p>
          Key points:
        </p>

        <ul>
          <li><strong>async IAsyncEnumerable&lt;T&gt;</strong> defines a method that returns an async stream</li>
          <li><strong>yield return</strong> produces values in the stream</li>
          <li><strong>await foreach</strong> consumes values from the stream as they become available</li>
          <li>Processing continues immediately after each item, without waiting for the entire sequence</li>
          <li>The producer can do async work between yielding items</li>
        </ul>

        <h2>Cancellation with Async Streams</h2>
        
        <p>
          Async streams support cancellation, allowing consumers to stop processing the stream:
        </p>

        <CodeEditor 
          initialCode={asyncStreamWithCancellationCode}
          language="csharp"
          readOnly={true}
        />

        <p>
          Key points about cancellation:
        </p>

        <ul>
          <li>The <strong>[EnumeratorCancellation]</strong> attribute propagates the cancellation token from the consumer to the producer</li>
          <li>The <strong>WithCancellation()</strong> extension method allows passing a cancellation token to the stream</li>
          <li>Cancellation can occur from a timeout, manual cancellation, or other trigger</li>
          <li>Both the producer and consumer should respect cancellation</li>
        </ul>

        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg my-4">
          <p className="font-semibold">Important:</p>
          <p>
            Without the [EnumeratorCancellation] attribute, the cancellation token from WithCancellation() 
            would not be passed to the async enumerable method. This is a common mistake when implementing 
            cancellable async streams.
          </p>
        </div>

        <h2>Real-World Examples</h2>
        
        <p>
          Here are some practical examples of using async streams in real-world scenarios:
        </p>

        <CodeEditor 
          initialCode={realWorldExampleCode}
          language="csharp"
          readOnly={true}
        />

        <p>
          These examples demonstrate how async streams excel at handling:
        </p>

        <ul>
          <li>Continuous data sources that produce items over time</li>
          <li>Real-time monitoring and processing</li>
          <li>Efficient processing of large data sets</li>
          <li>Operations that require asynchronous I/O between elements</li>
        </ul>

        <h2>IAsyncDisposable and Resource Management</h2>
        
        <p>
          Along with async streams, C# 8.0 introduced IAsyncDisposable for handling resources that require
          asynchronous cleanup:
        </p>

        <CodeEditor 
          initialCode={asyncDisposableCode}
          language="csharp"
          readOnly={true}
        />

        <p>
          Key points about async disposal:
        </p>

        <ul>
          <li><strong>IAsyncDisposable</strong> provides an asynchronous way to release resources</li>
          <li><strong>DisposeAsync()</strong> can perform cleanup operations that require await</li>
          <li><strong>await using</strong> ensures async disposal even if exceptions occur</li>
          <li>Many async streams also implement IAsyncDisposable for cleanup</li>
          <li>ValueTask is preferred over Task for disposal to reduce allocations</li>
        </ul>

        <h2>Advanced Features and Patterns</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <h3 className="text-blue-700 dark:text-blue-400">Extension Methods</h3>
            <ul className="mt-2">
              <li><strong>WithCancellation()</strong> - Add cancellation to any async stream</li>
              <li><strong>ConfigureAwait()</strong> - Control context capturing for each await</li>
              <li><strong>ToBlockingEnumerable()</strong> - Convert to synchronous IEnumerable (use with caution)</li>
              <li><strong>ToAsyncEnumerable()</strong> - Convert IEnumerable to IAsyncEnumerable</li>
              <li><strong>SelectAwait()</strong>, <strong>WhereAwait()</strong> - LINQ-like ops with async predicates</li>
            </ul>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <h3 className="text-green-700 dark:text-green-400">Common Patterns</h3>
            <ul className="mt-2">
              <li><strong>Buffer/batch processing</strong> - Yield items in batches to reduce overhead</li>
              <li><strong>Pipeline processing</strong> - Chain async streams for multi-stage processing</li>
              <li><strong>Throttling/backpressure</strong> - Control flow rate with SemaphoreSlim</li>
              <li><strong>Parallel processing</strong> - Process stream items in parallel (with care)</li>
              <li><strong>Stream transformation</strong> - Filter, map, or aggregate async streams</li>
            </ul>
          </div>
        </div>

        <h2>Best Practices</h2>
        
        <ul>
          <li>
            <strong>Respect cancellation throughout</strong> - Check cancellation tokens regularly and propagate them correctly
          </li>
          <li>
            <strong>Implement IAsyncDisposable</strong> - For any async stream that manages resources
          </li>
          <li>
            <strong>Avoid blocking operations</strong> - Never use .Result, .Wait(), or synchronous I/O in async streams
          </li>
          <li>
            <strong>Consider memory usage</strong> - Async streams are ideal for processing large data sets with a small memory footprint
          </li>
          <li>
            <strong>Be careful with async LINQ operations</strong> - They materialize the collection, defeating the purpose of streaming
          </li>
          <li>
            <strong>Handle exceptions gracefully</strong> - Exceptions thrown from the producer will be observed by the consumer
          </li>
          <li>
            <strong>Test with real-world load</strong> - Verify that your implementation handles slow consumers and producers correctly
          </li>
          <li>
            <strong>Avoid infinite loops</strong> - Unless specifically building an infinite stream, ensure your stream terminates
          </li>
        </ul>

        <div className="bg-csharp-blue-50 dark:bg-csharp-blue-900/20 p-4 rounded-lg mt-6">
          <h3 className="text-csharp-blue-700 dark:text-csharp-blue-400">Practice Exercise</h3>
          <p>
            Create a file processing application that:
          </p>
          <ul>
            <li>Asynchronously reads a large CSV file line by line as an async stream</li>
            <li>Parses each line into a structured data object</li>
            <li>Filters the data based on certain criteria</li>
            <li>Performs an async API call for each filtered item</li>
            <li>Writes the results to another file</li>
          </ul>
          <p>
            Include proper cancellation support and resource management with IAsyncDisposable.
          </p>
        </div>

        <div className="mt-8">
          <p>
            In the next lesson, we'll explore Async Best Practices to help you write robust, efficient, 
            and maintainable asynchronous code in C#.
          </p>
        </div>
      </div>
    </LessonLayout>
  );
} 
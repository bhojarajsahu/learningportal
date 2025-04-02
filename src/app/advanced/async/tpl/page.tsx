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

const taskBasicsCode = `using System;
using System.Threading;
using System.Threading.Tasks;

class Program
{
    static async Task Main()
    {
        // Creating and starting a Task
        Task task1 = Task.Run(() => 
        {
            Console.WriteLine("Task 1 is running on thread " + Thread.CurrentThread.ManagedThreadId);
            Thread.Sleep(1000);  // Simulate work
            Console.WriteLine("Task 1 completed");
        });
        
        // Creating a Task with a return value
        Task<int> task2 = Task.Run(() => 
        {
            Console.WriteLine("Task 2 is running on thread " + Thread.CurrentThread.ManagedThreadId);
            Thread.Sleep(2000);  // Simulate longer work
            Console.WriteLine("Task 2 completed");
            return 42;  // Return a value
        });
        
        // Create a task using Task.Factory
        Task task3 = Task.Factory.StartNew(() => 
        {
            Console.WriteLine("Task 3 is running on thread " + Thread.CurrentThread.ManagedThreadId);
            Thread.Sleep(1500);  // Simulate work
            Console.WriteLine("Task 3 completed");
        });
        
        Console.WriteLine("All tasks have been started on the main thread " + 
                         Thread.CurrentThread.ManagedThreadId);
        
        // Wait for tasks to complete
        await Task.WhenAll(task1, task2, task3);
        
        // Access the result of task2
        int result = await task2;
        Console.WriteLine($"Task 2 result: {result}");
        
        Console.WriteLine("All tasks have completed.");
        Console.ReadKey();
    }
}`;

const parallelForCode = `using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

class Program
{
    static void Main()
    {
        const int arraySize = 10000000;
        int[] numbers = Enumerable.Range(1, arraySize).ToArray();
        
        // Sequential processing
        Console.WriteLine("Starting sequential processing...");
        Stopwatch stopwatch = Stopwatch.StartNew();
        
        long sequentialSum = 0;
        for (int i = 0; i < numbers.Length; i++)
        {
            // Perform some CPU-intensive operation (squaring in this example)
            sequentialSum += numbers[i] * numbers[i];
        }
        
        stopwatch.Stop();
        Console.WriteLine($"Sequential processing completed in {stopwatch.ElapsedMilliseconds}ms");
        Console.WriteLine($"Sequential sum: {sequentialSum}");
        
        // Parallel processing with Parallel.For
        Console.WriteLine("\\nStarting parallel processing with Parallel.For...");
        stopwatch.Restart();
        
        long parallelSum = 0;
        Parallel.For(0, numbers.Length, (i) => 
        {
            // Thread-safe addition using Interlocked
            Interlocked.Add(ref parallelSum, numbers[i] * numbers[i]);
        });
        
        stopwatch.Stop();
        Console.WriteLine($"Parallel.For completed in {stopwatch.ElapsedMilliseconds}ms");
        Console.WriteLine($"Parallel sum: {parallelSum}");
        
        // Parallel processing with Parallel.ForEach
        Console.WriteLine("\\nStarting parallel processing with Parallel.ForEach...");
        stopwatch.Restart();
        
        long parallelForEachSum = 0;
        Parallel.ForEach(numbers, (number) => 
        {
            Interlocked.Add(ref parallelForEachSum, number * number);
        });
        
        stopwatch.Stop();
        Console.WriteLine($"Parallel.ForEach completed in {stopwatch.ElapsedMilliseconds}ms");
        Console.WriteLine($"Parallel.ForEach sum: {parallelForEachSum}");
        
        // Demonstrate Parallel.ForEach with more options
        Console.WriteLine("\\nStarting parallel processing with partitioning...");
        stopwatch.Restart();
        
        // Using local state to reduce contention
        ParallelOptions options = new ParallelOptions 
        { 
            MaxDegreeOfParallelism = Environment.ProcessorCount 
        };
        
        long partitionedSum = 0;
        Parallel.ForEach(
            Partitioner.Create(0, numbers.Length),  // Partition the data
            options,                               // Options
            () => 0L,                              // Initialize local state
            (range, state, localSum) =>            // Body with local state
            {
                for (int i = range.Item1; i < range.Item2; i++)
                {
                    localSum += numbers[i] * numbers[i];
                }
                return localSum;
            },
            (localSum) =>                          // Final action per task
            {
                Interlocked.Add(ref partitionedSum, localSum);
            }
        );
        
        stopwatch.Stop();
        Console.WriteLine($"Partitioned approach completed in {stopwatch.ElapsedMilliseconds}ms");
        Console.WriteLine($"Partitioned sum: {partitionedSum}");
        
        Console.ReadKey();
    }
}`;

const parallelLinqCode = `using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;

class Program
{
    static void Main()
    {
        // Create a large dataset to process
        List<Customer> customers = GenerateCustomers(1000000);
        
        Console.WriteLine($"Processing {customers.Count} customer records");
        
        // Sequential LINQ
        Console.WriteLine("\\nRunning sequential LINQ query...");
        Stopwatch stopwatch = Stopwatch.StartNew();
        
        var sequentialResult = customers
            .Where(c => c.Age > 30)
            .Select(c => new 
            {
                Name = c.Name,
                PurchaseTotal = c.Purchases.Sum(p => p.Amount),
                AveragePurchase = c.Purchases.Average(p => p.Amount)
            })
            .OrderByDescending(c => c.PurchaseTotal)
            .Take(5)
            .ToList();
            
        stopwatch.Stop();
        Console.WriteLine($"Sequential LINQ completed in {stopwatch.ElapsedMilliseconds}ms");
        PrintResults(sequentialResult);
        
        // Parallel LINQ (PLINQ)
        Console.WriteLine("\\nRunning parallel LINQ query (PLINQ)...");
        stopwatch.Restart();
        
        var parallelResult = customers
            .AsParallel()                          // Convert to parallel query
            .Where(c => c.Age > 30)
            .Select(c => new 
            {
                Name = c.Name,
                PurchaseTotal = c.Purchases.Sum(p => p.Amount),
                AveragePurchase = c.Purchases.Average(p => p.Amount)
            })
            .OrderByDescending(c => c.PurchaseTotal)
            .Take(5)
            .ToList();
            
        stopwatch.Stop();
        Console.WriteLine($"Parallel LINQ completed in {stopwatch.ElapsedMilliseconds}ms");
        PrintResults(parallelResult);
        
        // PLINQ with more options
        Console.WriteLine("\\nRunning PLINQ with more options...");
        stopwatch.Restart();
        
        var optimizedResult = customers
            .AsParallel()
            .WithDegreeOfParallelism(Environment.ProcessorCount)  // Set parallelism level
            .WithExecutionMode(ParallelExecutionMode.ForceParallelism)  // Force parallelism
            .Where(c => c.Age > 30)
            .Select(c => new 
            {
                Name = c.Name,
                PurchaseTotal = c.Purchases.Sum(p => p.Amount),
                AveragePurchase = c.Purchases.Average(p => p.Amount)
            })
            .OrderByDescending(c => c.PurchaseTotal)
            .Take(5)
            .ToList();
            
        stopwatch.Stop();
        Console.WriteLine($"Optimized PLINQ completed in {stopwatch.ElapsedMilliseconds}ms");
        PrintResults(optimizedResult);
        
        Console.ReadKey();
    }
    
    // Helper method to print results
    static void PrintResults<T>(List<T> results)
    {
        foreach (var item in results)
        {
            Console.WriteLine(item);
        }
    }
    
    // Helper method to generate test data
    static List<Customer> GenerateCustomers(int count)
    {
        Random random = new Random(42);  // For reproducible results
        List<Customer> customers = new List<Customer>();
        
        for (int i = 0; i < count; i++)
        {
            Customer customer = new Customer
            {
                Id = i,
                Name = $"Customer {i}",
                Age = random.Next(18, 80),
                Purchases = new List<Purchase>()
            };
            
            // Add 1-10 purchases for each customer
            int purchaseCount = random.Next(1, 11);
            for (int j = 0; j < purchaseCount; j++)
            {
                customer.Purchases.Add(new Purchase
                {
                    Id = j,
                    Amount = random.Next(10, 1000),
                    Date = DateTime.Now.AddDays(-random.Next(1, 365))
                });
            }
            
            customers.Add(customer);
        }
        
        return customers;
    }
}

// Model classes
class Customer
{
    public int Id { get; set; }
    public string Name { get; set; }
    public int Age { get; set; }
    public List<Purchase> Purchases { get; set; }
}

class Purchase
{
    public int Id { get; set; }
    public decimal Amount { get; set; }
    public DateTime Date { get; set; }
}`;

const taskContinuationsCode = `using System;
using System.Threading;
using System.Threading.Tasks;

class Program
{
    static async Task Main()
    {
        // Basic task continuation
        Console.WriteLine("\\nBasic task continuation example:");
        Task<int> task = Task.Run(() => 
        {
            Console.WriteLine("Initial task running...");
            Thread.Sleep(1000);
            return 42;
        });
        
        // Continue with another task when the first completes
        Task<string> continuationTask = task.ContinueWith(antecedent => 
        {
            int result = antecedent.Result;  // Gets the result from the previous task
            Console.WriteLine($"Continuation task received value: {result}");
            Thread.Sleep(500);
            return $"Processed result: {result * 2}";
        });
        
        string finalResult = await continuationTask;
        Console.WriteLine($"Final result: {finalResult}");
        
        // Handling different task outcomes with continuations
        Console.WriteLine("\\nHandling different task outcomes:");
        Task<int> taskThatMightFail = Task.Run<int>(() => 
        {
            if (DateTime.Now.Millisecond % 2 == 0)
            {
                throw new InvalidOperationException("Task failed by design");
            }
            
            Thread.Sleep(1000);
            return 84;
        });
        
        // Handle successful completion
        Task successContinuation = taskThatMightFail.ContinueWith(
            antecedent => Console.WriteLine($"Task succeeded with result: {antecedent.Result}"),
            TaskContinuationOptions.OnlyOnRanToCompletion);
        
        // Handle failure
        Task failedContinuation = taskThatMightFail.ContinueWith(
            antecedent => Console.WriteLine($"Task failed with exception: {antecedent.Exception.InnerException.Message}"),
            TaskContinuationOptions.OnlyOnFaulted);
        
        // Ensure this runs regardless of success or failure
        Task finalContinuation = taskThatMightFail.ContinueWith(
            antecedent => Console.WriteLine("This runs regardless of task outcome"),
            TaskContinuationOptions.None);
        
        // Wait for all continuations to complete
        await Task.WhenAll(successContinuation, failedContinuation, finalContinuation);
        
        // Chain multiple continuations
        Console.WriteLine("\\nChaining multiple continuations:");
        Task<int> firstTask = Task.Run(() => 
        {
            Console.WriteLine("First task running...");
            Thread.Sleep(500);
            return 10;
        });
        
        // Create a chain of continuations
        Task<int> chainResult = firstTask
            .ContinueWith(t => 
            {
                int value = t.Result;
                Console.WriteLine($"Second task got {value}, doubling it...");
                Thread.Sleep(500);
                return value * 2;
            })
            .ContinueWith(t => 
            {
                int value = t.Result;
                Console.WriteLine($"Third task got {value}, adding 5...");
                Thread.Sleep(500);
                return value + 5;
            })
            .ContinueWith(t => 
            {
                int value = t.Result;
                Console.WriteLine($"Fourth task got {value}, multiplying by 3...");
                Thread.Sleep(500);
                return value * 3;
            });
        
        int chainedResult = await chainResult;
        Console.WriteLine($"Final result of chain: {chainedResult}");
        
        // Using async/await with task continuations
        Console.WriteLine("\\nUsing async/await with continuations:");
        
        Task<int> asyncTask = ComputeValueAsync(10);
        Task<int> asyncContinuation = asyncTask.ContinueWith(async t => 
        {
            int value = await t;
            int result = await ProcessValueAsync(value);
            return result;
        }).Unwrap();  // Unwrap the nested Task
        
        int finalAsyncResult = await asyncContinuation;
        Console.WriteLine($"Final async result: {finalAsyncResult}");
        
        Console.ReadKey();
    }
    
    static async Task<int> ComputeValueAsync(int input)
    {
        Console.WriteLine($"Computing value for {input}...");
        await Task.Delay(1000);  // Simulate async work
        return input * input;
    }
    
    static async Task<int> ProcessValueAsync(int value)
    {
        Console.WriteLine($"Processing value {value}...");
        await Task.Delay(1000);  // Simulate async work
        return value + 50;
    }
}`;

const taskCoordinationCode = `using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

class Program
{
    static async Task Main()
    {
        // Basic Task waiting
        Console.WriteLine("Task waiting examples:\\n");
        
        // WaitAll - wait for multiple tasks to complete
        Task[] tasks = new Task[3];
        
        tasks[0] = Task.Run(() => 
        {
            Console.WriteLine("Task 1 starting...");
            Thread.Sleep(2000);
            Console.WriteLine("Task 1 completed");
        });
        
        tasks[1] = Task.Run(() => 
        {
            Console.WriteLine("Task 2 starting...");
            Thread.Sleep(1000);
            Console.WriteLine("Task 2 completed");
        });
        
        tasks[2] = Task.Run(() => 
        {
            Console.WriteLine("Task 3 starting...");
            Thread.Sleep(3000);
            Console.WriteLine("Task 3 completed");
        });
        
        Console.WriteLine("Waiting for all tasks to complete...");
        await Task.WhenAll(tasks);
        Console.WriteLine("All tasks completed");
        
        // WaitAny - wait for any task to complete
        Console.WriteLine("\\nWaiting for any task to complete...");
        
        Task<int>[] calculationTasks = new Task<int>[3];
        
        calculationTasks[0] = Task.Run(() => 
        {
            Console.WriteLine("Calculation 1 starting...");
            Thread.Sleep(3000);
            Console.WriteLine("Calculation 1 completed");
            return 10;
        });
        
        calculationTasks[1] = Task.Run(() => 
        {
            Console.WriteLine("Calculation 2 starting...");
            Thread.Sleep(1000);
            Console.WriteLine("Calculation 2 completed");
            return 20;
        });
        
        calculationTasks[2] = Task.Run(() => 
        {
            Console.WriteLine("Calculation 3 starting...");
            Thread.Sleep(2000);
            Console.WriteLine("Calculation 3 completed");
            return 30;
        });
        
        // Wait for any task to complete
        int completedTaskIndex = await Task.WhenAny(calculationTasks).ContinueWith(t => Task.WaitAny(calculationTasks));
        Console.WriteLine($"Task {completedTaskIndex + 1} completed first with result: {calculationTasks[completedTaskIndex].Result}");
        
        // Wait for the remaining tasks
        await Task.WhenAll(calculationTasks);
        Console.WriteLine("All calculation tasks completed");
        
        // Barrier example - synchronize multiple tasks
        Console.WriteLine("\\nBarrier example:");
        
        // Create a barrier for 3 participants
        Barrier barrier = new Barrier(3);
        
        Task[] barrierTasks = new Task[3];
        
        for (int i = 0; i < 3; i++)
        {
            int taskId = i + 1;
            barrierTasks[i] = Task.Run(() => 
            {
                // Phase 1
                Console.WriteLine($"Task {taskId} starting phase 1...");
                Thread.Sleep(1000 * taskId);  // Different tasks take different time
                Console.WriteLine($"Task {taskId} completed phase 1, waiting for others...");
                
                barrier.SignalAndWait();  // Wait for all tasks to reach this point
                
                // Phase 2
                Console.WriteLine($"Task {taskId} starting phase 2...");
                Thread.Sleep(1000 * (4 - taskId));  // Different timing for phase 2
                Console.WriteLine($"Task {taskId} completed phase 2, waiting for others...");
                
                barrier.SignalAndWait();  // Wait again
                
                // Phase 3
                Console.WriteLine($"Task {taskId} starting phase 3...");
                Thread.Sleep(500 * taskId);
                Console.WriteLine($"Task {taskId} completed phase 3");
            });
        }
        
        await Task.WhenAll(barrierTasks);
        Console.WriteLine("All barrier tasks completed");
        
        // Semaphore example - limit concurrent access
        Console.WriteLine("\\nSemaphore example:");
        
        // Create a semaphore that allows 2 concurrent tasks
        SemaphoreSlim semaphore = new SemaphoreSlim(2);
        
        Task[] semaphoreTasks = new Task[5];
        
        for (int i = 0; i < 5; i++)
        {
            int taskId = i + 1;
            semaphoreTasks[i] = Task.Run(async () => 
            {
                Console.WriteLine($"Task {taskId} waiting to enter the semaphore...");
                
                await semaphore.WaitAsync();  // Acquire the semaphore
                try
                {
                    Console.WriteLine($"Task {taskId} entered the semaphore.");
                    await Task.Delay(2000);  // Simulate work
                    Console.WriteLine($"Task {taskId} leaving the semaphore.");
                }
                finally
                {
                    semaphore.Release();  // Always release the semaphore
                }
            });
        }
        
        await Task.WhenAll(semaphoreTasks);
        Console.WriteLine("All semaphore tasks completed");
        
        Console.ReadKey();
    }
}`;

export default function TaskParallelLibraryPage() {
  return (
    <LessonLayout 
      title="Task Parallel Library"
      level="advanced"
      sidebarItems={sidebarItems}
      prev={{ href: '/advanced/async/basics', title: 'Async/Await Fundamentals' }}
      next={{ href: '/advanced/async/streams', title: 'Async Streams' }}
    >
      <div className="prose dark:prose-invert max-w-none">
        <h1>Task Parallel Library (TPL) in C#</h1>
        
        <p>
          The Task Parallel Library (TPL) provides a powerful and flexible way to write concurrent and parallel 
          code in C#. Introduced in .NET Framework 4.0, the TPL simplifies the process of adding parallelism
          and concurrency to applications.
        </p>

        <h2>Task Basics</h2>
        
        <p>
          The <code>Task</code> class is the fundamental building block of the TPL. A task represents an 
          asynchronous operation that can be executed in the background.
        </p>

        <CodeEditor 
          initialCode={taskBasicsCode}
          language="csharp"
          readOnly={true}
        />

        <p>
          Key points about Tasks:
        </p>

        <ul>
          <li>A <code>Task</code> represents an asynchronous operation that doesn't return a value</li>
          <li>A <code>Task&lt;T&gt;</code> represents an asynchronous operation that returns a value of type T</li>
          <li>Tasks can be created and started using <code>Task.Run()</code> or <code>Task.Factory.StartNew()</code></li>
          <li>Tasks run asynchronously and can be awaited using the <code>await</code> keyword</li>
          <li>Multiple tasks can be awaited together using <code>Task.WhenAll()</code></li>
        </ul>

        <h2>Parallel.For and Parallel.ForEach</h2>
        
        <p>
          The TPL includes data parallelism constructs that make it easy to parallelize loops:
        </p>

        <CodeEditor 
          initialCode={parallelForCode}
          language="csharp"
          readOnly={true}
        />

        <p>
          Benefits of using Parallel loops:
        </p>

        <ul>
          <li>Easy to use with a similar syntax to regular loops</li>
          <li>Automatically partitions the work across multiple threads</li>
          <li>Handles thread management and work scheduling for you</li>
          <li>Can significantly improve performance for CPU-bound operations on multi-core systems</li>
        </ul>

        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg my-4">
          <p className="font-semibold">Important Considerations:</p>
          <ul className="mt-2">
            <li>Be careful with shared state - use thread-safe approaches like <code>Interlocked</code> or local state</li>
            <li>Not all operations benefit from parallelization - I/O-bound work is usually better with async/await</li>
            <li>There's overhead to creating and managing threads, so very small workloads might perform worse in parallel</li>
          </ul>
        </div>

        <h2>Parallel LINQ (PLINQ)</h2>
        
        <p>
          PLINQ extends LINQ to provide parallel query execution, enabling you to easily parallelize data processing:
        </p>

        <CodeEditor 
          initialCode={parallelLinqCode}
          language="csharp"
          readOnly={true}
        />

        <p>
          Key PLINQ features:
        </p>

        <ul>
          <li>Convert a LINQ query to a parallel query with the <code>AsParallel()</code> extension method</li>
          <li>Control the degree of parallelism with <code>WithDegreeOfParallelism()</code></li>
          <li>Force or disable parallelism with <code>WithExecutionMode()</code></li>
          <li>Customize ordering with <code>AsOrdered()</code> and <code>AsUnordered()</code></li>
          <li>Partition data with <code>Partitioner.Create()</code> for better load balancing</li>
        </ul>

        <h2>Task Continuations</h2>
        
        <p>
          Task continuations allow you to specify additional work to be performed after a task completes:
        </p>

        <CodeEditor 
          initialCode={taskContinuationsCode}
          language="csharp"
          readOnly={true}
        />

        <p>
          Continuations are powerful because they allow you to:
        </p>

        <ul>
          <li>Chain multiple operations together</li>
          <li>Handle different task outcomes (success, failure, cancellation) differently</li>
          <li>Define complex workflows with dependencies between tasks</li>
          <li>Coordinate work between multiple tasks</li>
        </ul>

        <h2>Task Coordination and Synchronization</h2>
        
        <p>
          The TPL provides several mechanisms for coordinating and synchronizing tasks:
        </p>

        <CodeEditor 
          initialCode={taskCoordinationCode}
          language="csharp"
          readOnly={true}
        />

        <p>
          Key coordination constructs:
        </p>

        <ul>
          <li><code>Task.WhenAll</code>: Waits for all tasks to complete</li>
          <li><code>Task.WhenAny</code>: Waits for any of the tasks to complete</li>
          <li><code>Barrier</code>: Synchronizes multiple tasks at a specific point</li>
          <li><code>SemaphoreSlim</code>: Limits the number of concurrent tasks</li>
          <li><code>CountdownEvent</code>: Waits for a specific number of signals</li>
          <li><code>ManualResetEventSlim</code>: Blocks tasks until signaled</li>
        </ul>

        <h2>When to Use the TPL</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <h3 className="text-green-700 dark:text-green-400">Use TPL for:</h3>
            <ul className="mt-2">
              <li>CPU-bound operations (complex calculations, data processing)</li>
              <li>Parallelizing work across multiple cores</li>
              <li>Coordinating complex workflows of interrelated tasks</li>
              <li>Processing large data sets in parallel</li>
              <li>Background processing that needs to report progress</li>
            </ul>
          </div>
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
            <h3 className="text-red-700 dark:text-red-400">Prefer async/await for:</h3>
            <ul className="mt-2">
              <li>I/O-bound operations (network, file system, database)</li>
              <li>Operations that spend most time waiting</li>
              <li>UI responsiveness in client applications</li>
              <li>Simple sequential asynchronous workflows</li>
              <li>Operations that don't benefit from parallelism</li>
            </ul>
          </div>
        </div>

        <h2>Best Practices</h2>
        
        <ul>
          <li><strong>Be careful with shared state</strong>: Concurrent access to shared state can lead to race conditions and other concurrency issues</li>
          <li><strong>Use local state when possible</strong>: Accumulate results locally and then combine them to minimize contention</li>
          <li><strong>Consider the workload size</strong>: Parallelism has overhead; it's most beneficial for larger workloads</li>
          <li><strong>Use proper exception handling</strong>: Tasks throw AggregateException which needs special handling</li>
          <li><strong>Always dispose of cancellation tokens and other disposable synchronization primitives</strong></li>
          <li><strong>Avoid blocking in async code</strong>: Don't use Task.Wait() or Task.Result in async methods</li>
          <li><strong>Test with different processor counts</strong>: Behavior may vary depending on the hardware</li>
        </ul>

        <div className="bg-csharp-blue-50 dark:bg-csharp-blue-900/20 p-4 rounded-lg mt-6">
          <h3 className="text-csharp-blue-700 dark:text-csharp-blue-400">Practice Exercise</h3>
          <p>
            Create a parallel image processing application that:
          </p>
          <ul>
            <li>Loads multiple images from a directory</li>
            <li>Applies various filters (grayscale, blur, etc.) to each image in parallel</li>
            <li>Saves the processed images to an output directory</li>
            <li>Compares the performance between sequential and parallel implementations</li>
          </ul>
          <p>
            Use TPL constructs like Parallel.ForEach, Tasks, and PLINQ to maximize performance.
          </p>
        </div>

        <div className="mt-8">
          <p>
            In the next lesson, we'll explore Async Streams (introduced in C# 8.0), which combine the benefits 
            of asynchronous programming with the simplicity of enumerable collections.
          </p>
        </div>
      </div>
    </LessonLayout>
  );
} 
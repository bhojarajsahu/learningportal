import React from 'react';
import { FiCpu, FiActivity, FiBarChart } from 'react-icons/fi';
import LessonLayout from '@/components/LessonLayout';
import CodeEditor from '@/components/CodeEditor';

const sidebarItems = [
  {
    title: 'Performance Optimization',
    href: '/advanced/performance',
    icon: <FiCpu className="w-4 h-4" />,
    children: [
      { title: 'Memory Management', href: '/advanced/performance/memory' },
      { title: 'Profiling and Diagnostics', href: '/advanced/performance/profiling' },
      { title: 'Caching Strategies', href: '/advanced/performance/caching' },
    ]
  },
];

const garbageCollectionCode = `using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Threading;

namespace MemoryManagementDemo
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("Memory Management Demo");
            Console.WriteLine("---------------------");
            
            // Initial memory usage
            DisplayMemoryUsage("Initial");
            
            // Allocate a large number of objects to fill memory
            Console.WriteLine("Allocating many objects...");
            AllocateObjects();
            
            // Memory usage after allocation
            DisplayMemoryUsage("After allocation");
            
            // Force garbage collection
            Console.WriteLine("Forcing garbage collection...");
            GC.Collect();
            GC.WaitForPendingFinalizers();
            GC.Collect();
            
            // Memory usage after garbage collection
            DisplayMemoryUsage("After garbage collection");
            
            // Demonstrate generations
            Console.WriteLine("\\nDemonstrating GC generations...");
            DemonstrateGenerations();
            
            Console.WriteLine("\\nPress any key to exit...");
            Console.ReadKey();
        }
        
        static void DisplayMemoryUsage(string label)
        {
            // Force a garbage collection to get accurate readings
            GC.Collect();
            GC.WaitForPendingFinalizers();
            GC.Collect();
            
            Console.WriteLine($"\\n{label} memory usage:");
            Console.WriteLine($"  Total allocated memory: {GC.GetTotalMemory(true) / 1024} KB");
            Console.WriteLine($"  Gen 0 collections: {GC.CollectionCount(0)}");
            Console.WriteLine($"  Gen 1 collections: {GC.CollectionCount(1)}");
            Console.WriteLine($"  Gen 2 collections: {GC.CollectionCount(2)}");
        }
        
        static void AllocateObjects()
        {
            var list = new List<byte[]>();
            
            for (int i = 0; i < 100; i++)
            {
                // Allocate a 1MB array
                var data = new byte[1024 * 1024]; 
                list.Add(data);
                
                // Simulate doing work
                for (int j = 0; j < data.Length; j += 1024)
                {
                    data[j] = 1;
                }
                
                Console.Write(".");
                if ((i + 1) % 10 == 0) Console.WriteLine();
            }
            
            Console.WriteLine();
            
            // Clear the list to allow garbage collection
            list.Clear();
        }
        
        static void DemonstrateGenerations()
        {
            // Gen 0 objects
            Console.WriteLine("Creating gen 0 objects...");
            for (int i = 0; i < 10000; i++)
            {
                var obj = new object();
            }
            
            Console.WriteLine($"Gen 0 collections: {GC.CollectionCount(0)}");
            
            // Gen 1 objects
            Console.WriteLine("\\nPromoting objects to gen 1...");
            var gen1Objects = new List<object>();
            for (int i = 0; i < 5000; i++)
            {
                gen1Objects.Add(new object());
            }
            
            // Collect gen 0, promoting surviving objects to gen 1
            GC.Collect(0);
            Console.WriteLine($"Gen 0 collections: {GC.CollectionCount(0)}");
            Console.WriteLine($"Gen 1 collections: {GC.CollectionCount(1)}");
            
            // Gen 2 objects
            Console.WriteLine("\\nPromoting objects to gen 2...");
            // Collect gen 1, promoting surviving objects to gen 2
            GC.Collect(1);
            
            Console.WriteLine($"Gen 0 collections: {GC.CollectionCount(0)}");
            Console.WriteLine($"Gen 1 collections: {GC.CollectionCount(1)}");
            Console.WriteLine($"Gen 2 collections: {GC.CollectionCount(2)}");
            
            // Clear references to allow garbage collection
            gen1Objects.Clear();
        }
    }
}`;

const memoryLeakCode = `using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace MemoryLeakDemo
{
    // Static event handler is a common cause of memory leaks
    public class EventPublisher
    {
        // Static event can cause memory leaks if subscribers don't unsubscribe
        public static event EventHandler<string> SomeEvent;
        
        public void RaiseEvent(string message)
        {
            SomeEvent?.Invoke(this, message);
        }
    }
    
    public class EventSubscriber
    {
        private readonly string _name;
        
        // This class holds a lot of data to demonstrate the impact
        private readonly byte[] _largeData = new byte[1024 * 1024]; // 1MB of data
        
        public EventSubscriber(string name)
        {
            _name = name;
            
            // Subscribe to the static event - if we don't unsubscribe, we'll leak
            EventPublisher.SomeEvent += OnSomeEvent;
            
            // Fill the data with random bytes to prevent optimization
            new Random().NextBytes(_largeData);
        }
        
        private void OnSomeEvent(object sender, string message)
        {
            // Just to use the large data so it isn't optimized away
            var sum = _largeData.Take(100).Sum(b => b);
            Console.WriteLine($"{_name} received: {message}, data checksum: {sum}");
        }
        
        // Proper cleanup - this must be called to prevent the leak
        public void Dispose()
        {
            // Unsubscribe from the event
            EventPublisher.SomeEvent -= OnSomeEvent;
        }
    }
    
    class Program
    {
        static List<EventSubscriber> _leakedSubscribers = new List<EventSubscriber>();
        static List<EventSubscriber> _properlyDisposedSubscribers = new List<EventSubscriber>();
        
        static async Task Main(string[] args)
        {
            Console.WriteLine("Memory Leak Demonstration");
            Console.WriteLine("------------------------");
            
            var publisher = new EventPublisher();
            
            // Initial memory snapshot
            DisplayMemoryUsage("Initial");
            
            // Scenario 1: Creating subscribers without disposing them (memory leak)
            Console.WriteLine("\\nScenario 1: Creating subscribers without disposing them");
            CreateLeakySubscribers(publisher, 100);
            
            // Memory after leaky allocations
            DisplayMemoryUsage("After creating leaky subscribers");
            
            // Scenario 2: Creating subscribers and properly disposing them
            Console.WriteLine("\\nScenario 2: Creating subscribers and properly disposing them");
            CreateAndDisposeSubscribers(publisher, 100);
            
            // Memory after proper disposal
            DisplayMemoryUsage("After creating and disposing subscribers");
            
            // Try to force garbage collection to see the difference
            Console.WriteLine("\\nForcing garbage collection...");
            ForceGarbageCollection();
            
            // Memory after garbage collection
            DisplayMemoryUsage("After garbage collection");
            
            // Show that leaky subscribers still receive events
            Console.WriteLine("\\nRaising event to show leaky subscribers still exist in memory...");
            publisher.RaiseEvent("Hello, leaky subscribers!");
            
            // Clear the subscribers reference to finally release them
            Console.WriteLine("\\nReleasing references to leaky subscribers...");
            _leakedSubscribers.Clear();
            
            // Final garbage collection
            Console.WriteLine("\\nFinal garbage collection...");
            ForceGarbageCollection();
            DisplayMemoryUsage("Final");
            
            Console.WriteLine("\\nPress any key to exit...");
            Console.ReadKey();
        }
        
        static void CreateLeakySubscribers(EventPublisher publisher, int count)
        {
            for (int i = 0; i < count; i++)
            {
                var subscriber = new EventSubscriber($"Leaky #{i}");
                _leakedSubscribers.Add(subscriber);
                
                if (i % 10 == 0)
                    publisher.RaiseEvent($"Event at creation {i}");
            }
            
            Console.WriteLine($"Created {count} subscribers without disposing them");
        }
        
        static void CreateAndDisposeSubscribers(EventPublisher publisher, int count)
        {
            for (int i = 0; i < count; i++)
            {
                var subscriber = new EventSubscriber($"Disposed #{i}");
                _properlyDisposedSubscribers.Add(subscriber);
                
                if (i % 10 == 0)
                    publisher.RaiseEvent($"Event at creation {i}");
                
                // Properly dispose of the subscriber
                subscriber.Dispose();
            }
            
            // Clear the list of properly disposed subscribers
            _properlyDisposedSubscribers.Clear();
            Console.WriteLine($"Created {count} subscribers and disposed them properly");
        }
        
        static void DisplayMemoryUsage(string label)
        {
            Console.WriteLine($"\\n{label} memory usage:");
            Console.WriteLine($"  Total allocated memory: {GC.GetTotalMemory(false) / 1024} KB");
        }
        
        static void ForceGarbageCollection()
        {
            GC.Collect();
            GC.WaitForPendingFinalizers();
            GC.Collect();
        }
    }
}`;

const disposePatternCode = `using System;
using System.IO;

namespace DisposablePatternDemo
{
    // Simple implementation of IDisposable pattern
    public class SimpleDisposable : IDisposable
    {
        // Flag to track whether Dispose has been called
        private bool _disposed = false;
        
        // Resource that needs cleanup
        private FileStream _fileStream;
        
        public SimpleDisposable(string filePath)
        {
            // Acquire the resource
            _fileStream = new FileStream(filePath, FileMode.Create);
            Console.WriteLine("Resource acquired");
        }
        
        // Implementation of IDisposable
        public void Dispose()
        {
            Dispose(true);
            // Tell the GC not to call the finalizer since we've already cleaned up
            GC.SuppressFinalize(this);
        }
        
        // Protected implementation of Dispose pattern
        protected virtual void Dispose(bool disposing)
        {
            if (_disposed)
                return;
                
            if (disposing)
            {
                // Free managed resources
                if (_fileStream != null)
                {
                    _fileStream.Dispose();
                    _fileStream = null;
                    Console.WriteLine("Managed resource disposed");
                }
            }
            
            // Free unmanaged resources
            // ...
            
            _disposed = true;
        }
        
        // Finalizer
        ~SimpleDisposable()
        {
            Console.WriteLine("Finalizer called");
            Dispose(false);
        }
        
        // Example method that uses the resource
        public void WriteData(string data)
        {
            if (_disposed)
                throw new ObjectDisposedException(nameof(SimpleDisposable));
                
            var bytes = System.Text.Encoding.UTF8.GetBytes(data);
            _fileStream.Write(bytes, 0, bytes.Length);
            Console.WriteLine($"Wrote {bytes.Length} bytes to stream");
        }
    }
    
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("IDisposable Pattern Demonstration");
            Console.WriteLine("--------------------------------");
            
            // Proper usage with using statement (automatically calls Dispose)
            Console.WriteLine("\\nExample 1: Proper usage with 'using' statement");
            ProperDisposalWithUsing();
            
            // Proper usage with try-finally
            Console.WriteLine("\\nExample 2: Proper usage with try-finally");
            ProperDisposalWithTryFinally();
            
            // Improper usage without Dispose
            Console.WriteLine("\\nExample 3: Improper usage without Dispose");
            ImproperDisposal();
            
            // Force garbage collection to see finalizer in action
            Console.WriteLine("\\nForcing garbage collection to demonstrate finalizer...");
            GC.Collect();
            GC.WaitForPendingFinalizers();
            
            Console.WriteLine("\\nPress any key to exit...");
            Console.ReadKey();
        }
        
        static void ProperDisposalWithUsing()
        {
            // The using statement ensures Dispose is called even if an exception occurs
            using (var resource = new SimpleDisposable("file1.tmp"))
            {
                resource.WriteData("Hello, world!");
            } // Dispose is automatically called here
            
            Console.WriteLine("Resource properly disposed with 'using' statement");
        }
        
        static void ProperDisposalWithTryFinally()
        {
            SimpleDisposable resource = null;
            try
            {
                resource = new SimpleDisposable("file2.tmp");
                resource.WriteData("Hello from try-finally!");
            }
            finally
            {
                // This ensures Dispose is called even if an exception occurs
                resource?.Dispose();
                Console.WriteLine("Resource properly disposed with try-finally");
            }
        }
        
        static void ImproperDisposal()
        {
            // BAD: No using statement or explicit Dispose call
            var resource = new SimpleDisposable("file3.tmp");
            resource.WriteData("This resource won't be disposed properly");
            
            // The resource will eventually be garbage collected,
            // but the finalizer is non-deterministic and might delay cleanup
            Console.WriteLine("Resource not explicitly disposed");
        }
    }
}`;

export default function MemoryManagementPage() {
  return (
    <LessonLayout 
      title="Memory Management"
      level="advanced"
      sidebarItems={sidebarItems}
      next={{ href: '/advanced/performance/profiling', title: 'Profiling and Diagnostics' }}
    >
      <div className="prose dark:prose-invert max-w-none">
        <h1>Memory Management in C#</h1>
        
        <p>
          Understanding memory management is crucial for building high-performance, scalable C# applications.
          While the .NET runtime provides automatic memory management through the garbage collector,
          knowing how it works and how to optimize your code for efficient memory usage is essential for advanced developers.
        </p>

        <h2>The .NET Garbage Collector</h2>
        
        <p>
          The garbage collector (GC) is the automatic memory manager in .NET. It allocates and releases memory for your application and handles the lifetime of objects.
        </p>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg my-4">
          <h3 className="text-xl font-semibold">Key Features of the Garbage Collector</h3>
          <ul className="mt-2">
            <li><strong>Automatic memory allocation</strong> - Efficiently allocates memory from the managed heap</li>
            <li><strong>Automatic memory reclamation</strong> - Frees memory when objects are no longer in use</li>
            <li><strong>Memory defragmentation</strong> - Compacts memory to reduce fragmentation</li>
            <li><strong>Generational garbage collection</strong> - Divides objects into generations for more efficient collection</li>
            <li><strong>Background garbage collection</strong> - Performs collection on a separate thread in some cases</li>
          </ul>
        </div>

        <h3>Garbage Collection Generations</h3>
        
        <p>
          The .NET GC divides the managed heap into three generations to optimize collection:
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h4 className="text-gray-700 dark:text-gray-300 font-semibold">Generation 0</h4>
            <p className="mt-2">
              Contains newly allocated objects. Gen 0 collections are frequent and fast.
              Objects that survive a Gen 0 collection are promoted to Gen 1.
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h4 className="text-gray-700 dark:text-gray-300 font-semibold">Generation 1</h4>
            <p className="mt-2">
              Contains objects that survived a Gen 0 collection.
              Objects that survive a Gen 1 collection are promoted to Gen 2.
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h4 className="text-gray-700 dark:text-gray-300 font-semibold">Generation 2</h4>
            <p className="mt-2">
              Contains long-lived objects. Gen 2 collections are less frequent but more expensive.
              Large objects (≥85KB) are placed directly in the Large Object Heap (LOH).
            </p>
          </div>
        </div>

        <p>
          Let's look at a demonstration of garbage collection and generations:
        </p>

        <CodeEditor 
          initialCode={garbageCollectionCode}
          language="csharp"
          readOnly={true}
        />

        <h2>Common Memory Issues</h2>
        
        <p>
          Despite automatic garbage collection, memory issues can still occur in C# applications.
          Understanding these issues and how to prevent them is essential for robust applications.
        </p>

        <h3>Memory Leaks</h3>
        
        <p>
          In .NET, memory leaks typically occur when objects that are no longer needed remain
          referenced, preventing the garbage collector from reclaiming them.
        </p>

        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg my-4">
          <h4 className="text-yellow-700 dark:text-yellow-400 font-semibold">Common Causes of Memory Leaks</h4>
          <ul className="mt-2">
            <li>Static references that keep objects alive for the application's lifetime</li>
            <li>Event handlers that aren't unsubscribed</li>
            <li>Long-lived caches without proper eviction policies</li>
            <li>Improper use of disposable resources</li>
            <li>Captured variables in closures</li>
          </ul>
        </div>

        <p>
          Here's a demonstration of a common memory leak pattern and how to fix it:
        </p>

        <CodeEditor 
          initialCode={memoryLeakCode}
          language="csharp"
          readOnly={true}
        />

        <h3>The IDisposable Pattern</h3>
        
        <p>
          Proper resource management is crucial for preventing memory leaks, especially when working with
          unmanaged resources. The IDisposable pattern provides a standard way to release resources.
        </p>

        <CodeEditor 
          initialCode={disposePatternCode}
          language="csharp"
          readOnly={true}
        />

        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg my-4">
          <h4 className="text-green-700 dark:text-green-400 font-semibold">Best Practices for Disposable Resources</h4>
          <ul className="mt-2">
            <li>Always use the <code>using</code> statement or <code>using</code> declaration with IDisposable objects</li>
            <li>Implement the full Dispose pattern when creating classes that use unmanaged resources</li>
            <li>Call Dispose explicitly when not using the <code>using</code> statement</li>
            <li>Implement finalizers as a safety net, but don't rely on them for timely cleanup</li>
            <li>Remember that finalizers run on the finalizer thread and can impact performance</li>
          </ul>
        </div>

        <h2>Memory Optimization Techniques</h2>
        
        <p>
          Beyond understanding and avoiding memory issues, there are techniques you can use to optimize
          memory usage in your C# applications.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <h4 className="text-blue-700 dark:text-blue-400 font-semibold">Value Types vs Reference Types</h4>
            <ul className="mt-2">
              <li>Use value types (structs) for small, immutable objects</li>
              <li>Consider <code>struct</code> for data-heavy collections</li>
              <li>Be aware of boxing and unboxing performance costs</li>
              <li>Use <code>readonly struct</code> to prevent defensive copies</li>
              <li>Use <code>Span&lt;T&gt;</code> and <code>Memory&lt;T&gt;</code> for efficient memory access</li>
            </ul>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <h4 className="text-blue-700 dark:text-blue-400 font-semibold">Object Pooling</h4>
            <ul className="mt-2">
              <li>Reuse objects instead of repeatedly creating and discarding them</li>
              <li>Use <code>Microsoft.Extensions.ObjectPool</code> for easy implementation</li>
              <li>Consider custom pools for application-specific objects</li>
              <li>Reset object state when returning to the pool</li>
              <li>Use <code>ArrayPool&lt;T&gt;</code> for efficient array reuse</li>
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <h4 className="text-blue-700 dark:text-blue-400 font-semibold">Large Object Heap (LOH) Considerations</h4>
            <ul className="mt-2">
              <li>Avoid frequent allocations of large objects (≥85KB)</li>
              <li>Pool large objects to reduce LOH fragmentation</li>
              <li>Use <code>ArrayPool&lt;T&gt;</code> for large arrays</li>
              <li>Consider <code>GC.TryStartNoGCRegion</code> for critical sections</li>
              <li>Be aware that LOH is not compacted by default</li>
            </ul>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <h4 className="text-blue-700 dark:text-blue-400 font-semibold">String Optimization</h4>
            <ul className="mt-2">
              <li>Use <code>StringBuilder</code> for building strings with multiple operations</li>
              <li>Use string interning for frequently used strings</li>
              <li>Avoid unnecessary string concatenations</li>
              <li>Use <code>StringPool</code> for custom string pooling</li>
              <li>Consider <code>ReadOnlySpan&lt;char&gt;</code> for string processing</li>
            </ul>
          </div>
        </div>

        <h2>Memory Profiling Tools</h2>
        
        <p>
          Identifying memory issues in real-world applications requires specialized tools. Several
          profiling tools can help you analyze memory usage and detect potential problems.
        </p>

        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg my-4">
          <h4 className="text-gray-700 dark:text-gray-300 font-semibold">Popular Memory Profiling Tools</h4>
          <ul className="mt-2">
            <li><strong>Visual Studio Diagnostics Tools</strong> - Built-in memory usage analyzer</li>
            <li><strong>dotMemory (JetBrains)</strong> - Comprehensive .NET memory profiler</li>
            <li><strong>ANTS Memory Profiler (Redgate)</strong> - Detailed memory analysis</li>
            <li><strong>PerfView</strong> - Free, powerful but complex performance analysis tool</li>
            <li><strong>Diagnostics Client API</strong> - For runtime monitoring of memory usage</li>
          </ul>
        </div>

        <div className="bg-csharp-blue-50 dark:bg-csharp-blue-900/20 p-4 rounded-lg mt-6">
          <h3 className="text-csharp-blue-700 dark:text-csharp-blue-400">Practice Exercise</h3>
          <p>
            Implement a custom object pool for a class that represents a database connection:
          </p>
          <ol className="mt-2">
            <li>Create a <code>DatabaseConnection</code> class that implements <code>IDisposable</code></li>
            <li>Implement a <code>ConnectionPool</code> class that manages a pool of connections</li>
            <li>Add methods to get and return connections to the pool</li>
            <li>Ensure proper cleanup of connections when the pool is disposed</li>
            <li>Write a sample program that demonstrates the performance difference between pooled and non-pooled connections</li>
          </ol>
          <p className="mt-2">
            This exercise will help you understand object pooling and resource management, which are essential
            techniques for optimizing memory usage in high-performance applications.
          </p>
        </div>

        <div className="mt-8">
          <p>
            Understanding memory management in .NET allows you to build more efficient, scalable applications.
            By avoiding common memory pitfalls and applying optimization techniques, you can significantly
            improve your application's performance and reliability.
          </p>
        </div>
      </div>
    </LessonLayout>
  );
} 
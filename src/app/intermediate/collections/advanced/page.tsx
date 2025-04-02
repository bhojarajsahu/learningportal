import React from 'react';
import { FiPackage, FiDatabase, FiFilter } from 'react-icons/fi';
import LessonLayout from '@/components/LessonLayout';
import CodeEditor from '@/components/CodeEditor';

const sidebarItems = [
  {
    title: 'Collections and Generics',
    href: '/intermediate/collections',
    icon: <FiPackage className="w-4 h-4" />,
    children: [
      { title: 'Generic Types and Methods', href: '/intermediate/collections/generics' },
      { title: 'Advanced Collections', href: '/intermediate/collections/advanced' },
      { title: 'LINQ Fundamentals', href: '/intermediate/collections/linq' },
    ]
  },
];

const specializedCollectionsCode = `using System;
using System.Collections.Generic;

class Program
{
    static void Main(string[] args)
    {
        // Stack<T> - Last In, First Out (LIFO) collection
        Console.WriteLine("Stack Example:");
        Stack<string> stack = new Stack<string>();
        
        // Push items onto the stack
        stack.Push("First");
        stack.Push("Second");
        stack.Push("Third");
        
        // Peek at the top item (doesn't remove it)
        Console.WriteLine($"Top item: {stack.Peek()}");
        
        // Pop items from the stack
        Console.WriteLine("\\nPopping items:");
        while (stack.Count > 0)
        {
            Console.WriteLine(stack.Pop());
        }
        
        // Queue<T> - First In, First Out (FIFO) collection
        Console.WriteLine("\\nQueue Example:");
        Queue<string> queue = new Queue<string>();
        
        // Enqueue items to the queue
        queue.Enqueue("First");
        queue.Enqueue("Second");
        queue.Enqueue("Third");
        
        // Peek at the first item (doesn't remove it)
        Console.WriteLine($"First item: {queue.Peek()}");
        
        // Dequeue items from the queue
        Console.WriteLine("\\nDequeuing items:");
        while (queue.Count > 0)
        {
            Console.WriteLine(queue.Dequeue());
        }
        
        Console.ReadKey();
    }
}`;

const linkedListCode = `using System;
using System.Collections.Generic;

class Program
{
    static void Main(string[] args)
    {
        // Create a LinkedList
        LinkedList<string> linkedList = new LinkedList<string>();
        
        // Add nodes to the LinkedList
        linkedList.AddLast("Orange");
        linkedList.AddLast("Mango");
        linkedList.AddFirst("Apple");  // Will be the first element
        
        // Get the first node
        LinkedListNode<string> firstNode = linkedList.First;
        Console.WriteLine($"First node: {firstNode.Value}");
        
        // Add after a specific node
        linkedList.AddAfter(firstNode, "Banana");
        
        // Display all elements
        Console.WriteLine("\\nLinkedList elements:");
        foreach (string fruit in linkedList)
        {
            Console.WriteLine(fruit);
        }
        
        // Find a node
        LinkedListNode<string> mangoNode = linkedList.Find("Mango");
        if (mangoNode != null)
        {
            Console.WriteLine($"\\nFound: {mangoNode.Value}");
            
            // Add before this node
            linkedList.AddBefore(mangoNode, "Kiwi");
            
            // Remove this node
            linkedList.Remove(mangoNode);
        }
        
        // Display after modifications
        Console.WriteLine("\\nAfter modifications:");
        foreach (string fruit in linkedList)
        {
            Console.WriteLine(fruit);
        }
        
        // Clear the LinkedList
        linkedList.Clear();
        Console.WriteLine($"\\nCount after Clear(): {linkedList.Count}");
        
        Console.ReadKey();
    }
}`;

const hashSetCode = `using System;
using System.Collections.Generic;

class Program
{
    static void Main(string[] args)
    {
        // Create a HashSet (unordered collection of unique elements)
        HashSet<string> fruits = new HashSet<string>();
        
        // Add elements
        fruits.Add("Apple");
        fruits.Add("Banana");
        fruits.Add("Orange");
        fruits.Add("Apple");  // Duplicate, will be ignored
        
        // Display count and elements
        Console.WriteLine($"Count: {fruits.Count}");  // Will be 3, not 4
        Console.WriteLine("Elements:");
        foreach (string fruit in fruits)
        {
            Console.WriteLine(fruit);
        }
        
        // Check if an element exists
        Console.WriteLine($"\\nContains 'Banana': {fruits.Contains("Banana")}");
        Console.WriteLine($"Contains 'Mango': {fruits.Contains("Mango")}");
        
        // Set operations
        HashSet<string> moreFruits = new HashSet<string> { "Orange", "Mango", "Pineapple" };
        
        // Union (combines both sets, no duplicates)
        fruits.UnionWith(moreFruits);
        Console.WriteLine("\\nAfter Union:");
        foreach (string fruit in fruits)
        {
            Console.WriteLine(fruit);
        }
        
        // Create two sets for more operations
        HashSet<string> set1 = new HashSet<string> { "A", "B", "C", "D" };
        HashSet<string> set2 = new HashSet<string> { "C", "D", "E", "F" };
        
        // Make a copy for each operation
        HashSet<string> intersectSet = new HashSet<string>(set1);
        HashSet<string> exceptSet = new HashSet<string>(set1);
        
        // Intersection (elements in both sets)
        intersectSet.IntersectWith(set2);
        Console.WriteLine("\\nIntersection of set1 and set2:");
        foreach (string item in intersectSet)
        {
            Console.WriteLine(item);
        }
        
        // Except (elements in first set but not in second)
        exceptSet.ExceptWith(set2);
        Console.WriteLine("\\nElements in set1 but not in set2:");
        foreach (string item in exceptSet)
        {
            Console.WriteLine(item);
        }
        
        Console.ReadKey();
    }
}`;

const sortedCollectionsCode = `using System;
using System.Collections.Generic;

class Program
{
    static void Main(string[] args)
    {
        // SortedList<TKey, TValue> - Sorted by key
        Console.WriteLine("SortedList Example:");
        SortedList<string, int> sortedScores = new SortedList<string, int>();
        
        // Add items (will be sorted by key automatically)
        sortedScores.Add("Charlie", 85);
        sortedScores.Add("Alice", 95);
        sortedScores.Add("Bob", 90);
        sortedScores.Add("David", 80);
        
        // Display all items (will be in alphabetical order by name)
        foreach (KeyValuePair<string, int> score in sortedScores)
        {
            Console.WriteLine($"{score.Key}: {score.Value}");
        }
        
        // SortedSet<T> - Sorted collection of unique elements
        Console.WriteLine("\\nSortedSet Example:");
        SortedSet<int> sortedNumbers = new SortedSet<int>();
        
        // Add items (will be sorted automatically)
        sortedNumbers.Add(5);
        sortedNumbers.Add(1);
        sortedNumbers.Add(3);
        sortedNumbers.Add(2);
        sortedNumbers.Add(4);
        sortedNumbers.Add(3);  // Duplicate, will be ignored
        
        // Display all items (will be in ascending order)
        Console.WriteLine("Numbers in ascending order:");
        foreach (int number in sortedNumbers)
        {
            Console.WriteLine(number);
        }
        
        // SortedDictionary<TKey, TValue> - Dictionary sorted by key
        Console.WriteLine("\\nSortedDictionary Example:");
        SortedDictionary<string, string> sortedFruits = new SortedDictionary<string, string>();
        
        // Add items
        sortedFruits.Add("banana", "yellow");
        sortedFruits.Add("apple", "red");
        sortedFruits.Add("orange", "orange");
        
        // Display all items (will be in alphabetical order by key)
        foreach (KeyValuePair<string, string> fruit in sortedFruits)
        {
            Console.WriteLine($"{fruit.Key}: {fruit.Value}");
        }
        
        Console.ReadKey();
    }
}`;

const concurrentCollectionsCode = `using System;
using System.Collections.Concurrent;
using System.Threading.Tasks;

class Program
{
    static void Main(string[] args)
    {
        // ConcurrentDictionary - Thread-safe dictionary
        ConcurrentDictionary<int, string> concurrentDict = new ConcurrentDictionary<int, string>();
        
        // Add items using multiple threads
        Parallel.For(0, 10, i => {
            // GetOrAdd - atomically adds a key/value pair if the key does not exist
            string threadInfo = $"Added by thread {Task.CurrentId}";
            concurrentDict.GetOrAdd(i, threadInfo);
            Console.WriteLine($"Added {i} on thread {Task.CurrentId}");
        });
        
        // Display all items
        Console.WriteLine("\\nDictionary contents:");
        foreach (var item in concurrentDict)
        {
            Console.WriteLine($"Key {item.Key}: {item.Value}");
        }
        
        // ConcurrentQueue - Thread-safe queue
        ConcurrentQueue<int> concurrentQueue = new ConcurrentQueue<int>();
        
        // Enqueue items using multiple threads
        Parallel.For(0, 10, i => {
            concurrentQueue.Enqueue(i);
            Console.WriteLine($"Enqueued {i} on thread {Task.CurrentId}");
        });
        
        // Dequeue items
        Console.WriteLine("\\nDequeuing items:");
        while (!concurrentQueue.IsEmpty)
        {
            if (concurrentQueue.TryDequeue(out int item))
            {
                Console.WriteLine($"Dequeued: {item}");
            }
        }
        
        // ConcurrentBag - Thread-safe, unordered collection
        ConcurrentBag<int> concurrentBag = new ConcurrentBag<int>();
        
        // Add items using multiple threads
        Parallel.For(0, 10, i => {
            concurrentBag.Add(i);
            Console.WriteLine($"Added {i} to bag on thread {Task.CurrentId}");
        });
        
        // Take items
        Console.WriteLine("\\nTaking items from bag:");
        while (!concurrentBag.IsEmpty)
        {
            if (concurrentBag.TryTake(out int item))
            {
                Console.WriteLine($"Took: {item}");
            }
        }
        
        Console.ReadKey();
    }
}`;

export default function AdvancedCollectionsPage() {
  return (
    <LessonLayout 
      title="Advanced Collections"
      level="intermediate"
      sidebarItems={sidebarItems}
      prev={{ href: '/intermediate/collections/generics', title: 'Generic Types and Methods' }}
      next={{ href: '/intermediate/collections/linq', title: 'LINQ Fundamentals' }}
    >
      <div className="prose dark:prose-invert max-w-none">
        <h1>Advanced Collections in C#</h1>
        
        <p>
          .NET provides a rich set of specialized collection types that go beyond the basic List and Dictionary.
          These advanced collections are designed for specific scenarios and can significantly improve your code's
          performance, readability, and maintainability when used appropriately.
        </p>

        <h2>Specialized Collections: Stack and Queue</h2>
        
        <p>
          The <code>Stack&lt;T&gt;</code> and <code>Queue&lt;T&gt;</code> classes provide specialized collections for 
          LIFO (Last In, First Out) and FIFO (First In, First Out) operations, respectively.
        </p>

        <CodeEditor 
          initialCode={specializedCollectionsCode}
          language="csharp"
          readOnly={true}
        />

        <p>
          When to use these collections:
        </p>

        <ul>
          <li><strong>Stack&lt;T&gt;</strong>: Use for algorithms that need to process items in reverse order, like undo operations, expression evaluation, or depth-first traversal</li>
          <li><strong>Queue&lt;T&gt;</strong>: Use for processing items in the order they were received, like job queues, breadth-first traversal, or buffering</li>
        </ul>

        <h2>LinkedList&lt;T&gt;</h2>
        
        <p>
          <code>LinkedList&lt;T&gt;</code> is a doubly-linked list implementation that allows for efficient insertions and removals anywhere in the list.
        </p>

        <CodeEditor 
          initialCode={linkedListCode}
          language="csharp"
          readOnly={true}
        />

        <p>
          Advantages of LinkedList&lt;T&gt;:
        </p>

        <ul>
          <li>O(1) insertions and removals at any position (when you have a node reference)</li>
          <li>Efficient for frequent insertions and removals in the middle of the collection</li>
          <li>No need to resize or shift elements when adding or removing items</li>
        </ul>

        <p>
          Disadvantages:
        </p>

        <ul>
          <li>O(n) access time for random access (no indexing)</li>
          <li>Higher memory overhead due to node references</li>
          <li>Less cache-friendly than array-based collections</li>
        </ul>

        <h2>HashSet&lt;T&gt;</h2>
        
        <p>
          <code>HashSet&lt;T&gt;</code> is an unordered collection of unique elements that provides fast lookups and set operations.
        </p>

        <CodeEditor 
          initialCode={hashSetCode}
          language="csharp"
          readOnly={true}
        />

        <p>
          HashSet&lt;T&gt; is ideal for:
        </p>

        <ul>
          <li>Checking if an element is in a collection (Contains is O(1) on average)</li>
          <li>Ensuring elements are unique</li>
          <li>Set operations like union, intersection, and difference</li>
        </ul>

        <h2>Sorted Collections</h2>
        
        <p>
          .NET provides several collections that automatically maintain their elements in sorted order:
        </p>

        <CodeEditor 
          initialCode={sortedCollectionsCode}
          language="csharp"
          readOnly={true}
        />

        <p>
          When to use sorted collections:
        </p>

        <ul>
          <li><strong>SortedList&lt;TKey, TValue&gt;</strong>: When you need a sorted key-value collection with memory efficiency</li>
          <li><strong>SortedDictionary&lt;TKey, TValue&gt;</strong>: When you need a sorted key-value collection with faster insertions and removals</li>
          <li><strong>SortedSet&lt;T&gt;</strong>: When you need a sorted collection of unique elements with fast lookup</li>
        </ul>

        <h2>Concurrent Collections</h2>
        
        <p>
          The <code>System.Collections.Concurrent</code> namespace provides thread-safe collection classes that enable safe and efficient concurrent access from multiple threads.
        </p>

        <CodeEditor 
          initialCode={concurrentCollectionsCode}
          language="csharp"
          readOnly={true}
        />

        <p>
          Key concurrent collections include:
        </p>

        <ul>
          <li><strong>ConcurrentDictionary&lt;TKey, TValue&gt;</strong>: Thread-safe dictionary with atomic operations</li>
          <li><strong>ConcurrentQueue&lt;T&gt;</strong>: Thread-safe FIFO collection</li>
          <li><strong>ConcurrentStack&lt;T&gt;</strong>: Thread-safe LIFO collection</li>
          <li><strong>ConcurrentBag&lt;T&gt;</strong>: Thread-safe unordered collection optimized for scenarios where the same thread adds and removes items</li>
          <li><strong>BlockingCollection&lt;T&gt;</strong>: Provides blocking and bounding capabilities for thread-safe collections</li>
        </ul>

        <h2>Collection Selection Guide</h2>
        
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border p-2">When you need...</th>
              <th className="border p-2">Consider using...</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border p-2">A general-purpose collection</td>
              <td className="border p-2">List&lt;T&gt;</td>
            </tr>
            <tr>
              <td className="border p-2">Key-value lookup</td>
              <td className="border p-2">Dictionary&lt;TKey, TValue&gt;</td>
            </tr>
            <tr>
              <td className="border p-2">Unique elements</td>
              <td className="border p-2">HashSet&lt;T&gt;</td>
            </tr>
            <tr>
              <td className="border p-2">LIFO (Last In, First Out) behavior</td>
              <td className="border p-2">Stack&lt;T&gt;</td>
            </tr>
            <tr>
              <td className="border p-2">FIFO (First In, First Out) behavior</td>
              <td className="border p-2">Queue&lt;T&gt;</td>
            </tr>
            <tr>
              <td className="border p-2">Frequent insertions/removals in the middle</td>
              <td className="border p-2">LinkedList&lt;T&gt;</td>
            </tr>
            <tr>
              <td className="border p-2">Sorted elements</td>
              <td className="border p-2">SortedSet&lt;T&gt;</td>
            </tr>
            <tr>
              <td className="border p-2">Sorted key-value pairs</td>
              <td className="border p-2">SortedDictionary&lt;TKey, TValue&gt;</td>
            </tr>
            <tr>
              <td className="border p-2">Thread-safe operations</td>
              <td className="border p-2">Concurrent collections</td>
            </tr>
          </tbody>
        </table>

        <div className="bg-csharp-blue-50 dark:bg-csharp-blue-900/20 p-4 rounded-lg mt-6">
          <h3 className="text-csharp-blue-700 dark:text-csharp-blue-400">Practice Exercise</h3>
          <p>
            Create a simple document management system that uses different collection types:
          </p>
          <ul>
            <li>Use a <code>Dictionary&lt;string, Document&gt;</code> to store documents by ID</li>
            <li>Use a <code>SortedDictionary&lt;DateTime, List&lt;string&gt;&gt;</code> to track documents by creation date</li>
            <li>Use a <code>Queue&lt;Document&gt;</code> to implement a print queue</li>
            <li>Use a <code>HashSet&lt;string&gt;</code> to track unique tags across all documents</li>
          </ul>
          <p>
            Create the <code>Document</code> class with properties for ID, Title, Content, CreationDate, and Tags.
            Implement methods to add, retrieve, and queue documents for printing.
          </p>
        </div>

        <div className="mt-8">
          <p>
            In the next lesson, we'll explore LINQ (Language Integrated Query), a powerful feature that makes 
            working with collections even more efficient and expressive.
          </p>
        </div>
      </div>
    </LessonLayout>
  );
} 
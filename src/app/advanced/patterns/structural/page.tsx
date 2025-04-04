import React from 'react';
import { FiGitMerge, FiCheckCircle, FiInfo, FiCode } from 'react-icons/fi';
import LessonLayout from '@/components/LessonLayout';
import CodeEditor from '@/components/CodeEditor';

const sidebarItems = [
  {
    title: 'Design Patterns',
    href: '/advanced/patterns',
    icon: <FiGitMerge className="w-4 h-4" />,
    children: [
      { title: 'Creational Patterns', href: '/advanced/patterns/creational' },
      { title: 'Structural Patterns', href: '/advanced/patterns/structural' },
      { title: 'Behavioral Patterns', href: '/advanced/patterns/behavioral' },
    ]
  },
];

const adapterCode = `using System;

namespace DesignPatterns.Structural
{
    // The 'Target' interface
    public interface ITarget
    {
        string Request();
    }
    
    // The 'Adaptee' class with incompatible interface
    public class Adaptee
    {
        public string SpecificRequest()
        {
            return "Specific request from Adaptee";
        }
    }
    
    // The 'Adapter' class
    public class Adapter : ITarget
    {
        private readonly Adaptee _adaptee;
        
        public Adapter(Adaptee adaptee)
        {
            _adaptee = adaptee;
        }
        
        public string Request()
        {
            // Translate the Target's Request into Adaptee's SpecificRequest
            return $"Adapter: Translating request to -> {_adaptee.SpecificRequest()}";
        }
    }
    
    // The client
    public class Client
    {
        public void MakeRequest(ITarget target)
        {
            Console.WriteLine(target.Request());
        }
    }
    
    // Usage
    public class Program
    {
        public static void Main()
        {
            // Create adaptee
            var adaptee = new Adaptee();
            
            // Create adapter with adaptee
            var adapter = new Adapter(adaptee);
            
            // Use adapter through the Target interface
            var client = new Client();
            client.MakeRequest(adapter);
        }
    }
}`;

const decoratorCode = `using System;

namespace DesignPatterns.Structural
{
    // The base Component interface
    public interface IComponent
    {
        string Operation();
    }
    
    // Concrete Component
    public class ConcreteComponent : IComponent
    {
        public string Operation()
        {
            return "ConcreteComponent operation";
        }
    }
    
    // Base Decorator class
    public abstract class Decorator : IComponent
    {
        protected IComponent _component;
        
        public Decorator(IComponent component)
        {
            _component = component;
        }
        
        // Default implementation: pass through to wrapped component
        public virtual string Operation()
        {
            return _component.Operation();
        }
    }
    
    // Concrete Decorator A
    public class ConcreteDecoratorA : Decorator
    {
        public ConcreteDecoratorA(IComponent component) : base(component)
        {
        }
        
        public override string Operation()
        {
            return $"ConcreteDecoratorA({base.Operation()})";
        }
    }
    
    // Concrete Decorator B
    public class ConcreteDecoratorB : Decorator
    {
        public ConcreteDecoratorB(IComponent component) : base(component)
        {
        }
        
        public override string Operation()
        {
            return $"ConcreteDecoratorB({base.Operation()})";
        }
        
        // Additional behavior specific to B
        public string AddedBehavior()
        {
            return "Added behavior from B";
        }
    }
    
    // Usage
    public class Program
    {
        public static void Main()
        {
            // Create the component
            IComponent component = new ConcreteComponent();
            Console.WriteLine("Basic component:");
            Console.WriteLine(component.Operation());
            
            // Wrap with Decorator A
            IComponent decoratedA = new ConcreteDecoratorA(component);
            Console.WriteLine("\\nComponent decorated with A:");
            Console.WriteLine(decoratedA.Operation());
            
            // Wrap with Decorator B
            IComponent decoratedB = new ConcreteDecoratorB(decoratedA);
            Console.WriteLine("\\nComponent decorated with A then B:");
            Console.WriteLine(decoratedB.Operation());
            
            // Add decorators in a different order
            IComponent decoratedDifferently = new ConcreteDecoratorA(
                new ConcreteDecoratorB(
                    new ConcreteComponent()));
                    
            Console.WriteLine("\\nComponent decorated with B then A:");
            Console.WriteLine(decoratedDifferently.Operation());
        }
    }
}`;

const compositeCode = `using System;
using System.Collections.Generic;

namespace DesignPatterns.Structural
{
    // The Component abstract class
    public abstract class Component
    {
        protected string name;
        
        public Component(string name)
        {
            this.name = name;
        }
        
        // Interface for all components
        public abstract void Display(int depth = 0);
        
        // Optional leaf methods - these can be implemented differently in composite and leaf
        public virtual void Add(Component component)
        {
            throw new NotImplementedException();
        }
        
        public virtual void Remove(Component component)
        {
            throw new NotImplementedException();
        }
        
        public virtual bool IsComposite()
        {
            return false;
        }
    }
    
    // Leaf class
    public class Leaf : Component
    {
        public Leaf(string name) : base(name)
        {
        }
        
        public override void Display(int depth = 0)
        {
            Console.WriteLine(new string('-', depth) + name);
        }
    }
    
    // Composite class
    public class Composite : Component
    {
        private List<Component> _children = new List<Component>();
        
        public Composite(string name) : base(name)
        {
        }
        
        public override void Add(Component component)
        {
            _children.Add(component);
        }
        
        public override void Remove(Component component)
        {
            _children.Remove(component);
        }
        
        public override bool IsComposite()
        {
            return true;
        }
        
        public override void Display(int depth = 0)
        {
            Console.WriteLine(new string('-', depth) + name);
            
            // Display each child
            foreach (var child in _children)
            {
                child.Display(depth + 2);
            }
        }
    }
    
    // Client
    public class Program
    {
        public static void Main()
        {
            // Create a tree structure
            Composite root = new Composite("Root");
            root.Add(new Leaf("Leaf A"));
            root.Add(new Leaf("Leaf B"));
            
            Composite comp = new Composite("Composite X");
            comp.Add(new Leaf("Leaf XA"));
            comp.Add(new Leaf("Leaf XB"));
            
            root.Add(comp);
            root.Add(new Leaf("Leaf C"));
            
            // Add a leaf to composite
            Leaf leaf = new Leaf("Leaf D");
            root.Add(leaf);
            
            // Display the entire structure
            Console.WriteLine("\\nFile system structure:");
            root.Display();
        }
    }
}`;

export default function StructuralPatternsPage() {
  return (
    <LessonLayout 
      title="Structural Patterns"
      level="advanced"
      sidebarItems={sidebarItems}
      prev={{ href: '/advanced/patterns/creational', title: 'Creational Patterns' }}
      next={{ href: '/advanced/patterns/behavioral', title: 'Behavioral Patterns' }}
    >
      <div className="prose dark:prose-invert max-w-none">
        <h1>Structural Design Patterns in C#</h1>
        
        <p>
          Structural design patterns focus on how classes and objects are composed to form larger structures.
          These patterns simplify the structure by identifying relationships between different components.
          They help ensure that changes in one part of a system don't affect other parts.
        </p>

        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg my-4">
          <p className="font-semibold">Key Benefits of Structural Patterns:</p>
          <ul className="mt-2">
            <li>Identify simple ways to realize relationships between entities</li>
            <li>Provide flexibility and enable more complex structures to be built from simple components</li>
            <li>Increase reusability and modularity</li>
            <li>Allow incompatible interfaces to work together</li>
          </ul>
        </div>

        <h2>Adapter Pattern</h2>
        
        <p>
          The Adapter pattern converts the interface of a class into another interface that clients expect.
          It enables classes to work together that couldn't otherwise because of incompatible interfaces.
        </p>

        <CodeEditor 
          initialCode={adapterCode}
          language="csharp"
          readOnly={true}
        />

        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg my-4">
          <p className="font-semibold">When to use the Adapter Pattern:</p>
          <ul className="mt-2">
            <li>When you want to use an existing class, but its interface doesn't match the one you need</li>
            <li>When you want to create a reusable class that cooperates with classes that don't have compatible interfaces</li>
            <li>When you need to integrate a legacy component into a new system</li>
            <li>When you want to use several existing subclasses but it's impractical to adapt their interface by subclassing each one</li>
          </ul>
        </div>

        <h2>Decorator Pattern</h2>
        
        <p>
          The Decorator pattern attaches additional responsibilities to an object dynamically.
          Decorators provide a flexible alternative to subclassing for extending functionality.
        </p>

        <CodeEditor 
          initialCode={decoratorCode}
          language="csharp"
          readOnly={true}
        />

        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg my-4">
          <p className="font-semibold">When to use the Decorator Pattern:</p>
          <ul className="mt-2">
            <li>When you need to add responsibilities to objects dynamically and transparently, without affecting other objects</li>
            <li>When extension by subclassing is impractical or impossible</li>
            <li>When you need to add functionality that can be withdrawn from an object</li>
            <li>When a combination of features is required rather than a single monolithic object</li>
          </ul>
          <p className="mt-2 text-sm italic">
            <FiInfo className="inline mr-1" /> Real-world examples: Stream decorators in .NET, ASP.NET Core middleware pipeline.
          </p>
        </div>

        <h2>Composite Pattern</h2>
        
        <p>
          The Composite pattern composes objects into tree structures to represent part-whole hierarchies.
          It lets clients treat individual objects and compositions of objects uniformly.
        </p>

        <CodeEditor 
          initialCode={compositeCode}
          language="csharp"
          readOnly={true}
        />

        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg my-4">
          <p className="font-semibold">When to use the Composite Pattern:</p>
          <ul className="mt-2">
            <li>When you want to represent part-whole hierarchies of objects</li>
            <li>When you want clients to be able to ignore the difference between compositions of objects and individual objects</li>
            <li>When the structure can have any level of complexity and is dynamic</li>
          </ul>
          <p className="mt-2 text-sm italic">
            <FiInfo className="inline mr-1" /> Common examples: File systems, organizational structures, UI components.
          </p>
        </div>

        <h2>Other Structural Patterns</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="text-gray-700 dark:text-gray-300">Bridge Pattern</h3>
            <p className="mt-2">
              Decouples an abstraction from its implementation so that the two can vary independently.
              Especially useful when both the abstraction and its implementation need to be extended.
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="text-gray-700 dark:text-gray-300">Proxy Pattern</h3>
            <p className="mt-2">
              Provides a surrogate or placeholder for another object to control access to it.
              Used for lazy loading, access control, logging, caching, and more.
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="text-gray-700 dark:text-gray-300">Facade Pattern</h3>
            <p className="mt-2">
              Provides a unified interface to a set of interfaces in a subsystem.
              Defines a higher-level interface that makes the subsystem easier to use.
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="text-gray-700 dark:text-gray-300">Flyweight Pattern</h3>
            <p className="mt-2">
              Uses sharing to support large numbers of fine-grained objects efficiently.
              Useful when you need to create a large number of similar objects.
            </p>
          </div>
        </div>

        <div className="bg-csharp-blue-50 dark:bg-csharp-blue-900/20 p-4 rounded-lg mt-6">
          <h3 className="text-csharp-blue-700 dark:text-csharp-blue-400">Practice Exercise</h3>
          <p>
            Implement a real-world application of the Decorator pattern by creating a text processing
            system where different decorators can add formatting (bold, italics, etc.), validation,
            compression, or encryption functionality to a basic text component.
          </p>
          <p className="mt-2">
            Consider how this approach is more flexible than creating subclasses for each combination
            of features. How would you extend this system to add new functionality without modifying
            existing code?
          </p>
        </div>
      </div>
    </LessonLayout>
  );
} 
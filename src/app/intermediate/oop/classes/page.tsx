import React from 'react';
import { FiBook, FiCode, FiGitBranch, FiPackage, FiServer } from 'react-icons/fi';
import LessonLayout from '@/components/LessonLayout';
import CodeEditor from '@/components/CodeEditor';
import { SidebarItem } from '@/types/sidebar';

const sidebarItems: SidebarItem[] = [
  {
    title: 'Object-Oriented Programming',
    href: '/intermediate/oop',
    icon: <FiCode />,
    children: [
      { title: 'Classes and Objects', href: '/intermediate/oop/classes', icon: <FiCode /> },
      { title: 'Inheritance and Polymorphism', href: '/intermediate/oop/inheritance', icon: <FiGitBranch /> },
      { title: 'Interfaces and Abstract Classes', href: '/intermediate/oop/interfaces', icon: <FiPackage /> },
      { title: 'Encapsulation and Access Modifiers', href: '/intermediate/oop/encapsulation', icon: <FiServer /> },
    ],
  },
];

const classExampleCode = `public class Car
{
    // Fields (private)
    private string _make;
    private string _model;
    private int _year;
    private double _fuelLevel;

    // Properties (public)
    public string Make
    {
        get { return _make; }
        set { _make = value; }
    }

    public string Model
    {
        get { return _model; }
        set { _model = value; }
    }

    public int Year
    {
        get { return _year; }
        set { _year = value; }
    }

    // Read-only property
    public double FuelLevel
    {
        get { return _fuelLevel; }
    }

    // Constructor
    public Car(string make, string model, int year)
    {
        _make = make;
        _model = model;
        _year = year;
        _fuelLevel = 100.0;
    }

    // Methods
    public void Drive(double distance)
    {
        if (_fuelLevel <= 0)
        {
            throw new InvalidOperationException("Car is out of fuel!");
        }

        _fuelLevel -= distance * 0.1; // Simple fuel consumption model
        if (_fuelLevel < 0) _fuelLevel = 0;
    }

    public void Refuel()
    {
        _fuelLevel = 100.0;
    }

    // Override ToString method
    public override string ToString()
    {
        return $"{_year} {_make} {_model}";
    }
}`;

const conceptMapNodes = [
  { id: 'class', label: 'Class', type: 'concept' },
  { id: 'fields', label: 'Fields', type: 'component' },
  { id: 'properties', label: 'Properties', type: 'component' },
  { id: 'methods', label: 'Methods', type: 'component' },
  { id: 'constructor', label: 'Constructor', type: 'component' },
  { id: 'encapsulation', label: 'Encapsulation', type: 'principle' },
];

const conceptMapLinks = [
  { source: 'class', target: 'fields', label: 'contains' },
  { source: 'class', target: 'properties', label: 'contains' },
  { source: 'class', target: 'methods', label: 'contains' },
  { source: 'class', target: 'constructor', label: 'contains' },
  { source: 'class', target: 'encapsulation', label: 'implements' },
];

export default function ClassesPage() {
  return (
    <LessonLayout 
      sidebarItems={sidebarItems}
      level="intermediate"
      title="Classes and Objects in C#"
    >
      <div className="prose dark:prose-invert max-w-none">
        <h1>Classes and Objects in C#</h1>
        <p>
          Classes are the fundamental building blocks of object-oriented programming in C#. They serve as blueprints for creating objects that encapsulate data and behavior.
        </p>

        <h2>What is a Class?</h2>
        <p>
          A class is a user-defined type that combines data (fields) and behavior (methods) into a single unit. It provides a template for creating objects, which are instances of the class.
        </p>

        <h2>Key Components of a Class</h2>
        <ul>
          <li><strong>Fields:</strong> Private data members that store the object's state</li>
          <li><strong>Properties:</strong> Public accessors that provide controlled access to private fields</li>
          <li><strong>Methods:</strong> Functions that define the object's behavior</li>
          <li><strong>Constructors:</strong> Special methods that initialize new objects</li>
        </ul>

        <h2>Example: Car Class</h2>
        <p>
          Let's look at a practical example of a Car class that demonstrates these concepts:
        </p>

        <div className="my-4">
          <CodeEditor
            initialCode={classExampleCode}
            language="csharp"
            readOnly={true}
          />
        </div>

        <h2>Using the Car Class</h2>
        <p>
          Here's how you would create and use an instance of the Car class:
        </p>

        <div className="my-4">
          <CodeEditor
            initialCode={`// Create a new car
Car myCar = new Car("Toyota", "Camry", 2023);

// Access properties
Console.WriteLine(myCar.Make);  // Output: Toyota
Console.WriteLine(myCar.Model); // Output: Camry

// Use methods
myCar.Drive(50);  // Drive 50 miles
Console.WriteLine(myCar.FuelLevel); // Output: 95.0

// Refuel the car
myCar.Refuel();
Console.WriteLine(myCar.FuelLevel); // Output: 100.0`}
            language="csharp"
            readOnly={true}
          />
        </div>

        <h2>Key Concepts</h2>
        <ul>
          <li><strong>Encapsulation:</strong> The class encapsulates its data (fields) and provides controlled access through properties and methods</li>
          <li><strong>Access Modifiers:</strong> Keywords like private and public control the visibility of class members</li>
          <li><strong>Properties:</strong> Provide a way to get and set values while maintaining encapsulation</li>
          <li><strong>Methods:</strong> Define the behavior of the class and can manipulate its data</li>
        </ul>

        <h2>Best Practices</h2>
        <ul>
          <li>Keep fields private and provide public properties for access</li>
          <li>Use meaningful names for classes, fields, properties, and methods</li>
          <li>Implement proper validation in property setters</li>
          <li>Use constructors to ensure objects are properly initialized</li>
          <li>Override ToString() for meaningful string representation</li>
        </ul>
      </div>
    </LessonLayout>
  );
} 
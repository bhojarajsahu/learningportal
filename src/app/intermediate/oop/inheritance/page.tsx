import React from 'react';
import { FiCode, FiGitBranch, FiPackage, FiServer } from 'react-icons/fi';
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

const inheritanceExampleCode = `// Base class
public class Animal
{
    public string Name { get; set; }
    public int Age { get; set; }

    public Animal(string name, int age)
    {
        Name = name;
        Age = age;
    }

    // Virtual method that can be overridden
    public virtual void MakeSound()
    {
        Console.WriteLine("Some generic animal sound");
    }

    // Virtual method that can be overridden
    public virtual string GetInfo()
    {
        return $"Name: {Name}, Age: {Age}";
    }
}

// Derived class
public class Dog : Animal
{
    public string Breed { get; set; }

    public Dog(string name, int age, string breed) 
        : base(name, age)
    {
        Breed = breed;
    }

    // Override the virtual method
    public override void MakeSound()
    {
        Console.WriteLine("Woof!");
    }

    // Override the virtual method and call base implementation
    public override string GetInfo()
    {
        return $"{base.GetInfo()}, Breed: {Breed}";
    }
}

// Another derived class
public class Cat : Animal
{
    public bool IsIndoor { get; set; }

    public Cat(string name, int age, bool isIndoor) 
        : base(name, age)
    {
        IsIndoor = isIndoor;
    }

    public override void MakeSound()
    {
        Console.WriteLine("Meow!");
    }

    public override string GetInfo()
    {
        return $"{base.GetInfo()}, Indoor: {IsIndoor}";
    }
}`;

const polymorphismExampleCode = `// Using polymorphism
public class Program
{
    public static void Main()
    {
        // Create instances of different types
        Animal animal = new Animal("Generic", 1);
        Dog dog = new Dog("Rex", 5, "German Shepherd");
        Cat cat = new Cat("Whiskers", 3, true);

        // Polymorphic behavior
        Console.WriteLine("Animal sounds:");
        animal.MakeSound();  // Output: Some generic animal sound
        dog.MakeSound();     // Output: Woof!
        cat.MakeSound();     // Output: Meow!

        // Polymorphic information display
        Console.WriteLine("\nAnimal information:");
        Console.WriteLine(animal.GetInfo());  // Output: Name: Generic, Age: 1
        Console.WriteLine(dog.GetInfo());      // Output: Name: Rex, Age: 5, Breed: German Shepherd
        Console.WriteLine(cat.GetInfo());      // Output: Name: Whiskers, Age: 3, Indoor: True

        // Polymorphism with collections
        var animals = new List<Animal> { animal, dog, cat };
        Console.WriteLine("\nAll animals making sounds:");
        foreach (var a in animals)
        {
            a.MakeSound();
        }
    }
}`;

export default function InheritancePage() {
  return (
    <LessonLayout
      level="intermediate"
      title="Inheritance and Polymorphism"
      sidebarItems={sidebarItems}
    >
      <div className="prose max-w-none">
        <h1>Inheritance and Polymorphism in C#</h1>
        <p>
          Inheritance and polymorphism are fundamental concepts in object-oriented programming that allow you to create
          hierarchical relationships between classes and enable objects to take multiple forms.
        </p>

        <h2>What is Inheritance?</h2>
        <p>
          Inheritance is a mechanism that allows a class (derived class) to inherit properties and methods from another class
          (base class). This promotes code reuse and establishes an "is-a" relationship between classes.
        </p>

        <h2>Basic Inheritance Example</h2>
        <p>
          Let's look at a practical example using animals:
        </p>

        <div className="my-4">
          <CodeEditor
            initialCode={inheritanceExampleCode}
            language="csharp"
            readOnly={true}
          />
        </div>

        <h2>Key Concepts in Inheritance</h2>
        <ul>
          <li><strong>Base Class:</strong> The parent class that provides common functionality</li>
          <li><strong>Derived Class:</strong> The child class that inherits from the base class</li>
          <li><strong>Virtual Methods:</strong> Methods in the base class that can be overridden</li>
          <li><strong>Override:</strong> Keyword used to provide a new implementation of a virtual method</li>
          <li><strong>Base Keyword:</strong> Used to call the base class constructor or methods</li>
        </ul>

        <h2>What is Polymorphism?</h2>
        <p>
          Polymorphism allows objects to take multiple forms. In C#, this is achieved through method overriding and
          interface implementation. The same method can behave differently based on the actual type of the object.
        </p>

        <h2>Polymorphism Example</h2>
        <p>
          Here's how polymorphism works in practice:
        </p>

        <div className="my-4">
          <CodeEditor
            initialCode={polymorphismExampleCode}
            language="csharp"
            readOnly={true}
          />
        </div>

        <h2>Types of Polymorphism</h2>
        <ul>
          <li><strong>Compile-time Polymorphism:</strong> Method overloading</li>
          <li><strong>Runtime Polymorphism:</strong> Method overriding</li>
          <li><strong>Interface Polymorphism:</strong> Objects implementing interfaces</li>
        </ul>

        <h2>Best Practices</h2>
        <ul>
          <li>Use inheritance for "is-a" relationships</li>
          <li>Keep inheritance hierarchies shallow</li>
          <li>Use virtual methods when you expect derived classes to override behavior</li>
          <li>Consider using interfaces for "can-do" relationships</li>
          <li>Follow the Liskov Substitution Principle</li>
        </ul>
      </div>
    </LessonLayout>
  );
} 
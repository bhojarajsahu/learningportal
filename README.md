# C# Learning Portal

A comprehensive visual C# learning website inspired by W3Schools that focuses on both basic and advanced concepts with strong visual representations.

## Features

### Core Structure
- Clean, intuitive navigation system with clear sections for beginners, intermediate, and advanced learners
- Sidebar menu that organizes topics progressively
- Consistent color scheme using Microsoft's blue/purple palette for C# branding
- "Try it Yourself" interactive code editor on each lesson page

### Content Organization
- Divided into logical modules that build upon each other
- Starting with C# fundamentals (syntax, variables, data types)
- Progressing through intermediate topics (OOP, LINQ, collections)
- Culminating with advanced concepts (async programming, reflection, design patterns)

### Visual Learning Elements
- Animated flowcharts for control structures (if/else, loops, switch statements)
- Interactive memory models showing variable storage and garbage collection
- Expandable class diagrams for inheritance and polymorphism concepts
- Visual state diagrams for asynchronous operations and threading
- Color-coded syntax highlighting in all code examples

### Interactive Features
- Code playgrounds with real-time compilation and execution
- Visual debugging tools showing step-by-step code execution
- Interactive quizzes with immediate feedback
- Progress tracking system with achievements
- Community forums integrated with each lesson

### Special Visual Components
- Visual Concept Maps for each major topic showing relationships between concepts
- Animated diagrams showing method execution and call stacks
- Interactive memory allocation visualizations
- "Before/after" sliders comparing different code approaches
- Visual metaphors for abstract concepts like delegates and events

## Technology Stack

- **Frontend:** Next.js with TypeScript and Tailwind CSS
- **UI Components:** React components with custom animations
- **Code Editor:** Monaco Editor (same as VS Code)
- **Syntax Highlighting:** react-syntax-highlighter
- **Icons:** react-icons
- **Theme Switching:** next-themes for dark/light mode support

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm 9.x or later

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/csharp-learning-portal.git
   cd csharp-learning-portal
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## Project Structure

- `src/app/` - Next.js app router pages
- `src/components/` - Reusable React components
- `src/types/` - TypeScript type definitions
- `src/styles/` - Global styles and utilities
- `public/` - Static assets

## Key Components

- **CodeEditor** - Interactive code editor with syntax highlighting and execution
- **ConceptMap** - Visual representation of related concepts
- **FlowChart** - Animated diagrams for control flow visualization
- **LessonLayout** - Standard layout for lesson pages with sidebar navigation
- **Sidebar** - Navigation component with expandable sections

## Contribution

We welcome contributions from the community! If you'd like to contribute:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by the teaching style of W3Schools
- Microsoft for C# and the .NET framework
- The open source community for the various tools and libraries used

---

Built with ♥ for C# learners everywhere.

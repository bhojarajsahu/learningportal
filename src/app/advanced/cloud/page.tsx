import React from 'react';
import Link from 'next/link';
import { FiCloud, FiServer, FiDatabase, FiPackage } from 'react-icons/fi';

export default function CloudDevelopmentPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
          Cloud Development with C#
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
          Learn how to build, deploy, and manage cloud-native applications using C# and Azure services.
        </p>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Why Cloud Development?</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Cloud computing provides on-demand access to computing resources without the need for direct active management by the user. This paradigm offers numerous advantages including scalability, cost-effectiveness, and global accessibility.
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            As a C# developer, mastering cloud development will enable you to build robust, scalable applications that leverage the full power of modern cloud platforms.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <FiCloud className="w-8 h-8 text-blue-500 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Azure Fundamentals
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Get started with Microsoft Azure, the cloud platform designed for .NET developers. Learn about core Azure services and how to leverage them in your C# applications.
            </p>
            <ul className="space-y-2 mb-4">
              <li className="ml-4">• Introduction to Azure services</li>
              <li className="ml-4">• Azure App Service for web applications</li>
              <li className="ml-4">• Azure Storage and Databases</li>
              <li className="ml-4">• Serverless with Azure Functions</li>
              <li className="ml-4">• Authentication and Security</li>
            </ul>
            <Link
              href="/advanced/cloud/azure-basics"
              className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
              Learn Azure Fundamentals
            </Link>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <FiServer className="w-8 h-8 text-purple-500 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Microservices Architecture
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Explore microservices architecture and how to implement it using C# and Azure. Learn best practices for building, deploying, and managing microservices.
            </p>
            <ul className="space-y-2 mb-4">
              <li className="ml-4">• Microservices principles and patterns</li>
              <li className="ml-4">• Service communication (REST, gRPC)</li>
              <li className="ml-4">• API Gateways and Service Mesh</li>
              <li className="ml-4">• Event-driven architecture</li>
              <li className="ml-4">• Monitoring and observability</li>
            </ul>
            <Link
              href="/advanced/cloud/microservices"
              className="inline-block bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded"
            >
              Learn Microservices Architecture
            </Link>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <FiPackage className="w-8 h-8 text-green-500 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Containerization with Docker
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Master containerization with Docker and learn how to package, deploy, and run C# applications in containers. Understand container orchestration with Kubernetes.
            </p>
            <ul className="space-y-2 mb-4">
              <li className="ml-4">• Docker concepts and architecture</li>
              <li className="ml-4">• Containerizing .NET applications</li>
              <li className="ml-4">• Docker Compose for multi-container apps</li>
              <li className="ml-4">• Container registries and CI/CD</li>
              <li className="ml-4">• Introduction to Kubernetes</li>
            </ul>
            <Link
              href="/advanced/cloud/docker"
              className="inline-block bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
            >
              Learn Docker Containerization
            </Link>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/advanced/cloud/azure-basics"
            className="inline-block bg-csharp-blue-500 hover:bg-csharp-blue-600 text-white font-bold py-2 px-4 rounded shadow"
          >
            Start Learning Cloud Development
          </Link>
        </div>
      </div>
    </div>
  );
} 
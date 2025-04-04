import React from 'react';
import Link from 'next/link';
import { FiShield, FiKey, FiLock, FiAlertTriangle } from 'react-icons/fi';

export default function SecurityPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Security in C#</h1>
      
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Master essential security practices and techniques for building secure C# applications.
      </p>

      <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg mb-12">
        <h2 className="text-2xl font-semibold mb-4">Why Security Matters</h2>
        
        <p className="mb-4">
          Security is not just a feature—it's a fundamental requirement for modern software. Secure coding practices protect your users' data, 
          maintain their trust, and safeguard your organization's reputation. This module covers essential security concepts and techniques 
          for C# developers to build robust, secure applications.
        </p>
        
        <p>
          Learn how to identify common vulnerabilities, implement authentication and authorization properly, 
          secure data at rest and in transit, and follow industry best practices for secure C# development.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="bg-indigo-600 text-white p-4 flex items-center">
            <FiKey className="w-6 h-6 mr-2" />
            <h3 className="text-xl font-semibold">Authentication & Authorization</h3>
          </div>
          <div className="p-4">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Learn how to implement secure authentication and authorization in your C# applications.
            </p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start">
                <span className="text-indigo-600 mr-2">•</span>
                <span>Identity frameworks in .NET</span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-600 mr-2">•</span>
                <span>JWT authentication</span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-600 mr-2">•</span>
                <span>OAuth and OpenID Connect</span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-600 mr-2">•</span>
                <span>Role and claim-based authorization</span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-600 mr-2">•</span>
                <span>Multi-factor authentication</span>
              </li>
            </ul>
            <Link href="/advanced/security/authentication" className="text-indigo-600 font-medium hover:text-indigo-500">
              Learn more →
            </Link>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="bg-red-600 text-white p-4 flex items-center">
            <FiAlertTriangle className="w-6 h-6 mr-2" />
            <h3 className="text-xl font-semibold">Common Vulnerabilities</h3>
          </div>
          <div className="p-4">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Understand and mitigate common security vulnerabilities in C# applications.
            </p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start">
                <span className="text-red-600 mr-2">•</span>
                <span>Injection attacks (SQL, LDAP, etc.)</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-600 mr-2">•</span>
                <span>Cross-site scripting (XSS)</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-600 mr-2">•</span>
                <span>Cross-site request forgery (CSRF)</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-600 mr-2">•</span>
                <span>Insecure deserialization</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-600 mr-2">•</span>
                <span>Security misconfiguration</span>
              </li>
            </ul>
            <Link href="/advanced/security/vulnerabilities" className="text-red-600 font-medium hover:text-red-500">
              Learn more →
            </Link>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="bg-green-600 text-white p-4 flex items-center">
            <FiLock className="w-6 h-6 mr-2" />
            <h3 className="text-xl font-semibold">Data Protection</h3>
          </div>
          <div className="p-4">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Learn techniques to protect sensitive data in your applications.
            </p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start">
                <span className="text-green-600 mr-2">•</span>
                <span>Encryption and decryption</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">•</span>
                <span>Secure password storage</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">•</span>
                <span>ASP.NET Core Data Protection API</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">•</span>
                <span>Transport Layer Security (TLS)</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">•</span>
                <span>Secure storage of app secrets</span>
              </li>
            </ul>
            <Link href="/advanced/security/data-protection" className="text-green-600 font-medium hover:text-green-500">
              Learn more →
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4 flex items-center">
          <FiShield className="mr-2" /> 
          Start Your Security Journey
        </h2>
        
        <p className="mb-6">
          Begin with the Authentication & Authorization module to learn the fundamentals of securing user access in your applications.
        </p>
        
        <Link 
          href="/advanced/security/authentication" 
          className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Get Started
        </Link>
      </div>
    </div>
  );
} 
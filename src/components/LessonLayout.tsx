"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiMenu, FiX, FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import Sidebar from './Sidebar';
import { SidebarItem } from '@/types/sidebar';

interface LessonLayoutProps {
  children: React.ReactNode;
  sidebarItems: SidebarItem[];
  level: 'beginner' | 'intermediate' | 'advanced';
  prev?: {
    href: string;
    title: string;
  };
  next?: {
    href: string;
    title: string;
  };
  title: string;
}

export default function LessonLayout({
  children,
  sidebarItems,
  level,
  prev,
  next,
  title
}: LessonLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row">
        {/* Mobile sidebar toggle */}
        <div className="md:hidden mb-4">
          <button 
            onClick={toggleSidebar}
            className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {sidebarOpen ? (
              <>
                <FiX className="mr-2" /> Close Menu
              </>
            ) : (
              <>
                <FiMenu className="mr-2" /> Menu
              </>
            )}
          </button>
        </div>
        
        {/* Sidebar */}
        <div className={`md:block md:w-64 md:shrink-0 lg:w-72 ${
          sidebarOpen ? 'block' : 'hidden'
        }`}>
          <div className="md:sticky md:top-20">
            <Sidebar items={sidebarItems} level={level} />
          </div>
        </div>
        
        {/* Main content */}
        <div className="ml-0 md:ml-8 flex-1">
          <article className="prose dark:prose-invert prose-lg max-w-none">
            <h1 className="text-3xl font-bold mb-6">{title}</h1>
            {children}
            
            {/* Pagination */}
            <div className="flex flex-col sm:flex-row justify-between items-center mt-12 pt-6 border-t border-gray-200 dark:border-gray-800">
              {prev ? (
                <Link 
                  href={prev.href}
                  className="flex items-center text-csharp-blue-600 dark:text-csharp-blue-400 hover:underline mb-4 sm:mb-0"
                >
                  <FiArrowLeft className="mr-2" />
                  <span>{prev.title}</span>
                </Link>
              ) : (
                <div></div>
              )}
              
              {next && (
                <Link 
                  href={next.href}
                  className="flex items-center text-csharp-blue-600 dark:text-csharp-blue-400 hover:underline"
                >
                  <span>{next.title}</span>
                  <FiArrowRight className="ml-2" />
                </Link>
              )}
            </div>
          </article>
        </div>
      </div>
    </div>
  );
} 
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiChevronRight, FiBook, FiCode, FiCpu, FiDatabase, FiPackage, FiLayers } from 'react-icons/fi';

interface SidebarItem {
  title: string;
  href: string;
  icon?: React.ReactNode;
  children?: SidebarItem[];
}

interface SidebarProps {
  items: SidebarItem[];
  level: 'beginner' | 'intermediate' | 'advanced';
}

const levelColors = {
  beginner: 'csharp-blue',
  intermediate: 'csharp-blue',
  advanced: 'csharp-purple'
};

export default function Sidebar({ items, level }: SidebarProps) {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  
  const color = levelColors[level];
  
  // Toggle expanded state of a section
  const toggleExpand = (title: string) => {
    setExpanded(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };
  
  // Check if an item is active
  const isActive = (href: string) => pathname === href;
  
  // Recursively check if any child is active
  const hasActiveChild = (items?: SidebarItem[]): boolean => {
    if (!items) return false;
    return items.some(item => isActive(item.href) || hasActiveChild(item.children));
  };

  // Automatically expand items that contain the active route or are active
  React.useEffect(() => {
    const newExpanded: Record<string, boolean> = {};
    
    const checkAndExpand = (items: SidebarItem[]) => {
      items.forEach(item => {
        if (isActive(item.href) || hasActiveChild(item.children)) {
          if (item.title) {
            newExpanded[item.title] = true;
          }
        }
        
        if (item.children) {
          checkAndExpand(item.children);
        }
      });
    };
    
    checkAndExpand(items);
    setExpanded(newExpanded);
  }, [pathname, items]);

  const renderSidebarItems = (items: SidebarItem[]) => {
    return items.map((item, idx) => {
      const isItemActive = isActive(item.href);
      const isExpandable = item.children && item.children.length > 0;
      const isItemExpanded = expanded[item.title] || false;
      const hasActive = hasActiveChild(item.children);
      
      return (
        <div key={idx} className="mb-1">
          <div className="flex items-center">
            {isExpandable ? (
              <button
                onClick={() => toggleExpand(item.title)}
                className={`w-full flex items-center justify-between sidebar-link ${isItemActive || hasActive ? `bg-${color}-100 dark:bg-${color}-900/30 text-${color}-700 dark:text-${color}-300` : ''}`}
              >
                <span className="flex items-center">
                  {item.icon}
                  <span className="ml-2">{item.title}</span>
                </span>
                <FiChevronRight className={`transition-transform ${isItemExpanded ? 'transform rotate-90' : ''}`} />
              </button>
            ) : (
              <Link
                href={item.href}
                className={`sidebar-link ${isItemActive ? 'sidebar-link-active' : ''}`}
              >
                <span className="flex items-center">
                  {item.icon}
                  <span className="ml-2">{item.title}</span>
                </span>
              </Link>
            )}
          </div>
          
          {isExpandable && isItemExpanded && (
            <div className={`ml-4 pl-2 border-l-2 border-${color}-200 dark:border-${color}-800 mt-1`}>
              {renderSidebarItems(item.children!)}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <aside className="w-full md:w-64 lg:w-72 h-full overflow-y-auto">
      <div className="p-4">
        <h2 className={`text-xl font-bold mb-4 text-${color}-600 dark:text-${color}-400`}>
          {level.charAt(0).toUpperCase() + level.slice(1)} C#
        </h2>
        <nav>{renderSidebarItems(items)}</nav>
      </div>
    </aside>
  );
} 
"use client";

import React, { useState } from 'react';

type NodeType = 'start' | 'end' | 'process' | 'decision' | 'input' | 'output';

interface FlowNode {
  id: string;
  type: NodeType;
  text: string;
  x: number;
  y: number;
  next?: string[];
  condition?: string;
  highlighted?: boolean;
}

interface FlowConnection {
  from: string;
  to: string;
  label?: string;
  path?: 'yes' | 'no';
}

interface FlowChartProps {
  nodes: FlowNode[];
  connections: FlowConnection[];
  width?: number;
  height?: number;
  title?: string;
  animated?: boolean;
}

export default function FlowChart({
  nodes,
  connections,
  width = 600,
  height = 400,
  title,
  animated = false,
}: FlowChartProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [animationRunning, setAnimationRunning] = useState(false);
  const [highlightedNodes, setHighlightedNodes] = useState<string[]>([]);

  // Helper function to get the styled shape based on node type
  const getNodeShape = (node: FlowNode) => {
    const isHighlighted = highlightedNodes.includes(node.id);
    const baseClasses = `${isHighlighted ? 'stroke-csharp-blue-500 stroke-[3px] shadow-lg' : 'stroke-gray-500 dark:stroke-gray-400 stroke-[1.5px]'} fill-white dark:fill-gray-800`;
    
    switch (node.type) {
      case 'start':
      case 'end':
        return (
          <ellipse
            cx="0"
            cy="0"
            rx="40"
            ry="20"
            className={baseClasses}
          />
        );
      case 'process':
        return (
          <rect
            x="-40"
            y="-20"
            width="80"
            height="40"
            className={baseClasses}
          />
        );
      case 'decision':
        return (
          <polygon
            points="0,-30 50,0 0,30 -50,0"
            className={baseClasses}
          />
        );
      case 'input':
      case 'output':
        return (
          <path
            d="M-40,-20 L40,-20 L50,0 L40,20 L-40,20 L-50,0 Z"
            className={baseClasses}
          />
        );
      default:
        return (
          <rect
            x="-40"
            y="-20"
            width="80"
            height="40"
            className={baseClasses}
          />
        );
    }
  };

  // Function to handle animation steps
  const startAnimation = () => {
    if (animationRunning) return;
    
    setAnimationRunning(true);
    setActiveStep(0);
    setHighlightedNodes([]);
    
    // Find start node
    const startNode = nodes.find(n => n.type === 'start');
    if (!startNode) {
      setAnimationRunning(false);
      return;
    }
    
    let currentNodeIds = [startNode.id];
    let step = 0;
    
    const interval = setInterval(() => {
      setHighlightedNodes(currentNodeIds);
      setActiveStep(step);
      
      // Find next nodes
      const nextNodeIds: string[] = [];
      currentNodeIds.forEach(id => {
        const outgoingConnections = connections.filter(c => c.from === id);
        outgoingConnections.forEach(conn => {
          nextNodeIds.push(conn.to);
        });
      });
      
      // If no more nodes to process, end animation
      if (nextNodeIds.length === 0 || step > 20) {
        clearInterval(interval);
        setAnimationRunning(false);
        setTimeout(() => setHighlightedNodes([]), 1000);
      }
      
      currentNodeIds = nextNodeIds;
      step++;
    }, 1000);
  };

  // Function to get path between nodes
  const getConnectionPath = (connection: FlowConnection) => {
    const sourceNode = nodes.find(n => n.id === connection.from);
    const targetNode = nodes.find(n => n.id === connection.to);
    
    if (!sourceNode || !targetNode) return '';
    
    // Calculate start and end points
    const startX = sourceNode.x;
    const startY = sourceNode.y;
    const endX = targetNode.x;
    const endY = targetNode.y;
    
    // Direction vectors
    const dx = endX - startX;
    const dy = endY - startY;
    
    // For decision nodes, handle yes/no paths differently
    if (sourceNode.type === 'decision') {
      if (connection.path === 'yes') {
        // "Yes" path (usually right)
        return `M ${startX+50} ${startY} L ${endX} ${endY}`;
      } else if (connection.path === 'no') {
        // "No" path (usually down)
        return `M ${startX} ${startY+30} L ${endX} ${endY}`;
      }
    }
    
    // Simple direct path with curved edges
    const midX = (startX + endX) / 2;
    const midY = (startY + endY) / 2;
    
    if (Math.abs(dx) > Math.abs(dy)) {
      // Horizontal connection
      return `M ${startX} ${startY} C ${midX} ${startY}, ${midX} ${endY}, ${endX} ${endY}`;
    } else {
      // Vertical connection
      return `M ${startX} ${startY} C ${startX} ${midY}, ${endX} ${midY}, ${endX} ${endY}`;
    }
  };

  // Function to position the connection label
  const getLabelPosition = (connection: FlowConnection) => {
    const sourceNode = nodes.find(n => n.id === connection.from);
    const targetNode = nodes.find(n => n.id === connection.to);
    
    if (!sourceNode || !targetNode) return { x: 0, y: 0 };
    
    // Calculate midpoint
    const midX = (sourceNode.x + targetNode.x) / 2;
    const midY = (sourceNode.y + targetNode.y) / 2;
    
    // Offset for the label
    const offsetX = 0;
    const offsetY = -10;
    
    return { x: midX + offsetX, y: midY + offsetY };
  };

  return (
    <div className="card overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        {title && <h3 className="text-xl font-bold">{title}</h3>}
        {animated && (
          <button
            onClick={startAnimation}
            disabled={animationRunning}
            className="btn-primary text-sm py-1 px-3"
          >
            {animationRunning ? 'Running...' : 'Animate Flow'}
          </button>
        )}
      </div>
      
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-inner-code">
        <svg width={width} height={height} className="overflow-visible">
          {/* Draw connections first */}
          {connections.map((connection, index) => {
            const isHighlighted = 
              highlightedNodes.includes(connection.from) && 
              highlightedNodes.includes(connection.to);
            
            return (
              <g key={`conn-${index}`}>
                <path
                  d={getConnectionPath(connection)}
                  fill="none"
                  className={`transition-colors duration-300 ${
                    isHighlighted 
                      ? 'stroke-csharp-blue-500 stroke-[2.5px]' 
                      : 'stroke-gray-400 dark:stroke-gray-500'
                  }`}
                  markerEnd="url(#arrowhead)"
                />
                {connection.label && (
                  <text
                    x={getLabelPosition(connection).x}
                    y={getLabelPosition(connection).y}
                    textAnchor="middle"
                    className={`text-xs ${
                      isHighlighted 
                        ? 'fill-csharp-blue-700 dark:fill-csharp-blue-300 font-medium' 
                        : 'fill-gray-600 dark:fill-gray-400'
                    }`}
                  >
                    {connection.label}
                  </text>
                )}
              </g>
            );
          })}
          
          {/* Draw nodes */}
          {nodes.map((node) => (
            <g key={node.id} transform={`translate(${node.x},${node.y})`}>
              {getNodeShape(node)}
              <text
                textAnchor="middle"
                dy=".3em"
                className={`text-sm ${
                  highlightedNodes.includes(node.id)
                    ? 'fill-csharp-blue-700 dark:fill-csharp-blue-300 font-medium'
                    : 'fill-gray-700 dark:fill-gray-300'
                }`}
                style={{ pointerEvents: 'none' }}
              >
                {node.text}
              </text>
            </g>
          ))}
          
          {/* Arrowhead marker definition */}
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon
                points="0 0, 10 3.5, 0 7"
                className="fill-gray-400 dark:fill-gray-500"
              />
            </marker>
          </defs>
        </svg>
      </div>
      
      {/* Animation step indicator */}
      {animated && animationRunning && (
        <div className="mt-4 p-2 bg-gray-100 dark:bg-gray-700 rounded">
          <div className="text-sm text-gray-600 dark:text-gray-300">
            Step: {activeStep + 1}
          </div>
        </div>
      )}
    </div>
  );
} 
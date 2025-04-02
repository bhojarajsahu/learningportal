"use client";

import React, { useRef, useEffect, useState } from 'react';

interface ConceptNode {
  id: string;
  label: string;
  description?: string;
  category?: string;
  x?: number;
  y?: number;
}

interface ConceptLink {
  source: string;
  target: string;
  label?: string;
}

interface ConceptMapProps {
  nodes: ConceptNode[];
  links: ConceptLink[];
  width?: number;
  height?: number;
  title?: string;
}

export default function ConceptMap({ 
  nodes, 
  links, 
  width = 600, 
  height = 400,
  title 
}: ConceptMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedNode, setSelectedNode] = useState<ConceptNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<ConceptNode | null>(null);
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  
  // Calculate node positions using a simple force-directed layout
  useEffect(() => {
    // This is a simplified force-directed layout
    // In a real implementation, you'd use a library like d3-force
    
    // Initialize random positions if not set
    nodes.forEach(node => {
      if (node.x === undefined || node.y === undefined) {
        node.x = Math.random() * width * 0.8 + width * 0.1;
        node.y = Math.random() * height * 0.8 + height * 0.1;
      }
    });
    
    // Perform simple force-directed layout iterations
    const iterations = 50;
    const nodeRadius = 30;
    const repulsionForce = 500;
    const attractionForce = 0.1;
    
    for (let i = 0; i < iterations; i++) {
      // Apply repulsion forces between nodes
      for (let j = 0; j < nodes.length; j++) {
        for (let k = j + 1; k < nodes.length; k++) {
          const nodeA = nodes[j];
          const nodeB = nodes[k];
          
          const dx = (nodeB.x || 0) - (nodeA.x || 0);
          const dy = (nodeB.y || 0) - (nodeA.y || 0);
          const distance = Math.sqrt(dx * dx + dy * dy) || 0.1;
          
          if (distance < nodeRadius * 2) {
            const force = repulsionForce / (distance * distance);
            const forceX = dx / distance * force;
            const forceY = dy / distance * force;
            
            nodeA.x = (nodeA.x || 0) - forceX;
            nodeA.y = (nodeA.y || 0) - forceY;
            nodeB.x = (nodeB.x || 0) + forceX;
            nodeB.y = (nodeB.y || 0) + forceY;
          }
        }
      }
      
      // Apply attraction forces along links
      links.forEach(link => {
        const sourceNode = nodes.find(n => n.id === link.source);
        const targetNode = nodes.find(n => n.id === link.target);
        
        if (sourceNode && targetNode) {
          const dx = (targetNode.x || 0) - (sourceNode.x || 0);
          const dy = (targetNode.y || 0) - (sourceNode.y || 0);
          const distance = Math.sqrt(dx * dx + dy * dy) || 0.1;
          
          const force = distance * attractionForce;
          const forceX = dx / distance * force;
          const forceY = dy / distance * force;
          
          sourceNode.x = (sourceNode.x || 0) + forceX;
          sourceNode.y = (sourceNode.y || 0) + forceY;
          targetNode.x = (targetNode.x || 0) - forceX;
          targetNode.y = (targetNode.y || 0) - forceY;
        }
      });
      
      // Keep nodes within boundaries
      nodes.forEach(node => {
        node.x = Math.max(nodeRadius, Math.min((node.x || 0), width - nodeRadius));
        node.y = Math.max(nodeRadius, Math.min((node.y || 0), height - nodeRadius));
      });
    }
  }, [nodes, links, width, height]);
  
  // Get node color based on category
  const getNodeColor = (category?: string) => {
    switch (category) {
      case 'core':
        return { fill: '#4A89DC', stroke: '#305BB5' };
      case 'advanced':
        return { fill: '#8661C5', stroke: '#592F8E' };
      case 'feature':
        return { fill: '#26B99A', stroke: '#1A8870' };
      default:
        return { fill: '#E67E22', stroke: '#B8651B' };
    }
  };
  
  // Handle node click
  const handleNodeClick = (node: ConceptNode) => {
    setSelectedNode(node === selectedNode ? null : node);
  };
  
  // Pan and zoom functionality
  const handleWheel = (e: React.WheelEvent<SVGSVGElement>) => {
    e.preventDefault();
    const newScale = Math.max(0.5, Math.min(2, transform.scale - (e.deltaY * 0.001)));
    setTransform(prev => ({ ...prev, scale: newScale }));
  };

  return (
    <div className="card overflow-hidden">
      {title && (
        <h3 className="text-xl font-bold mb-4">{title}</h3>
      )}
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-inner-code">
        <svg
          ref={svgRef}
          width={width}
          height={height}
          onWheel={handleWheel}
          className="overflow-visible"
        >
          <g transform={`translate(${transform.x},${transform.y}) scale(${transform.scale})`}>
            {/* Draw links first (so they appear behind the nodes) */}
            {links.map((link, index) => {
              const sourceNode = nodes.find(n => n.id === link.source);
              const targetNode = nodes.find(n => n.id === link.target);
              
              if (!sourceNode || !targetNode) return null;
              
              const sourceX = sourceNode.x || 0;
              const sourceY = sourceNode.y || 0;
              const targetX = targetNode.x || 0;
              const targetY = targetNode.y || 0;
              
              // Calculate the midpoint for the label
              const midX = (sourceX + targetX) / 2;
              const midY = (sourceY + targetY) / 2;
              
              return (
                <g key={`link-${index}`}>
                  <line
                    x1={sourceX}
                    y1={sourceY}
                    x2={targetX}
                    y2={targetY}
                    stroke="currentColor"
                    strokeOpacity={0.6}
                    strokeWidth={2}
                    className="text-gray-400 dark:text-gray-600"
                  />
                  {link.label && (
                    <text
                      x={midX}
                      y={midY}
                      textAnchor="middle"
                      dy="-5"
                      fontSize="10"
                      className="fill-current text-gray-600 dark:text-gray-400"
                      style={{ pointerEvents: 'none' }}
                    >
                      {link.label}
                    </text>
                  )}
                </g>
              );
            })}
            
            {/* Draw nodes */}
            {nodes.map(node => {
              const { fill, stroke } = getNodeColor(node.category);
              const isSelected = selectedNode?.id === node.id;
              const isHovered = hoveredNode?.id === node.id;
              
              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x || 0},${node.y || 0})`}
                  onClick={() => handleNodeClick(node)}
                  onMouseEnter={() => setHoveredNode(node)}
                  onMouseLeave={() => setHoveredNode(null)}
                  className="cursor-pointer"
                >
                  <circle
                    r={isSelected || isHovered ? 35 : 30}
                    fill={fill}
                    stroke={stroke}
                    strokeWidth={isSelected ? 3 : 2}
                    className={`transition-all duration-200 ${isSelected ? 'filter drop-shadow-lg' : ''}`}
                  />
                  <text
                    textAnchor="middle"
                    dy=".3em"
                    fontSize={isSelected ? "12" : "11"}
                    fill="white"
                    className="font-medium"
                    style={{ pointerEvents: 'none' }}
                  >
                    {node.label}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>
        
        {/* Node details panel */}
        {selectedNode && (
          <div className="absolute bottom-2 left-2 right-2 bg-white dark:bg-gray-900 p-3 rounded-md shadow-lg border border-gray-200 dark:border-gray-700">
            <h4 className="font-bold text-lg">{selectedNode.label}</h4>
            {selectedNode.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{selectedNode.description}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 
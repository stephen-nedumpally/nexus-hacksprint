'use client';

import { useState } from 'react';
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check, ChevronDown, ChevronRight } from "lucide-react";

interface SubTask {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

interface SubItem {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  tasks: SubTask[];
}

interface RoadmapItem {
  id: string;
  title: string;
  type: 'Resource' | 'Project' | 'Assignment';
  description: string;
  completed: boolean;
  subItems: SubItem[];
}

interface Section {
  id: string;
  title: string;
  items: RoadmapItem[];
  expanded: boolean;
}

export default function DetailedRoadmap() {
  const [sections, setSections] = useState<Section[]>([
    {
      id: '1',
      title: 'Frontend Development',
      expanded: true,
      items: [
        {
          id: '1-1',
          title: 'HTML & CSS Fundamentals',
          type: 'Resource',
          description: 'Learn the basics of web development',
          completed: false,
          subItems: [
            {
              id: '1-1-1',
              title: 'HTML5 Structure',
              description: 'Learn semantic HTML and document structure',
              completed: false,
              tasks: [
                {
                  id: '1-1-1-1',
                  title: 'Document Structure',
                  description: 'Understanding HTML5 semantic elements',
                  completed: false
                },
                {
                  id: '1-1-1-2',
                  title: 'Forms and Validation',
                  description: 'Learn form elements and validation',
                  completed: false
                },
                {
                  id: '1-1-1-3',
                  title: 'Media Elements',
                  description: 'Working with images, audio, and video',
                  completed: false
                }
              ]
            },
            {
              id: '1-1-2',
              title: 'CSS Layout',
              description: 'Master flexbox and grid layouts',
              completed: false,
              tasks: [
                {
                  id: '1-1-2-1',
                  title: 'Flexbox',
                  description: 'Learn flexible box layout',
                  completed: false
                },
                {
                  id: '1-1-2-2',
                  title: 'Grid',
                  description: 'Master CSS Grid layout',
                  completed: false
                },
                {
                  id: '1-1-2-3',
                  title: 'Responsive Design',
                  description: 'Media queries and breakpoints',
                  completed: false
                }
              ]
            }
          ]
        },
        {
          id: '1-2',
          title: 'Portfolio Website',
          type: 'Project',
          description: 'Build your first portfolio site',
          completed: false,
          subItems: [
            {
              id: '1-2-1',
              title: 'Design Phase',
              description: 'Create wireframes and mockups',
              completed: false,
              tasks: [
                {
                  id: '1-2-1-1',
                  title: 'Wireframes',
                  description: 'Create low-fidelity wireframes',
                  completed: false
                },
                {
                  id: '1-2-1-2',
                  title: 'Mockups',
                  description: 'Create high-fidelity mockups',
                  completed: false
                }
              ]
            },
            {
              id: '1-2-2',
              title: 'Development',
              description: 'Implement the design with HTML/CSS',
              completed: false,
              tasks: [
                {
                  id: '1-2-2-1',
                  title: 'HTML Structure',
                  description: 'Create HTML structure',
                  completed: false
                },
                {
                  id: '1-2-2-2',
                  title: 'CSS Styling',
                  description: 'Add CSS styles',
                  completed: false
                }
              ]
            },
            {
              id: '1-2-3',
              title: 'Deployment',
              description: 'Deploy to GitHub Pages',
              completed: false,
              tasks: [
                {
                  id: '1-2-3-1',
                  title: 'Create GitHub Repository',
                  description: 'Create a new GitHub repository',
                  completed: false
                },
                {
                  id: '1-2-3-2',
                  title: 'Deploy to GitHub Pages',
                  description: 'Deploy the website to GitHub Pages',
                  completed: false
                }
              ]
            }
          ]
        },
        {
          id: '1-3',
          title: 'JavaScript Basics Quiz',
          type: 'Assignment',
          description: 'Test your JS knowledge',
          completed: false,
          subItems: [
            {
              id: '1-3-1',
              title: 'Variables & Functions',
              description: 'Basic JavaScript concepts',
              completed: false,
              tasks: [
                {
                  id: '1-3-1-1',
                  title: 'Variables',
                  description: 'Learn about variables in JavaScript',
                  completed: false
                },
                {
                  id: '1-3-1-2',
                  title: 'Functions',
                  description: 'Learn about functions in JavaScript',
                  completed: false
                }
              ]
            },
            {
              id: '1-3-2',
              title: 'DOM Manipulation',
              description: 'Working with the DOM',
              completed: false,
              tasks: [
                {
                  id: '1-3-2-1',
                  title: 'DOM Selection',
                  description: 'Learn about DOM selection methods',
                  completed: false
                },
                {
                  id: '1-3-2-2',
                  title: 'DOM Manipulation',
                  description: 'Learn about DOM manipulation methods',
                  completed: false
                }
              ]
            },
            {
              id: '1-3-3',
              title: 'Events & Async',
              description: 'Event handling and asynchronous JS',
              completed: false,
              tasks: [
                {
                  id: '1-3-3-1',
                  title: 'Events',
                  description: 'Learn about events in JavaScript',
                  completed: false
                },
                {
                  id: '1-3-3-2',
                  title: 'Async/Await',
                  description: 'Learn about async/await in JavaScript',
                  completed: false
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: '2',
      title: 'React Development',
      expanded: false,
      items: [
        {
          id: '2-1',
          title: 'React Hooks Deep Dive',
          type: 'Resource',
          description: 'Master React Hooks with examples',
          completed: false,
          subItems: [
            {
              id: '2-1-1',
              title: 'useState & useEffect',
              description: 'Basic hooks fundamentals',
              completed: false,
              tasks: [
                {
                  id: '2-1-1-1',
                  title: 'useState',
                  description: 'Learn about the useState hook',
                  completed: false
                },
                {
                  id: '2-1-1-2',
                  title: 'useEffect',
                  description: 'Learn about the useEffect hook',
                  completed: false
                }
              ]
            },
            {
              id: '2-1-2',
              title: 'Custom Hooks',
              description: 'Creating reusable hooks',
              completed: false,
              tasks: [
                {
                  id: '2-1-2-1',
                  title: 'Creating Custom Hooks',
                  description: 'Learn about creating custom hooks',
                  completed: false
                }
              ]
            },
            {
              id: '2-1-3',
              title: 'Performance Hooks',
              description: 'useMemo and useCallback',
              completed: false,
              tasks: [
                {
                  id: '2-1-3-1',
                  title: 'useMemo',
                  description: 'Learn about the useMemo hook',
                  completed: false
                },
                {
                  id: '2-1-3-2',
                  title: 'useCallback',
                  description: 'Learn about the useCallback hook',
                  completed: false
                }
              ]
            }
          ]
        },
        {
          id: '2-2',
          title: 'Todo App with React',
          type: 'Project',
          description: 'Build a todo app using React',
          completed: false,
          subItems: [
            {
              id: '2-2-1',
              title: 'Component Structure',
              description: 'Plan and create components',
              completed: false,
              tasks: [
                {
                  id: '2-2-1-1',
                  title: 'Create Components',
                  description: 'Create the necessary components',
                  completed: false
                }
              ]
            },
            {
              id: '2-2-2',
              title: 'State Management',
              description: 'Implement data flow',
              completed: false,
              tasks: [
                {
                  id: '2-2-2-1',
                  title: 'State Management',
                  description: 'Learn about state management in React',
                  completed: false
                }
              ]
            },
            {
              id: '2-2-3',
              title: 'Styling & Polish',
              description: 'Add CSS and animations',
              completed: false,
              tasks: [
                {
                  id: '2-2-3-1',
                  title: 'Styling',
                  description: 'Add CSS styles',
                  completed: false
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: '3',
      title: 'Backend Development',
      expanded: false,
      items: [
        {
          id: '3-1',
          title: 'Node.js Fundamentals',
          type: 'Resource',
          description: 'Learn Node.js basics',
          completed: false,
          subItems: [
            {
              id: '3-1-1',
              title: 'Node.js Core',
              description: 'Core modules and event loop',
              completed: false,
              tasks: [
                {
                  id: '3-1-1-1',
                  title: 'Node.js Core',
                  description: 'Learn about Node.js core modules',
                  completed: false
                }
              ]
            },
            {
              id: '3-1-2',
              title: 'Express.js',
              description: 'Web framework basics',
              completed: false,
              tasks: [
                {
                  id: '3-1-2-1',
                  title: 'Express.js',
                  description: 'Learn about Express.js',
                  completed: false
                }
              ]
            },
            {
              id: '3-1-3',
              title: 'Database Integration',
              description: 'Working with MongoDB',
              completed: false,
              tasks: [
                {
                  id: '3-1-3-1',
                  title: 'Database Integration',
                  description: 'Learn about database integration',
                  completed: false
                }
              ]
            }
          ]
        },
        {
          id: '3-2',
          title: 'REST API Project',
          type: 'Project',
          description: 'Create a RESTful API',
          completed: false,
          subItems: [
            {
              id: '3-2-1',
              title: 'API Design',
              description: 'Plan endpoints and data models',
              completed: false,
              tasks: [
                {
                  id: '3-2-1-1',
                  title: 'API Design',
                  description: 'Learn about API design',
                  completed: false
                }
              ]
            },
            {
              id: '3-2-2',
              title: 'Implementation',
              description: 'Build CRUD operations',
              completed: false,
              tasks: [
                {
                  id: '3-2-2-1',
                  title: 'Implementation',
                  description: 'Implement CRUD operations',
                  completed: false
                }
              ]
            },
            {
              id: '3-2-3',
              title: 'Testing',
              description: 'Write API tests',
              completed: false,
              tasks: [
                {
                  id: '3-2-3-1',
                  title: 'Testing',
                  description: 'Learn about testing',
                  completed: false
                }
              ]
            }
          ]
        }
      ]
    }
  ]);

  const [expandedItems, setExpandedItems] = useState<{[key: string]: boolean}>({});

  const calculateProgress = (items: RoadmapItem[]) => {
    const totalTasks = items.reduce((acc, item) => 
      acc + item.subItems.reduce((subAcc, subItem) => 
        subAcc + subItem.tasks.length, 0
      ), 0
    );
    
    const completedTasks = items.reduce((acc, item) => 
      acc + item.subItems.reduce((subAcc, subItem) => 
        subAcc + subItem.tasks.filter(task => task.completed).length, 0
      ), 0
    );

    return totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  };

  const calculateOverallProgress = () => {
    const totalTasks = sections.reduce((acc, section) => 
      acc + section.items.reduce((itemAcc, item) => 
        itemAcc + item.subItems.reduce((subAcc, subItem) => 
          subAcc + subItem.tasks.length, 0
        ), 0
      ), 0
    );
    
    const completedTasks = sections.reduce((acc, section) => 
      acc + section.items.reduce((itemAcc, item) => 
        itemAcc + item.subItems.reduce((subAcc, subItem) => 
          subAcc + subItem.tasks.filter(task => task.completed).length, 0
        ), 0
      ), 0
    );

    return totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  };

  const toggleSectionExpanded = (sectionId: string) => {
    setSections(prevSections =>
      prevSections.map(section =>
        section.id === sectionId
          ? { ...section, expanded: !section.expanded }
          : section
      )
    );
  };

  const toggleItemExpanded = (itemId: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const toggleTaskComplete = (sectionId: string, itemId: string, subItemId: string, taskId: string) => {
    setSections(prevSections => 
      prevSections.map(section => {
        if (section.id === sectionId) {
          return {
            ...section,
            items: section.items.map(item => {
              if (item.id === itemId) {
                return {
                  ...item,
                  subItems: item.subItems.map(subItem => {
                    if (subItem.id === subItemId) {
                      return {
                        ...subItem,
                        tasks: subItem.tasks.map(task => {
                          if (task.id === taskId) {
                            return { ...task, completed: !task.completed };
                          }
                          return task;
                        })
                      };
                    }
                    return subItem;
                  })
                };
              }
              return item;
            })
          };
        }
        return section;
      })
    );
  };

  return (
    <ScrollArea className="h-[700px]">
      <div className="space-y-8 p-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Overall Progress</h2>
            <span className="text-sm text-gray-400">
              {Math.round(calculateOverallProgress())}% Complete
            </span>
          </div>
          <Progress value={calculateOverallProgress()} className="w-full" />
        </div>

        {sections.map(section => (
          <div key={section.id} className="space-y-4">
            <div 
              className="flex items-center justify-between cursor-pointer"
              onClick={() => toggleSectionExpanded(section.id)}
            >
              <div className="flex items-center space-x-2">
                {section.expanded ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                <h2 className="text-xl font-semibold text-white">{section.title}</h2>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-400">
                  {Math.round(calculateProgress(section.items))}% Complete
                </span>
                <Progress value={calculateProgress(section.items)} className="w-32" />
              </div>
            </div>

            {section.expanded && (
              <div className="space-y-4 ml-4">
                {section.items.map(item => (
                  <div key={item.id} className="bg-[#0F1218] rounded-lg border border-[#1F2937] p-4">
                    <div 
                      className="flex items-start justify-between mb-4 cursor-pointer"
                      onClick={() => toggleItemExpanded(item.id)}
                    >
                      <div>
                        <div className="flex items-center space-x-2">
                          {expandedItems[item.id] ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                          <span className={`inline-block px-2 py-1 rounded text-xs ${
                            item.type === 'Resource'
                              ? 'bg-blue-500/20 text-blue-400'
                              : item.type === 'Project'
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-purple-500/20 text-purple-400'
                          }`}>
                            {item.type}
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold text-white mt-2">{item.title}</h3>
                        <p className="text-gray-400">{item.description}</p>
                      </div>
                    </div>

                    {expandedItems[item.id] && (
                      <div className="space-y-4 mt-4">
                        {item.subItems.map(subItem => (
                          <div key={subItem.id} className="pl-4 border-l border-[#1F2937]">
                            <h4 className="text-sm font-medium text-white mb-2">{subItem.title}</h4>
                            <p className="text-xs text-gray-400 mb-3">{subItem.description}</p>
                            <div className="space-y-2">
                              {subItem.tasks.map(task => (
                                <div key={task.id} className="flex items-start space-x-3">
                                  <Button
                                    variant={task.completed ? "default" : "outline"}
                                    size="sm"
                                    className={`${
                                      task.completed 
                                        ? 'bg-green-500/20 hover:bg-green-500/30 text-green-400 border-green-500/50' 
                                        : 'hover:bg-[#1F2937]'
                                    }`}
                                    onClick={() => toggleTaskComplete(section.id, item.id, subItem.id, task.id)}
                                  >
                                    {task.completed ? (
                                      <>
                                        <Check className="h-4 w-4 mr-1" /> Completed
                                      </>
                                    ) : (
                                      'Mark Complete'
                                    )}
                                  </Button>
                                  <div>
                                    <h5 className="text-sm font-medium text-white">{task.title}</h5>
                                    <p className="text-xs text-gray-400">{task.description}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}

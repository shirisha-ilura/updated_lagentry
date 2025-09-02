import React, { useEffect, useState, useCallback } from 'react';
import { MessageSquare, Zap, Send, CheckCircle, ArrowRight, Database, Bot, X, Upload, Settings, Brain } from 'lucide-react';
import { HashLoader } from 'react-spinners';
import ReactFlow, { 
  Node, 
  Edge, 
  Controls, 
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  NodeTypes,
  EdgeTypes,
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath
} from 'reactflow';
import 'reactflow/dist/style.css';
import { workflowAnalysisService, WorkflowAnalysisResult } from '../services/workflowAnalysisService';
import { n8nIntegrationService, WorkflowDeploymentConfig } from '../services/n8nIntegrationService';
import { oauthTokenService } from '../services/oauthTokenService';
import { llmService } from '../services/llmService';
import { conversationMemoryService } from '../services/conversationMemoryService';

interface BuildViewProps {
  userPrompt: string;
  isBuilding: boolean;
  buildProgress: number;
  isAgentReady: boolean;
  onProgressUpdate: (progress: number) => void;
  onBuildComplete: () => void;
  onOpenChat: () => void;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'agent';
  content: string;
  timestamp: Date;
  isTyping?: boolean;
}

// Custom Node Component
const CustomNode = ({ data }: { data: any }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-1 min-w-[60px] max-w-[60px]">
      <div className="flex flex-col items-center">
        {data.isLoading ? (
          <div className="w-6 h-6 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
            <HashLoader size={12} color="#6B7280" />
          </div>
        ) : (
          <div className="w-6 h-6 bg-white rounded-lg border border-gray-200 flex items-center justify-center">
            {data.type === 'memory' ? (
              <Brain className="w-4 h-4 text-purple-500" />
            ) : data.type === 'openai' ? (
              <img src={data.icon} alt={data.label} className="w-4 h-3" />
            ) : (
              <img src={data.icon} alt={data.label} className="w-4 h-4" />
            )}
          </div>
        )}
        <p className="text-[10px] text-gray-600 mt-1 font-medium text-center leading-tight">{data.label}</p>
      </div>
    </div>
  );
};

const nodeTypes: NodeTypes = {
  custom: CustomNode,
};

// Custom Edge Component
const CustomEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}: any) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
    </>
  );
};

const edgeTypes: EdgeTypes = {
  custom: CustomEdge,
};

export function BuildView({
  userPrompt,
  isBuilding,
  buildProgress,
  isAgentReady,
  onProgressUpdate,
  onBuildComplete,
  onOpenChat
}: BuildViewProps) {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [showThinking, setShowThinking] = useState(true);
  const [showProjectPlan, setShowProjectPlan] = useState(false);
  const [projectApproved, setProjectApproved] = useState(false);
  const [showArchitecture, setShowArchitecture] = useState(false);
  const [showConnectionModal, setShowConnectionModal] = useState(false);
  const [connectionConfig, setConnectionConfig] = useState({
    hostname: '',
    username: '',
    password: '',
    database: '',
    port: '5432'
  });
  const [isConnected, setIsConnected] = useState(false);
  const [showDatabaseChat, setShowDatabaseChat] = useState(false);
  const [typingText, setTypingText] = useState('');
  const [currentTypingIndex, setCurrentTypingIndex] = useState(0);
  const [analysisResult, setAnalysisResult] = useState<WorkflowAnalysisResult | null>(null);
  const [projectPlanText, setProjectPlanText] = useState('');
  const [logs, setLogs] = useState<string[]>([]);
  const [workflowId, setWorkflowId] = useState<string>('');
  const [deploymentStatus, setDeploymentStatus] = useState<'idle' | 'deploying' | 'success' | 'error'>('idle');
  const [deploymentMessage, setDeploymentMessage] = useState('');
  const [n8nConnectionStatus, setN8nConnectionStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
  const [n8nInstanceInfo, setN8nInstanceInfo] = useState<{ version: string; isConnected: boolean } | null>(null);
  const [waitingForClarification, setWaitingForClarification] = useState(false);
  const [clarificationQuestions, setClarificationQuestions] = useState<string[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Database chat state
  const [databaseMessages, setDatabaseMessages] = useState<ChatMessage[]>([]);
  const [databaseInput, setDatabaseInput] = useState('');
  const [isDatabaseThinking, setIsDatabaseThinking] = useState(false);
  const [thinkingPhase, setThinkingPhase] = useState<'thinking' | 'extracting' | 'consolidating' | null>(null);

  // React Flow state
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Debug edges
  useEffect(() => {
    console.log('Current edges:', edges);
  }, [edges]);

  const buildSteps = [
    'Finalizing architecture...',
    'Setting up integrations...',
    'Generating agent logic...',
    'Configuring workflows...',
    'Finalizing deployment...'
  ];

  // Initialize with user prompt and start LLM analysis
  useEffect(() => {
    if (!userPrompt) return;
    if (analysisResult) return; // avoid re-analysis when result already exists

    // Start LLM analysis once on initial prompt
    performLLMAnalysis();
  }, [userPrompt]);

  // Test n8n connection on mount
  useEffect(() => {
    const testN8nConnection = async () => {
      try {
        setN8nConnectionStatus('checking');
        const isConnected = await n8nIntegrationService.testConnection();
        const instanceInfo = await n8nIntegrationService.getInstanceInfo();
        
        setN8nConnectionStatus(isConnected ? 'connected' : 'disconnected');
        setN8nInstanceInfo(instanceInfo);
      } catch (error) {
        console.error('Failed to test n8n connection:', error);
        setN8nConnectionStatus('disconnected');
      }
    };

    testN8nConnection();
  }, []);

  // Perform LLM analysis
  const performLLMAnalysis = async () => {
    try {
      console.log('Performing LLM analysis...');
      const result = await workflowAnalysisService.analyzeUserPrompt(userPrompt);
      
      console.log('LLM analysis completed:', result);
      setAnalysisResult(result);
      setProjectPlanText(result.projectPlan);
      setLogs(result.logs);
      
      // Store analysis in memory
      conversationMemoryService.storeAnalysisResult({
        prompt: userPrompt,
        analysis: result.analysis,
        requirements: result.analysis.requirements,
        strategy: result.analysis.requirements.strategy || '',
        clarifications: result.analysis.requirements.clarifications || [],
        userResponses: {},
        timestamp: new Date()
      });
      
      // Check if LLM needs clarification
      if (result.analysis.needsClarification && result.analysis.suggestedQuestions) {
        setClarificationQuestions(result.analysis.suggestedQuestions);
        setWaitingForClarification(true);
        return;
      }
      
      // Show thinking animation for max 3 seconds, then reveal plan regardless
      setTimeout(() => {
        setShowThinking(false);
        setShowProjectPlan(true);
        setTypingText('');
        setCurrentTypingIndex(0);
      }, 3000);
      
    } catch (error) {
      console.error('LLM analysis failed:', error);
      // Fail-safe to stop indefinite thinking
      setShowThinking(false);
    }
  };

  // Typing effect for project plan
  useEffect(() => {
    if (showProjectPlan && currentTypingIndex < projectPlanText.length) {
      const timer = setTimeout(() => {
        setTypingText(projectPlanText.slice(0, currentTypingIndex + 1));
        setCurrentTypingIndex(currentTypingIndex + 1);
      }, 5); // Increased speed from 30ms to 5ms

      return () => clearTimeout(timer);
    }
  }, [showProjectPlan, currentTypingIndex, projectPlanText]);

  // Add project plan message when typing is complete
  useEffect(() => {
    if (showProjectPlan && currentTypingIndex === projectPlanText.length) {
      setChatMessages(prev => {
        const exists = prev.some(msg => msg.content.includes('I\'ll help you build'));
        if (!exists) {
          return [...prev, {
            id: `plan-${Date.now()}`,
            type: 'agent',
            content: projectPlanText,
            timestamp: new Date()
          }];
        }
        return prev;
      });
    }
  }, [showProjectPlan, currentTypingIndex, projectPlanText]);

  const canApprove = showProjectPlan && currentTypingIndex === projectPlanText.length && (analysisResult?.analysis?.confidence || 0) > 0;

  // Handle project approval and start architecture
  const handleProjectApproval = () => {
    if (!canApprove) return;
    setProjectApproved(true);
    setShowProjectPlan(false);
    setShowArchitecture(true);
    
    // Add approval message
    setChatMessages(prev => [...prev, {
      id: `approve-${Date.now()}`,
      type: 'user',
      content: 'Yes, please proceed with the build!',
      timestamp: new Date()
    }]);

    // Start architecture animation sequence based on analysis result
    setTimeout(() => {
      const requiredConnections = analysisResult?.requiredConnections || ['openai'];
      
      // Add nodes based on required connections
      const newNodes = [];
      let xOffset = 20;
      
      // Always add OpenAI node
      newNodes.push({
        id: 'openai',
        type: 'custom',
        position: { x: xOffset, y: 20 },
        data: { 
          label: 'OpenAI', 
          icon: '/images/openai-icon.png', 
          type: 'openai',
          isLoading: true 
        }
      });
      xOffset += 100;

      // Add connection-specific nodes
      if (requiredConnections.includes('google')) {
        newNodes.push({
          id: 'google',
          type: 'custom',
          position: { x: xOffset, y: 20 },
          data: { 
            label: 'Google', 
            icon: '/images/google-icon.png', 
            type: 'google',
            isLoading: true 
          }
        });
        xOffset += 100;
      }

      if (requiredConnections.includes('jira')) {
        newNodes.push({
          id: 'jira',
          type: 'custom',
          position: { x: xOffset, y: 20 },
          data: { 
            label: 'Jira', 
            icon: '/images/jira-icon.png', 
            type: 'jira',
            isLoading: true 
          }
        });
        xOffset += 100;
      }

      if (requiredConnections.includes('slack')) {
        newNodes.push({
          id: 'slack',
          type: 'custom',
          position: { x: xOffset, y: 20 },
          data: { 
            label: 'Slack', 
            icon: '/images/slack-icon.png', 
            type: 'slack',
            isLoading: true 
          }
        });
        xOffset += 100;
      }

      // Add memory node
      newNodes.push({
        id: 'memory',
        type: 'custom',
        position: { x: 70, y: 80 },
        data: { 
          label: 'Memory', 
          icon: '/images/memory-icon.png', 
          type: 'memory',
          isLoading: true 
        }
      });

      setNodes(newNodes);
    }, 300);

    // Animate nodes loading and connecting
    setTimeout(() => {
      setNodes(prev => prev.map(node => ({ ...node, data: { ...node.data, isLoading: false } })));
    }, 1200);

    setTimeout(() => {
      // Add connections
      const newEdges: any[] = [];
      const nodeIds = nodes.map(n => n.id);
      
      // Connect all nodes to OpenAI
      nodeIds.forEach(nodeId => {
        if (nodeId !== 'openai') {
          newEdges.push({
            id: `${nodeId}-openai`,
            source: nodeId,
            target: 'openai',
            type: 'custom',
            style: { stroke: '#6B7280', strokeWidth: 3 }
          });
        }
      });

      // Connect all nodes to memory
      nodeIds.forEach(nodeId => {
        if (nodeId !== 'memory') {
          newEdges.push({
            id: `${nodeId}-memory`,
            source: nodeId,
            target: 'memory',
            type: 'custom',
            style: { stroke: '#6B7280', strokeWidth: 3 }
          });
        }
      });

      setEdges(newEdges);
    }, 2400);

    // Start building after architecture is complete
    setTimeout(() => {
      onProgressUpdate(0); // This will trigger the building state
    }, 3600);
  };

  // Building progress effect
  useEffect(() => {
    if (isBuilding) {
      const interval = setInterval(() => {
        const newProgress = buildProgress + (100 / buildSteps.length / 10);
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => onBuildComplete(), 500);
          onProgressUpdate(100);
        } else {
          onProgressUpdate(newProgress);
        }
      }, 100);

      return () => clearInterval(interval);
    }
  }, [isBuilding, buildProgress, onProgressUpdate, onBuildComplete, buildSteps.length]);

  // Add completion message
  useEffect(() => {
    if (isAgentReady) {
      console.log('Agent is ready, current messages:', chatMessages);
      setChatMessages(prev => {
        const exists = prev.some(msg => msg.content.includes('Agent built successfully'));
        console.log('Checking if completion message exists:', exists);
        if (!exists) {
          const newMessages: ChatMessage[] = [...prev, {
            id: Date.now().toString(),
            type: 'agent' as const,
            content: "Your Database agent is ready! You can now test it by configuring your PostgreSQL connection and start chatting with your data.",
            timestamp: new Date()
          }];
          console.log('Adding completion message, new messages:', newMessages);
          return newMessages;
        }
        return prev;
      });
    }
  }, [isAgentReady]);

  const currentStepIndex = Math.floor((buildProgress / 100) * buildSteps.length);

  // Handle clarification responses
  const handleClarificationResponse = async (responses: { [question: string]: string }) => {
    setWaitingForClarification(false);
    
    // Re-analyze with user responses
    const updatedPrompt = `${userPrompt}\n\nUser clarifications:\n${Object.entries(responses).map(([q, a]) => `${q}: ${a}`).join('\n')}`;
    
    try {
      const result = await workflowAnalysisService.analyzeUserPrompt(updatedPrompt);
      setAnalysisResult(result);
      setProjectPlanText(result.projectPlan);
      setLogs([...logs, ...result.logs]);
      
      setTimeout(() => {
        setShowThinking(false);
        setShowProjectPlan(true);
        setTypingText('');
        setCurrentTypingIndex(0);
      }, 3000);
    } catch (error) {
      console.error('Re-analysis failed:', error);
    }
  };

  // Handle chat message submission
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const userMessage = {
        id: `user-${Date.now()}`,
        type: 'user' as const,
        content: newMessage.trim(),
        timestamp: new Date()
      };
      
      setChatMessages(prev => [...prev, userMessage]);
      setNewMessage('');

      // Store in memory
      conversationMemoryService.addConversationEntry({
        type: 'user',
        content: newMessage.trim()
      });

      // Check if this is a follow-up question
      if (conversationMemoryService.isFollowUpQuestion(newMessage.trim())) {
        handleFollowUpQuestion(newMessage.trim());
      } else if (waitingForClarification && currentQuestionIndex < clarificationQuestions.length) {
        // Handle clarification answer
        handleClarificationAnswer(newMessage.trim());
      } else {
        // Handle new request
        handleNewRequest(newMessage.trim());
      }
    }
  };

  // Handle follow-up questions
  const handleFollowUpQuestion = async (followUpMessage: string) => {
    try {
      // Get conversation context for follow-up
      const context = conversationMemoryService.getFollowUpContext(followUpMessage);
      
      // Analyze with context
      const result = await llmService.analyzePrompt(followUpMessage, true);
      
      // Store analysis in memory
      conversationMemoryService.storeAnalysisResult({
        prompt: followUpMessage,
        analysis: result,
        requirements: result.requirements,
        strategy: result.requirements.strategy || '',
        clarifications: result.requirements.clarifications || [],
        userResponses: {},
        timestamp: new Date()
      });

      // Add agent response
      const agentMessage = {
        id: `agent-followup-${Date.now()}`,
        type: 'agent' as const,
        content: `Based on our previous conversation, here's what I understand about your follow-up request:\n\n${result.requirements.strategy || 'I\'ll help you with that.'}`,
        timestamp: new Date()
      };

      setChatMessages(prev => [...prev, agentMessage]);
      
      // Store agent response in memory
      conversationMemoryService.addConversationEntry({
        type: 'agent',
        content: agentMessage.content
      });

    } catch (error) {
      console.error('Failed to handle follow-up question:', error);
    }
  };

  // Handle new requests
  const handleNewRequest = async (newRequest: string) => {
    try {
      // Clear previous analysis state
      setAnalysisResult(null);
      setProjectPlanText('');
      setShowThinking(true);
      setShowProjectPlan(false);
      
      // Perform new analysis
      const result = await workflowAnalysisService.analyzeUserPrompt(newRequest);
      setAnalysisResult(result);
      setProjectPlanText(result.projectPlan);
      setLogs(result.logs);
      
      // Store analysis in memory
      conversationMemoryService.storeAnalysisResult({
        prompt: newRequest,
        analysis: result.analysis,
        requirements: result.analysis.requirements,
        strategy: result.analysis.requirements.strategy || '',
        clarifications: result.analysis.requirements.clarifications || [],
        userResponses: {},
        timestamp: new Date()
      });

      // Show thinking animation for 3 seconds
      setTimeout(() => {
        setShowThinking(false);
        setShowProjectPlan(true);
        setTypingText('');
        setCurrentTypingIndex(0);
      }, 3000);
      
    } catch (error) {
      console.error('Failed to handle new request:', error);
    }
  };

  // Handle clarification answer
  const handleClarificationAnswer = async (answer: string) => {
    const currentQuestion = clarificationQuestions[currentQuestionIndex];
    
    // Add the question and answer to chat
    setChatMessages(prev => [
      ...prev,
      {
        id: `clarification-${currentQuestionIndex}`,
        type: 'agent' as const,
        content: `To better understand your requirements, I need to know: ${currentQuestion}`,
        timestamp: new Date()
      },
      {
        id: `answer-${currentQuestionIndex}`,
        type: 'user' as const,
        content: answer,
        timestamp: new Date()
      }
    ]);

    // Store the answer
    const responses = { [currentQuestion]: answer };
    
    // Move to next question or complete
    if (currentQuestionIndex + 1 < clarificationQuestions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // All questions answered, re-analyze
      setWaitingForClarification(false);
      setCurrentQuestionIndex(0);
      
      // Re-analyze with all responses
      const allResponses = { ...responses };
      const updatedPrompt = `${userPrompt}\n\nUser clarifications:\n${Object.entries(allResponses).map(([q, a]) => `${q}: ${a}`).join('\n')}`;
      
      try {
        const result = await workflowAnalysisService.analyzeUserPrompt(updatedPrompt);
        setAnalysisResult(result);
        setProjectPlanText(result.projectPlan);
        setLogs([...logs, ...result.logs]);
        
        setTimeout(() => {
          setShowThinking(false);
          setShowProjectPlan(true);
          setTypingText('');
          setCurrentTypingIndex(0);
        }, 3000);
      } catch (error) {
        console.error('Re-analysis failed:', error);
      }
    }
  };

  // Deploy workflow to n8n
  const deployWorkflow = async () => {
    if (!analysisResult) return;
    
    // Check n8n connection first
    if (n8nConnectionStatus !== 'connected') {
      setDeploymentStatus('error');
      setDeploymentMessage('n8n is not connected. Please ensure n8n is running and accessible.');
      return;
    }
    
    setDeploymentStatus('deploying');
    setDeploymentMessage('Preparing workflow deployment...');
    
    try {
      // Get OAuth tokens
      const tokens = await oauthTokenService.getValidTokensForDeployment();
      
      // Check if we have required tokens
      const missingTokens = analysisResult.requiredConnections.filter(conn => !tokens[conn]);
      if (missingTokens.length > 0) {
        setDeploymentStatus('error');
        setDeploymentMessage(`Missing OAuth tokens for: ${missingTokens.join(', ')}. Please connect these services first.`);
        return;
      }
      
      setDeploymentMessage('Generating n8n workflow template...');
      
      // Generate workflow template
      const workflowTemplate = await llmService.generateWorkflowTemplate(analysisResult.analysis.requirements);
      
      setDeploymentMessage('Deploying workflow to n8n...');
      
      // Prepare deployment config
      const deploymentConfig: WorkflowDeploymentConfig = {
        workflowName: `${analysisResult.analysis.requirements.name}_${Date.now()}`,
        workflowData: workflowTemplate,
        credentials: {}, // Will be populated by n8n integration service
        oauthTokens: tokens,
        agentPrompts: {} // Can be populated for AI nodes
      };
      
      // Deploy to n8n
      const result = await n8nIntegrationService.deployWorkflow(deploymentConfig);
      
      if (result.success) {
        setWorkflowId(result.workflowId);
        setDeploymentStatus('success');
        setDeploymentMessage(result.message);
      } else {
        setDeploymentStatus('error');
        setDeploymentMessage(result.message);
      }
    } catch (error) {
      console.error('Workflow deployment failed:', error);
      setDeploymentStatus('error');
      setDeploymentMessage(`Deployment failed: ${error}`);
    }
  };

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const handleTestAgent = () => {
    setShowConnectionModal(true);
  };

  const handleConnectionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate connection
    setTimeout(() => {
      setIsConnected(true);
      setShowConnectionModal(false);
      setShowDatabaseChat(true);
    }, 1500);
  };

  const handleUploadEnv = () => {
    // Simulate file upload
    setTimeout(() => {
      setIsConnected(true);
      setShowConnectionModal(false);
      setShowDatabaseChat(true);
    }, 1000);
  };

  const handleDatabaseChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (databaseInput.trim()) {
      // Add user message
      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        type: 'user',
        content: databaseInput.trim(),
        timestamp: new Date()
      };
      setDatabaseMessages(prev => [...prev, userMessage]);
      setDatabaseInput('');
      
      // Start thinking process
      setIsDatabaseThinking(true);
      setThinkingPhase('thinking');
      
      // Thinking phase (1 second)
      setTimeout(() => {
        setThinkingPhase('extracting');
        
        // Extracting data phase (2 seconds)
        setTimeout(() => {
          setThinkingPhase('consolidating');
          
          // Consolidating phase (1 second)
          setTimeout(() => {
            setIsDatabaseThinking(false);
            setThinkingPhase(null);
            
            // Add agent response
            const agentMessage: ChatMessage = {
              id: `agent-${Date.now()}`,
              type: 'agent',
              content: `Here's the data for the last quarter with the top 10 revenue streams highlighted:

Last Quarter Revenue Analysis (Q2 2025)

Top 10 Revenue Streams:
1. Enterprise Software Licenses - $200k (↑ 15%)
2. Cloud Infrastructure Services - $180k (↑ 22%)
3. Professional Consulting - $150k (↑ 8%)
4. Data Analytics Platform - $120k (↑ 31%)
5. Mobile App Subscriptions - $95k (↑ 12%)
6. API Integration Services - $82k (↑ 18%)
7. Training & Certification - $68k (↑ 5%)
8. Custom Development - $55k (↑ 9%)
9. Support & Maintenance - $42k (↑ 3%)
10. Third-party Integrations - $38k (↑ 14%)

Key Insights:
• Total Q2 Revenue: $1.08M (↑ 16% vs Q1)
• Cloud services showing strongest growth at 22%
• Data Analytics Platform had exceptional 31% growth
• Enterprise segment remains the largest contributor
• All top 10 streams showed positive growth

Recommendations:
• Focus on expanding cloud infrastructure offerings
• Invest in data analytics capabilities
• Strengthen enterprise sales team
• Develop more API integration opportunities

The data shows a healthy quarter with all major revenue streams performing well, particularly in cloud and analytics segments.`,
              timestamp: new Date()
            };
            setDatabaseMessages(prev => [...prev, agentMessage]);
          }, 1000);
        }, 2000);
      }, 1000);
    }
  };

  return (
    <div className="flex-1 flex h-screen pt-24">
      {/* Left Panel - Chat Window */}
      <div className="w-1/2 border-r border-gray-200 dark:border-gray-800 flex flex-col">
        {/* Chat Messages Container */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="space-y-4">
            {chatMessages.map((message) => (
              <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-md rounded-2xl px-4 py-3 ${
                  message.type === 'user' 
                    ? 'bg-orange-500 dark:bg-gray-600 text-white' 
                    : 'bg-transparent text-gray-900 dark:text-white'
                }`}>
                  <p className="text-sm whitespace-pre-line">{message.content}</p>
                </div>
              </div>
            ))}
            
            {/* Thinking Animation */}
            {showThinking && (
              <div className="flex justify-start">
                <div className="max-w-md rounded-2xl px-4 py-3 bg-transparent text-gray-900 dark:text-white">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-sm text-gray-500">Thinking...</span>
                  </div>
                </div>
              </div>
            )}

            {/* Typing Effect */}
            {showProjectPlan && currentTypingIndex < projectPlanText.length && (
              <div className="flex justify-start">
                <div className="max-w-md rounded-2xl px-4 py-3 bg-transparent text-gray-900 dark:text-white">
                  <p className="text-sm whitespace-pre-line">
                    {typingText}
                    <span className="animate-pulse">|</span>
                  </p>
                </div>
              </div>
            )}
            
            {/* Project Approval Buttons */}
            {canApprove && (
              <div className="flex justify-end space-x-3 mt-4">
                <button
                  onClick={handleProjectApproval}
                  className="px-6 py-3 bg-orange-500 hover:bg-orange-600 dark:bg-[#8B5CF6] dark:hover:bg-[#A855F7] text-white rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-orange-500/25 dark:hover:shadow-[#8B5CF6]/25"
                >
                  Approve & Build
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Chat Input - Fixed at bottom */}
        <div className="p-6">
          <form onSubmit={handleSendMessage} className="relative">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  if (newMessage.trim()) {
                    handleSendMessage(e);
                  }
                }
              }}
              placeholder="Type a message..."
              className="w-full h-32 px-4 py-4 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-[#8B5CF6] focus:border-transparent text-lg transition-colors duration-300"
              disabled={isBuilding || showThinking}
            />
            
            {/* Send Button - appears when typing */}
            <div className={`absolute top-4 right-4 transition-all duration-300 ease-out ${
              newMessage.trim() 
                ? 'opacity-100 scale-100 translate-y-0' 
                : 'opacity-0 scale-75 translate-y-2 pointer-events-none'
            }`}>
              <button
                type="submit"
                disabled={!newMessage.trim() || isBuilding || showThinking}
                className="w-10 h-10 bg-orange-500 hover:bg-orange-600 dark:bg-[#8B5CF6] dark:hover:bg-[#A855F7] disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-orange-500/25 dark:hover:shadow-[#8B5CF6]/25"
              >
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Right Panel - Progress/Architecture */}
      <div className="w-1/2 flex flex-col">
        {showArchitecture ? (
          // Architecture View with React Flow
          <div className="flex-1 p-6 overflow-y-auto">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Building Architecture</h2>
            
            {/* AI Agent Container */}
            <div className="relative bg-white rounded-lg border-2 border-gray-200 p-6 mb-4 h-64" 
                 style={{
                   backgroundSize: '20px 20px'
                 }}>
              
              {/* React Flow Diagram */}
              <div className="h-56 w-full">
                <ReactFlow
                  nodes={nodes}
                  edges={edges}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
                  onConnect={onConnect}
                  nodeTypes={nodeTypes}
                  edgeTypes={edgeTypes}
                  fitView
                  fitViewOptions={{ padding: 0.1 }}
                  attributionPosition="bottom-left"
                  className="bg-transparent"
                  proOptions={{ hideAttribution: true }}
                  minZoom={0.5}
                  maxZoom={1.5}
                >
                  <Background color="#9ca3af" gap={20} />
                </ReactFlow>
              </div>
            </div>
            
            <div className="mt-6 text-center">
              <p className="text-gray-600 dark:text-gray-400">
                {nodes.length === 0 
                  ? 'Analyzing requirements...' 
                  : nodes.length > 0 && edges.length === 0 
                    ? 'Connecting components...' 
                    : edges.length > 0 
                      ? 'Architecture complete! Starting build...' 
                      : 'Setting up architecture...'}
              </p>
            </div>

            {/* Build Steps - Only visible after architecture is complete and user has approved */}
            {(isBuilding || isAgentReady) && showArchitecture && projectApproved && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Build Progress</h3>
                <div className="space-y-3">
                  {buildSteps.map((step, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      {index === currentStepIndex && isBuilding ? (
                        <div className="w-6 h-6 flex items-center justify-center">
                          <HashLoader size={20} color="#8B5CF6" />
                        </div>
                      ) : (
                        <div className={`w-3 h-3 rounded-full ${
                          index < currentStepIndex ? 'bg-orange-500 dark:bg-[#8B5CF6]' :
                          index === currentStepIndex ? 'bg-orange-400 dark:bg-[#A855F7] animate-pulse' :
                          'bg-gray-300 dark:bg-gray-600'
                        }`} />
                      )}
                      <p className={`${
                        index <= currentStepIndex ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-500'
                      } transition-colors duration-300`}>
                        {step}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Success Section - Fixed at bottom */}
            {isAgentReady && (
              <div className="mt-6">
                <div className="space-y-4">
                  <div className="p-4 bg-orange-50 dark:bg-[#8B5CF6]/10 border border-orange-200 dark:border-[#8B5CF6]/30 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-orange-600 dark:text-[#8B5CF6]" />
                      <div>
                        <p className="text-orange-800 dark:text-[#8B5CF6] font-medium transition-colors duration-300">Agent built successfully!</p>
                        <p className="text-orange-700 dark:text-[#A855F7] text-sm mt-1 transition-colors duration-300">
                          Your AI agent is ready for testing and deployment.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <button
                      onClick={handleTestAgent}
                      className="w-full bg-white hover:bg-gray-50 dark:bg-white dark:hover:bg-gray-200 text-gray-900 dark:text-black px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 border border-gray-200 dark:border-gray-300"
                    >
                      <Database className="h-5 w-5" />
                      <span>Test Agent</span>
                    </button>

                    <button
                      onClick={deployWorkflow}
                      disabled={deploymentStatus === 'deploying' || n8nConnectionStatus !== 'connected'}
                      className="w-full bg-orange-500 hover:bg-orange-600 dark:bg-[#8B5CF6] dark:hover:bg-[#A855F7] disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2"
                    >
                      {deploymentStatus === 'deploying' ? (
                        <>
                          <HashLoader size={20} color="#ffffff" />
                          <span>Deploying...</span>
                        </>
                      ) : (
                        <>
                          <Zap className="h-5 w-5" />
                          <span>Deploy to n8n</span>
                        </>
                      )}
                    </button>

                    {/* n8n Connection Status */}
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${
                          n8nConnectionStatus === 'connected' ? 'bg-green-500' :
                          n8nConnectionStatus === 'checking' ? 'bg-yellow-500 animate-pulse' :
                          'bg-red-500'
                        }`} />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          n8n Connection: {n8nConnectionStatus}
                        </span>
                      </div>
                      {n8nInstanceInfo && n8nConnectionStatus === 'connected' && (
                        <span className="text-xs text-gray-500 dark:text-gray-500">
                          v{n8nInstanceInfo.version}
                        </span>
                      )}
                      {n8nInstanceInfo && n8nInstanceInfo.version === 'API not available' && (
                        <span className="text-xs text-red-500 dark:text-red-400">
                          API not available
                        </span>
                      )}
                    </div>

                    {deploymentStatus === 'success' && (
                      <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                        <p className="text-green-800 dark:text-green-400 text-sm">
                          ✅ {deploymentMessage}
                        </p>
                      </div>
                    )}

                    {deploymentStatus === 'error' && (
                      <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                        <p className="text-red-800 dark:text-red-400 text-sm">
                          ❌ {deploymentMessage}
                        </p>
                      </div>
                    )}

                    {/* n8n Setup Instructions */}
                    {n8nConnectionStatus === 'disconnected' && (
                      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                        <p className="text-blue-800 dark:text-blue-400 text-sm">
                          💡 To enable n8n API access, start n8n with: <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">npx n8n start --tunnel</code>
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          // Build Progress View (when architecture is hidden)
          <>
            {((isBuilding || isAgentReady) && projectApproved) ? (
              <>
                <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 transition-colors duration-300">Build Progress</h2>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
                    <div
                      className="bg-orange-500 dark:bg-[#8B5CF6] h-2 rounded-full transition-all duration-300"
                      style={{ width: `${buildProgress}%` }}
                    />
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300">{Math.round(buildProgress)}% complete</p>
                </div>

                <div className="flex-1 p-6 overflow-y-auto">
                  <div className="space-y-4">
                    {buildSteps.map((step, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        {index === currentStepIndex && isBuilding ? (
                          <div className="w-6 h-6 flex items-center justify-center">
                            <HashLoader size={20} color="#8B5CF6" />
                          </div>
                        ) : (
                          <div className={`w-3 h-3 rounded-full ${
                            index < currentStepIndex ? 'bg-orange-500 dark:bg-[#8B5CF6]' :
                            index === currentStepIndex ? 'bg-orange-400 dark:bg-[#A855F7] animate-pulse' :
                            'bg-gray-300 dark:bg-gray-600'
                          }`} />
                        )}
                        <p className={`${
                          index <= currentStepIndex ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-500'
                        } transition-colors duration-300`}>
                          {step}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Success Section - Fixed at bottom */}
                {isAgentReady && (
                  <div className="p-6">
                    <div className="space-y-4">
                      <div className="p-4 bg-orange-50 dark:bg-[#8B5CF6]/10 border border-orange-200 dark:border-[#8B5CF6]/30 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <CheckCircle className="h-5 w-5 text-orange-600 dark:text-[#8B5CF6]" />
                          <div>
                            <p className="text-orange-800 dark:text-[#8B5CF6] font-medium transition-colors duration-300">Agent built successfully!</p>
                            <p className="text-orange-700 dark:text-[#A855F7] text-sm mt-1 transition-colors duration-300">
                              Your AI agent is ready for testing and deployment.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <button
                          onClick={handleTestAgent}
                          className="w-full bg-white hover:bg-gray-50 dark:bg-white dark:hover:bg-gray-200 text-gray-900 dark:text-black px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 border border-gray-200 dark:border-gray-300"
                        >
                          <Database className="h-5 w-5" />
                          <span>Test Agent</span>
                        </button>

                        <button
                          onClick={() => alert('Agent deployed successfully!')}
                          className="w-full bg-orange-500 hover:bg-orange-600 dark:bg-[#8B5CF6] dark:hover:bg-[#A855F7] text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2"
                        >
                          <Zap className="h-5 w-5" />
                          <span>Deploy Agent</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Analyzing Requirements</h3>
                  <p className="text-gray-600 dark:text-gray-400">Please wait while I analyze your prompt...</p>
                  
                  {/* Analysis Logs - Only show during analysis phase */}
                  {logs.length > 0 && !showProjectPlan && (
                    <div className="mt-6">
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Analysis Logs</h4>
                      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 max-h-32 overflow-y-auto">
                        {logs.slice(-5).map((log, index) => (
                          <div key={index} className="text-xs font-mono text-gray-600 dark:text-gray-400 mb-1">
                            {log}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* PostgreSQL Connection Modal */}
      {showConnectionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Configure PostgreSQL Connection</h3>
                <button
                  onClick={() => setShowConnectionModal(false)}
                  className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex space-x-3">
                  <button
                    onClick={handleUploadEnv}
                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-orange-500 dark:hover:border-[#8B5CF6] transition-colors duration-200"
                  >
                    <Upload className="h-5 w-5" />
                    <span>Upload .env file</span>
                  </button>
                </div>

                <div className="text-center text-gray-500 dark:text-gray-400">or</div>

                <form onSubmit={handleConnectionSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Hostname</label>
                    <input
                      type="text"
                      value={connectionConfig.hostname}
                      onChange={(e) => setConnectionConfig(prev => ({ ...prev, hostname: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-[#8B5CF6]"
                      placeholder="localhost"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Username</label>
                    <input
                      type="text"
                      value={connectionConfig.username}
                      onChange={(e) => setConnectionConfig(prev => ({ ...prev, username: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-[#8B5CF6]"
                      placeholder="postgres"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
                    <input
                      type="password"
                      value={connectionConfig.password}
                      onChange={(e) => setConnectionConfig(prev => ({ ...prev, password: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-[#8B5CF6]"
                      placeholder="••••••••"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Database</label>
                    <input
                      type="text"
                      value={connectionConfig.database}
                      onChange={(e) => setConnectionConfig(prev => ({ ...prev, database: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-[#8B5CF6]"
                      placeholder="mydatabase"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Port</label>
                    <input
                      type="text"
                      value={connectionConfig.port}
                      onChange={(e) => setConnectionConfig(prev => ({ ...prev, port: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-[#8B5CF6]"
                      placeholder="5432"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-orange-500 hover:bg-orange-600 dark:bg-[#8B5CF6] dark:hover:bg-[#A855F7] text-white px-6 py-3 rounded-lg font-medium transition-all duration-200"
                  >
                    Connect to Database
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Database Chat Modal */}
      {showDatabaseChat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <Database className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Database Agent</h3>
                  <p className="text-sm text-green-600 dark:text-green-400">Connected to PostgreSQL</p>
                </div>
              </div>
              <button
                onClick={() => setShowDatabaseChat(false)}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="flex justify-start">
                <div className="max-w-md px-4 py-3 rounded-2xl bg-gray-100 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white">
                  <p className="text-sm leading-relaxed">
                    Hi! I am your database agent. I'm now connected to your PostgreSQL database and ready to help you explore and analyze your data. Ask me anything about your data and I'll provide you with detailed insights, run queries, or help you understand your database structure.
                  </p>
                </div>
              </div>
              
              {/* Database Chat Messages */}
              {databaseMessages.map((message) => (
                <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-md rounded-2xl px-4 py-3 ${
                    message.type === 'user' 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-100 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white'
                  }`}>
                    <p className="text-sm whitespace-pre-line">{message.content}</p>
                  </div>
                </div>
              ))}
              
              {/* Thinking Animation */}
              {isDatabaseThinking && (
                <div className="flex justify-start">
                  <div className="max-w-md rounded-2xl px-4 py-3 bg-gray-100 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white">
                    <div className="flex items-center space-x-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="text-sm text-green-600 dark:text-green-400">
                        {thinkingPhase === 'thinking' && 'Thinking...'}
                        {thinkingPhase === 'extracting' && 'Extracting data...'}
                        {thinkingPhase === 'consolidating' && 'Consolidating final response...'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="border-t border-gray-200 dark:border-gray-700 p-6">
              <form onSubmit={handleDatabaseChat} className="relative">
                <textarea
                  value={databaseInput}
                  onChange={(e) => setDatabaseInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      if (databaseInput.trim() && !isDatabaseThinking) {
                        handleDatabaseChat(e);
                      }
                    }
                  }}
                  placeholder="Ask me about your data..."
                  disabled={isDatabaseThinking}
                  className="w-full h-24 px-4 py-4 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <div className="absolute top-4 right-4">
                  <button
                    type="submit"
                    disabled={!databaseInput.trim() || isDatabaseThinking}
                    className="w-10 h-10 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-green-500/25"
                  >
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
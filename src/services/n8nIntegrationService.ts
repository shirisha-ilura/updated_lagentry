import { n8nConfig } from '../config/n8n';

// n8n Integration Service
// Handles workflow deployment, OAuth token management, and dynamic updates

export interface N8nWorkflow {
  id: string;
  name: string;
  active: boolean;
  nodes: any[];
  connections: any;
  settings: any;
  staticData: any;
  tags: string[];
  triggerCount: number;
  updatedAt: string;
  versionId: string;
}

export interface N8nCredentials {
  id: string;
  name: string;
  type: string;
  data: any;
  nodesAccess: any[];
}

export interface WorkflowDeploymentConfig {
  workflowName: string;
  workflowData: any;
  credentials: { [key: string]: any };
  oauthTokens: { [provider: string]: string };
  agentPrompts?: { [nodeId: string]: string };
}

export interface AgentUpdateRequest {
  workflowId: string;
  nodeId: string;
  newPrompt: string;
  context?: any;
}

export class N8nIntegrationService {
  private n8nBaseUrl: string;
  private apiKey: string;

  constructor(n8nBaseUrl?: string, apiKey?: string) {
    this.n8nBaseUrl = n8nBaseUrl || n8nConfig.baseUrl;
    this.apiKey = apiKey || n8nConfig.apiKey;
  }

  /**
   * Deploy a workflow to n8n
   */
  async deployWorkflow(config: WorkflowDeploymentConfig): Promise<{ workflowId: string; success: boolean; message: string }> {
    try {
      // Step 1: Create or update credentials
      const credentialIds = await this.setupCredentials(config.credentials, config.oauthTokens);
      
      // Step 2: Prepare workflow data with credential references
      const workflowData = this.prepareWorkflowData(config.workflowData, credentialIds);
      
      // Step 3: Deploy workflow
      const response = await fetch(`${this.n8nBaseUrl}/api/v1/workflows`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-N8N-API-KEY': this.apiKey,
        },
        body: JSON.stringify({
          name: config.workflowName,
          active: false, // Start inactive for safety
          nodes: workflowData.nodes,
          connections: workflowData.connections,
          settings: workflowData.settings,
          staticData: workflowData.staticData,
          tags: ['auto-generated', 'ai-created']
        }),
      });

      if (!response.ok) {
        throw new Error(`n8n API error: ${response.status} - ${response.statusText}`);
      }

      const result = await response.json();
      
      // Step 4: Activate workflow
      await this.activateWorkflow(result.id);
      
      return {
        workflowId: result.id,
        success: true,
        message: `Workflow "${config.workflowName}" deployed successfully`
      };
    } catch (error) {
      console.error('Workflow deployment error:', error);
      return {
        workflowId: '',
        success: false,
        message: `Failed to deploy workflow: ${error}`
      };
    }
  }

  /**
   * Setup OAuth credentials in n8n
   */
  private async setupCredentials(credentials: { [key: string]: any }, oauthTokens: { [provider: string]: string }): Promise<{ [key: string]: string }> {
    const credentialIds: { [key: string]: string } = {};

    for (const [credentialName, credentialData] of Object.entries(credentials)) {
      try {
        // Check if credential already exists
        const existingCreds = await this.findCredentialByName(credentialName);
        
        if (existingCreds) {
          // Update existing credential with new tokens
          await this.updateCredential(existingCreds.id, {
            ...credentialData,
            data: {
              ...credentialData.data,
              accessToken: oauthTokens[credentialData.type] || credentialData.data.accessToken
            }
          });
          credentialIds[credentialName] = existingCreds.id;
        } else {
          // Create new credential
          const newCredential = await this.createCredential({
            name: credentialName,
            type: credentialData.type,
            data: {
              ...credentialData.data,
              accessToken: oauthTokens[credentialData.type] || credentialData.data.accessToken
            },
            nodesAccess: credentialData.nodesAccess || []
          });
          credentialIds[credentialName] = newCredential.id;
        }
      } catch (error) {
        console.error(`Failed to setup credential ${credentialName}:`, error);
      }
    }

    return credentialIds;
  }

  /**
   * Find credential by name
   */
  private async findCredentialByName(name: string): Promise<N8nCredentials | null> {
    try {
      const response = await fetch(`${this.n8nBaseUrl}/api/v1/credentials`, {
        headers: {
          'X-N8N-API-KEY': this.apiKey,
        },
      });

      if (!response.ok) return null;

      const credentials = await response.json();
      return credentials.find((cred: N8nCredentials) => cred.name === name) || null;
    } catch (error) {
      console.error('Error finding credential:', error);
      return null;
    }
  }

  /**
   * Create new credential
   */
  private async createCredential(credentialData: any): Promise<N8nCredentials> {
    const response = await fetch(`${this.n8nBaseUrl}/api/v1/credentials`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-N8N-API-KEY': this.apiKey,
      },
      body: JSON.stringify(credentialData),
    });

    if (!response.ok) {
      throw new Error(`Failed to create credential: ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Update existing credential
   */
  private async updateCredential(credentialId: string, credentialData: any): Promise<N8nCredentials> {
    const response = await fetch(`${this.n8nBaseUrl}/api/v1/credentials/${credentialId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-N8N-API-KEY': this.apiKey,
      },
      body: JSON.stringify(credentialData),
    });

    if (!response.ok) {
      throw new Error(`Failed to update credential: ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Prepare workflow data with credential references
   */
  private prepareWorkflowData(workflowData: any, credentialIds: { [key: string]: string }): any {
    const preparedData = { ...workflowData };
    
    // Update node credentials
    preparedData.nodes = preparedData.nodes.map((node: any) => {
      if (node.credentials && Object.keys(node.credentials).length > 0) {
        const updatedCredentials: any = {};
        for (const [credentialType, credentialName] of Object.entries(node.credentials)) {
          if (credentialIds[credentialName as string]) {
            updatedCredentials[credentialType] = {
              id: credentialIds[credentialName as string],
              name: credentialName
            };
          }
        }
        node.credentials = updatedCredentials;
      }
      return node;
    });

    return preparedData;
  }

  /**
   * Activate a workflow
   */
  private async activateWorkflow(workflowId: string): Promise<void> {
    const response = await fetch(`${this.n8nBaseUrl}/api/v1/workflows/${workflowId}/activate`, {
      method: 'POST',
      headers: {
        'X-N8N-API-KEY': this.apiKey,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to activate workflow: ${response.statusText}`);
    }
  }

  /**
   * Update agent prompt in a workflow
   */
  async updateAgentPrompt(request: AgentUpdateRequest): Promise<{ success: boolean; message: string }> {
    try {
      // Get current workflow
      const workflowResponse = await fetch(`${this.n8nBaseUrl}/api/v1/workflows/${request.workflowId}`, {
        headers: {
          'X-N8N-API-KEY': this.apiKey,
        },
      });

      if (!workflowResponse.ok) {
        throw new Error(`Failed to get workflow: ${workflowResponse.statusText}`);
      }

      const workflow = await workflowResponse.json();
      
      // Find and update the specified node
      const updatedNodes = workflow.nodes.map((node: any) => {
        if (node.id === request.nodeId) {
          // Update the prompt in the node parameters
          if (node.parameters && node.parameters.prompt) {
            node.parameters.prompt = request.newPrompt;
          }
          // If it's an AI node, update the system message
          if (node.parameters && node.parameters.systemMessage) {
            node.parameters.systemMessage = request.newPrompt;
          }
        }
        return node;
      });

      // Update the workflow
      const updateResponse = await fetch(`${this.n8nBaseUrl}/api/v1/workflows/${request.workflowId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-N8N-API-KEY': this.apiKey,
        },
        body: JSON.stringify({
          ...workflow,
          nodes: updatedNodes
        }),
      });

      if (!updateResponse.ok) {
        throw new Error(`Failed to update workflow: ${updateResponse.statusText}`);
      }

      return {
        success: true,
        message: `Agent prompt updated successfully in workflow ${request.workflowId}`
      };
    } catch (error) {
      console.error('Agent prompt update error:', error);
      return {
        success: false,
        message: `Failed to update agent prompt: ${error}`
      };
    }
  }

  /**
   * Get workflow status
   */
  async getWorkflowStatus(workflowId: string): Promise<{ active: boolean; lastExecution?: any }> {
    try {
      const response = await fetch(`${this.n8nBaseUrl}/api/v1/workflows/${workflowId}`, {
        headers: {
          'X-N8N-API-KEY': this.apiKey,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to get workflow status: ${response.statusText}`);
      }

      const workflow = await response.json();
      
      // Get last execution if available
      const executionsResponse = await fetch(`${this.n8nBaseUrl}/api/v1/executions?workflowId=${workflowId}&limit=1`, {
        headers: {
          'X-N8N-API-KEY': this.apiKey,
        },
      });

      let lastExecution = null;
      if (executionsResponse.ok) {
        const executions = await executionsResponse.json();
        lastExecution = executions.data?.[0] || null;
      }

      return {
        active: workflow.active,
        lastExecution
      };
    } catch (error) {
      console.error('Error getting workflow status:', error);
      return { active: false };
    }
  }

  /**
   * Test n8n connection
   */
  async testConnection(): Promise<boolean> {
    try {
      const candidatePaths = ['/healthz', '/health', '/api/v1/health'];
      for (const path of candidatePaths) {
        const url = `${this.n8nBaseUrl}${path}`;
        console.log('Testing n8n connection to:', url);
        try {
          const response = await fetch(url, {
            headers: {
              'X-N8N-API-KEY': this.apiKey,
            },
            cache: 'no-store' as RequestCache,
          });
          console.log('n8n health check response:', response.status, response.statusText);
          if (response.ok || response.status === 304) return true;
          // If public API is disabled, /api/v1/health may 404; try next path silently
          if (response.status === 404) continue;
        } catch (innerError) {
          // Try next candidate path
          console.warn('n8n health check attempt failed:', innerError);
          continue;
        }
      }
      return false;
    } catch (error) {
      console.error('n8n connection test failed:', error);
      return false;
    }
  }

  /**
   * Get n8n instance information
   */
  async getInstanceInfo(): Promise<{ version: string; isConnected: boolean }> {
    const candidatePaths = ['/healthz', '/health', '/api/v1/health'];
    for (const path of candidatePaths) {
      const url = `${this.n8nBaseUrl}${path}`;
      try {
        const response = await fetch(url, {
          headers: {
            'X-N8N-API-KEY': this.apiKey,
          },
          cache: 'no-store' as RequestCache,
        });

        if (!response.ok && response.status !== 304) {
          if (response.status === 404) continue; // try next path
          return { version: 'unknown', isConnected: false };
        }

        // Try JSON first; if it fails, treat as basic health OK
        try {
          const health = await response.json();
          return {
            version: health.version || 'unknown',
            isConnected: true,
          };
        } catch {
          return { version: 'unknown', isConnected: true };
        }
      } catch (error) {
        // try next path
        continue;
      }
    }
    return { version: 'unknown', isConnected: false };
  }

  /**
   * Get all workflows from n8n
   */
  async getWorkflows(): Promise<N8nWorkflow[]> {
    try {
      const response = await fetch(`${this.n8nBaseUrl}/api/v1/workflows`, {
        headers: {
          'X-N8N-API-KEY': this.apiKey,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to get workflows: ${response.statusText}`);
      }

      const workflows = await response.json();
      return workflows.data || workflows;
    } catch (error) {
      console.error('Failed to get workflows:', error);
      return [];
    }
  }
}

// Create a singleton instance
export const n8nIntegrationService = new N8nIntegrationService(); 
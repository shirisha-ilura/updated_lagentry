// Template Service for managing n8n workflow templates
// This service handles template storage, retrieval, and matching

export interface N8nTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  complexity: 'simple' | 'medium' | 'complex';
  requiredConnections: string[];
  template: any; // n8n workflow JSON
  createdAt: string;
  updatedAt: string;
}

export interface TemplateMatch {
  template: N8nTemplate;
  score: number;
  reasoning: string;
}

export class TemplateService {
  private templates: N8nTemplate[] = [];

  constructor() {
    this.initializeTemplates();
  }

  /**
   * Initialize default templates
   */
  private initializeTemplates() {
    this.templates = [
      {
        id: 'email-summarizer',
        name: 'Email Summarizer',
        description: 'Automatically summarize emails and send summaries to Slack',
        category: 'communication',
        tags: ['email', 'slack', 'summarization', 'automation'],
        complexity: 'medium',
        requiredConnections: ['google', 'slack'],
        template: {
          name: 'Email Summarizer',
          nodes: [
            {
              id: 'gmail-trigger',
              type: 'n8n-nodes-base.gmailTrigger',
              position: [240, 300],
              parameters: {
                authentication: 'oAuth2',
                resource: 'message',
                operation: 'getAll',
                returnAll: false,
                limit: 10
              }
            },
            {
              id: 'openai-summarize',
              type: 'n8n-nodes-base.openAi',
              position: [460, 300],
              parameters: {
                authentication: 'apiKey',
                resource: 'chat',
                operation: 'completion',
                model: 'gpt-3.5-turbo',
                messages: {
                  values: [
                    {
                      role: 'system',
                      content: 'Summarize the following email in 2-3 sentences:'
                    },
                    {
                      role: 'user',
                      content: '={{ $json.snippet }}'
                    }
                  ]
                }
              }
            },
            {
              id: 'slack-send',
              type: 'n8n-nodes-base.slack',
              position: [680, 300],
              parameters: {
                authentication: 'oAuth2',
                resource: 'message',
                operation: 'post',
                channel: 'general',
                text: '📧 Email Summary: {{ $json.choices[0].message.content }}'
              }
            }
          ],
          connections: {
            'gmail-trigger': {
              main: [
                [
                  {
                    node: 'openai-summarize',
                    type: 'main',
                    index: 0
                  }
                ]
              ]
            },
            'openai-summarize': {
              main: [
                [
                  {
                    node: 'slack-send',
                    type: 'main',
                    index: 0
                  }
                ]
              ]
            }
          }
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'jira-slack-notifications',
        name: 'Jira to Slack Notifications',
        description: 'Send Jira issue updates to Slack channels',
        category: 'project-management',
        tags: ['jira', 'slack', 'notifications', 'project'],
        complexity: 'simple',
        requiredConnections: ['jira', 'slack'],
        template: {
          name: 'Jira to Slack Notifications',
          nodes: [
            {
              id: 'jira-webhook',
              type: 'n8n-nodes-base.webhook',
              position: [240, 300],
              parameters: {
                httpMethod: 'POST',
                path: 'jira-webhook',
                responseMode: 'responseNode'
              }
            },
            {
              id: 'slack-notify',
              type: 'n8n-nodes-base.slack',
              position: [460, 300],
              parameters: {
                authentication: 'oAuth2',
                resource: 'message',
                operation: 'post',
                channel: 'general',
                text: '🔔 Jira Update: {{ $json.issue.key }} - {{ $json.issue.fields.summary }}'
              }
            }
          ],
          connections: {
            'jira-webhook': {
              main: [
                [
                  {
                    node: 'slack-notify',
                    type: 'main',
                    index: 0
                  }
                ]
              ]
            }
          }
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'calendar-slack-reminders',
        name: 'Calendar to Slack Reminders',
        description: 'Send calendar event reminders to Slack',
        category: 'scheduling',
        tags: ['calendar', 'slack', 'reminders', 'scheduling'],
        complexity: 'simple',
        requiredConnections: ['google', 'slack'],
        template: {
          name: 'Calendar to Slack Reminders',
          nodes: [
            {
              id: 'google-calendar-trigger',
              type: 'n8n-nodes-base.googleCalendarTrigger',
              position: [240, 300],
              parameters: {
                authentication: 'oAuth2',
                calendar: 'primary',
                event: 'eventCreated'
              }
            },
            {
              id: 'slack-reminder',
              type: 'n8n-nodes-base.slack',
              position: [460, 300],
              parameters: {
                authentication: 'oAuth2',
                resource: 'message',
                operation: 'post',
                channel: 'general',
                text: '📅 Event Reminder: {{ $json.summary }} at {{ $json.start.dateTime }}'
              }
            }
          ],
          connections: {
            'google-calendar-trigger': {
              main: [
                [
                  {
                    node: 'slack-reminder',
                    type: 'main',
                    index: 0
                  }
                ]
              ]
            }
          }
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
  }

  /**
   * Get all templates
   */
  async getAllTemplates(): Promise<N8nTemplate[]> {
    return this.templates;
  }

  /**
   * Get template by ID
   */
  async getTemplateById(id: string): Promise<N8nTemplate | null> {
    return this.templates.find(template => template.id === id) || null;
  }

  /**
   * Get templates by category
   */
  async getTemplatesByCategory(category: string): Promise<N8nTemplate[]> {
    return this.templates.filter(template => template.category === category);
  }

  /**
   * Get templates by required connections
   */
  async getTemplatesByConnections(connections: string[]): Promise<N8nTemplate[]> {
    return this.templates.filter(template => 
      connections.some(connection => template.requiredConnections.includes(connection))
    );
  }

  /**
   * Find best matching template for requirements
   */
  async findBestMatch(requirements: {
    name: string;
    description: string;
    requiredConnections: string[];
    estimatedComplexity: 'simple' | 'medium' | 'complex';
  }): Promise<TemplateMatch | null> {
    const matches: TemplateMatch[] = [];

    for (const template of this.templates) {
      let score = 0;
      const reasoning: string[] = [];

      // Connection match score (40% weight)
      const connectionMatches = requirements.requiredConnections.filter(conn => 
        template.requiredConnections.includes(conn)
      );
      const connectionScore = (connectionMatches.length / requirements.requiredConnections.length) * 0.4;
      score += connectionScore;
      reasoning.push(`Connection match: ${connectionMatches.length}/${requirements.requiredConnections.length}`);

      // Complexity match score (30% weight)
      if (template.complexity === requirements.estimatedComplexity) {
        score += 0.3;
        reasoning.push('Complexity match');
      } else if (
        (template.complexity === 'medium' && requirements.estimatedComplexity === 'simple') ||
        (template.complexity === 'complex' && requirements.estimatedComplexity === 'medium')
      ) {
        score += 0.2;
        reasoning.push('Complexity close match');
      }

      // Name/description similarity score (30% weight)
      const nameSimilarity = this.calculateSimilarity(
        requirements.name.toLowerCase(),
        template.name.toLowerCase()
      );
      const descSimilarity = this.calculateSimilarity(
        requirements.description.toLowerCase(),
        template.description.toLowerCase()
      );
      const similarityScore = ((nameSimilarity + descSimilarity) / 2) * 0.3;
      score += similarityScore;
      reasoning.push(`Name/description similarity: ${Math.round(similarityScore * 100)}%`);

      if (score > 0.3) { // Only include matches with >30% score
        matches.push({
          template,
          score,
          reasoning: reasoning.join(', ')
        });
      }
    }

    // Sort by score descending
    matches.sort((a, b) => b.score - a.score);

    return matches.length > 0 ? matches[0] : null;
  }

  /**
   * Calculate similarity between two strings
   */
  private calculateSimilarity(str1: string, str2: string): number {
    const words1 = str1.split(/\s+/);
    const words2 = str2.split(/\s+/);
    
    const commonWords = words1.filter(word => words2.includes(word));
    const totalWords = new Set([...words1, ...words2]).size;
    
    return totalWords > 0 ? commonWords.length / totalWords : 0;
  }

  /**
   * Create a new template
   */
  async createTemplate(template: Omit<N8nTemplate, 'id' | 'createdAt' | 'updatedAt'>): Promise<N8nTemplate> {
    const newTemplate: N8nTemplate = {
      ...template,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.templates.push(newTemplate);
    return newTemplate;
  }

  /**
   * Update an existing template
   */
  async updateTemplate(id: string, updates: Partial<N8nTemplate>): Promise<N8nTemplate | null> {
    const index = this.templates.findIndex(template => template.id === id);
    if (index === -1) return null;

    this.templates[index] = {
      ...this.templates[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    return this.templates[index];
  }

  /**
   * Delete a template
   */
  async deleteTemplate(id: string): Promise<boolean> {
    const index = this.templates.findIndex(template => template.id === id);
    if (index === -1) return false;

    this.templates.splice(index, 1);
    return true;
  }

  /**
   * Generate a unique ID
   */
  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  /**
   * Get template categories
   */
  async getCategories(): Promise<string[]> {
    const categories = new Set(this.templates.map(template => template.category));
    return Array.from(categories);
  }

  /**
   * Get all tags
   */
  async getTags(): Promise<string[]> {
    const tags = new Set(this.templates.flatMap(template => template.tags));
    return Array.from(tags);
  }

  /**
   * Search templates by query
   */
  async searchTemplates(query: string): Promise<N8nTemplate[]> {
    const lowerQuery = query.toLowerCase();
    return this.templates.filter(template => 
      template.name.toLowerCase().includes(lowerQuery) ||
      template.description.toLowerCase().includes(lowerQuery) ||
      template.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
      template.category.toLowerCase().includes(lowerQuery)
    );
  }
}

// Create a singleton instance
export const templateService = new TemplateService(); 
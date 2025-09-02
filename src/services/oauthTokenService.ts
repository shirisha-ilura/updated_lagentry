// OAuth Token Management Service
// Handles token storage, retrieval, and integration with n8n

export interface OAuthToken {
  provider: string;
  accessToken: string;
  refreshToken?: string;
  expiresAt?: number;
  scopes: string[];
  userId?: string;
}

export interface TokenStorage {
  [provider: string]: OAuthToken;
}

export class OAuthTokenService {
  private storageKey = 'oauth_tokens';
  private backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

  /**
   * Get stored OAuth tokens
   */
  async getStoredTokens(): Promise<TokenStorage> {
    try {
      // First try to get from backend
      const response = await fetch(`${this.backendUrl}/api/v1/auth/tokens`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const tokens = await response.json();
        return tokens;
      }
    } catch (error) {
      console.warn('Failed to get tokens from backend, using local storage:', error);
    }

    // Fallback to localStorage
    const stored = localStorage.getItem(this.storageKey);
    return stored ? JSON.parse(stored) : {};
  }

  /**
   * Store OAuth token
   */
  async storeToken(provider: string, token: OAuthToken): Promise<void> {
    try {
      // Store in backend
      const response = await fetch(`${this.backendUrl}/api/v1/auth/tokens`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          provider,
          token
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to store token: ${response.statusText}`);
      }
    } catch (error) {
      console.warn('Failed to store token in backend, using local storage:', error);
      
      // Fallback to localStorage
      const tokens = await this.getStoredTokens();
      tokens[provider] = token;
      localStorage.setItem(this.storageKey, JSON.stringify(tokens));
    }
  }

  /**
   * Get token for specific provider
   */
  async getToken(provider: string): Promise<OAuthToken | null> {
    const tokens = await this.getStoredTokens();
    return tokens[provider] || null;
  }

  /**
   * Check if token is valid (not expired)
   */
  isTokenValid(token: OAuthToken): boolean {
    if (!token.expiresAt) return true; // No expiration set
    // Support both seconds and milliseconds epoch values
    const expiresRaw = token.expiresAt;
    const expiresMs = expiresRaw < 1e12 ? expiresRaw * 1000 : expiresRaw;
    return Date.now() < expiresMs;
  }

  /**
   * Refresh token if needed
   */
  async refreshTokenIfNeeded(provider: string): Promise<OAuthToken | null> {
    const token = await this.getToken(provider);
    
    if (!token) return null;
    
    if (this.isTokenValid(token)) {
      return token;
    }

    // Token is expired, try to refresh
    if (token.refreshToken) {
      try {
        const response = await fetch(`${this.backendUrl}/api/v1/auth/refresh`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            provider,
            refreshToken: token.refreshToken
          }),
        });

        if (response.ok) {
          const newToken = await response.json();
          await this.storeToken(provider, newToken);
          return newToken as OAuthToken;
        }
      } catch (error) {
        console.error('Failed to refresh token:', error);
      }
    }

    return null;
  }

  /**
   * Get all valid tokens for n8n deployment
   */
  async getValidTokensForDeployment(): Promise<{ [provider: string]: string }> {
    const tokens = await this.getStoredTokens();
    const validTokens: { [provider: string]: string } = {};

    for (const [provider, token] of Object.entries(tokens)) {
      // Normalize expiry and try refresh if needed
      if (this.isTokenValid(token as OAuthToken)) {
        validTokens[provider] = (token as OAuthToken).accessToken;
      } else {
        const refreshed = await this.refreshTokenIfNeeded(provider);
        if (refreshed && refreshed.accessToken) {
          validTokens[provider] = refreshed.accessToken;
        }
      }
    }

    return validTokens;
  }

  /**
   * Clear all stored tokens
   */
  async clearTokens(): Promise<void> {
    try {
      // Clear from backend
      await fetch(`${this.backendUrl}/api/v1/auth/tokens`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.warn('Failed to clear tokens from backend:', error);
    }

    // Clear from localStorage
    localStorage.removeItem(this.storageKey);
  }

  /**
   * Get available providers with valid tokens
   */
  async getAvailableProviders(): Promise<string[]> {
    const tokens = await this.getStoredTokens();
    return Object.keys(tokens).filter(provider => 
      this.isTokenValid(tokens[provider])
    );
  }
}

// Create a singleton instance
export const oauthTokenService = new OAuthTokenService(); 
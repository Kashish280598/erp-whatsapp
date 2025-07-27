import { SignJWT } from 'jose';

export interface MetabaseConfig {
  siteUrl: string;
  secretKey: string;
  dashboardId: number;
  expirationMinutes?: number;
}

export interface MetabaseEmbedOptions {
  bordered?: boolean;
  titled?: boolean;
  theme?: 'light' | 'dark';
  height?: number;
  width?: number;
}

export class MetabaseService {
  private config: MetabaseConfig;

  constructor(config: MetabaseConfig) {
    this.config = config;
  }

  /**
   * Generate a JWT token for Metabase dashboard embedding
   * Using jose library for browser compatibility
   */
  private async generateToken(): Promise<string> {
    try {
      const payload = {
        resource: { dashboard: this.config.dashboardId },
        params: {},
        exp: Math.round(Date.now() / 1000) + (this.config.expirationMinutes || 10) * 60
      };

      // Convert secret key to Uint8Array for jose
      const secretKey = new TextEncoder().encode(this.config.secretKey);
      
      const jwt = await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime(Math.round(Date.now() / 1000) + (this.config.expirationMinutes || 10) * 60)
        .sign(secretKey);

      return jwt;
    } catch (error) {
      console.error('Error generating JWT token:', error);
      throw new Error('Failed to generate JWT token');
    }
  }

  /**
   * Create the full embed URL for a Metabase dashboard
   * Matches the exact format provided by the user
   */
  public async createEmbedUrl(options: MetabaseEmbedOptions = {}): Promise<string> {
    try {
      const token = await this.generateToken();
      const baseUrl = `${this.config.siteUrl}/embed/dashboard/${token}`;
      
      // Use the exact parameters provided by the user
      const params = new URLSearchParams();
      params.append('bordered', 'true');
      params.append('titled', 'true');
      
      // Add theme if specified
      if (options.theme) {
        params.append('theme', options.theme);
      }
      
      const queryString = params.toString();
      return queryString ? `${baseUrl}#${queryString}` : baseUrl;
    } catch (error) {
      console.error('Error creating embed URL:', error);
      throw error;
    }
  }

  /**
   * Get default embed options
   */
  public getDefaultOptions(): MetabaseEmbedOptions {
    return {
      bordered: true,
      titled: true,
      theme: 'light',
      height: 600,
      width: 800
    };
  }
}

// Default Metabase configuration - using the exact values provided
export const defaultMetabaseConfig: MetabaseConfig = {
  siteUrl: "https://soft-limpet.metabaseapp.com",
  secretKey: "874a79289c7d0f82b65c84da0284a44b9a52038d4b77fcac53ec9ed9ac6feb6e",
  dashboardId: 34, // Using the exact dashboard ID provided
  expirationMinutes: 10
};

// Create default service instance
export const metabaseService = new MetabaseService(defaultMetabaseConfig); 
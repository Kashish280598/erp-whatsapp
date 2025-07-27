import { SignJWT } from 'jose';

interface MetabaseConfig {
  siteUrl: string;
  secretKey: string;
  dashboardId: number;
}

class MetabaseService {
  private config: MetabaseConfig;

  constructor() {
    this.config = {
      siteUrl: import.meta.env.VITE_METABASE_SITE_URL || '',
      secretKey: import.meta.env.VITE_METABASE_SECRET_KEY || '',
      dashboardId: Number(import.meta.env.VITE_METABASE_DASHBOARD_ID) || 0,
    };
  }

  /**
   * Generate JWT token for Metabase embedding
   */
  private async generateToken(): Promise<string> {
    try {
      const payload = {
        resource: { dashboard: this.config.dashboardId },
        params: {},
        exp: Math.round(Date.now() / 1000) + (10 * 60) // 10 minute expiration
      };

      const token = await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('10m')
        .sign(new TextEncoder().encode(this.config.secretKey));

      return token;
    } catch (error) {
      console.error('Error generating Metabase JWT token:', error);
      throw new Error('Failed to generate Metabase token');
    }
  }

  /**
   * Create embed URL for Metabase dashboard
   */
  public async createEmbedUrl(): Promise<string> {
    if (!this.config.siteUrl || !this.config.secretKey || !this.config.dashboardId) {
      throw new Error('Metabase configuration incomplete. Please check your environment variables.');
    }

    try {
      const token = await this.generateToken();
      return `${this.config.siteUrl}/embed/dashboard/${token}#bordered=true&titled=true`;
    } catch (error) {
      console.error('Error creating Metabase embed URL:', error);
      throw error;
    }
  }

  /**
   * Get current configuration
   */
  public getConfig(): MetabaseConfig {
    return { ...this.config };
  }
}

export default new MetabaseService(); 
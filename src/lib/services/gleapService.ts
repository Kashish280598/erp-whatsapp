import Gleap from 'gleap';

// Gleap configuration - use environment variable
const GLEAP_KEY = import.meta.env.VITE_GLEAP_KEY;

class GleapService {
  private static instance: GleapService;
  private isInitialized = false;

  private constructor() {}

  public static getInstance(): GleapService {
    if (!GleapService.instance) {
      GleapService.instance = new GleapService();
    }
    return GleapService.instance;
  }

  /**
   * Initialize Gleap with the provided key
   * This method should be called only once!
   */
  public initialize(): void {
    if (this.isInitialized) {
      console.warn('Gleap is already initialized');
      return;
    }

    if (!GLEAP_KEY) {
      console.error('Gleap key not found. Please set VITE_GLEAP_KEY environment variable.');
      return;
    }

    try {
      // Initialize Gleap with the key
      Gleap.initialize(GLEAP_KEY);
      
      this.isInitialized = true;
      console.log('Gleap initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Gleap:', error);
    }
  }

  /**
   * Check if Gleap is initialized
   */
  public isGleapInitialized(): boolean {
    return this.isInitialized;
  }

  /**
   * Get Gleap instance for advanced usage
   */
  public getGleapInstance(): typeof Gleap {
    return Gleap;
  }
}

export default GleapService; 
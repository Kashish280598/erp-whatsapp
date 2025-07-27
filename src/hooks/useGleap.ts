import { useEffect, useCallback } from 'react';
import GleapService from '@/lib/services/gleapService';
import { useAppSelector } from '@/lib/store';

export const useGleap = () => {
  const gleapService = GleapService.getInstance();
  const user = useAppSelector((state) => state.auth.user);

  // Initialize Gleap if not already initialized
  useEffect(() => {
    if (!gleapService.isGleapInitialized()) {
      gleapService.initialize();
    }
  }, [gleapService]);

  // Set user data when user changes
  useEffect(() => {
    if (user && gleapService.isGleapInitialized()) {
      // You can add user data to Gleap here if needed
      // For now, we'll just log that user is available
      console.log('User available for Gleap:', user);
    }
  }, [user, gleapService]);

  const showFeedback = useCallback(() => {
    if (gleapService.isGleapInitialized()) {
      // Access the Gleap instance and show feedback widget
      // You can call gleapInstance.showFeedbackWidget() here if the method exists
      console.log('Gleap feedback widget requested');
    }
  }, [gleapService]);

  const hideFeedback = useCallback(() => {
    if (gleapService.isGleapInitialized()) {
      // Access the Gleap instance and hide feedback widget
      // You can call gleapInstance.hideFeedbackWidget() here if the method exists
      console.log('Gleap feedback widget hide requested');
    }
  }, [gleapService]);

  return {
    isInitialized: gleapService.isGleapInitialized(),
    showFeedback,
    hideFeedback,
    gleapInstance: gleapService.getGleapInstance(),
  };
}; 
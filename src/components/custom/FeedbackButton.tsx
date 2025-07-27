import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import { useGleap } from '@/hooks/useGleap';

interface FeedbackButtonProps {
  className?: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  children?: React.ReactNode;
}

export const FeedbackButton: React.FC<FeedbackButtonProps> = ({
  className = '',
  variant = 'outline',
  size = 'sm',
  children = 'Feedback'
}) => {
  const { isInitialized, showFeedback } = useGleap();

  const handleFeedbackClick = () => {
    if (isInitialized) {
      showFeedback();
    } else {
      console.warn('Gleap not initialized');
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleFeedbackClick}
      className={className}
      disabled={!isInitialized}
    >
      <MessageCircle className="h-4 w-4 mr-2" />
      {children}
    </Button>
  );
};

export default FeedbackButton; 
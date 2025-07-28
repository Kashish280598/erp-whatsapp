import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { IconCheck, IconArrowLeft } from '@tabler/icons-react';
import WhatsAppChat from './WhatsAppChat';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { useWhatsAppSocket } from '@/hooks/useWhatsAppSocket';
import Loader from '@/components/Loader';

const ChatIntegration = () => {
  const [showWhatsAppChat, setShowWhatsAppChat] = useState(false);
  const [showWhatsAppQRModal, setShowWhatsAppQRModal] = useState(false);

  const { 
    qrCodeData, 
    isLoading: isQrLoading, 
    lastError: qrError, 
    fetchQrCode,
    isSocketConnected,
    isSocketAuthenticated 
  } = useWhatsAppSocket();
  const isQrError = !!qrError;

  // Debug logging
  useEffect(() => {
    console.log('Socket state:', { 
      isSocketConnected, 
      isSocketAuthenticated, 
      qrCodeData: qrCodeData ? 'Present' : 'Null',
      qrError: qrError || 'None'
    });
  }, [isSocketConnected, isSocketAuthenticated, qrCodeData, qrError]);

  // Auto-open chat if already connected
  useEffect(() => {
    if (
      qrCodeData &&
      typeof qrCodeData === 'object' &&
      (qrCodeData as any).connected === true &&
      (qrCodeData as any).connectionState === 'open'
    ) {
      setShowWhatsAppChat(true);
      setShowWhatsAppQRModal(false);
    }
  }, [qrCodeData]);

  // Poll for QR code every 20 seconds if not connected
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (showWhatsAppQRModal && !showWhatsAppChat) {
      interval = setInterval(() => {
        fetchQrCode();
      }, 20000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [showWhatsAppChat, showWhatsAppQRModal, fetchQrCode]);

  const chatPlatforms = [
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      description: 'Connect your WhatsApp',
      icon: '💬',
      features: ['Message automation', 'Quick responses', 'File sharing']
    },
  ];

  const handleConnect = (platformId: string) => {
    if (platformId === 'whatsapp') {
      setShowWhatsAppQRModal(true);
      // Fetch QR code when modal opens
      setTimeout(() => fetchQrCode(true), 100);
    }
  };

  const handleBackToPlatforms = () => {
    setShowWhatsAppChat(false);
  };

  // If WhatsApp chat is active, show the chat interface
  if (showWhatsAppChat) {
    return (
      <div className="w-full h-full flex flex-col overflow-hidden">
        {/* Header with back button */}
        <div className="bg-white border-b border-gray-200 p-4 flex items-center gap-4 flex-shrink-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBackToPlatforms}
            className="hover:bg-gray-100"
          >
            <IconArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-lg font-semibold text-neutral">WhatsApp Integration</h1>
            <p className="text-sm text-neutral-400">Connected and active</p>
          </div>
        </div>
        
        {/* WhatsApp Chat Interface - Takes full remaining height */}
        <div className="flex-1 min-h-0 overflow-hidden">
          <WhatsAppChat />
        </div>
      </div>
    );
  }

  return (
    <>
      <Dialog open={showWhatsAppQRModal} onOpenChange={setShowWhatsAppQRModal}>
        <DialogContent className="max-w-lg w-full p-0 bg-background">
          <VisuallyHidden>
            <DialogTitle>WhatsApp QR Code Connection</DialogTitle>
            <DialogDescription>
              Scan the QR code with your WhatsApp mobile app to connect your account
            </DialogDescription>
          </VisuallyHidden>
          <Card className="border-none shadow-none bg-background">
            <CardContent className="flex flex-col md:flex-row items-center gap-6 p-6">
              <div className="flex-1 min-w-[220px]">
                <h2 className="text-2xl font-semibold mb-2 text-center md:text-left">Steps to log in</h2>
                <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                  <li>Open <span className="font-semibold text-green-600 dark:text-green-400">WhatsApp</span> on your phone</li>
                  <li>On Android tap <span className="font-semibold">Menu</span> <span className="inline-block align-middle">⋮</span> · On iPhone tap <span className="font-semibold">Settings</span> <span className="inline-block align-middle">⚙️</span></li>
                  <li>Tap <span className="font-semibold">Linked devices</span>, then <span className="font-semibold">Link device</span></li>
                  <li>Scan the QR code to confirm</li>
                </ol>
              </div>
              <div className="flex flex-col items-center gap-4">
                {/* WhatsApp QR code from Socket */}
                <div className="bg-white dark:bg-neutral-900 border rounded-lg p-2 flex items-center justify-center min-h-[180px] min-w-[180px] relative">
                  {isQrLoading && <Loader className="w-20 h-20" title="Loading QR..." />}
                  {isQrError && (
                    <div className="text-red-500 text-sm text-center">
                      Failed to load QR code. 
                      <Button variant="link" size="sm" onClick={() => fetchQrCode(true)}>
                        Retry
                      </Button>
                    </div>
                  )}
                  {qrCodeData && !isQrLoading && !isQrError && (
                    typeof qrCodeData === 'object' && (qrCodeData as any).connected === true && (qrCodeData as any).connectionState === 'open' ? (
                      <div className="text-green-600 text-center font-semibold text-lg">
                        You're already connected!
                      </div>
                    ) : (
                      <img src={qrCodeData as string} alt="WhatsApp QR" width={180} height={180} />
                    )
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </DialogContent>
      </Dialog>
      <div className="w-full h-full flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800 dark:text-primary-400">Chat</h1>
          <p className="text-sm text-neutral-400 mt-1">
            Connect and manage your chat platforms for seamless communication
          </p>
        </div>
      </div>

      <Tabs defaultValue="platforms" className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {chatPlatforms.map((platform) => (
              <Card key={platform.id} className="relative">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{platform.icon}</div>
                      <div>
                        <CardTitle className="text-lg">{platform.name}</CardTitle>
                        <CardDescription className="text-sm">
                          {platform.description}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge 
                      variant={'default'}
                      className="text-xs"
                    >
                      {'Available'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-neutral">Features:</h4>
                      <ul className="space-y-1">
                        {platform.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-2 text-xs text-neutral-400">
                            <IconCheck className="h-3 w-3 text-green-500" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <Separator />
                    <Button 
                      className="w-full" 
                      onClick={() => handleConnect(platform.id)}
                    >
                      Connect
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

      </Tabs>
    </div>
    </>
  );
};

export default ChatIntegration; 
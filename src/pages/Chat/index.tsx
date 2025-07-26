import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { IconCheck, IconArrowLeft } from '@tabler/icons-react';
import WhatsAppChat from './WhatsAppChat';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useGetWhatsAppQrImageQuery } from '@/lib/api/auth/auth-api';
import Loader from '@/components/Loader';

const ChatIntegration = () => {
  const [selectedPlatform, setSelectedPlatform] = useState('whatsapp');
  const [showWhatsAppChat, setShowWhatsAppChat] = useState(false);
  const [showWhatsAppQRModal, setShowWhatsAppQRModal] = useState(false);

  const { data, isLoading: isQrLoading, isError: isQrError, refetch } = useGetWhatsAppQrImageQuery(undefined, { skip: !showWhatsAppQRModal });
  console.log(selectedPlatform);

  // Auto-open chat if already connected
  useEffect(() => {
    if (
      data &&
      typeof data.data === 'object' &&
      data.data.connected === true &&
      data.data.connectionState === 'open'
    ) {
      setShowWhatsAppChat(true);
      setShowWhatsAppQRModal(false);
    }
  }, [data]);

  // Poll for QR code every 20 seconds if not connected
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (
      !showWhatsAppChat &&
      showWhatsAppQRModal &&
      data && typeof data.data !== 'object'
    ) {
      interval = setInterval(() => {
        refetch();
      }, 20000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [showWhatsAppChat, data, refetch]);

  const chatPlatforms = [
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      description: 'Connect your WhatsApp',
      icon: '💬',
      features: ['QR Connect', 'Message POC', 'Quick responses']
    },
  ];

  const handleConnect = (platformId: string) => {
    if (platformId === 'whatsapp') {
      setShowWhatsAppQRModal(true);
      // Optionally refetch QR code every time modal opens
      setTimeout(() => refetch(), 0);
    }
    setSelectedPlatform(platformId);
  };


  const handleBackToPlatforms = () => {
    setShowWhatsAppChat(false);
  };

  // If WhatsApp chat is active, show the chat interface
  if (showWhatsAppChat) {
    return (
      <div className="w-full h-full flex flex-col">
        {/* Header with back button */}
        <div className="bg-white border-b border-gray-200 p-4 flex items-center gap-4">
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
        
        {/* WhatsApp Chat Interface */}
        <div className="flex-1">
          <WhatsAppChat />
        </div>
      </div>
    );
  }

  return (
    <>
      <Dialog open={showWhatsAppQRModal} onOpenChange={setShowWhatsAppQRModal}>
        <DialogContent className="max-w-lg w-full p-0 bg-background">
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
                {/* WhatsApp QR code from API */}
                <div className="bg-white dark:bg-neutral-900 border rounded-lg p-2 flex items-center justify-center min-h-[180px] min-w-[180px] relative">
                  {isQrLoading && <Loader className="w-20 h-20" title="Loading QR..." />}
                  {isQrError && (
                    <div className="text-red-500 text-sm">Failed to load QR code. <Button variant="link" size="sm" onClick={() => refetch()}>Retry</Button></div>
                  )}
                  {data && !isQrLoading && !isQrError && (
                    typeof data.data === 'object' && data.data.connected === true && data.data.connectionState === 'open' ? (
                      <div className="text-green-600 text-center font-semibold text-lg">
                        You're already connected!
                      </div>
                    ) : (
                      <img src={data.data} alt="WhatsApp QR" width={180} height={180} />
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
        {/* <div className="flex items-center gap-3">
          <Label htmlFor="chat-toggle" className="text-sm font-medium">Enable Chat</Label>
          <Switch
            id="chat-toggle"
            checked={isEnabled}
            onCheckedChange={setIsEnabled}
          />
        </div> */}
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
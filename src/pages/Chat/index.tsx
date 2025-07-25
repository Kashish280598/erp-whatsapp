import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { IconMessage, IconSettings, IconCheck, IconArrowLeft } from '@tabler/icons-react';
import WhatsAppChat from './WhatsAppChat';
import { Dialog, DialogContent } from '@/components/ui/dialog';

const ChatIntegration = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState('whatsapp');
  const [showWhatsAppChat, setShowWhatsAppChat] = useState(false);
  const [showWhatsAppQRModal, setShowWhatsAppQRModal] = useState(false);
  console.log(selectedPlatform);

  const chatPlatforms = [
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      description: 'Connect your WhatsApp',
      icon: '💬',
      features: ['Message automation', 'Quick responses', 'File sharing']
    },
  ];

  const connectedIntegrations = [
    {
      id: 'whatsapp-1',
      name: 'WhatsApp Business',
      status: 'connected',
      lastActivity: '2 minutes ago',
      messages: 1247,
      avatar: '📱'
    },
  ];

  const handleConnect = (platformId: string) => {
    if (platformId === 'whatsapp') {
      setShowWhatsAppQRModal(true);
    }
    setSelectedPlatform(platformId);
  };

  const handleWhatsAppConnectSuccess = () => {
    setShowWhatsAppQRModal(false);
    setShowWhatsAppChat(true);
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
                {/* Mock QR code */}
                <div className="bg-white dark:bg-neutral-900 border rounded-lg p-2 flex items-center justify-center">
                  <img src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=mock-whatsapp-login" alt="WhatsApp QR" className="w-44 h-44 object-contain" />
                  <div className="absolute flex items-center justify-center w-12 h-12 rounded-full bg-white dark:bg-neutral-900 border -ml-6">
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="16" fill="#25D366"/><path d="M23.49 19.37c-.36-.18-2.13-1.05-2.46-1.17-.33-.12-.57-.18-.81.18-.24.36-.93 1.17-1.14 1.41-.21.24-.42.27-.78.09-.36-.18-1.52-.56-2.89-1.78-1.07-.95-1.79-2.13-2-2.49-.21-.36-.02-.55.16-.73.17-.17.36-.45.54-.68.18-.24.24-.42.36-.69.12-.27.06-.51-.03-.69-.09-.18-.81-1.95-1.11-2.67-.29-.7-.59-.6-.81-.61-.21-.01-.45-.01-.69-.01-.24 0-.63.09-.96.45-.33.36-1.26 1.23-1.26 3 .01 1.77 1.29 3.48 1.47 3.72.18.24 2.53 3.87 6.13 5.27.86.3 1.53.48 2.05.61.86.22 1.65.19 2.27.12.69-.08 2.13-.87 2.43-1.71.3-.84.3-1.56.21-1.71-.09-.15-.33-.24-.69-.42z" fill="#fff"/></svg>
                  </div>
                </div>
                <Button className="w-full mt-2" onClick={handleWhatsAppConnectSuccess}>
                  Mock: WhatsApp Connected
                </Button>
              </div>
            </CardContent>
          </Card>
        </DialogContent>
      </Dialog>
      <div className="w-full h-full flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-neutral">Chat</h1>
          <p className="text-sm text-neutral-400 mt-1">
            Connect and manage your chat platforms for seamless communication
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Label htmlFor="chat-toggle" className="text-sm font-medium">Enable Chat</Label>
          <Switch
            id="chat-toggle"
            checked={isEnabled}
            onCheckedChange={setIsEnabled}
          />
        </div>
      </div>

      <Tabs defaultValue="platforms" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="platforms">Available Platforms</TabsTrigger>
          <TabsTrigger value="connected">Connected</TabsTrigger>
        </TabsList>

        <TabsContent value="platforms" className="mt-6">
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
        </TabsContent>

        <TabsContent value="connected" className="mt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-neutral">Connected Integrations</h3>
              <Button variant="outline" size="sm">
                <IconSettings className="h-4 w-4 mr-2" />
                Manage
              </Button>
            </div>
            
            <div className="grid gap-4">
              {connectedIntegrations.map((integration) => (
                <Card key={integration.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="text-lg">
                            {integration.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium text-neutral">{integration.name}</h4>
                          <div className="flex items-center gap-4 text-sm text-neutral-400">
                            <span className="flex items-center gap-1">
                              <IconMessage className="h-3 w-3" />
                              {integration.messages} messages
                            </span>
                            <span>Last activity: {integration.lastActivity}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          {integration.status}
                        </Badge>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            if (integration.id === 'whatsapp-1') {
                              setShowWhatsAppChat(true);
                            }
                          }}
                        >
                          Open Chat
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

      </Tabs>
    </div>
    </>
  );
};

export default ChatIntegration; 
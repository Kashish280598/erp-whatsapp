import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { IconMessage, IconSettings, IconUsers, IconBolt, IconCheck, IconArrowLeft } from '@tabler/icons-react';
import WhatsAppChat from './WhatsAppChat';

const ChatIntegration = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState('whatsapp');
  const [showWhatsAppChat, setShowWhatsAppChat] = useState(false);
  console.log(selectedPlatform);

  const chatPlatforms = [
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      description: 'Connect your WhatsApp Business API',
      icon: '💬',
      status: 'available',
      features: ['Message automation', 'Quick responses', 'File sharing']
    },
    {
      id: 'slack',
      name: 'Slack',
      description: 'Integrate with Slack workspace',
      icon: '💼',
      status: 'available',
      features: ['Channel integration', 'Team collaboration', 'Real-time notifications']
    },
    {
      id: 'telegram',
      name: 'Telegram',
      description: 'Connect Telegram Bot API',
      icon: '📱',
      status: 'coming-soon',
      features: ['Bot automation', 'Group management', 'Media support']
    },
    {
      id: 'discord',
      name: 'Discord',
      description: 'Integrate with Discord server',
      icon: '🎮',
      status: 'coming-soon',
      features: ['Server integration', 'Role management', 'Voice channels']
    }
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
    {
      id: 'slack-1',
      name: 'Security Alerts Channel',
      status: 'connected',
      lastActivity: '1 hour ago',
      messages: 892,
      avatar: '💼'
    }
  ];

  const handleConnect = (platformId: string) => {
    if (platformId === 'whatsapp') {
      setShowWhatsAppChat(true);
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
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="platforms">Available Platforms</TabsTrigger>
          <TabsTrigger value="connected">Connected</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
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
                      variant={platform.status === 'available' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {platform.status === 'available' ? 'Available' : 'Coming Soon'}
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
                      disabled={platform.status !== 'available'}
                      onClick={() => handleConnect(platform.id)}
                    >
                      {platform.status === 'available' ? 'Connect' : 'Coming Soon'}
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

        <TabsContent value="settings" className="mt-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IconBolt className="h-5 w-5" />
                  Bot Configuration
                </CardTitle>
                <CardDescription>
                  Configure your chat bot settings and responses
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bot-name">Bot Name</Label>
                    <Input id="bot-name" placeholder="Security Assistant" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="response-time">Response Time (seconds)</Label>
                    <Input id="response-time" type="number" placeholder="5" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="welcome-message">Welcome Message</Label>
                  <Input 
                    id="welcome-message" 
                    placeholder="Hello! I'm your security assistant. How can I help you today?"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IconUsers className="h-5 w-5" />
                  User Management
                </CardTitle>
                <CardDescription>
                  Manage user permissions and access for chat integrations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Allow public access</h4>
                    <p className="text-sm text-neutral-400">Anyone can interact with the bot</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Require authentication</h4>
                    <p className="text-sm text-neutral-400">Users must be authenticated</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Admin-only commands</h4>
                    <p className="text-sm text-neutral-400">Restrict certain commands to admins</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ChatIntegration; 
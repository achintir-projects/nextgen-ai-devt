/**
 * Collaboration Manager
 * Real-time collaboration system using yjs for multi-user editing and communication
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Users, 
  UserPlus, 
  MessageSquare, 
  Share, 
  Settings, 
  Wifi, 
  WifiOff,
  Clock,
  Edit,
  Eye,
  MousePointer,
  Zap,
  AlertCircle,
  CheckCircle,
  Copy,
  Mail,
  Link,
  Phone,
  Video
} from 'lucide-react';

interface Collaborator {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  color: string;
  cursor: { x: number; y: number; line: number; column: number };
  isActive: boolean;
  lastSeen: Date;
  permissions: 'read' | 'write' | 'admin';
}

interface CollaborationMessage {
  id: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: Date;
  type: 'chat' | 'system' | 'action';
}

interface CollaborationSession {
  id: string;
  name: string;
  isHost: boolean;
  collaborators: Collaborator[];
  messages: CollaborationMessage[];
  isActive: boolean;
  shareLink: string;
  settings: {
    requireApproval: boolean;
    maxParticipants: number;
    allowAnonymous: boolean;
    recordSession: boolean;
  };
}

interface CollaborationManagerProps {
  projectId: string;
  onCollaboratorJoin?: (collaborator: Collaborator) => void;
  onCollaboratorLeave?: (collaboratorId: string) => void;
  onMessageReceive?: (message: CollaborationMessage) => void;
}

export default function CollaborationManager({
  projectId,
  onCollaboratorJoin,
  onCollaboratorLeave,
  onMessageReceive
}: CollaborationManagerProps) {
  const [session, setSession] = useState<CollaborationSession | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isHosting, setIsHosting] = useState(false);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [activeUsers, setActiveUsers] = useState<Collaborator[]>([]);
  const [connectionQuality, setConnectionQuality] = useState<'excellent' | 'good' | 'poor'>('excellent');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const ydocRef = useRef<any>(null);
  const providerRef = useRef<any>(null);

  useEffect(() => {
    initializeCollaboration();
    
    return () => {
      cleanupCollaboration();
    };
  }, [projectId]);

  useEffect(() => {
    scrollToBottom();
  }, [session?.messages]);

  const initializeCollaboration = async () => {
    try {
      // Simulate yjs initialization
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockSession: CollaborationSession = {
        id: `session_${Date.now()}`,
        name: 'E-commerce Platform Development',
        isHost: true,
        collaborators: [
          {
            id: 'user1',
            name: 'You',
            email: 'you@example.com',
            color: '#3b82f6',
            cursor: { x: 0, y: 0, line: 1, column: 1 },
            isActive: true,
            lastSeen: new Date(),
            permissions: 'admin'
          }
        ],
        messages: [
          {
            id: 'msg1',
            userId: 'system',
            userName: 'System',
            content: 'Collaboration session started',
            timestamp: new Date(),
            type: 'system'
          }
        ],
        isActive: true,
        shareLink: `https://paam.studio/collaborate/${projectId}`,
        settings: {
          requireApproval: true,
          maxParticipants: 10,
          allowAnonymous: false,
          recordSession: false
        }
      };

      setSession(mockSession);
      setActiveUsers([mockSession.collaborators[0]]);
      setIsConnected(true);
      setIsHosting(true);
    } catch (error) {
      console.error('Failed to initialize collaboration:', error);
    }
  };

  const cleanupCollaboration = () => {
    if (providerRef.current) {
      providerRef.current.destroy();
    }
    if (ydocRef.current) {
      ydocRef.current.destroy();
    }
  };

  const startCollaborationSession = () => {
    setIsHosting(true);
    // In a real implementation, this would start a WebSocket server
    // and initialize yjs with WebRTC provider
    initializeCollaboration();
  };

  const joinCollaborationSession = async (sessionId: string) => {
    try {
      // Simulate joining session
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockSession: CollaborationSession = {
        id: sessionId,
        name: 'E-commerce Platform Development',
        isHost: false,
        collaborators: [
          {
            id: 'host1',
            name: 'Alex Chen',
            email: 'alex@example.com',
            color: '#10b981',
            cursor: { x: 0, y: 0, line: 1, column: 1 },
            isActive: true,
            lastSeen: new Date(),
            permissions: 'admin'
          },
          {
            id: 'user1',
            name: 'You',
            email: 'you@example.com',
            color: '#3b82f6',
            cursor: { x: 0, y: 0, line: 1, column: 1 },
            isActive: true,
            lastSeen: new Date(),
            permissions: 'write'
          }
        ],
        messages: [
          {
            id: 'msg1',
            userId: 'system',
            userName: 'System',
            content: 'Collaboration session started',
            timestamp: new Date(Date.now() - 300000),
            type: 'system'
          },
          {
            id: 'msg2',
            userId: 'host1',
            userName: 'Alex Chen',
            content: 'Welcome to the collaboration session! Feel free to join in.',
            timestamp: new Date(Date.now() - 240000),
            type: 'chat'
          }
        ],
        isActive: true,
        shareLink: `https://paam.studio/collaborate/${projectId}`,
        settings: {
          requireApproval: true,
          maxParticipants: 10,
          allowAnonymous: false,
          recordSession: false
        }
      };

      setSession(mockSession);
      setActiveUsers(mockSession.collaborators);
      setIsConnected(true);
      setIsHosting(false);
    } catch (error) {
      console.error('Failed to join collaboration session:', error);
    }
  };

  const inviteCollaborator = async () => {
    if (!inviteEmail.trim() || !session) return;

    try {
      // Simulate sending invitation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newCollaborator: Collaborator = {
        id: `user_${Date.now()}`,
        name: inviteEmail.split('@')[0],
        email: inviteEmail,
        color: getRandomColor(),
        cursor: { x: 0, y: 0, line: 1, column: 1 },
        isActive: false,
        lastSeen: new Date(),
        permissions: 'write'
      };

      const systemMessage: CollaborationMessage = {
        id: `msg_${Date.now()}`,
        userId: 'system',
        userName: 'System',
        content: `Invitation sent to ${inviteEmail}`,
        timestamp: new Date(),
        type: 'system'
      };

      setSession(prev => prev ? {
        ...prev,
        messages: [...prev.messages, systemMessage]
      } : null);

      setInviteEmail('');
      setShowInviteDialog(false);
      
      onCollaboratorJoin?.(newCollaborator);
    } catch (error) {
      console.error('Failed to invite collaborator:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !session) return;

    const message: CollaborationMessage = {
      id: `msg_${Date.now()}`,
      userId: 'user1',
      userName: 'You',
      content: newMessage,
      timestamp: new Date(),
      type: 'chat'
    };

    setSession(prev => prev ? {
      ...prev,
      messages: [...prev.messages, message]
    } : null);

    setNewMessage('');
    onMessageReceive?.(message);

    // Simulate response from other collaborator
    if (Math.random() > 0.7) {
      setTimeout(() => {
        const responses = [
          "Great idea! I think that will work well.",
          "I agree, let's implement that approach.",
          "Good point! We should consider the edge cases.",
          "That looks good to me. Should we move forward?",
          "Interesting approach. Have you considered the performance implications?"
        ];
        
        const responseMessage: CollaborationMessage = {
          id: `msg_${Date.now() + 1}`,
          userId: 'host1',
          userName: 'Alex Chen',
          content: responses[Math.floor(Math.random() * responses.length)],
          timestamp: new Date(),
          type: 'chat'
        };

        setSession(prev => prev ? {
          ...prev,
          messages: [...prev.messages, responseMessage]
        } : null);
      }, 2000);
    }
  };

  const updateCollaboratorCursor = (collaboratorId: string, cursor: { x: number; y: number; line: number; column: number }) => {
    setActiveUsers(prev => 
      prev.map(user => 
        user.id === collaboratorId 
          ? { ...user, cursor, lastSeen: new Date() }
          : user
      )
    );
  };

  const simulateCollaboratorActivity = () => {
    // Simulate other collaborators' activity
    if (session && session.collaborators.length > 1) {
      const otherCollaborators = session.collaborators.filter(c => c.id !== 'user1');
      otherCollaborators.forEach(collaborator => {
        if (Math.random() > 0.8) {
          updateCollaboratorCursor(collaborator.id, {
            x: Math.floor(Math.random() * 800),
            y: Math.floor(Math.random() * 600),
            line: Math.floor(Math.random() * 100) + 1,
            column: Math.floor(Math.random() * 80) + 1
          });
        }
      });
    }
  };

  const copyShareLink = () => {
    if (session?.shareLink) {
      navigator.clipboard.writeText(session.shareLink);
    }
  };

  const endCollaborationSession = () => {
    setSession(null);
    setActiveUsers([]);
    setIsConnected(false);
    setIsHosting(false);
    cleanupCollaboration();
  };

  const getRandomColor = () => {
    const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getConnectionQualityColor = () => {
    switch (connectionQuality) {
      case 'excellent': return 'text-green-500';
      case 'good': return 'text-yellow-500';
      case 'poor': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor(diff / 1000);

    if (seconds < 60) return `${seconds}s ago`;
    if (minutes < 60) return `${minutes}m ago`;
    return date.toLocaleTimeString();
  };

  // Simulate collaboration activity
  useEffect(() => {
    if (isConnected) {
      const interval = setInterval(simulateCollaboratorActivity, 5000);
      return () => clearInterval(interval);
    }
  }, [isConnected]);

  if (!session) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Card className="w-96">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center space-x-2">
              <Users className="w-5 h-5" />
              <span>Start Collaboration</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center text-sm text-gray-600 dark:text-gray-400">
              Start a new collaboration session or join an existing one to work together with your team in real-time.
            </div>
            
            <div className="space-y-2">
              <Button 
                onClick={startCollaborationSession}
                className="w-full"
                size="lg"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Start New Session
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  const sessionId = `session_${Date.now()}`;
                  joinCollaborationSession(sessionId);
                }}
              >
                <Link className="w-4 h-4 mr-2" />
                Join with Code
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-blue-600" />
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">
                Collaboration
              </h3>
              <p className="text-xs text-gray-500">
                {session.name} • {activeUsers.length} active
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-xs flex items-center space-x-1">
              {isConnected ? (
                <Wifi className="w-3 h-3 text-green-500" />
              ) : (
                <WifiOff className="w-3 h-3 text-red-500" />
              )}
              <span className={getConnectionQualityColor()}>
                {connectionQuality}
              </span>
            </Badge>
            <Badge variant="outline" className="text-xs">
              {session.isHost ? 'Host' : 'Participant'}
            </Badge>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowInviteDialog(true)}
          >
            <UserPlus className="w-4 h-4 mr-1" />
            Invite
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={copyShareLink}
          >
            <Copy className="w-4 h-4 mr-1" />
            Share
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={endCollaborationSession}
          >
            <WifiOff className="w-4 h-4 mr-1" />
            End
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Active Users Panel */}
        <div className="w-64 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4">
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                Active Users ({activeUsers.length})
              </h4>
              <div className="space-y-2">
                {activeUsers.map((user) => (
                  <div key={user.id} className="flex items-center space-x-2">
                    <Avatar className="w-6 h-6">
                      <AvatarFallback style={{ backgroundColor: user.color }}>
                        {user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {user.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {user.permissions} • {formatTimeAgo(user.lastSeen)}
                      </div>
                    </div>
                    {user.isActive && (
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                Quick Actions
              </h4>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Video className="w-4 h-4 mr-2" />
                  Start Video Call
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Phone className="w-4 h-4 mr-2" />
                  Voice Chat
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Share className="w-4 h-4 mr-2" />
                  Screen Share
                </Button>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                Session Settings
              </h4>
              <div className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
                <div className="flex items-center justify-between">
                  <span>Max Participants</span>
                  <span>{session.settings.maxParticipants}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Require Approval</span>
                  <span>{session.settings.requireApproval ? 'Yes' : 'No'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Recording</span>
                  <span>{session.settings.recordSession ? 'On' : 'Off'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="p-4 space-y-4">
                {session.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.userId === 'user1' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg p-3 ${
                        message.userId === 'user1'
                          ? 'bg-blue-500 text-white'
                          : message.type === 'system'
                          ? 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                      }`}
                    >
                      {message.type !== 'system' && (
                        <div className="text-xs font-medium mb-1 opacity-80">
                          {message.userName}
                        </div>
                      )}
                      <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                      <div className="text-xs opacity-60 mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
          </div>

          {/* Message Input */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center space-x-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && newMessage.trim()) {
                    sendMessage();
                  }
                }}
                className="flex-1"
              />
              <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                <MessageSquare className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Invite Dialog */}
      {showInviteDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-96">
            <CardHeader>
              <CardTitle>Invite Collaborator</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Email Address</label>
                <Input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="colleague@example.com"
                  className="mt-1"
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowInviteDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={inviteCollaborator} disabled={!inviteEmail.trim()}>
                  <Mail className="w-4 h-4 mr-2" />
                  Send Invite
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
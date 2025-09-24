/**
 * Terminal Component
 * Integrated terminal with xterm.js for command execution and system interaction
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Terminal as TerminalIcon, 
  Play, 
  Square, 
  RefreshCw, 
  Settings, 
  Maximize2,
  Minimize2,
  Copy,
  Clear,
  Upload,
  Download,
  Command,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  Clock,
  X
} from 'lucide-react';

// Dynamically import xterm to avoid SSR issues
const Terminal = dynamic(() => import('@xterm/xterm').then(mod => mod.Terminal), {
  ssr: false,
  loading: () => (
    <div className="h-full bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <RefreshCw className="w-8 h-8 mx-auto mb-2 animate-spin text-gray-400" />
        <p className="text-gray-500">Loading terminal...</p>
      </div>
    </div>
  )
});

const FitAddon = dynamic(() => import('@xterm/addon-fit').then(mod => mod.FitAddon), { ssr: false });
const WebLinksAddon = dynamic(() => import('@xterm/addon-web-links').then(mod => mod.WebLinksAddon), { ssr: false });

interface TerminalCommand {
  id: string;
  command: string;
  output: string;
  timestamp: Date;
  status: 'success' | 'error' | 'running';
  duration?: number;
}

interface TerminalSession {
  id: string;
  name: string;
  type: 'local' | 'remote' | 'docker' | 'ssh';
  status: 'connected' | 'disconnected' | 'connecting';
  cwd: string;
  env: Record<string, string>;
}

interface TerminalProps {
  projectId: string;
  onCommandExecute?: (command: string) => void;
  onTerminalOutput?: (output: string) => void;
}

export default function TerminalComponent({
  projectId,
  onCommandExecute,
  onTerminalOutput
}: TerminalProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [currentCommand, setCurrentCommand] = useState('');
  const [commands, setCommands] = useState<TerminalCommand[]>([]);
  const [sessions, setSessions] = useState<TerminalSession[]>([]);
  const [activeSession, setActiveSession] = useState<TerminalSession | null>(null);
  const [terminalSize, setTerminalSize] = useState<'normal' | 'maximized'>('normal');
  const [showCommandHistory, setShowCommandHistory] = useState(false);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<any>(null);
  const fitAddonRef = useRef<any>(null);

  useEffect(() => {
    initializeTerminal();
    initializeSessions();
    
    return () => {
      if (xtermRef.current) {
        xtermRef.current.dispose();
      }
    };
  }, []);

  useEffect(() => {
    if (xtermRef.current && fitAddonRef.current) {
      setTimeout(() => {
        fitAddonRef.current.fit();
      }, 100);
    }
  }, [terminalSize]);

  const initializeTerminal = async () => {
    if (typeof window === 'undefined') return;

    const { Terminal } = await import('@xterm/xterm');
    const { FitAddon } = await import('@xterm/addon-fit');
    const { WebLinksAddon } = await import('@xterm/addon-web-links');

    const term = new Terminal({
      cursorBlink: true,
      fontSize: 14,
      fontFamily: '"Fira Code", "Consolas", "Monaco", monospace',
      theme: {
        background: '#1e1e1e',
        foreground: '#ffffff',
        cursor: '#ffffff',
        selectionBackground: '#264f78',
        black: '#000000',
        red: '#cd3131',
        green: '#0dbc79',
        yellow: '#e5e510',
        blue: '#2472c8',
        magenta: '#bc3fbc',
        cyan: '#11a8cd',
        white: '#e5e5e5',
        brightBlack: '#666666',
        brightRed: '#f14c4c',
        brightGreen: '#23d18b',
        brightYellow: '#f5f543',
        brightBlue: '#3b8eea',
        brightMagenta: '#d670d6',
        brightCyan: '#29b8db',
        brightWhite: '#e5e5e5',
      },
      allowTransparency: false,
      scrollback: 1000,
      convertEol: true,
      disableStdin: false,
    });

    const fitAddon = new FitAddon();
    const webLinksAddon = new WebLinksAddon();

    term.loadAddon(fitAddon);
    term.loadAddon(webLinksAddon);

    if (terminalRef.current) {
      term.open(terminalRef.current);
      fitAddon.fit();
    }

    // Custom terminal handling
    term.onData((data) => {
      // Handle terminal input
      if (data === '\r') {
        // Enter key - execute command
        const command = currentCommand;
        if (command.trim()) {
          executeCommand(command);
          setCurrentCommand('');
          setCommandHistory(prev => [command, ...prev.slice(0, 50)]);
          setHistoryIndex(-1);
        }
      } else if (data === '\x7f') {
        // Backspace
        setCurrentCommand(prev => prev.slice(0, -1));
      } else if (data === '\x1b[A') {
        // Up arrow - command history
        if (historyIndex < commandHistory.length - 1) {
          const newIndex = historyIndex + 1;
          setHistoryIndex(newIndex);
          setCurrentCommand(commandHistory[newIndex]);
        }
      } else if (data === '\x1b[B') {
        // Down arrow - command history
        if (historyIndex > 0) {
          const newIndex = historyIndex - 1;
          setHistoryIndex(newIndex);
          setCurrentCommand(commandHistory[newIndex]);
        } else if (historyIndex === 0) {
          setHistoryIndex(-1);
          setCurrentCommand('');
        }
      } else if (data.length === 1) {
        // Regular character
        setCurrentCommand(prev => prev + data);
      }
    });

    // Write welcome message
    term.writeln('\x1b[1;32mPAAM AI Studio Terminal\x1b[0m');
    term.writeln('\x1b[1;36mWelcome to the integrated development environment\x1b[0m');
    term.writeln('');
    term.writeln('Type \x1b[1;33mhelp\x1b[0m for available commands');
    term.writeln('');

    xtermRef.current = term;
    fitAddonRef.current = fitAddon;
  };

  const initializeSessions = () => {
    const mockSessions: TerminalSession[] = [
      {
        id: 'local',
        name: 'Local Shell',
        type: 'local',
        status: 'connected',
        cwd: '/workspace/project',
        env: { PATH: '/usr/local/bin:/usr/bin:/bin', HOME: '/home/user' }
      },
      {
        id: 'docker',
        name: 'Docker Container',
        type: 'docker',
        status: 'disconnected',
        cwd: '/app',
        env: { NODE_ENV: 'development', PORT: '3000' }
      },
      {
        id: 'remote',
        name: 'Remote Server',
        type: 'ssh',
        status: 'disconnected',
        cwd: '/home/user/project',
        env: { USER: 'remoteuser' }
      }
    ];

    setSessions(mockSessions);
    setActiveSession(mockSessions[0]);
  };

  const executeCommand = async (command: string) => {
    if (!xtermRef.current) return;

    const term = xtermRef.current;
    
    // Write command to terminal
    term.writeln(`$ ${command}`);
    
    // Add to commands history
    const newCommand: TerminalCommand = {
      id: `cmd_${Date.now()}`,
      command,
      output: '',
      timestamp: new Date(),
      status: 'running'
    };

    setCommands(prev => [newCommand, ...prev]);
    setIsRunning(true);

    // Simulate command execution
    await new Promise(resolve => setTimeout(resolve, 500));

    let output = '';
    let status: 'success' | 'error' = 'success';

    // Handle common commands
    switch (command.trim()) {
      case 'help':
        output = `Available commands:
  \x1b[1;32mhelp\x1b[0m         - Show this help message
  \x1b[1;32mls\x1b[0m           - List files and directories
  \x1b[1;32mpwd\x1b[0m          - Print working directory
  \x1b[1;32mcd <dir>\x1b[0m     - Change directory
  \x1b[1;32mcat <file>\x1b[0m   - Display file contents
  \x1b[1;32mnpm run dev\x1b[0m  - Start development server
  \x1b[1;32mnpm build\x1b[0m    - Build the project
  \x1b[1;32mnpm test\x1b[0m     - Run tests
  \x1b[1;32mclear\x1b[0m        - Clear terminal
  \x1b[1;32mexit\x1b[0m         - Exit terminal`;
        break;
      
      case 'ls':
        output = `drwxr-xr-x  4 user user 4096 Jan 15 10:30 \x1b[1;34msrc\x1b[0m
drwxr-xr-x  2 user user 4096 Jan 15 10:30 \x1b[1;34mpublic\x1b[0m
-rw-r--r--  1 user user  345 Jan 15 10:30 package.json
-rw-r--r--  1 user user  234 Jan 15 10:30 README.md
-rw-r--r--  1 user user  123 Jan 15 10:30 \x1b[1;32mapp.paam\x1b[0m
-rw-r--r--  1 user user  567 Jan 15 10:30 tsconfig.json`;
        break;
      
      case 'pwd':
        output = '/workspace/project';
        break;
      
      case 'clear':
        term.clear();
        setIsRunning(false);
        return;
      
      case 'npm run dev':
        output = `> project@1.0.0 dev
> next dev

⚠ Port 3000 is in use, trying 3001...
ready - started server on 0.0.0.0:3001, url: http://localhost:3001`;
        break;
      
      case 'npm build':
        output = `> project@1.0.0 build
> next build

info  - Creating an optimized production build...
info  - Compiled successfully
info  - Collecting page data...
info  - Generating static pages (3/3)
info  - Finalizing page optimization...

Route (pages)                              Size     First Load JS
┌ ○ /                                      1.17 kB         87.3 kB
├ ○ /_app                                  0 B             84.8 kB
└ ○ /404                                   194 kB         262 kB
+ First Load JS shared by all              84.8 kB
  ├ chunks/framework-9e5f7749d9c5b9f4.js   45.1 kB
  ├ chunks/main-app-9e5f7749d9c5b9f4.js    21.8 kB
  └ chunks/webpack-_9e5f7749d9c5b9f4.js    17.9 kB

Route (app)                               Size     First Load JS
┌ ○ /                                      1.17 kB         87.3 kB
├ ○ /layout                                0 B             84.8 kB
└ ○ /page                                  1.17 kB         87.3 kB`;
        break;
      
      case 'npm test':
        output = `> project@1.0.0 test
> jest

 PASS  src/__tests__/App.test.tsx
  ✓ renders without crashing (5 ms)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        0.5 s
Ran all test suites.`;
        break;
      
      default:
        if (command.startsWith('cd ')) {
          const dir = command.substring(3);
          output = `Changed directory to: ${dir}`;
          // Update current working directory
          if (activeSession) {
            setActiveSession({
              ...activeSession,
              cwd: dir
            });
          }
        } else if (command.startsWith('cat ')) {
          const file = command.substring(4);
          output = `// Contents of ${file}
console.log('Hello from PAAM!');
export default function App() {
  return <div>Hello World</div>;
}`;
        } else {
          output = `Command not found: ${command.split(' ')[0]}
Type 'help' for available commands`;
          status = 'error';
        }
    }

    // Write output to terminal
    term.writeln(output);
    term.writeln('');

    // Update command in history
    setCommands(prev => 
      prev.map(cmd => 
        cmd.id === newCommand.id 
          ? { 
              ...cmd, 
              output, 
              status, 
              duration: Date.now() - cmd.timestamp.getTime() 
            }
          : cmd
      )
    );

    setIsRunning(false);
    onCommandExecute?.(command);
    onTerminalOutput?.(output);
  };

  const handleClear = () => {
    if (xtermRef.current) {
      xtermRef.current.clear();
    }
  };

  const handleCopy = () => {
    if (xtermRef.current) {
      const selection = xtermRef.current.getSelection();
      if (selection) {
        navigator.clipboard.writeText(selection);
      }
    }
  };

  const handleSessionChange = (session: TerminalSession) => {
    setActiveSession(session);
    // Simulate session connection
    if (session.status === 'disconnected') {
      setSessions(prev => 
        prev.map(s => 
          s.id === session.id 
            ? { ...s, status: 'connecting' as const }
            : s
        )
      );
      
      setTimeout(() => {
        setSessions(prev => 
          prev.map(s => 
            s.id === session.id 
              ? { ...s, status: 'connected' as const }
              : s
          )
        );
      }, 1000);
    }
  };

  const toggleTerminalSize = () => {
    setTerminalSize(prev => prev === 'normal' ? 'maximized' : 'normal');
  };

  return (
    <div className={`h-full flex flex-col bg-gray-900 text-white ${terminalSize === 'maximized' ? 'fixed inset-0 z-50' : ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-700 bg-gray-800">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <TerminalIcon className="w-4 h-4 text-green-400" />
            <div>
              <h3 className="text-sm font-medium">Terminal</h3>
              <p className="text-xs text-gray-400">
                {activeSession?.name} • {activeSession?.cwd}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-xs bg-green-900 text-green-300 border-green-600">
              {activeSession?.status}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {commands.length} commands
            </Badge>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Session Selector */}
          <div className="flex items-center space-x-1 bg-gray-700 rounded-lg p-1">
            {sessions.map((session) => (
              <Button
                key={session.id}
                variant={activeSession?.id === session.id ? 'default' : 'ghost'}
                size="sm"
                onClick={() => handleSessionChange(session)}
                className="h-7 px-2 text-xs"
              >
                {session.type}
              </Button>
            ))}
          </div>

          <div className="w-px h-6 bg-gray-600"></div>

          {/* Terminal Actions */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="h-7 w-7 p-0"
            title="Copy selection"
          >
            <Copy className="w-3 h-3" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="h-7 w-7 p-0"
            title="Clear terminal"
          >
            <Clear className="w-3 h-3" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTerminalSize}
            className="h-7 w-7 p-0"
            title={terminalSize === 'normal' ? 'Maximize' : 'Minimize'}
          >
            {terminalSize === 'normal' ? <Maximize2 className="w-3 h-3" /> : <Minimize2 className="w-3 h-3" />}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0"
            title="Terminal settings"
          >
            <Settings className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* Terminal Content */}
      <div className="flex-1 flex">
        {/* Terminal Area */}
        <div className="flex-1 relative">
          <div 
            ref={terminalRef}
            className="h-full w-full"
            style={{ 
              backgroundColor: '#1e1e1e',
              fontFamily: '"Fira Code", "Consolas", "Monaco", monospace'
            }}
          />
          
          {/* Command Input Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-2 bg-gray-800 border-t border-gray-700">
            <div className="flex items-center space-x-2">
              <ChevronRight className="w-4 h-4 text-green-400" />
              <Input
                value={currentCommand}
                onChange={(e) => setCurrentCommand(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && currentCommand.trim()) {
                    executeCommand(currentCommand);
                    setCurrentCommand('');
                  }
                }}
                placeholder="Type a command..."
                className="flex-1 bg-gray-900 border-gray-600 text-white placeholder-gray-400 text-sm"
                disabled={isRunning}
              />
              {isRunning && (
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                  <span className="text-xs text-gray-400">Running...</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Command History Sidebar */}
        {showCommandHistory && (
          <div className="w-80 bg-gray-800 border-l border-gray-700 p-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">Command History</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCommandHistory(false)}
                  className="h-6 w-6 p-0"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
              
              <ScrollArea className="h-96">
                <div className="space-y-2">
                  {commands.map((cmd) => (
                    <div key={cmd.id} className="p-2 bg-gray-700 rounded">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-mono text-green-400">$ {cmd.command}</span>
                        {cmd.status === 'success' ? (
                          <CheckCircle className="w-3 h-3 text-green-400" />
                        ) : (
                          <AlertCircle className="w-3 h-3 text-red-400" />
                        )}
                      </div>
                      <div className="text-xs text-gray-400">
                        {cmd.duration ? `${cmd.duration}ms` : 'Running...'}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
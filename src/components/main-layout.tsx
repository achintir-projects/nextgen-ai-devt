'use client';

import React, { useState } from 'react';
import AIDevelopmentDashboard from '@/components/platform/ai-development-dashboard';
import NeobankDashboard from '@/components/neobank/neobank-dashboard';
import P2PLendingDashboard from '@/components/p2p-lending/p2p-lending-dashboard';
import AppHistoryDashboard from '@/components/app-history/app-history-dashboard';
import UnifiedDashboard from '@/components/shared/unified-dashboard';
import AppSwitcher from '@/components/app-switcher';
import PAAMCopilotAssistant from '@/components/copilot-assistant/paam-copilot-assistant';
import MultiPlatformCompilation from '@/components/multi-platform-compilation';
import IntentPreservationValidator from '@/components/intent-preservation-validator';
import ComplianceAsCode from '@/components/compliance-as-code';
import PerformanceMetricsDashboard from '@/components/performance-metrics-dashboard';
import JobTester from '@/components/job-tester';
import StudioLanding from '@/app/studio/page';
import { Zap } from 'lucide-react';

export default function MainLayout() {
  const [currentApp, setCurrentApp] = useState('professional-chat');

  const renderCurrentApp = () => {
    switch (currentApp) {
      case 'professional-chat':
        return <PAAMCopilotAssistant />;
      case 'studio':
        return <StudioLanding />;
      case 'job-tester':
        return <JobTester />;
      case 'ai-platform':
        return <AIDevelopmentDashboard />;
      case 'neobank':
        return <NeobankDashboard />;
      case 'p2p-lending':
        return <P2PLendingDashboard />;
      case 'unified-dashboard':
        return <UnifiedDashboard />;
      case 'app-history':
        return <AppHistoryDashboard />;
      case 'multi-platform':
        return <MultiPlatformCompilation paamSpecification={null} />;
      case 'intent-validator':
        return <IntentPreservationValidator paamSpecification={null} />;
      case 'compliance':
        return <ComplianceAsCode paamSpecification={null} />;
      case 'performance':
        return <PerformanceMetricsDashboard />;
      default:
        return <AIDevelopmentDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Top Navigation */}
      <nav className="bg-white dark:bg-slate-900 shadow-sm border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <AppSwitcher currentApp={currentApp} onAppChange={setCurrentApp} />
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-slate-600 dark:text-slate-400">
                {currentApp === 'professional-chat' && 'PAAM Copilot - Machine-Executable Specifications'}
                {currentApp === 'studio' && 'PAAM AI Studio - Project Management & Development'}
                {currentApp === 'job-tester' && 'Job API Tester'}
                {currentApp === 'ai-platform' && 'AI Development Platform'}
                {currentApp === 'neobank' && 'Digital Banking Platform'}
                {currentApp === 'p2p-lending' && 'P2P Lending Platform'}
                {currentApp === 'unified-dashboard' && 'Unified Dashboard'}
                {currentApp === 'app-history' && 'Project Management'}
                {currentApp === 'multi-platform' && 'Multi-Platform Compilation Engine'}
                {currentApp === 'intent-validator' && 'Intent Preservation Validator'}
                {currentApp === 'compliance' && 'Compliance-as-Code Integration'}
                {currentApp === 'performance' && 'Performance Metrics Dashboard'}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>
        {renderCurrentApp()}
      </main>
    </div>
  );
}
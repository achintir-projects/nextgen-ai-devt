/**
 * P2P Lending Dashboard Component
 * Dashboard for peer-to-peer lending platform
 */

'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Shield,
  Clock,
  CheckCircle,
  AlertTriangle,
  Plus,
  Download,
  Handshake,
  Target,
  Percent,
  Calendar
} from 'lucide-react';

interface LoanRequest {
  id: string;
  borrower: string;
  amount: number;
  purpose: string;
  interestRate: number;
  term: number;
  creditScore: number;
  status: 'pending' | 'funded' | 'active' | 'completed' | 'defaulted';
  fundedAmount: number;
  createdAt: Date;
}

interface Investment {
  id: string;
  loanId: string;
  amount: number;
  interestRate: number;
  status: 'active' | 'completed' | 'defaulted';
  expectedReturn: number;
  actualReturn?: number;
  startDate: Date;
  maturityDate: Date;
}

interface PortfolioStats {
  totalInvested: number;
  totalReturns: number;
  activeInvestments: number;
  averageReturn: number;
  defaultRate: number;
}

export default function P2PLendingDashboard() {
  const [loanRequests] = useState<LoanRequest[]>([
    {
      id: '1',
      borrower: 'John Smith',
      amount: 10000,
      purpose: 'Business Expansion',
      interestRate: 8.5,
      term: 24,
      creditScore: 720,
      status: 'pending',
      fundedAmount: 3500,
      createdAt: new Date()
    },
    {
      id: '2',
      borrower: 'Sarah Johnson',
      amount: 5000,
      purpose: 'Home Renovation',
      interestRate: 7.2,
      term: 12,
      creditScore: 680,
      status: 'funded',
      fundedAmount: 5000,
      createdAt: new Date()
    },
    {
      id: '3',
      borrower: 'Mike Davis',
      amount: 15000,
      purpose: 'Debt Consolidation',
      interestRate: 9.1,
      term: 36,
      creditScore: 750,
      status: 'active',
      fundedAmount: 15000,
      createdAt: new Date()
    }
  ]);

  const [investments] = useState<Investment[]>([
    {
      id: '1',
      loanId: '2',
      amount: 1000,
      interestRate: 7.2,
      status: 'active',
      expectedReturn: 1072,
      startDate: new Date(),
      maturityDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
    },
    {
      id: '2',
      loanId: '3',
      amount: 2500,
      interestRate: 9.1,
      status: 'active',
      expectedReturn: 2727.50,
      startDate: new Date(),
      maturityDate: new Date(Date.now() + 3 * 365 * 24 * 60 * 60 * 1000)
    }
  ]);

  const [portfolioStats] = useState<PortfolioStats>({
    totalInvested: 3500,
    totalReturns: 156.80,
    activeInvestments: 2,
    averageReturn: 8.15,
    defaultRate: 0.5
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getLoanStatusBadge = (status: LoanRequest['status']) => {
    const variants = {
      pending: 'secondary',
      funded: 'default',
      active: 'default',
      completed: 'default',
      defaulted: 'destructive'
    } as const;

    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  const getInvestmentStatusBadge = (status: Investment['status']) => {
    const variants = {
      active: 'default',
      completed: 'default',
      defaulted: 'destructive'
    } as const;

    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  const getCreditScoreColor = (score: number) => {
    if (score >= 750) return 'text-green-600';
    if (score >= 700) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">P2P Lending Dashboard</h1>
          <p className="text-muted-foreground">Peer-to-peer lending platform</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Investment
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Invested</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(portfolioStats.totalInvested)}</div>
            <p className="text-xs text-muted-foreground">
              Across {portfolioStats.activeInvestments} active investments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Returns</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(portfolioStats.totalReturns)}</div>
            <p className="text-xs text-muted-foreground">
              {portfolioStats.averageReturn}% average return
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Default Rate</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{portfolioStats.defaultRate}%</div>
            <p className="text-xs text-muted-foreground">
              Below industry average
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Loans</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loanRequests.filter(l => l.status === 'pending').length}</div>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(loanRequests.filter(l => l.status === 'pending').reduce((sum, l) => sum + (l.amount - l.fundedAmount), 0))} to fund
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="investments" className="space-y-4">
        <TabsList>
          <TabsTrigger value="investments">My Investments</TabsTrigger>
          <TabsTrigger value="loans">Available Loans</TabsTrigger>
          <TabsTrigger value="portfolio">Portfolio Analysis</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="investments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Investments</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-4">
                  {investments.map((investment) => (
                    <div key={investment.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">Loan #{investment.loanId}</h3>
                        {getInvestmentStatusBadge(investment.status)}
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Amount:</span>
                          <span className="ml-2 font-medium">
                            {formatCurrency(investment.amount)}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Interest Rate:</span>
                          <span className="ml-2 font-medium">{investment.interestRate}%</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Expected Return:</span>
                          <span className="ml-2 font-medium">
                            {formatCurrency(investment.expectedReturn)}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Maturity Date:</span>
                          <span className="ml-2 font-medium">
                            {investment.maturityDate.toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="loans" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Available Loan Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-4">
                  {loanRequests.filter(l => l.status === 'pending').map((loan) => (
                    <div key={loan.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">{loan.purpose}</h3>
                        {getLoanStatusBadge(loan.status)}
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                        <div>
                          <span className="text-muted-foreground">Borrower:</span>
                          <span className="ml-2 font-medium">{loan.borrower}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Credit Score:</span>
                          <span className={`ml-2 font-medium ${getCreditScoreColor(loan.creditScore)}`}>
                            {loan.creditScore}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Amount:</span>
                          <span className="ml-2 font-medium">
                            {formatCurrency(loan.amount)}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Interest Rate:</span>
                          <span className="ml-2 font-medium">{loan.interestRate}%</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Term:</span>
                          <span className="ml-2 font-medium">{loan.term} months</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Funded:</span>
                          <span className="ml-2 font-medium">
                            {formatCurrency(loan.fundedAmount)} / {formatCurrency(loan.amount)}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm">Invest</Button>
                        <Button size="sm" variant="outline">View Details</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="portfolio" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Portfolio Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Short-term (0-12 months)</span>
                    <span className="font-medium">{formatCurrency(1000)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Medium-term (1-3 years)</span>
                    <span className="font-medium">{formatCurrency(2500)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Long-term (3+ years)</span>
                    <span className="font-medium">{formatCurrency(0)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Risk Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Low Risk (A+)</span>
                    <span className="font-medium">{formatCurrency(2500)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Medium Risk (B)</span>
                    <span className="font-medium">{formatCurrency(1000)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>High Risk (C)</span>
                    <span className="font-medium">{formatCurrency(0)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <div className="flex-1">
                      <p className="font-medium">Investment in Loan #2 completed</p>
                      <p className="text-sm text-muted-foreground">
                        Invested $1,000 at 7.2% interest rate
                      </p>
                    </div>
                    <span className="text-sm text-muted-foreground">2 hours ago</span>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <Handshake className="h-5 w-5 text-blue-500" />
                    <div className="flex-1">
                      <p className="font-medium">New loan request available</p>
                      <p className="text-sm text-muted-foreground">
                        Business Expansion loan - $10,000 at 8.5%
                      </p>
                    </div>
                    <span className="text-sm text-muted-foreground">5 hours ago</span>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <DollarSign className="h-5 w-5 text-green-500" />
                    <div className="flex-1">
                      <p className="font-medium">Interest payment received</p>
                      <p className="text-sm text-muted-foreground">
                        $15.20 interest from Loan #1
                      </p>
                    </div>
                    <span className="text-sm text-muted-foreground">1 day ago</span>
                  </div>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
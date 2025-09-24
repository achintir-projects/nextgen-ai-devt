/**
 * Neobank Dashboard Component
 * Dashboard for digital banking platform
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
  CreditCard, 
  DollarSign,
  Shield,
  Smartphone,
  Building,
  BarChart3,
  Activity,
  Clock,
  CheckCircle,
  AlertTriangle,
  Plus,
  Download,
  Settings
} from 'lucide-react';

interface Account {
  id: string;
  name: string;
  type: 'checking' | 'savings' | 'credit' | 'investment';
  balance: number;
  currency: string;
  lastUpdated: Date;
}

interface Transaction {
  id: string;
  description: string;
  amount: number;
  currency: string;
  type: 'credit' | 'debit';
  category: string;
  date: Date;
  status: 'pending' | 'completed' | 'failed';
}

interface Loan {
  id: string;
  type: string;
  amount: number;
  interestRate: number;
  term: number;
  status: 'active' | 'pending' | 'approved' | 'rejected';
  startDate: Date;
}

export default function NeobankDashboard() {
  const [accounts] = useState<Account[]>([
    {
      id: '1',
      name: 'Primary Checking',
      type: 'checking',
      balance: 15420.50,
      currency: 'USD',
      lastUpdated: new Date()
    },
    {
      id: '2',
      name: 'High-Yield Savings',
      type: 'savings',
      balance: 45300.00,
      currency: 'USD',
      lastUpdated: new Date()
    },
    {
      id: '3',
      name: 'Rewards Credit Card',
      type: 'credit',
      balance: -2500.00,
      currency: 'USD',
      lastUpdated: new Date()
    }
  ]);

  const [transactions] = useState<Transaction[]>([
    {
      id: '1',
      description: 'Grocery Store',
      amount: -85.50,
      currency: 'USD',
      type: 'debit',
      category: 'Food & Dining',
      date: new Date(),
      status: 'completed'
    },
    {
      id: '2',
      description: 'Salary Deposit',
      amount: 3500.00,
      currency: 'USD',
      type: 'credit',
      category: 'Income',
      date: new Date(),
      status: 'completed'
    },
    {
      id: '3',
      description: 'Netflix Subscription',
      amount: -15.99,
      currency: 'USD',
      type: 'debit',
      category: 'Entertainment',
      date: new Date(),
      status: 'completed'
    }
  ]);

  const [loans] = useState<Loan[]>([
    {
      id: '1',
      type: 'Personal Loan',
      amount: 10000,
      interestRate: 5.5,
      term: 36,
      status: 'active',
      startDate: new Date()
    }
  ]);

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const getAccountIcon = (type: Account['type']) => {
    switch (type) {
      case 'checking':
        return <CreditCard className="h-5 w-5" />;
      case 'savings':
        return <DollarSign className="h-5 w-5" />;
      case 'credit':
        return <CreditCard className="h-5 w-5" />;
      case 'investment':
        return <TrendingUp className="h-5 w-5" />;
      default:
        return <CreditCard className="h-5 w-5" />;
    }
  };

  const getTransactionStatusIcon = (status: Transaction['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'failed':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getLoanStatusBadge = (status: Loan['status']) => {
    const variants = {
      active: 'default',
      pending: 'secondary',
      approved: 'default',
      rejected: 'destructive'
    } as const;

    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Neobank Dashboard</h1>
          <p className="text-muted-foreground">Digital banking platform</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Account
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$58,220.50</div>
            <p className="text-xs text-muted-foreground">
              +2.1% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Accounts</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              2 checking, 1 savings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Spending</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$3,247</div>
            <p className="text-xs text-muted-foreground">
              -12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Credit Score</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">748</div>
            <p className="text-xs text-muted-foreground">
              Excellent
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="accounts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="accounts">Accounts</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="loans">Loans</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="accounts" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {accounts.map((account) => (
              <Card key={account.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {getAccountIcon(account.type)}
                    {account.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatCurrency(account.balance, account.currency)}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {account.type.charAt(0).toUpperCase() + account.type.slice(1)} Account
                  </p>
                  <div className="flex gap-2 mt-4">
                    <Button size="sm" variant="outline">
                      Transfer
                    </Button>
                    <Button size="sm" variant="outline">
                      Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-4">
                  {transactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {getTransactionStatusIcon(transaction.status)}
                        <div>
                          <p className="font-medium">{transaction.description}</p>
                          <p className="text-sm text-muted-foreground">
                            {transaction.category} • {transaction.date.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-medium ${
                          transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {formatCurrency(transaction.amount, transaction.currency)}
                        </p>
                        <Badge variant="outline" className="text-xs">
                          {transaction.status}
                        </Badge>
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
              <CardTitle>Active Loans</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loans.map((loan) => (
                  <div key={loan.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{loan.type}</h3>
                      {getLoanStatusBadge(loan.status)}
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Amount:</span>
                        <span className="ml-2 font-medium">
                          {formatCurrency(loan.amount, 'USD')}
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
                        <span className="text-muted-foreground">Start Date:</span>
                        <span className="ml-2 font-medium">
                          {loan.startDate.toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Spending by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Food & Dining</span>
                    <span className="font-medium">$1,247</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Transportation</span>
                    <span className="font-medium">$456</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Entertainment</span>
                    <span className="font-medium">$234</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shopping</span>
                    <span className="font-medium">$1,310</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Monthly Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Income</span>
                    <span className="font-medium text-green-600">+$5,200</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Expenses</span>
                    <span className="font-medium text-red-600">-$3,247</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between font-medium">
                      <span>Net</span>
                      <span className="text-green-600">+$1,953</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
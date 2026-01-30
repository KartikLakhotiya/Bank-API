import { useEffect, useState } from 'react'
import { useAuthStore, useAccountStore } from '@/store'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Label,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Separator,
} from '@/components/ui'
import { toast } from 'sonner'
import { formatCurrency, formatDate } from '@/lib/utils'
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Send,
  CreditCard,
  History,
  Loader2,
  TrendingUp,
  TrendingDown,
} from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import type { Account } from '@/types'

export function DashboardPage() {
  const { user } = useAuthStore()
  const {
    account,
    transactions,
    allAccounts,
    isLoading,
    fetchAccount,
    fetchTransactions,
    fetchAllAccounts,
    deposit,
    withdraw,
    transfer,
    updateCredit,
  } = useAccountStore()

  const [depositAmount, setDepositAmount] = useState('')
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [transferAmount, setTransferAmount] = useState('')
  const [recipientAccount, setRecipientAccount] = useState('')
  const [isDepositOpen, setIsDepositOpen] = useState(false)
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false)
  const [isTransferOpen, setIsTransferOpen] = useState(false)
  const [isCreditOpen, setIsCreditOpen] = useState(false)
  const [creditAmount, setCreditAmount] = useState('')

  // Helper to get accountId as string
  const getAccountId = (accountId: string | { _id: string } | undefined): string | undefined => {
    if (!accountId) return undefined
    return typeof accountId === 'string' ? accountId : accountId._id
  }

  const accountId = getAccountId(user?.accountId)

  useEffect(() => {
    if (accountId) {
      fetchAccount(accountId)
      fetchTransactions(accountId)
      fetchAllAccounts()
    }
  }, [accountId, fetchAccount, fetchTransactions, fetchAllAccounts])

  const handleDeposit = async () => {
    const amount = parseFloat(depositAmount)
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount')
      return
    }

    if (!accountId) {
      toast.error('Account not found')
      return
    }

    try {
      await deposit(user!._id, accountId, amount)
      toast.success(`Successfully deposited ${formatCurrency(amount)}`)
      setDepositAmount('')
      setIsDepositOpen(false)
    } catch {
      toast.error('Deposit failed. Please try again.')
    }
  }

  const handleWithdraw = async () => {
    const amount = parseFloat(withdrawAmount)
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount')
      return
    }

    if (account && amount > account.balance + account.credit) {
      toast.error('Insufficient funds')
      return
    }

    if (!accountId) {
      toast.error('Account not found')
      return
    }

    try {
      await withdraw(user!._id, accountId, amount)
      toast.success(`Successfully withdrew ${formatCurrency(amount)}`)
      setWithdrawAmount('')
      setIsWithdrawOpen(false)
    } catch {
      toast.error('Withdrawal failed. Please try again.')
    }
  }

  const handleUpdateCredit = async () => {
    const amount = parseFloat(creditAmount)
    if (isNaN(amount) || amount === 0) {
      toast.error('Please enter a valid amount')
      return
    }

    if (!accountId) {
      toast.error('Account not found')
      return
    }

    // Prevent reducing credit below zero
    if (account && account.credit + amount < 0) {
      toast.error('Cannot reduce credit below zero')
      return
    }

    try {
      await updateCredit(user!._id, accountId, amount)
      toast.success(
        amount > 0
          ? `Credit limit increased by ${formatCurrency(amount)}`
          : `Credit limit decreased by ${formatCurrency(Math.abs(amount))}`
      )
      setCreditAmount('')
      setIsCreditOpen(false)
    } catch {
      toast.error('Credit update failed. Please try again.')
    }
  }

  const handleTransfer = async () => {
    const amount = parseFloat(transferAmount)
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount')
      return
    }

    if (!recipientAccount) {
      toast.error('Please select a recipient')
      return
    }

    if (account && amount > account.balance + account.credit) {
      toast.error('Insufficient funds')
      return
    }

    if (!accountId) {
      toast.error('Account not found')
      return
    }

    try {
      await transfer(accountId, recipientAccount, amount)
      toast.success(`Successfully transferred ${formatCurrency(amount)}`)
      setTransferAmount('')
      setRecipientAccount('')
      setIsTransferOpen(false)
      // Refresh account data
      fetchAccount(accountId)
      fetchTransactions(accountId)
    } catch {
      toast.error('Transfer failed. Please try again.')
    }
  }

  const otherAccounts = allAccounts.filter(
    (acc: Account) => acc._id !== user?.accountId
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Welcome back, {user?.firstName}!
          </h1>
          <p className="text-slate-600 mt-1">
            Here's an overview of your account
          </p>
        </div>

        {/* Account Overview */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Balance
              </CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {account ? formatCurrency(account.balance) : '$0.00'}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Available in your account
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Credit Limit</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {account ? formatCurrency(account.credit) : '$0.00'}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Available credit line
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Available
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {account
                  ? formatCurrency(account.balance + account.credit)
                  : '$0.00'}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Balance + Credit
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Transactions</CardTitle>
              <History className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{transactions.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Total transactions
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <Dialog open={isDepositOpen} onOpenChange={setIsDepositOpen}>
            <DialogTrigger asChild>
              <Button className="h-20 text-lg" variant="outline">
                <ArrowDownLeft className="mr-2 h-5 w-5 text-green-500" />
                Deposit
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Deposit Money</DialogTitle>
                <DialogDescription>
                  Add funds to your account
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="depositAmount">Amount</Label>
                  <Input
                    id="depositAmount"
                    type="number"
                    placeholder="Enter amount"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsDepositOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleDeposit} disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    'Deposit'
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={isWithdrawOpen} onOpenChange={setIsWithdrawOpen}>
            <DialogTrigger asChild>
              <Button className="h-20 text-lg" variant="outline">
                <ArrowUpRight className="mr-2 h-5 w-5 text-red-500" />
                Withdraw
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Withdraw Money</DialogTitle>
                <DialogDescription>
                  Withdraw funds from your account
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="withdrawAmount">Amount</Label>
                  <Input
                    id="withdrawAmount"
                    type="number"
                    placeholder="Enter amount"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Available: {account ? formatCurrency(account.balance + account.credit) : '$0.00'}
                </p>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsWithdrawOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleWithdraw} disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    'Withdraw'
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={isTransferOpen} onOpenChange={setIsTransferOpen}>
            <DialogTrigger asChild>
              <Button className="h-20 text-lg" variant="outline">
                <Send className="mr-2 h-5 w-5 text-blue-500" />
                Transfer
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Transfer Money</DialogTitle>
                <DialogDescription>
                  Send money to another account
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="recipient">Recipient</Label>
                  <select
                    id="recipient"
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    value={recipientAccount}
                    onChange={(e) => setRecipientAccount(e.target.value)}
                  >
                    <option value="">Select recipient</option>
                    {otherAccounts.map((acc: Account) => (
                      <option key={acc._id} value={acc._id}>
                        {acc.firstName} - {acc._id.slice(-6)}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="transferAmount">Amount</Label>
                  <Input
                    id="transferAmount"
                    type="number"
                    placeholder="Enter amount"
                    value={transferAmount}
                    onChange={(e) => setTransferAmount(e.target.value)}
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Available: {account ? formatCurrency(account.balance + account.credit) : '$0.00'}
                </p>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsTransferOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleTransfer} disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    'Transfer'
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={isCreditOpen} onOpenChange={setIsCreditOpen}>
            <DialogTrigger asChild>
              <Button className="h-20 text-lg" variant="outline">
                <CreditCard className="mr-2 h-5 w-5 text-purple-500" />
                Credit Line
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Manage Credit Line</DialogTitle>
                <DialogDescription>
                  Adjust your credit limit
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Current Credit Limit</p>
                  <p className="text-2xl font-bold">{account ? formatCurrency(account.credit) : '₹0.00'}</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="creditAmount">Adjustment Amount</Label>
                  <Input
                    id="creditAmount"
                    type="number"
                    placeholder="Enter amount (+ to increase, - to decrease)"
                    value={creditAmount}
                    onChange={(e) => setCreditAmount(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Use positive values to increase and negative to decrease credit limit
                  </p>
                </div>
                {creditAmount && !isNaN(parseFloat(creditAmount)) && (
                  <div className="p-3 bg-secondary rounded-lg">
                    <p className="text-sm">
                      New Credit Limit:{' '}
                      <span className="font-semibold">
                        {account
                          ? formatCurrency(Math.max(0, account.credit + parseFloat(creditAmount)))
                          : '₹0.00'}
                      </span>
                    </p>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsCreditOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleUpdateCredit} disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    'Update Credit'
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Transactions History */}
        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
            <CardDescription>Your recent transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="deposits">Deposits</TabsTrigger>
                <TabsTrigger value="withdrawals">Withdrawals</TabsTrigger>
                <TabsTrigger value="transfers">Transfers</TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="mt-4">
                <TransactionList transactions={transactions} />
              </TabsContent>
              <TabsContent value="deposits" className="mt-4">
                <TransactionList
                  transactions={transactions.filter((t) => t.type === 'deposit')}
                />
              </TabsContent>
              <TabsContent value="withdrawals" className="mt-4">
                <TransactionList
                  transactions={transactions.filter(
                    (t) => t.type === 'withdrawal'
                  )}
                />
              </TabsContent>
              <TabsContent value="transfers" className="mt-4">
                <TransactionList
                  transactions={transactions.filter((t) => t.type === 'transfer')}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

interface TransactionListProps {
  transactions: Array<{
    _id: string
    type: 'withdrawal' | 'deposit' | 'transfer'
    amount: number
    timestamp: string
    toAccountId?: string
  }>
}

function TransactionList({ transactions }: TransactionListProps) {
  if (transactions.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No transactions found
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {transactions.map((transaction) => (
        <div key={transaction._id}>
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-4">
              <div
                className={`p-2 rounded-full ${
                  transaction.type === 'deposit'
                    ? 'bg-green-100'
                    : transaction.type === 'withdrawal'
                    ? 'bg-red-100'
                    : 'bg-blue-100'
                }`}
              >
                {transaction.type === 'deposit' ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : transaction.type === 'withdrawal' ? (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                ) : (
                  <Send className="h-4 w-4 text-blue-600" />
                )}
              </div>
              <div>
                <p className="font-medium capitalize">{transaction.type}</p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(transaction.timestamp)}
                </p>
              </div>
            </div>
            <div
              className={`font-semibold ${
                transaction.type === 'deposit'
                  ? 'text-green-600'
                  : 'text-red-600'
              }`}
            >
              {transaction.type === 'deposit' ? '+' : '-'}
              {formatCurrency(transaction.amount)}
            </div>
          </div>
          <Separator />
        </div>
      ))}
    </div>
  )
}

export default DashboardPage

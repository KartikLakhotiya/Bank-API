import { create } from 'zustand'
import type { Account, Transaction } from '@/types'
import { accountService, transactionService } from '@/services'

interface AccountState {
  account: Account | null
  transactions: Transaction[]
  allAccounts: Account[]
  isLoading: boolean
  error: string | null

  // Actions
  fetchAccount: (accountId: string | { _id: string }) => Promise<void>
  fetchTransactions: (accountId: string) => Promise<void>
  fetchAllAccounts: () => Promise<void>
  deposit: (userId: string, accountId: string, amount: number) => Promise<void>
  withdraw: (userId: string, accountId: string, amount: number) => Promise<void>
  transfer: (fromAccountId: string, toAccountId: string, amount: number) => Promise<void>
  updateCredit: (userId: string, accountId: string, amount: number) => Promise<void>
  clearError: () => void
  setAccount: (account: Account) => void
}

export const useAccountStore = create<AccountState>()((set, get) => ({
  account: null,
  transactions: [],
  allAccounts: [],
  isLoading: false,
  error: null,

  fetchAccount: async (accountId: string | { _id: string }) => {
    set({ isLoading: true, error: null })
    try {
      // Handle accountId being either a string or an object with _id
      const id = typeof accountId === 'string' ? accountId : accountId._id
      const account = await accountService.getAccountById(id)
      set({ account, isLoading: false })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch account'
      set({ error: message, isLoading: false })
    }
  },

  fetchTransactions: async (accountId: string) => {
    set({ isLoading: true, error: null })
    try {
      const response = await transactionService.getUserTransactions(accountId)
      // Ensure transactions is always an array
      const transactions = Array.isArray(response) ? response : []
      set({ transactions, isLoading: false })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch transactions'
      set({ error: message, isLoading: false, transactions: [] })
    }
  },

  fetchAllAccounts: async () => {
    set({ isLoading: true, error: null })
    try {
      const allAccounts = await accountService.getAllAccounts()
      set({ allAccounts, isLoading: false })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch accounts'
      set({ error: message, isLoading: false })
    }
  },

  deposit: async (userId: string, accountId: string, amount: number) => {
    set({ isLoading: true, error: null })
    try {
      const response = await transactionService.deposit({ userId, accountId, amount })
      set({ account: response.account, isLoading: false })
      // Refresh transactions
      await get().fetchTransactions(userId)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Deposit failed'
      set({ error: message, isLoading: false })
      throw error
    }
  },

  withdraw: async (userId: string, accountId: string, amount: number) => {
    set({ isLoading: true, error: null })
    try {
      const response = await transactionService.withdraw({ userId, accountId, amount })
      set({ account: response.account, isLoading: false })
      // Refresh transactions
      await get().fetchTransactions(userId)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Withdrawal failed'
      set({ error: message, isLoading: false })
      throw error
    }
  },

  transfer: async (fromAccountId: string, toAccountId: string, amount: number) => {
    set({ isLoading: true, error: null })
    try {
      await transactionService.transfer({ fromAccountId, toAccountId, amount })
      // Refresh account data
      await get().fetchAccount(fromAccountId)
      set({ isLoading: false })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Transfer failed'
      set({ error: message, isLoading: false })
      throw error
    }
  },

  updateCredit: async (userId: string, accountId: string, amount: number) => {
    set({ isLoading: true, error: null })
    try {
      const response = await transactionService.updateCredit({ userId, accountId, amount })
      set({ account: response.account, isLoading: false })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Credit update failed'
      set({ error: message, isLoading: false })
      throw error
    }
  },

  clearError: () => set({ error: null }),
  
  setAccount: (account: Account) => set({ account }),
}))

export default useAccountStore

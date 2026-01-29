import api from './api'
import type { Transaction, DepositWithdrawData, TransferData, Account } from '@/types'

interface TransactionResponse {
  message: string
  account: Account
}

export const transactionService = {
  deposit: async (data: DepositWithdrawData): Promise<TransactionResponse> => {
    const response = await api.post<TransactionResponse>('/transactions/deposit', data)
    return response.data
  },

  withdraw: async (data: DepositWithdrawData): Promise<TransactionResponse> => {
    const response = await api.post<TransactionResponse>('/transactions/withdraw', data)
    return response.data
  },

  transfer: async (data: TransferData): Promise<TransactionResponse> => {
    const response = await api.post<TransactionResponse>('/transactions/transfer', data)
    return response.data
  },

  updateCredit: async (data: DepositWithdrawData): Promise<TransactionResponse> => {
    const response = await api.put<TransactionResponse>('/transactions/credit', data)
    return response.data
  },

  getUserTransactions: async (accountId: string): Promise<Transaction[]> => {
    const response = await api.get<Transaction[]>(`/transactions/user/${accountId}`)
    return response.data
  },
}

export default transactionService

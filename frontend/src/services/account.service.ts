import api from './api'
import type { Account } from '@/types'

interface BalanceResponse {
  message: string
  firstName: string
  balance: number
}

export const accountService = {
  getAllAccounts: async (): Promise<Account[]> => {
    const response = await api.get<Account[]>('/accounts/all')
    return response.data
  },

  getAccountById: async (id: string): Promise<Account> => {
    const response = await api.get<Account>(`/accounts/${id}`)
    return response.data
  },

  checkBalance: async (accountId: string): Promise<BalanceResponse> => {
    const response = await api.post<BalanceResponse>('/accounts/check-balance', { accountId })
    return response.data
  },
}

export default accountService

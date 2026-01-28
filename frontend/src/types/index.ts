export interface User {
  _id: string
  firstName: string
  lastName: string
  email: string
  accountId: string | { _id: string }
  balance?: number
  lastLogin?: string
  createdAt: string
  updatedAt: string
}

export interface Account {
  _id: string
  userId: string
  firstName: string
  balance: number
  credit: number
  transactions: string[]
}

export interface Transaction {
  _id: string
  type: 'withdrawal' | 'deposit' | 'transfer'
  accountId: string
  toAccountId?: string
  amount: number
  timestamp: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  firstName: string
  lastName: string
  email: string
  password: string
}

export interface ApiResponse<T> {
  success?: boolean
  message?: string
  data?: T
}

export interface LoginResponse {
  success: string
  message: string
  user: User
}

export interface TransferData {
  fromAccountId: string
  toAccountId: string
  amount: number
}

export interface DepositWithdrawData {
  userId: string
  accountId: string
  amount: number
}

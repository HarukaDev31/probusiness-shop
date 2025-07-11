import { apiClient } from '~/utils/api-client'

export const getUserAccount = async () => {
  const token = localStorage.getItem('access_token')
  const response = await apiClient.api('/me', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  return response
}

export const updateUserAccount = async (data) => {
  const token = localStorage.getItem('access_token')
  const response = await apiClient.api('/me', {
    method: 'PUT',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  })
  return response
} 
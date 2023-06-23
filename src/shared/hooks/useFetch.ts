import { useState } from 'react'
import useSWR from 'swr'
import api from '../services/api'

interface AxiosError {
  code: any
  config: any
  message: any
  name: any
  request: any
  response: any
}

export function useFetch<Data = unknown, Error = AxiosError>(url: string) {
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const { data, error, isValidating, mutate } = useSWR<Data, Error>(
    url,
    async url => {
      const response = await api.get(url)

      setIsLoading(false)

      return response.data
    }
  )

  return { data, error, isLoading, isValidating, mutate }
}

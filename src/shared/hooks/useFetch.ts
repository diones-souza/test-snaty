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
  const { data, error, isValidating, mutate } = useSWR<Data, Error>(
    url,
    async url => {
      const response = await api.get(url)

      return response.data
    }
  )

  return { data, error, isValidating, mutate }
}

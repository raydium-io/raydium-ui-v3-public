import { useLaunchpadStore } from '@/store'
import useSWR from 'swr'
import axios from '@/api/axios'
import { VestingConfig } from './type'
import { PublicKey } from '@solana/web3.js'

interface Props {
  shouldFetch?: boolean
  owner?: string | PublicKey
  refreshInterval?: number
}

const fetcher = (
  url: string
): Promise<{
  id: string
  success: boolean
  msg?: string
  data: {
    data: {
      [key: string]: VestingConfig | null
    }
  }
}> => axios.get(url)

export default function useOwnerVestingInfo({ shouldFetch = true, owner, refreshInterval = 30 * 1000 }: Props) {
  const mintHost = useLaunchpadStore((s) => s.mintHost)

  const fetch = shouldFetch && owner

  const { data, ...rest } = useSWR(fetch ? `${mintHost}/vesting/by/owner?id=${owner.toString()}` : null, fetcher, {
    dedupingInterval: refreshInterval,
    focusThrottleInterval: refreshInterval,
    refreshInterval
  })

  return {
    data: data?.data.data,
    ...rest
  }
}

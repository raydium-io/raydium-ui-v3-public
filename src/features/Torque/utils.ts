import { TorqueConversion, TorqueLeaderboardOffer, TorqueOffer, TorqueRawLeaderboard, TorqueRawOffer, TorqueRawRaffle } from './types'

/**
 * Torque API URL
 */
const TORQUE_API_URL = process.env.NEXT_PUBLIC_TORQUE_API_URL || 'https://server.torque.so'
/**
 * Torque API routes
 */
const TORQUE_API_ROUTES = {
  offers: (wallet: string) => `/offer/wallet/${wallet}` as const,
  offer: (offerId: string) => `/offer/${offerId}` as const,
  conversions: (wallet: string) => `/conversions/wallet/${wallet}` as const,
  claim: (offerId: string) => `/claim/${offerId}` as const,
  leaderboard: (leaderboardId: string) => `/leaderboard/${leaderboardId}` as const,
  audience: (projectId: string, audienceId: string) => `/projects/${projectId}/audience/${audienceId}` as const,
  raffle: () => `/raydium/weekly-raffle` as const
}

/**
 * Generic fetch utility for Torque API endpoints
 *
 * @param endpoint - The API endpoint path
 * @param params - Path parameters to include in the URL
 * @param queryParams - Query parameters to include in the URL
 *
 * @returns Promise with the response data
 */
async function fetchTorqueData<T>(endpoint: string, queryParams: Record<string, string> = {}): Promise<T> {
  // Construct the URL
  const url = new URL(endpoint, TORQUE_API_URL)

  // Add query parameters
  Object.entries(queryParams).forEach(([key, value]) => {
    if (value !== undefined) {
      url.searchParams.append(key, value)
    }
  })

  // Make the fetch request
  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })

  // Check if the request was successful
  if (!response.ok) {
    const errorData = await response.json()

    throw new Error(`API request failed: ${errorData.message || response.statusText}`)
  }

  // Parse and return the response data
  const result = await response.json()

  if (result.status === 'SUCCESS') {
    return result.data
  }

  throw new Error(`Failed to fetch offers: ${result.message}`)
}

/**
 * Fetches offers by wallet address
 *
 * @param wallet - The wallet address to fetch offers for
 * @param projectId - Optional project ID to filter offers
 *
 * @returns Promise with the array of offers
 */
export async function fetchOffersByWallet(wallet: string, projectId?: string) {
  return fetchTorqueData<TorqueRawOffer[]>(TORQUE_API_ROUTES.offers(wallet), projectId ? { projectId } : {})
}
/**
 * Fetches conversions by wallet address
 *
 * @param wallet - The wallet address to fetch conversions for
 * @param projectId - Optional project ID to filter conversions
 * @returns Promise with the array of conversions
 */
export async function fetchConversionsByWallet(wallet: string, projectId?: string) {
  return fetchTorqueData<TorqueConversion[]>(TORQUE_API_ROUTES.conversions(wallet), projectId ? { projectId } : {})
}

/**
 * Claims an offer
 *
 * @param offerId - The offer ID to claim
 * @param wallet - The wallet address to claim the offer for
 *
 */
export async function claimOffer(offerId: string, wallet: string) {
  return fetchTorqueData<{ status: string }>(TORQUE_API_ROUTES.claim(offerId), { wallet })
}

export async function fetchLeaderboardOfferDetails() {
  const response = await fetch('https://cdn.torque.so/leaderboard/raydiumLeaderboard.json', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })

  // Check if the request was successful
  if (!response.ok) {
    const errorData = await response.json()

    throw new Error(`API request failed: ${errorData.message || response.statusText}`)
  }

  // Parse and return the response data
  return (await response.json()) as TorqueLeaderboardOffer
}

export async function fetchRaffleDetails(wallet?: string) {
  return fetchTorqueData<TorqueRawRaffle>(TORQUE_API_ROUTES.raffle(), wallet ? { pubkey: wallet } : undefined)
}

/**
 * Sets the status based on the hierarchy of offer statuses
 *
 * @param newStatus - The new status to set
 * @param oldStatus - The old status to compare against
 *
 **/
export function setStatusBasedOnHierarchy(newStatus: TorqueOffer['status'], oldStatus: TorqueOffer['status']) {
  // Active offers should take precedence over any other status
  if (newStatus === 'ACTIVE' || oldStatus === 'ACTIVE') {
    return 'ACTIVE'
  }

  // Claimed offers should take precedence over Pending
  if (newStatus === 'CLAIMED' || (newStatus === 'PENDING' && oldStatus !== 'CLAIMED')) {
    return newStatus
  }

  return oldStatus
}

/**
 * Fetches the leaderboard for a given wallet
 *
 * @param leaderboardId - The leaderboard ID to fetch
 *
 * @returns Promise with the leaderboard data
 */
export async function fetchTorqueLeaderboard(leaderboardId: string): Promise<TorqueRawLeaderboard> {
  return fetchTorqueData<TorqueRawLeaderboard>(TORQUE_API_ROUTES.leaderboard(leaderboardId))
}

export function displayNumber(number: number) {
  if (number < 1000) {
    return number
  }

  const formattedNumber = (number / 1000).toFixed(1)

  return `${formattedNumber.endsWith('.0') ? formattedNumber.slice(0, -2) : formattedNumber}k`
}

export function formatBadDateString(date: string, makeUtc = false): string {
  const splitDate = date.split('-')
  const baseDate = `2025-${splitDate[0].length === 1 ? `0${splitDate[0]}` : splitDate[0]}-${
    splitDate[1].length === 1 ? `0${splitDate[1]}` : splitDate[1]
  }`

  return makeUtc ? baseDate + 'T00:00:00Z' : baseDate
}

export const twitterShareUrl = (amount: string, wallet: string) => {
  const safeAmount = encodeURIComponent(amount)
  return `https://twitter.com/intent/post?text=Just%20claimed%20${safeAmount}%20for%20trading%20on%20LaunchLab%20%40RaydiumProtocol%20%F0%9F%92%AA%0A%0ABeen%20in%20the%20trenches%3F%20You%20may%20have%20rewards%20waiting.%20Trade%20using%20my%20link%20for%20more%20chances%20to%20win%20RAY%20%F0%9F%91%89%20https%3A%2F%2Fraydium.io%2Flaunchpad%2F%3Flreferrer%3D${wallet}`
}

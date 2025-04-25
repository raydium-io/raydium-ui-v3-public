import { TorqueConversion, TorqueRawOffer } from './types'

/**
 * Torque API URL
 */
const TORQUE_API_URL = process.env.NEXT_PUBLIC_TORQUE_API_URL || 'https://server.torque.so'

/**
 * Torque API routes
 */
const TORQUE_API_ROUTES = {
  offers: (wallet: string) => `/offer/wallet/${wallet}` as const,
  conversions: (wallet: string) => `/conversions/wallet/${wallet}` as const,
  claim: (offerId: string) => `/claim/${offerId}` as const
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

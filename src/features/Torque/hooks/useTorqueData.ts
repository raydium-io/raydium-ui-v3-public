import { useCallback, useEffect, useMemo, useState } from 'react'
import { Wallet } from '@solana/wallet-adapter-react'
import { fetchOffersByWallet, fetchConversionsByWallet, claimOffer, setStatusBasedOnHierarchy } from '../utils'
import { TorqueCampaign, TorqueOffer } from '../types'
import { PublicKey } from '@solana/web3.js'
import dayjs from 'dayjs'
import { useToast } from '@chakra-ui/react'
import { useTokenStore } from '@/store/useTokenStore'

const RAYDIUM_PROJECT_ID = process.env.NEXT_PUBLIC_TORQUE_PROJECT_ID || 'cm9w3m8xr01trju1f3lbsy3jn'

/**
 * Fetch offers and conversions for wallet
 *
 * @param wallet
 *
 * @returns offers and conversions for wallet
 */
export function useTorqueData({ wallet }: { wallet: Wallet | null | undefined }) {
  // State
  const [offers, setOffers] = useState<TorqueOffer[]>([])
  const [campaigns, setCampaigns] = useState<TorqueCampaign[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  // Hooks
  const tokenMap = useTokenStore((s) => s.tokenMap)
  const toast = useToast()

  const handleClaimOffer = useCallback(
    async (offerId: string) => {
      try {
        if (!wallet?.adapter.publicKey) {
          toast({
            title: 'No wallet connected',
            description: 'Please connect your wallet to claim this offer',
            status: 'error',
            isClosable: true,
            position: 'bottom-right'
          })
          return
        }

        await claimOffer(offerId, wallet.adapter.publicKey.toString())

        // Optimistically update the offer status
        setOffers((prevOffers) => prevOffers.map((offer) => (offer.id === offerId ? { ...offer, status: 'PENDING' } : offer)))
        setCampaigns((prevCampaigns) =>
          prevCampaigns.map((campaign) =>
            campaign.offers.some((offer) => offer.id === offerId)
              ? {
                  ...campaign,
                  status: 'PENDING',
                  offers: campaign.offers.map((offer) => (offer.id === offerId ? { ...offer, status: 'PENDING' } : offer))
                }
              : campaign
          )
        )

        // For now, we poll every 6 seconds for the offer status to change to DONE in crank
        const interval = setInterval(async () => {
          if (!wallet?.adapter.publicKey) return

          const updatedConversions = await fetchConversionsByWallet(wallet.adapter.publicKey.toString(), RAYDIUM_PROJECT_ID)
          const updatedCrank = updatedConversions.find((conversion) => conversion.offer.id === offerId)?.cranks[0]

          if (updatedCrank?.status === 'DONE') {
            setOffers((prevOffers) =>
              prevOffers.map((offer) =>
                offer.id === offerId
                  ? {
                      ...offer,
                      numberOfConversions: offer.numberOfConversions + 1,
                      status: 'CLAIMED',
                      txSignature: updatedCrank.transaction
                    }
                  : offer
              )
            )
            setCampaigns((prevCampaigns) =>
              prevCampaigns.map((campaign) =>
                campaign.offers.some((offer) => offer.id === offerId)
                  ? {
                      ...campaign,
                      status: 'CLAIMED',
                      offers: campaign.offers.map((offer) => (offer.id === offerId ? { ...offer, status: 'CLAIMED' } : offer))
                    }
                  : campaign
              )
            )
            clearInterval(interval)
          }
        }, 6000)

        toast({
          title: 'Offer claimed',
          description: 'You have successfully claimed this offer. Check your wallet and you will shortly receive your reward.',
          status: 'success',
          isClosable: true,
          position: 'bottom-right'
        })
      } catch (error) {
        console.error(error)
      }
    },
    [wallet]
  )

  const fetchTorqueData = useCallback(async () => {
    const walletAddress = wallet?.adapter.publicKey?.toString()

    if (!walletAddress) {
      setOffers([])
      return
    }

    setLoading(true)

    try {
      const [rawOffers, conversions] = await Promise.all([
        fetchOffersByWallet(walletAddress, RAYDIUM_PROJECT_ID),
        fetchConversionsByWallet(walletAddress, RAYDIUM_PROJECT_ID)
      ])

      const offersWithConversions: TorqueOffer[] = rawOffers
        .filter((offer) => dayjs(offer.startTime).isBefore(dayjs()))
        .map((offer) => {
          const conversion = conversions.find((conversion) => conversion.offer.id === offer.id)
          const crank = conversion && conversion.cranks.length > 0 ? conversion.cranks[0] : undefined
          const distributor = offer.distributors.length > 0 ? offer.distributors[0] : undefined

          if (!distributor) {
            throw new Error('Distributor not found')
          }

          // Calculate the rewards
          const rewardTotal = distributor.totalFundAmount
          const rewardPerUser = offer.eligibleAmount

          // Get the token details
          const rewardToken = typeof distributor.tokenAddress === 'string' ? tokenMap.get(distributor.tokenAddress) : undefined
          // The fallback is currently set to RAY just in case the token is not found as we have not been to verify the token fetch works
          const rewardDenomination = distributor.emissionType === 'SOL' ? 'SOL' : rewardToken?.symbol ?? 'RAY'

          // Calculate the offer status
          const startTime = dayjs(offer.startTime)
          const endTime = dayjs(offer.endTime)
          const isOfferActive = offer.status === 'ACTIVE' || (startTime.isBefore(dayjs()) && endTime.isAfter(dayjs()))
          const crankStatus =
            crank?.status === 'DONE' ? 'CLAIMED' : crank?.status === 'PENDING' || crank?.status === 'STAGED' ? 'PENDING' : undefined
          const status = crankStatus ? crankStatus : offer.eligible ? (isOfferActive ? 'ACTIVE' : 'EXPIRED') : 'INELIGIBLE'

          return {
            id: offer.id,
            name: offer.metadata.title,
            description: offer.metadata.description,
            status,
            startTime,
            endTime,
            eligible: offer.eligible,
            txSignature: crank?.transaction,
            distributor: distributor ? new PublicKey(distributor.pubkey) : undefined,
            rewardPerUser,
            rewardTotal,
            rewardDenomination,
            numberOfConversions: offer.numberOfConversions,
            maxParticipants: distributor.crankGuard.availability.maxTotalConversions,
            campaignId: offer.campaignId
          }
        })

      const campaigns = offersWithConversions.reduce((acc, offer) => {
        const id = offer.id

        if (!acc[id]) {
          acc[id] = {
            id,
            name: offer.name,
            description: offer.description,
            rewardTotal: Number(offer.rewardTotal),
            numberOfConversions: offer.numberOfConversions,
            rewardDenomination: offer.rewardDenomination,
            maxParticipants: offer.maxParticipants,
            offers: [offer],
            status: offer.status,
            startTime: offer.startTime,
            endTime: offer.endTime
          }
        } else {
          acc[id].offers.push(offer)
          acc[id].rewardTotal += Number(offer.rewardTotal)
          acc[id].numberOfConversions += offer.numberOfConversions
          acc[id].maxParticipants += offer.maxParticipants

          // Only override the status if the offer is active, as the rest of the offers will have the same status
          if (offer.status !== acc[id].status) {
            acc[id].status = setStatusBasedOnHierarchy(offer.status, acc[id].status)
          }
        }

        return acc
      }, {} as Record<string, TorqueCampaign>)

      setCampaigns(Object.values(campaigns))
      setOffers(offersWithConversions)
    } catch (error) {
      setError('Unable to fetch your offers at this time, please come back again later.')
      setOffers([])
    } finally {
      setLoading(false)
    }
  }, [wallet, tokenMap])

  const activeOffersCount = useMemo(() => {
    return offers.filter((offer) => offer.status === 'ACTIVE').length
  }, [offers])

  useEffect(() => {
    fetchTorqueData()
  }, [wallet?.adapter.publicKey])

  return { offers, handleClaimOffer, loading, error, activeOffersCount, campaigns }
}

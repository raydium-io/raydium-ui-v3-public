import { VStack, Text, Heading, HStack, Button, Stack, Badge, Flex, Spinner, IconButton, SkeletonText, Skeleton } from '@chakra-ui/react'
import { colors } from '@/theme/cssVariables'
import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useAppStore } from '@/store'
import { TorqueCampaign } from '../types'
import Tooltip from '@/components/Tooltip'
import ClockIcon from '@/icons/misc/Clock'
import GiftIcon from '@/icons/misc/Gift'
import ShareIcon from '@/icons/misc/ShareIcon'
import { displayNumber, twitterShareUrl } from '../utils'
import { useWallet } from '@solana/wallet-adapter-react'
interface TorqueOfferCardProps extends TorqueCampaign {
  claimOffer: (offerId: string) => void
  handleOpenClaimModal: (amount: string) => void
}

export default function TorqueOfferCard({
  claimOffer,
  name,
  description,
  offers,
  rewardTotal,
  rewardDenomination,
  numberOfConversions,
  maxParticipants,
  startTime,
  endTime,
  status,
  handleOpenClaimModal
}: TorqueOfferCardProps) {
  // State
  const [claiming, setClaiming] = useState<boolean>(false)
  const [showAdditionalOffers, setShowAdditionalOffers] = useState<boolean>(false)
  const explorerUrl = useAppStore((s) => s.explorerUrl)
  const { wallet } = useWallet()

  const activeOffer = useMemo(() => {
    // A user should not be eligible for multiple active offers per campaign
    return offers.find((offer) => offer.status === 'ACTIVE')
  }, [offers])

  const pendingOrClaimedOffer = useMemo(() => {
    return offers.find((offer) => offer.status === 'PENDING' || offer.status === 'CLAIMED')
  }, [offers])

  const additionalOffers = useMemo(() => {
    return offers.filter((offer) => offer.id !== activeOffer?.id && offer.id !== pendingOrClaimedOffer?.id)
  }, [offers, activeOffer, pendingOrClaimedOffer])

  const handleClaim = async () => {
    if (!activeOffer?.id) {
      return
    }

    handleOpenClaimModal(`${activeOffer.rewardPerUser} ${rewardDenomination}`)

    setClaiming(true)
    await claimOffer(activeOffer.id)
    setClaiming(false)
  }

  const { borderColor, buttonText, buttonVariant } = useMemo(() => {
    switch (status) {
      case 'ACTIVE':
        return { borderColor: colors.primary, buttonText: 'Claim Reward', buttonVariant: 'solid' }
      case 'EXPIRED':
        return { borderColor: colors.semanticError, buttonText: 'Missed Reward', buttonVariant: 'danger' }
      case 'INELIGIBLE':
        return { borderColor: 'transparent', buttonText: "Didn't Qualify", buttonVariant: 'outline' }
      case 'PENDING':
        return {
          borderColor: 'transparent',
          buttonText: (
            <Flex align="center" gap={2}>
              <Spinner size="sm" />
              <Text>Processing Reward</Text>
            </Flex>
          ),
          buttonVariant: 'outline'
        }
      default:
        return { borderColor: 'transparent', buttonText: 'Claimed', buttonVariant: 'outline' }
    }
  }, [status])

  const rewardPerUser = activeOffer?.rewardPerUser ?? pendingOrClaimedOffer?.rewardPerUser
  const distributor = activeOffer?.distributor ?? pendingOrClaimedOffer?.distributor

  return (
    <HStack w="full" spacing={4} p={3} borderRadius="md" bg={colors.backgroundDark} border={'solid 1px'} borderColor={borderColor}>
      <VStack align="flex-start" spacing={3} flex={1} w="full">
        <HStack gap={3} w="full">
          <Flex w={12} h={12} sx={{ aspectRatio: '1/1' }} justify="center" align="center" bg={colors.backgroundMedium} borderRadius="md">
            <GiftIcon color={colors.textPrimary} width={16} height={16} />
          </Flex>
          <Stack align="flex-start" spacing={1} w="full">
            <HStack alignItems="center" justifyContent={'space-between'} w="full">
              <Heading as="h3" fontSize="sm" overflow="hidden">
                {name}
              </Heading>
              <Tooltip label="The amount of rewards available in the pool.">
                <Badge variant="crooked">
                  {displayNumber(rewardTotal)} {rewardDenomination}
                </Badge>
              </Tooltip>
            </HStack>
            <HStack gap={1} alignItems="center">
              <ClockIcon h={'12px'} w={'12px'} color={colors.textTertiary} />
              <Text fontSize="xs" w="full" color={colors.textTertiary}>
                {startTime.format('MMM D, YYYY')} - {endTime.format('MMM D, YYYY')}
              </Text>
            </HStack>
            <Text fontSize="xs" w="full" noOfLines={2} color={colors.textTertiary}>
              {description}
            </Text>
          </Stack>
        </HStack>

        <VStack bg={colors.backgroundMedium} borderRadius="md" p={2} w="full" gap={2}>
          <HStack w="full" gap={2} justify="space-between">
            <Text fontSize="sm">Claimed</Text>
            <Text fontSize="sm">{numberOfConversions}</Text>
          </HStack>
          {rewardPerUser ? (
            <HStack w="full" gap={2} justify="space-between">
              <Text fontSize="sm">Your Reward</Text>
              <Text fontSize="sm">
                {displayNumber(rewardPerUser)} {rewardDenomination}
              </Text>
            </HStack>
          ) : null}
          {distributor ? (
            <HStack w="full" gap={2} justify="space-between">
              <Text fontSize="sm">Reward Pool</Text>
              <Link href={`${explorerUrl}/address/${distributor}`} target="_blank" rel="noopener noreferrer">
                <Button size="xs" variant="outline">
                  View
                </Button>
              </Link>
            </HStack>
          ) : null}
          {/* We only want to show the additional distributors if an active / claimed distributor is not present */}
          {!distributor && additionalOffers.length > 1 ? (
            <>
              <HStack w="full" gap={2} justify="space-between">
                <Text fontSize="sm">Reward Pools</Text>
                <Button size="xs" variant="outline" onClick={() => setShowAdditionalOffers(!showAdditionalOffers)}>
                  {showAdditionalOffers ? 'Hide' : 'Show'}
                </Button>
              </HStack>
              {showAdditionalOffers
                ? additionalOffers.map((offer) => (
                    <HStack w="full" gap={2} justify="space-between" key={offer.id}>
                      <Text fontSize="sm">{offer.name}</Text>
                      <Link href={`${explorerUrl}/address/${offer.distributor}`} target="_blank" rel="noopener noreferrer">
                        <Button size="xs" variant="outline">
                          View
                        </Button>
                      </Link>
                    </HStack>
                  ))
                : null}
            </>
          ) : null}
        </VStack>

        <HStack w="full" gap={2}>
          <Button size="sm" w="full" isDisabled={status !== 'ACTIVE'} variant={buttonVariant} isLoading={claiming} onClick={handleClaim}>
            {buttonText}
          </Button>

          {pendingOrClaimedOffer?.txSignature ? (
            <Link href={`${explorerUrl}/tx/${pendingOrClaimedOffer.txSignature}`} target="_blank" rel="noopener noreferrer">
              <Button size="sm" variant="outline">
                View Tx
              </Button>
            </Link>
          ) : null}

          {pendingOrClaimedOffer?.rewardPerUser ? (
            <Link
              href={twitterShareUrl(
                `${pendingOrClaimedOffer.rewardPerUser} ${rewardDenomination}`,
                wallet?.adapter.publicKey?.toString() ?? ''
              )}
              target="_blank"
              rel="noopener noreferrer"
            >
              <IconButton size="sm" minW={9} variant="outline" icon={<ShareIcon />} aria-label="Share transaction" />
            </Link>
          ) : null}
        </HStack>
      </VStack>
    </HStack>
  )
}

export function TorqueOfferCardSkeleton() {
  return (
    <VStack w="full" spacing={4} p={3} borderRadius="md" bg={colors.backgroundDark}>
      <HStack w="full" spacing={4}>
        <Skeleton w={12} h={12} sx={{ aspectRatio: '1/1' }} borderRadius="md" />
        <VStack w="full" align="flex-start">
          <HStack justifyContent={'space-between'} w="full">
            <Skeleton w="55%" h={5} />
            <Skeleton h={5} w={10} />
          </HStack>
          <SkeletonText w="full" noOfLines={2} />
        </VStack>
      </HStack>
      <VStack bg={colors.backgroundMedium} borderRadius="md" p={2} w="full" gap={2} align="flex-start">
        <HStack w="full" gap={2} justify="space-between">
          <Skeleton w="50%" h={5} />
          <Skeleton w="30%" h={5} />
        </HStack>
        <HStack w="full" gap={2} justify="space-between">
          <Skeleton w="65%" h={5} />
          <Skeleton w="20%" h={5} />
        </HStack>
      </VStack>
    </VStack>
  )
}

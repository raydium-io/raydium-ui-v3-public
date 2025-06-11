import {
  Button,
  Heading,
  HStack,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Modal,
  Stack,
  Text,
  VStack,
  ModalHeader,
  useColorMode
} from '@chakra-ui/react'
import { useMemo, useState } from 'react'
import TorqueOfferCard, { TorqueOfferCardSkeleton } from './TorqueOfferCard'
import { colors } from '@/theme/cssVariables'
import { TorqueCampaign } from '../types'
import HistoryIcon from '@/icons/misc/History'
import GiftIcon from '@/icons/misc/Gift'
import { useWallet } from '@solana/wallet-adapter-react'
import Image from 'next/image'
import { genericConfetti } from './TorqueConfetti'
import { twitterShareUrl } from '../utils'

interface TorqueClaimRewardsProps {
  claimOffer: (offerId: string) => void
  campaigns: TorqueCampaign[]
  loading: boolean
  error: string | null
}

export default function TorqueClaimRewards({ claimOffer, campaigns, loading, error }: TorqueClaimRewardsProps) {
  const { wallet } = useWallet()
  const [isClaimModalOpen, setIsClaimModalOpen] = useState<boolean>(false)
  const [shareAmount, setShareAmount] = useState<string>('')

  const { colorMode } = useColorMode()
  const isLight = colorMode === 'light'

  const activeCampaigns = useMemo(() => {
    return campaigns.filter((campaign) => campaign.offers.some((offer) => offer.status === 'ACTIVE'))
  }, [campaigns])

  const historicalCampaigns = useMemo(() => {
    return campaigns
      .filter((campaign) => !campaign.offers.some((offer) => offer.status === 'ACTIVE'))
      .sort((a, b) => {
        const aHasPending = a.offers.some((offer) => offer.status === 'PENDING')
        const bHasPending = b.offers.some((offer) => offer.status === 'PENDING')
        const aHasClaimed = a.offers.some((offer) => offer.status === 'CLAIMED')
        const bHasClaimed = b.offers.some((offer) => offer.status === 'CLAIMED')

        if (aHasPending && !bHasPending) return -1
        if (!aHasPending && bHasPending) return 1
        if (aHasClaimed && !bHasClaimed) return -1
        if (!aHasClaimed && bHasClaimed) return 1
        return b.endTime.diff(a.endTime)
      })
  }, [campaigns])

  const handleOpenClaimModal = (amount: string) => {
    setShareAmount(amount)
    setIsClaimModalOpen(true)
    genericConfetti()
  }

  if (loading) {
    return (
      <VStack gap={6} p={0} w="full">
        <TorqueClaimRewardsSkeleton />
      </VStack>
    )
  }

  if (error) {
    return (
      <VStack
        w="full"
        spacing={4}
        p={3}
        minH={24}
        borderRadius="md"
        bg={colors.backgroundDark}
        opacity={0.7}
        justify="center"
        align="center"
      >
        <Heading as="h3" fontSize="md">
          Unable to load rewards
        </Heading>
        <Text fontSize="sm" align="center">
          Looks like there was an error loading the rewards. Please try again later.
        </Text>
      </VStack>
    )
  }

  return (
    <>
      <VStack gap={6} p={0} w="full">
        <Section title="Ready to Claim" icon={<GiftIcon />}>
          {activeCampaigns.length > 0 ? (
            activeCampaigns.map((campaign) => (
              <TorqueOfferCard key={campaign.id} {...campaign} claimOffer={claimOffer} handleOpenClaimModal={handleOpenClaimModal} />
            ))
          ) : (
            <Stack
              w="full"
              spacing={4}
              p={3}
              minH={24}
              borderRadius="md"
              bg={colors.backgroundDark}
              opacity={0.7}
              justify="center"
              align="center"
            >
              <Text>
                {wallet?.adapter.publicKey ? "You don't have any available rewards." : 'Connect your wallet to view your rewards.'}
              </Text>
            </Stack>
          )}
        </Section>

        <Section title="History" icon={<HistoryIcon />}>
          {historicalCampaigns.length > 0 ? (
            historicalCampaigns.map((campaign) => (
              <TorqueOfferCard key={campaign.id} {...campaign} claimOffer={claimOffer} handleOpenClaimModal={handleOpenClaimModal} />
            ))
          ) : (
            <Stack
              w="full"
              spacing={4}
              p={3}
              minH={24}
              borderRadius="md"
              bg={colors.backgroundDark}
              opacity={0.7}
              justify="center"
              align="center"
            >
              <Text>
                {wallet?.adapter.publicKey
                  ? 'Looks like there are no historical rewards.'
                  : 'Connect your wallet to see historical rewards.'}
              </Text>
            </Stack>
          )}
        </Section>
      </VStack>
      {isClaimModalOpen && (
        <Modal
          isOpen={isClaimModalOpen}
          onClose={() => {
            setIsClaimModalOpen(false)
            setShareAmount('')
          }}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Hold Tight — Reward On The Way</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Stack justifyContent={'center'} alignItems={'center'} gap={4}>
                <Image alt="Share Reward" src="/images/reward-icon.jpg" width={300} height={300} style={{ borderRadius: '8px' }} />
                <Text textAlign={'center'}>
                  Your reward&apos;s en route. While the system does it&apos;s magic, share your referral link on X for more chances to earn
                  rewards!
                </Text>
                <HStack w="full" gap={2} justifyContent={'center'}>
                  <Button
                    size="md"
                    w="full"
                    flex={2}
                    background={
                      isLight
                        ? 'linear-gradient(245.22deg, #DA2EEF 7.97%, #2B6AFF 49.17%, #39D0D8 92.1%)'
                        : 'linear-gradient(245.22deg, #FF2FC8 7.97%, #FFB12B 49.17%, #D3D839 92.1%)'
                    }
                    _hover={{
                      background: isLight
                        ? 'linear-gradient(245.22deg, #DA2EEF 7.97%, #2B6AFF 49.17%, #39D0D8 92.1%)'
                        : 'linear-gradient(245.22deg, #FF2FC8 7.97%, #FFB12B 49.17%, #D3D839 92.1%)'
                    }}
                    onClick={() => {
                      const url = twitterShareUrl(shareAmount, wallet?.adapter.publicKey?.toString() ?? '')
                      window.open(url, '_blank')
                    }}
                  >
                    Share to Earn
                  </Button>
                </HStack>
              </Stack>
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
    </>
  )
}

function Section({ children, title, icon }: { children: React.ReactNode; title: string; icon: React.ReactNode }) {
  return (
    <VStack gap={2} p={0} w="full" align="flex-start">
      <HStack gap={2} justifyContent={'flex-start'} alignItems={'center'}>
        {icon}
        <Heading as="h3" fontSize="md" alignSelf="flex-start">
          {title}
        </Heading>
      </HStack>
      {children}
    </VStack>
  )
}

function TorqueClaimRewardsSkeleton() {
  return (
    <VStack gap={6} p={0} w="full">
      <Section title="Ready to Claim" icon={<GiftIcon color={colors.textSecondary} />}>
        <TorqueOfferCardSkeleton />
        <TorqueOfferCardSkeleton />
      </Section>

      <Section title="History" icon={<HistoryIcon color={colors.textSecondary} />}>
        <TorqueOfferCardSkeleton />
        <TorqueOfferCardSkeleton />
        <TorqueOfferCardSkeleton />
      </Section>
    </VStack>
  )
}

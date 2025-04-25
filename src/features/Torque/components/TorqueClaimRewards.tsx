import { Flex, Heading, HStack, Stack, Text, VStack } from '@chakra-ui/react'
import { useMemo } from 'react'
import TorqueOfferCard from './TorqueOfferCard'
import { colors } from '@/theme/cssVariables'
import { TorqueOffer } from '../types'
import HistoryIcon from '@/icons/misc/History'
import GiftIcon from '@/icons/misc/Gift'
interface Props {
  offers: TorqueOffer[]
  claimOffer: (offerId: string) => void
}

export default function TorqueClaimRewards({ offers, claimOffer }: Props) {
  const claimableOffers = useMemo(() => {
    return offers
      .filter((offer) => offer.status === 'ACTIVE' && offer.eligible)
      .map((offer) => ({
        ...offer,
        icon: (
          <Flex w={12} h={12} sx={{ aspectRatio: '1/1' }} justify="center" align="center" bg={colors.backgroundMedium} borderRadius="md">
            <GiftIcon color={colors.textPrimary} width={16} height={16} />
          </Flex>
        )
      }))
  }, [offers])

  const historicalOffers = useMemo(() => {
    return offers
      .filter((offer) => offer.status !== 'ACTIVE')
      .map((offer) => ({
        ...offer,
        icon: (
          <Flex w={12} h={12} sx={{ aspectRatio: '1/1' }} justify="center" align="center" bg={colors.backgroundMedium} borderRadius="md">
            <GiftIcon color={colors.textPrimary} width={16} height={16} />
          </Flex>
        )
      }))
  }, [offers])

  return (
    <VStack gap={6} p={0} w="full">
      <Section title="Ready to Claim" icon={<GiftIcon color={colors.textSecondary} />}>
        {claimableOffers.length > 0 ? (
          claimableOffers.map((offer) => <TorqueOfferCard key={offer.id} {...offer} claimOffer={claimOffer} />)
        ) : (
          <Stack
            w="full"
            spacing={4}
            p={3}
            minH={24}
            borderRadius="md"
            bg={colors.backgroundDark}
            opacity={0.5}
            justify="center"
            align="center"
          >
            <Text>You don&apos;t have any available rewards.</Text>
          </Stack>
        )}
      </Section>

      {historicalOffers && historicalOffers.length > 0 ? (
        <Section title="History" icon={<HistoryIcon color={colors.textSecondary} />}>
          {historicalOffers.map((offer) => (
            <TorqueOfferCard key={offer.id} {...offer} claimOffer={claimOffer} />
          ))}
        </Section>
      ) : null}
    </VStack>
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

import { VStack, Text, Heading, HStack, Button, Image, Stack, Badge, Flex, Spinner } from '@chakra-ui/react'
import { colors } from '@/theme/cssVariables'
import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useAppStore } from '@/store'
import { TorqueOffer } from '../types'
import Tooltip from '@/components/Tooltip'
import ClockIcon from '@/icons/misc/Clock'
interface TorqueOfferCardProps extends TorqueOffer {
  claimOffer: (offerId: string) => void
  icon?: React.ReactNode
}

export default function TorqueOfferCard({
  claimOffer,
  id,
  name,
  description,
  status,
  startTime,
  endTime,
  txSignature,
  distributor,
  rewardPerUser,
  rewardTotal,
  numberOfParticipants,
  maxParticipants,
  icon,
  image
}: TorqueOfferCardProps) {
  const [claiming, setClaiming] = useState<boolean>(false)

  const explorerUrl = useAppStore((s) => s.explorerUrl)

  const handleClaim = async () => {
    setClaiming(true)
    await claimOffer(id)
    setClaiming(false)
  }

  const { borderColor, buttonText, showReward, buttonVariant } = useMemo(() => {
    switch (status) {
      case 'ACTIVE':
        return { borderColor: colors.primary, buttonText: 'Claim Reward', showReward: true, buttonVariant: 'solid' }
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
        return { borderColor: 'transparent', buttonText: 'Claimed', showReward: false, buttonVariant: 'outline' }
    }
  }, [status])

  return (
    <HStack w="full" spacing={4} p={3} borderRadius="md" bg={colors.backgroundDark} border={'solid 1px'} borderColor={borderColor}>
      <VStack align="flex-start" spacing={3} flex={1} w="full">
        <HStack gap={3} w="full">
          {icon ? icon : <Image src={image ?? '/images/reward-icon.png'} alt="Reward Icon" w={12} h={12} />}
          <Stack align="flex-start" spacing={1} w="full">
            <HStack alignItems="center" justifyContent={'space-between'} w="full">
              <Heading as="h3" fontSize="sm" overflow="hidden">
                {name}
              </Heading>
              <Tooltip label="The amount of rewards available in the pool.">
                <Badge variant="crooked">{rewardTotal}</Badge>
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
            <Text fontSize="sm">Participants</Text>
            <Text fontSize="sm">
              {typeof maxParticipants === 'number' ? `${numberOfParticipants} / ${maxParticipants}` : numberOfParticipants}
            </Text>
          </HStack>
          {showReward ? (
            <HStack w="full" gap={2} justify="space-between">
              <Text fontSize="sm">Your Reward</Text>
              <Text fontSize="sm">{rewardPerUser}</Text>
            </HStack>
          ) : null}
          <HStack w="full" gap={2} justify="space-between">
            <Text fontSize="sm">Reward Pool</Text>
            <Link href={`${explorerUrl}/address/${distributor}`} target="_blank" rel="noopener noreferrer">
              <Button size="xs" variant="outline">
                View
              </Button>
            </Link>
          </HStack>
        </VStack>

        <HStack w="full" gap={2}>
          <Button size="sm" w="full" isDisabled={status !== 'ACTIVE'} variant={buttonVariant} isLoading={claiming} onClick={handleClaim}>
            {buttonText}
          </Button>

          {txSignature ? (
            <Link href={`${explorerUrl}/tx/${txSignature}`} target="_blank" rel="noopener noreferrer">
              <Button size="sm" variant="outline">
                View Tx
              </Button>
            </Link>
          ) : null}
        </HStack>
      </VStack>
    </HStack>
  )
}

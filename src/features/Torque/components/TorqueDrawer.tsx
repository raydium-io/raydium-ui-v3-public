import {
  DrawerContent,
  DrawerOverlay,
  Text,
  Drawer,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Flex,
  Box,
  VStack,
  Spinner,
  Heading,
  HStack
} from '@chakra-ui/react'
import TorqueLogo from './TorqueLogo'
import { useState } from 'react'
import Tabs from '@/components/Tabs'
import TorqueClaimRewards from './TorqueClaimRewards'
import Link from 'next/link'
import { colors } from '@/theme/cssVariables'
import GiftIcon from '@/icons/misc/Gift'
import ZapIcon from '@/icons/misc/Zap'
import { TorqueOffer } from '../types'
import TorqueComingSoon from './TorqueComingSoon'
interface Props {
  isOpen: boolean
  onClose: () => void
  offers: TorqueOffer[]
  handleClaimOffer: (offerId: string) => void
  loading: boolean
  error: string | null
}

const TABS = ['Claim', 'Redacted'] as const
type TabEnum = typeof TABS[number]

export default function TorqueDrawer({ isOpen, onClose, offers, handleClaimOffer, loading, error }: Props) {
  const [selectedTab, setSelectedTab] = useState<TabEnum>('Claim')

  if (loading) {
    return (
      <Wrapper isOpen={isOpen} onClose={onClose} setSelectedTab={setSelectedTab} selectedTab={selectedTab}>
        <VStack
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
          <Heading as="h3" fontSize="md">
            Preparing your rewards...
          </Heading>
          <Spinner />
        </VStack>
      </Wrapper>
    )
  }

  if (error) {
    return (
      <Wrapper isOpen={isOpen} onClose={onClose} setSelectedTab={setSelectedTab} selectedTab={selectedTab}>
        <VStack
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
          <Heading as="h3" fontSize="md">
            Unable to load rewards
          </Heading>
          <Text fontSize="sm" align="center">
            Looks like there was an error loading your rewards. Please try again later.
          </Text>
        </VStack>
      </Wrapper>
    )
  }
  return (
    <Wrapper isOpen={isOpen} onClose={onClose} setSelectedTab={setSelectedTab} selectedTab={selectedTab}>
      {selectedTab === 'Claim' && <TorqueClaimRewards offers={offers} claimOffer={handleClaimOffer} />}
      {selectedTab === 'Redacted' && <TorqueComingSoon />}
    </Wrapper>
  )
}

function Wrapper({
  children,
  isOpen,
  onClose,
  setSelectedTab,
  selectedTab
}: {
  children: React.ReactNode
  isOpen: boolean
  onClose: () => void
  setSelectedTab: (tab: TabEnum) => void
  selectedTab: TabEnum
}) {
  return (
    <Drawer variant="flatScreenEdgePanel" size="sm" isOpen={isOpen} onClose={onClose} trapFocus={false}>
      <DrawerOverlay />
      <DrawerContent pt={1}>
        {/* Drawer header */}
        <DrawerCloseButton top={['16px', '20px']} />
        <DrawerHeader>Rewards</DrawerHeader>

        {/* Drawer body */}
        <DrawerBody pt={[2, 2, 3, 3]}>
          <VStack gap={6} p={0} w="full" align="flex-start">
            <Tabs
              items={TABS}
              onChange={(value) => setSelectedTab(value as TabEnum)}
              variant="square"
              value={selectedTab}
              renderItem={(item) => (
                <HStack gap={1}>
                  {item === 'Claim' && <GiftIcon />}
                  {item === 'Active' && <ZapIcon />}
                  <Text>{item}</Text>
                </HStack>
              )}
            />
            {children}
          </VStack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  )
}

import { Badge, Box, useDisclosure } from '@chakra-ui/react'

import Button from '@/components/Button'
import { useWallet } from '@solana/wallet-adapter-react'
import TorqueDrawer from './TorqueDrawer'
import { useTorqueData } from '../hooks/useTorqueData'

export default function TorqueButton() {
  const { wallet } = useWallet()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { offers, handleClaimOffer, loading, error, activeOffersCount } = useTorqueData({ wallet })

  return (
    <>
      <Button variant="ghost" onClick={onOpen} display="flex" alignItems="center" gap={2}>
        <Box as="span" bgGradient="linear-gradient(245.22deg, #FF2FC8 7.97%, #FFB12B 49.17%, #D3D839 92.1%)" bgClip="text">
          Rewards
        </Box>
        {activeOffersCount > 0 && <Badge variant="crooked">{activeOffersCount}</Badge>}
      </Button>

      {isOpen && (
        <TorqueDrawer
          isOpen={isOpen}
          onClose={onClose}
          offers={offers}
          handleClaimOffer={handleClaimOffer}
          loading={loading}
          error={error}
        />
      )}
    </>
  )
}

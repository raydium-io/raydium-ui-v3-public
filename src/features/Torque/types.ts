import { PublicKey } from '@solana/web3.js'
import { Dayjs } from 'dayjs'

export type TorqueConversion = {
  id: string
  convertedAt: string
  createdAt: string
  updatedAt: string
  offer: {
    id: string
    projectId: string
  }
  cranks: TorqueCrank[]
}

type TorqueCrank = {
  id: string
  status: 'DONE' | 'PENDING' | 'FAILED' | 'STAGED'
  sequenceNumber: number
  transaction: string
  webhookId: string | null
  allocation: {
    input: number
    output: number
  }
  isAsymmetricPayout: boolean
  createdAt: string
  updatedAt: string
  distributorId: string
}

export type TorqueRawOffer = {
  id: string
  status: 'ACTIVE' | 'COMPLETED'
  startTime: string
  endTime: string
  eligible: boolean
  numberOfConversions: number
  metadata: {
    title: string
    description: string
  }
  distributors: TorqueDistributor[]
}

type TorqueDistributor = {
  pubkey: string
  status: 'DRAFT' | 'ACTIVE' | 'CLOSED'
  crankerStatus: 'IDLE' | 'CRANKING' | 'CRANKED'
  type: 'CONVERSION'
  emissionType: 'SOL' | 'TOKENS' | 'NFT' | 'POINTS'
  tokenAddress?: string
  tokenDecimals?: number
  totalFundAmount: number
  crankGuard: {
    id: string
    recipient: 'USER' | 'PUBLISHER' | 'BOTH' | 'NONE'
    activation: {
      type: 'OFFER_START' | 'OFFER_END'
      requiredConversionCount: number
    }
    availability: {
      maxConversionsPerRecipient: number
      maxTotalConversions: number
    }
  }
  distributionFunction: {
    id: string
    type: 'CONSTANT' | 'LINEAR' | 'EXPONENTIAL' | 'STEP'
    yIntercept: number
    trend: 'NEGATIVE' | 'POSITIVE' | null
    slope: number | null
    curveDepth: number | null
    curveWidth: number | null
  }
}

export type TorqueOffer = {
  id: string
  name: string
  description: string
  image?: string
  status: 'ACTIVE' | 'CLAIMED' | 'PENDING' | 'EXPIRED' | 'INELIGIBLE'
  startTime: Dayjs
  endTime: Dayjs
  eligible: boolean
  rewardPerUser: string
  rewardTotal: string
  numberOfParticipants: number
  maxParticipants?: number
  txSignature?: string
  distributor?: PublicKey
}

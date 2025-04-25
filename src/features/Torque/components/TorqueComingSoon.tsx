import { Heading, Stack, Text, Image } from '@chakra-ui/react'
import { colors } from '@/theme/cssVariables'
import RaydiumLogo from '@/icons/RaydiumLogo'

export default function TorqueComingSoon() {
  return (
    <Stack w="full" h="full" justify={'center'} align={'center'} position={'relative'}>
      <Image src="/images/torque-coming-soon.png" alt="Torque Coming Soon" w={'full'} />
      <Stack
        position={'absolute'}
        top={'20%'}
        left={'50%'}
        transform={'translate(-50%, -50%)'}
        w="full"
        p={3}
        minH={24}
        borderRadius="md"
        bg={colors.backgroundDark}
        justify="center"
        align="center"
      >
        <RaydiumLogo />
        <Heading as="h3" fontSize="md" mt={2}>
          Coming Soon!
        </Heading>
        <Text fontSize="sm" align="center">
          This is only the beginning, check back soon for more rewards!
        </Text>
      </Stack>
    </Stack>
  )
}

{
  /*  */
}

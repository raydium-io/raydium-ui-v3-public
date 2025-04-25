import { useDisclosure } from '@/hooks/useDelayDisclosure'
import RaydiumLogo from '@/icons/RaydiumLogo'
import RaydiumLogoOutline from '@/icons/RaydiumLogoOutline'
import ChevronDownIcon from '@/icons/misc/ChevronDownIcon'
import Gear from '@/icons/misc/Gear'
import { useAppStore } from '@/store'
import { colors } from '@/theme/cssVariables'
import { appLayoutPaddingX } from '@/theme/detailConfig'
import {
  Box,
  Flex,
  HStack,
  Menu,
  MenuButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  SystemStyleObject
} from '@chakra-ui/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { ReactNode, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Desktop, Mobile } from '../MobileDesktop'
import SolWallet from '../SolWallet'
import { MobileBottomNavbar } from './MobileBottomNavbar'
import { ColorThemeSettingField } from './components/ColorThemeSettingField'
import { DefaultExplorerSettingField } from './components/DefaultExplorerSettingField'
import { LanguageSettingField } from './components/LanguageSettingField'
import { NavMoreButtonMenuPanel } from './components/NavMoreButtonMenuPanel'
import { RPCConnectionSettingField } from './components/RPCConnectionSettingField'
import { Divider } from './components/SettingFieldDivider'
import { SlippageToleranceSettingField } from './components/SlippageToleranceSettingField'
import { VersionedTransactionSettingField } from './components/VersionedTransactionSettingField'
import { PriorityButton } from './components/PriorityButton'
import DisclaimerModal from './components/DisclaimerModal'
import AppVersion from './AppVersion'
import TagNewIcon from '@/icons/misc/TagNewIcon'
import { useReferrerQuery } from '@/features/Launchpad/utils'
import { TorqueButton } from '@/features/Torque'

export interface NavSettings {
  // colorTheme: 'dark' | 'light'
}

function AppNavLayout({
  children,
  overflowHidden
}: {
  children: ReactNode
  /** use screen height */
  overflowHidden?: boolean
}) {
  const { t } = useTranslation()
  const { pathname } = useRouter()
  const queryReferrer = useReferrerQuery('?')

  return (
    <Flex direction="column" id="app-layout" height="full" overflow={overflowHidden ? 'hidden' : 'auto'}>
      <HStack
        className="navbar"
        flex="none"
        height={['64px', '80px']}
        px={['20px', 0, '38px']}
        gap={['4px', 0, 0, 'max(64px, 6.1vw)']}
        alignItems="center"
        justifyContent="space-between"
      >
        {/* logo */}
        <Desktop>
          <Box flex={'none'}>
            <Link href="/swap">
              <RaydiumLogo />
            </Link>
          </Box>
        </Desktop>
        <Mobile>
          <HStack>
            <RaydiumLogoOutline />
            <Text fontSize="xl" fontWeight="medium" color={colors.textSecondary}>
              {pathname === '/swap'
                ? t('swap.title')
                : pathname === '/liquidity-pools'
                ? t('liquidity.title')
                : pathname === '/portfolio'
                ? t('portfolio.title')
                : pathname === '/playground'
                ? t('common.playground')
                : pathname === '/staking'
                ? t('staking.title')
                : pathname === '/bridge'
                ? t('bridge.title')
                : ''}
            </Text>
          </HStack>
        </Mobile>

        {/* nav routes */}
        <Desktop>
          <HStack flexGrow={1} justify="start" overflow={['auto', 'visible']} gap={[15, 0, 15]}>
            <RouteLink href="/swap" isActive={pathname === '/swap'} title={t('swap.title')} />
            <RouteLink href="/liquidity-pools" isActive={pathname.includes('/liquidity')} title={t('liquidity.title')} />
            <RouteLink href="/portfolio" isActive={pathname === '/portfolio'} title={t('portfolio.title')} />
            <RouteLink href="https://perps.raydium.io" isActive={false} title={t('perpetuals.title')} />
            <RouteLink
              href={`/launchpad${queryReferrer}`}
              isActive={pathname.includes('/launchpad')}
              title={
                <Box as="span" bgGradient="linear-gradient(245.22deg, #FF2FC8 7.97%, #FFB12B 49.17%, #D3D839 92.1%)" bgClip="text">
                  {t('launchpad.title')}
                </Box>
              }
              slotAfter={<TagNewIcon />}
              sx={{
                gap: '0.25rem'
              }}
            />
            <Menu size="lg">
              <MenuButton fontSize={'lg'} px={4} py={2}>
                <Flex
                  align="center"
                  gap={0.5}
                  color={pathname === '/staking' || pathname === '/bridge' ? colors.textSecondary : colors.textTertiary}
                >
                  {pathname === '/staking' ? t('staking.title') : pathname === '/bridge' ? t('bridge.title') : t('common.more')}
                  <ChevronDownIcon width={16} height={16} />
                </Flex>
              </MenuButton>
              <NavMoreButtonMenuPanel />
            </Menu>
          </HStack>
        </Desktop>

        {/* wallet button */}
        <Flex gap={[0.5, 2]} align="center">
          <TorqueButton />
          <PriorityButton />
          <SettingsMenu />
          {/* <EVMWallet />  don't need currently yet*/}
          <SolWallet />
        </Flex>
      </HStack>

      <Box
        px={appLayoutPaddingX}
        pt={[0, 4]}
        flex={1}
        overflow={overflowHidden ? 'hidden' : 'auto'}
        display="flex"
        flexDirection="column"
        justifyItems={'flex-start'}
        sx={{
          scrollbarGutter: 'stable',
          contain: 'size',
          '& > *': {
            // for flex-col container
            flex: 'none'
          }
        }}
      >
        {children}
      </Box>
      <DisclaimerModal />
      <Mobile>
        <Box className="mobile_bottom_navbar" flex="none">
          <MobileBottomNavbar />
        </Box>
      </Mobile>
    </Flex>
  )
}

function RouteLink({
  href,
  isActive,
  title,
  external = false,
  sx,
  slotAfter
}: {
  href: string
  isActive: boolean
  title: string | React.ReactNode
  external?: boolean
  sx?: SystemStyleObject
  slotAfter?: ReactNode
}) {
  return (
    <Link
      href={href}
      shallow
      {...(external
        ? {
            target: '_blank',
            rel: 'noopener noreferrer'
          }
        : {})}
    >
      <Flex
        textColor={isActive ? colors.textSecondary : colors.textTertiary}
        fontSize={['md', 'md', 'lg']}
        px={4}
        py={2}
        rounded="xl"
        transition="200ms"
        _hover={{ bg: colors.backgroundLight, color: colors.textSecondary }}
        alignItems="center"
        sx={sx}
      >
        {title}
        {slotAfter}
      </Flex>
    </Link>
  )
}

function SettingsMenu() {
  const { isOpen, onClose, onOpen } = useDisclosure()
  const triggerRef = useRef<HTMLDivElement>(null)
  return (
    <>
      <Box
        w={10}
        h={10}
        p="0"
        onClick={() => onOpen()}
        _hover={{ bg: colors.backgroundLight }}
        rounded="full"
        display="grid"
        placeContent="center"
        cursor="pointer"
        ref={triggerRef}
      >
        <Gear />
      </Box>
      <SettingsMenuModalContent isOpen={isOpen} onClose={onClose} triggerRef={triggerRef} />
    </>
  )
}

function SettingsMenuModalContent(props: { isOpen: boolean; triggerRef: React.RefObject<HTMLDivElement>; onClose: () => void }) {
  const contentRef = useRef<HTMLDivElement>(null)
  const { t } = useTranslation()
  const triggerPanelGap = 8
  const isMobile = useAppStore((s) => s.isMobile)
  const getTriggerRect = () => props.triggerRef.current?.getBoundingClientRect()

  return (
    <Modal size={'lg'} isOpen={props.isOpen} onClose={props.onClose}>
      <ModalOverlay />
      <ModalContent
        css={{
          transform: (() => {
            const triggerRect = getTriggerRect()
            return (
              triggerRect
                ? `translate(${isMobile ? 0 : -(window.innerWidth - triggerRect.right)}px, ${
                    triggerRect.bottom + triggerPanelGap
                  }px) !important`
                : undefined
            ) as string | undefined
          })()
        }}
        ref={contentRef}
        marginTop={0}
        marginRight={['auto', 0]}
      >
        <ModalHeader>{t('setting_board.panel_title')}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <SlippageToleranceSettingField />
          <Divider />
          <SlippageToleranceSettingField variant="liquidity" />
          <Divider />
          <VersionedTransactionSettingField />
          <Divider />
          <DefaultExplorerSettingField />
          <Divider />
          <LanguageSettingField />
          <Divider />
          <ColorThemeSettingField />
          <Divider />
          <RPCConnectionSettingField />
          <Divider />
          <AppVersion />
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default AppNavLayout

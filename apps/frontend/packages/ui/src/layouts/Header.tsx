import { ThemeToggle } from '../theme';
import React, { useState } from 'react';
import {
  TooltipGroup,
  XGroup,
  XStack,
  YStack,
  isClient,
  Image,
} from 'tamagui';
import { ColorToggleButton } from '../theme';
import { HeaderMenu } from 'app/bundles/custom/header/HeaderMenu';
import { useThemeSetting } from '@tamagui/next-theme';
import { useRouter } from 'next/router';
import { config } from 'app/config';
import { HeaderMenuContent, TwoFactorAuthDialog } from 'app/bundles/custom/header/HeaderMenuContent';

export type HeaderProps = {
  floating?: boolean
  disableNew?: boolean
  showExtra?: boolean
  forceShowAllLinks?: boolean
  minimal?: boolean
  showAuth?: boolean,
  disableLogo?: boolean
  disableMenu?: boolean
}

export function CustomHeader(props: any) {
  const isFullWidth = props?.fullWidth ?? true;
  const [isScrolled, setIsScrolled] = React.useState(false)

  if (isClient) {
    React.useEffect(() => {
      const onScroll = () => {
        setIsScrolled(window.scrollY > 50)
      }
      window.addEventListener('scroll', onScroll, { passive: true })
      return () => {
        window.removeEventListener('scroll', onScroll)
      }
    }, [])
  }

  return (
    <>
      <XStack
        pos="fixed"
        top={0}
        left={0}
        right={0}
        ai="center"
        jc="center"
        zi={50000}
        $gtXs={{ px: '$4' }}
        height={60}
      >
        <XStack f={1} height={'100%'} width="100%" maw={isFullWidth ? '100%' : 1120} pos="relative" >
          <XStack
            className="ease-out all ms200"
            bbc="$borderColor"
            py="$2"
            ov="hidden"
            contain="paint"
            width="100%"
            bw={1}
            br="$10"
            height={'100%'}
            transition="all 200ms ease-out"
            style={{
              backdropFilter: isScrolled ? 'blur(4px)' : 'none',
              backgroundColor: isScrolled
                ? 'rgba(255, 255, 255, 0.25)' // glass effect
                : 'transparent',
              borderColor: isScrolled ? 'rgba(0,0,0,0.1)' : 'transparent',
              boxShadow: isScrolled ? '0 2px 10px rgba(0,0,0,0.08)' : 'none',
            }}
            $sm={{
              br: 0,
              y: 0,
            }}
          >
            <YStack jc="center" $xs={{ px: "$3" }} w={'100%'} maxWidth={isFullWidth ? '100%' : 1120}>
              <HeaderContents isScrolled={isScrolled} floating {...props} />
            </YStack>
          </XStack>
        </XStack>
      </XStack >
    </>
  )
}

const tooltipDelay = { open: 500, close: 150 }

export const HeaderContents = React.memo(({ isScrolled, ...props }: { isScrolled: boolean } & HeaderProps) => {
  const theme = useThemeSetting();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [twoFactorDialogOpen, setTwoFactorDialogOpen] = useState(false);
  return (
    <>
      <XStack
        tag="header"
        ai="center"
        jc="space-between"
        pos="relative"
        zi={50000}
      >
        <XStack jc="center" ai="center" space="$4" $gtXs={{ pl: "12vw", pt: "$4" }}>
          {!props?.disableLogo && (
            <Image
              jc="center"
              $gtXs={{ mb: "$4" }}
              onPress={() => router.push('/')}
              cursor="pointer"
              resizeMethod="resize"
              source={{ width: 82, height: 16, uri: isScrolled ? '/logo/logo_light.png' : '/logo/logo_dark.png' }}
            />
          )}
          {
            config.enableThemeSwitch || config.enableTintSwitch
              ? <TooltipGroup delay={tooltipDelay}>
                <XGroup boc="$color2" bw={1} mah={32} bc="transparent" ai="center" size="$3">
                  <XGroup.Item>
                    {config?.enableThemeSwitch ? <ThemeToggle borderWidth={0} chromeless /> : null}
                  </XGroup.Item>
                  <XGroup.Item>
                    {config?.enableTintSwitch ? <ColorToggleButton borderWidth={0} chromeless /> : null}
                  </XGroup.Item>
                </XGroup>
              </TooltipGroup>
              : null
          }
        </XStack>
        {/*  prevent layout shift */}
        <XStack
          h={40}
          jc="flex-end"
          miw={160}
          $xs={{ miw: 130 }}
          pointerEvents="auto"
          tag="nav"
        >
          {!props.disableMenu && (<XStack ai="center" space="$3">
            <HeaderMenu open={open} setOpen={setOpen}>
              <HeaderMenuContent setOpen={setOpen} setTwoFactorDialogOpen={setTwoFactorDialogOpen} />
            </HeaderMenu>
          </XStack>
          )}
        </XStack>
      </XStack>
      <TwoFactorAuthDialog state={twoFactorDialogOpen} onClose={() => setTwoFactorDialogOpen(false)} />
    </>
  )
})


import { createTamagui } from 'tamagui'
import { createInterFont } from '@tamagui/font-inter'
import { shorthands } from '@tamagui/shorthands'
import { tokens } from '@tamagui/themes/v2'
import { themes } from '@tamagui/themes/v2-themes'
import { createMedia } from '@tamagui/react-native-media-driver'
import { animations } from '@my/ui/src/animations'

const headingFont = createInterFont({
  size: {
    6: 15,
  },
  transform: {
    6: 'uppercase',
    7: 'none',
  },
  weight: {
    6: '400',
    7: '700',
  },
  color: {
    6: '$colorFocus',
    7: '$color',
  },
  letterSpacing: {
    5: 2,
    6: 1,
    7: 0,
    8: -1,
    9: -2,
    10: -3,
    12: -4,
    14: -5,
    15: -6,
  },
  face: {
    100: { normal: 'Inter_Thin' },
    200: { normal: 'Inter_ExtraLight' },
    300: { normal: 'Inter_Light' },
    400: { normal: 'Inter_Regular' },
    500: { normal: 'Inter_Medium' },
    600: { normal: 'Inter_SemiBold' },
    700: { normal: 'Inter_Bold' }
  },
})

const bodyFont = createInterFont(
  {
    face: {
      100: { normal: 'Inter_Thin' },
      200: { normal: 'Inter_ExtraLight' },
      300: { normal: 'Inter_Light' },
      400: { normal: 'Inter_Regular' },
      500: { normal: 'Inter_Medium' },
      600: { normal: 'Inter_SemiBold' },
      700: { normal: 'Inter_Bold' }
    },
  },
  {
    sizeSize: (size) => Math.round(size * 1.1),
    sizeLineHeight: (size) => Math.round(size * 1.1 + (size > 20 ? 10 : 10)),
  }
)

export const config = createTamagui({
  defaultFont: 'body',
  animations,
  shouldAddPrefersColorThemes: true,
  themeClassNameOnRoot: true,

  // highly recommended to turn this on if you are using shorthands
  // to avoid having multiple valid style keys that do the same thing
  // we leave it off by default because it can be confusing as you onboard.
  onlyAllowShorthands: false,
  shorthands,

  fonts: {
    body: bodyFont,
    heading: headingFont,
  },
  settings: {
    allowedStyleValues: 'somewhat-strict',
  },
  themes: {
    ...themes,
    light: {
      ...themes?.light,
      background: '#f6f9fc',
      backgroundFocus: '#e7ecf1',
      backgroundHover: '#f0f4f8',
      backgroundPress: '#e9eef5',
      backgroundStrong: '#ffffff',
      backgroundTransparent: 'rgba(255, 255, 255, 0)',

      placeholderColor: '#727f96',
      outlineColor: '#635bff',

      shadowColor: 'rgba(0, 0, 0, 0.04)',
      shadowColorFocus: 'rgba(99, 91, 255, 0.4)',
      shadowColorHover: 'rgba(99, 91, 255, 0.3)',
      shadowColorPress: 'rgba(99, 91, 255, 0.2)',

      blue1: "hsl(248, 100%, 99.4%)",
      blue2: "hsl(248, 100%, 98.4%)",
      blue3: "hsl(248, 86.3%, 96.5%)",
      blue4: "hsl(248, 78.7%, 94.2%)",
      blue5: "hsl(248, 72.2%, 91.1%)",
      blue6: "hsl(248, 66.3%, 86.6%)",
      blue7: "hsl(248, 60.3%, 72.4%)",
      blue8: "hsl(248, 100%, 68%)",  // #635bff
      blue9: "hsl(248, 100%, 64%)",
      blue10: "hsl(248, 75%, 54%)",
      blue11: "hsl(248, 70%, 30%)",
      blue12: "hsl(0, 0%, 9%)",

    },
    light_blue: {
      ...themes?.light_blue,
      background: "hsl(248, 100%, 98.4%)",
      backgroundHover: "hsl(248, 86.3%, 96.5%)",
      backgroundPress: "hsl(248, 78.7%, 94.2%)",
      backgroundFocus: "hsl(248, 72.2%, 91.1%)",
      backgroundStrong: "hsl(248, 100%, 99.4%)",
      backgroundTransparent: "hsla(248, 100%, 99.4%, 0)",

      borderColor: "hsl(248, 78.7%, 94.2%)",
      borderColorHover: "hsl(248, 72.2%, 91.1%)",
      borderColorPress: "hsl(248, 78.7%, 94.2%)",
      borderColorFocus: "hsl(248, 78.7%, 94.2%)",

      color: "hsl(0, 0%, 9%)",

      color1: "hsl(248, 100%, 99.4%)",
      color2: "hsl(248, 100%, 98.4%)",
      color3: "hsl(248, 86.3%, 96.5%)",
      color4: "hsl(248, 78.7%, 94.2%)",
      color5: "hsl(248, 72.2%, 91.1%)",
      color6: "hsl(248, 66.3%, 86.6%)",
      color7: "hsl(248, 60.3%, 72.4%)",
      color8: "hsl(248, 100%, 68%)",  // #635bff
      color9: "hsl(248, 100%, 64%)",
      color10: "hsl(248, 75%, 54%)",
      color11: "hsl(248, 70%, 30%)",
      color12: "hsl(0, 0%, 9%)",

      colorHover: "hsl(248, 70%, 30%)",
      colorFocus: "hsl(248, 70%, 30%)",
      colorPress: "hsl(0, 0%, 9%)",
      colorTransparent: "hsla(248, 70%, 30%, 0)",

      outlineColor: "hsl(248, 72.2%, 91.1%)",
      placeholderColor: "hsl(248, 100%, 64%)"
    },
  },
  tokens,
  media: createMedia({
    xs: { maxWidth: 660 },
    sm: { maxWidth: 800 },
    md: { maxWidth: 1020 },
    lg: { maxWidth: 1280 },
    xl: { maxWidth: 1420 },
    xxl: { maxWidth: 1600 },
    gtXs: { minWidth: 660 + 1 },
    gtSm: { minWidth: 800 + 1 },
    gtMd: { minWidth: 1020 + 1 },
    gtLg: { minWidth: 1280 + 1 },
    short: { maxHeight: 820 },
    tall: { minHeight: 820 },
    hoverNone: { hover: 'none' },
    pointerCoarse: { pointer: 'coarse' },
  }),
})

// for the compiler to find it
export default config

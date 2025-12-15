import '@tamagui/core/reset.css'
import '@tamagui/font-inter/css/100.css'
import '@tamagui/font-inter/css/200.css'
import '@tamagui/font-inter/css/300.css'
import '@tamagui/font-inter/css/400.css'
import '@tamagui/font-inter/css/500.css'
import '@tamagui/font-inter/css/600.css'
import '@tamagui/font-inter/css/700.css'
import 'raf/polyfill'
import '../app.css'
import { NextThemeProvider, useRootTheme } from '@tamagui/next-theme'
import { Provider } from 'app/provider'
import Head from 'next/head'
import React, { useEffect } from 'react'
import type { SolitoAppProps } from 'solito'
import { config } from 'app/config';
import { config as faConfig } from '@fortawesome/fontawesome-svg-core';  // For chonky problems with icons and nextjs

faConfig.autoAddCss = false; // For chonky problems with icons and nextjs

if (process.env.NODE_ENV === 'production') {
  require('../public/tamagui.css')
}

function MyApp({ Component, pageProps }: SolitoAppProps) {

  return (
    <>
      <Head>
        <title>{config.companyName}</title>
        <meta name="description" content="Uncert project" />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ThemeProvider>
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  )
}

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useRootTheme()

  return (
    <NextThemeProvider
      defaultTheme={config?.defaultTheme}
      // WARNING: this forces theme 
      forcedTheme={!config?.enableThemeSwitch && config?.defaultTheme ? config?.defaultTheme : undefined}
      onChangeTheme={(next) => {
        setTheme(next as any)
      }}
    >
      <Provider disableRootThemeClass defaultTheme={(config as any)?.defaultTheme ?? theme}>
        {children}
      </Provider>
    </NextThemeProvider >
  )
}

export default MyApp

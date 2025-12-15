import { CustomFooter as Footer } from '../layouts/Footer'
import { CustomHeader as Header, HeaderProps } from '../layouts/Header'
import { ToastProvider, ToastViewport } from '@tamagui/toast'
import React from 'react'
import { CustomToast } from '../toast/CustomToast'

export const DefaultLayout = ({
  children,
  header,
  footer,
  headerProps,
}: {
  children: React.ReactNode
  header?: React.ReactNode,
  footer?: React.ReactNode,
  headerProps?: HeaderProps
}) => {
  return (
    <>
      <ToastProvider swipeDirection="horizontal">
        <CustomToast />
        {header ?? <Header {...headerProps} />}
        {children}
        {footer ?? <Footer />}
        <ToastViewport flexDirection="column-reverse" top="$2" left={0} right={0} />
        <ToastViewport
          multipleToasts
          name="viewport-multiple"
          flexDirection="column-reverse"
          top="$2"
          left={0}
          right={0}
        />
      </ToastProvider>
    </>
  )
}

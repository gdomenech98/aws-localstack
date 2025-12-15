import { useTint } from './tints/useTint'
import { memo, useMemo, useState } from 'react'
import { ThemeName, YStack, isClient, useDebounce } from 'tamagui'
import { useTintSectionIndex } from './containers/TintSection'

export const PageGlow = memo(() => {
  const { tints, tint, name, tintIndex } = useTint()
  const [index, setIndex] = useState(0)
  const [scrollTop, setScrollTopRaw] = useState(0)
  const setScrollTop = useDebounce(setScrollTopRaw, 200)
  const scale =  1

  if (isClient) {
    useTintSectionIndex((index) => {
      setIndex(index)
      const sy = document.documentElement?.scrollTop ?? 0
      setScrollTop(sy + 100)
    })
  }

  const glows = useMemo(() => {
    return (
      <>
        {tints.map((cur, i) => {
          const active = cur === tint
          return (
            <YStack
              key={`${cur}${i}`}
              overflow="hidden"
              h="100vh"
              w={1000}
              theme={cur as ThemeName}
              o={active ? 0.3 : 0}
              fullscreen
              left={`calc(50vw - 500px)`}
              x={0}
              scale={scale}
              className="hero-blur"
            />
          )
        })}
      </>
    )
  }, [scale, tint, tints])

  return (
    <YStack
      pos="absolute"
      t={0}
      l={0}
      contain="layout"
      pe="none"
      animation="quick"
      key={0}
      zi={-1}
      x={0}
      y={scrollTop}
      // display={isResizing ? 'none' : 'flex'}
    >
      {glows}
    </YStack>
  )
})

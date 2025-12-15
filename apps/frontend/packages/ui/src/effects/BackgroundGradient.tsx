import { YStack } from "tamagui"
import React from 'react'

export const BackgroundGradient = React.forwardRef(({ height = 521, o = 0.08, direction = "up", dots = false, ...props }: { direction: 'up' | 'down' | 'both' } & any, ref: any) => (
    <YStack
        ref={ref}
        className={`${(dots ? "bg-dot-grid" : "bg-grid")} ${"mask-gradient-" + direction}`}
        fullscreen
        // @ts-ignore
        top="auto"
        height={height}
        flex={1}
        //@ts-ignore
        pe="none"
        o={o}
        {...props}
    />
))

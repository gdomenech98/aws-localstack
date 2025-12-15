import { YStack } from "tamagui"

export const SpotLight = (props: any) => (
    <YStack
        o={0.75}
        pos="absolute"
        t={0}
        l={0}
        r={0}
        h={2000}
        className="hero-blur"
        {...props}
    />
)
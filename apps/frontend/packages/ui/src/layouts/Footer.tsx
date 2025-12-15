import { Caprasimo } from "next/font/google";
import { YStack, XStack, Text } from '@my/ui';

export const caprasimo = Caprasimo({ weight: '400', subsets: ["latin"] });

export const CustomFooter = () => {
  return (
    <YStack tag="footer" w="100%">
      <XStack gap="$3" bg="white" ai="center" pl="$4" pb="$6" $gtXs={{ pl: "14%", }} >
        <a href="https://uncert.es" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
          <img src="/logo/logo_light.png" style={{ height: 12, fontSize: 12, color: "var(--gray8)", cursor: 'pointer' }} />
        </a>
        <a href="/privacy"
          style={{
            textDecoration: 'none',
          }}>
          <Text
            color={"$gray8"}
            fontSize={11}

          >
            Política de Privacidad
          </Text>
        </a>
      </XStack>
    </YStack>
  )
}

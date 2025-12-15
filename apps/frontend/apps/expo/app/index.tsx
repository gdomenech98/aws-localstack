import { Button, Text, YStack } from '@my/ui'
import { useRouter } from 'expo-router'

const Screen = () => {
  const router = useRouter();
  return (
    <YStack pt="$6" px="$4" gap="$3">
      <Button onPress={() => router.push('/login')}>Go to login</Button>
      <Button onPress={() => router.push('/profile')}>Go to profile</Button>
      <Button onPress={() => router.push('/pushnotifications')}>Test Push Notifications</Button>
    </YStack>
  )
}

export default Screen;
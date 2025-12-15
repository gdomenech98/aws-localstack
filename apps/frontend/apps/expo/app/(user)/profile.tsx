import { Text, YStack } from '@my/ui'
import { useSessionStore } from 'app/native-bundles/auth/hooks/useSessionStore'
import { Stack } from 'expo-router'

const ProfileScreen = () => {
  const session = useSessionStore(s => s.session);
  return (
    <YStack px="$4">
      <Text fontSize={"$7"} fontWeight={"700"}>User Profile</Text>
      <Text fontSize={"$4"} mt="$4" fontWeight={"500"}>{"User email: " + session?.user?.id}</Text>
    </YStack>
  )
}

export default ProfileScreen;
import { YStack, XStack, Text } from "@my/ui";
import { LogOut } from "@tamagui/lucide-icons";
import { useSessionStore } from "app/native-bundles/auth/hooks/useSessionStore";
import { useRouter } from 'expo-router';

export const DrawerMenu = () => {
    const clearSession = useSessionStore(s => s.clearSession)
    const session = useSessionStore(s => s.session);
    const router = useRouter();

    const onLogout = async () => {
        await clearSession();
        router.push('/login');
    }

    return (
        <YStack py="$6" px="$4" f={1} >
            <YStack f={1}>
                <YStack>
                    <Text fontWeight={"600"} fontSize="$6">{session?.user?.id}</Text>
                </YStack>
            </YStack>
            <XStack gap="$2" onPress={onLogout}>
                <LogOut size={"$1"} />
                <Text fontSize="$2">Log out</Text>
            </XStack>
        </YStack>
    );
}
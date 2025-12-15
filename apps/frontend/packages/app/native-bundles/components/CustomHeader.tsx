import { ThemeTint, YStack } from "@my/ui"
import { Menu } from "@tamagui/lucide-icons"

export const CustomHeader = ({ navigation }) => {

    return <YStack m={"$2"}>
        <ThemeTint>
            <Menu onPress={() => navigation.toggleDrawer()} color={'$color8'} size={"$2"} />
        </ThemeTint>
    </YStack>
}

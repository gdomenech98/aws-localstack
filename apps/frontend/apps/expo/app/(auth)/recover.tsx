import { Eye, EyeOff } from '@tamagui/lucide-icons'
import { useState } from 'react'
import { AnimatePresence, Button, Paragraph, SizableText, Spinner, View } from 'tamagui'
import { NotifyError, ThemeTint, XStack, UiInput as Input, SectionTinted, YStack, useToastController, Image } from '@my/ui'
import { PasswordSchema } from 'app/bundles/auth/models/auth'
import { useRouter } from 'expo-router';
import { AuthApi } from 'app/bundles/auth/api/authApi'
import { z } from 'zod';
import { useColorScheme, } from 'react-native'

const RecoverScreen = () => {
    const [password, setPassword] = useState<string>('');
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [errors, setErrors] = useState<any>(undefined);
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();
    const toast = useToastController();
    const colorScheme = useColorScheme()

    const onRecover = async () => {
        setLoading(true);
        const RecoverSchema = z.object({ password: PasswordSchema });
        const validation = RecoverSchema.safeParse({ password })
        if (!validation?.success && validation?.error) {
            setErrors(validation);
        }
        else {
            // Recover token from query
            //@ts-ignore
            const recoverToken: string = router.query?.slug;
            const result = await AuthApi.recover(password, recoverToken);
            if (result?.error) {
                setErrors(result.error);
            }
            else {
                setErrors(undefined);
                toast.show("Successfully recovered your password", { message: "Try to sign in to check you can login with new credentials.", duration: 2000 })
                router.push('/login');
            }
        }
        setLoading(false)
    }


    return (
        <SectionTinted zi={2} width="100%" px="$4" maxWidth={400} alignSelf="center" py={0} f={1} gradient={true} br="$4">
            <View flexDirection="column" alignItems="stretch" gap="$6">
                <YStack jc="center" ai="center" mb="$8">
                    {
                        colorScheme == 'dark'
                            ? <Image resizeMethod='resize' source={{ width: 100, height: 120, uri: require('../../../next/public/logo/logo_dark.png') }} />
                            : <Image resizeMethod='resize' source={{ width: 100, height: 120, uri: require('../../../next/public/logo/logo_light.png') }} />
                    }
                </YStack>
                <SizableText alignSelf="center" size="$3">
                    Recover Password
                </SizableText>
                <View flexDirection="column" gap="$3" mb="$4">
                    {
                        errors ?
                            <NotifyError errors={errors} />
                            : null
                    }
                    <Input size="$4">
                        <Input.Label>Password</Input.Label>
                        <Input.Box>
                            <Input.Area
                                textContentType={"password"}
                                secureTextEntry={!showPassword}
                                id="password"
                                placeholder="Enter password"
                                onChangeText={(text) => setPassword(text)} />
                            <Input.Icon>
                                <View onPress={() => setShowPassword(!showPassword)} cursor="pointer" >
                                    {showPassword ? <Eye size={"$1"} /> : <EyeOff size={"$1"} />}
                                </View>
                            </Input.Icon>
                        </Input.Box>
                    </Input>
                </View>
                <Button
                    disabled={!password}
                    onPress={onRecover}
                    width="100%"
                    hoverStyle={{ backgroundColor: "$blue9" }}
                    pressStyle={{ backgroundColor: "$blue8" }}
                    opacity={!password ? 0.6 : 1}
                    iconAfter={
                        <AnimatePresence>
                            {loading && (
                                <Spinner
                                    color="$color"
                                    key="loading-spinner"
                                    opacity={1}
                                    scale={1}
                                    animation="quick"
                                    position="absolute"
                                    left="60%"
                                    enterStyle={{
                                        opacity: 0,
                                        scale: 0.5,
                                    }}
                                    exitStyle={{
                                        opacity: 0,
                                        scale: 0.5,
                                    }}
                                />
                            )}
                        </AnimatePresence>
                    }
                >
                    <Button.Text>Recover</Button.Text>
                </Button>
                <RecoverLink />
            </View>
        </SectionTinted>
    )
}

const RecoverLink = () => {
    const router = useRouter();
    return (
        <ThemeTint>
            <XStack jc="center" cursor='pointer' onPress={() => router.push("/login")}>
                <Paragraph fontSize={"$1"} fontWeight={'100'} ta="center" theme="alt2">
                    Have an account?{' '}
                    <SizableText fontWeight={'600'} fontSize={"$1"} theme="alt2">Sign in</SizableText>
                </Paragraph>
            </XStack>
        </ThemeTint>
    )
}

export default RecoverScreen;
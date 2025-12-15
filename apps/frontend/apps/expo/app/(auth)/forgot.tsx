import { useState } from 'react'
import { AnimatePresence, Button, Image, Paragraph, SizableText, Spinner, View } from 'tamagui'
import { ThemeTint, YStack, XStack, UiInput as Input, SectionTinted, NotifyError } from '@my/ui'
import { useRouter } from 'expo-router';
import { EmailSchema } from 'app/bundles/auth/models/auth';
import { AuthApi } from 'app/bundles/auth/api/authApi';
import { useToastController } from '@tamagui/toast'
import {
    useColorScheme,
} from 'react-native'

const ForgotScreen = () => {
    const [email, setEmail] = useState<string>('');
    const [errors, setErrors] = useState<any>(undefined);
    const [loading, setLoading] = useState<boolean>(false);
    const toast = useToastController()
    const colorScheme = useColorScheme()

    const onRecover = async () => {
        setLoading(true);
        const validation = EmailSchema.safeParse(email);
        if (!validation?.success && validation?.error) {
            setErrors(validation);
        }
        else {
            //AuthApi forgot -> email and validate it
            const result = await AuthApi.forgot(email);
            if (result?.error) {
                setErrors(result.error);
            }
            else {
                setErrors(undefined);
                toast.show("We have sent an email with the instructions to recover your password", {
                    message: 'Please check your inbox and follow the steps',
                })
            }
        }
        setLoading(false)
    }

    return (
        <SectionTinted zi={2} width="100%" py={0} f={1} px="$4" maxWidth={400} alignSelf="center" gradient={true} br="$4">
            <View flexDirection="column" alignItems="stretch" gap="$6">
                <YStack jc="center" ai="center" mb="$8">
                    {
                        colorScheme == 'dark'
                            ? <Image resizeMethod='resize' source={{ width: 100, height: 120, uri: require('../../../next/public/logo/logo_dark.png') }} />
                            : <Image resizeMethod='resize' source={{ width: 100, height: 80, uri: require('../../../next/public/logo/logo_light.png') }} />
                    }
                </YStack>
                <SizableText alignSelf="center" size="$3">
                    Forgot Password
                </SizableText>
                <View flexDirection="column" gap="$3" mb="$4">
                    {
                        errors ?
                            <NotifyError errors={errors} />
                            : null
                    }
                    <View flexDirection="column" gap="$1">
                        <Input size="$4">
                            <Input.Label>Email</Input.Label>
                            <Input.Box>
                                <Input.Area id="email" placeholder="email@example.com"
                                    onChangeText={(text) => setEmail(text)}
                                />
                            </Input.Box>
                        </Input>
                    </View>
                </View>
                <Button
                    disabled={!email}
                    onPress={onRecover}
                    width="100%"
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
                <SignInLink />
            </View>
        </SectionTinted>
    )
}

const SignInLink = () => {
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


export default ForgotScreen;

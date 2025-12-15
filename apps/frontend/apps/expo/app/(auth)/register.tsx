import { Eye, EyeOff } from '@tamagui/lucide-icons'
import { useEffect, useState } from 'react'
import { AnimatePresence, Button, Paragraph, SizableText, Spinner, View, Image } from 'tamagui'
import { NotifyError, ThemeTint, XStack, UiInput as Input, SectionTinted, YStack } from '@my/ui'
import { RegisterType, validateRegister } from 'app/bundles/auth/models/auth'
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Session, SessionDataType } from 'app/bundles/auth/models/session'
import { useSessionStore } from 'app/native-bundles/auth/hooks/useSessionStore'
import { AuthApi } from 'app/bundles/auth/api/authApi'
import { ErrorResponse } from 'app/bundles/lib/errorResponse'
import {
    useColorScheme,
} from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'

const RegisterScreen = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [errors, setErrors] = useState<any>(undefined);
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();
    const colorScheme = useColorScheme()
    const createSession = useSessionStore(state => state.createSession);

    const onSignUp = async () => {
        setLoading(true);
        const validation = validateRegister({ email, password } as RegisterType)
        if (!validation?.success && validation?.error) {
            setErrors(validation);
        }
        else {
            setErrors(undefined);
            const result = await AuthApi.register(email, password);
            if ((result as ErrorResponse)?.error) {
                setErrors(result?.error);
            }
            else {
                try {
                    const session = new Session(result as SessionDataType);
                    const sessionData: SessionDataType = session.getData();
                    if (sessionData.loggedIn) {
                        await createSession(sessionData);
                        const { return: returnUrl } = useLocalSearchParams();
                        //@ts-ignore
                        router.push(returnUrl ?? '/')
                    }
                } catch (e) {
                    console.log('Error loading session: ', e)
                    setErrors("Error creating session");
                }
            }
        }
        setLoading(false)
    }

    return (
        <SectionTinted zi={2}  width="100%" px="$4" py={0} f={1} maxWidth={400} alignSelf="center" gradient={true} br="$4">
            <View flexDirection="column" alignItems="stretch" gap="$6" >
                <YStack gap="$3">
                    <YStack jc="center" ai="center">
                        {
                            colorScheme == 'dark'
                                ? <Image resizeMethod='resize' source={{ width: 100, height: 120, uri: require('../../../next/public/logo/logo_dark.png') }} />
                                : <Image resizeMethod='resize' source={{ width: 100, height: 120, uri: require('../../../next/public/logo/logo_light.png') }} />
                        }
                    </YStack>
                    <SizableText alignSelf="center" size="$3">
                        Create account
                    </SizableText>
                    <View flexDirection="column" gap="$3" mb="$4" >
                        {
                            errors ?
                            null
                                // <NotifyError errors={errors} />
                                : null
                        }
                        <View flexDirection="column" gap="$1">
                            <Input size="$4">
                                <Input.Label>Email</Input.Label>
                                <Input.Box>
                                    <Input.Area id="email" placeholder="email@example.com"
                                        value={email}
                                        onChangeText={(text) => setEmail(text)} />
                                </Input.Box>
                            </Input>
                        </View>
                        <Input size="$4">
                            <Input.Label>Password</Input.Label>
                            <Input.Box>
                                <Input.Area
                                    // textContentType={"password"}
                                    secureTextEntry={!showPassword}
                                    id="password"
                                    placeholder="Enter password"
                                    onChangeText={(text) => setPassword(text)}
                                />
                                <Input.Icon>
                                    <View onPress={() => setShowPassword(!showPassword)} cursor="pointer" >
                                        {showPassword ? <Eye size={"$1"} /> : <EyeOff size={"$1"} />}
                                    </View>
                                </Input.Icon>
                            </Input.Box>
                        </Input>
                    </View>
                </YStack>
                <Button onPress={onSignUp} width="100%"
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
                    <Button.Text>Sign Up</Button.Text>
                </Button>
                {/* <SocialLogin /> */}
                <SignUpLink />
            </View>
        </SectionTinted>
    )
}

const SignUpLink = () => {
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

export default RegisterScreen;
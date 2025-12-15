import { Eye, EyeOff } from '@tamagui/lucide-icons'
import { useState } from 'react'
import { AnimatePresence, Button, Paragraph, SizableText, Spinner, View } from 'tamagui'
import { ThemeTint, YStack, XStack, UiInput as Input, SectionTinted, NotifyError } from '@my/ui'
import { router, useLocalSearchParams, useRouter } from 'expo-router';
import { LoginType, validateLogin } from 'app/bundles/auth/models/auth';
import { Session, SessionDataType } from 'app/bundles/auth/models/session';
import { AuthApi } from 'app/bundles/auth/api/authApi';
import { Image } from '@my/ui';
import { ErrorResponse } from 'app/bundles/lib/errorResponse';
import {
    useColorScheme,
} from 'react-native'
import { useSessionStore } from 'app/native-bundles/auth/hooks/useSessionStore';

const LoginScreen = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [errors, setErrors] = useState<any>(undefined);
    const [loading, setLoading] = useState<boolean>(false);
    const createSession = useSessionStore(state => state.createSession);
    const router = useRouter();
    const colorScheme = useColorScheme()

    const onSignIn = async () => {
        setLoading(true);
        const validation = validateLogin({ email, password } as LoginType);
        if (!validation?.success && validation?.error) {
            setErrors(validation);
        }
        else {
            setErrors(undefined);
            const result = await AuthApi.login(email, password);
            if ((result as ErrorResponse)?.error) {
                setErrors((result as ErrorResponse).error);
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
                    setErrors("Error logging in");
                }
            }
        }
        setLoading(false)
    }
    return (
        <SectionTinted zi={2} width="100%" maxWidth={400} py={0} f={1} alignSelf="center" px={"$4"} gradient={true} br="$4">
            <View flexDirection="column" alignItems="stretch" gap="$6">
                <YStack jc="center" ai="center">
                    {
                        colorScheme == 'dark'
                            ? <Image resizeMethod='resize' source={{ width: 100, height: 120, uri: require('../../../next/public/logo/logo_dark.png') }} />
                            : <Image resizeMethod='resize' source={{ width: 100, height: 120, uri: require('../../../next/public/logo/logo_light.png') }} />
                    }
                </YStack>
                <SizableText alignSelf="center" size="$3">
                    Sign in to your account
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
                    <View flexDirection="column" gap="$1">
                        <Input size="$4">
                            <View
                                flexDirection="row"
                                alignItems="center"
                                justifyContent="space-between"
                            >
                                <Input.Label>Password</Input.Label>
                            </View>
                            <Input.Box>
                                <Input.Area
                                    textContentType={"password"}
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
                            <ForgotPasswordLink />

                        </Input>
                    </View>
                </View>
                <Button
                    disabled={!email || !password}
                    onPress={onSignIn}
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
                    <Button.Text>Sign In</Button.Text>
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
            <XStack jc="center" cursor='pointer' onPress={() => router.push("/register")}>
                <Paragraph fontSize={"$1"} fontWeight={'100'} ta="center" theme="alt2">
                    Don't have an account?{' '}
                    <SizableText fontWeight={'600'} fontSize={"$1"} theme="alt2">Sign up</SizableText>
                </Paragraph>
            </XStack>
        </ThemeTint>
    )
}

const ForgotPasswordLink = (props) => {
    return (
        <XStack jc="flex-end">
            <Paragraph
                onPress={() => router.push('/forgot')}
                color="$color8"
                size="$1"
                marginTop="$1"
                {...props}
            >
                Forgot your password?
            </Paragraph>
        </XStack>
    )
}

export default LoginScreen;
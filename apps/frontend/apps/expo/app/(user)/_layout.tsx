import { View, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import {
    Platform,
    KeyboardAvoidingView, ScrollView,
} from 'react-native'
import { DefaultLayout, YStack } from '@my/ui'
import { useSessionStore } from 'app/native-bundles/auth/hooks/useSessionStore';
import { useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { DrawerMenu } from 'app/native-bundles/components/DrawerMenu';
import { CustomHeader } from 'app/native-bundles/components/CustomHeader';
import { Drawer } from 'expo-router/drawer';

export default function UserLayout() {
    const session = useSessionStore(s => s.session);
    const router = useRouter();
    const segments = useSegments();

    useEffect(() => {
        if (!session || !session.loggedIn) { // Screens grouped over (user) group need to be logged in user
            router.push('/login');
        };
    }, [])
    return (
        <View style={styles.container}>
            <DefaultLayout footer={<></>} header={<></>} headerProps={{ disableLogo: true }}>
                <KeyboardAvoidingView
                    style={{ flex: 1, margin: 0, padding: 0 }}
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                >
                    <ScrollView
                        contentContainerStyle={{ flexGrow: 1, }}
                        keyboardShouldPersistTaps="handled"
                    >
                        <Drawer
                            drawerContent={DrawerMenu}
                            screenOptions={({ route }) => ({
                                headerShown: segments[0] === '(auth)' ? false : true,
                                header: ({ navigation }) => <CustomHeader navigation={navigation} />
                            })} />
                    </ScrollView >
                </KeyboardAvoidingView >
            </DefaultLayout >
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

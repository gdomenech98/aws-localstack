import { View, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import {
  Platform, 
  KeyboardAvoidingView, ScrollView,
} from 'react-native'
import { DefaultLayout, ThemeTint, SpotLight, BackgroundGradient, YStack } from '@my/ui'

export default function AuthLayout() {

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
            <ThemeTint>
              <YStack f={1} overflow={'hidden'} jc="center">
                <SpotLight t={'20vh'} />
                <BackgroundGradient />
                <Stack screenOptions={{ headerShown: false }} />
              </YStack>
            </ThemeTint >
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

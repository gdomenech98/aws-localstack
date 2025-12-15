# DEVELOPMENT EMULATORS
Run iOS emulator (just for MAC): `cd services/frontend && yarn native` then press `s` and `i`
Run Android emulator: `cd services/frontend && yarn native` then press `s` and `a`
# ENVARS
You must define EXPO_PUBLIC_SERVER_URL to decide where is the backend server located. As default 'localhost' is the phone device that is running the expo app. You can declare public envars at .env file inside `services/frontend/apps/expo`

# EAS BUILD
Set up your first eas build by: `cd services/frontend/apps/expo && npx eas build`
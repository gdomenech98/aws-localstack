import { SizableText } from 'tamagui'
import { Text, YStack } from 'tamagui'
import { SectionTinted } from '../containers/TintSection'
import { getErrors } from './getErrors';
import { useThemeSetting } from '@tamagui/next-theme'


export const NotifyError = ({ errors }) => {
    const isZodError = errors?.hasOwnProperty("error")
    const formatedErrors = isZodError ? getErrors(errors) : errors;
    const themeSetting = useThemeSetting();
    const currentTheme = themeSetting.current;

    const getErrorMessage = () => {
        let message
        if (isZodError) {
            const field = Object.keys(formatedErrors)[0]
            message = `[${field}] ` + formatedErrors[field][0]
            if (message === "Required") {
                if (field && field !== "undefined") {
                    message = `[${field}] is required`;
                }
                else {
                    message = "Must fill mandatory fields"
                }
            }
        } else {
            message = errors;
        }

        return message;
    }
    return (
        <SectionTinted p="$5" gap="$3" bubble={true} borderWidth={1} backgroundColor={"$yellow3"} borderColor={currentTheme == 'light' ? null : "$yellow8"}>
            <SizableText color="$red10" fontSize={"$4"} >Error:</SizableText>
            <YStack gap="$2">
                <Text fontSize={"$2"}>{"- " + getErrorMessage()}</Text>
            </YStack>
        </SectionTinted>
    )
}
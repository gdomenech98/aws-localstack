import { XStack, Text, YStack } from "tamagui"
import { X } from '@tamagui/lucide-icons';
import React from 'react';

export const Chip = ({ label, onClose, icon, ...props }: any) => {
    return (
        <XStack
            height="$2"
            ai="center"
            px="$3"
            py="$1"
            br="$10"
            gap="$2"
            {...props}
        >
            {onClose
                ? <YStack onPress={() => onClose(label)} position="relative" left={-6} cursor="pointer">
                    <X size={16} />
                </YStack>
                : null
            }
            <Text fontSize="$2">{label}</Text>
            {
                icon ?
                    React.createElement(icon, { size: 16,})
                    : null
            }
        </XStack >
    )
}
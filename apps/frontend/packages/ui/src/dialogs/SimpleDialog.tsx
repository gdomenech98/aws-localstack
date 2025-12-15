import React from "react";
import { XStackProps } from "tamagui"
import { ThemeTint } from '@my/ui';
import { X } from '@tamagui/lucide-icons';
import { Adapt, Button, Dialog, Sheet, Unspaced } from 'tamagui'

export const SimpleDialog = ({ open, onOpenChange, disableSheetHandle = false, title, contentProps, sheetHeight, children }: { title: any, open: boolean, sheetHeight?: number, disableSheetHandle?: boolean, onOpenChange: any, contentProps: XStackProps, children: any }) => {
    return (
        <Dialog modal open={open} onOpenChange={onOpenChange} >
            <Adapt platform="touch">
                <Sheet animation="medium" zIndex={200000} modal dismissOnSnapToBottom snapPointsMode="percent" snapPoints={[sheetHeight ?? 90]}>
                    {!disableSheetHandle && <Sheet.Handle height={8} bg="$gray6" />}
                    <Sheet.Frame padding="$4" pr="$2" gap="$4">
                        <Sheet.ScrollView contentContainerStyle={{ flexGrow: 1, pr: "$2" }}>
                            <Adapt.Contents />
                        </Sheet.ScrollView>
                    </Sheet.Frame>
                    <Sheet.Overlay
                        animation="lazy"
                        enterStyle={{ opacity: 0 }}
                        exitStyle={{ opacity: 0 }}
                    />
                </Sheet>
            </Adapt>
            <Dialog.Portal>
                <Dialog.Overlay
                    key="overlay"
                    animation="slow"
                    opacity={0.5}
                    enterStyle={{ opacity: 0 }}
                    exitStyle={{ opacity: 0 }}
                />
                <Dialog.Content
                    bordered
                    elevate
                    key="content"
                    animateOnly={['transform', 'opacity']}
                    //@ts-ignore
                    animation={[
                        'quicker', { opacity: { overshootClamping: true } }]}
                    enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
                    exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
                    gap="$4"
                    p="$8"
                    {...contentProps}
                >
                    <ThemeTint>
                        <Dialog.Title>
                            {typeof title === 'function' ? React.createElement(title) : title}
                        </Dialog.Title>
                    </ThemeTint>
                    {children}
                    <Unspaced>
                        <Dialog.Close asChild>
                            <Button
                                position="absolute"
                                top="$3"
                                right="$3"
                                size="$2"
                                circular
                                icon={X}
                            />
                        </Dialog.Close>
                    </Unspaced>
                </Dialog.Content>
            </Dialog.Portal >
        </Dialog >
    )
}
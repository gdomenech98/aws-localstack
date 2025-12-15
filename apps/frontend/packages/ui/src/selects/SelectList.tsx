import { Check, ChevronDown, ChevronUp } from '@tamagui/lucide-icons'
import { useMemo } from 'react'
import type { FontSizeTokens, SelectProps } from 'tamagui'
import { Adapt, Select, Sheet, YStack, getFontSize } from 'tamagui'
import { LinearGradient } from 'tamagui/linear-gradient'
import { ThemeTint } from '../tints'
import { Option, SelectComponentProps } from './types';

export function SelectList({ options, onChange, title, value, ...props }: SelectComponentProps & SelectProps) {
    const isSimpleOption = typeof (options[0]) === 'string';
    return (
        <Select value={value} onValueChange={(val) => { onChange(val) }} disablePreventBodyScroll {...props}>
            <Select.Trigger width={220} iconAfter={ChevronDown}>
                <Select.Value placeholder="Select option" />
            </Select.Trigger>
            <Adapt when="sm" platform="touch">
                <Sheet
                    native={!!props.native}
                    modal
                    dismissOnSnapToBottom
                    animationConfig={{
                        type: 'spring',
                        damping: 20,
                        mass: 1.2,
                        stiffness: 250,
                    }}
                >
                    <Sheet.Frame>
                        <Sheet.ScrollView>
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

            <Select.Content zIndex={200000}>
                <Select.ScrollUpButton
                    alignItems="center"
                    justifyContent="center"
                    position="relative"
                    width="100%"
                    height="$3"
                >
                    <YStack zIndex={10}>
                        <ChevronUp size={20} />
                    </YStack>
                    <LinearGradient
                        start={[0, 0]}
                        end={[0, 1]}
                        fullscreen
                        colors={['$background', 'transparent']}
                        borderRadius="$4"
                    />
                </Select.ScrollUpButton>
                <Select.Viewport
                    // to do animations:
                    // animation="quick"
                    // animateOnly={['transform', 'opacity']}
                    // enterStyle={{ o: 0, y: -10 }}
                    // exitStyle={{ o: 0, y: 10 }}
                    minWidth={200}
                >
                    <Select.Group>

                        <ThemeTint>
                            {title ? <Select.Label color="$color8" bc="transparent">{title}</Select.Label> : null}
                        </ThemeTint>
                        
                        {/* for longer lists memoizing these is useful */}
                        {useMemo(
                            () =>
                                options.map((opt: string | Option, i) => {
                                    return (
                                        <Select.Item
                                            index={i}
                                            //@ts-ignore
                                            key={isSimpleOption ? opt : (opt as Option).name}
                                            value={isSimpleOption ? opt : (opt as Option).value}
                                        >
                                            <Select.ItemText>{isSimpleOption ? opt : (opt as Option).name}</Select.ItemText>
                                            <Select.ItemIndicator marginLeft="auto">
                                                <ThemeTint>
                                                    <Check size={16} color="$color8" />
                                                </ThemeTint>
                                            </Select.ItemIndicator>
                                        </Select.Item>
                                    )
                                }),
                            [options]
                        )}
                    </Select.Group>
                    {/* Native gets an extra icon */}
                    {props.native && (
                        <YStack
                            position="absolute"
                            right={0}
                            top={0}
                            bottom={0}
                            alignItems="center"
                            justifyContent="center"
                            width={'$4'}
                            pointerEvents="none"
                        >
                            <ChevronDown
                                size={getFontSize((props.size as FontSizeTokens) ?? '$true')}
                            />
                        </YStack>
                    )}
                </Select.Viewport>

                <Select.ScrollDownButton
                    alignItems="center"
                    justifyContent="center"
                    position="relative"
                    width="100%"
                    height="$3"
                >
                    <YStack zIndex={10}>
                        <ChevronDown size={20} />
                    </YStack>
                    <LinearGradient
                        start={[0, 0]}
                        end={[0, 1]}
                        fullscreen
                        colors={['transparent', '$background']}
                        borderRadius="$4"
                    />
                </Select.ScrollDownButton>
            </Select.Content>
        </Select>

    )
}
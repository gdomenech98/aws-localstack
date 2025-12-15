import { ToggleGroup as TamaguiToggleGroup, Paragraph, XStack, SizeTokens, Tooltip } from 'tamagui'
import React from 'react';

type ToggleGroupProps = { size?: SizeTokens, type?: 'single' | 'multiple', orientation?: 'vertical' | 'horizontal', items: { icon: any, value: string, label?: string, hint?: string }[], onChange: any, value: string }

export function CustomToggleGroup({ size = '$2', type = 'single', orientation = 'horizontal', items = [], onChange = (value) => { }, value }: ToggleGroupProps) {
    const id = `switch-${size.toString().slice(1)}-${type}`;

    return (
        <XStack
            flexDirection={orientation === 'horizontal' ? 'row' : 'column'}
            alignItems="center"
            justifyContent="center"
            space="$4"
        >
            {/* @ts-ignore */}
            <TamaguiToggleGroup
                orientation={orientation}
                id={id}
                type={type as any} // since this demo switches between loosen types
                size={size}
                disableDeactivation={type === 'single' ? true : undefined}
                onValueChange={onChange}
                value={value}
                borderColor={"$color7"}
                borderWidth={1}
            >
                {
                    items?.length ?
                        items?.map((item, index: number) => {
                            return (
                                <Tooltip
                                    key={index}
                                >
                                    <Tooltip.Trigger>
                                        <TamaguiToggleGroup.Item
                                            value={item?.value ?? index.toString()}
                                            //@ts-ignore
                                            onPress={item?.onPress}
                                        // chromeless={item?.value !== value} 
                                        >

                                            <XStack gap={item?.label ? "$2" : 0} alignItems="center">
                                                {React.createElement(item.icon, { size: "$1", strokeWidth: 1 })}
                                                {item?.label ? <Paragraph size="$2">{item.label}</Paragraph> : null}
                                            </XStack>

                                        </TamaguiToggleGroup.Item>
                                    </Tooltip.Trigger >
                                    <Tooltip.Content
                                        disabled={!item?.hint}
                                        enterStyle={{ x: 0, y: -5, opacity: 0, scale: 0.9 }}
                                        exitStyle={{ x: 0, y: -5, opacity: 0, scale: 0.9 }}
                                        scale={1}
                                        x={0}
                                        y={0}
                                        maxWidth={200}
                                        opacity={1}
                                        animation={['quick', { opacity: { overshootClamping: true } }]}
                                    >
                                        <Tooltip.Arrow />
                                        <Paragraph size="$2" lineHeight="$1">  {item?.hint} </Paragraph>
                                    </Tooltip.Content>
                                </Tooltip>
                            )
                        })
                        : null
                }
            </TamaguiToggleGroup>
        </XStack>
    )
}
import { useState, useMemo } from 'react'
import {
    Popover,
    Input,
    YStack,
    XStack,
    SizableText,
    Adapt,
    Sheet,
} from 'tamagui'
import { Check, ChevronDown } from '@tamagui/lucide-icons'
import { ThemeTint } from '../tints'

type ComboBoxProps = {
    /** Array de strings u objetos { name, value }  */
    options: string[] | { name: string; value: string }[]
    value?: string
    onChange: (val: string) => void,
    placeholder?: string,
    inputPlaceholder?: string,
    style?: any,
    contentStyle?: any
}

export function ComboBox({
    options,
    value,
    onChange,
    placeholder = 'Seleccionar…',
    inputPlaceholder = 'Search...',
    style = {},
    contentStyle = {}
}: ComboBoxProps) {
    const [open, setOpen] = useState(false)
    const [query, setQuery] = useState('')

    const isSimple = typeof options[0] === 'string'

    // Filtrado memoizado
    const filtered = useMemo(() => {
        const normalize = (s: string) => s.toLowerCase().trim()
        return (options as any[]).filter(opt =>
            normalize(isSimple ? opt : opt.name).includes(normalize(query))
        )
    }, [query, options, isSimple])

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <Popover.Trigger asChild>
                <XStack
                    ai="center"
                    jc="space-between"
                    bg="$background"
                    br="$4"
                    px="$4"
                    py="$2.5"
                    width={220}
                    borderWidth={1}
                    borderColor={"$color5"}
                    cursor="pointer"
                    pressStyle={{ bg: '$gray2' }}
                    {...style}
                >
                    <SizableText size="$3" userSelect="none">
                        {value
                            ? (isSimple
                                ? value
                                : (options as { name: string; value: string }[])
                                    .find(o => o.value === value)?.name) ?? placeholder
                            : placeholder}
                    </SizableText>
                    <ChevronDown size={16} />
                </XStack>
            </Popover.Trigger>

            <Popover.Content
                elevate
                br="$4"
                bw={1}
                borderColor="$color5"
                bc="$background"
                w={220}
                padding="$3"
                pr={0}
                mt="$2"
                space="$3"
                {...contentStyle}
            >
                <Input
                    placeholder={inputPlaceholder ?? "Search..."}
                    value={query}
                    onChangeText={setQuery}
                    autoFocus
                    f={1}
                    maxWidth={'90%'}
                    position="relative"
                    w={"100%"}
                    focusStyle={{ borderColor: "$color3" }}
                />
                <YStack h={200} overflow="scroll" space="$1" mt="$2" w="100%">
                    {filtered.length === 0 && (
                        <SizableText size="$2" color="$color7" height="100%" mt="$3" ta="center" px="$1">
                            No results found
                        </SizableText>
                    )}

                    {filtered.map((opt, i) => {
                        const name = isSimple ? (opt as string) : (opt as any).name
                        const val = isSimple ? (opt as string) : (opt as any).value
                        const selected = val === value || (value?.length && value.includes(val));

                        return (
                            <XStack
                                key={val ?? name}
                                ai="center"
                                pl="$4"
                                pr="$2"
                                py="$2.5"
                                br="$2"
                                hoverStyle={{ bg: '$gray2' }}
                                pressStyle={{ bg: '$gray3' }}
                                gap="$2"
                                cursor="pointer"
                                onPress={() => {
                                    onChange(val)
                                    setOpen(false)
                                }}
                            >
                                <SizableText flex={1}>{name}</SizableText>
                                <ThemeTint>
                                    {selected ? <Check color="$color8" size={16} /> : null}
                                </ThemeTint>
                            </XStack>
                        )
                    })}
                </YStack>
            </Popover.Content>

            <Adapt when="maxMd" platform="touch">
                <Sheet modal dismissOnSnapToBottom animation="medium">
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
        </Popover>
    )
}

import type { SelectProps } from 'tamagui'

export type Option = { value: any, name: string }
export type SelectComponentProps = {
    options: Option[] | string[],
    onChange?: any,
    title?: string,
} & SelectProps
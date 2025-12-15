import React, { useEffect, useState } from 'react';
import { YStack, XStack, Text, Checkbox, Button, Popover } from 'tamagui';
import { Option } from './types';

export function MultipleSelectList({ options, onChange, title, value }) {
    const [selectedItems, setSelectedItems] = useState(value ?? []);
    const [isOpen, setIsOpen] = useState(false);

    const toggleSelection = (option: Option) => {
        const isSelected = selectedItems.some((item: Option) => item.value === option.value);
        const newSelection = isSelected
            ? selectedItems.filter((item: Option) => item.value !== option.value)
            : [...selectedItems, option];

        setSelectedItems(newSelection);
        onChange(newSelection);
    };

    const handleOpenChange = (open: boolean) => {
        // Only allow the Popover to close when 'open' is true
        setIsOpen(open);
    };

    return (
        <YStack>
            <Button onPress={() => setIsOpen(!isOpen)}>
                {selectedItems.length > 0
                    ? `${selectedItems.length} selected`
                    : title ?? 'Select options'}
            </Button>

            {/* Popover for showing options */}
            <Popover
                open={isOpen}
                onOpenChange={handleOpenChange}
            // Add this prop if available to prevent closing on select
            // closeOnSelect={false}
            // Alternatively, use 'stayOpenOnClick' if provided by the library
            >
                <Popover.Content>
                    <YStack p="$4" bg="$background" borderRadius="$2" space="$2">
                        {options.map((option) => (
                            <XStack
                                key={option.id}
                                alignItems="center"
                                space="$2"
                                onPress={(e) => {
                                    e.stopPropagation(); // Prevent the Popover from closing
                                    e.preventDefault();
                                    toggleSelection(option);
                                }}
                            >
                                <Checkbox
                                    checked={selectedItems.some((item) => item.value === option.value)}
                                    onChange={(e) => {
                                        e.stopPropagation(); // Prevent the Popover from closing
                                        e.preventDefault();
                                        toggleSelection(option);
                                    }}
                                />
                                <Text>{option.label}</Text>
                            </XStack>
                        ))}
                    </YStack>
                </Popover.Content>
            </Popover>
        </YStack>
    );
}

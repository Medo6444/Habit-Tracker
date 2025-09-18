import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export interface DropdownOption<T = string> {
    value: T;
    label: string;
}

interface DropdownProps<T = string> {
    options: DropdownOption<T>[];
    selectedValue: T;
    onSelect: (value: T) => void;
    placeholder?: string;
    style?: object;
    disabled?: boolean;
}

export const Dropdown = <T extends string | number>({
                                                        options,
                                                        selectedValue,
                                                        onSelect,
                                                        placeholder = 'Select an option',
                                                        style,
                                                        disabled = false
                                                    }: DropdownProps<T>) => {
    const [isOpen, setIsOpen] = useState(false);

    const selectedOption = options.find(opt => opt.value === selectedValue);

    const handleSelect = (value: T) => {
        onSelect(value);
        setIsOpen(false);
    };

    return (
        <View style={[styles.dropdownContainer, style]}>
            <TouchableOpacity
                style={[
                    styles.dropdownButton,
                    disabled && styles.dropdownButtonDisabled,
                    isOpen && styles.dropdownButtonOpen
                ]}
                onPress={() => !disabled && setIsOpen(!isOpen)}
                disabled={disabled}
            >
                <Text style={[
                    styles.dropdownButtonText,
                    disabled && styles.dropdownButtonTextDisabled
                ]}>
                    {selectedOption?.label || placeholder}
                </Text>
                <Ionicons
                    name={isOpen ? "chevron-up" : "chevron-down"}
                    size={20}
                    color={disabled ? "#ccc" : "#666"}
                />
            </TouchableOpacity>

            {isOpen && !disabled && (
                <View style={styles.dropdownMenu}>
                    {options.map((option) => (
                        <TouchableOpacity
                            key={String(option.value)}
                            style={[
                                styles.dropdownItem,
                                selectedValue === option.value && styles.dropdownItemSelected
                            ]}
                            onPress={() => handleSelect(option.value)}
                        >
                            <Text style={[
                                styles.dropdownItemText,
                                selectedValue === option.value && styles.dropdownItemTextSelected
                            ]}>
                                {option.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    dropdownContainer: {
        position: 'relative',
        zIndex: 1000,
    },
    dropdownButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    dropdownButtonDisabled: {
        backgroundColor: '#f5f5f5',
        borderColor: '#e0e0e0',
    },
    dropdownButtonOpen: {
        borderColor: '#007AFF',
        shadowColor: '#007AFF',
        shadowOpacity: 0.2,
    },
    dropdownButtonText: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
    },
    dropdownButtonTextDisabled: {
        color: '#999',
    },
    dropdownMenu: {
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
        backgroundColor: 'white',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
        zIndex: 1001,
        maxHeight: 200,
    },
    dropdownItem: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    dropdownItemSelected: {
        backgroundColor: '#f0f8ff',
    },
    dropdownItemText: {
        fontSize: 16,
        color: '#333',
    },
    dropdownItemTextSelected: {
        color: '#007AFF',
        fontWeight: '500',
    },
});
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { HABIT_TYPES } from '../../utils/HabitConstants';

interface HabitTypeSelectorProps {
    selectedType: string;
    onSelectType: (type: string) => void;
}

export const HabitTypeSelector: React.FC<HabitTypeSelectorProps> = ({
                                                                        selectedType,
                                                                        onSelectType
                                                                    }) => {
    return (
        <View style={styles.typeContainer}>
            {HABIT_TYPES.map((type) => {
                const isSelected = selectedType === type.key;
                return (
                    <TouchableOpacity
                        key={type.key}
                        style={[
                            styles.typeCard,
                            isSelected ? styles.typeCardSelected : undefined
                        ]}
                        onPress={() => onSelectType(type.key)}
                    >
                        <Text style={[
                            styles.typeLabel,
                            isSelected ? styles.typeLabelSelected : undefined
                        ]}>
                            {type.label}
                        </Text>
                        <Text style={[
                            styles.typeDescription,
                            isSelected ? styles.typeDescriptionSelected : undefined
                        ]}>
                            {type.description}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    typeContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    typeCard: {
        flex: 1,
        minWidth: '45%',
        backgroundColor: '#f8f9fa',
        padding: 12,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    typeCardSelected: {
        backgroundColor: '#e3f2fd',
        borderColor: '#007AFF',
    },
    typeLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    typeLabelSelected: {
        color: '#007AFF',
    },
    typeDescription: {
        fontSize: 12,
        color: '#666',
    },
    typeDescriptionSelected: {
        color: '#007AFF',
    },
});
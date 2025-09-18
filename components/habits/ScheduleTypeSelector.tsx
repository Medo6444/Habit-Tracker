import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface ScheduleTypeSelectorProps {
    selectedType: 'daily' | 'weekly' | 'monthly' | 'yearly';
    onSelectType: (type: 'daily' | 'weekly' | 'monthly' | 'yearly') => void;
}

export const ScheduleTypeSelector: React.FC<ScheduleTypeSelectorProps> = ({
                                                                              selectedType,
                                                                              onSelectType
                                                                          }) => {
    const scheduleTypes = [
        { value: 'daily' as const, label: 'Daily', description: 'Every day' },
        { value: 'weekly' as const, label: 'Weekly', description: 'Specific days each week' },
        { value: 'monthly' as const, label: 'Monthly', description: 'Every month' },
        { value: 'yearly' as const, label: 'Yearly', description: 'Every year' },
    ];

    return (
        <View style={styles.container}>
            {scheduleTypes.map((type) => (
                <TouchableOpacity
                    key={type.value}
                    style={[
                        styles.option,
                        selectedType === type.value && styles.optionSelected
                    ]}
                    onPress={() => onSelectType(type.value)}
                >
                    <View style={styles.header}>
                        <Text style={[
                            styles.label,
                            selectedType === type.value && styles.labelSelected
                        ]}>
                            {type.label}
                        </Text>
                        <View style={[
                            styles.radioButton,
                            selectedType === type.value && styles.radioButtonSelected
                        ]}>
                            {selectedType === type.value && <View style={styles.radioButtonInner} />}
                        </View>
                    </View>
                    <Text style={styles.description}>{type.description}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    option: {
        padding: 16,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        marginBottom: 8,
        backgroundColor: '#fafafa',
    },
    optionSelected: {
        borderColor: '#007AFF',
        backgroundColor: '#f0f8ff',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
    },
    labelSelected: {
        color: '#007AFF',
    },
    description: {
        fontSize: 14,
        color: '#666',
    },
    radioButton: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#ddd',
        alignItems: 'center',
        justifyContent: 'center',
    },
    radioButtonSelected: {
        borderColor: '#007AFF',
    },
    radioButtonInner: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#007AFF',
    },
});
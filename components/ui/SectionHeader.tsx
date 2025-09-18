import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SectionHeaderProps {
    title: string;
    expanded: boolean;
    onToggle: () => void;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
                                                                title,
                                                                expanded,
                                                                onToggle
                                                            }) => {
    return (
        <TouchableOpacity style={styles.sectionHeader} onPress={onToggle}>
            <Text style={styles.sectionTitle}>{title}</Text>
            <Ionicons
                name={expanded ? "chevron-up" : "chevron-down"}
                size={20}
                color="#666"
            />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
});
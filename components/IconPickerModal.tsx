import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ICONS } from '../utils/HabitConstants';

interface IconPickerModalProps {
    visible: boolean;
    selectedIcon: string;
    selectedColor: string;
    onSelect: (icon: string) => void;
    onClose: () => void;
}

export const IconPickerModal: React.FC<IconPickerModalProps> = ({
                                                                    visible,
                                                                    selectedIcon,
                                                                    selectedColor,
                                                                    onSelect,
                                                                    onClose,
                                                                }) => {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Choose Icon</Text>
                    <View style={styles.iconGrid}>
                        {ICONS.map((icon) => (
                            <TouchableOpacity
                                key={icon}
                                style={[
                                    styles.iconOption,
                                    { backgroundColor: selectedColor },
                                    selectedIcon === icon && styles.selectedIconOption
                                ]}
                                onPress={() => onSelect(icon)}
                            >
                                <Ionicons name={icon as any} size={24} color="white" />
                            </TouchableOpacity>
                        ))}
                    </View>
                    <TouchableOpacity
                        style={styles.modalCloseButton}
                        onPress={onClose}
                    >
                        <Text style={styles.modalCloseText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: 'white',
        margin: 20,
        borderRadius: 12,
        padding: 20,
        minWidth: 300,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        textAlign: 'center',
        marginBottom: 20,
    },
    iconGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 12,
        marginBottom: 20,
    },
    iconOption: {
        width: 50,
        height: 50,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#ddd',
    },
    selectedIconOption: {
        borderColor: '#007AFF',
        borderWidth: 3,
    },
    modalCloseButton: {
        padding: 12,
        alignItems: 'center',
    },
    modalCloseText: {
        fontSize: 16,
        color: '#007AFF',
        fontWeight: '500',
    },
});
import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { COLORS } from '../utils/HabitConstants';

interface ColorPickerModalProps {
    visible: boolean;
    selectedColor: string;
    onSelect: (color: string) => void;
    onClose: () => void;
}

export const ColorPickerModal: React.FC<ColorPickerModalProps> = ({
                                                                      visible,
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
                    <Text style={styles.modalTitle}>Choose Color</Text>
                    <View style={styles.colorGrid}>
                        {COLORS.map((color) => (
                            <TouchableOpacity
                                key={color}
                                style={[
                                    styles.colorOption,
                                    { backgroundColor: color },
                                    selectedColor === color ? styles.selectedColorOption : undefined
                                ]}
                                onPress={() => onSelect(color)}
                            />
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
    colorGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 12,
        marginBottom: 20,
    },
    colorOption: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 2,
        borderColor: '#ddd',
    },
    selectedColorOption: {
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
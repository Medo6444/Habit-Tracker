import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { HabitFormData } from '../../navigation/types';
import { SectionHeader } from '../ui/SectionHeader';
import { DaySelector } from '../ui/DaySelector';
import { HabitTypeSelector } from '../ui/HabitTypeSelector';
import { ReminderCard } from '../ui/ReminderCard';
import { ColorPickerModal } from '../ColorPickerModal';
import { IconPickerModal } from '../IconPickerModal';
import { ScheduleTypeSelector } from './ScheduleTypeSelector';
import { useReminders } from '../../hooks/UseReminders';
import { getFirstValidationError } from '../../utils/HabitValidation';
import { getScheduleHelperText, getCurrentScheduleType } from '../../utils/Schedule';

interface HabitFormProps {
    formData: HabitFormData;
    onUpdateFormData: (data: HabitFormData) => void;
    onSave: (data: HabitFormData) => Promise<void>;
    onSaveAsTemplate?: (data: HabitFormData) => Promise<void>;
    onBack: () => void;
    loading?: boolean;
    title?: string;
}

export const HabitForm: React.FC<HabitFormProps> = ({
                                                        formData,
                                                        onUpdateFormData,
                                                        onSave,
                                                        onSaveAsTemplate,
                                                        onBack,
                                                        loading = false,
                                                        title = 'Create Habit',
                                                    }) => {
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [showIconPicker, setShowIconPicker] = useState(false);
    const [expandedSections, setExpandedSections] = useState({
        basic: true,
        schedule: true,
        reminders: false
    });

    const { reminders, addReminder, updateReminder, removeReminder } = useReminders(formData.reminders);

    useEffect(() => {
        onUpdateFormData({ ...formData, reminders });
    }, [reminders]);

    const handleSave = async () => {
        const validationError = getFirstValidationError(formData);
        if (validationError) {
            Alert.alert('Error', validationError);
            return;
        }

        try {
            await onSave(formData);
        } catch (error) {
            Alert.alert('Error', 'Failed to save habit');
        }
    };

    const handleSaveAsTemplate = async () => {
        if (!formData.name.trim()) {
            Alert.alert('Error', 'Please enter a habit name first');
            return;
        }

        Alert.alert(
            'Save as Template',
            'This will save your habit as a template for future use.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Save',
                    onPress: async () => {
                        if (onSaveAsTemplate) {
                            try {
                                await onSaveAsTemplate(formData);
                                Alert.alert('Success', 'Template saved successfully!');
                            } catch (error) {
                                Alert.alert('Error', 'Failed to save template');
                            }
                        }
                    }
                }
            ]
        );
    };

    const toggleDay = (dayValue: number) => {
        if (formData.schedule_type === 'daily') return;

        if (formData.schedule_type === 'weekly') {
            const newDowMask = formData.dow_mask ^ dayValue;

            if (newDowMask === 127) {
                Alert.alert(
                    'Switch to Daily?',
                    'You\'ve selected all days. Would you like to switch to Daily schedule instead?',
                    [
                        { text: 'Keep Weekly', style: 'cancel' },
                        {
                            text: 'Switch to Daily',
                            onPress: () => {
                                onUpdateFormData({
                                    ...formData,
                                    schedule_type: 'daily',
                                    dow_mask: 127
                                });
                            }
                        }
                    ]
                );
                return;
            }

            if (newDowMask === 0) {
                Alert.alert('Error', 'Please select at least one day for weekly habits.');
                return;
            }

            onUpdateFormData({ ...formData, dow_mask: newDowMask });
        }
    };

    const toggleSection = (section: keyof typeof expandedSections) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const handleScheduleTypeChange = (scheduleType: 'daily' | 'weekly' | 'monthly' | 'yearly') => {
        const actualScheduleType: 'daily' | 'weekly' | 'interval' =
            scheduleType === 'monthly' || scheduleType === 'yearly' ? 'interval' : scheduleType;

        let updatedData: HabitFormData = {
            ...formData,
            schedule_type: actualScheduleType
        };

        if (scheduleType === 'daily') {
            updatedData.dow_mask = 127;
            updatedData.interval_days = null;
        } else if (scheduleType === 'weekly') {
            if (updatedData.dow_mask === 127 || updatedData.dow_mask === 0) {
                updatedData.dow_mask = 1;
            }
            updatedData.interval_days = null;
        } else if (scheduleType === 'monthly') {
            updatedData.dow_mask = 127;
            updatedData.interval_days = 30;
        } else if (scheduleType === 'yearly') {
            updatedData.dow_mask = 127;
            updatedData.interval_days = 365;
        }

        onUpdateFormData(updatedData);
    };

    const isIntervalSchedule = formData.schedule_type === 'interval';
    const showScheduleInfo = formData.schedule_type === 'daily' || isIntervalSchedule;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={onBack}>
                    <Ionicons name="arrow-back" size={24} color="#007AFF" />
                    <Text style={styles.backText}>Back</Text>
                </TouchableOpacity>
                <Text style={styles.title}>{title}</Text>
                {onSaveAsTemplate && (
                    <TouchableOpacity style={styles.templateButton} onPress={handleSaveAsTemplate}>
                        <Ionicons name="bookmark" size={20} color="#007AFF" />
                    </TouchableOpacity>
                )}
            </View>

            <ScrollView style={styles.formContainer}>
                {/* Basic Information */}
                <View style={styles.section}>
                    <SectionHeader
                        title="Basic Information"
                        expanded={expandedSections.basic}
                        onToggle={() => toggleSection('basic')}
                    />

                    {expandedSections.basic && (
                        <View style={styles.sectionContent}>
                            <Text style={styles.label}>Habit Name *</Text>
                            <TextInput
                                style={styles.input}
                                value={formData.name}
                                onChangeText={(text) => onUpdateFormData({ ...formData, name: text })}
                                placeholder="Enter habit name"
                            />

                            <Text style={styles.label}>Description</Text>
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                value={formData.description}
                                onChangeText={(text) => onUpdateFormData({ ...formData, description: text })}
                                placeholder="Optional description"
                                multiline
                                numberOfLines={3}
                            />

                            <Text style={styles.label}>Habit Type</Text>
                            <HabitTypeSelector
                                selectedType={formData.type}
                                onSelectType={(type) => onUpdateFormData({
                                    ...formData,
                                    type: type as any
                                })}
                            />

                            {formData.type !== 'boolean' && (
                                <View style={styles.row}>
                                    <View style={styles.flex1}>
                                        <Text style={styles.label}>Target Value *</Text>
                                        <TextInput
                                            style={styles.input}
                                            value={formData.target_value?.toString() || ''}
                                            onChangeText={(text) => onUpdateFormData({
                                                ...formData,
                                                target_value: text ? parseFloat(text) : null
                                            })}
                                            placeholder="0"
                                            keyboardType="numeric"
                                        />
                                    </View>
                                    <View style={styles.flex1}>
                                        <Text style={styles.label}>Unit</Text>
                                        <TextInput
                                            style={styles.input}
                                            value={formData.unit}
                                            onChangeText={(text) => onUpdateFormData({
                                                ...formData,
                                                unit: text
                                            })}
                                            placeholder="e.g., minutes, glasses, pages"
                                        />
                                    </View>
                                </View>
                            )}

                            <View style={styles.row}>
                                <View style={styles.flex1}>
                                    <Text style={styles.label}>Color</Text>
                                    <TouchableOpacity
                                        style={[styles.colorButton, { backgroundColor: formData.color }]}
                                        onPress={() => setShowColorPicker(true)}
                                    />
                                </View>
                                <View style={styles.flex1}>
                                    <Text style={styles.label}>Icon</Text>
                                    <TouchableOpacity
                                        style={[styles.iconButton, { backgroundColor: formData.color }]}
                                        onPress={() => setShowIconPicker(true)}
                                    >
                                        <Ionicons name={formData.icon as any} size={24} color="white" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    )}
                </View>

                {/* Schedule Section */}
                <View style={styles.section}>
                    <SectionHeader
                        title="Schedule"
                        expanded={expandedSections.schedule}
                        onToggle={() => toggleSection('schedule')}
                    />

                    {expandedSections.schedule && (
                        <View style={styles.sectionContent}>
                            <Text style={styles.label}>Schedule Type</Text>
                            <ScheduleTypeSelector
                                selectedType={getCurrentScheduleType(formData.schedule_type, formData.interval_days)}
                                onSelectType={handleScheduleTypeChange}
                            />

                            {showScheduleInfo && (
                                <View>
                                    <Text style={styles.label}>Schedule Info</Text>
                                    <Text style={styles.helperText}>
                                        {getScheduleHelperText(formData.schedule_type, formData.interval_days)}
                                    </Text>
                                </View>
                            )}

                            {formData.schedule_type === 'weekly' && (
                                <View>
                                    <Text style={styles.label}>Days of Week</Text>
                                    <Text style={styles.helperText}>Select which days of the week</Text>
                                    <DaySelector
                                        selectedDays={formData.dow_mask}
                                        onToggleDay={toggleDay}
                                    />
                                </View>
                            )}

                            <View style={styles.row}>
                                <View style={styles.flex1}>
                                    <Text style={styles.label}>Start Date</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={formData.start_date}
                                        onChangeText={(text) => onUpdateFormData({
                                            ...formData,
                                            start_date: text
                                        })}
                                        placeholder="YYYY-MM-DD"
                                    />
                                </View>
                                <View style={styles.flex1}>
                                    <Text style={styles.label}>End Date (Optional)</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={formData.end_date}
                                        onChangeText={(text) => onUpdateFormData({
                                            ...formData,
                                            end_date: text
                                        })}
                                        placeholder="YYYY-MM-DD"
                                    />
                                </View>
                            </View>
                        </View>
                    )}
                </View>

                {/* Reminders Section */}
                <View style={styles.section}>
                    <SectionHeader
                        title="Reminders"
                        expanded={expandedSections.reminders}
                        onToggle={() => toggleSection('reminders')}
                    />

                    {expandedSections.reminders && (
                        <View style={styles.sectionContent}>
                            {reminders.map((reminder, index) => (
                                <ReminderCard
                                    key={index}
                                    reminder={reminder}
                                    index={index}
                                    onUpdate={updateReminder}
                                    onRemove={removeReminder}
                                />
                            ))}

                            <TouchableOpacity style={styles.addReminderButton} onPress={addReminder}>
                                <Ionicons name="add" size={20} color="#007AFF" />
                                <Text style={styles.addReminderText}>Add Reminder</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>

                <TouchableOpacity
                    style={[styles.saveButton, loading && styles.saveButtonDisabled]}
                    onPress={handleSave}
                    disabled={loading}
                >
                    <Text style={styles.saveButtonText}>
                        {loading ? 'Saving...' : 'Save Habit'}
                    </Text>
                </TouchableOpacity>
            </ScrollView>

            <ColorPickerModal
                visible={showColorPicker}
                selectedColor={formData.color}
                onSelect={(color) => {
                    onUpdateFormData({ ...formData, color });
                    setShowColorPicker(false);
                }}
                onClose={() => setShowColorPicker(false)}
            />

            <IconPickerModal
                visible={showIconPicker}
                selectedIcon={formData.icon}
                selectedColor={formData.color}
                onSelect={(icon) => {
                    onUpdateFormData({ ...formData, icon });
                    setShowIconPicker(false);
                }}
                onClose={() => setShowIconPicker(false)}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backText: {
        color: '#007AFF',
        fontSize: 16,
        marginLeft: 4,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        flex: 1,
    },
    templateButton: {
        padding: 8,
    },
    formContainer: {
        flex: 1,
    },
    section: {
        backgroundColor: 'white',
        marginHorizontal: 20,
        marginVertical: 8,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    sectionContent: {
        padding: 16,
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
        marginBottom: 8,
        marginTop: 16,
    },
    helperText: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
        fontStyle: 'italic',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        backgroundColor: '#fafafa',
    },
    textArea: {
        height: 80,
        textAlignVertical: 'top',
    },
    row: {
        flexDirection: 'row',
        gap: 12,
    },
    flex1: {
        flex: 1,
    },
    colorButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 2,
        borderColor: '#ddd',
    },
    iconButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#ddd',
    },
    addReminderButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#007AFF',
        borderStyle: 'dashed',
    },
    addReminderText: {
        fontSize: 16,
        color: '#007AFF',
        marginLeft: 8,
        fontWeight: '500',
    },
    saveButton: {
        backgroundColor: '#007AFF',
        margin: 20,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 40,
    },
    saveButtonDisabled: {
        backgroundColor: '#ccc',
    },
    saveButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
    },
});
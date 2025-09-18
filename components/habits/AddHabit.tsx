import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, ScrollView, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { HabitFormData, Templates } from '../../navigation/types';
import { HabitForm } from './HabitForm';
import { TemplateSelector } from './TemplateSelector';
import { Dropdown, DropdownOption } from '../Dropdown';
import { HabitCard } from './HabitCard';
import { HabitDetailModal } from './HabitDetailModal';
import { useHabitManagement } from '../../hooks/UseHabitManagement';
import { FilterType } from '../../utils/Schedule';

const getDefaultFormData = (): HabitFormData => ({
    name: '',
    description: '',
    type: 'boolean',
    target_value: null,
    unit: '',
    color: '#007AFF',
    icon: 'checkmark-circle',
    start_date: new Date().toISOString().split('T')[0],
    end_date: '',
    schedule_type: 'daily',
    dow_mask: 127,
    interval_days: null,
    reminders: []
});

const filterOptions: DropdownOption<FilterType>[] = [
    { value: 'all', label: 'All Habits' },
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'yearly', label: 'Yearly' },
];

export default function AddHabit() {
    const [mode, setMode] = useState<'list' | 'create' | 'template'>('list');
    const [formData, setFormData] = useState<HabitFormData>(getDefaultFormData());
    const [isFromTemplate, setIsFromTemplate] = useState(false);

    const {
        habits,
        filterType,
        selectedHabit,
        showDetailModal,
        templates,
        habitsLoading,
        templatesLoading,
        setFilterType,
        applyTemplate,
        saveHabit,
        saveAsTemplate,
        removeHabit,
        removeCustomTemplate,
        selectHabit,
        closeDetailModal,
    } = useHabitManagement();

    const resetForm = () => {
        setFormData(getDefaultFormData());
        setIsFromTemplate(false);
    };

    const handleTemplateSelect = (template: Templates) => {
        const templateData = applyTemplate(template);
        setFormData(templateData);
        setIsFromTemplate(true);
        setMode('create');
    };

    const handleSaveHabit = async (data: HabitFormData) => {
        try {
            await saveHabit(data);
            Alert.alert('Success', 'Habit created successfully!', [
                { text: 'OK', onPress: () => {
                        resetForm();
                        setMode('list');
                    }}
            ]);
        } catch (error) {
            Alert.alert('Error', error instanceof Error ? error.message : 'Failed to create habit. Please try again.');
        }
    };

    const handleSaveAsTemplate = async (data: HabitFormData) => {
        try {
            await saveAsTemplate(data);
            Alert.alert('Success', 'Template saved successfully!');
        } catch (error) {
            Alert.alert('Error', error instanceof Error ? error.message : 'Failed to save template. Please try again.');
        }
    };

    const handleDeleteHabit = async (habitId: number) => {
        try {
            await removeHabit(habitId);
            Alert.alert('Success', 'Habit deleted successfully!');
        } catch (error) {
            Alert.alert('Error', 'Failed to delete habit. Please try again.');
        }
    };

    const handleDeleteCustomTemplate = async (templateId: number) => {
        try {
            await removeCustomTemplate(templateId);
            Alert.alert('Success', 'Template deleted successfully!');
        } catch (error) {
            Alert.alert('Error', 'Failed to delete template. Please try again.');
        }
    };

    const handleBack = () => {
        if (mode === 'create' || mode === 'template') {
            setMode('list');
            resetForm();
        }
    };

    if (mode === 'list') {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Your Habits</Text>

                <Dropdown
                    options={filterOptions}
                    selectedValue={filterType}
                    onSelect={setFilterType}
                    style={styles.filterDropdown}
                />

                <ScrollView style={styles.habitsList}>
                    {habits.length === 0 ? (
                        <View style={styles.emptyState}>
                            <Ionicons name="list-outline" size={64} color="#ccc" />
                            <Text style={styles.emptyStateText}>
                                {filterType === 'all' ? 'No habits created yet' : `No ${filterType} habits found`}
                            </Text>
                        </View>
                    ) : (
                        habits.map(habit => (
                            <HabitCard
                                key={habit.id}
                                habit={habit}
                                onPress={() => selectHabit(habit)}
                            />
                        ))
                    )}
                </ScrollView>

                <View style={styles.actionButtons}>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => {
                            setIsFromTemplate(false);
                            setMode('create');
                        }}
                    >
                        <Ionicons name="add-circle" size={20} color="#007AFF" />
                        <Text style={styles.actionButtonText}>Create New</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => setMode('template')}
                    >
                        <Ionicons name="library" size={20} color="#4CAF50" />
                        <Text style={styles.actionButtonText}>Use Template</Text>
                    </TouchableOpacity>
                </View>

                <HabitDetailModal
                    habit={selectedHabit}
                    visible={showDetailModal}
                    onClose={closeDetailModal}
                    onDelete={handleDeleteHabit}
                />
            </View>
        );
    }

    if (mode === 'template') {
        return (
            <TemplateSelector
                templates={templates}
                onSelectTemplate={handleTemplateSelect}
                onBack={handleBack}
                onDeleteTemplate={handleDeleteCustomTemplate}
            />
        );
    }

    return (
        <HabitForm
            formData={formData}
            onUpdateFormData={setFormData}
            onSave={handleSaveHabit}
            onSaveAsTemplate={!isFromTemplate ? handleSaveAsTemplate : undefined}
            onBack={handleBack}
            loading={habitsLoading}
            title="Create Habit"
        />
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginBottom: 16,
        marginTop: 20,
    },
    filterDropdown: {
        marginHorizontal: 20,
        marginBottom: 16,
    },
    habitsList: {
        flex: 1,
        paddingHorizontal: 20,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    emptyStateText: {
        fontSize: 16,
        color: '#999',
        marginTop: 16,
    },
    actionButtons: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
        gap: 12,
    },
    actionButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8f9fa',
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    actionButtonText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
        marginLeft: 6,
    },
});
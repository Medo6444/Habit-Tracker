import { useState, useEffect } from 'react';
import { HabitFormData, Templates } from '../navigation/types';
import { useHabits, HabitWithSchedule } from './UseHabits';
import { useTemplates } from './UseTemplates';
import { useRefresh } from './GlobalRefresh';
import { getScheduleCategory, FilterType } from '../utils/Schedule';

export const useHabitManagement = () => {
    const [habits, setHabits] = useState<HabitWithSchedule[]>([]);
    const [filterType, setFilterType] = useState<FilterType>('all');
    const [selectedHabit, setSelectedHabit] = useState<HabitWithSchedule | null>(null);
    const [showDetailModal, setShowDetailModal] = useState(false);

    const { createHabit, getAllHabitsWithSchedule, deleteHabit, loading: habitsLoading } = useHabits();
    const { templates, loading: templatesLoading, saveTemplate, deleteTemplate } = useTemplates();
    const { refreshTrigger, triggerRefresh } = useRefresh();

    // Load habits when component mounts or refresh is triggered
    const loadHabits = async () => {
        try {
            const allHabits = await getAllHabitsWithSchedule();
            setHabits(allHabits);
        } catch (error) {
            console.error('Error loading habits:', error);
        }
    };

    useEffect(() => {
        loadHabits();
    }, [refreshTrigger]);

    // Filter habits based on selected filter type
    const filteredHabits = habits.filter(habit => {
        if (filterType === 'all') return true;
        return getScheduleCategory(habit) === filterType;
    });

    // Apply template to form data
    const applyTemplate = (template: Templates): HabitFormData => {
        let scheduleType: 'daily' | 'weekly' | 'interval' = 'daily';
        let dowMask = template.default_dow_mask || 127;

        if (template.default_dow_mask && template.default_dow_mask !== 127) {
            scheduleType = 'weekly';
        }

        return {
            name: template.name,
            description: template.description || '',
            type: template.type,
            target_value: template.default_target ?? null,
            unit: template.unit || '',
            color: template.default_color,
            icon: template.default_icon,
            start_date: new Date().toISOString().split('T')[0],
            end_date: '',
            schedule_type: scheduleType,
            dow_mask: dowMask,
            interval_days: null,
            reminders: []
        };
    };

    // Save habit with validation and schedule type logic
    const saveHabit = async (data: HabitFormData): Promise<void> => {
        try {
            let finalData = { ...data };

            // Ensure daily habits have all days selected
            if (finalData.schedule_type === 'daily') {
                finalData.dow_mask = 127;
            }

            // Auto-convert weekly with all days to daily
            if (finalData.schedule_type === 'weekly' && finalData.dow_mask === 127) {
                finalData.schedule_type = 'daily';
            }

            // Validate weekly habits have at least one day
            if (finalData.schedule_type === 'weekly' && (!finalData.dow_mask || finalData.dow_mask === 0)) {
                throw new Error('Please select at least one day for weekly habits.');
            }

            await createHabit(finalData);
            triggerRefresh();
            await loadHabits();
        } catch (error) {
            throw error; // Re-throw to let the component handle the alert
        }
    };

    // Save habit as template
    const saveAsTemplate = async (data: HabitFormData): Promise<void> => {
        if (!data.name.trim()) {
            throw new Error('Please enter a habit name first');
        }

        try {
            await saveTemplate(data, 'custom');
            triggerRefresh();
        } catch (error) {
            throw error;
        }
    };

    // Delete habit with confirmation
    const removeHabit = async (habitId: number): Promise<void> => {
        try {
            await deleteHabit(habitId);
            triggerRefresh();
            await loadHabits();
        } catch (error) {
            throw error;
        }
    };

    // Delete custom template
    const removeCustomTemplate = async (templateId: number): Promise<void> => {
        try {
            await deleteTemplate(templateId);
            triggerRefresh();
        } catch (error) {
            throw error;
        }
    };

    // Handle habit selection for details modal
    const selectHabit = (habit: HabitWithSchedule) => {
        setSelectedHabit(habit);
        setShowDetailModal(true);
    };

    // Close details modal
    const closeDetailModal = () => {
        setSelectedHabit(null);
        setShowDetailModal(false);
    };

    return {
        // State
        habits: filteredHabits,
        allHabits: habits,
        filterType,
        selectedHabit,
        showDetailModal,
        templates,

        // Loading states
        habitsLoading,
        templatesLoading,

        // Actions
        setFilterType,
        loadHabits,
        applyTemplate,
        saveHabit,
        saveAsTemplate,
        removeHabit,
        removeCustomTemplate,
        selectHabit,
        closeDetailModal,

        // Utilities
        triggerRefresh,
    };
};
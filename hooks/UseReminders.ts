import { useState } from 'react';
import {Reminder} from '../navigation/types';

export const useReminders = (initialReminders: Reminder[] = []) => {
    const [reminders, setReminders] = useState<Reminder[]>(initialReminders);

    const addReminder = () => {
        const newReminder: Reminder = {
            minutes_after_midnight: 540, // 9 AM
            dow_mask: 127, // All days
            enabled: true
        };
        setReminders([...reminders, newReminder]);
    };

    const updateReminder = (index: number, field: keyof Reminder, value: any) => {
        const updatedReminders = [...reminders];
        updatedReminders[index] = {
            ...updatedReminders[index],
            [field]: value
        };
        setReminders(updatedReminders);
    };

    const removeReminder = (index: number) => {
        setReminders(reminders.filter((_, i) => i !== index));
    };

    const clearReminders = () => {
        setReminders([]);
    };

    const setAllReminders = (newReminders: Reminder[]) => {
        setReminders(newReminders);
    };

    return {
        reminders,
        addReminder,
        updateReminder,
        removeReminder,
        clearReminders,
        setAllReminders,
    };
};
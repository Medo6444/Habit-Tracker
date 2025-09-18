import { useState } from 'react';
import { useSQLiteContext } from 'expo-sqlite';
import { HabitFormData, Habits, HabitsEntries } from '../navigation/types';

export interface HabitWithSchedule extends Habits {
    schedule_type: 'daily' | 'weekly' | 'interval';
    dow_mask: number | null;
    interval_days: number | null;
    entry_value: number | null;
    entry_id: number | null;
}

export const useHabits = () => {
    const db = useSQLiteContext();
    const [loading, setLoading] = useState(false);

    const isHabitActiveOnDate = (habit: HabitWithSchedule, date: string): boolean => {
        const targetDate = new Date(date);
        const habitStartDate = new Date(habit.start_date);

        if (targetDate < habitStartDate) return false;
        if (habit.end_date && targetDate > new Date(habit.end_date)) return false;

        switch (habit.schedule_type) {
            case 'daily':
                return true;

            case 'weekly':
                if (!habit.dow_mask) return false;
                const jsDay = targetDate.getDay();
                const dayBit = jsDay === 0 ? 64 : Math.pow(2, jsDay - 1);
                return (habit.dow_mask & dayBit) !== 0;

            case 'interval':
                if (!habit.interval_days) return false;
                const daysDiff = Math.floor((targetDate.getTime() - habitStartDate.getTime()) / (1000 * 60 * 60 * 24));
                return daysDiff >= 0 && daysDiff % habit.interval_days === 0;

            default:
                return false;
        }
    };

    const hideHabitForDate = async (habitId: number, date: string): Promise<void> => {
        setLoading(true);
        try {
            await updateHabitEntry(habitId, date, null);

            await db.runAsync(`
                INSERT OR REPLACE INTO hidden_habits (habit_id, hidden_date)
                VALUES (?, ?)
            `, [habitId, date]);
        } catch (error) {
            console.error('Error hiding habit:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const unhideHabitForDate = async (habitId: number, date: string): Promise<void> => {
        setLoading(true);
        try {
            await db.runAsync(`
                DELETE FROM hidden_habits
                WHERE habit_id = ? AND hidden_date = ?
            `, [habitId, date]);
        } catch (error) {
            console.error('Error unhiding habit:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const getHabitsForDate = async (date: string): Promise<HabitWithSchedule[]> => {
        try {
            const habits = await db.getAllAsync<HabitWithSchedule>(`
                SELECT
                    h.*,
                    hs.schedule_type,
                    hs.dow_mask,
                    hs.interval_days,
                    he.value as entry_value,
                    he.id as entry_id
                FROM habits h
                         LEFT JOIN habit_schedules hs ON h.id = hs.habit_id
                         LEFT JOIN habit_entries he ON h.id = he.habit_id AND he.occurred_on = ?
                         LEFT JOIN hidden_habits hh ON h.id = hh.habit_id AND hh.hidden_date = ?
                WHERE h.is_archived = 0 AND hh.id IS NULL
                ORDER BY h.name
            `, [date, date]);

            if (!habits) return [];

            return habits.filter(habit => isHabitActiveOnDate(habit, date));
        } catch (error) {
            console.error('Error getting habits for date:', error);
            return [];
        }
    };

    const updateHabitEntry = async (habitId: number, date: string, value: number | null, note?: string): Promise<void> => {
        setLoading(true);
        try {
            const existingEntry = await db.getFirstAsync<HabitsEntries>(`
                SELECT * FROM habit_entries WHERE habit_id = ? AND occurred_on = ?
            `, [habitId, date]);

            if (existingEntry) {
                if (value === null) {
                    await db.runAsync('DELETE FROM habit_entries WHERE id = ?', [existingEntry.id]);
                } else {
                    // Use 'note' (singular) to match database column
                    await db.runAsync(`
                        UPDATE habit_entries
                        SET value = ?, note = ?
                        WHERE id = ?
                    `, [value, note || null, existingEntry.id]);
                }
            } else if (value !== null) {
                // Use 'note' (singular) to match database column
                await db.runAsync(`
                    INSERT INTO habit_entries (habit_id, occurred_on, value, note)
                    VALUES (?, ?, ?, ?)
                `, [habitId, date, value, note || null]);
            }
        } catch (error) {
            console.error('Error updating habit entry:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const createHabit = async (formData: HabitFormData): Promise<number> => {
        setLoading(true);
        try {
            const habitResult = await db.runAsync(`
                INSERT INTO habits (name, description, type, target_value, unit, color, icon, start_date, end_date)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [
                formData.name,
                formData.description,
                formData.type,
                formData.target_value,
                formData.unit,
                formData.color,
                formData.icon,
                formData.start_date,
                formData.end_date || null
            ]);

            const habitId = habitResult.lastInsertRowId;

            await db.runAsync(`
                INSERT INTO habit_schedules (habit_id, schedule_type, dow_mask, interval_days, start_date, timezone)
                VALUES (?, ?, ?, ?, ?, ?)
            `, [
                habitId,
                formData.schedule_type,
                formData.schedule_type === 'weekly' ? formData.dow_mask :
                    formData.schedule_type === 'daily' ? 127 : null,
                formData.schedule_type === 'interval' ? formData.interval_days : null,
                formData.start_date,
                Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
            ]);

            for (const reminder of formData.reminders) {
                await db.runAsync(`
                    INSERT INTO reminders (habit_id, minutes_after_midnight, dow_mask, enabled)
                    VALUES (?, ?, ?, ?)
                `, [
                    habitId,
                    reminder.minutes_after_midnight,
                    reminder.dow_mask,
                    reminder.enabled ? 1 : 0
                ]);
            }

            return habitId as number;
        } catch (error) {
            console.error('Error creating habit:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const updateHabit = async (habitId: number, formData: HabitFormData): Promise<void> => {
        setLoading(true);
        try {
            await db.runAsync(`
                UPDATE habits
                SET name = ?, description = ?, type = ?, target_value = ?, unit = ?,
                    color = ?, icon = ?, start_date = ?, end_date = ?
                WHERE id = ?
            `, [
                formData.name,
                formData.description,
                formData.type,
                formData.target_value,
                formData.unit,
                formData.color,
                formData.icon,
                formData.start_date,
                formData.end_date || null,
                habitId
            ]);

            await db.runAsync(`
                UPDATE habit_schedules SET schedule_type = ?, dow_mask = ?, interval_days = ?, start_date = ?
                WHERE habit_id = ?
            `, [
                formData.schedule_type,
                formData.schedule_type === 'weekly' ? formData.dow_mask :
                    formData.schedule_type === 'daily' ? 127 : null,
                formData.schedule_type === 'interval' ? formData.interval_days : null,
                formData.start_date,
                habitId
            ]);

            await db.runAsync('DELETE FROM reminders WHERE habit_id = ?', [habitId]);

            for (const reminder of formData.reminders) {
                await db.runAsync(`
                    INSERT INTO reminders (habit_id, minutes_after_midnight, dow_mask, enabled)
                    VALUES (?, ?, ?, ?)
                `, [
                    habitId,
                    reminder.minutes_after_midnight,
                    reminder.dow_mask,
                    reminder.enabled ? 1 : 0
                ]);
            }
        } catch (error) {
            console.error('Error updating habit:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const deleteHabit = async (habitId: number): Promise<void> => {
        setLoading(true);
        try {
            await db.runAsync('DELETE FROM reminders WHERE habit_id = ?', [habitId]);
            await db.runAsync('DELETE FROM habit_schedules WHERE habit_id = ?', [habitId]);
            await db.runAsync('DELETE FROM habit_entries WHERE habit_id = ?', [habitId]);
            await db.runAsync('DELETE FROM hidden_habits WHERE habit_id = ?', [habitId]);
            await db.runAsync('DELETE FROM habits WHERE id = ?', [habitId]);
        } catch (error) {
            console.error('Error deleting habit:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const getHabit = async (habitId: number): Promise<Habits | null> => {
        try {
            const result = await db.getFirstAsync<Habits>('SELECT * FROM habits WHERE id = ?', [habitId]);
            return result || null;
        } catch (error) {
            console.error('Error getting habit:', error);
            throw error;
        }
    };

    const getHabits = async (): Promise<Habits[]> => {
        try {
            const result = await db.getAllAsync<Habits>('SELECT * FROM habits WHERE is_archived = 0 ORDER BY name');
            return result;
        } catch (error) {
            console.error('Error getting habits:', error);
            throw error;
        }
    };

    const getAllHabitsWithSchedule = async (): Promise<HabitWithSchedule[]> => {
        try {
            const habits = await db.getAllAsync<HabitWithSchedule>(`
                SELECT
                    h.*,
                    hs.schedule_type,
                    hs.dow_mask,
                    hs.interval_days,
                    NULL as entry_value,
                    NULL as entry_id
                FROM habits h
                         LEFT JOIN habit_schedules hs ON h.id = hs.habit_id
                WHERE h.is_archived = 0
                ORDER BY h.name
            `);

            return habits || [];
        } catch (error) {
            console.error('Error getting all habits with schedule:', error);
            return [];
        }
    };

    return {
        loading,
        createHabit,
        updateHabit,
        deleteHabit,
        getHabit,
        getHabits,
        getHabitsForDate,
        getAllHabitsWithSchedule,
        updateHabitEntry,
        hideHabitForDate,
        unhideHabitForDate,
    };
};
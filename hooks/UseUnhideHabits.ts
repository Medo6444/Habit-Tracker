import { useState } from 'react';
import { useSQLiteContext } from 'expo-sqlite';

export const useUnhideHabits = () => {
    const db = useSQLiteContext();
    const [loading, setLoading] = useState(false);

    const getHiddenHabitsForDate = async (date: string): Promise<{
        id: number;
        habit_id: number;
        name: string;
        hidden_date: string;
    }[]> => {
        try {
            const hiddenHabits = await db.getAllAsync<{
                id: number;
                habit_id: number;
                name: string;
                hidden_date: string;
            }>(`
                SELECT
                    hh.id,
                    hh.habit_id,
                    h.name,
                    hh.hidden_date
                FROM hidden_habits hh
                         JOIN habits h ON hh.habit_id = h.id
                WHERE hh.hidden_date = ? AND h.is_archived = 0
                ORDER BY h.name
            `, [date]);

            return hiddenHabits || [];
        } catch (error) {
            console.error('Error getting hidden habits for date:', error);
            return [];
        }
    };

    const unhideHabitForDate = async (habitId: number, date: string): Promise<void> => {
        try {
            await db.runAsync(`
                DELETE FROM hidden_habits
                WHERE habit_id = ? AND hidden_date = ?
            `, [habitId, date]);
        } catch (error) {
            console.error('Error unhiding habit:', error);
            throw error;
        }
    };

    const unhideAllHabitsForDate = async (date: string): Promise<number> => {
        setLoading(true);
        try {
            // Get count of hidden habits first
            const hiddenHabits = await getHiddenHabitsForDate(date);
            const count = hiddenHabits.length;

            if (count === 0) {
                return 0;
            }

            // Remove all hidden habits for the specific date
            await db.runAsync(`
                DELETE FROM hidden_habits
                WHERE hidden_date = ?
            `, [date]);

            return count;
        } catch (error) {
            console.error('Error unhiding all habits for date:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const getHiddenHabitsCount = async (date: string): Promise<number> => {
        try {
            const result = await db.getFirstAsync<{count: number}>(`
                SELECT COUNT(*) as count
                FROM hidden_habits hh
                    JOIN habits h ON hh.habit_id = h.id
                WHERE hh.hidden_date = ? AND h.is_archived = 0
            `, [date]);

            return result?.count || 0;
        } catch (error) {
            console.error('Error getting hidden habits count:', error);
            return 0;
        }
    };

    return {
        loading,
        getHiddenHabitsForDate,
        unhideHabitForDate,
        unhideAllHabitsForDate,
        getHiddenHabitsCount,
    };
};
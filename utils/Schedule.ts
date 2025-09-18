import { HabitWithSchedule } from '../hooks/UseHabits';

export type FilterType = 'all' | 'daily' | 'weekly' | 'monthly' | 'yearly';

export const formatDaysOfWeek = (dowMask: number): string => {
    if (dowMask === 127) return 'Every day';

    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const selectedDays: string[] = [];

    for (let i = 0; i < 7; i++) {
        const dayBit = i === 6 ? 64 : Math.pow(2, i);
        if (dowMask & dayBit) {
            selectedDays.push(days[i]);
        }
    }

    return selectedDays.join(', ');
};

export const formatScheduleInfo = (habit: HabitWithSchedule): string => {
    const scheduleType = habit.schedule_type;
    switch (scheduleType) {
        case 'daily':
            return 'Daily';
        case 'weekly':
            return formatDaysOfWeek(habit.dow_mask || 127);
        case 'interval':
            if (habit.interval_days && habit.interval_days >= 365) {
                const years = Math.floor(habit.interval_days / 365);
                return `Every ${years} year${years > 1 ? 's' : ''}`;
            }
            if (habit.interval_days && habit.interval_days >= 30) {
                const months = Math.floor(habit.interval_days / 30);
                return `Every ${months} month${months > 1 ? 's' : ''}`;
            }
            if (habit.interval_days && habit.interval_days >= 7) {
                const weeks = Math.floor(habit.interval_days / 7);
                return `Every ${weeks} week${weeks > 1 ? 's' : ''}`;
            }
            return `Every ${habit.interval_days} day${habit.interval_days !== 1 ? 's' : ''}`;
        default:
            return 'Unknown';
    }
};

export const getScheduleCategory = (habit: HabitWithSchedule): FilterType => {
    const scheduleType = habit.schedule_type;
    switch (scheduleType) {
        case 'daily':
            return 'daily';
        case 'weekly':
            return 'weekly';
        case 'interval':
            if (!habit.interval_days) return 'daily';
            if (habit.interval_days >= 365) return 'yearly';
            if (habit.interval_days >= 28 && habit.interval_days <= 31) return 'monthly';
            if (habit.interval_days >= 30) {
                const months = habit.interval_days / 30;
                return months >= 12 ? 'yearly' : 'monthly';
            }
            return 'weekly';
        default:
            return 'daily';
    }
};

export const getCategoryColor = (category: FilterType): string => {
    switch (category) {
        case 'daily': return '#4CAF50';
        case 'weekly': return '#2196F3';
        case 'monthly': return '#FF9800';
        case 'yearly': return '#9C27B0';
        default: return '#757575';
    }
};

export const getScheduleHelperText = (scheduleType: 'daily' | 'weekly' | 'interval', intervalDays?: number | null): string => {
    if (scheduleType === 'daily') return "Runs every day";
    if (scheduleType === 'interval') {
        return intervalDays === 30 ? "Runs every 30 days (monthly)"
            : intervalDays === 365 ? "Runs every 365 days (yearly)"
                : "";
    }
    return "";
};

export const getCurrentScheduleType = (scheduleType: 'daily' | 'weekly' | 'interval', intervalDays?: number | null): 'daily' | 'weekly' | 'monthly' | 'yearly' => {
    if (scheduleType === 'interval') {
        return intervalDays === 365 ? 'yearly' : 'monthly';
    }
    return scheduleType as 'daily' | 'weekly';
};
export interface Habits {
    id: number;
    name: string;
    description?: string;
    type: 'boolean' | 'count' | 'quantity' | 'duration';
    target_value?: number;
    unit?: string;
    color: string;
    icon: string;
    start_date: string;
    end_date?: string;
}

export interface HabitsSchedules{
    id: number;
    habit_id: number;
    type: "daily" | "weekly" | "interval";
    dow_mask: number | null;
    interval_days: number | null;
    start_date: string;
    timezone: string;
}

export interface HabitsEntries{
    id: number;
    habit_id: number;
    occurred_on: string;
    value: number | null;
    note: string | null;
    created_at: number;
}

export interface Reminders{
    id: number;
    habit_id: number;
    minutes_after_midnight: number;
    dow_mask: number;
    enabled: number;
}

export interface Templates {
    id: number;
    name: string;
    description?: string;
    type: 'boolean' | 'count' | 'quantity' | 'duration';
    default_target?: number;
    unit?: string;
    default_dow_mask: number;
    default_color: string;
    default_icon: string;
    category: string;
}

export interface HabitFormData {
    name: string;
    description: string;
    type: 'boolean' | 'count' | 'quantity' | 'duration';
    target_value: number | null;
    unit: string;
    color: string;
    icon: string;
    start_date: string;
    end_date: string;
    schedule_type: 'daily' | 'weekly' | 'interval';
    dow_mask: number;
    interval_days: number | null;
    reminders: Reminder[];
}

export interface Reminder {
    minutes_after_midnight: number;
    dow_mask: number;
    enabled: boolean;
}
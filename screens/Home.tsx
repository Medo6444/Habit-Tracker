import * as React from "react";
import {ScrollView, Text, View, StyleSheet, TouchableOpacity} from "react-native";
import {useHabits} from "../hooks/UseHabits";
import {useUnhideHabits} from "../hooks/UseUnhideHabits";
import {useRefresh} from "../hooks/GlobalRefresh";
import {WeeklyCalendar} from "../components/WeeklyCalendar";
import {HabitItem} from "../components/habits/HabitItem";
import {ConfirmationDialog} from "../components/ui/ConfirmationDialog";

interface HabitWithSchedule {
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
    schedule_type: 'daily' | 'weekly' | 'interval';
    dow_mask: number | null;
    interval_days: number | null;
    entry_value: number | null;
    entry_id: number | null;
}

export default function Home() {
    const [selectedDate, setSelectedDate] = React.useState<string>(new Date().toISOString().split('T')[0]);
    const [habits, setHabits] = React.useState<HabitWithSchedule[]>([]);
    const [forceRender, setForceRender] = React.useState(0);
    const [hiddenHabitsCount, setHiddenHabitsCount] = React.useState(0);
    const [showUnhideDialog, setShowUnhideDialog] = React.useState(false);

    const {getHabitsForDate, updateHabitEntry, hideHabitForDate, loading} = useHabits();
    const {unhideAllHabitsForDate, getHiddenHabitsCount, loading: unhideLoading} = useUnhideHabits();
    const {refreshTrigger, triggerRefresh} = useRefresh();

    const isCurrentDay = selectedDate === new Date().toISOString().split('T')[0];

    React.useEffect(() => {
        loadHabits();
        loadHiddenHabitsCount();
    }, [selectedDate, refreshTrigger]);

    const loadHabits = async () => {
        try {
            const habitsForDate = await getHabitsForDate(selectedDate);
            const refreshedHabits = habitsForDate.map(habit => ({ ...habit }));
            setHabits(refreshedHabits);
            setForceRender(prev => prev + 1);
        } catch (error) {
            console.error('Error loading habits:', error);
        }
    };

    const loadHiddenHabitsCount = async () => {
        try {
            const count = await getHiddenHabitsCount(selectedDate);
            setHiddenHabitsCount(count);
        } catch (error) {
            console.error('Error loading hidden habits count:', error);
        }
    };

    const handleHabitUpdate = async (habitId: number, value: number | null) => {
        try {
            await updateHabitEntry(habitId, selectedDate, value);
            triggerRefresh();
        } catch (error) {
            console.error('Error updating habit entry:', error);
        }
    };

    const handleHabitDelete = async (habitId: number, date: string) => {
        try {
            await hideHabitForDate(habitId, date);
            triggerRefresh();
        } catch (error) {
            console.error('Error hiding habit:', error);
        }
    };

    const handleUnhideAll = async () => {
        try {
            const unhiddenCount = await unhideAllHabitsForDate(selectedDate);
            setShowUnhideDialog(false);

            if (unhiddenCount > 0) {
                triggerRefresh();
            }
        } catch (error) {
            console.error('Error unhiding habits:', error);
        }
    };

    const visibleHabits = habits;
    const showUnhideButton = isCurrentDay && hiddenHabitsCount > 0;

    return (
        <View style={styles.container}>
            <WeeklyCalendar
                selectedDate={selectedDate}
                onDateSelect={setSelectedDate}
            />

            <ScrollView style={styles.habitsContainer}>
                <Text style={styles.sectionTitle}>
                    Daily Habits ({visibleHabits.length})
                    {!isCurrentDay && (
                        <Text style={styles.viewOnlyText}> - View Only</Text>
                    )}
                </Text>

                {visibleHabits.length > 0 ? (
                    visibleHabits.map((habit) => (
                        <HabitItem
                            key={`habit-${habit.id}-date-${selectedDate}-entry-${habit.entry_id || 'none'}-render-${forceRender}`}
                            habit={habit}
                            selectedDate={selectedDate}
                            isCurrentDay={isCurrentDay}
                            onUpdate={handleHabitUpdate}
                            onDelete={handleHabitDelete}
                        />
                    ))
                ) : (
                    <Text style={styles.noDataText}>
                        No habits scheduled for this day
                    </Text>
                )}
            </ScrollView>

            {showUnhideButton && (
                <View style={styles.unhideButtonContainer}>
                    <TouchableOpacity
                        style={styles.unhideButton}
                        onPress={() => setShowUnhideDialog(true)}
                        disabled={unhideLoading}
                    >
                        <Text style={styles.unhideButtonText}>
                            Unhide Hidden Tasks ({hiddenHabitsCount})
                        </Text>
                    </TouchableOpacity>
                </View>
            )}

            <ConfirmationDialog
                visible={showUnhideDialog}
                title="Unhide All Tasks"
                message={`Are you sure you want to unhide all ${hiddenHabitsCount} hidden task${hiddenHabitsCount !== 1 ? 's' : ''} for today? They will appear in your daily habits list again.`}
                confirmText="Unhide All"
                cancelText="Cancel"
                onConfirm={handleUnhideAll}
                onCancel={() => setShowUnhideDialog(false)}
                confirmButtonColor="#34C759"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    habitsContainer: {
        flex: 1,
        padding: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#333',
    },
    viewOnlyText: {
        fontSize: 14,
        fontWeight: 'normal',
        color: '#666',
    },
    noDataText: {
        fontSize: 16,
        color: '#999',
        fontStyle: 'italic',
        textAlign: 'center',
        marginTop: 40,
    },
    unhideButtonContainer: {
        padding: 16,
        backgroundColor: '#f5f5f5',
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
    },
    unhideButton: {
        backgroundColor: '#34C759',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    unhideButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});
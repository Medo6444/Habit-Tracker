import React, {useState, useEffect} from 'react';
import {
    Modal,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    Alert,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {UserProfile} from '../data/PersonalInfo';


interface EditProfileModalProps {
    visible: boolean;
    profile: UserProfile;
    onClose: () => void;
    onSave: (profile: UserProfile) => void;
}

export default function EditProfileModal({
                                             visible,
                                             profile,
                                             onClose,
                                             onSave
                                         }: EditProfileModalProps) {
    const [formData, setFormData] = useState<UserProfile>({});
    const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

    useEffect(() => {
        if (visible) {
            setFormData({
                ...profile,
                joinDate: profile.joinDate || new Date().toISOString(),
            });
            setSelectedGoals(profile.goals || []);
        }
    }, [visible, profile]);

    const handleSave = () => {
        // Basic validation
        if (formData.name && formData.name.trim().length < 2) {
            Alert.alert('Error', 'Name must be at least 2 characters long.');
            return;
        }

        if (formData.age && (formData.age < 13 || formData.age > 120)) {
            Alert.alert('Error', 'Please enter a valid age between 13 and 120.');
            return;
        }

        if (formData.height && (formData.height < 100 || formData.height > 250)) {
            Alert.alert('Error', 'Please enter a valid height between 100 and 250 cm.');
            return;
        }

        if (formData.weight && (formData.weight < 30 || formData.weight > 300)) {
            Alert.alert('Error', 'Please enter a valid weight between 30 and 300 kg.');
            return;
        }

        const updatedProfile = {
            ...formData,
            goals: selectedGoals,
            name: formData.name?.trim(),
        };

        onSave(updatedProfile);
    };

    const updateField = (field: keyof UserProfile, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const toggleGoal = (goal: string) => {
        setSelectedGoals(prev => {
            if (prev.includes(goal)) {
                return prev.filter(g => g !== goal);
            } else {
                return [...prev, goal];
            }
        });
    };

    const goalOptions = [
        'Weight Loss',
        'Weight Gain',
        'Build Muscle',
        'Improve Fitness',
        'Better Sleep',
        'Stress Management',
        'Healthy Eating',
        'Mental Wellness',
        'Productivity',
        'Learning New Skills'
    ];

    const activityLevels = [
        {value: 'sedentary', label: 'Sedentary (little to no exercise)'},
        {value: 'lightly_active', label: 'Lightly Active (light exercise 1-3 days/week)'},
        {value: 'moderately_active', label: 'Moderately Active (moderate exercise 3-5 days/week)'},
        {value: 'very_active', label: 'Very Active (hard exercise 6-7 days/week)'},
        {value: 'extra_active', label: 'Extra Active (very hard exercise, physical job)'},
    ];

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={onClose}
        >
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={onClose} style={styles.headerButton}>
                        <Text style={styles.cancelText}>Cancel</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Edit Profile</Text>
                    <TouchableOpacity onPress={handleSave} style={styles.headerButton}>
                        <Text style={styles.saveText}>Save</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                    {/* Basic Information */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Basic Information</Text>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Name</Text>
                            <TextInput
                                style={styles.input}
                                value={formData.name || ''}
                                onChangeText={(text) => updateField('name', text)}
                                placeholder="Enter your name"
                                maxLength={50}
                            />
                        </View>

                        <View style={styles.row}>
                            <View style={[styles.inputGroup, styles.halfWidth]}>
                                <Text style={styles.label}>Age</Text>
                                <TextInput
                                    style={styles.input}
                                    value={formData.age?.toString() || ''}
                                    onChangeText={(text) => updateField('age', text ? parseInt(text) : undefined)}
                                    placeholder="Age"
                                    keyboardType="numeric"
                                    maxLength={3}
                                />
                            </View>

                            <View style={[styles.inputGroup, styles.halfWidth]}>
                                <Text style={styles.label}>Gender</Text>
                                <View style={styles.genderContainer}>
                                    {['male', 'female', 'other'].map((gender) => (
                                        <TouchableOpacity
                                            key={gender}
                                            style={[
                                                styles.genderOption,
                                                formData.gender === gender && styles.genderOptionSelected
                                            ]}
                                            onPress={() => updateField('gender', gender)}
                                        >
                                            <Text style={[
                                                styles.genderText,
                                                formData.gender === gender && styles.genderTextSelected
                                            ]}>
                                                {gender.charAt(0).toUpperCase() + gender.slice(1)}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        </View>

                        <View style={styles.row}>
                            <View style={[styles.inputGroup, styles.halfWidth]}>
                                <Text style={styles.label}>Height (cm)</Text>
                                <TextInput
                                    style={styles.input}
                                    value={formData.height?.toString() || ''}
                                    onChangeText={(text) => updateField('height', text ? parseInt(text) : undefined)}
                                    placeholder="170"
                                    keyboardType="numeric"
                                    maxLength={3}
                                />
                            </View>

                            <View style={[styles.inputGroup, styles.halfWidth]}>
                                <Text style={styles.label}>Weight (kg)</Text>
                                <TextInput
                                    style={styles.input}
                                    value={formData.weight?.toString() || ''}
                                    onChangeText={(text) => updateField('weight', text ? parseInt(text) : undefined)}
                                    placeholder="70"
                                    keyboardType="numeric"
                                    maxLength={3}
                                />
                            </View>
                        </View>
                    </View>

                    {/* Activity Level */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Activity Level</Text>
                        {activityLevels.map((level) => (
                            <TouchableOpacity
                                key={level.value}
                                style={[
                                    styles.activityOption,
                                    formData.activityLevel === level.value && styles.activityOptionSelected
                                ]}
                                onPress={() => updateField('activityLevel', level.value)}
                            >
                                <View style={styles.radioButton}>
                                    {formData.activityLevel === level.value && (
                                        <View style={styles.radioButtonSelected}/>
                                    )}
                                </View>
                                <Text style={[
                                    styles.activityText,
                                    formData.activityLevel === level.value && styles.activityTextSelected
                                ]}>
                                    {level.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Goals */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Goals (Select all that apply)</Text>
                        <View style={styles.goalsGrid}>
                            {goalOptions.map((goal) => (
                                <TouchableOpacity
                                    key={goal}
                                    style={[
                                        styles.goalChip,
                                        selectedGoals.includes(goal) && styles.goalChipSelected
                                    ]}
                                    onPress={() => toggleGoal(goal)}
                                >
                                    <Text style={[
                                        styles.goalChipText,
                                        selectedGoals.includes(goal) && styles.goalChipTextSelected
                                    ]}>
                                        {goal}
                                    </Text>
                                    {selectedGoals.includes(goal) && (
                                        <Ionicons name="checkmark" size={16} color="white"/>
                                    )}
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Preferences */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Preferences</Text>

                        <View style={styles.preferenceRow}>
                            <Text style={styles.preferenceLabel}>Enable Notifications</Text>
                            <TouchableOpacity
                                style={[
                                    styles.toggle,
                                    formData.preferences?.notifications && styles.toggleActive
                                ]}
                                onPress={() => updateField('preferences', {
                                    ...formData.preferences,
                                    notifications: !formData.preferences?.notifications
                                })}
                            >
                                <View style={[
                                    styles.toggleThumb,
                                    formData.preferences?.notifications && styles.toggleThumbActive
                                ]}/>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.preferenceRow}>
                            <Text style={styles.preferenceLabel}>Reminder Sound</Text>
                            <TouchableOpacity
                                style={[
                                    styles.toggle,
                                    formData.preferences?.reminders && styles.toggleActive
                                ]}
                                onPress={() => updateField('preferences', {
                                    ...formData.preferences,
                                    reminderSound: !formData.preferences?.reminders
                                })}
                            >
                                <View style={[
                                    styles.toggleThumb,
                                    formData.preferences?.reminders && styles.toggleThumbActive
                                ]}/>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </Modal>
    );
}

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
        paddingTop: Platform.OS === 'ios' ? 60 : 20,
        paddingBottom: 15,
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    headerButton: {
        minWidth: 60,
    },
    cancelText: {
        fontSize: 16,
        color: '#666666',
    },
    saveText: {
        fontSize: 16,
        color: '#007AFF',
        fontWeight: '600',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333333',
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    section: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        marginTop: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333333',
        marginBottom: 20,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: '#666666',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 8,
        paddingHorizontal: 15,
        paddingVertical: 12,
        fontSize: 16,
        backgroundColor: '#ffffff',
        color: '#333333',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    halfWidth: {
        width: '48%',
    },
    genderContainer: {
        flexDirection: 'column',
        gap: 8,
    },
    genderOption: {
        flex: 1,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
    genderOptionSelected: {
        backgroundColor: '#007AFF',
        borderColor: '#007AFF',
    },
    genderText: {
        fontSize: 14,
        color: '#666666',
    },
    genderTextSelected: {
        color: '#ffffff',
        fontWeight: '500',
    },
    activityOption: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 15,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        marginBottom: 10,
        backgroundColor: '#ffffff',
    },
    activityOptionSelected: {
        backgroundColor: '#f0f8ff',
        borderColor: '#007AFF',
    },
    radioButton: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#cccccc',
        marginRight: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    radioButtonSelected: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#007AFF',
    },
    activityText: {
        fontSize: 14,
        color: '#333333',
        flex: 1,
    },
    activityTextSelected: {
        color: '#007AFF',
        fontWeight: '500',
    },
    goalsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    goalChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        backgroundColor: '#ffffff',
        gap: 5,
    },
    goalChipSelected: {
        backgroundColor: '#007AFF',
        borderColor: '#007AFF',
    },
    goalChipText: {
        fontSize: 14,
        color: '#666666',
    },
    goalChipTextSelected: {
        color: '#ffffff',
        fontWeight: '500',
    },
    preferenceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    preferenceLabel: {
        fontSize: 16,
        color: '#333333',
    },
    toggle: {
        width: 50,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#e0e0e0',
        justifyContent: 'center',
        paddingHorizontal: 2,
    },
    toggleActive: {
        backgroundColor: '#007AFF',
    },
    toggleThumb: {
        width: 26,
        height: 26,
        borderRadius: 13,
        backgroundColor: '#ffffff',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3,
        elevation: 3,
    },
    toggleThumbActive: {
        alignSelf: 'flex-end',
    },
});
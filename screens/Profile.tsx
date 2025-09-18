import React, {useState} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    Alert
} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {useUserProfile, calculateBMI, getBMICategory} from '../data/PersonalInfo';
import EditProfileModal from '../components/EditProfileModel';

export default function Profile() {
    const {profile, loading, error, updateProfile} = useUserProfile();
    const [showEditModal, setShowEditModal] = useState(false);

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#007AFF"/>
                <Text style={styles.loadingText}>Loading profile...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.errorText}>Error loading profile: {error}</Text>
            </View>
        );
    }

    const getBMIInfo = () => {
        if (profile.weight && profile.height) {
            const bmi = calculateBMI(profile.weight, profile.height);
            const category = getBMICategory(bmi);
            return {bmi, category};
        }
        return null;
    };

    const bmiInfo = getBMIInfo();

    const handleEditSave = async (updatedProfile: any) => {
        try {
            await updateProfile(updatedProfile);
            setShowEditModal(false);
            Alert.alert('Success', 'Profile updated successfully!');
        } catch (error) {
            Alert.alert('Error', 'Failed to update profile. Please try again.');
        }
    };

    return (
        <View style={styles.container}>
            {/* Header with edit button */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => setShowEditModal(true)}
                >
                    <Ionicons name="settings" size={24} color="#007AFF"/>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Profile Card */}
                <View style={styles.profileCard}>
                    {/* Avatar/Initial */}
                    <View style={styles.avatarContainer}>
                        <View style={styles.avatar}>
                            <Text style={styles.avatarText}>
                                {profile.name ? profile.name.charAt(0).toUpperCase() : 'U'}
                            </Text>
                        </View>
                    </View>

                    {/* Name */}
                    <Text style={styles.nameText}>
                        {profile.name || 'Set your name'}
                    </Text>

                    {/* Basic Info */}
                    <View style={styles.infoGrid}>
                        <View style={styles.infoItem}>
                            <Text style={styles.infoLabel}>Age</Text>
                            <Text style={styles.infoValue}>
                                {profile.age ? `${profile.age} years` : 'Not set'}
                            </Text>
                        </View>

                        <View style={styles.infoItem}>
                            <Text style={styles.infoLabel}>Height</Text>
                            <Text style={styles.infoValue}>
                                {profile.height ? `${profile.height} cm` : 'Not set'}
                            </Text>
                        </View>

                        <View style={styles.infoItem}>
                            <Text style={styles.infoLabel}>Weight</Text>
                            <Text style={styles.infoValue}>
                                {profile.weight ? `${profile.weight} kg` : 'Not set'}
                            </Text>
                        </View>

                        <View style={styles.infoItem}>
                            <Text style={styles.infoLabel}>Gender</Text>
                            <Text style={styles.infoValue}>
                                {profile.gender ? profile.gender.charAt(0).toUpperCase() + profile.gender.slice(1) : 'Not set'}
                            </Text>
                        </View>
                    </View>

                    {/* BMI Card */}
                    {bmiInfo && (
                        <View style={styles.bmiCard}>
                            <Text style={styles.bmiTitle}>Body Mass Index</Text>
                            <View style={styles.bmiContent}>
                                <Text style={styles.bmiValue}>{bmiInfo.bmi}</Text>
                                <Text style={[
                                    styles.bmiCategory,
                                    {
                                        color: bmiInfo.bmi < 18.5 ? '#FF9500' :
                                            bmiInfo.bmi < 25 ? '#34C759' :
                                                bmiInfo.bmi < 30 ? '#FF9500' : '#FF3B30'
                                    }
                                ]}>
                                    {bmiInfo.category}
                                </Text>
                            </View>
                        </View>
                    )}

                    {/* Additional Info */}
                    {profile.activityLevel && (
                        <View style={styles.additionalInfo}>
                            <Text style={styles.additionalInfoLabel}>Activity Level</Text>
                            <Text style={styles.additionalInfoValue}>
                                {profile.activityLevel.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </Text>
                        </View>
                    )}

                    {profile.goals && profile.goals.length > 0 && (
                        <View style={styles.additionalInfo}>
                            <Text style={styles.additionalInfoLabel}>Goals</Text>
                            <View style={styles.goalsContainer}>
                                {profile.goals.map((goal, index) => (
                                    <View key={index} style={styles.goalChip}>
                                        <Text style={styles.goalText}>{goal}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}
                </View>

                {/* Quick Stats */}
                <View style={styles.statsCard}>
                    <Text style={styles.statsTitle}>Quick Stats</Text>
                    <View style={styles.statsGrid}>
                        <View style={styles.statItem}>
                            <Ionicons name="calendar" size={20} color="#007AFF"/>
                            <Text style={styles.statLabel}>Joined</Text>
                            <Text style={styles.statValue}>
                                {profile.joinDate ? new Date(profile.joinDate).toLocaleDateString() : 'Today'}
                            </Text>
                        </View>

                        <View style={styles.statItem}>
                            <Ionicons name="time" size={20} color="#007AFF"/>
                            <Text style={styles.statLabel}>Timezone</Text>
                            <Text style={styles.statValue}>
                                {profile.timezone || 'Africa/Cairo'}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Empty state for incomplete profile */}
                {!profile.name && !profile.age && !profile.weight && !profile.height && (
                    <View style={styles.emptyState}>
                        <Ionicons name="person-add" size={48} color="#999"/>
                        <Text style={styles.emptyStateTitle}>Complete Your Profile</Text>
                        <Text style={styles.emptyStateText}>
                            Tap the settings icon to add your personal information and get personalized insights.
                        </Text>
                    </View>
                )}
            </ScrollView>

            {/* Edit Profile Modal */}
            <EditProfileModal
                visible={showEditModal}
                profile={profile}
                onClose={() => setShowEditModal(false)}
                onSave={handleEditSave}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: '#666',
    },
    errorText: {
        fontSize: 16,
        color: '#ff3333',
        textAlign: 'center',
        paddingHorizontal: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 5,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    editButton: {
        padding: 8,
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    profileCard: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 24,
        marginTop: 20,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        alignItems: 'center',
    },
    avatarContainer: {
        marginBottom: 16,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#007AFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: 'white',
    },
    nameText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
    },
    infoGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 20,
    },
    infoItem: {
        width: '48%',
        marginBottom: 16,
    },
    infoLabel: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    infoValue: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    bmiCard: {
        backgroundColor: '#f8f9ff',
        borderRadius: 12,
        padding: 16,
        width: '100%',
        marginBottom: 16,
        borderLeftWidth: 4,
        borderLeftColor: '#007AFF',
    },
    bmiTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    bmiContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    bmiValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#007AFF',
    },
    bmiCategory: {
        fontSize: 16,
        fontWeight: '600',
    },
    additionalInfo: {
        width: '100%',
        marginBottom: 12,
    },
    additionalInfoLabel: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    additionalInfoValue: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    goalsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    goalChip: {
        backgroundColor: '#e3f2fd',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    goalText: {
        fontSize: 14,
        color: '#1976d2',
        fontWeight: '500',
    },
    statsCard: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 20,
        marginTop: 16,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    statsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 16,
    },
    statsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    statLabel: {
        fontSize: 14,
        color: '#666',
        marginTop: 8,
        marginBottom: 4,
    },
    statValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        textAlign: 'center',
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 40,
        paddingHorizontal: 20,
    },
    emptyStateTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 16,
        marginBottom: 8,
    },
    emptyStateText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        lineHeight: 22,
    },
});
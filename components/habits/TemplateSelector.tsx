import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Templates } from '../../navigation/types';
import { HABIT_TYPES } from '../../utils/HabitConstants';

interface TemplateSelectorProps {
    templates: Templates[];
    onSelectTemplate: (template: Templates) => void;
    onBack: () => void;
    onDeleteTemplate?: (templateId: number) => void;
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
                                                                      templates,
                                                                      onSelectTemplate,
                                                                      onBack,
                                                                      onDeleteTemplate,
                                                                  }) => {
    const groupedTemplates = templates.reduce((acc, template) => {
        if (!acc[template.category]) acc[template.category] = [];
        acc[template.category].push(template);
        return acc;
    }, {} as Record<string, Templates[]>);

    const handleLongPress = (template: Templates) => {
        if (template.category === 'custom' && onDeleteTemplate) {
            Alert.alert(
                'Delete Template',
                `Are you sure you want to delete the template "${template.name}"?`,
                [
                    { text: 'Cancel', style: 'cancel' },
                    {
                        text: 'Delete',
                        style: 'destructive',
                        onPress: () => onDeleteTemplate(template.id)
                    }
                ]
            );
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={onBack}>
                    <Ionicons name="arrow-back" size={24} color="#007AFF" />
                    <Text style={styles.backText}>Back</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Choose Template</Text>
            </View>

            <ScrollView style={styles.templatesContainer}>
                {Object.entries(groupedTemplates).map(([category, categoryTemplates]) => (
                    <View key={category} style={styles.categorySection}>
                        <Text style={styles.categoryTitle}>
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                        </Text>
                        {categoryTemplates.map((template) => (
                            <TouchableOpacity
                                key={template.id}
                                style={styles.templateCard}
                                onPress={() => onSelectTemplate(template)}
                                onLongPress={() => handleLongPress(template)}
                                delayLongPress={800}
                            >
                                <View style={[styles.templateIcon, { backgroundColor: template.default_color }]}>
                                    <Ionicons name={template.default_icon as any} size={24} color="white" />
                                </View>
                                <View style={styles.templateInfo}>
                                    <Text style={styles.templateName}>{template.name}</Text>
                                    <Text style={styles.templateDescription}>{template.description}</Text>
                                    <Text style={styles.templateType}>
                                        {HABIT_TYPES.find(t => t.key === template.type)?.label}
                                        {template.default_target && ` • ${template.default_target} ${template.unit || ''}`}
                                    </Text>
                                </View>
                                <View style={styles.templateActions}>
                                    {template.category === 'custom' && onDeleteTemplate && (
                                        <Text style={styles.customBadge}>CUSTOM</Text>
                                    )}
                                    <Ionicons name="chevron-forward" size={20} color="#ccc" />
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};

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
        paddingVertical: 16,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backText: {
        color: '#007AFF',
        fontSize: 16,
        marginLeft: 4,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        flex: 1,
    },
    templatesContainer: {
        flex: 1,
    },
    categorySection: {
        marginBottom: 24,
    },
    categoryTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginHorizontal: 20,
        marginBottom: 12,
        marginTop: 8,
    },
    templateCard: {
        backgroundColor: 'white',
        marginHorizontal: 20,
        marginBottom: 8,
        padding: 16,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    templateIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    templateInfo: {
        flex: 1,
    },
    templateName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    templateDescription: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    templateType: {
        fontSize: 12,
        color: '#999',
    },
    templateActions: {
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    customBadge: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#007AFF',
        backgroundColor: '#f0f8ff',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        textAlign: 'center',
        marginBottom: 4,
    },
});
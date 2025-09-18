import { useState, useEffect } from 'react';
import { useSQLiteContext } from 'expo-sqlite';
import { Templates, HabitFormData } from '../navigation/types';
import { getValidIcon } from '../utils/HabitConstants';

export const useTemplates = () => {
    const db = useSQLiteContext();
    const [templates, setTemplates] = useState<Templates[]>([]);
    const [loading, setLoading] = useState(false);

    const loadTemplates = async () => {
        setLoading(true);
        try {
            const result = await db.getAllAsync<Templates>(`
                SELECT * FROM templates ORDER BY category, name;
            `);
            // Ensure all icons are valid
            const validatedTemplates = result.map(template => ({
                ...template,
                default_icon: getValidIcon(template.default_icon)
            }));
            setTemplates(validatedTemplates);
        } catch (error) {
            console.error('Error loading templates:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const saveTemplate = async (formData: HabitFormData, category: string = 'custom') => {
        setLoading(true);
        try {
            await db.runAsync(`
                INSERT INTO templates (name, description, type, default_target, unit, default_dow_mask, default_color, default_icon, category)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [
                formData.name,
                formData.description,
                formData.type,
                formData.target_value,
                formData.unit,
                formData.dow_mask,
                formData.color,
                getValidIcon(formData.icon), // Validate icon before saving
                category
            ]);
            await loadTemplates(); // Refresh templates
        } catch (error) {
            console.error('Error saving template:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const deleteTemplate = async (templateId: number) => {
        setLoading(true);
        try {
            await db.runAsync('DELETE FROM templates WHERE id = ?', [templateId]);
            await loadTemplates(); // Refresh templates
        } catch (error) {
            console.error('Error deleting template:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const getGroupedTemplates = () => {
        return templates.reduce((acc, template) => {
            if (!acc[template.category]) acc[template.category] = [];
            acc[template.category].push(template);
            return acc;
        }, {} as Record<string, Templates[]>);
    };

    useEffect(() => {
        loadTemplates();
    }, []);

    return {
        templates,
        loading,
        loadTemplates,
        saveTemplate,
        deleteTemplate,
        getGroupedTemplates,
    };
};
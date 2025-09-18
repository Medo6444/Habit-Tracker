import {SQLiteDatabase} from 'expo-sqlite';
import { getValidIcon } from '../utils/HabitConstants';

// Function to convert your template data to the correct format
export const processTemplateData = (templates: any[][]) => {
    return templates.map(template => ({
        name: template[0],
        description: template[1],
        type: template[2],
        default_target: template[3],
        unit: template[4],
        default_dow_mask: template[5],
        default_color: template[6],
        default_icon: getValidIcon(template[7]), // Convert to valid icon
        category: template[8]
    }));
};

// Function to populate database with templates
export const populateTemplates = async (db: SQLiteDatabase) => {
    const templates = [
        // Health & Wellness
        ['Drink Water', 'Stay hydrated throughout the day', 'count', 8, 'glasses', 127, '#4FC3F7', 'water-drop', 'health'],
        ['Take Vitamins', 'Daily vitamin supplements', 'boolean', null, null, 127, '#FF9800', 'pill', 'health'],
        ['Sleep 8 Hours', 'Get adequate sleep for recovery', 'duration', 8, 'hours', 127, '#9C27B0', 'moon', 'health'],
        ['Skincare Routine', 'Morning and evening skincare', 'boolean', null, null, 127, '#E91E63', 'face', 'health'],
        ['Brush Teeth', 'Maintain oral hygiene', 'count', 2, 'times', 127, '#00BCD4', 'tooth', 'health'],

        // Fitness & Exercise
        ['Daily Walk', 'Take a walk for physical activity', 'duration', 30, 'minutes', 127, '#4CAF50', 'walk', 'fitness'],
        ['Workout', 'Exercise or gym session', 'duration', 45, 'minutes', 62, '#FF5722', 'dumbbell', 'fitness'],
        ['Yoga/Stretching', 'Practice yoga or stretching', 'duration', 20, 'minutes', 127, '#673AB7', 'lotus', 'fitness'],
        ['Push-ups', 'Daily push-up exercise', 'count', 20, 'reps', 127, '#795548', 'fitness', 'fitness'],
        ['Steps Goal', 'Daily step count target', 'count', 10000, 'steps', 127, '#2196F3', 'footsteps', 'fitness'],

        // Productivity
        ['Read Books', 'Daily reading habit', 'duration', 30, 'minutes', 127, '#8BC34A', 'book', 'productivity'],
        ['Learn New Language', 'Language learning practice', 'duration', 15, 'minutes', 127, '#FF9800', 'language', 'productivity'],
        ['Journal Writing', 'Daily journaling or reflection', 'boolean', null, null, 127, '#607D8B', 'journal', 'productivity'],
        ['No Social Media', 'Avoid social media during work hours', 'boolean', null, null, 62, '#F44336', 'no-phone', 'productivity'],
        ['Deep Work Session', 'Focused work without distractions', 'duration', 90, 'minutes', 62, '#3F51B5', 'focus', 'productivity'],

        // Mindfulness & Mental Health
        ['Meditation', 'Daily mindfulness meditation', 'duration', 10, 'minutes', 127, '#9C27B0', 'meditation', 'mindfulness'],
        ['Gratitude Practice', 'Write down things you are grateful for', 'count', 3, 'items', 127, '#FF9800', 'heart', 'mindfulness'],
        ['Practice Breathing', 'Deep breathing exercises', 'duration', 5, 'minutes', 127, '#00BCD4', 'lungs', 'mindfulness'],
        ['Digital Detox', 'Time away from screens before bed', 'duration', 60, 'minutes', 127, '#795548', 'no-phone', 'mindfulness'],

        // Social & Relationships
        ['Call Family/Friends', 'Connect with loved ones', 'boolean', null, null, 85, '#E91E63', 'phone', 'social'],
        ['Practice Kindness', 'Do something kind for others', 'boolean', null, null, 127, '#FFEB3B', 'heart-hands', 'social'],
        ['Date Night', 'Quality time with partner', 'boolean', null, null, 32, '#E91E63', 'couple', 'social'],

        // Learning & Skills
        ['Practice Instrument', 'Music practice session', 'duration', 30, 'minutes', 127, '#9C27B0', 'music', 'learning'],
        ['Code Practice', 'Programming or coding practice', 'duration', 60, 'minutes', 62, '#4CAF50', 'code', 'learning'],
        ['Online Course', 'Study online course material', 'duration', 45, 'minutes', 85, '#2196F3', 'graduation', 'learning'],

        // Creativity & Hobbies
        ['Creative Writing', 'Write creatively for personal enjoyment', 'duration', 30, 'minutes', 85, '#FF9800', 'pen', 'creativity'],
        ['Drawing/Art', 'Practice drawing or artistic skills', 'duration', 30, 'minutes', 85, '#9C27B0', 'palette', 'creativity'],
        ['Photography', 'Take photos and practice photography', 'count', 5, 'photos', 85, '#607D8B', 'camera', 'creativity'],

        // Household & Organization
        ['Make Bed', 'Start the day by making your bed', 'boolean', null, null, 127, '#8BC34A', 'bed', 'household'],
        ['Clean/Organize', 'Daily tidying and organizing', 'duration', 15, 'minutes', 127, '#00BCD4', 'broom', 'household'],
        ['Meal Prep', 'Prepare meals in advance', 'boolean', null, null, 65, '#4CAF50', 'chef', 'household']
    ];

    const processedTemplates = processTemplateData(templates);

    try {
        // Insert processed templates
        for (const template of processedTemplates) {
            await db.runAsync(`
                INSERT OR REPLACE INTO templates 
                (name, description, type, default_target, unit, default_dow_mask, default_color, default_icon, category)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [
                template.name,
                template.description,
                template.type,
                template.default_target,
                template.unit,
                template.default_dow_mask,
                template.default_color,
                template.default_icon,
                template.category
            ]);
        }

        console.log('Templates populated successfully');
    } catch (error) {
        console.error('Error populating templates:', error);
        throw error;
    }
};
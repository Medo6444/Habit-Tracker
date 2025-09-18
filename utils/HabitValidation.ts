import { HabitFormData } from '../navigation/types';

export interface ValidationError {
    field: string;
    message: string;
}

export const validateHabitForm = (formData: HabitFormData): ValidationError[] => {
    const errors: ValidationError[] = [];

    if (!formData.name.trim()) {
        errors.push({ field: 'name', message: 'Please enter a habit name' });
    }

    if ((formData.type === 'count' || formData.type === 'quantity' || formData.type === 'duration')
        && !formData.target_value) {
        errors.push({ field: 'target_value', message: 'Please set a target value for this habit type' });
    }

    if (formData.target_value !== null && formData.target_value <= 0) {
        errors.push({ field: 'target_value', message: 'Target value must be greater than 0' });
    }

    if (!isValidDate(formData.start_date)) {
        errors.push({ field: 'start_date', message: 'Please enter a valid start date' });
    }

    if (formData.end_date && !isValidDate(formData.end_date)) {
        errors.push({ field: 'end_date', message: 'Please enter a valid end date' });
    }

    if (formData.end_date && formData.start_date &&
        new Date(formData.end_date) <= new Date(formData.start_date)) {
        errors.push({ field: 'end_date', message: 'End date must be after start date' });
    }

    if (formData.dow_mask === 0) {
        errors.push({ field: 'dow_mask', message: 'Please select at least one day' });
    }

    return errors;
};

const isValidDate = (dateString: string): false | RegExpMatchArray | null => {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime()) &&
        dateString.match(/^\d{4}-\d{2}-\d{2}$/);
};

export const getFirstValidationError = (formData: HabitFormData): string | null => {
    const errors = validateHabitForm(formData);
    return errors.length > 0 ? errors[0].message : null;
};
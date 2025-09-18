export const COLORS = [
    '#007AFF', '#FF9800', '#4CAF50', '#E91E63',
    '#9C27B0', '#00BCD4', '#FF5722', '#795548'
];

export const ICONS = [
    'checkmark-circle', 'fitness', 'book', 'water',
    'heart', 'time', 'star', 'target', 'medical',
    'moon', 'walk', 'barbell', 'leaf', 'footsteps',
    'school', 'library', 'journal', 'phone-portrait',
    'call', 'hand-left', 'musical-notes', 'code-slash',
    'camera', 'bed', 'restaurant', 'brush'
];

// Icon mapping for template compatibility
export const ICON_MAPPING: Record<string, string> = {
    'water-drop': 'water',
    'pill': 'medical',
    'face': 'person-circle',
    'tooth': 'medical',
    'dumbbell': 'barbell',
    'lotus': 'leaf',
    'footsteps': 'walk',
    'language': 'library',
    'journal': 'book',
    'no-phone': 'phone-portrait',
    'focus': 'eye',
    'meditation': 'leaf',
    'lungs': 'medical',
    'phone': 'call',
    'couple': 'heart',
    'heart-hands': 'hand-left',
    'music': 'musical-notes',
    'code': 'code-slash',
    'graduation': 'school',
    'pen': 'create',
    'palette': 'brush',
    'broom': 'brush',
    'chef': 'restaurant'
};

// Function to get valid icon name
export const getValidIcon = (iconName: string): string => {
    return ICON_MAPPING[iconName] || iconName;
};

export const HABIT_TYPES = [
    { key: 'boolean', label: 'Yes/No', description: 'Simple completion tracking' },
    { key: 'count', label: 'Counter', description: 'Track number of times' },
    { key: 'quantity', label: 'Quantity', description: 'Track amounts with units' },
    { key: 'duration', label: 'Duration', description: 'Track time spent' }
] as const;

export const DAYS_OF_WEEK = [
    { key: 1, label: 'Mon', full: 'Monday' },
    { key: 2, label: 'Tue', full: 'Tuesday' },
    { key: 4, label: 'Wed', full: 'Wednesday' },
    { key: 8, label: 'Thu', full: 'Thursday' },
    { key: 16, label: 'Fri', full: 'Friday' },
    { key: 32, label: 'Sat', full: 'Saturday' },
    { key: 64, label: 'Sun', full: 'Sunday' }
];
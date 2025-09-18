export const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
    return `${displayHours}:${mins.toString().padStart(2, '0')} ${period}`;
};

export const timeToMinutes = (hours: number, minutes: number): number => {
    return hours * 60 + minutes;
};

export const minutesToTime = (minutes: number): { hours: number; minutes: number } => {
    return {
        hours: Math.floor(minutes / 60),
        minutes: minutes % 60
    };
};
export const getInitials = (name: string): string => {
    if (!name) return '';

    const words = name.trim().split(/\s+/);
    return words.length > 1
        ? words[0][0].toUpperCase() + words[words.length - 1][0].toUpperCase()
        : words[0][0].toUpperCase();
};

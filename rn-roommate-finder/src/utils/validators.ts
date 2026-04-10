export const validateRequiredField = (value: string): boolean => {
    return value.trim().length > 0;
};

export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const validateAge = (age: number): boolean => {
    return age >= 18 && age <= 100;
};

export const validateGroupName = (name: string): boolean => {
    return name.trim().length >= 3;
};
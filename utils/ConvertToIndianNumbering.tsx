export const convertToIndianNumbering = (num: number) => {
    let formattedNumber: string;

    // Check if number is in Crores (>= 1 Cr)
    if (num >= 10000000) {
        formattedNumber = (num / 10000000).toFixed(1) + ' Cr'; // Crores
    }
    // Check if number is in Lakhs (>= 1 Lakh)
    else if (num >= 100000) {
        formattedNumber = (num / 100000).toFixed(1) + ' L'; // Lakhs
    } else if (num <= 0) {
        formattedNumber = String(0);
    } else {
        formattedNumber = String(num);
    }

    // Check if the formatted string length exceeds 10 characters and truncate if needed
    if (formattedNumber.length > 8) {
        const numberWithoutSuffix = formattedNumber.split(' ')[0]; // Get the number part without 'Cr' or 'L'
        const suffix = formattedNumber.split(' ')[1]; // Get the suffix part (either 'Cr' or 'L')
        return numberWithoutSuffix.slice(0, 3) + '.. ' + suffix; // Truncate number part and keep suffix
    }

    return formattedNumber;
};

export const formatDate = (date: Date) => {
    return date
        .toLocaleString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
            timeZone: 'Asia/Dhaka',
        })
        .replace(',', ' at');
};

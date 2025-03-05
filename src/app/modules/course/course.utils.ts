export const generateWeeks = (startDateStr: string, endDateStr: string) => {
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);

    const durationMs = endDate.getTime() - startDate.getTime();
    const durationDays = durationMs / (1000 * 60 * 60 * 24);
    const durationInWeeks = Math.ceil(durationDays / 7);

    return durationInWeeks;
};

export const transformNumber = (num) => {
    const transformedNumber = "0" + num?.replace(/[-()]/g, "")?.slice(-9);
    return transformedNumber;
};
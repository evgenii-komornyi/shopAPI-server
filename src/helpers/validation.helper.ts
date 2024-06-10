const countryIndices: Record<string, number> = {
    Latvia: 0,
    Estonia: 1,
    Lithuania: 2,
};

export const countryIndex = (country: string): number => {
    return countryIndices[country] ?? -1;
};

export const trim = (valueToTrim: string) => valueToTrim.trim();

export const isNullOrEmpty = (value: string | null | undefined): boolean =>
    value == null || value.length == 0;

export const sanitize = (value: string): string =>
    value && value.replace(/[<>]/g, '');

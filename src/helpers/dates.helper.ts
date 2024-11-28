export const getCurrentDateTime = (): string =>
    new Date().toJSON().replace(/\..*$/, '').replace('T', ' ');

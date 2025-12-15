import { ZodError, z } from 'zod';

export const getErrors = (data: { success: false; error: ZodError }) => {
    const { error } = data;
    return error.errors.reduce((total, err) => {
        //@ts-ignore
        const key = err?.path?.length ? err.path[0] : err?.validation;
        const value = err.message;
        if (!Object.keys(total).includes(key as string)) {
            return {
                ...total, [key]: [value]
            }
        }
        // push new error associated to same key
        total[key].push(value)
        return total
    }, {})
}
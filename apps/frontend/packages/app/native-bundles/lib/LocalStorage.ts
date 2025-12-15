import AsyncStorage from '@react-native-async-storage/async-storage'

export default {
    write: async function write(key: string, value: any): Promise<void> {
        return await AsyncStorage.setItem(key, JSON.stringify(value));
    },

    read: async function read(key: string): Promise<any> {
        const item = await AsyncStorage.getItem(key);
        return JSON.parse(item ?? "false");
    },

    clear: async function clear(key: string): Promise<void> {
        return await AsyncStorage.removeItem(key);
    }
}
import Storage from "app/native-bundles/lib/LocalStorage";
import { create } from "zustand";
import { produce } from "immer";
import { SessionDataType } from "app/bundles/auth/models/session";

const persistSession = async (_session: SessionDataType) => {
    await Storage.write("session", _session);
};

const clearPersistedSession = async () => {
    await Storage.clear("session");
};


type SessionContext = {
    session: SessionDataType | undefined
    createSession: any
    clearSession: any
    loadSession: any
}

export const useSessionStore = create<SessionContext>((set) => ({
    session: undefined,
    createSession: async (payload: SessionDataType) => {
        await persistSession(payload);
        set(produce((state) => {
            state.session = payload;
        }))
    },
    clearSession: async () => {
        await clearPersistedSession();
        set(produce((state) => {
            state.session = undefined;
        }))
    },
    loadSession: async () => {
        const storedSession = await Storage.read("session");
        if (storedSession) {
            set(produce((state) => {
                state.session = storedSession;
            }))
        }
    }
}))
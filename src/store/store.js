import { create } from 'zustand'
import settingsSlice from './settingsSlice'
import appointmentsSlice from './appointmentSlice'

// helper: wrap `set` so updates are scoped to a given key
const namespacedSet = (set, key) => (partial) =>
    set((state) => ({
        [key]: { ...state[key], ...partial },
    }))

const useStore = create((set, get) => ({
    settings: settingsSlice(namespacedSet(set, 'settings'), get),
    appointments: appointmentsSlice(namespacedSet(set, 'appointments'), get),
}))

export default useStore

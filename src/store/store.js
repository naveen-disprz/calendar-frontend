import { create } from 'zustand'
import settingsSlice from './settingsSlice'
import appointmentsSlice from './appointmentSlice'

// helper: wrap `set` so updates are scoped to a given key
const namespacedSet = (set, key) => (partial) =>
    set((state) => ({
        [key]: { ...state[key], ...partial },
    }))

const useStore = create((set) => ({
    settings: settingsSlice(namespacedSet(set, 'settings')),
    appointments: appointmentsSlice(namespacedSet(set, 'appointments')),
}))

export default useStore

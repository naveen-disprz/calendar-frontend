const settingsSlice = (set) => ({
    theme: 'light',
    setTheme: (theme) => set({ theme }),
});

export default settingsSlice;

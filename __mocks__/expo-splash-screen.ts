// The native splash module needs the real `react-native`; many suites mock it partially. No splash in tests.
export const preventAutoHideAsync = async () => false;
export const setOptions = () => {};
export const hide = () => {};
export const hideAsync = async () => {};

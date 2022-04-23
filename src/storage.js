const storage = window.localStorage;

export const setItem = (key, value) => {
  try {
    storage.setItem(key, JSON.stringify(value));
  } catch (e) {
    alert('localStorage 저장 오류');
  }
};

export const getItem = (key, defaultValue) => {
  try {
    const value = storage.getItem(key);
    if (value) {
      return JSON.parse(value);
    }
    return defaultValue;
  } catch (e) {
    return defaultValue;
  }
};

export const removeItem = (key) => {
  storage.removeItem(key);
};

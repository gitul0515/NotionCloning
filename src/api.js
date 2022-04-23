const API_END_POINT = 'https://kdt-frontend.programmers.co.kr';
const API_USERNAME = 'gitul0515';

export const request = async function (url, options = {}) {
  try {
    const res = await fetch(`${API_END_POINT}${url}`, {
      ...options,
      headers: {
        'x-username': API_USERNAME,
        'Content-Type': 'application/json',
      },
    });
    if (res.ok) {
      return await res.json();
    }
    throw new Error('request error');
  } catch (error) {
    alert(error.message);
  }
};

import { config } from "../Config/config"

export const fetchSettings = async () => {
  const res = await fetch(config.url + 'game/setting/', {
    method: 'GET', 
    headers: {
      'Content-Type': 'application/json'
    }
  });
  if (!res.ok) {
    throw new Error('Failed to fetch settings');
  }
  return res.json();
};
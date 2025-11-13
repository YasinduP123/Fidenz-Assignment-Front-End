  export function getCityWithExpiry(cityCode: string) {
    const itemStr = localStorage.getItem(`weatherData_${cityCode}`);
    if (!itemStr) return null;

    const item = JSON.parse(itemStr);
    if (new Date().getTime() > item.expiry) {
      localStorage.removeItem(`weatherData_${cityCode}`);
      return null;
    }
    return item.data;
  }

  export function setCityWithExpiry(cityCode: string, value: any, ttl: number) {
    const now = new Date();
    const item = {
      data: value,
      expiry: now.getTime() + ttl * 60 * 1000,
    };
    localStorage.setItem(`weatherData_${cityCode}`, JSON.stringify(item));
  }
// utils/localStorageUtils.js
export const saveProgress = (points, lastMessage) => {
    const progress = {
      points: points,
      lastMessage: lastMessage
    };
    localStorage.setItem('progress', JSON.stringify(progress));
  };
  
  export const loadProgress = () => {
    const savedProgress = JSON.parse(localStorage.getItem('progress'));
    if (savedProgress) {
      return savedProgress;
    } else {
      return { points: 0, lastMessage: '' };
    }
  };
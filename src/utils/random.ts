export const getRandomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const getRandomFloat = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};

export const getRandomFromArray = (array: any[]): any => {
  return array[Math.floor(Math.random() * array.length)];
}

export const getRandomColor = (): number => {
  return Math.floor(Math.random() * 0xffffff);
}

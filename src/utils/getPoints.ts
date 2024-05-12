const getPoints = (index: number, optionLength: number) => {
  const points = optionLength - index - 1;
  return points === 1 ? `(${points} point)` : `(${points} points)`;
};

export default getPoints;

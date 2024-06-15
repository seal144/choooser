export const getPoints = (index: number, optionLength: number) => {
  return optionLength - index - 1;
};

export const getPointsText = (index: number, optionLength: number) => {
  const points = getPoints(index, optionLength);

  return points === 1 ? `${points} point` : `${points} points`;
};

import { ResultOption } from "@/types";
import { getPoints } from "./getPoints";

const getResultRanking = (options: string[], usersRankings: string[][]) => {
  const resultRanking: ResultOption[] = options.map((option) => ({
    option,
    points: 0,
  }));

  usersRankings.forEach((ranking) => {
    ranking.forEach((option, index, array) => {
      const optionIndex = resultRanking.findIndex(
        (result) => result.option === option
      );

      resultRanking[optionIndex].points += getPoints(index, array.length);
    });
  });

  resultRanking.sort((a, b) => b.points - a.points);

  return resultRanking;
};

export default getResultRanking;

import { adjectivesList } from "./adjectivesList";
import { animalsList } from "./animalsList";

export const generateRandomName = () => {
  const name = `${
    adjectivesList[Math.floor(Math.random() * adjectivesList.length)]
  } ${animalsList[Math.floor(Math.random() * animalsList.length)]}`;
  return name.replace(/\b[a-z]/g, (letter) => letter.toUpperCase());
};

import { adjectivesList } from "./adjectivesList";
import { animalsList } from "./animalsList";

export const generateRandomName = () => {
  let name = `${
    adjectivesList[Math.floor(Math.random() * adjectivesList.length)]
  } ${animalsList[Math.floor(Math.random() * animalsList.length)]}`;
  if (name.length > 20) {
    name = name.split(" ")[1];
  }
  return name.replace(/\b[a-z]/g, (letter) => letter.toUpperCase());
};

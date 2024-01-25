import { adjectivesList } from "./adjectivesList";
import { animalsList } from "./animalsList";
import { maxDisplayNameLength } from "./validation";

export const generateRandomName = () => {
  let name = `${
    adjectivesList[Math.floor(Math.random() * adjectivesList.length)]
  } ${animalsList[Math.floor(Math.random() * animalsList.length)]}`;
  if (name.length > maxDisplayNameLength) {
    name = name.split(" ")[1];
  }
  return name.replace(/\b[a-z]/g, (letter) => letter.toUpperCase());
};

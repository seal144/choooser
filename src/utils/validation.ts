const required = (value: string) => !!value || "Required";
const emailFormat = (value: string) =>
  Boolean(value.match(/^[\w-.]+@([\w-]+\.)[\w]{2,4}$/)) ||
  "incorrect email format";
const minChars = (minChars: number) => (value: string) =>
  Number(value.length) >= minChars ||
  Number(value.length) === 0 ||
  `min ${minChars} characters`;
const maxChars = (maxChars: number) => (value: string) =>
  Number(value.length) <= maxChars || `max ${maxChars} characters`;

export const emailValidation = [required, emailFormat];
export const displayNameValidation = [required, minChars(3), maxChars(20)];
export const authPasswordValidation = [required, minChars(6), maxChars(16)];
export const roomPasswordValidation = [minChars(3), maxChars(30)];

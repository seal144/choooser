const required = (value: string) => !!value || "Required";
const emailFormat = (value: string) =>
  Boolean(value.match(/^[\w-.]+@([\w-]+\.)[\w]{2,4}$/)) ||
  "incorrect email format";
const minCharsRequired = (minChars: number) => (value: string) =>
  Number(value.length) >= minChars ||
  `at least ${minChars} characters required`;
const maxChars = (maxChars: number) => (value: string) =>
  Number(value.length) <= maxChars || `max ${maxChars} characters`;

export const emailValidation = [required, emailFormat];
export const displayNameValidation = [
  required,
  minCharsRequired(3),
  maxChars(30),
];
export const passwordValidation = [required, minCharsRequired(6)];

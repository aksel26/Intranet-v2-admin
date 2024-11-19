export const formatPhoneNumber = (input: string) => {
  const numbers = input.replace(/[^\d]/g, "");
  const trimmed = numbers.substring(0, 11);

  if (trimmed.length <= 3) {
    return trimmed;
  } else if (trimmed.length <= 7) {
    return `${trimmed.slice(0, 3)}-${trimmed.slice(3)}`;
  } else {
    return `${trimmed.slice(0, 3)}-${trimmed.slice(3, 7)}-${trimmed.slice(7)}`;
  }
};

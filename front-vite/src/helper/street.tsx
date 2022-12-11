/* eslint-disable import/prefer-default-export */
export function formatStreetName(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

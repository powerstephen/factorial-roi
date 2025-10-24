export const currencyFmt = (n: number, currency = "EUR") =>
  new Intl.NumberFormat(undefined, { style: "currency", currency }).format(n);

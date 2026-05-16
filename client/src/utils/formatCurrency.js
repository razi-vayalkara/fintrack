const localeByCurrency = {
  INR: "en-IN",
  USD: "en-US",
  EUR: "en-DE",
  GBP: "en-GB"
};

const formatCurrency = (value = 0, currency = "INR") =>
  new Intl.NumberFormat(localeByCurrency[currency] || "en-IN", {
    style: "currency",
    currency
  }).format(Number(value) || 0);

export default formatCurrency;

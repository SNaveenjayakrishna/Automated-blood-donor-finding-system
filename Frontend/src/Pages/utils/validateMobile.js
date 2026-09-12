export const validateMobile = (mobile) => {
  const indiaRegex = /^[6-9]\d{9}$/;

  if (!mobile) return "Mobile number is required";
  if (!/^\d+$/.test(mobile)) return "Mobile number must contain only digits";
  if (!indiaRegex.test(mobile)) return "Enter a valid 10-digit Indian mobile number";

  return "valid";
};
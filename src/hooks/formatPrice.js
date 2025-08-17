export const formatPrice = (price, formatting = false) => {
  if (price === undefined || price === null) {
    return '';
  }
  let valueToFormat = price;

  if (formatting) {
    // Проверяем, есть ли знаки после запятой в исходном числе
    const hasDecimalPlaces = String(price).includes('.');

    // Если есть знаки после запятой, то округляем до 2 знаков после запятой
    if (hasDecimalPlaces) {
      valueToFormat = Number(price).toFixed(2);
    } else {
      valueToFormat = Number(price);
    }
  }

  // Форматируем число
  const priceString = String(valueToFormat);
  const parts = priceString.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return parts.join('.');
};

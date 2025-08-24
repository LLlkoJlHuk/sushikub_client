import { useEffect, useState } from 'react';

/**
 * Хук для дебаунса значения
 * @param {*} value - Значение для дебаунса
 * @param {number} delay - Задержка в миллисекундах
 * @returns {*} Дебаунсированное значение
 */
export function useDebounce(value, delay) {
	const [debouncedValue, setDebouncedValue] = useState(value);

	useEffect(() => {
		// Создаем таймер для обновления дебаунсированного значения
		const handler = setTimeout(() => {
			setDebouncedValue(value);
		}, delay);

		// Очищаем таймер при изменении value или delay
		return () => {
			clearTimeout(handler);
		};
	}, [value, delay]);

	return debouncedValue;
}

export default useDebounce;

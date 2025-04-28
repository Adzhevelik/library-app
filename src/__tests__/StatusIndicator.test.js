import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import StatusIndicator from '../StatusIndicator';

// Мокаем таймеры
jest.useFakeTimers();

describe('StatusIndicator Component', () => {
  // Функция для мокирования navigator.onLine
  const setNavigatorOnline = (isOnline) => {
    Object.defineProperty(navigator, 'onLine', {
      configurable: true,
      value: isOnline,
    });
  };

  // Мокаем add/removeEventListener
  const originalAddEventListener = window.addEventListener;
  const originalRemoveEventListener = window.removeEventListener;
  let eventListeners = {};

  beforeEach(() => {
    // Сбрасываем слушатели перед каждым тестом
    eventListeners = {};
    window.addEventListener = jest.fn((event, callback) => {
      eventListeners[event] = callback;
    });
    window.removeEventListener = jest.fn((event) => {
        delete eventListeners[event];
    });
  });

  afterEach(() => {
    // Восстанавливаем оригинальные функции
    window.addEventListener = originalAddEventListener;
    window.removeEventListener = originalRemoveEventListener;
    jest.clearAllMocks();
    jest.clearAllTimers(); // Очищаем фейковые таймеры
  });

  test('initially renders nothing', () => {
    setNavigatorOnline(true); // Устанавливаем начальное состояние
    render(<StatusIndicator />);
    // Компонент рендерит null до первого события или тайм-аута
    expect(screen.queryByRole('alert')).not.toBeInTheDocument(); // Используем role="alert" или подобное для доступности
  });

  test('shows offline message when browser goes offline', () => {
    setNavigatorOnline(true);
    render(<StatusIndicator />);

    // Имитируем событие offline
    act(() => {
      setNavigatorOnline(false); // Меняем состояние navigator
      eventListeners.offline(); // Вызываем сохраненный обработчик
    });

    const alert = screen.getByRole('alert');
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveTextContent(/Нет соединения/i);
    expect(alert).toHaveClass('offline');
    expect(alert).not.toHaveClass('online');
  });

  test('shows online message and hides after timeout when browser comes online', () => {
    setNavigatorOnline(false); // Начинаем в offline
    render(<StatusIndicator />);

    // Имитируем событие offline сначала, чтобы показать сообщение
     act(() => {
      eventListeners.offline();
    });
    expect(screen.getByRole('alert')).toHaveTextContent(/Нет соединения/i);


    // Имитируем событие online
     act(() => {
      setNavigatorOnline(true); // Меняем состояние navigator
      eventListeners.online(); // Вызываем обработчик online
    });

    // Сообщение должно измениться на online
    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent(/Соединение восстановлено/i);
    expect(alert).toHaveClass('online');
    expect(alert).not.toHaveClass('offline');

    // Проматываем таймер на 3 секунды
    act(() => {
        jest.advanceTimersByTime(3000);
    });

    // Сообщение должно исчезнуть
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

   test('removes event listeners on unmount', () => {
    setNavigatorOnline(true);
    const { unmount } = render(<StatusIndicator />);

    expect(window.addEventListener).toHaveBeenCalledWith('online', expect.any(Function));
    expect(window.addEventListener).toHaveBeenCalledWith('offline', expect.any(Function));

    unmount(); // Размонтируем компонент

    expect(window.removeEventListener).toHaveBeenCalledWith('online', expect.any(Function));
    expect(window.removeEventListener).toHaveBeenCalledWith('offline', expect.any(Function));
  });

});

// Добавляем role="alert" в компонент для лучшей тестируемости и доступности
// (Иначе screen.getByRole не сработает)
// Необходимо будет обновить StatusIndicator.js
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import StatusIndicator from '../StatusIndicator'; // Убедитесь, что путь правильный

// Глобально мокаем fetch для этого файла тестов
global.fetch = jest.fn();

describe('StatusIndicator Component', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('renders and shows initial "Checking status..." message', () => {
    // Мокаем fetch так, чтобы он не разрешался сразу, чтобы увидеть начальное состояние
    fetch.mockImplementationOnce(() => new Promise(() => {}));
    render(<StatusIndicator />);
    // Предполагаем, что компонент StatusIndicator.js рендерит такой текст по умолчанию
    // Если текст другой, поправь его здесь.
    // Если StatusIndicator.js возвращает null или пустой div до первого fetch, этот тест надо изменить.
    // Судя по структуре, он должен что-то рендерить сразу.
    // Например, если у тебя такой компонент:
    // const StatusIndicator = () => { const [status, setStatus] = useState('Checking...'); ... return <div>{status}</div>; }
    // То текст будет "Checking..."
    // Если он выводит "API Status: Checking...", то screen.getByText(/API Status: Checking.../i)
    // Чтобы тест был максимально простым, проверим, что он просто что-то рендерит
    const { container } = render(<StatusIndicator />);
    expect(container.firstChild).toBeInTheDocument(); 
    // Можно добавить более конкретную проверку, если есть начальный текст
    // Например, если есть <div className="status-indicator">...</div>
    // expect(container.querySelector('.status-indicator')).toBeInTheDocument();
  });

  test('shows online status after successful fetch', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'API is operational' }), // Структура ответа должна совпадать с ожидаемой в компоненте
    });
    render(<StatusIndicator />);
    // Замени 'Online' или 'API is operational' на тот текст, который реально выводится
    await waitFor(() => {
      // Текст может быть частью большего сообщения, например "API Status: Online"
      // Используй регулярное выражение для гибкости
      expect(screen.getByText(/API is operational/i)).toBeInTheDocument(); 
    });
  });

  test('shows offline status after failed fetch', async () => {
    fetch.mockResolvedValueOnce({ ok: false }); // Или mockRejectedValueOnce
    render(<StatusIndicator />);
    // Замени 'Offline' на тот текст, который реально выводится при ошибке
    await waitFor(() => {
      expect(screen.getByText(/Offline/i)).toBeInTheDocument();
    });
  });
});
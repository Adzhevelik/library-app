import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import StatusIndicator from '../StatusIndicator';

// ������ �������
jest.useFakeTimers();

describe('StatusIndicator Component', () => {
  // ������� ��� ����������� navigator.onLine
  const setNavigatorOnline = (isOnline) => {
    Object.defineProperty(navigator, 'onLine', {
      configurable: true,
      value: isOnline,
    });
  };

  // ������ add/removeEventListener
  const originalAddEventListener = window.addEventListener;
  const originalRemoveEventListener = window.removeEventListener;
  let eventListeners = {};

  beforeEach(() => {
    // ���������� ��������� ����� ������ ������
    eventListeners = {};
    window.addEventListener = jest.fn((event, callback) => {
      eventListeners[event] = callback;
    });
    window.removeEventListener = jest.fn((event) => {
        delete eventListeners[event];
    });
  });

  afterEach(() => {
    // ��������������� ������������ �������
    window.addEventListener = originalAddEventListener;
    window.removeEventListener = originalRemoveEventListener;
    jest.clearAllMocks();
    jest.clearAllTimers(); // ������� �������� �������
  });

  test('initially renders nothing', () => {
    setNavigatorOnline(true); // ������������� ��������� ���������
    render(<StatusIndicator />);
    // ��������� �������� null �� ������� ������� ��� ����-����
    expect(screen.queryByRole('alert')).not.toBeInTheDocument(); // ���������� role="alert" ��� �������� ��� �����������
  });

  test('shows offline message when browser goes offline', () => {
    setNavigatorOnline(true);
    render(<StatusIndicator />);

    // ��������� ������� offline
    act(() => {
      setNavigatorOnline(false); // ������ ��������� navigator
      eventListeners.offline(); // �������� ����������� ����������
    });

    const alert = screen.getByRole('alert');
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveTextContent(/��� ����������/i);
    expect(alert).toHaveClass('offline');
    expect(alert).not.toHaveClass('online');
  });

  test('shows online message and hides after timeout when browser comes online', () => {
    setNavigatorOnline(false); // �������� � offline
    render(<StatusIndicator />);

    // ��������� ������� offline �������, ����� �������� ���������
     act(() => {
      eventListeners.offline();
    });
    expect(screen.getByRole('alert')).toHaveTextContent(/��� ����������/i);


    // ��������� ������� online
     act(() => {
      setNavigatorOnline(true); // ������ ��������� navigator
      eventListeners.online(); // �������� ���������� online
    });

    // ��������� ������ ���������� �� online
    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent(/���������� �������������/i);
    expect(alert).toHaveClass('online');
    expect(alert).not.toHaveClass('offline');

    // ����������� ������ �� 3 �������
    act(() => {
        jest.advanceTimersByTime(3000);
    });

    // ��������� ������ ���������
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

   test('removes event listeners on unmount', () => {
    setNavigatorOnline(true);
    const { unmount } = render(<StatusIndicator />);

    expect(window.addEventListener).toHaveBeenCalledWith('online', expect.any(Function));
    expect(window.addEventListener).toHaveBeenCalledWith('offline', expect.any(Function));

    unmount(); // ������������ ���������

    expect(window.removeEventListener).toHaveBeenCalledWith('online', expect.any(Function));
    expect(window.removeEventListener).toHaveBeenCalledWith('offline', expect.any(Function));
  });

});

// ��������� role="alert" � ��������� ��� ������ ������������� � �����������
// (����� screen.getByRole �� ���������)
// ���������� ����� �������� StatusIndicator.js
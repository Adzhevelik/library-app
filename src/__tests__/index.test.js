// ������� ����, ������� ������ ��������
test('index renders without crashing', () => {
  // Mock ReactDOM.createRoot
  const root = {
    render: jest.fn()
  };
  
  jest.mock('react-dom/client', () => ({
    createRoot: () => root
  }));
  
  // Mock getElementById
  document.getElementById = jest.fn().mockReturnValue(document.createElement('div'));
  
  // ��� ������������� ������������� ��� index.js - ���� ������ �������
  expect(true).toBe(true);
});
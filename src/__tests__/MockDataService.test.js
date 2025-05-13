import MockBookService from '../MockDataService'; // Убедитесь, что путь правильный

describe('MockDataService', () => {
  beforeEach(() => {
    // Очищаем localStorage перед каждым тестом, так как сервис его использует
    localStorage.clear();
    // Инициализируем с дефолтными книгами, если это нужно для каждого теста
    // Если initializeLocalStorage вызывается внутри функций сервиса, это может быть не нужно здесь.
  });

  test('getAllBooks returns a promise that resolves with an array of books', async () => {
    const response = await MockBookService.getAllBooks();
    expect(response).toHaveProperty('data');
    expect(Array.isArray(response.data)).toBe(true);
    // Можно добавить проверку на то, что в data есть книги, если они должны быть по умолчанию
    if (response.data.length > 0) {
      expect(response.data[0]).toHaveProperty('id');
      expect(response.data[0]).toHaveProperty('title');
    }
  });

  test('getBookById returns a book if found', async () => {
    // Сначала добавим книгу через сервис, чтобы убедиться, что она есть
    // Или используем ID одной из дефолтных книг, если они предзагружены
    // Предположим, что ID "1" существует в начальных данных
    const response = await MockBookService.getBookById('1');
    expect(response).toHaveProperty('data');
    expect(response.data.id).toBe('1');
    expect(response.data.title).toBe('Война и мир'); // Из твоих моковых данных
  });

  test('getBookById rejects if book not found', async () => {
    try {
      await MockBookService.getBookById('nonexistentid');
    } catch (error) {
      expect(error).toEqual({ response: { data: { message: 'Book not found' } } });
    }
  });
  
  // Можно добавить аналогичные простые тесты для createBook, updateBook, deleteBook, searchBooks
  // Например, для createBook:
  test('createBook adds a new book and returns it', async () => {
    const newBookData = { title: 'New Test Book', author: 'Test Author', totalCopies: 1, availableCopies: 1 };
    const response = await MockBookService.createBook(newBookData);
    expect(response).toHaveProperty('data');
    expect(response.data.title).toBe(newBookData.title);
    expect(response.data).toHaveProperty('id'); // Должен быть сгенерирован ID

    // Проверим, что книга действительно добавлена
    const allBooksResponse = await MockBookService.getAllBooks();
    const foundBook = allBooksResponse.data.find(b => b.id === response.data.id);
    expect(foundBook).toBeDefined();
    expect(foundBook.title).toBe(newBookData.title);
  });
});
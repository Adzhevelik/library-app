import MockBookService from '../MockDataService';

describe('MockDataService', () => {
  // Мокируем localStorage
  let mockLocalStorage = {};
  
  beforeEach(() => {
    mockLocalStorage = {};
    
    global.localStorage = {
      getItem: jest.fn(key => mockLocalStorage[key] || null),
      setItem: jest.fn((key, value) => {
        mockLocalStorage[key] = value;
      }),
      removeItem: jest.fn(key => {
        delete mockLocalStorage[key];
      })
    };
    
    // Устанавливаем фиксированную дату для тестов
    jest.spyOn(global.Date, 'now').mockImplementation(() => new Date('2023-01-01').valueOf());
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getAllBooks', () => {
    it('должен возвращать все книги из localStorage или инициализировать их', async () => {
      // Первый вызов должен инициализировать mockBooks в localStorage
      const response = await MockBookService.getAllBooks();
      
      expect(localStorage.getItem).toHaveBeenCalledWith('mockBooks');
      expect(localStorage.setItem).toHaveBeenCalled();
      expect(response.data).toHaveLength(6); // В моковых данных 6 книг
      
      // Проверяем структуру данных
      expect(response.data[0]).toHaveProperty('id');
      expect(response.data[0]).toHaveProperty('title');
      expect(response.data[0]).toHaveProperty('author');
    });

    it('должен возвращать книги из localStorage, если они уже существуют', async () => {
      const mockBooks = [
        { id: '99', title: 'Test Book', author: 'Test Author' }
      ];
      
      localStorage.getItem.mockReturnValue(JSON.stringify(mockBooks));
      
      const response = await MockBookService.getAllBooks();
      
      expect(localStorage.getItem).toHaveBeenCalledWith('mockBooks');
      expect(response.data).toEqual(mockBooks);
    });
  });

  describe('getBookById', () => {
    it('должен возвращать книгу по ID', async () => {
      // Инициализируем mockBooks
      await MockBookService.getAllBooks();
      
      // Получаем книгу с ID = 1
      const response = await MockBookService.getBookById('1');
      
      expect(response.data).toHaveProperty('id', '1');
      expect(response.data).toHaveProperty('title', 'Война и мир');
    });

    it('должен возвращать ошибку, если книга не найдена', async () => {
      // Инициализируем mockBooks
      await MockBookService.getAllBooks();
      
      await expect(MockBookService.getBookById('999')).rejects.toMatchObject({
        response: { data: { message: 'Book not found' } }
      });
    });
  });

  describe('createBook', () => {
    it('должен создавать новую книгу', async () => {
      // Инициализируем mockBooks
      await MockBookService.getAllBooks();
      
      const newBook = {
        title: 'Новая книга',
        author: 'Новый автор',
        description: 'Описание новой книги',
        genre: 'Фантастика',
        availableCopies: 2,
        totalCopies: 5
      };
      
      const response = await MockBookService.createBook(newBook);
      
      expect(response.data).toHaveProperty('id');
      expect(response.data).toHaveProperty('title', 'Новая книга');
      expect(response.data).toHaveProperty('author', 'Новый автор');
      expect(response.data).toHaveProperty('createdAt');
      
      // Проверяем, что книга добавлена в localStorage
      const allBooks = JSON.parse(mockLocalStorage.mockBooks);
      const createdBook = allBooks.find(book => book.title === 'Новая книга');
      expect(createdBook).toBeTruthy();
    });
  });

  describe('updateBook', () => {
    it('должен обновлять существующую книгу', async () => {
      // Инициализируем mockBooks
      await MockBookService.getAllBooks();
      
      const updatedBook = {
        title: 'Обновленное название',
        author: 'Обновленный автор'
      };
      
      const response = await MockBookService.updateBook('1', updatedBook);
      
      expect(response.data).toHaveProperty('id', '1');
      expect(response.data).toHaveProperty('title', 'Обновленное название');
      expect(response.data).toHaveProperty('author', 'Обновленный автор');
      expect(response.data).toHaveProperty('updatedAt');
      
      // Проверяем, что книга обновлена в localStorage
      const allBooks = JSON.parse(mockLocalStorage.mockBooks);
      const book = allBooks.find(book => book.id === '1');
      expect(book.title).toBe('Обновленное название');
    });

    it('должен возвращать ошибку, если книга для обновления не найдена', async () => {
      // Инициализируем mockBooks
      await MockBookService.getAllBooks();
      
      await expect(MockBookService.updateBook('999', { title: 'Новое название' })).rejects.toMatchObject({
        response: { data: { message: 'Book not found' } }
      });
    });
  });

  describe('deleteBook', () => {
    it('должен удалять книгу по ID', async () => {
      // Инициализируем mockBooks
      await MockBookService.getAllBooks();
      
      await MockBookService.deleteBook('1');
      
      // Проверяем, что книга удалена из localStorage
      const allBooks = JSON.parse(mockLocalStorage.mockBooks);
      const book = allBooks.find(book => book.id === '1');
      expect(book).toBeUndefined();
    });

    it('должен возвращать ошибку, если книга для удаления не найдена', async () => {
      // Инициализируем mockBooks
      await MockBookService.getAllBooks();
      
      await expect(MockBookService.deleteBook('999')).rejects.toMatchObject({
        response: { data: { message: 'Book not found' } }
      });
    });
  });

  describe('searchBooks', () => {
    it('должен искать книги по заголовку', async () => {
      // Инициализируем mockBooks
      await MockBookService.getAllBooks();
      
      const response = await MockBookService.searchBooks('война');
      
      expect(response.data).toHaveLength(1);
      expect(response.data[0]).toHaveProperty('title', 'Война и мир');
    });

    it('должен искать книги по автору', async () => {
      // Инициализируем mockBooks
      await MockBookService.getAllBooks();
      
      const response = await MockBookService.searchBooks('Толстой');
      
      expect(response.data).toHaveLength(1);
      expect(response.data[0]).toHaveProperty('author', 'Лев Толстой');
    });

    it('должен искать книги по ISBN', async () => {
      // Инициализируем mockBooks
      await MockBookService.getAllBooks();
      
      const response = await MockBookService.searchBooks('9785171147426');
      
      expect(response.data).toHaveLength(1);
      expect(response.data[0]).toHaveProperty('isbn', '9785171147426');
    });

    it('должен искать книги по жанру', async () => {
      // Инициализируем mockBooks
      await MockBookService.getAllBooks();
      
      const response = await MockBookService.searchBooks('Роман');
      
      // В моковых данных есть несколько книг жанра "Роман"
      expect(response.data.length).toBeGreaterThan(0);
      expect(response.data[0]).toHaveProperty('genre', 'Роман');
    });

    it('должен возвращать пустой массив, если ничего не найдено', async () => {
      // Инициализируем mockBooks
      await MockBookService.getAllBooks();
      
      const response = await MockBookService.searchBooks('несуществующая книга');
      
      expect(response.data).toHaveLength(0);
    });
  });
});
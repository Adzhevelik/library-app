import MockBookService from '../MockDataService';

describe('MockDataService', () => {
  // �������� localStorage
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
    
    // ������������� ������������� ���� ��� ������
    jest.spyOn(global.Date, 'now').mockImplementation(() => new Date('2023-01-01').valueOf());
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getAllBooks', () => {
    it('������ ���������� ��� ����� �� localStorage ��� ���������������� ��', async () => {
      // ������ ����� ������ ���������������� mockBooks � localStorage
      const response = await MockBookService.getAllBooks();
      
      expect(localStorage.getItem).toHaveBeenCalledWith('mockBooks');
      expect(localStorage.setItem).toHaveBeenCalled();
      expect(response.data).toHaveLength(6); // � ������� ������ 6 ����
      
      // ��������� ��������� ������
      expect(response.data[0]).toHaveProperty('id');
      expect(response.data[0]).toHaveProperty('title');
      expect(response.data[0]).toHaveProperty('author');
    });

    it('������ ���������� ����� �� localStorage, ���� ��� ��� ����������', async () => {
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
    it('������ ���������� ����� �� ID', async () => {
      // �������������� mockBooks
      await MockBookService.getAllBooks();
      
      // �������� ����� � ID = 1
      const response = await MockBookService.getBookById('1');
      
      expect(response.data).toHaveProperty('id', '1');
      expect(response.data).toHaveProperty('title', '����� � ���');
    });

    it('������ ���������� ������, ���� ����� �� �������', async () => {
      // �������������� mockBooks
      await MockBookService.getAllBooks();
      
      await expect(MockBookService.getBookById('999')).rejects.toMatchObject({
        response: { data: { message: 'Book not found' } }
      });
    });
  });

  describe('createBook', () => {
    it('������ ��������� ����� �����', async () => {
      // �������������� mockBooks
      await MockBookService.getAllBooks();
      
      const newBook = {
        title: '����� �����',
        author: '����� �����',
        description: '�������� ����� �����',
        genre: '����������',
        availableCopies: 2,
        totalCopies: 5
      };
      
      const response = await MockBookService.createBook(newBook);
      
      expect(response.data).toHaveProperty('id');
      expect(response.data).toHaveProperty('title', '����� �����');
      expect(response.data).toHaveProperty('author', '����� �����');
      expect(response.data).toHaveProperty('createdAt');
      
      // ���������, ��� ����� ��������� � localStorage
      const allBooks = JSON.parse(mockLocalStorage.mockBooks);
      const createdBook = allBooks.find(book => book.title === '����� �����');
      expect(createdBook).toBeTruthy();
    });
  });

  describe('updateBook', () => {
    it('������ ��������� ������������ �����', async () => {
      // �������������� mockBooks
      await MockBookService.getAllBooks();
      
      const updatedBook = {
        title: '����������� ��������',
        author: '����������� �����'
      };
      
      const response = await MockBookService.updateBook('1', updatedBook);
      
      expect(response.data).toHaveProperty('id', '1');
      expect(response.data).toHaveProperty('title', '����������� ��������');
      expect(response.data).toHaveProperty('author', '����������� �����');
      expect(response.data).toHaveProperty('updatedAt');
      
      // ���������, ��� ����� ��������� � localStorage
      const allBooks = JSON.parse(mockLocalStorage.mockBooks);
      const book = allBooks.find(book => book.id === '1');
      expect(book.title).toBe('����������� ��������');
    });

    it('������ ���������� ������, ���� ����� ��� ���������� �� �������', async () => {
      // �������������� mockBooks
      await MockBookService.getAllBooks();
      
      await expect(MockBookService.updateBook('999', { title: '����� ��������' })).rejects.toMatchObject({
        response: { data: { message: 'Book not found' } }
      });
    });
  });

  describe('deleteBook', () => {
    it('������ ������� ����� �� ID', async () => {
      // �������������� mockBooks
      await MockBookService.getAllBooks();
      
      await MockBookService.deleteBook('1');
      
      // ���������, ��� ����� ������� �� localStorage
      const allBooks = JSON.parse(mockLocalStorage.mockBooks);
      const book = allBooks.find(book => book.id === '1');
      expect(book).toBeUndefined();
    });

    it('������ ���������� ������, ���� ����� ��� �������� �� �������', async () => {
      // �������������� mockBooks
      await MockBookService.getAllBooks();
      
      await expect(MockBookService.deleteBook('999')).rejects.toMatchObject({
        response: { data: { message: 'Book not found' } }
      });
    });
  });

  describe('searchBooks', () => {
    it('������ ������ ����� �� ���������', async () => {
      // �������������� mockBooks
      await MockBookService.getAllBooks();
      
      const response = await MockBookService.searchBooks('�����');
      
      expect(response.data).toHaveLength(1);
      expect(response.data[0]).toHaveProperty('title', '����� � ���');
    });

    it('������ ������ ����� �� ������', async () => {
      // �������������� mockBooks
      await MockBookService.getAllBooks();
      
      const response = await MockBookService.searchBooks('�������');
      
      expect(response.data).toHaveLength(1);
      expect(response.data[0]).toHaveProperty('author', '��� �������');
    });

    it('������ ������ ����� �� ISBN', async () => {
      // �������������� mockBooks
      await MockBookService.getAllBooks();
      
      const response = await MockBookService.searchBooks('9785171147426');
      
      expect(response.data).toHaveLength(1);
      expect(response.data[0]).toHaveProperty('isbn', '9785171147426');
    });

    it('������ ������ ����� �� �����', async () => {
      // �������������� mockBooks
      await MockBookService.getAllBooks();
      
      const response = await MockBookService.searchBooks('�����');
      
      // � ������� ������ ���� ��������� ���� ����� "�����"
      expect(response.data.length).toBeGreaterThan(0);
      expect(response.data[0]).toHaveProperty('genre', '�����');
    });

    it('������ ���������� ������ ������, ���� ������ �� �������', async () => {
      // �������������� mockBooks
      await MockBookService.getAllBooks();
      
      const response = await MockBookService.searchBooks('�������������� �����');
      
      expect(response.data).toHaveLength(0);
    });
  });
});
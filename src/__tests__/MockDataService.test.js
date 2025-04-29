import MockBookService from '../MockDataService';

describe('MockDataService', () => {
  beforeEach(() => {
    // ������� localStorage ����� ������ ������
    localStorage.clear();
  });
  
  test('getAllBooks returns an array of books', async () => {
    const result = await MockBookService.getAllBooks();
    expect(Array.isArray(result.data)).toBe(true);
  });
  
  test('getBookById returns a book with matching id', async () => {
    // ������� ������� �����
    const newBook = {
      title: 'Test Book',
      author: 'Test Author',
    };
    const created = await MockBookService.createBook(newBook);
    
    // ����� �������� � �� id
    const result = await MockBookService.getBookById(created.data.id);
    expect(result.data.title).toBe(newBook.title);
  });
  
  test('createBook adds a new book', async () => {
    const newBook = {
      title: 'New Test Book',
      author: 'New Test Author',
    };
    
    const result = await MockBookService.createBook(newBook);
    expect(result.data.title).toBe(newBook.title);
    expect(result.data.id).toBeDefined();
  });
});
const request = require('supertest');

// Указываем URL работающего сервера
const API_URL = 'http://localhost:8080';

describe('Books API', () => {
  // Тест для получения всех книг
  it('should get all books', async () => {
    const res = await request(API_URL).get('/api/books');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  // Тест для создания книги
  it('should create a new book', async () => {
    const newBook = {
      title: 'Test Book',
      author: 'Test Author',
      description: 'Test Description',
      publicationDate: '2023-01-01',
      isbn: '1234567890',
      genre: 'Test Genre',
      availableCopies: 5,
      totalCopies: 10
    };
    const res = await request(API_URL).post('/api/books').send(newBook);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
  });

  // Тест для удаления книги
  it('should delete a book', async () => {
    // Сначала создаём книгу, чтобы потом её удалить
    const newBook = {
      title: 'Test Book to Delete',
      author: 'Test Author',
      description: 'Test Description',
      publicationDate: '2023-01-01',
      isbn: '1234567891',
      genre: 'Test Genre',
      availableCopies: 5,
      totalCopies: 10
    };
    const createRes = await request(API_URL).post('/api/books').send(newBook);
    const bookId = createRes.body.id;

    // Удаляем книгу
    const deleteRes = await request(API_URL).delete(`/api/books/${bookId}`);
    expect(deleteRes.statusCode).toEqual(200);
    expect(deleteRes.body).toHaveProperty('message', 'Book deleted successfully');
  });
});

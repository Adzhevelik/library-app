import { getBooks, addBook } from '../BookService';

test('getBooks returns a list of books', async () => {
  const books = await getBooks();
  expect(Array.isArray(books)).toBe(true);
});

test('addBook adds a new book', async () => {
  const newBook = { title: 'New Book', author: 'New Author' };
  const response = await addBook(newBook);
  expect(response).toHaveProperty('id');
});

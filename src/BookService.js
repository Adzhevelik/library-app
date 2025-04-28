import axios from 'axios';

// ???????, ??? USE_MOCK_DATA ?????????? ? false
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const USE_MOCK_DATA = false; // Оставляем, если вдруг используется где-то еще

// URL ???????
const API_URL = 'http://89.208.104.134:8080/api/books';

// УДАЛЕНО: Неиспользуемая функция isApiAvailable
// const isApiAvailable = async () => {
//   if (USE_MOCK_DATA) return false;

//   try {
//     await axios.get(`${API_URL}/health`, { timeout: 2000 });
//     return true;
//   } catch (error) {
//     console.warn('API ??????????, ????????? ??????? ??????');
//     return false;
//   }
// };

// ???????? ??????? API
const realGetAllBooks = () => axios.get(API_URL);
const realGetBookById = (id) => axios.get(`${API_URL}/${id}`);
const realCreateBook = (book) => axios.post(API_URL, book);
const realUpdateBook = (id, book) => axios.put(`${API_URL}/${id}`, book);
const realDeleteBook = (id) => axios.delete(`${API_URL}/${id}`);
const realSearchBooks = (query) => axios.get(`${API_URL}/search?query=${encodeURIComponent(query)}`); // Добавил encodeURIComponent

// ???????????? ??????
const BookService = {
  getAllBooks: () => realGetAllBooks(),
  getBookById: (id) => realGetBookById(id),
  createBook: (book) => realCreateBook(book),
  updateBook: (id, book) => realUpdateBook(id, book),
  deleteBook: (id) => realDeleteBook(id),
  searchBooks: (query) => realSearchBooks(query),
  // isApiAvailable: isApiAvailable // УДАЛЕНО
};

export default BookService;
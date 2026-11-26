const express = require('express');
const app = express();
const PORT = 3000;

// Middleware: Allows Express to parse incoming JSON data in req.body
app.use(express.json());

// Initial In-Memory Data (as given in Set A)
let books = [
  {
    id: 101,
    title: "Wings of Fire",
    author: "A.P.J. Abdul Kalam",
    genre: "Autobiography",
    publishedYear: 1999,
    available: true
  },
  {
    id: 102,
    title: "The Alchemist",
    author: "Paulo Coelho",
    genre: "Fiction",
    publishedYear: 1988,
    available: true
  },
  {
    id: 103,
    title: "Harry Potter",
    author: "J.K. Rowling",
    genre: "Fantasy",
    publishedYear: 1997,
    available: false
  }
];

// 1. GET all records
app.get('/api/books', (req, res) => {
  res.status(200).json(books);
});

// 6. Filter records by author (MUST be declared BEFORE /api/books/:id)
app.get('/api/books/filter', (req, res) => {
  const { author } = req.query;

  // If no author query is provided, return 400 Bad Request
  if (!author) {
    return res.status(400).json({ message: "Author query parameter is required" });
  }

  // Case-insensitive matching
  const filteredBooks = books.filter(
    (book) => book.author.toLowerCase() === author.toLowerCase()
  );

  // Returns matching array or [] with HTTP 200
  res.status(200).json(filteredBooks);
});

// 3. GET record by ID
app.get('/api/books/:id', (req, res) => {
  const bookId = parseInt(req.params.id);
  const book = books.find((b) => b.id === bookId);

  if (!book) {
    return res.status(404).json({ message: `Book with ID ${bookId} not found` });
  }

  res.status(200).json(book);
});

// 2. POST a new record
app.post('/api/books', (req, res) => {
  const { title, author, genre, publishedYear, available } = req.body;

  // Validation: Check that all required fields exist (available can be false, so check typeof)
  if (!title || !author || !genre || !publishedYear || typeof available !== 'boolean') {
    return res.status(400).json({
      message: "Invalid input. title, author, genre, publishedYear, and available (boolean) are required."
    });
  }

  // Generate a unique numeric ID (1 higher than the highest existing ID, or 101 if empty)
  const newId = books.length > 0 ? Math.max(...books.map((b) => b.id)) + 1 : 101;

  const newBook = {
    id: newId,
    title,
    author,
    genre,
    publishedYear: Number(publishedYear),
    available
  };

  books.push(newBook);
  res.status(201).json(newBook);
});

// 4. PUT / update a record
app.put('/api/books/:id', (req, res) => {
  const bookId = parseInt(req.params.id);
  const bookIndex = books.findIndex((b) => b.id === bookId);

  if (bookIndex === -1) {
    return res.status(404).json({ message: `Book with ID ${bookId} not found` });
  }

  const { title, author, genre, publishedYear, available } = req.body;

  // Validate updated fields
  if (!title || !author || !genre || !publishedYear || typeof available !== 'boolean') {
    return res.status(400).json({
      message: "Invalid input. All fields (title, author, genre, publishedYear, available) are required."
    });
  }

  // Update the record while keeping the original ID intact
  books[bookIndex] = {
    id: bookId,
    title,
    author,
    genre,
    publishedYear: Number(publishedYear),
    available
  };

  res.status(200).json(books[bookIndex]);
});

// 5. DELETE a record
app.delete('/api/books/:id', (req, res) => {
  const bookId = parseInt(req.params.id);
  const bookIndex = books.findIndex((b) => b.id === bookId);

  if (bookIndex === -1) {
    return res.status(404).json({ message: `Book with ID ${bookId} not found` });
  }

  const deletedBook = books.splice(bookIndex, 1);
  res.status(200).json({
    message: "Book deleted successfully",
    deletedBook: deletedBook[0]
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
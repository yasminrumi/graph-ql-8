import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

// GraphQL Type Definitions with documentation
const typeDefs = `#graphql
  """
  A Book represents a book in the library with all its details
  """
  type Book {
    """
    Unique identifier for the book
    """
    id: ID!
    
    """
    Title of the book
    """
    title: String!
    
    """
    Author of the book
    """
    author: String!
    
    """
    Publication year
    """
    year: Int
    
    """
    Whether the book is available for borrowing
    """
    available: Boolean!
    
    """
    Category of the book
    """
    category: String
  }

  """
  A User represents a library member
  """
  type User {
    """
    Unique identifier for the user
    """
    id: ID!
    
    """
    Full name of the user
    """
    name: String!
    
    """
    Email address
    """
    email: String!
    
    """
    Age in years
    """
    age: Int
    
    """
    Books currently borrowed by the user
    """
    borrowedBooks: [Book!]
  }

  """
  Input for creating a new book
  """
  input BookInput {
    title: String!
    author: String!
    year: Int
    available: Boolean = true
    category: String
  }

  """
  Input for updating a book
  """
  input BookUpdateInput {
    title: String
    author: String
    year: Int
    available: Boolean
    category: String
  }

  """
  Input for creating a new user
  """
  input UserInput {
    name: String!
    email: String!
    age: Int
  }

  """
  Queries for fetching data
  """
  type Query {
    """
    Get all books in the library
    """
    books: [Book!]!
    
    """
    Get a specific book by ID
    """
    book(id: ID!): Book
    
    """
    Get all users
    """
    users: [User!]!
    
    """
    Get a specific user by ID
    """
    user(id: ID!): User
    
    """
    Search books by title or author
    """
    searchBooks(query: String!): [Book!]!
    
    """
    Get only available books
    """
    availableBooks: [Book!]!
    
    """
    Get books by category
    """
    booksByCategory(category: String!): [Book!]!
  }

  """
  Mutations for modifying data
  """
  type Mutation {
    """
    Add a new book to the library
    """
    addBook(input: BookInput!): Book!
    
    """
    Update an existing book
    """
    updateBook(id: ID!, input: BookUpdateInput!): Book!
    
    """
    Delete a book from the library
    """
    deleteBook(id: ID!): Boolean!
    
    """
    Add a new user
    """
    addUser(input: UserInput!): User!
    
    """
    Borrow a book
    """
    borrowBook(userId: ID!, bookId: ID!): Book!
    
    """
    Return a borrowed book
    """
    returnBook(userId: ID!, bookId: ID!): Book!
    
    """
    Update user information
    """
    updateUser(id: ID!, name: String, email: String, age: Int): User!
    
    """
    Delete a user
    """
    deleteUser(id: ID!): Boolean!
  }
`;

// Initial data
let books = [
  {
    id: '1',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    year: 1925,
    available: true,
    category: 'Classic'
  },
  {
    id: '2',
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    year: 1960,
    available: false,
    category: 'Fiction'
  },
  {
    id: '3',
    title: '1984',
    author: 'George Orwell',
    year: 1949,
    available: true,
    category: 'Dystopian'
  }
];

let users = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    age: 30,
    borrowedBooks: ['2'] // User 1 has borrowed book 2
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    age: 25,
    borrowedBooks: []
  }
];

// Resolvers
const resolvers = {
  Query: {
    books: () => books,
    
    book: (_, { id }) => {
      const book = books.find(b => b.id === id);
      if (!book) throw new Error(`Book with ID ${id} not found`);
      return book;
    },
    
    users: () => users.map(user => ({
      ...user,
      borrowedBooks: () => user.borrowedBooks.map(bookId => 
        books.find(b => b.id === bookId)
      ).filter(Boolean)
    })),
    
    user: (_, { id }) => {
      const user = users.find(u => u.id === id);
      if (!user) throw new Error(`User with ID ${id} not found`);
      
      return {
        ...user,
        borrowedBooks: user.borrowedBooks.map(bookId => 
          books.find(b => b.id === bookId)
        ).filter(Boolean)
      };
    },
    
    searchBooks: (_, { query }) => {
      const search = query.toLowerCase();
      return books.filter(book => 
        book.title.toLowerCase().includes(search) || 
        book.author.toLowerCase().includes(search)
      );
    },
    
    availableBooks: () => books.filter(book => book.available),
    
    booksByCategory: (_, { category }) => {
      return books.filter(book => 
        book.category && book.category.toLowerCase() === category.toLowerCase()
      );
    }
  },
  
  Mutation: {
    addBook: (_, { input }) => {
      const newBook = {
        id: String(books.length + 1),
        ...input
      };
      books.push(newBook);
      return newBook;
    },
    
    updateBook: (_, { id, input }) => {
      const index = books.findIndex(b => b.id === id);
      if (index === -1) throw new Error(`Book with ID ${id} not found`);
      
      books[index] = { ...books[index], ...input };
      return books[index];
    },
    
    deleteBook: (_, { id }) => {
      const initialLength = books.length;
      books = books.filter(b => b.id !== id);
      
      // Also remove from users' borrowedBooks
      users.forEach(user => {
        user.borrowedBooks = user.borrowedBooks.filter(bookId => bookId !== id);
      });
      
      return books.length < initialLength;
    },
    
    addUser: (_, { input }) => {
      const newUser = {
        id: String(users.length + 1),
        ...input,
        borrowedBooks: []
      };
      users.push(newUser);
      return newUser;
    },
    
    borrowBook: (_, { userId, bookId }) => {
      const user = users.find(u => u.id === userId);
      const book = books.find(b => b.id === bookId);
      
      if (!user) throw new Error(`User with ID ${userId} not found`);
      if (!book) throw new Error(`Book with ID ${bookId} not found`);
      if (!book.available) throw new Error(`Book "${book.title}" is not available`);
      
      book.available = false;
      if (!user.borrowedBooks.includes(bookId)) {
        user.borrowedBooks.push(bookId);
      }
      
      return book;
    },
    
    returnBook: (_, { userId, bookId }) => {
      const user = users.find(u => u.id === userId);
      const book = books.find(b => b.id === bookId);
      
      if (!user) throw new Error(`User with ID ${userId} not found`);
      if (!book) throw new Error(`Book with ID ${bookId} not found`);
      
      book.available = true;
      user.borrowedBooks = user.borrowedBooks.filter(id => id !== bookId);
      
      return book;
    },
    
    updateUser: (_, { id, name, email, age }) => {
      const index = users.findIndex(u => u.id === id);
      if (index === -1) throw new Error(`User with ID ${id} not found`);
      
      users[index] = {
        ...users[index],
        ...(name && { name }),
        ...(email && { email }),
        ...(age !== undefined && { age })
      };
      
      return users[index];
    },
    
    deleteUser: (_, { id }) => {
      const initialLength = users.length;
      users = users.filter(u => u.id !== id);
      return users.length < initialLength;
    }
  }
};

// Create and start Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true, // For GraphQL Playground
});

async function startApolloServer() {
  try {
    const { url } = await startStandaloneServer(server, {
      listen: { port: 4000 },
    });
    
    console.log('='.repeat(50));
    console.log('🚀 GraphQL Server is running!');
    console.log(`📚 URL: ${url}`);
    console.log('='.repeat(50));
    console.log('\nAvailable Operations:');
    console.log('1. Query books: { books { id title author available } }');
    console.log('2. Query users: { users { id name borrowedBooks { title } } }');
    console.log('3. Add book: mutation { addBook(input: {title: "...", author: "..."}) { id title } }');
    console.log('4. Borrow book: mutation { borrowBook(userId: "1", bookId: "1") { id title available } }');
    console.log('\nVisit the URL above to use GraphQL Playground');
    console.log('='.repeat(50));
    
  } catch (error) {
    console.error('Failed to start server:', error);
  }
}

startApolloServer();

import { buildSchema } from 'graphql';

export const schema = buildSchema(`
  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
    posts: [Post!]!
  }

  type Post {
    id: ID!
    title: String!
    content: String!
    authorId: ID!
    author: User
    published: Boolean!
  }

  type Product {
    id: ID!
    name: String!
    price: Float!
    stock: Int!
    category: String
  }

  input CreateUserInput {
    name: String!
    email: String!
    age: Int
  }

  input UpdateUserInput {
    name: String
    email: String
    age: Int
  }

  input CreatePostInput {
    title: String!
    content: String!
    authorId: ID!
    published: Boolean
  }

  input UpdatePostInput {
    title: String
    content: String
    published: Boolean
  }

  input CreateProductInput {
    name: String!
    price: Float!
    stock: Int!
    category: String
  }

  input UpdateProductInput {
    name: String
    price: Float
    stock: Int
    category: String
  }

  type DeleteResponse {
    success: Boolean!
    message: String!
  }

  type Query {
    users: [User!]!
    user(id: ID!): User
    posts(published: Boolean): [Post!]!
    post(id: ID!): Post
    postsByAuthor(authorId: ID!): [Post!]!
    products: [Product!]!
    product(id: ID!): Product
    productsByCategory(category: String!): [Product!]!
    searchProducts(name: String!): [Product!]!
  }

  type Mutation {
    createUser(input: CreateUserInput!): User!
    updateUser(id: ID!, input: UpdateUserInput!): User
    deleteUser(id: ID!): DeleteResponse!
    createPost(input: CreatePostInput!): Post!
    updatePost(id: ID!, input: UpdatePostInput!): Post
    deletePost(id: ID!): DeleteResponse!
    createProduct(input: CreateProductInput!): Product!
    updateProduct(id: ID!, input: UpdateProductInput!): Product
    deleteProduct(id: ID!): DeleteResponse!
  }
`);
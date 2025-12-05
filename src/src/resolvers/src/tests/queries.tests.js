import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import { graphql } from 'graphql';
import { schema } from '../src/schema/schema.js';
import { root } from '../src/resolvers/resolvers.js';
import { resetData } from '../src/models/data.js';

describe('GraphQL Queries', () => {
  before(() => {
    resetData();
  });

  describe('User Queries', () => {
    it('should get all users', async () => {
      const query = `
        query {
          users {
            id
            name
            email
            age
          }
        }
      `;

      const result = await graphql({ schema, source: query, rootValue: root });
      
      assert.strictEqual(result.errors, undefined);
      assert.strictEqual(result.data.users.length, 2);
      assert.strictEqual(result.data.users[0].name, 'John Doe');
    });

    it('should get a single user by id', async () => {
      const query = `
        query {
          user(id: "1") {
            id
            name
            email
          }
        }
      `;

      const result = await graphql({ schema, source: query, rootValue: root });
      
      assert.strictEqual(result.errors, undefined);
      assert.strictEqual(result.data.user.id, '1');
      assert.strictEqual(result.data.user.name, 'John Doe');
    });

    it('should return null for non-existent user', async () => {
      const query = `
        query {
          user(id: "999") {
            id
            name
          }
        }
      `;

      const result = await graphql({ schema, source: query, rootValue: root });
      
      assert.strictEqual(result.errors, undefined);
      assert.strictEqual(result.data.user, null);
    });
  });

  describe('Post Queries', () => {
    it('should get all posts', async () => {
      const query = `
        query {
          posts {
            id
            title
            content
            published
          }
        }
      `;

      const result = await graphql({ schema, source: query, rootValue: root });
      
      assert.strictEqual(result.errors, undefined);
      assert.strictEqual(result.data.posts.length, 3);
    });

    it('should get only published posts', async () => {
      const query = `
        query {
          posts(published: true) {
            id
            title
            published
          }
        }
      `;

      const result = await graphql({ schema, source: query, rootValue: root });
      
      assert.strictEqual(result.errors, undefined);
      assert.strictEqual(result.data.posts.length, 2);
      assert.strictEqual(result.data.posts.every(post => post.published), true);
    });

    it('should get a single post by id', async () => {
      const query = `
        query {
          post(id: "1") {
            id
            title
            content
          }
        }
      `;

      const result = await graphql({ schema, source: query, rootValue: root });
      
      assert.strictEqual(result.errors, undefined);
      assert.strictEqual(result.data.post.id, '1');
      assert.strictEqual(result.data.post.title, 'First Post');
    });

    it('should get posts by author', async () => {
      const query = `
        query {
          postsByAuthor(authorId: "1") {
            id
            title
            authorId
          }
        }
      `;

      const result = await graphql({ schema, source: query, rootValue: root });
      
      assert.strictEqual(result.errors, undefined);
      assert.strictEqual(result.data.postsByAuthor.length, 2);
      assert.strictEqual(result.data.postsByAuthor.every(post => post.authorId === '1'), true);
    });
  });

  describe('Product Queries', () => {
    it('should get all products', async () => {
      const query = `
        query {
          products {
            id
            name
            price
            stock
          }
        }
      `;

      const result = await graphql({ schema, source: query, rootValue: root });
      
      assert.strictEqual(result.errors, undefined);
      assert.strictEqual(result.data.products.length, 3);
    });

    it('should get a single product by id', async () => {
      const query = `
        query {
          product(id: "1") {
            id
            name
            price
          }
        }
      `;

      const result = await graphql({ schema, source: query, rootValue: root });
      
      assert.strictEqual(result.errors, undefined);
      assert.strictEqual(result.data.product.id, '1');
      assert.strictEqual(result.data.product.name, 'Laptop');
    });

    it('should get products by category', async () => {
      const query = `
        query {
          productsByCategory(category: "Electronics") {
            id
            name
            category
          }
        }
      `;

      const result = await graphql({ schema, source: query, rootValue: root });
      
      assert.strictEqual(result.errors, undefined);
      assert.strictEqual(result.data.productsByCategory.length, 3);
    });

    it('should search products by name', async () => {
      const query = `
        query {
          searchProducts(name: "Lap") {
            id
            name
          }
        }
      `;

      const result = await graphql({ schema, source: query, rootValue: root });
      
      assert.strictEqual(result.errors, undefined);
      assert.strictEqual(result.data.searchProducts.length, 1);
      assert.strictEqual(result.data.searchProducts[0].name, 'Laptop');
    });
  });
});
import * as db from './data.js';

export const resolvers = {
  Query: {
    todos: (_parent, args) => {
      if (args.completed === undefined) return db.listTodos();
      return db.listTodos({ completed: args.completed });
    },
    todo: (_parent, args) => db.getTodoById(args.id)
  },

  Mutation: {
    createTodo: (_parent, { input }) => {
      return db.createTodo(input);
    },
    updateTodo: (_parent, { id, input }) => {
      return db.updateTodo(id, input);
    },
    deleteTodo: (_parent, { id }) => {
      return db.deleteTodo(id);
    }
  }
};

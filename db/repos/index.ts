import { BooksRepository } from './books';
import { UserRepository } from './users';

export interface IExtensions {
    books: BooksRepository,
    users: UserRepository
}

export {
    BooksRepository,
    UserRepository
};
import {BooksRepository} from './books';
//import {ProductsRepository} from './products';

// Database Interface Extensions:
export interface IExtensions {
    books: BooksRepository,
}

export {
    BooksRepository,
};
import Book from "./book";

export default interface PaginatedBooks {
    pageCount: number;
    books: Book[];
}

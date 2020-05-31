import {IDatabase, IMain} from 'pg-promise';
import {IResult} from 'pg-promise/typescript/pg-subset';
import Book from '../models/book';
import PaginatedBooks from '../models/paginatedBooks';
import {books as sql} from '../sql';
import { books } from '../sql/index';
import Chapter from '../models/chapter';
import Paragraph from '../models/paragraph';
import Genre from '../models/genre';

export class BooksRepository {
    constructor(private db: IDatabase<any>, private pgp: IMain) {
    }

    async findById(id: number): Promise<Book | null> {
        return this.db.oneOrNone(sql.findById, {
            id: +id,
        });
    }

    async findGenresById(id: number): Promise<Genre[] | null> {
        return this.db.manyOrNone(sql.findGenresById, {
            id: +id,
        });
    }

    async findByName(name: string): Promise<Book[] | null> {
        return this.db.manyOrNone(sql.findByName, {
            name: name,
        });
    }

    async getPage(values: {page: number, itemCount: number}): Promise<PaginatedBooks | null> {
        return {
            pageCount: Math.ceil((await this.db.oneOrNone(sql.count)).sum / values.itemCount),
            books: await this.db.manyOrNone(sql.page, {
            itemCount: +values.itemCount,
            offset: ((+values.page)-1)*(+values.itemCount)
        })};
    }

    async getChapters(book_id: bigint): Promise<Chapter[] | null> {
        return this.db.manyOrNone(sql.getChapters, {
            book_id: book_id,
        });
    }

    async getParagraphs(chapter_id: bigint): Promise<Paragraph[] | null> {
        return this.db.manyOrNone(sql.getParagraphs, {
            chapter_id: chapter_id
        })
    }
}
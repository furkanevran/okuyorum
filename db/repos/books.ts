import {IDatabase, IMain} from 'pg-promise';
import {IResult} from 'pg-promise/typescript/pg-subset';
import Book from '../models/book';
import {books as sql} from '../sql';


export class BooksRepository {
    constructor(private db: IDatabase<any>, private pgp: IMain) {
    }

        async findById(id: number): Promise<Book | null> {
            return this.db.oneOrNone(sql.find, {
                id: +id,
            });
        }

        async getPage(values: {page: number, itemCount: number}): Promise<Book[] | null> {
            return this.db.manyOrNone(sql.page, {
                itemCount: +values.itemCount,
                offset: ((+values.page)-1)*(+values.itemCount)
            });
        }
}
import {IDatabase, IMain} from 'pg-promise';
import {IResult} from 'pg-promise/typescript/pg-subset';
import User from '../models/user';
import {users as sql} from '../sql';
import Book from '../models/book';

export class UserRepository {
    constructor(private db: IDatabase<any>, private pgp: IMain) {
    }

    async create(values: {username: string, email:string, password_hash: string}): Promise<User | null> {
        return this.db.oneOrNone(sql.create, {
            username: values.username,
            email: values.email,
            password_hash: values.password_hash
        });
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.db.oneOrNone(sql.findByEmail, {
            email: email
        })
    }

    async addBookToFavorites(values: {user_id: bigint, book_id:bigint}): Promise<number | null> {
        if(!!await this.checkIfUserFavoritedBook(values)) {
            throw new Error('You already favorited that book.')
        }
        return this.db.none(sql.addBookToFavorites, {
            user_id: values.user_id,
            book_id: values.book_id
        })
    }

    async checkIfUserFavoritedBook(values: {user_id: bigint, book_id:bigint}): Promise<any> {
        return this.db.oneOrNone(sql.checkIfUserFavoritedBook, {
            user_id: values.user_id,
            book_id: values.book_id
        })
    }

    async removeBookFromFavorites(values: {user_id: bigint, book_id:bigint}): Promise<any> {
        return this.db.oneOrNone(sql.removeBookFromFavorites, {
            user_id: values.user_id,
            book_id: values.book_id
        })
    }

    async getAllFavoriteBooks(user_id: bigint): Promise<Book[] | null> {
        return this.db.manyOrNone(sql.getAllFavoriteBooks, {
            user_id: user_id,
        })
    }
}
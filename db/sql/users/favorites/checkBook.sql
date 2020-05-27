/*
    Checks if user favorited a book
*/
SELECT * FROM user_favorite_books
WHERE user_id = ${user_id} AND book_id = ${book_id}
/*
    Removes a favorite book from user
*/
DELETE FROM user_favorite_books
WHERE user_id = ${user_id} AND book_id = ${book_id}
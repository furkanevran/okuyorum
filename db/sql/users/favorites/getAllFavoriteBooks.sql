/*
    Gets all favorite books
*/
SELECT * FROM user_favorite_books
INNER JOIN users ON users.id = user_favorite_books.user_id
INNER JOIN books ON books.id = user_favorite_books.book_id
WHERE users.id = ${user_id}
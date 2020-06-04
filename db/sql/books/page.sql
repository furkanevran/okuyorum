/*
    Returns a page of books
*/
SELECT *, COALESCE((
    SELECT SUM(1) FROM user_favorite_books
    WHERE book_id = books.id
    GROUP BY (book_id)
                       ), 0) as likecount FROM books
ORDER BY likecount DESC
LIMIT ${itemCount} OFFSET ${offset}
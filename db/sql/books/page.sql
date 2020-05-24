/*
    Returns a page of books
*/
SELECT * FROM books
LIMIT ${itemCount} OFFSET ${offset}
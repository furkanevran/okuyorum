/*
    Gets all of chapters from one book
*/
SELECT * FROM book_chapters
WHERE book_id = ${book_id}
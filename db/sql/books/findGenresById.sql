/*
    Finds genres with book id
*/
SELECT g.id, genre FROM books as b
INNER JOIN  book_genres bg on b.id = bg.book_id
INNER JOIN genres g on bg.genre_id = g.id
WHERE b.id = ${id};
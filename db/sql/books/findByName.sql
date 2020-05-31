/*
    Finds a boook by book name or genre.
*/
SELECT DISTINCT * FROM books
WHERE LOWER(name) LIKE LOWER('%${name#}%') OR books.id IN
(SELECT b.id FROM books as b
INNER JOIN  book_genres bg on b.id = bg.book_id
INNER JOIN genres g on bg.genre_id = g.id
WHERE b.id = books.id AND LOWER(g.genre) LIKE LOWER('%${name#}%'));
/*
    Finds a boook by book name.
*/
SELECT * FROM books
WHERE LOWER(name) LIKE LOWER('%${name#}%')
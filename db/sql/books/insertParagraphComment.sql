/*
    Inserts a new paragraph comment with paragraph_id and user_id
*/
INSERT INTO sentence_comments(comment, sentence_id, user_id)
VALUES(${comment}, ${paragraph_id}, ${user_id})
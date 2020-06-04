/*
    Gets paragraph comments + likes with paragraph_id
*/
SELECT c.id as commentid, u.id as userid, username, c.comment,
       COALESCE((SELECT SUM(1) FROM user_sentence_comment_likes as uscl WHERE uscl.comment_id = c.id GROUP BY(c.id)), 0) as likeCount,
       COALESCE((SELECT TRUE FROM user_sentence_comment_likes as uscl WHERE uscl.user_id = ${user_id} AND uscl.comment_id = c.id GROUP BY(uscl.user_id)), FALSE) as didILikeIt
FROM sentence_comments as c
INNER JOIN users u on c.user_id = u.id
WHERE c.sentence_id = ${paragraph_id}
ORDER BY likeCount DESC;
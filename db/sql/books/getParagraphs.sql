/*
    Gets all paragraphs from chapter
*/
SELECT * FROM chapter_sentences
WHERE chapter_id = ${chapter_id}
ORDER BY chapter_sentences.id
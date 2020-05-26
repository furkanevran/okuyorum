import pgPromise from 'pg-promise';
import * as path from 'path';
import * as fs from 'fs';
import * as AdmZip from 'adm-zip'

//#region Extensions
interface IExtensions {
    findGenre(genre: string): Promise<any>;
    findAuthor(name: string): Promise<any>;
    findBook(name: string): Promise<any>;

    insertGenre(name: string): Promise<any>;
    insertAuthor(name: string): Promise<any>;
    insertBook(name: string, description: string, cover_filename: string, created_on:string): Promise<any>;
    insertChapter(book_id: number, name: string): Promise<any>;
    insertText(chapter_id: number, text: string): Promise<any>;

    connectBookToAuthor(book_id: number, author_id: number): Promise<number>;
    connectBookToGenre(book_id: number, author_id: number): Promise<number>;
}
//#endregion 

//#region Extension Helpers
class Cached {
    cache = []
    findCached:any

    constructor(query:string,col:string) {
        this.findCached = async (name: string) => {
            const check = name.toLowerCase()
            for (let i = 0; i < this.cache.length; i++) {
                const item = this.cache[i]
                if(item[col] == check) {
                    return item
                }
            }
                const item = await db.one(query, name)
                
                this.addToCache(item)
                return item;
        };
    }

    addToCache(obj) {
        this.cache.push(JSON.parse(JSON.stringify(obj).toLowerCase()))
    }
}


//#endregion

//#region Options
const genreCached = new Cached('SELECT * FROM genres WHERE LOWER(genre) = LOWER($1)','genre')
const authorCached = new Cached('SELECT * FROM authors WHERE LOWER(name) = LOWER($1)','name')
const bookCached = new Cached('SELECT * FROM books WHERE LOWER(name) = LOWER($1)','name')

const options: pgPromise.IInitOptions<IExtensions> = {
    extend(obj) {
        obj.findGenre = async name => {
            try {
            return await genreCached.findCached(name);
            } catch (error) {
                return null
            }
        },
        obj.findAuthor = async name => {
            try {
            return await authorCached.findCached(name);
            } catch (error) {
                return null
            }
        },
        obj.findBook = async name => {
            try {
            return await bookCached.findCached(name);
            } catch (error) {
                return null
            }
        },
        obj.insertGenre = async genre => {
            const ret = await db.one('INSERT INTO genres(genre) VALUES($1) RETURNING  id, genre', genre)
            genreCached.addToCache(ret)
            return ret;
        },
        obj.insertAuthor = async name => {
            const ret = await db.one('INSERT INTO authors(name) VALUES($1) RETURNING id, name', name)
            authorCached.addToCache(ret)
            return ret;
        },
        obj.insertBook = async (name, description, cover_filename, created_on) => {
            const ret = await db.one('INSERT INTO books(name, description, cover_filename, created_on) VALUES($1, $2, $3, $4) RETURNING id, name', [name, description, cover_filename, created_on])
            bookCached.addToCache(ret)
            return ret;
        },
        obj.insertChapter = async (book_id, name) => {
            return await db.one('INSERT INTO book_chapters(book_id, name) VALUES($1, $2) RETURNING id, name', [book_id, name])
        },
        obj.insertText = async (chapter_id, text) => {
            return await db.one('INSERT INTO chapter_sentences(chapter_id, text) VALUES($1, $2) RETURNING 1', [chapter_id, text])
        },
        obj.connectBookToAuthor = async (book_id, author_id) => {
            return db.one('INSERT INTO book_authors(book_id, author_id) VALUES($1, $2) RETURNING 1', [book_id, author_id])
        },
        obj.connectBookToGenre = async (book_id, genre_id) => {
            return db.one('INSERT INTO book_genres(book_id, genre_id) VALUES($1, $2) RETURNING 1', [book_id, genre_id])
        }
    }
};
//#endregion

//#region Database Connection
const cn = {
    database: 'okuyo',
    user: 'postgres',
    password: 'password',
    host: 'localhost',
    port: 5432
};
const pgp = pgPromise(options);
const db = pgp(cn);
//#endregion


const directoryPath = path.join(__dirname, 'epub');
const outputPath = path.join(__dirname, '/public/epubdata');
const pReplaceId = '°id°'


function GetXMLNodes(obj:string, node:string, flags:string = 'i'):string[] {
    return new RegExp(`<(?:.*?)(?<!calibre:|")${node}(?:.*?)>(.*?)<\/(?:.*?)${node}`, flags).exec(obj);
}

async function main() {
    const files:string[] = fs.readdirSync(directoryPath);
    for (let index = 0; index < files.length; index++) {
        const file = files[index];

        if (file.endsWith('.epub')) {
            const zip:any = new AdmZip(directoryPath+'/'+file);
            const entries:[any] = zip.getEntries();
            let title;
            let creator;
            let description;
            let date;
            let htmlPages = [];
            let styles = []
            let images = []
            let genres = []
            let coverPage;
            let coverImagePath;
            let paragraphs = []

            for (let ei = 0; ei < entries.length; ei++) {
                const entry = entries[ei];
                const entryName:string = entry.entryName;

                if (entryName.endsWith('.opf')) {
                    console.log('OPF FILE FOUND FOR FILE ' + file);
                    const data = entry.getData().toString('utf8');
                    
                    title = GetXMLNodes(data, 'title')[1];
                    creator = GetXMLNodes(data, 'creator')[1];
                    date = GetXMLNodes(data, 'date')[1];
                    try {
                        description = GetXMLNodes(data, 'description')[1] 
                    } catch (error) {
                        description = "<p>Kitapta açıklama bulunmadı.</p>";
                    }
                    
                    const reHtml = /href="(.*?)"(?:.*?)media-type="(?:.*?)html/ig
                    let item = null
                    while ((item = reHtml.exec(data)) != null) {
                        htmlPages.push(item[1]);
                    }

                    const reCSS = /href="(.*?)"(?:.*?)media-type="(?:.*?)css/ig
                    item = null
                    while ((item = reCSS.exec(data)) != null) {
                        styles.push(item[1]);
                    }

                    const reImages = /href="(.*?)"(?:.*?)media-type="(?:.*?)image/ig
                    item = null
                    while ((item = reImages.exec(data)) != null) {
                        images.push(item[1]);
                    }

                    const reSubject = /<(?:.*?)subject(?:.*?)>(.*?)</ig
                    item = null
                    while ((item = reSubject.exec(data)) != null) {
                        genres.push(item[1]);
                    }

                    try {
                        coverPage = /reference(?:.*?)href="(.*?)"(?:.*?)cover/i.exec(data)[1]
                        if(!coverPage.includes('.')) throw new Error();
                    } catch (error) {
                        try {
                            coverPage = /href="(.*?)(?<=html)"(?:.*?)(?:cover|kapak)"/i.exec(data)[1]
                            if(!coverPage.includes('.')) throw new Error();
                        } catch (error) {
                            try {
                                coverPage = /href="(.*?)(kapak|cover)(.*?)(?<=html)"/i.exec(data)[0]
                                coverPage = coverPage[1] + coverPage[2] + coverPage[3]
                                if(!coverPage.includes('.')) throw new Error();
                            } catch (error) {
                                coverPage = null
                            }
                        }
                    }

                    try {
                        coverImagePath = /href="(.*?)(?<=jpg|jpeg|bmp|png|webp|gif)"(?:.*?)id=".*?(?:cover|kapak).*?"/i.exec(data)[1]
                        if(!coverImagePath.includes('.')) throw new Error();
                    } catch (error) {
                        try {
                            coverImagePath = /href="(.*?)(kapak|cover)(.*?)(?<=jpg|jpeg|bmp|png|webp|gif)"/i.exec(data)
                            coverImagePath = coverImagePath[1] + coverImagePath[2] + coverImagePath[3]
                            if(!coverImagePath.includes('.')) throw new Error();
                        } catch (error) {
                            coverImagePath = null
                        }
                    }

                    continue
                }

                if(!coverImagePath && entryName.includes(coverPage)) {
                    try {
                        coverImagePath = /(?:image|img)(?:.*?)(?:src|href)="(.*?)"/i.exec(entry.getData().toString('utf8'))[1]
                        let currentEntry = entryName.split('/');
                        let currentIndex = currentEntry.length-3;

                        while (coverImagePath.includes('../')) {
                           coverImagePath = coverImagePath.replace('../', currentEntry[currentIndex--] + '/')

                        }
                    } catch (error) {
                        coverImagePath = null
                    }
                }

                if(entryName.includes(coverImagePath)) {
                    coverImagePath = entryName;
                    continue
                }

                if (entryName.endsWith('.css')) {
                    for (let i = 0; i < styles.length; i++) {
                        if(entryName.includes(styles[i])) {
                            styles[i] = entryName
                            break
                        }
                    }

                    continue
                }

                if (entryName.endsWith('.jpg')
                || entryName.endsWith('.png')
                || entryName.endsWith('.jpeg')
                || entryName.endsWith('.bmp')
                || entryName.endsWith('.webp')
                || entryName.endsWith('.gif')) {
                    for (let i = 0; i < images.length; i++) {
                        if(entryName.includes(images[i])) {
                            images[i] = entryName
                            break
                        }
                    }

                    continue
                }

                if (htmlPages.some(x => entryName.includes(x))) {
                    const data = entry.getData().toString('utf8');
                    let html:string = data.split(/body/i)[1]
                    html = html.replace(/<a(.*?)<\/a>/i, '')
                    html = html.replace(/<div(.*?)>/i, '')
                    html = html.replace(/<\/div(.*?)>/i, '')
                    html = html.substring(html.indexOf('>')+1, html.length-2)
                    let hasImages = false

                    //#region Fix Images
                    let image = null
                    const reImages = /<(?:image|img)(?:.*?)(?:src|href)="(.*?)"(?:.*?)(?:\/|image|img)>/gi
                    while ((image = reImages.exec(html)) != null) {

                        let replaceTo = false
                        let loop = true
                        const imageName:string = image[1].substring(image[1].lastIndexOf('/')+1)

                        if(coverImagePath.includes(imageName)) {
                            replaceTo = true
                            loop = false
                        }

                        for (let i = 0; i < images.length; i++) {
                            const element:string = images[i];
                            const loopImageName:string = element.substring(element.lastIndexOf('/')+1)

                            if(imageName == loopImageName) {
                                replaceTo = true
                            }
                        }

                        if(replaceTo) {
                            hasImages = true
                            html = html.replace(image[1], `/${outputPath.substring(outputPath.lastIndexOf('\\')+1)}/${pReplaceId}/${imageName}`)
                        } else {
                            html = html.replace(image[0], '')
                        }
                    }
                    
                    //#endregion
                   
                    paragraphs.push([])
                    const reText = /<(p|h|article|blockquote|image|img|svg|ul|ol)(.*?)>(.*?)<\/(p|h|article|blockquote|image|img|svg|ul|ol)(.*?)>/gims
                    let text
                    while((text = reText.exec(html)) != null) {
                        /*const tag = `<${text[1]}${text[2]}>\r\n`
                        const end = '\r\n</'+text[4]+text[5]+'>'
                        const content = text[3]
                        console.log(tag + content + end)*/
                        if(text[3] == '') {
                            const objBefore = paragraphs[paragraphs.length-1][paragraphs[paragraphs.length-1].length-1]
                            if(objBefore && !objBefore.spacer) {
                                paragraphs[paragraphs.length-1].push({spacer: true})
                            } else {
                                continue
                            }
                        } else {
                            paragraphs[paragraphs.length-1].push({text: text[0]})
                        }
                    }

                    if(hasImages === false) {
                        let onlySpacerRemove = true

                        for (let i = 0; i < paragraphs[paragraphs.length-1].length; i++) {
                            const element = paragraphs[paragraphs.length-1][i];
                            if(!element.spacer) {
                                onlySpacerRemove = false
                                break
                            }
                        }

                        if(onlySpacerRemove === true) {
                            paragraphs.splice(paragraphs.length-1 , 1)
                        }
                    }
                }
            }

            for (let i = 0; i < styles.length; i++) {
                if(zip.getEntry(styles[i]) == null) {
                    styles.splice(i, 1)
                    i--
                }
            }

            for (let i = 0; i < images.length; i++) {
                if(zip.getEntry(images[i]) == null) {
                    images.splice(i, 1)
                    i--
                }
            }

            console.clear();
            console.log(`Checking if book ${title} exists`)
            let book = await db.findBook(title)
            if (!book) {
                console.log(`Book ${title} doesn't exists, creating it.`)
                const coverImageName = coverImagePath.substring(coverImagePath.lastIndexOf('/')+1)
                book = await db.insertBook(title, description, coverImageName,date);
                console.log(`Created book, ${JSON.stringify(book)}`)
            } else {
                console.log(`Book already exists ${JSON.stringify(book)}, skipping.`)
                continue
            }

            console.log('Inserting chapters and contents...')
            for (let i = 0; i < paragraphs.length; i++) {
                const chapter = await db.insertChapter(book.id, (i+1).toString())

                console.log(`Created chapter ${i+1}`)

                for (let j = 0; j < paragraphs[i].length; j++) {
                    const element = paragraphs[i][j];
                    if(!element.spacer) {
                        await db.insertText(chapter.id, element.text.replace(pReplaceId, book.id))
                    }
                }

                console.log(`Inserted ${paragraphs[i].length} paragraphs on chapter`)
            }

            console.log(`Checking if author ${creator} exists`)
            let author = await db.findAuthor(creator)
            if (!author) {
                console.log(`Book ${creator} doesn't exists, creating it.`)
                author = await db.insertAuthor(creator)
            }

            console.log(`Connecting ${creator} with ${title}`)
            await db.connectBookToAuthor(book.id, author.id)
            console.log(`Connected!`)

            
            for (let i = 0; i < genres.length; i++) {
                let genre = await db.findGenre(genres[i]);
                console.log(`Checking if genre ${genres[i]} exists`)
                if(!genre) {
                    console.log(`Genre ${genres[i]} doesn't exists, creating it.`)
                    genre = await db.insertGenre(genres[i])
                    console.log(`Created genre ${JSON.stringify(genre)}`)
                }
                console.log(`Connecting ${genre.genre} with ${book.name}`)
                await db.connectBookToGenre(book.id, genre.id)
                console.log(`Connected!`)
            }

            let out = outputPath+"\\"+book.id
            console.log(`Extracting style and image files to ${out}`)
            
            styles.forEach(x => {zip.extractEntryTo(x, out, false,true);})
            images.forEach(x => {zip.extractEntryTo(x, out, false,true);})
            zip.extractEntryTo(coverImagePath, out, false, true);

            console.log('Done!')
        }
    }
}

main().catch((e) => console.log(e));
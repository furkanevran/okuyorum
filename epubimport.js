"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var pg_promise_1 = __importDefault(require("pg-promise"));
var path = __importStar(require("path"));
var fs = __importStar(require("fs"));
var adm_zip_1 = __importDefault(require("adm-zip"));
//#endregion 
//#region Extension Helpers
var Cached = /** @class */ (function () {
    function Cached(query, col) {
        var _this = this;
        this.cache = [];
        this.findCached = function (name) { return __awaiter(_this, void 0, void 0, function () {
            var check, i, item_1, item;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        check = name.toLowerCase();
                        for (i = 0; i < this.cache.length; i++) {
                            item_1 = this.cache[i];
                            if (item_1[col] == check) {
                                return [2 /*return*/, item_1];
                            }
                        }
                        return [4 /*yield*/, db.one(query, name)];
                    case 1:
                        item = _a.sent();
                        this.addToCache(item);
                        return [2 /*return*/, item];
                }
            });
        }); };
    }
    Cached.prototype.addToCache = function (obj) {
        this.cache.push(JSON.parse(JSON.stringify(obj).toLowerCase()));
    };
    return Cached;
}());
//#endregion
//#region Options
var genreCached = new Cached('SELECT * FROM genres WHERE LOWER(genre) = LOWER($1)', 'genre');
var authorCached = new Cached('SELECT * FROM authors WHERE LOWER(name) = LOWER($1)', 'name');
var bookCached = new Cached('SELECT * FROM books WHERE LOWER(name) = LOWER($1)', 'name');
var options = {
    extend: function (obj) {
        var _this = this;
        obj.findGenre = function (name) { return __awaiter(_this, void 0, void 0, function () {
            var error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, genreCached.findCached(name)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_1 = _a.sent();
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        }); },
            obj.findAuthor = function (name) { return __awaiter(_this, void 0, void 0, function () {
                var error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, authorCached.findCached(name)];
                        case 1: return [2 /*return*/, _a.sent()];
                        case 2:
                            error_2 = _a.sent();
                            return [2 /*return*/, null];
                        case 3: return [2 /*return*/];
                    }
                });
            }); },
            obj.findBook = function (name) { return __awaiter(_this, void 0, void 0, function () {
                var error_3;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, bookCached.findCached(name)];
                        case 1: return [2 /*return*/, _a.sent()];
                        case 2:
                            error_3 = _a.sent();
                            return [2 /*return*/, null];
                        case 3: return [2 /*return*/];
                    }
                });
            }); },
            obj.insertGenre = function (genre) { return __awaiter(_this, void 0, void 0, function () {
                var ret;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, db.one('INSERT INTO genres(genre) VALUES($1) RETURNING  id, genre', genre)];
                        case 1:
                            ret = _a.sent();
                            genreCached.addToCache(ret);
                            return [2 /*return*/, ret];
                    }
                });
            }); },
            obj.insertAuthor = function (name) { return __awaiter(_this, void 0, void 0, function () {
                var ret;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, db.one('INSERT INTO authors(name) VALUES($1) RETURNING id, name', name)];
                        case 1:
                            ret = _a.sent();
                            authorCached.addToCache(ret);
                            return [2 /*return*/, ret];
                    }
                });
            }); },
            obj.insertBook = function (name, description, cover_filename, created_on) { return __awaiter(_this, void 0, void 0, function () {
                var ret;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, db.one('INSERT INTO books(name, description, cover_filename, created_on) VALUES($1, $2, $3, $4) RETURNING id, name', [name, description, cover_filename, created_on])];
                        case 1:
                            ret = _a.sent();
                            bookCached.addToCache(ret);
                            return [2 /*return*/, ret];
                    }
                });
            }); },
            obj.insertChapter = function (book_id, name) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, db.one('INSERT INTO book_chapters(book_id, name) VALUES($1, $2) RETURNING id, name', [book_id, name])];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            }); },
            obj.insertText = function (chapter_id, text) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, db.one('INSERT INTO chapter_sentences(chapter_id, text) VALUES($1, $2) RETURNING 1', [chapter_id, text])];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            }); },
            obj.connectBookToAuthor = function (book_id, author_id) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, db.one('INSERT INTO book_authors(book_id, author_id) VALUES($1, $2) RETURNING 1', [book_id, author_id])];
                });
            }); },
            obj.connectBookToGenre = function (book_id, genre_id) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, db.one('INSERT INTO book_genres(book_id, genre_id) VALUES($1, $2) RETURNING 1', [book_id, genre_id])];
                });
            }); };
    }
};
//#endregion
//#region Database Connection
var cn = {
    database: 'okuyo',
    user: 'postgres',
    password: 'password',
    host: 'localhost',
    port: 5432
};
var pgp = pg_promise_1["default"](options);
var db = pgp(cn);
//#endregion
var directoryPath = 'C:\\Users\\furka\\Downloads\\epubs\\Epub Kitaplarım\\'; /*path.join(__dirname, 'epub');*/
var outputPath = path.join(__dirname, '/public/epubdata');
var pReplaceId = '°id°';
function GetXMLNodes(obj, node, flags) {
    if (flags === void 0) { flags = 'i'; }
    return new RegExp("<(?:.*?)(?<!calibre:|\")" + node + "(?:.*?)>(.*?)</(?:.*?)" + node, flags).exec(obj);
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var files, _loop_1, index;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    files = fs.readdirSync(directoryPath);
                    _loop_1 = function (index) {
                        var file, zip_1, entries, title, creator, description, date, htmlPages, styles, images, genres, coverPage, coverImagePath, paragraphs, _loop_2, ei, i, i, book, coverImageName, i, chapter, j, element, author, i, genre, out_1, error_4;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    file = files[index];
                                    _a.label = 1;
                                case 1:
                                    _a.trys.push([1, 26, , 27]);
                                    if (!file.endsWith('.epub')) return [3 /*break*/, 25];
                                    zip_1 = new adm_zip_1["default"](directoryPath + '/' + file);
                                    entries = zip_1.getEntries();
                                    title = void 0;
                                    creator = void 0;
                                    description = void 0;
                                    date = void 0;
                                    htmlPages = [];
                                    styles = [];
                                    images = [];
                                    genres = [];
                                    coverPage = void 0;
                                    coverImagePath = void 0;
                                    paragraphs = [];
                                    _loop_2 = function (ei) {
                                        var entry = entries[ei];
                                        var entryName = entry.entryName;
                                        if (entryName.endsWith('.opf')) {
                                            console.log('OPF FILE FOUND FOR FILE ' + file);
                                            var data = entry.getData().toString('utf8');
                                            title = GetXMLNodes(data, 'title')[1];
                                            creator = GetXMLNodes(data, 'creator')[1];
                                            date = GetXMLNodes(data, 'date')[1];
                                            try {
                                                description = GetXMLNodes(data, 'description')[1];
                                            }
                                            catch (error) {
                                                description = "<p>Kitapta açıklama bulunmadı.</p>";
                                            }
                                            var reHtml = /href="(.*?)"(?:.*?)media-type="(?:.*?)html/ig;
                                            var item = null;
                                            while ((item = reHtml.exec(data)) != null) {
                                                htmlPages.push(item[1]);
                                            }
                                            var reCSS = /href="(.*?)"(?:.*?)media-type="(?:.*?)css/ig;
                                            item = null;
                                            while ((item = reCSS.exec(data)) != null) {
                                                styles.push(item[1]);
                                            }
                                            var reImages = /href="(.*?)"(?:.*?)media-type="(?:.*?)image/ig;
                                            item = null;
                                            while ((item = reImages.exec(data)) != null) {
                                                images.push(item[1]);
                                            }
                                            var reSubject = /<(?:.*?)subject(?:.*?)>(.*?)</ig;
                                            item = null;
                                            while ((item = reSubject.exec(data)) != null) {
                                                genres.push(item[1]);
                                            }
                                            try {
                                                coverPage = /reference(?:.*?)href="(.*?)"(?:.*?)cover/i.exec(data)[1];
                                                if (!coverPage.includes('.'))
                                                    throw new Error();
                                            }
                                            catch (error) {
                                                try {
                                                    coverPage = /href="(.*?)(?<=html)"(?:.*?)(?:cover|kapak)"/i.exec(data)[1];
                                                    if (!coverPage.includes('.'))
                                                        throw new Error();
                                                }
                                                catch (error) {
                                                    try {
                                                        coverPage = /href="(.*?)(kapak|cover)(.*?)(?<=html)"/i.exec(data)[0];
                                                        coverPage = coverPage[1] + coverPage[2] + coverPage[3];
                                                        if (!coverPage.includes('.'))
                                                            throw new Error();
                                                    }
                                                    catch (error) {
                                                        coverPage = null;
                                                    }
                                                }
                                            }
                                            try {
                                                coverImagePath = /href="(.*?)(?<=jpg|jpeg|bmp|png|webp|gif)"(?:.*?)id=".*?(?:cover|kapak).*?"/i.exec(data)[1];
                                                if (!coverImagePath.includes('.'))
                                                    throw new Error();
                                            }
                                            catch (error) {
                                                try {
                                                    coverImagePath = /href="(.*?)(kapak|cover)(.*?)(?<=jpg|jpeg|bmp|png|webp|gif)"/i.exec(data);
                                                    coverImagePath = coverImagePath[1] + coverImagePath[2] + coverImagePath[3];
                                                    if (!coverImagePath.includes('.'))
                                                        throw new Error();
                                                }
                                                catch (error) {
                                                    coverImagePath = null;
                                                }
                                            }
                                            return "continue";
                                        }
                                        if (!coverImagePath && entryName.includes(coverPage)) {
                                            try {
                                                coverImagePath = /(?:image|img)(?:.*?)(?:src|href)="(.*?)"/i.exec(entry.getData().toString('utf8'))[1];
                                                var currentEntry = entryName.split('/');
                                                var currentIndex = currentEntry.length - 3;
                                                while (coverImagePath.includes('../')) {
                                                    coverImagePath = coverImagePath.replace('../', currentEntry[currentIndex--] + '/');
                                                }
                                            }
                                            catch (error) {
                                                coverImagePath = null;
                                            }
                                        }
                                        if (entryName.includes(coverImagePath)) {
                                            coverImagePath = entryName;
                                            return "continue";
                                        }
                                        if (entryName.endsWith('.css')) {
                                            for (var i = 0; i < styles.length; i++) {
                                                if (entryName.includes(styles[i])) {
                                                    styles[i] = entryName;
                                                    break;
                                                }
                                            }
                                            return "continue";
                                        }
                                        if (entryName.endsWith('.jpg')
                                            || entryName.endsWith('.png')
                                            || entryName.endsWith('.jpeg')
                                            || entryName.endsWith('.bmp')
                                            || entryName.endsWith('.webp')
                                            || entryName.endsWith('.gif')) {
                                            for (var i = 0; i < images.length; i++) {
                                                if (entryName.includes(images[i])) {
                                                    images[i] = entryName;
                                                    break;
                                                }
                                            }
                                            return "continue";
                                        }
                                        if (htmlPages.some(function (x) { return entryName.includes(x); })) {
                                            var data = entry.getData().toString('utf8');
                                            var html = data.split(/body/i)[1];
                                            html = html.replace(/<a(.*?)<\/a>/i, '');
                                            html = html.replace(/<div(.*?)>/i, '');
                                            html = html.replace(/<\/div(.*?)>/i, '');
                                            html = html.substring(html.indexOf('>') + 1, html.length - 2);
                                            var hasImages = false;
                                            //#region Fix Images
                                            var image = null;
                                            var reImages = /<(?:image|img)(?:.*?)(?:src|href)="(.*?)"(?:.*?)(?:\/|image|img)>/gi;
                                            while ((image = reImages.exec(html)) != null) {
                                                var replaceTo = false;
                                                var loop = true;
                                                var imageName = image[1].substring(image[1].lastIndexOf('/') + 1);
                                                if (coverImagePath.includes(imageName)) {
                                                    replaceTo = true;
                                                    loop = false;
                                                }
                                                for (var i = 0; i < images.length; i++) {
                                                    var element = images[i];
                                                    var loopImageName = element.substring(element.lastIndexOf('/') + 1);
                                                    if (imageName == loopImageName) {
                                                        replaceTo = true;
                                                    }
                                                }
                                                if (replaceTo) {
                                                    hasImages = true;
                                                    html = html.replace(image[1], "/" + outputPath.substring(outputPath.lastIndexOf('\\') + 1) + "/" + pReplaceId + "/" + imageName);
                                                }
                                                else {
                                                    html = html.replace(image[0], '');
                                                }
                                            }
                                            //#endregion
                                            paragraphs.push([]);
                                            var reText = /<(p|h|article|blockquote|image|img|svg|ul|ol)(.*?)>(.*?)<\/(p|h|article|blockquote|image|img|svg|ul|ol)(.*?)>/gims;
                                            var text = void 0;
                                            while ((text = reText.exec(html)) != null) {
                                                /*const tag = `<${text[1]}${text[2]}>\r\n`
                                                const end = '\r\n</'+text[4]+text[5]+'>'
                                                const content = text[3]
                                                console.log(tag + content + end)*/
                                                if (text[3] == '') {
                                                    var objBefore = paragraphs[paragraphs.length - 1][paragraphs[paragraphs.length - 1].length - 1];
                                                    if (objBefore && !objBefore.spacer) {
                                                        paragraphs[paragraphs.length - 1].push({ spacer: true });
                                                    }
                                                    else {
                                                        continue;
                                                    }
                                                }
                                                else {
                                                    paragraphs[paragraphs.length - 1].push({ text: text[0] });
                                                }
                                            }
                                            if (hasImages === false) {
                                                var onlySpacerRemove = true;
                                                for (var i = 0; i < paragraphs[paragraphs.length - 1].length; i++) {
                                                    var element = paragraphs[paragraphs.length - 1][i];
                                                    if (!element.spacer) {
                                                        onlySpacerRemove = false;
                                                        break;
                                                    }
                                                }
                                                if (onlySpacerRemove === true) {
                                                    paragraphs.splice(paragraphs.length - 1, 1);
                                                }
                                            }
                                        }
                                    };
                                    for (ei = 0; ei < entries.length; ei++) {
                                        _loop_2(ei);
                                    }
                                    for (i = 0; i < styles.length; i++) {
                                        if (zip_1.getEntry(styles[i]) == null) {
                                            styles.splice(i, 1);
                                            i--;
                                        }
                                    }
                                    for (i = 0; i < images.length; i++) {
                                        if (zip_1.getEntry(images[i]) == null) {
                                            images.splice(i, 1);
                                            i--;
                                        }
                                    }
                                    console.clear();
                                    console.log("Checking if book " + title + " exists");
                                    return [4 /*yield*/, db.findBook(title)];
                                case 2:
                                    book = _a.sent();
                                    if (!!book) return [3 /*break*/, 4];
                                    console.log("Book " + title + " doesn't exists, creating it.");
                                    coverImageName = coverImagePath.substring(coverImagePath.lastIndexOf('/') + 1);
                                    return [4 /*yield*/, db.insertBook(title, description, coverImageName, date)];
                                case 3:
                                    book = _a.sent();
                                    console.log("Created book, " + JSON.stringify(book));
                                    return [3 /*break*/, 5];
                                case 4:
                                    console.log("Book already exists " + JSON.stringify(book) + ", skipping.");
                                    return [2 /*return*/, "continue"];
                                case 5:
                                    console.log('Inserting chapters and contents...');
                                    i = 0;
                                    _a.label = 6;
                                case 6:
                                    if (!(i < paragraphs.length)) return [3 /*break*/, 13];
                                    return [4 /*yield*/, db.insertChapter(book.id, (i + 1).toString())];
                                case 7:
                                    chapter = _a.sent();
                                    console.log("Created chapter " + (i + 1));
                                    j = 0;
                                    _a.label = 8;
                                case 8:
                                    if (!(j < paragraphs[i].length)) return [3 /*break*/, 11];
                                    element = paragraphs[i][j];
                                    if (!!element.spacer) return [3 /*break*/, 10];
                                    return [4 /*yield*/, db.insertText(chapter.id, element.text.replace(pReplaceId, book.id))];
                                case 9:
                                    _a.sent();
                                    _a.label = 10;
                                case 10:
                                    j++;
                                    return [3 /*break*/, 8];
                                case 11:
                                    console.log("Inserted " + paragraphs[i].length + " paragraphs on chapter");
                                    _a.label = 12;
                                case 12:
                                    i++;
                                    return [3 /*break*/, 6];
                                case 13:
                                    console.log("Checking if author " + creator + " exists");
                                    return [4 /*yield*/, db.findAuthor(creator)];
                                case 14:
                                    author = _a.sent();
                                    if (!!author) return [3 /*break*/, 16];
                                    console.log("Book " + creator + " doesn't exists, creating it.");
                                    return [4 /*yield*/, db.insertAuthor(creator)];
                                case 15:
                                    author = _a.sent();
                                    _a.label = 16;
                                case 16:
                                    console.log("Connecting " + creator + " with " + title);
                                    return [4 /*yield*/, db.connectBookToAuthor(book.id, author.id)];
                                case 17:
                                    _a.sent();
                                    console.log("Connected!");
                                    i = 0;
                                    _a.label = 18;
                                case 18:
                                    if (!(i < genres.length)) return [3 /*break*/, 24];
                                    return [4 /*yield*/, db.findGenre(genres[i])];
                                case 19:
                                    genre = _a.sent();
                                    console.log("Checking if genre " + genres[i] + " exists");
                                    if (!!genre) return [3 /*break*/, 21];
                                    console.log("Genre " + genres[i] + " doesn't exists, creating it.");
                                    return [4 /*yield*/, db.insertGenre(genres[i])];
                                case 20:
                                    genre = _a.sent();
                                    console.log("Created genre " + JSON.stringify(genre));
                                    _a.label = 21;
                                case 21:
                                    console.log("Connecting " + genre.genre + " with " + book.name);
                                    return [4 /*yield*/, db.connectBookToGenre(book.id, genre.id)];
                                case 22:
                                    _a.sent();
                                    console.log("Connected!");
                                    _a.label = 23;
                                case 23:
                                    i++;
                                    return [3 /*break*/, 18];
                                case 24:
                                    out_1 = outputPath + "\\" + book.id;
                                    console.log("Extracting style and image files to " + out_1);
                                    styles.forEach(function (x) { zip_1.extractEntryTo(x, out_1, false, true); });
                                    images.forEach(function (x) { zip_1.extractEntryTo(x, out_1, false, true); });
                                    zip_1.extractEntryTo(coverImagePath, out_1, false, true);
                                    console.log('Done!');
                                    _a.label = 25;
                                case 25: return [3 /*break*/, 27];
                                case 26:
                                    error_4 = _a.sent();
                                    console.log('ERROR ON FILE' + file);
                                    return [3 /*break*/, 27];
                                case 27: return [2 /*return*/];
                            }
                        });
                    };
                    index = 0;
                    _a.label = 1;
                case 1:
                    if (!(index < files.length)) return [3 /*break*/, 4];
                    return [5 /*yield**/, _loop_1(index)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    index++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/];
            }
        });
    });
}
main()["catch"](function (e) { return console.log(e); });

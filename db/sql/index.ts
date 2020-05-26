import {QueryFile, IQueryFileOptions} from 'pg-promise';
import getConfig from 'next/config'
const { serverRuntimeConfig } = getConfig()

const path = require('path');

export const books = {
    findById: sql('books/findById.sql'),
    findByName: sql('books/findByName.sql'),
    page: sql('books/page.sql'),
    count: sql('books/count.sql')
};

export const users = {
    create: sql('users/create.sql'),
    findByEmail: sql('users/findByEmail.sql')
};

function sql(file: string): QueryFile {

    const fullPath: string = path.join(serverRuntimeConfig.PROJECT_ROOT, '/db/sql/', file);

    const options: IQueryFileOptions = {
        minify: true,
        noWarnings: true
    };

    const qf: QueryFile = new QueryFile(fullPath, options);

    if (qf.error) {
        console.error(qf.error);
    }

    return qf;
}
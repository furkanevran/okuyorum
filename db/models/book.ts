export default interface Book {
    id: bigint;
    name: string;
    description: string;
    cover_filename: string;
    created_on: Date;
    modified_on: Date
}

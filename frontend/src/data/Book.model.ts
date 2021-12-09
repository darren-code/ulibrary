export default interface Book {
    isbn?: string
    title?: string
    author?: string
    genre?: string
    status?: string
    holder?: string
    publisher?: string
}

export interface FabricBook {
    Key?: string
    Record?: Record
}

export interface Record {
    Author?: string
    Genre?: string
    Holder?: string
    ISBN?: string
    Publisher?: string
    Status?: string
    Title?: string
    docType?: string
}

export interface PersistentRecord {
    Author?: string
    Genre?: string
    Holder?: string
    ISBN?: string
    Publisher?: string
    Title?: string
}
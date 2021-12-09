import Book, { Record } from "./Book.model";

export default interface History {
  TxId?: string
  timestamp?: Date
  IsDelete?: string
  Value?: Record
}
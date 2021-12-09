'use-strict'

const { Contract } = require('fabric-contract-api')

const EVENT_NAME = 'chaincodeEvent';

class Library extends Contract {
    async InitLedger(ctx) {
        const books = [
            {
                ISBN: '978-1-56619-909-4',
                Genre: 'Comedy',
                Holder: 'Joe',
                Title: 'Carrot is Fun',
                Status: 'Available',
                Author: 'Jack',
                Publisher: 'Penguin',
            },
            {
                ISBN: '978-1-56619-907-5',
                Genre: 'Romance',
                Holder: 'Library',
                Title: 'Romeo and Juliet',
                Status: 'Available',
                Author: 'William S.',
                Publisher: 'Devlin',
            },
            {
                ISBN: '978-1-4028-9462-6',
                Genre: 'Educational',
                Holder: 'Library',
                Title: 'ReactJS',
                Status: 'Available',
                Author: 'Norm',
                Publisher: 'OReilly',
            },
        ]

        for (const book of books) {
            book.docType = 'book'
            await ctx.stub.putState(book.ISBN, Buffer.from(JSON.stringify(book)))
            console.info(`Book ${book.ISBN} initialized`)
        }
    }

    // Insert Book
    async InsertBook(ctx, isbn, title, genre, holder, status, author, publisher) {
        let usertype = await this.getCurrentUserType(ctx);
        const exists = await this.IsBookExist(ctx, isbn)
        if (exists) {
            throw new Error(`The book ${isbn} already exists`)
        }
        const book = {
            ISBN: isbn,
            Genre: genre,
            Holder: holder,
            Title: title,
            Status: status,
            Author: author,
            Publisher: publisher
        }
        await ctx.stub.putState(isbn, Buffer.from(JSON.stringify(book)))
        await ctx.stub.setEvent(EVENT_NAME, Buffer.from(JSON.stringify(book)))
        return JSON.stringify(book)
    }

    // Get Specific Book Information
    async GetBook(ctx, isbn) {
        const bookJSON = await ctx.stub.getState(isbn)
        if (!bookJSON || bookJSON.length == 0) {
            throw new Error(`The book ${isbn} does not exists`)
        }
        return bookJSON.toString()
    }

    // Update Book
    async UpdateBook(ctx, isbn, title, genre, holder, status, author, publisher) {
        let usertype = await this.getCurrentUserType(ctx);
        // if (usertype != "admin") {
        //     throw new Error(`This user does have access to edit a book`);
        // }

        const exists = await this.IsBookExist(ctx, isbn)
        if (!exists) {
            throw new Error(`The book ${isbn} does not exists`)
        }
        
        const updatedBook = {
            ISBN: isbn,
            Genre: genre,
            Holder: holder,
            Title: title,
            Status: status,
            Author: author,
            Publisher: publisher
        }

        await ctx.stub.putState(isbn, Buffer.from(JSON.stringify(updatedBook)))
        await ctx.stub.setEvent(EVENT_NAME, Buffer.from(JSON.stringify(updatedBook)))

        return true
    }

    // Delete Specific Book By ISBN
    async DeleteBook(ctx, isbn) {
        let usertype = await this.getCurrentUserType(ctx);
        // if (usertype != "admin") {
        //     throw new Error(`This user does have access to delete a book`);
        // }

        const exists = await this.IsBookExist(ctx, isbn)
        if (!exists) {
            throw new Error(`The book ${isbn} does not exists`)
        }
        await ctx.stub.deleteState(isbn)
        await ctx.stub.setEvent(EVENT_NAME, Buffer.from(JSON.stringify({ISBN: isbn})))

        return true
    }

    // Check if Book is already exist or not
    async IsBookExist(ctx, isbn) {
        const bookJSON = await ctx.stub.getState(isbn)
        return bookJSON && bookJSON.length > 0
    }

    // Transfer Stakeholder of Book
    async TransferBook(ctx, isbn, newHolder, newStatus) {
        let usertype = await this.getCurrentUserType(ctx);
        // if (usertype != "admin") {
        //     throw new Error(`This user does have access to transfer this book`);
        // }
        
        const bookString = await this.GetBook(ctx, isbn)
        const book = JSON.parse(bookString)
        book.Status = newStatus
        book.Holder = newHolder
        
        await ctx.stub.putState(isbn, Buffer.from(JSON.stringify(book)))
        await ctx.stub.setEvent(EVENT_NAME, Buffer.from(JSON.stringify(book)))

        return true
    }

    // Get All Books Information
    async GetAllBooks(ctx) {
        const allResults = []
        const iterator = await ctx.stub.getStateByRange('', '')
        let result = await iterator.next()
        while (!result.done) {
            const strValue = result.value.value.toString('utf8')
            let record
            try {
                record = JSON.parse(strValue)
            } catch (err) {
                console.log(err)
                record = strValue
            }
            allResults.push({ Key: result.value.key, Record: record })
            result = await iterator.next()
        }
        return JSON.stringify(allResults)
    }

    // Get Book Log
    async GetBookHistory(ctx, isbn) {
        const allResults = []
        const iterator = await ctx.stub.getHistoryForKey(isbn)

        while (true) {
            console.log('Getting book history data')
            let result = await iterator.next()

            if (result.value && result.value.value.toString()) {
                let record = {}
                record.TxId = result.value.tx_id
                record.IsDelete = result.value.is_delete.toString()
                let d = new Date(0)
                d.setUTCSeconds(result.value.timestamp.seconds.low)
                record.timestamp = d.toLocaleString("en-US", { timezone: "Asia/Jakarta" })

                const strValue = result.value.value.toString('utf8')
                try {
                    record.Value = JSON.parse(strValue)
                } catch (err) {
                    console.log(err)
                    record.Value = strValue
                }
                allResults.push(record)
            }

            if (result.done) {
                await iterator.close()
                return JSON.stringify(allResults)
            }
        }
    }

    // Get Current User ID
    async getCurrentUserId(ctx) {
        let id = [];
        id.push(ctx.clientIdentity.getID());
        var begin = id[0].indexOf("/CN=");
        var end = id[0].lastIndexOf("::/C=");
        let userid = id[0].substring(begin + 4, end);
        return userid;
    }

    // Get Current User Role
    async getCurrentUserType(ctx) {
        let userid = await this.getCurrentUserId(ctx);
        console.log('userid', userid);
        if (userid == "admin" || userid == "Admin@org1.example.com" || userid == "Admin@org2.example.com") {
            return "admin";
        }
        return ctx.clientIdentity.getAttributeValue("usertype");
    }
}

module.exports = Library

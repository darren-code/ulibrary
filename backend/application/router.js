'use strict';

const express = require('express');
const utils = require('./utils.js');
const sampleNetworkRouter = express.Router();

const STATUS_SUCCESS = 200;
const STATUS_CLIENT_ERROR = 400;
const STATUS_SERVER_ERROR = 500;
const USER_NOT_ENROLLED = 1000;
const INVALID_HEADER = 1001;

// Get Username & Password
async function getUsernamePassword(request) {
    if (!request.headers.authorization || request.headers.authorization.indexOf('Basic ') === -1) {
        return new Promise().reject('Missing Authorization Header');
    }

    const base64Credentials = request.headers.authorization.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');

    if (!username || !password) {
        return new Promise().reject('Invalid Authentication Credentials');
    }

    request.username = username;
    request.password = password;

    return request;
}

// Submit Transaction
async function submitTx(request, txName, ...args) {
    try {
        await getUsernamePassword(request);
        return utils.setUserContext(request.username, request.password).then((contract) => {
            args.unshift(txName);
            args.unshift(contract);
            return utils.submitTx.apply("unused", args).then(buffer => {
                return buffer;
            }, error => {
                return Promise.reject(error);
            });
        }, error => {
            return Promise.reject(error);
        });
    } catch (error) {
        return Promise.reject(error);
    }
}

// Evaluate Transaction
async function evalTx(request, txName, ...args) {
    try {
        await getUsernamePassword(request);
        return utils.setUserContext(request.username, request.password).then((contract) => {
            args.unshift(txName);
            args.unshift(contract);
            return utils.evalTx.apply("unused", args).then(buffer => {
                return buffer;
            }, error => {
                return Promise.reject(error);
            });
        }, error => {
            return Promise.reject(error);
        });
    } catch (error) {
        return Promise.reject(error);
    }
}

// Get All Books
sampleNetworkRouter.route('/books').get(function (request, response) {
    evalTx(request, 'GetAllBooks').then((result) => {
        response.status(STATUS_SUCCESS);
        response.setHeader('Content-Type', 'application/json');
        response.send(JSON.parse(result));
    }, (error) => {
        response.status(STATUS_SERVER_ERROR);
        response.send(utils.prepareErrorResponse(error, STATUS_SERVER_ERROR, "There was a problem getting the list of books."));
    });
});

// Get Specific Book
sampleNetworkRouter.route('/book/:isbn').get(function (request, response) {
    evalTx(request, 'GetBook', request.params.isbn).then((result) => {
        response.status(STATUS_SUCCESS);
        response.setHeader('Content-Type', 'application/json');
        response.send(JSON.parse(result));
    }, (error) => {
        response.status(STATUS_SERVER_ERROR);
        response.send(utils.prepareErrorResponse(error, STATUS_SERVER_ERROR, 'Book ISBN ' + request.params.isbn + ' does not exist or the user does not have access to book details at this time.'));
    });
});

// Insert New Book
sampleNetworkRouter.route('/insert-book').post(function (request, response) {
    submitTx(request, 'InsertBook',
                request.body.isbn,
                request.body.title,
                request.body.genre,
                request.body.holder,
                request.body.status,
                request.body.author,
                request.body.publisher).then((result) => {
        response.status(STATUS_SUCCESS);
        response.setHeader('Content-Type', 'application/json');
        response.send(JSON.parse(result));
    }, (error) => {
        response.status(STATUS_SERVER_ERROR);
        response.send(utils.prepareErrorResponse(error, STATUS_SERVER_ERROR, "There was a problem on inserting the book."));
    });
});

// Get Book History
sampleNetworkRouter.route('/book-history/:isbn').get(function (request, response) {
    evalTx(request, 'GetBookHistory', request.params.isbn).then((result) => {
        response.status(STATUS_SUCCESS);
        response.setHeader('Content-Type', 'application/json');
        response.send(JSON.parse(result));
    }, (error) => {
        response.status(STATUS_SUCCESS);
        response.send(utils.prepareErrorResponse(error, STATUS_SERVER_ERROR, "There was a problem on fetching history for book, ", request.params.isbn));
    });
});

// Edit Book Info
sampleNetworkRouter.route('/update-book').put(function (request, response) {
    submitTx(request, 'UpdateBook',
                request.body.isbn,
                request.body.title,
                request.body.genre,
                request.body.holder,
                request.body.status,
                request.body.author,
                request.body.publisher).then((result) => {
        response.status(STATUS_SUCCESS);
        response.send(result);
    }, (error) => {
        response.status(STATUS_SERVER_ERROR);
        response.send(utils.prepareErrorResponse(error, STATUS_SERVER_ERROR, "There was a problem on updating the book, ", request.params.isbn));
    });
});

// Transfer Book Stakeholder and Status
sampleNetworkRouter.route('/transfer-book').put(function (request, response) {
    submitTx(request, 'TransferBook', request.body.isbn, request.body.holder, request.body.status).then((result) => {
        response.status(STATUS_SUCCESS);
        response.send(result);
    }, (error) => {
        response.status(STATUS_SERVER_ERROR);
        response.send(utils.prepareErrorResponse(error, STATUS_SERVER_ERROR, "There was a problem on transferring the book, ", request.params.isbn));
    });
});

// Delete Specific Book
sampleNetworkRouter.route('/delete-book/:isbn').delete(function (request, response) {
    submitTx(request, 'DeleteBook', request.params.isbn).then((result) => {
        response.status(STATUS_SUCCESS);
        response.send(result);
    }, (error) => {
        response.status(STATUS_SERVER_ERROR);
        response.send(utils.prepareErrorResponse(error, STATUS_SERVER_ERROR, "There was a problem on deleting the book, " + request.params.isbn));
    });
});

// Register User
sampleNetworkRouter.route('/register-user').post(function (request, response) {
    try {
        let userId = request.body.userid;
        let userPwd = request.body.password;
        let items = request.body.items;

        getUsernamePassword(request).then(request => {
            utils.registerUser(userId, userPwd, items, request.username).then((result) => {
                response.status(STATUS_SUCCESS);
                response.send(result);
            }, (error) => {
                response.status(STATUS_CLIENT_ERROR);
                response.send(utils.prepareErrorResponse(error, STATUS_CLIENT_ERROR, "User, " + userId + " could not be registered. Verify if calling identity has admin privileges."));
            });
        }, error => {
            response.status(STATUS_CLIENT_ERROR);
            response.send(utils.prepareErrorResponse(error, INVALID_HEADER, "Invalid header: User, " + userId + " could not be registered."));
        });
    } catch (error) {
        response.status(STATUS_SERVER_ERROR);
        response.send(utils.prepareErrorResponse(error, STATUS_SERVER_ERROR, "Internal server error: User, " + userId + " could not be registered."));
    }
});

// Enroll User
sampleNetworkRouter.route('/enroll-user/').post(function (request, response) {
    let items = request.body.items;
    getUsernamePassword(request).then(request => {
        utils.enrollUser(request.username, request.password, items).then(result => {
            response.status(STATUS_SUCCESS);
            response.send(result);
        }, error => {
            response.status(STATUS_CLIENT_ERROR);
            response.send(utils.prepareErrorResponse(error, STATUS_CLIENT_ERROR, "User, " + request.username + "could not be enrolled. Verify if that user is registered."));
        });
    }), (error => {
        response.status(STATUS_CLIENT_ERROR);
        response.send(utils.prepareErrorResponse(error, INVALID_HEADER, "Invalid header."));
    });
});

// Check if User is Enrolled or Not
sampleNetworkRouter.route('/is-user-enrolled/:id').get(function (request, response) {
    getUsernamePassword(request).then(request => {
        let userId = request.params.id;
        utils.isUserEnrolled(userId).then(result => {
            response.status(STATUS_SUCCESS);
            response.send(result);
        }, error => {
            response.status(STATUS_CLIENT_ERROR);
            response.send(utils.prepareErrorResponse(error, STATUS_CLIENT_ERROR, "Error checking enrollment for user, " + request.params.id));
        });
    }, ((error) => {
        response.status(STATUS_CLIENT_ERROR);
        response.send(utils.prepareErrorResponse(error, INVALID_HEADER, "Invalid header: Error checking enrollment for user, " + request.params.id));
    }));
});

// Get All Users
sampleNetworkRouter.route('/users').get(function (request, response) {
    getUsernamePassword(request).then(request => {
        utils.getAllUsers(request.username).then((result) => {
            response.status(STATUS_SUCCESS);
            response.send(result);
        }, (error) => {
            response.status(STATUS_SERVER_ERROR);
            response.send(utils.prepareErrorResponse(error, STATUS_SERVER_ERROR, "Problem getting list of users."));
        });
    }, ((error) => {
        response.status(STATUS_CLIENT_ERROR);
        response.send(utils.prepareErrorResponse(error, INVALID_HEADER, "Invalid header."));
    }));
});

// Get Specific User
sampleNetworkRouter.route('/users/:id').get(function (request, response) {
    getUsernamePassword(request).then(request => {
        utils.isUserEnrolled(request.params.id).then(result1 => {
            if (result1) {
                utils.getUser(request.params.id, request.username).then(result2 => {
                    response.status(STATUS_SUCCESS);
                    response.send(result2);
                }, (error) => {
                    response.status(STATUS_SERVER_ERROR);
                    response.send(utils.prepareErrorResponse(error, STATUS_SERVER_ERROR, "Could not get user details for user, " + request.params.id));
                });
            } else {
                let error = {};
                response.status(STATUS_CLIENT_ERROR);
                response.send(utils.prepareErrorResponse(error, USER_NOT_ENROLLED, "Verify if the user is registered and enrolled."));
            }
        }, error => {
            response.status(STATUS_SERVER_ERROR);
            response.send(utils.prepareErrorResponse(error, STATUS_SERVER_ERROR, "Problem checking for user enrollment."));
        });
    }, ((error) => {
        response.status(STATUS_CLIENT_ERROR);
        response.send(utils.prepareErrorResponse(error, INVALID_HEADER, "Invalid header"));
    }));
});

// Update User
sampleNetworkRouter.route('/update-user/:id').put(function (request, response) {
    getUsernamePassword(request).then(request => {
        utils.isUserEnrolled(request.params.id).then(result1 => {
            if (result1) {
                utils.updateUserAttributes(request.params.id, request.username, request.body.items).then(result2 => {
                    response.status(STATUS_SUCCESS);
                    response.send(result2);
                }, (error) => {
                    response.status(STATUS_SERVER_ERROR);
                    response.send(utils.prepareErrorResponse(error, STATUS_SERVER_ERROR, "Could not update user details for user, " + request.params.id));
                });
            } else {
                let error = {};
                response.status(STATUS_CLIENT_ERROR);
                response.send(utils.prepareErrorResponse(error, USER_NOT_ENROLLED, "Verify if the user is registered and enrolled."));
            }
        }, error => {
            response.status(STATUS_SERVER_ERROR);
            response.send(utils.prepareErrorResponse(error, STATUS_SERVER_ERROR, "Problem checking for user enrollment."));
        });
    }, ((error) => {
        response.status(STATUS_CLIENT_ERROR);
        response.send(utils.prepareErrorResponse(error, INVALID_HEADER, "Invalid header"));
    }));
});

module.exports = sampleNetworkRouter;
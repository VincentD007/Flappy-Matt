class InvalidBody extends Error {
    constructor(message = 'Error') {
        super(message);
        this.name = 'InvalidBody';
    }
}

class InvalidCredentials extends Error {
    constructor(message = 'Error') {
        super(message);
        this.name = 'InvalidCredentials';
    }
}

class UserAlreadyExists extends Error {
    constructor(message = 'Error') {
        super(message);
        this.name = 'UserAlreadyExists';
    }
}

class NotFound extends Error {
    constructor(message = 'Error') {
        super(message);
        this.name = "NotFound";
    }
}

class InvalidSession extends Error {
    constructor(message = 'Error') {
        super(message);
        this.name = 'InvalidSession';
    }
}

module.exports = {InvalidBody, InvalidCredentials, UserAlreadyExists, InvalidSession, NotFound}

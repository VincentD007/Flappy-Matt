class InvalidBody extends Error{
    constructor(message = 'Error') {
        super(message);
        this.name = 'InvalidBody';
    }
}

class InvalidCredentials extends Error{
    constructor(message = 'Error') {
        super(message);
        this.name = 'InvalidCredentials';
    }
}

class UserAlreadyExists extends Error{
    constructor(message = 'Error') {
        super(message);
        this.name = 'UserAlreadyExists';
    }
}

module.exports = {InvalidBody, InvalidCredentials, UserAlreadyExists}

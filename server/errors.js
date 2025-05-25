export class InvalidBody extends Error{
    constructor(message) {
        super(message);
        this.name = 'InvalidBody';
    }
}

export class InvalidCredentials extends Error{
    constructor(message) {
        super(message);
        this.name = 'InvalidCredentials';
    }
}

export class UsernameExists extends Error{
    constructor(message) {
        super(message);
        this.name = UsernameExists;
    }
}


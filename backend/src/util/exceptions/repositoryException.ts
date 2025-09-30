export class NotFoundException extends Error {
    constructor(message: string) {
        super(message);
        this.name = "NotFoundException";
    }
}

export class InvalidElementException extends Error {
    constructor(message: string) {
        super(message);
        this.name = "InvalidElementException";
    }
}

export class FailedToCreateTable extends Error {
    constructor(message: string, error: Error) {
        super(message);
        this.name = "FailedToCreateTable";
        this.stack = error.stack;
        this.message = `${message}: ${error.message}`;
    }
}
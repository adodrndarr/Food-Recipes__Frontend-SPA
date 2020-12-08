export class User {
    constructor(
        public id: string,
        public email: string,
        private _token: string,
        private _tokenExpirationDate: Date
    ) {}

    get token(): string {
        if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate) {
            return null;
        }
        return this._token;
    }
}

export class UserDTO {
    constructor(
        public email: string,
        public password: string,
        public returnSecureToken: boolean
    ) {}
}

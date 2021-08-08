import {Post} from "./apiBoundComponent";
import {isA} from "ts-type-checked";
import RuntimeError = WebAssembly.RuntimeError;
import equal from 'fast-deep-equal/es6/react';

type UserInfo = {
    _cuwais_type: "user",
    display_name: string,
    display_real_name: boolean,
    google_id: string,
    is_admin: boolean,
    is_bot: boolean,
    nickname: string,
    real_name: string,
    user_id: number
};

type UserResponse = {user: UserInfo | null, expiry: number};

export class User {
    private readonly user: UserInfo | null;
    private readonly creationTime: number;

    constructor(user: UserInfo | null) {
        this.user = user;
        this.creationTime = Date.now();
    }

    equals(u2: User): boolean {
        if (this.creationTime !== u2.creationTime) {
            return false;
        }

        if (this.user === null && u2.user === null) {
            return true;
        }

        if (this.user === null || u2.user === null) {
            return false;
        }

        return this.user.user_id === u2.user.user_id;
    }

    isLoggedIn(): boolean {
        return this.user !== null;
    }

    getUser(): UserInfo {
        if (this.user === null) {
            throw new RuntimeError();
        }

        return this.user;
    }

    getUserOrNull(): UserInfo | null {
        return this.user;
    }
}

// Cache promise
let getUserPromise: Promise<void> | null = null;
// Cache timeout
let tokenTimeout: NodeJS.Timeout | null = null;

function userResponseTypeCheck(data: unknown): data is UserResponse {
    return isA<UserResponse>(data);
}

export function getUser(currentUser: User, setUser: (_:User) => unknown): Promise<void> {
    if (getUserPromise === null) {
        getUserPromise = Post<UserResponse>("get_user", {}, userResponseTypeCheck)
            .catch((error: Response) => {
                console.error(error);
                getUserPromise = null;
                return {user: null, expiry: -1};
            })
            .then((data) => {
                if (data === undefined) {
                    return;
                }

                if (equal(data.user, currentUser.getUserOrNull())) {
                    return;
                }

                const expiry = (data.expiry * 1000) - Date.now();

                if (expiry <= 0) {
                    setUser(new User(null));
                    return;
                }

                const user = new User(data.user);
                setUser(user);

                if (tokenTimeout !== null) {
                    clearTimeout(tokenTimeout);
                    tokenTimeout = null;
                }
                tokenTimeout = setTimeout(() => getUser(user, setUser), expiry);
            })
            .then(() => {
                getUserPromise = null;
            });
    }

    return getUserPromise
}
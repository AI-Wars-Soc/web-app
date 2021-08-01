import {Post} from "./apiBoundComponent";
import {isA} from "ts-type-checked";

export type UserData = {
    _cuwais_type: "user",
    display_name: string,
    display_real_name: boolean,
    google_id: string,
    is_admin: boolean,
    is_bot: boolean,
    nickname: string,
    real_name: string,
    user_id: number
} | null;

type UserDataResponse = {user: UserData, expiry: number};

export function usersEqual(u1: UserData, u2: UserData): boolean {
    if (u1 === null && u2 === null) {
        return true;
    }

    if (u1 === null || u2 === null) {
        return false;
    }

    return u1.user_id === u2.user_id;
}

// Cache promise
let getUserPromise: Promise<void> | null = null;
// Cache timeout
let tokenTimeout: NodeJS.Timeout | null = null;

function userDataTypeCheck(data: unknown): data is UserDataResponse {
    return isA<UserDataResponse>(data);
}

export function getUser(currentUser: UserData, setUser: (_:UserData) => unknown): Promise<void> {
    if (getUserPromise === null) {
        getUserPromise = Post<{user: UserData, expiry: number}>("get_user", {}, userDataTypeCheck)
            .catch((error: Response) => {
                console.error(error);
                return {user: null, expiry: -1};
            })
            .then((data) => {
                if (data === undefined) {
                    return;
                }

                const user = data.user;
                const expiry = (data.expiry * 1000) - Date.now();
                console.log(expiry);

                setUser(user);

                if (tokenTimeout !== null) {
                    clearTimeout(tokenTimeout);
                    tokenTimeout = null;
                }
                if (expiry >= 0) {
                    tokenTimeout = setTimeout(() => getUser(currentUser, setUser), expiry);
                }

                getUserPromise = null;
            });
    }

    return getUserPromise
}
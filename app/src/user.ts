import {Post} from "./apiBoundComponent";
import {isA} from "ts-type-checked";

export type User = {
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

export type UserResponse = {user: User, expiry: number};

export type UserData = {user: User, request_time: number};

export function usersEqual(u1: UserData, u2: UserData): boolean {
    if (u1.request_time !== u2.request_time) {
        return false;
    }

    if (u1.user === null && u2.user === null) {
        return true;
    }

    if (u1.user === null || u2.user === null) {
        return false;
    }

    return u1.user.user_id === u2.user.user_id;
}

// Cache promise
let getUserPromise: Promise<void> | null = null;
// Cache timeout
let tokenTimeout: NodeJS.Timeout | null = null;

function userResponseTypeCheck(data: unknown): data is UserResponse {
    return isA<UserResponse>(data);
}

export function getUser(currentUser: UserData, setUser: (_:UserData) => unknown): Promise<void> {
    if (getUserPromise === null) {
        getUserPromise = Post<UserResponse>("get_user", {}, userResponseTypeCheck)
            .catch((error: Response) => {
                console.error(error);
                return {user: null, expiry: -1};
            })
            .then((data) => {
                if (data === undefined) {
                    return;
                }

                const expiry = (data.expiry * 1000) - Date.now();

                if (expiry <= 0) {
                    setUser({
                        user: null,
                        request_time: Date.now()
                    });
                    return;
                }

                setUser({
                    user: data.user,
                    request_time: Date.now()
                });

                if (tokenTimeout !== null) {
                    clearTimeout(tokenTimeout);
                    tokenTimeout = null;
                }
                tokenTimeout = setTimeout(() => getUser(currentUser, setUser), expiry);

                getUserPromise = null;
            });
    }

    return getUserPromise
}
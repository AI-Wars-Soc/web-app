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

export const NULL_USER: UserData = null;

export function usersEqual(u1: UserData, u2: UserData): boolean {
    if (u1 === null && u2 === null) {
        return true;
    }

    if (u1 === null || u2 === null) {
        return false;
    }

    return u1.user_id === u2.user_id;
}

export function getUser(currentUser: UserData, setUser: (_:UserData) => unknown): void {
    fetch("/api/get_user", {method: 'POST'})
        .then(res => res.json())
        .then(
            (result) => {
                return result;
            },
            (error) => {
                console.error(error);
                return NULL_USER;
            }
        )
        .then(user => {
            if (!usersEqual(currentUser, user)) {
                setUser(user);
            }
        });
}
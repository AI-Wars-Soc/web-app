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

export function getUser(callback: (_:UserData) => unknown): void {
    fetch("/api/get_user", {method: 'POST'})
        .then(res => res.json())
        .then(
            (result) => {
                callback(result);
            },
            (error) => {
                console.error(error);
                callback(NULL_USER);
            }
        );
}
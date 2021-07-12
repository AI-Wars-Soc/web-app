export type UserData = {
    _cuwais_type: "user"|null,
    display_name: string,
    display_real_name: boolean,
    google_id: string,
    is_admin: boolean,
    is_bot: boolean,
    nickname: string,
    real_name: string,
    user_id: number
};

export const nullUser: UserData = {
    _cuwais_type: null,
    display_name: "",
    display_real_name: false,
    google_id: "",
    is_admin: false,
    is_bot: false,
    nickname: "",
    real_name: "",
    user_id: -1}
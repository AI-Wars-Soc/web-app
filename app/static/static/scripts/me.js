const me = (function () {
    let obj = {};

    obj.changeTheme = function (v) {
        if (v.checked) {
            style.setDark();
        } else {
            style.setLight();
        }
    }

    obj.changeNameVisibility = function (v) {
        const set_visible = v.checked;

        login.authorisedPost('/api/set_name_visible', { visible: set_visible })
            .then(console.log)
            .catch(r => {
                console.log(r);
                v.checked = !set_visible;
            });
    }

    obj.deleteAccount = function () {
        login.authorisedPost('/api/remove_user')
            .then(r => {
                login.logout();
                templates.setWindowLoc("/");
            })
            .catch(r => console.log(r));
    }

    templates.add_function_post_generate(() => {
        $("#darkModeSwitch").prop('checked', style.getTheme() !== "light");
    })

    return obj;
}());

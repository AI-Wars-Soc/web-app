const login = (function () {
    let obj = {};

    obj.authorisedPost = function (url, data = {}) {
        let q = {
            url: url,
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json; charset=utf-8'
        };

        return $.ajax(q);
    }

    obj.logout = function() {
        Cookies.set("log_out", "");
        templates.refresh();
    }

    obj.googleInit = function () {
        gapi.load('auth2', function () {
            // Done
        });
    }

    obj.onLoginFail = function (error) {
        console.log("Could not sign in");
        console.log(error);

        const error_message = $("#login-error-msg");
        error_message.show();
    }

    obj.onGoogleSignIn = function (googleUser) {
        const id_token = googleUser.getAuthResponse().id_token;

        $.ajax({
            url: '/api/exchange_google_token',
            type: 'POST',
            data: JSON.stringify({google_token: id_token}),
            contentType: 'application/json; charset=utf-8'
        })
            .then(response => {
                // As soon as we have redeemed the google token, log out again
                console.log(response);
                const auth2 = gapi.auth2.getAuthInstance();
                return auth2.signOut()
            })
            .then(response => {
                console.log(response);
                const error_message = $("#login-error-msg");
                error_message.hide();
                $('#loginModal').modal('hide');
                templates.refresh();
            })
            .catch(response => obj.onLoginFail(response));
    }

    return obj;
}());

const login = (function () {
    let obj = {};

    let token = null;

    obj.authorisedPost = function (url, data) {
        let q = {
            url: url,
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json; charset=utf-8'
        };

        if (token !== null) {
            q.headers = {Authorization: "Bearer " + token };
        }

        return $.ajax(q);
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
                const error_message = $("#login-error-msg");
                error_message.hide();
                token = response["access_token"];
                console.log(token);
                templates.refresh();
            })
            .catch(response => obj.onLoginFail(response));
    }

    return obj;
}());

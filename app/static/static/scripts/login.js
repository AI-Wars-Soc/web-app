const login = (function () {
    let obj = {};

    // TODO: This leaves us open to XSS attacks and we should use http-only cookies instead
    function getToken() {
        return window.sessionStorage.getItem("token");
    }

    function loggedIn () {
        return (getToken() !== null)
    }
    obj.loggedIn = loggedIn;

    function setToken(new_token) {
        window.sessionStorage.setItem("token", new_token);
    }

    obj.revokeToken = function () {
        window.sessionStorage.removeItem("token");
    }

    obj.authorisedPost = function (url, data = {}) {
        let q = {
            url: url,
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json; charset=utf-8'
        };

        if (loggedIn()) {
            q.headers = {Authorization: "Bearer " + getToken()};
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
                $('#loginModal').modal('hide');
                setToken(response["access_token"]);
                templates.refresh();
            })
            .catch(response => obj.onLoginFail(response));
    }

    return obj;
}());

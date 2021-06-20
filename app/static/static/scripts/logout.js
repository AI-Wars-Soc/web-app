logout = (function () {
    let obj = {};

    obj.onGoogleSignIn = function () {
        const auth2 = gapi.auth2.getAuthInstance();
        auth2.signOut().then(function () {
            obj.allLoggedOut();
        });
    }

    obj.onGoogleLoginFail = function (error) {
        console.log(error);

        obj.allLoggedOut();
    }

    obj.allLoggedOut = function () {
        window.location.replace("/");
    }

    return obj;
}());

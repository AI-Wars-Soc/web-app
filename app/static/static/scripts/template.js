const templates = (function () {
    let template_gen_funcs = [];
    let template_post_funcs = [];

    let obj = {};

    obj.setWindowLoc = function (location) {
        if (location === "/") {
            location = "/about";
        }
        window.location = location;
    };

    obj.add_template = function (template_url, data_url, div_id) {
        template_gen_funcs.push(function () {
            let template;
            return $.get(template_url)
                .then(template_str => {
                    template = Handlebars.compile(template_str);
                    return login.authorisedPost(data_url,{
                        page_name: window.location.pathname.substring(1)
                    });
                })
                .then(data => $(div_id).html(template(data)))
                .catch(failure => {
                    if (failure.status === 401) { // Permission Denied
                        login.lockModalOpen();
                    }
                    if (failure.status === 500) { // Server Error
                        return;
                    }
                    $(div_id).html('');
                    console.error(failure);
                });
        });
    };

    obj.add_function_post_generate = function (f) {
        template_post_funcs.push(f);
    }

    obj.refresh = function () {
        let promises = []
        template_gen_funcs.forEach(f => promises.push(f()));
        Promise.all(promises).then(() => template_post_funcs.forEach(f => f()));
    };

    // Refresh on page load
    $(function () {
        obj.refresh();
    });

    return obj;
}());

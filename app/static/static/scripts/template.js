const templates = (function () {
    let template_gen_funcs = [];
    let template_post_funcs = [];

    let obj = {};

    obj.add_template = function (template_url, data_url, div_id) {
        template_gen_funcs.push(function () {
            let template;
            return $.get(template_url)
                .then(template_str => {
                    template = Handlebars.compile(template_str);
                    return $.ajax({
                        url: data_url,
                        type: 'POST',
                        data: JSON.stringify({page_name: window.location.pathname.substring(1)}),
                        contentType: 'application/json; charset=utf-8'
                    })
                })
                .then(data => $(div_id).html(template(data)))
                .catch(failure => console.error(failure));
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

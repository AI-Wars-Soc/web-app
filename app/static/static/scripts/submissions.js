submissions = (function () {
    let obj = {};

    const madeGraphs = new Set();

    obj.setSubmissionEnabledSwitch = function (checkbox, submission_id) {
        const v = checkbox.checked;

        login.authorisedPost('/api/set_submission_active',
            {
                submission_id: submission_id,
                enabled: v
            })
            .then(() => templates.refresh())
            .catch(res => {
                console.log(res);
                const response = JSON.parse(res)
                $("#submission-error-msg").text(response.message).show();
                uncheck(checkbox, !v);
            });
    }

    function uncheck(checkbox, unchecked) {
        checkbox.checked = unchecked;
    }

    function onSubmit(e) {
        e.preventDefault();
        const url = $("#repo").val();
        const spinner = $("#submit-spinner");
        spinner.show();

        login.authorisedPost('/api/add_submission', {url: url})
            .then(response => {
                if (response.status === "resent") { // Ignore resent requests
                    return;
                }
                $("#submission-error-msg").hide();
                spinner.hide();
                templates.refresh();
            })
            .catch(v => onSubmitFail(v));
    }

    function onBotSubmit(e) {
        e.preventDefault();

        login.authorisedPost('/api/add_bot',
            {
                url: $("#repo").val(),
                name: $("#bot-name").val()
            })
            .then(() => {
                $("#submission-error-msg").hide();
                $("#repo").val("");
                window.location.reload();
            })
            .catch(v => onSubmitFail(v));
    }

    function onSubmitFail(response) {
        console.log(response);
        const error_box = $("#submission-error-msg");
        error_box.text(response.detail);
        $("#repo").effect("shake");
        error_box.show();
        $("#submit-spinner").hide();
    }

    obj.deleteBot = function (bot_id) {
        login.authorisedPost('/api/remove_bot', {bot_id: bot_id})
            .then(response => {
                window.location.reload();
            })
            .catch(response => {
                onSubmitFail(response);
            });
    }

    function registerCollapse(s) {
        const id = s.data("submissionId");
        s.on('show.bs.collapse', function () {
            makeGraph(id);
        });
    }

    function makeGraph(id) {
        if (madeGraphs.has(id)) {
            return;
        }

        const canvas_id = 'submissionSummaryGraph' + id;
        const objs = $("#" + canvas_id);
        if (objs.length === 0) {
            return;
        }
        objs.show();

        login.authorisedPost('/api/get_submission_summary_graph',
            {
                submission_id: id
            })
            .then(response => {
                madeGraphs.add(id);
                const ctx = document.getElementById(canvas_id).getContext('2d');
                const color_win = "#36e5eb";
                const color_loss = "#b536eb";
                const colors = ["#73eb37", color_win, color_loss, "#eb3636", color_win, color_loss, "#718579", color_win, color_loss, color_win, color_loss];
                let center_hidden = true;
                const data = {
                    labels: ['Wins', 'Wins (Healthy)', 'Wins (Crashed)',
                        'Losses', 'Losses (Healthy)', 'Losses (Crashed)',
                        'Draws', 'Draws (Healthy)', 'Draws (Crashed)',
                        'Healthy', 'Crashed'],
                    datasets: [
                        {
                            label: 'Wins & Losses',
                            data: [response.wins, 0, 0, response.losses, 0, 0, response.draws, 0, 0, 0, 0],
                            backgroundColor: colors,
                        },
                        {
                            label: 'Healthy & Not',
                            data: [0, response.wins_healthy, response.wins - response.wins_healthy,
                                0, response.losses_healthy, response.losses - response.losses_healthy,
                                0, response.draws_healthy, response.draws - response.draws_healthy,
                                0, 0],
                            backgroundColor: colors,
                            hidden: center_hidden,
                        }
                    ]
                };
                const config = {
                    type: 'pie',
                    data: data,
                    options: {
                        cutout: "33%",
                        responsive: true,
                        plugins: {
                            legend: {
                                position: 'top',
                                labels: {
                                    filter(legendItem, data) {
                                        if (legendItem.index >= 9) {
                                            return !center_hidden;
                                        }
                                        return (legendItem.index % 3) === 0;
                                    },
                                },
                                onClick(e, legendItem, legend) {
                                    // Stop legend selection and instead toggle crashed
                                    if (this.chart.isDatasetVisible(1)) {
                                        this.chart.options.cutout = "50%";
                                        center_hidden = true;
                                        this.chart.hide(1);
                                    } else {
                                        this.chart.options.cutout = "33%";
                                        center_hidden = false;
                                        this.chart.show(1);
                                    }
                                },
                            },
                            title: {
                                display: true,
                                text: 'Battle Breakdown'
                            }
                        }
                    },
                };
                new Chart(ctx, config);
            })
            .catch(resp => {
                $("#" + canvas_id).hide();
                console.log(resp);
            });
    }

    $(() => $('#submission-form').submit(e => onSubmit(e)));
    $(() => $('#bot-form').submit(e => onBotSubmit(e)));

    templates.add_function_post_generate(() => {
        madeGraphs.clear();
        $(".submission-collapse").each((index, collapse) => registerCollapse($(collapse)));
    });

    return obj;
}());


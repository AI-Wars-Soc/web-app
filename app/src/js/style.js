const STYLE_COOKIE_NAME = 'CUWAIS_THEME';
const STYLE_COOKIE_ARGS = { sameSite: 'strict' };

style = (function () {

    const bootswatchLight = $("#bootswatch-light");
    const bootswatchDark = $("#bootswatch-dark");
    const bootswatchActive = $("#bootswatch-active");
    const styleLight = $("#style-light");
    const styleDark = $("#style-dark");
    const styleActive = $("#style-active");

    let obj = {};

    const copyRef = function(source, target) {
        target.attr({
            integrity: source.attr('integrity'),
            href: source.attr('href')
        });
    }

    obj.setLight = function () {
        copyRef(bootswatchLight, bootswatchActive);
        copyRef(styleLight, styleActive);

        Cookies.set(STYLE_COOKIE_NAME, 'light', STYLE_COOKIE_ARGS);
    }

    obj.setDark = function () {
        copyRef(bootswatchDark, bootswatchActive);
        copyRef(styleDark, styleActive);

        Cookies.set(STYLE_COOKIE_NAME, 'dark', STYLE_COOKIE_ARGS);
    }

    $(() => {
        const theme = obj.getTheme();
        switch (theme) {
            case 'light':
                obj.setLight();
                break;
            case 'dark':
                obj.setDark();
                break;
        }
    });

    obj.getTheme = function () {
        let s = Cookies.get(STYLE_COOKIE_NAME);
        if (s === null) {
            return 'light';
        }
        return s;
    }

    return obj;
} ());

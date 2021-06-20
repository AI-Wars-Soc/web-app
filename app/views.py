import base64
import hashlib
import logging
import os

from cuwais.config import config_file
from flask import Flask, render_template, redirect
from werkzeug.middleware.profiler import ProfilerMiddleware

app = Flask(
    __name__,
    template_folder="templates",
    static_folder='static',
    static_url_path=''
)
app.config["DEBUG"] = config_file.get("debug")

if app.config["DEBUG"]:
    app.config['PROFILE'] = config_file.get("profile")
    app.wsgi_app = ProfilerMiddleware(app.wsgi_app, restrictions=[30])

logging.basicConfig(level=logging.DEBUG if app.config["DEBUG"] else logging.WARNING)


def rich_render_template(page_name, **kwargs):
    return render_template(
        page_name + '.html',
        page_name=page_name,
        config_file=config_file.get_all(),
        **kwargs
    )


def generate_sri(inp_file):
    hashed = hashlib.sha256()

    file = os.path.join(os.path.dirname(os.path.abspath(__file__)), inp_file[1:])
    print(file, flush=True)
    with open(file, 'rb') as f:
        while True:
            vs = f.read(65536)
            if not vs:
                break
            hashed.update(vs)
    hashed = hashed.digest()
    hash_base64 = base64.b64encode(hashed).decode('utf-8')
    return 'sha256-{}'.format(hash_base64)


app.jinja_env.globals['sri'] = generate_sri


def human_format(num):
    num = float('{:.3g}'.format(num))
    magnitude = 0
    while abs(num) >= 1000:
        magnitude += 1
        num /= 1000.0
    return '{}{}'.format('{:f}'.format(num).rstrip('0').rstrip('.'), ['', 'K', 'M', 'B', 'T'][magnitude])


app.jinja_env.globals['human_format'] = human_format


def reason_crash(reason):
    crash_reasons = config_file.get("localisation.crash_reasons")
    default_crash_reason = config_file.get("localisation.default_crash_reason")
    return crash_reasons.get(reason, default_crash_reason)


app.jinja_env.globals['reason_crash'] = reason_crash


@app.route('/')
def index():
    return redirect('/about')


@app.route('/about')
def about():
    return rich_render_template('about')


@app.route('/leaderboard')
def leaderboard():
    return rich_render_template('leaderboard')


@app.route('/submissions')
def submissions():
    return rich_render_template('submissions')


@app.route('/play/<submission_id>')
def play(submission_id):
    game_boards = {"chess": 'games/game_chess'}
    game = config_file.get("gamemode.id")
    if game not in game_boards.keys():
        return game

    return rich_render_template(
        game_boards[game], submission_id=submission_id
    )


@app.route('/me')
def me():
    return rich_render_template('me')


@app.route('/admin')
def admin():
    return rich_render_template('admin')


@app.route('/bots')
def bots():
    return rich_render_template('bots')


@app.route('/logout')
def logout():
    return rich_render_template('logout')


@app.route('/enable-js')
def please_enable_js():
    return rich_render_template('please_enable_js')


@app.errorhandler(404)
def page_404(e):
    return rich_render_template('404'), 404

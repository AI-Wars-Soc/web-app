import React from "react";
import {Link} from "react-router-dom";

export default function AboutPage(): JSX.Element {
    return <>
        <h2>
            About CUWAIS
        </h2>
        <div className="px-3">
            <p>
                The <b>Cambridge University Warring AI Society (CUWAIS)</b> is a new society
                for people who want to test their skills at programming and game-playing.
                Every holiday, we set a game (currently Chess960) and invite competitors
                to submit their original AIs to compete against each other.
            </p>
            <p>
                The server repeatedly takes two AIs from the pool of submitted AIs and has
                them play a game against each other, while maintaining an ELO-like score
                based on win-loss statistics for each AI. Over time, AI scores therefore
                converge on an increasingly accurate picture of how the AIs perform.
                You can view score graphs on the <Link to="/leaderboard">Leaderboard</Link>.
                You can submit as many times as you like, and fine-tune your AI using
                detailed statistics on its performance.
            </p>
            <p>
                Join our <a href="https://discord.gg/mtpmA2MH5u">Discord</a> to get updates as the
                competition progresses!
            </p>
        </div>
        <h2>
            Current Round (Summer 2021)
        </h2>
        <div className="px-3">
            <p>
                The game is <a href="https://en.wikipedia.org/wiki/Fischer_random_chess">Chess960</a>,
                a simple variant of chess where the starting positions of all pieces behind the pawns
                are randomised (with a few constraints).
            </p>
            <p>
                Your AI should return good moves from the positions that it is given,
                without running out of time on the clock.
                The website will track your score.
                When you think you have a better version of your AI, make another submission
                so you can start earning more points.
            </p>
            <p>
                If the AI runs out of time, makes an invalid move, uses up its memory allocation, or crashes,
                it forfeits the game, so we test that your AI can play at least one game
                game before releasing it into the pool of other submissions,
				so don&apos;t worry about testing your AI too thoroughly before submission.
                Start coding to start winning!
            </p>
        </div>
        <h2>
            How to Compete
        </h2>
        <div className="px-3">
            <ul>
                <li>
                    Log in using your <b>Cambridge email</b> (...@cam.ac.uk) through Google.
                    You will automatically get a CUWAIS account and be logged in.
                </li>
                <li>
                    Clone the <a href="https://github.com/AI-Wars-Soc/chess-ai">Github Repository</a> for
                    the signatures of the methods that you need to implement.
                </li>
                <li>
                    Once logged in, make a <Link to="/submissions">Submission</Link>.
                    After submission, your repository will be cloned onto CUWAIS servers
                    and continuously paired up with other users&apos; submissions.
                </li>
                <li>
                    Regularly check the <Link to="/leaderboard">Leaderboard</Link> to see how you stack up against
                    other competitors, or check your <Link to="/submissions">Submission Statistics</Link> to get a more
                    detailed analysis of your AI&apos;s performance.
                </li>
            </ul>
        </div>
        <h2>
            Requirements
        </h2>
        <div className="px-3">
            <ul>
                <li>
                    All submissions must be written in Python and be self-contained. The VM that runs your code is not
                    networked so you cannot rely on external websites, scripts or libraries.
                </li>
                <li>
                    Your program has access to:
                    <ul>
                        <li>
                            Numpy, Scipy, TensorFlow, Keras, Theano, Lasagne
                        </li>
                        <li>
                            1GB of RAM
                        </li>
                        <li>
                            1/2 of a (~3GHz) CPU core
                        </li>
                        <li>
                            a timeout, serving as the time limit, passed as a parameter (starting at 10s)
                        </li>
                        <li>
                            full read access to your files in your repository
                        </li>
                    </ul>
                </li>
                <li>
                    You do <b>NOT</b> have access to a GPU, the internet, multiple cores, an FPGA, etc.
                    Therefore:
                    <ul>
                        <li>
                            Do not try to break out of the sandbox provided.
                        </li>
                        <li>
                            Do not search for extra processors or processing devices.
                        </li>
                        <li>
                            Your AI will be terminated if you go over the given limits.
                        </li>
                    </ul>
                    You will be disqualified from all future events if you are found to have tried to gain access to
                    the results database, the VM host, or the network.
                    There are plenty of safeguards in place to stop you doing this accidentally.
                    If you find such a vulnerability please report it responsibly.
                </li>
            </ul>
        </div>
        <h2>
            Advice
        </h2>
        <div className="px-3">
            <ul>
                <li>
                    Start with minor improvements over the base AI.
                    Ensure that you completely understand the API before doing anything crazy;
                    an AI that crashes will forfeit all of its games and earn no points.
                </li>
                <li>
                    Make sure any searches your AI does run within the time limits.
                </li>
                <li>
                    The amount of processing power given to you is too small to evaluate a large neural net.
                    Don&apos;t just throw compute at the problem - be smart!
                </li>
            </ul>
        </div>
        <h2>
            Good Luck!
        </h2>
    </>;
}
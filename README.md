# scr|brd (Score Board)
Browser-based scoreboard built in TypeScript. Quickly jot, compare, and save match/set records all client-side within your browser. Records can be exported to CSV with the click of a button.

<img src="img/demo.png?raw=true" alt="demo"/>

## Local Setup
1. Install TypeScript - `npm install -g typescript`
2. Install [Python](https://www.python.org/) 3+ to host a local webserver (optional)
3. Open a terminal of your choosing and `cd` to the root project directory
4. Transpile TypeScript code with `tsc` - the `js/` directory will be created
5. Start a local HTTP server from your terminal with `python -m http.server`
6. Open your brower and navigate to `localhost:8000` (8000 is default port, results may vary)
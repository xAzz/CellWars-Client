class Logger {
    static color(color) {
        let style = {
            'background': '#1B2B34',
            'color': color,
            'padding': '4px 10px',
            'font-size': '13px',
            'font-family': 'Roboto Mono, Menlo, Lucida Console, monospace'
        };

        let options = '';

        for (let option in style) {
            options += `${option}: ${style[option]};`;
        }

        return options;
    }

    static info(msg) {
        console.log(`%c▸ info: ${msg}`, this.color('#2196F3'));
    }

    static warn(msg) {
        console.log(`%c▸ warning: ${msg}`, this.color('#FFEB3B'));
    }

    static success(msg) {
        console.log(`%c▸ success: ${msg}`, this.color('#4CAF50'));
    }

    static error(msg) {
        console.log(`%c▸ error: ${msg}`, this.color('#F44336'));
    }
}

window.Logger = Logger;

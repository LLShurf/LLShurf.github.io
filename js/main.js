document.addEventListener('DOMContentLoaded', () => {

    class SpeechRecog {
        constructor ({ infinite, startButton, stopButton, clearButton, renderTo }) {
            this.infinite = infinite;
            this.recog = null;
            this.stopFlag = false;
            this.renderTo = renderTo;

            const startBtn = document.querySelector(startButton);
            startBtn.addEventListener('click', () => {
                this.start();
            });

            const stopBtn = document.querySelector(stopButton);
            stopBtn.addEventListener('click', () => {
                this.stop();
            });

            const clearBtn = document.querySelector(clearButton);
            clearBtn.addEventListener('click', () => {
                this.clearMemory();
            });
        }

        _endTrigger (e) {
            this.start();
        }

        clearMemory () {
            localStorage.removeItem('previous_text');
        }

        init () {
            window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

            this.recog = new SpeechRecognition();
            this.recog.continuous = true;
            this.recog.interimResults = true;
            this.recog.lang = "ru-RU";
        }

        start () {
            if (this.infinite) {
                this.recog.addEventListener('end', e => this._endTrigger);
            }

            this.recog.addEventListener('result', ({ results }) => {
                this.renderText(results[0]);
            });
            this.recog.start();
        }

        stop () {
            this.recog.removeEventListener('end', this._endTrigger);
            this.recog.abort();
        }

        renderText (text) {
            const container = document.querySelector(this.renderTo);
            if (!text.isFinal) {
                container.innerText = localStorage.getItem('previous_text') + ' ' + text[0].transcript;
            } else {
                localStorage.setItem('previous_text', `${localStorage.getItem('previous_text')} ${text[0].transcript}`);
                container.innerText = localStorage.getItem('previous_text') + text[0].transcript;
                this.recog.abort();
                this.init();
                this.start();
            }
            // console.log(text)
        }
    }

    const recognition = new SpeechRecog({
        infinite: true,
        startButton: '.recognition-start',
        stopButton: '.recognition-stop',
        clearButton: '.recognition-clear',
        renderTo: '.text-container'
    });

    recognition.init();

});
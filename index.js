addListeners();
const heartbeatBlock = document.getElementById('heartbeatBlock');
const heartBeating = animaster().heartBeating(heartbeatBlock);
let mah = null;

function addListeners() {
    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            animaster().fadeIn(block, 5000);
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            animaster().addMove(1000, {x: 100, y: 10}).play(block);
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            animaster().scale(block, 1000, 1.25);
        });

    document.getElementById('mahPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('mahBlock');
            mah = animaster().moveAndHide(block, 1000);
        });

    document.getElementById('sahPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('sahBlock');
            animaster().showAndHide(block, 1000, 1.25);
        });

    document.getElementById('heartbeatStop')
        .addEventListener('click', function () {
            heartBeating.stop();
        });

    document.getElementById('mahReset')
        .addEventListener('click', function () {
            mah.stop();
        });


}

function getTransform(translation, ratio) {
    const result = [];
    if (translation) {
        result.push(`translate(${translation.x}px,${translation.y}px)`);
    }
    if (ratio) {
        result.push(`scale(${ratio})`);
    }
    return result.join(' ');
}

function animaster() {
    let resetFadeIn = function (element) {
        element.style.transitionDuration = null;
        element.classList.remove('show');
    }

    let resetFadeOut = function (element) {
        element.style.transitionDuration = null;
        element.classList.remove('hide');
    }

    let resetMoveAndScale = function (element) {
        element.style.transitionDuration = null;
        element.style.transform = null;
    }
    return {
        _steps: [],

        /**
         * Блок плавно появляется из прозрачного.
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         */

        fadeIn(element, duration) {
            element.style.transitionDuration = `${duration}ms`;
            element.classList.remove('hide');
            element.classList.add('show');
        },

        fadeOut(element, duration) {
            element.style.transitionDuration = `${duration}ms`;
            element.classList.remove('show');
            element.classList.add('hide');
        },

        /**
         * Функция, передвигающая элемент
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         * @param translation — объект с полями x и y, обозначающими смещение блока
         */
        move(element, duration, translation) {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(translation, null);
        },

        /**
         * Функция, увеличивающая/уменьшающая элемент
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         * @param ratio — во сколько раз увеличить/уменьшить. Чтобы уменьшить, нужно передать значение меньше 1
         */
        scale(element, duration, ratio) {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(null, ratio);
        },

        heartBeating(element) {
            let active = true;
            let timer1, timer2;

            const step1 = () => {
                if (!active) return;
                this.scale(element, 500, 1.4);
                timer2 = setTimeout(step2, 500);
            };

            const step2 = () => {
                if (!active) return;
                this.scale(element, 500, 1);
                timer1 = setTimeout(step1, 500);
            };

            timer1 = setTimeout(step1, 0);

            return {
                stop() {
                    active = false;
                    clearTimeout(timer1);
                    clearTimeout(timer2);
                }
            };
        },

        moveAndHide(element, duration) {
            const dur1 = duration * 2 / 5;
            const dur2 = duration * 3 / 5;
            this.move(element, dur1, {x: 100, y: 20});
            this.fadeOut(element, dur2);

            return {
                stop() {
                    resetMoveAndScale(element);
                    resetFadeOut(element);
                }
            };
        },

        showAndHide(element, duration) {
            this.fadeIn(element, duration * 1 / 3);
            setTimeout(() => {
                this.fadeOut(element, duration * 1 / 3)
            }, duration * 2 / 3);
        },

        addMove(duration, translation) {
            this._steps.push({
                name: 'move',
                duration,
                translation
            });
            return this;
        },

        play(element) {
            for (const step of this._steps) {
                switch (step.name) {
                    case 'move':
                        this.move(element, step.duration, step.translation);
                        break;

                    default:
                        console.log('Unknown step: ' + step.name);
                        break;
                }
            }
        }
    }
}

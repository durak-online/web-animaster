addListeners();
const heartbeatBlock = document.getElementById('heartbeatBlock');
const heartBeatingObj = animaster().heartBeating(heartbeatBlock);
let mah = null;

function addListeners() {
    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            animaster().addFadeIn(5000).play(block);
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            animaster().addMove(1000, {x: 100, y: 10}).play(block);
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            animaster().addScale(1000, 1.25).play(block);
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
            heartBeatingObj.stop();
        });

    document.getElementById('mahReset')
        .addEventListener('click', function () {
            mah.reset();
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
            this.addScale(500, 1.4).addScale(500, 1);
            return this.play(element, true);
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

        addScale(duration, ratio) {
            this._steps.push({
                name: 'scale',
                duration,
                ratio
            });
            return this;
        },

        addFadeIn(duration) {
            this._steps.push({
                name: 'fadeIn',
                duration
            });
            return this;
        },

        addFadeOut(duration) {
            this._steps.push({
                name: 'fadeOut',
                duration
            });
            return this;
        },

        addDelay(duration) {
            this._steps.push({name: 'delay', duration});
            return this;
        },

        play(element, cycled = false) {
            const steps = this._steps;
            let stopped = false;
            let timerId = null;
            let currentIndex = 0;

            const runStep = () => {
                if (stopped) return;

                if (currentIndex >= steps.length) {
                    if (cycled && steps.length > 0) {
                        currentIndex = 0;          // начать заново
                        runStep();                  // сразу перейти к первому шагу
                    }
                    return;
                }

                const step = steps[currentIndex];
                const {name, duration, translation, ratio} = step;

                switch (name) {
                    case 'move':
                        this.move(element, duration, translation);
                        break;
                    case 'scale':
                        this.scale(element, duration, ratio);
                        break;
                    case 'fadeIn':
                        this.fadeIn(element, duration);
                        break;
                    case 'fadeOut':
                        this.fadeOut(element, duration);
                        break;
                    case 'delay':
                        break;
                    default:
                        console.warn('Unknown step:', name);
                }

                timerId = setTimeout(() => {
                    timerId = null;
                    currentIndex++;
                    runStep();
                }, duration);
            };

            timerId = setTimeout(runStep, 0);

            return {
                stop: () => {
                    stopped = true;
                    if (timerId) {
                        clearTimeout(timerId);
                        timerId = null;
                    }
                },
                reset() {
                    resetMoveAndScale(element);
                    for (const step of steps) {
                        if (step.name === 'fadeIn')
                            resetFadeIn(element);
                        if (step.name === 'fadeOut')
                            resetFadeOut(element);
                    }
                }
            }
        }
    }
}

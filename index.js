addListeners();
// const heartbeatBlock = document.getElementById('heartbeatBlock');
// const heartBeating = animaster().heartBeating(heartbeatBlock);

function addListeners() {
    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            animaster().fadeIn(block, 5000);
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            animaster().move(block, 1000, {x: 100, y: 10});
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            animaster().scale(block, 1000, 1.25);
        });

    document.getElementById('mahPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('mahBlock');
            animaster().moveAndHide(block, 1000, 1.25);
        });

    document.getElementById('sahPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('sahBlock');
            animaster().showAndHide(block, 1000, 1.25);
        });

    // document.getElementById('heartbeatStop')
    //     .addEventListener('click', function () {
    //         heartBeating.stop();
    //     });
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
    return {
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
            let playAnim = true;
            const stopObj = {
                stop() {
                    playAnim = false;
                }
            }

            while (playAnim) {
                this.scale(element, 500, 1.4);
                setTimeout(()=>this.scale(element, 500, 1),500);
            }
            return stopObj;
        },

        moveAndHide(element, duration, translation) {
            const dur1 = duration * 2/5;
            const dur2 = duration * 3/5;
            this.move(element, dur1, {x:100, y: 20});
            this.fadeOut(element, dur2);
        },

        showAndHide(element, duration) {
            this.fadeIn(element, duration*1/3);
            setTimeout(() => {this.fadeOut(element, duration*1/3)},duration*2/3);
        },
    }
}

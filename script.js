document.addEventListener('DOMContentLoaded', function() {
    const nav = document.getElementById('main-nav');
    const galleryImages = document.querySelectorAll('.gallery-img');
    const modal = document.getElementById('gallery-modal');
    const modalImg = document.getElementById('modal-img');
    const modalClose = document.getElementById('modal-close');
    const modalPrev = document.getElementById('modal-prev');
    const modalNext = document.getElementById('modal-next');
    const contactForm = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');
    const contactModal = document.getElementById('contact-modal');
    const contactModalClose = document.getElementById('contact-modal-close');
    const welcomePopup = document.getElementById('welcome-popup');
    const welcomeClose = document.getElementById('welcome-close');
    const designElement1 = document.querySelector('.design-element-1');
    const designElement2 = document.querySelector('.design-element-2');
    let currentImageIndex = 0;
    let lastScrollPosition = 0;
    const headerHeight = document.querySelector('header').offsetHeight;

    window.addEventListener('scroll', function() {
        const currentScrollPosition = window.pageYOffset;

        if (currentScrollPosition > headerHeight) {
            nav.classList.add('fixed');
        } else {
            nav.classList.remove('fixed');
        }

        const scrollFactor = currentScrollPosition / (document.body.scrollHeight - window.innerHeight);
        designElement1.style.transform = `rotate(${scrollFactor * 360}deg)`;
        designElement2.style.transform = `rotate(${-scrollFactor * 360}deg)`;

        lastScrollPosition = currentScrollPosition;
    });

    document.addEventListener('mousemove', function(e) {
        const mouseX = e.clientX / window.innerWidth - 0.5;
        const mouseY = e.clientY / window.innerHeight - 0.5;

        designElement1.style.transform = `translate(${mouseX * 20}px, ${mouseY * 20}px) rotate(${mouseX * 45}deg)`;
        designElement2.style.transform = `translate(${-mouseX * 20}px, ${-mouseY * 20}px) rotate(${-mouseX * 45}deg)`;
    });

    function updateNavButtons() {
        if (currentImageIndex === 0) {
            modalPrev.classList.add('hidden');
        } else {
            modalPrev.classList.remove('hidden');
        }

        if (currentImageIndex === galleryImages.length - 1) {
            modalNext.classList.add('hidden');
        } else {
            modalNext.classList.remove('hidden');
        }
    }

    galleryImages.forEach(img => {
        img.addEventListener('click', function() {
            currentImageIndex = parseInt(this.getAttribute('data-index'));
            modalImg.src = this.src;
            modalImg.alt = this.alt;
            modal.classList.add('active');
            updateNavButtons();
        });
    });

    modalClose.addEventListener('click', function() {
        modal.classList.remove('active');
    });

    modalPrev.addEventListener('click', function() {
        currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
        modalImg.src = galleryImages[currentImageIndex].src;
        modalImg.alt = galleryImages[currentImageIndex].alt;
        updateNavButtons();
    });

    modalNext.addEventListener('click', function() {
        currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
        modalImg.src = galleryImages[currentImageIndex].src;
        modalImg.alt = galleryImages[currentImageIndex].alt;
        updateNavButtons();
    });

    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });

    function isRussianOrEnglish(text) {
        return /^[a-zA-Zа-яА-ЯёЁ\s\-]+$/.test(text);
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function isValidPhone(phone) {
        return /^\+?[0-9\s\-\(\)]{10,}$/.test(phone);
    }

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const message = document.getElementById('message').value.trim();

        let isValid = true;

        if (name === '') {
            document.getElementById('name-error').textContent = 'Пожалуйста, введите ваше имя';
            document.getElementById('name-error').style.display = 'block';
            isValid = false;
        } else if (!isRussianOrEnglish(name)) {
            document.getElementById('name-error').textContent = 'Имя должно содержать только русские или английские буквы';
            document.getElementById('name-error').style.display = 'block';
            isValid = false;
        } else {
            document.getElementById('name-error').style.display = 'none';
        }

        if (email === '') {
            document.getElementById('email-error').textContent = 'Пожалуйста, введите ваш email';
            document.getElementById('email-error').style.display = 'block';
            isValid = false;
        } else if (!isValidEmail(email)) {
            document.getElementById('email-error').textContent = 'Пожалуйста, введите корректный email';
            document.getElementById('email-error').style.display = 'block';
            isValid = false;
        } else {
            document.getElementById('email-error').style.display = 'none';
        }

        if (phone === '') {
            document.getElementById('phone-error').textContent = 'Пожалуйста, введите ваш телефон';
            document.getElementById('phone-error').style.display = 'block';
            isValid = false;
        } else if (!isValidPhone(phone)) {
            document.getElementById('phone-error').textContent = 'Пожалуйста, введите корректный телефон';
            document.getElementById('phone-error').style.display = 'block';
            isValid = false;
        } else {
            document.getElementById('phone-error').style.display = 'none';
        }

        if (message === '') {
            document.getElementById('message-error').textContent = 'Пожалуйста, введите ваше сообщение';
            document.getElementById('message-error').style.display = 'block';
            isValid = false;
        } else if (!isRussianOrEnglish(message)) {
            document.getElementById('message-error').textContent = 'Сообщение должно содержать только русские или английские буквы';
            document.getElementById('message-error').style.display = 'block';
            isValid = false;
        } else {
            document.getElementById('message-error').style.display = 'none';
        }

        if (isValid) {
            submitBtn.textContent = 'Отправляем...';
            submitBtn.disabled = true;

            fetch(contactForm.action, {
                method: 'POST',
                body: new FormData(contactForm),
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    submitBtn.textContent = 'Успешно отправлено!';
                    submitBtn.classList.add('success');

                    contactModal.classList.add('active');

                    setTimeout(() => {
                        contactForm.reset();
                        submitBtn.textContent = 'Отправить';
                        submitBtn.classList.remove('success');
                        submitBtn.disabled = false;
                        contactModal.classList.remove('active');
                    }, 3000);
                } else {
                    throw new Error('Ошибка отправки формы');
                }
            })
            .catch(error => {
                console.error('Ошибка отправки:', error);
                submitBtn.textContent = 'Ошибка отправки';
                setTimeout(() => {
                    submitBtn.textContent = 'Отправить';
                    submitBtn.disabled = false;
                }, 2000);
            });
        }
    });

    contactModalClose.addEventListener('click', function() {
        contactModal.classList.remove('active');
    });

    if (!localStorage.getItem('welcomeClosed')) {
        setTimeout(() => {
            welcomePopup.classList.add('active');
        }, 30000);
    }

    welcomeClose.addEventListener('click', function() {
        welcomePopup.classList.remove('active');
        localStorage.setItem('welcomeClosed', 'true');
    });

    const targetDate = new Date('2028-05-20T00:00:00');

    function updateCountdown() {
        const now = new Date();
        const diff = targetDate - now;

        if (diff <= 0) {
            document.getElementById('countdown-days').textContent = '0';
            document.getElementById('countdown-hours').textContent = '0';
            document.getElementById('countdown-minutes').textContent = '0';
            document.getElementById('countdown-seconds').textContent = '0';
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        document.getElementById('countdown-days').textContent = days;
        document.getElementById('countdown-hours').textContent = hours;
        document.getElementById('countdown-minutes').textContent = minutes;
        document.getElementById('countdown-seconds').textContent = seconds;
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
});
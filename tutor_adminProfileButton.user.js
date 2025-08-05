// ==UserScript==
// @name         Кнопка в расписании на профиль репа в админке
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Добавляет кнопку со ссылкой на профиль преподавателя в админке. Работает как в списке репетиторов, так и в карточке выбранного репетитора в расписании.
// @author       wenzelgood
// @match        https://profile.tutoronline.ru/teacher/scheduleoperator
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    // --- ОБЩАЯ ФУНКЦИЯ ДЛЯ СОЗДАНИЯ КНОПКИ ---
    // Создает кнопку, если ее еще нет в указанном родительском элементе.
    function createAdminButton(tutorId, parentElement, buttonClass = 'admin-link-button') {
        if (!tutorId || !parentElement) return;

        // Уже существует кнопка?
        if (parentElement.querySelector('.' + buttonClass)) {
            return;
        }

        const adminUrl = `https://administration.tutoronline.ru/Teacher/TeacherProfileDetails/${tutorId}`;

        const button = document.createElement('a');
        button.href = adminUrl;
        button.textContent = 'Профиль в админке';
        button.target = '_blank';
        button.rel = 'noopener noreferrer';
        button.className = buttonClass;

        // Стили
        Object.assign(button.style, {
            display: 'block',
            marginTop: '10px',
            padding: '8px 12px',
            backgroundColor: '#28a745',
            color: 'white',
            textAlign: 'center',
            textDecoration: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold'
        });

        parentElement.appendChild(button);
        console.log(`Кнопка создана для tutorid: ${tutorId}`);
    }


    // --- ЛОГИКА #1: Для профилей в общем списке (pslTutorProfile) ---
    function processPslTutorProfile(profileDiv) {
        const tutorId = profileDiv.getAttribute('tutorid');
        const targetContainer = profileDiv.querySelector('.timetable-teacher-card');
        if (tutorId && targetContainer) {
            createAdminButton(tutorId, targetContainer, 'admin-link-button-list');
        }
    }


    // --- ЛОГИКА #2: Для выбранного репетитора в расписании (plhScheduleTutorProfile) ---
    const scheduleContainer = document.getElementById('plhScheduleTutorProfile');
    const scheduleButtonClass = 'admin-link-button-schedule';

    function processScheduleTutorProfile() {
        if (!scheduleContainer) return;

        const tutorProfileElement = scheduleContainer.querySelector('[id^="tspTutorId"]');
        const existingButton = scheduleContainer.querySelector('.' + scheduleButtonClass);

        if (tutorProfileElement) {
            // Реп выбран
            const tutorId = tutorProfileElement.id.replace('tspTutorId', '');
            const buttonContainer = tutorProfileElement.querySelector('.b-schedule-tutor-profile > .centered:last-of-type');
            if (tutorId && buttonContainer) {
                createAdminButton(tutorId, buttonContainer, scheduleButtonClass);
            }
        } else if (existingButton) {
            // Реп не выбран (или выбор снят), а кнопка осталась
            existingButton.remove();
            console.log('Выбор репетитора снят, кнопка в расписании удалена.');
        }
    }


    // --- ОБЩИЙ НАБЛЮДАТЕЛЬ ЗА ИЗМЕНЕНИЯМИ НА СТРАНИЦЕ (MutationObserver) ---
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            // --- Обработка событий для ЛОГИКИ #1 ---
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) { // Убедимся, что это элемент
                        if (node.matches('div.pslTutorProfile')) {
                            processPslTutorProfile(node);
                        }
                        node.querySelectorAll('div.pslTutorProfile').forEach(processPslTutorProfile);
                    }
                });
            }
            if (mutation.type === 'attributes' && mutation.attributeName === 'tutorid' && mutation.target.matches('div.pslTutorProfile')) {
                processPslTutorProfile(mutation.target);
            }

            // --- Обработка событий для ЛОГИКИ #2 ---
            // Если изменения произошли внутри контейнера расписания, просто перезапускаем проверку
            if (scheduleContainer && scheduleContainer.contains(mutation.target)) {
                 processScheduleTutorProfile();
            }
        });
    });

    // Настраиваем и запускаем наблюдателя на весь док
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['tutorid']
    });


    // --- ПЕРВОНАЧАЛЬНЫЙ ЗАПУСК ДЛЯ ЛОГИК ---

    // Запуск для Логики #1
    document.querySelectorAll('div.pslTutorProfile').forEach(processPslTutorProfile);

    // Запуск для Логики #2
    processScheduleTutorProfile();

})();

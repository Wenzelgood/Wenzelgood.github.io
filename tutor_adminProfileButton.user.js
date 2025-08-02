// ==UserScript==
// @name         Кнопка в расписании на профиль репа в админке
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Добавляет/обновляет кнопку со ссылкой на профиль преподавателя в админке. Ссылка всегда актуальна.
// @author       wenzelgood
// @match        https://profile.tutoronline.ru/teacher/scheduleoperator
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    // Универсальная функция: создает новую кнопку или обновляет существующую
    function createOrUpdateButton(profileDiv) {
        // 1. Получаем актуальный tutorid
        const tutorId = profileDiv.getAttribute('tutorid');

        // Если по какой-то причине tutorid отсутствует, ничего не делаем
        if (!tutorId) {
            return;
        }

        const targetContainer = profileDiv.querySelector('.timetable-teacher-card');

        if (!targetContainer) {
            console.error('Не удалось найти .timetable-teacher-card внутри элемента с tutorid:', tutorId);
            return;
        }

        // Формируем актуальный URL
        const adminUrl = `https://administration.tutoronline.ru/Teacher/TeacherProfileDetails/${tutorId}`;

        // 2. Ищем, может быть кнопка уже существует
        let button = targetContainer.querySelector('.admin-link-button');

        if (button) {
            // Если кнопка найдена - просто обновляем ее ссылку
            button.href = adminUrl;
            console.log(`Ссылка обновлена для tutorid: ${tutorId}`);
        } else {
            // Если кнопки нет - создаем ее с нуля
            button = document.createElement('a');

            // Настраиваем атрибуты
            button.href = adminUrl;
            button.textContent = 'Профиль в админке';
            button.target = '_blank';
            button.rel = 'noopener noreferrer';

            // Добавляем класс для идентификации
            button.classList.add('admin-link-button');

            // Добавляем стили
            button.style.display = 'block';
            button.style.marginTop = '10px';
            button.style.padding = '8px 12px';
            button.style.backgroundColor = '#28a745';
            button.style.color = 'white';
            button.style.textAlign = 'center';
            button.style.textDecoration = 'none';
            button.style.borderRadius = '5px';
            button.style.cursor = 'pointer';
            button.style.fontWeight = 'bold';

            // 5. [ИЗМЕНЕНО] Добавляем кнопку в найденный targetContainer
            targetContainer.appendChild(button);
            console.log(`Кнопка создана для tutorid: ${tutorId}`);
        }
    }
    // --- НАБЛЮДАТЕЛЬ ЗА ИЗМЕНЕНИЯМИ НА СТРАНИЦЕ (MutationObserver) ---

    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            // Сценарий 1: На страницу добавлены новые узлы (например, загрузился новый профиль)
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) { // Убедимся, что это элемент
                        // Если сам добавленный узел - наш профиль
                        if (node.matches('div.pslTutorProfile')) {
                            createOrUpdateButton(node);
                        }
                        // Ищем профили внутри добавленного узла
                        const newProfiles = node.querySelectorAll('div.pslTutorProfile');
                        newProfiles.forEach(createOrUpdateButton);
                    }
                });
            }

            // Сценарий 2: Изменился атрибут у существующего элемента
            if (mutation.type === 'attributes' && mutation.attributeName === 'tutorid') {
                // mutation.target - это тот самый элемент, у которого изменился атрибут
                const changedDiv = mutation.target;
                if (changedDiv.matches('div.pslTutorProfile')) {
                     createOrUpdateButton(changedDiv);
                }
            }
        });
    });

    // Настраиваем и запускаем наблюдателя
    observer.observe(document.body, {
        childList: true,      // Следить за добавлением/удалением дочерних элементов
        subtree: true,        // Следить во всем дереве, а не только в body
        attributes: true,     // Следить за изменением атрибутов
        attributeFilter: ['tutorid'] // Следить только за изменениями атрибута 'tutorid' для эффективности
    });

    // --- ПЕРВОНАЧАЛЬНЫЙ ЗАПУСК ---
    // Выполняется один раз при загрузке скрипта, чтобы обработать элементы, которые уже есть на странице.
    const initialProfiles = document.querySelectorAll('div.pslTutorProfile');
    initialProfiles.forEach(createOrUpdateButton);


})();

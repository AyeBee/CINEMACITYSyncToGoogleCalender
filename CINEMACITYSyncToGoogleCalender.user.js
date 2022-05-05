// ==UserScript==
// @name         CINEMACITY予約Googleカレンダー連携
// @namespace    http://ayebee.net/
// @version      1.0
// @description  CINEMACITYのマイページに、予約内容のGoogleカレンダー登録ボタンを追加します。
// @author       ayebee
// @match        https://res.cinemacity.co.jp/TicketReserver/mypage
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cinemacity.co.jp
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    Array.from(document.querySelectorAll('#reserves>.reserve-box')).forEach(e => {
        const title = e.querySelector('dl > dd:nth-child(2)').textContent.trim();
        const [date, time] = e.querySelector('dl > dd:nth-child(4)').textContent.split(' ');
        const date2 = date.replace(/日\(.\)$/, '').split(/年|月/).map(i => i.padStart(2, '0')).join('');
        const [beginTime, endTime] = time.split('-').map(i => `${date2}T${i.replace(':', '').padStart(4, '0')}00`);
        const place = e.querySelector('dl > dd:nth-child(6)').textContent.trim();
        const numberOfSheets = e.querySelector('dl > dd:nth-child(8)').textContent.trim();
        const sheetName = e.querySelector('dl > dd:nth-child(10)').textContent.trim();
        const totalPrice = e.querySelector('dl > dd:nth-child(12)').textContent.trim();
        const number = e.querySelector('dl > dd:nth-child(14)').textContent.trim();

        const text = encodeURIComponent(`${title} 【${sheetName}】`);
        const dates = `${beginTime}/${endTime}`;
        const location = encodeURIComponent(place);
        const details = encodeURIComponent(`
            【作品名】: ${title}
            【上映日時】: ${date} ${time}
            【劇場】: ${place}
            【枚数】: ${numberOfSheets}
            【座席】: ${sheetName}
            【合計金額】: ${totalPrice}
            【チケット番号】: ${number}
        `.trim().split("\n").map(i => i.trim()).join("\n"));
        
        const button = document.createElement('input');
        button.type = 'button';
        button.value = 'Googleカレンダー登録';
        button.onclick = () => {
            window.open(`https://www.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${dates}&location=${location}&details=${details}`, '_blank');
            return false;
        }

        const buttonWrapper = document.createElement('div');
        buttonWrapper.appendChild(button);
        buttonWrapper.style.paddingTop = '2px';
        buttonWrapper.style.paddingRight = '2px';
        buttonWrapper.style.float = 'right';

        e.querySelector('.reserve-num > .clear').before(buttonWrapper);
    });
})();

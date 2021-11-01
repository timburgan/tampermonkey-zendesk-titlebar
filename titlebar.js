// ==UserScript==
// @name        Zendesk Window Title
// @namespace   https://github.com/timburgan/userscripts
// @description Improves the browser window title when using zendesk agent by adding info like ticket id.
// @match       https://*.zendesk.com/agent/*
// @grant       none
// @version     0.1
// @copyright   @timburgan
// @author      @timbugan
// ==/UserScript==
function updateWindowTitle() {
    "use strict";
    if (laps > 5)
        timer = 120000;
    laps++;
    let is_ticket = document.querySelectorAll('.is_viewing_ticket').length;
    if (is_ticket) {
        let ticket_node = document.querySelectorAll('header span.active[data-tracking-id="tabs-section-nav-item-ticket"]');
        let ticket_status = ticket_node[0].childNodes[1].textContent.trim().toUpperCase();
        if (ticket_status == 'ON-HOLD')
          ticket_status = 'H';
        else
          ticket_status = ticket_status.charAt(0);
        let ticket_string = ticket_node[0].cloneNode(true);
        ticket_string.removeChild(ticket_string.firstElementChild);
        ticket_string = ticket_string.textContent.trim().replace('Ticket #', '');
        let heading = document.querySelectorAll('.mast input')[0].cloneNode(true);
        heading = heading.getAttribute('value').trim();
        // get ticket ID
        window.document.title = ticket_status + ' ' + ticket_string + ': ' + heading;
        resetTimer();
    }
    else if ( document.querySelectorAll('nav.app-lovely-views').length == 1 ) {
        window.document.title = 'Lovely Views';
        resetTimer();
    }
    else if ( window.location.href.indexOf("agent/search/1") > -1 ) {
        let heading = document.querySelectorAll('#main_panes .ember-view.search div[data-test-id="search_advanced-search-box_query-box"] input[data-test-id="search_advanced-search-box_input-field_media-input"]')
        let search_query = heading[0].getAttribute('value').trim();
        window.document.title = `Search: ${search_query}`;
        resetTimer();
        if ( window.location.href.indexOf("agent/search/1?type") == -1 ) {
            let base_url = 'https://github.zendesk.com/agent/search/1' // window.location.href
            history.pushState(null, null, `${base_url}?type=ticket&q=${encodeURIComponent(search_query)}`);
            history.replaceState(null, null, `${base_url}?type=ticket&q=${encodeURIComponent(search_query)}`);
        }
    }
    else {
        //let heading = document.querySelectorAll('h1 .filter-title')[0].cloneNode(true);
        //console.log(`heading: ${heading}`);
        //if (heading == 'undefined') {
          let heading = document.querySelectorAll('h1')[0].cloneNode(true);
        //}
        heading = heading.textContent.trim();
        window.document.title = heading;
        resetTimer();
    }
}
function resetTimer() {
    if (window.document.title != current_title) {
        timer = 5000;
        laps = 0;
    }
}
let timer = 5000;
let laps = 0;
let current_title = window.document.title;
window.setInterval(updateWindowTitle, timer);

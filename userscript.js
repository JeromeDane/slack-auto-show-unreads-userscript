// ==UserScript==
// @name         Slack Auto Show New Unreads
// @namespace    http://jeromedane.com
// @version      0.1
// @description  Automatically shows new unread messages in "All unread"
// @author       Jerome Dane - https://github.com/JeromeDane
// @match        https://app.slack.com/client/*
// @grant        none
// ==/UserScript==

// Source https://github.com/JeromeDane/slack-auto-show-unreads-userscript/blob/master/userscript.js

(function() {
  var lastActivity = Date.now(),
      interval = 5000, // check for new unread messages every interval milliseconds
      activityTimeout = 30000 // don't load new unreads messages if there has been activity in the last activityTimeout milliseconds and there are already unreads shown
  document.body.onmousemove = function() { lastActivity = Date.now() }
  function getRefreshButton() {
    const buttons = Array.prototype.slice.call(document.querySelectorAll('.p-ia__view_header__button')).filter(elemIfNotHidden)
    return buttons && buttons[0]
  }
  function getShowMoreLinks() {
    return document.querySelectorAll('.p-unreads_view__show_newer') || []
  }
  function getNewMessagesButton() {
    var button = elemIfNotHidden(document.querySelector('.p-unreads_view__empty button.c-button--primary'))
    return button && !button.className.match(/undo/i) && button
  }
  function hideEmptyMessage() {
    const unreadsEmptyImage = document.querySelector('.p-unreads_view__empty .p-unreads_view__empty__image')
    if(unreadsEmptyImage) unreadsEmptyImage.style.display = 'none'
    const unreadsEmptyText = document.querySelector('.p-unreads_view__empty div[aria-label="No more unread messages. All clear."]')
    if(unreadsEmptyText) unreadsEmptyText.style.display = 'none'
  }
  function checkForUnreads() {
    if(document.location.toString().match(/unreads/)) {
        hideEmptyMessage()
        var newMessagesButton = getNewMessagesButton()
        if(newMessagesButton) simulateClick(newMessagesButton)
        if(Date.now() - lastActivity > activityTimeout) {
            var refreshButton = getRefreshButton()
            if(refreshButton) simulateClick(refreshButton)
            // else if(document.location.toString().match(/unreads/)) document.location.reload()
            getShowMoreLinks().forEach(simulateClick)
        }
        // remove marked as read
        Array.prototype.slice.call(document.querySelectorAll('.p-unreads_view__header--was_marked')).forEach(n => n.remove())
    }
    setTimeout(checkForUnreads, interval)
  }
  function simulateClick(element) { // https://github.com/JeromeDane/simulate-click-js
      var clickEvent = document.createEvent("MouseEvents")
      clickEvent.initEvent("mousedown", true, true)
      element.dispatchEvent(clickEvent)
      clickEvent = document.createEvent("MouseEvents")
      clickEvent.initEvent("click", true, true)
      element.dispatchEvent(clickEvent)
      clickEvent = document.createEvent("MouseEvents")
      clickEvent.initEvent("mouseup", true, true)
      element.dispatchEvent(clickEvent)
  }
  function elemIfNotHidden(el) { return el && el.offsetParent != null && el }
  setTimeout(checkForUnreads, 1000)
})()

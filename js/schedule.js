function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
/* global CONFIG */

// https://developers.google.com/calendar/api/v3/reference/events/list
(function () {
  // Initialization
  var calendar = {
    orderBy: 'startTime',
    showLocation: false,
    offsetMax: 72,
    offsetMin: 4,
    showDeleted: false,
    singleEvents: true,
    maxResults: 250
  };

  // Read config form theme config file
  Object.assign(calendar, CONFIG.calendar);
  var now = new Date();
  var timeMax = new Date();
  var timeMin = new Date();
  timeMax.setHours(now.getHours() + calendar.offsetMax);
  timeMin.setHours(now.getHours() - calendar.offsetMin);

  // Build URL
  var params = {
    key: calendar.api_key,
    orderBy: calendar.orderBy,
    timeMax: timeMax.toISOString(),
    timeMin: timeMin.toISOString(),
    showDeleted: calendar.showDeleted,
    singleEvents: calendar.singleEvents,
    maxResults: calendar.maxResults
  };
  var request_url = new URL("https://www.googleapis.com/calendar/v3/calendars/".concat(calendar.calendar_id, "/events"));
  Object.entries(params).forEach(function (param) {
    var _request_url$searchPa;
    return (_request_url$searchPa = request_url.searchParams).append.apply(_request_url$searchPa, _toConsumableArray(param));
  });
  function getRelativeTime(current, previous) {
    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;
    var elapsed = current - previous;
    var tense = elapsed > 0 ? ' ago' : ' later';
    elapsed = Math.abs(elapsed);
    if (elapsed < msPerHour) {
      return Math.round(elapsed / msPerMinute) + ' minutes' + tense;
    } else if (elapsed < msPerDay) {
      return Math.round(elapsed / msPerHour) + ' hours' + tense;
    } else if (elapsed < msPerMonth) {
      return 'about ' + Math.round(elapsed / msPerDay) + ' days' + tense;
    } else if (elapsed < msPerYear) {
      return 'about ' + Math.round(elapsed / msPerMonth) + ' months' + tense;
    }
    return 'about ' + Math.round(elapsed / msPerYear) + ' years' + tense;
  }
  function buildEventDOM(tense, event, start, end) {
    var durationFormat = {
      weekday: 'short',
      hour: '2-digit',
      minute: '2-digit'
    };
    var relativeTime = tense === 'now' ? 'NOW' : getRelativeTime(now, start);
    var duration = start.toLocaleTimeString([], durationFormat) + ' - ' + end.toLocaleTimeString([], durationFormat);
    var location = '';
    if (calendar.showLocation && event.location) {
      location = "<span class=\"event-location event-details\">".concat(event.location, "</span>");
    }
    var description = '';
    if (event.description) {
      description = "<span class=\"event-description event-details\">".concat(event.description, "</span>");
    }
    var eventContent = "<section class=\"event event-".concat(tense, "\">\n        <h2 class=\"event-summary\">\n          ").concat(event.summary, "\n          <span class=\"event-relative-time\">").concat(relativeTime, "</span>\n        </h2>\n        ").concat(location, "\n        <span class=\"event-duration event-details\">").concat(duration, "</span>\n        ").concat(description, "\n      </section>");
    return eventContent;
  }
  function fetchData() {
    var eventList = document.querySelector('.event-list');
    if (!eventList) return;
    fetch(request_url.href).then(function (response) {
      return response.json();
    }).then(function (data) {
      if (data.items.length === 0) {
        eventList.innerHTML = '<hr>';
        return;
      }
      // Clean the event list
      eventList.innerHTML = '';
      var prevEnd = 0; // used to decide where to insert an <hr>
      var utc = new Date().getTimezoneOffset() * 60000;
      data.items.forEach(function (event) {
        // Parse data
        var start = new Date(event.start.dateTime || new Date(event.start.date).getTime() + utc);
        var end = new Date(event.end.dateTime || new Date(event.end.date).getTime() + utc);
        var tense = 'now';
        if (end < now) {
          tense = 'past';
        } else if (start > now) {
          tense = 'future';
        }
        if (tense === 'future' && prevEnd < now) {
          eventList.insertAdjacentHTML('beforeend', '<hr>');
        }
        eventList.insertAdjacentHTML('beforeend', buildEventDOM(tense, event, start, end));
        prevEnd = end;
      });
    });
  }
  fetchData();
  var fetchDataTimer = setInterval(fetchData, 60000);
  document.addEventListener('pjax:send', function () {
    clearInterval(fetchDataTimer);
  });
})();
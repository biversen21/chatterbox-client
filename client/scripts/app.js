// YOUR CODE HERE:
var app = {
  server: 'https://api.parse.com/1/classes/chatterbox',
  init: function() {},
  send: function(message) {
    console.log(message);
    $.ajax({
      url: this.server,
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent');
      },
      error: function (data) {
        // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message');
      }
    });
  },
  fetch: function() {
    $.ajax({
      url: this.server,
      type: 'GET',
      //data: JSON.parse(message),
      contentType: 'application/json',
      success: function (data) {
        // parse the data
        for (var i = 0; i < data.results.length; i++){
          for (var key in data.results[i]) {
            data.results[i][key] = app.scrubber(data.results[i][key]);
          }
        }
        console.log(data.results);
        // data.scrubber(dataObject);
        // pass data to scrubber fn to get clean data
        // check clean data against expected, deal with unexpected
        // append data to DOM ul
      },
      error: function (data) {
        // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to receive message');
      }
    });
  },
  scrubber: function(data) {
    return data.replace(/[&<>`"'!@$%()=+{}]/g, "");
  }
};

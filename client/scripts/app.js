// YOUR CODE HERE:
var buttons;

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
        // console.log(data);
        app.clearMessages();
        $('#roomSelect').empty();
        var rooms = [];
        for (var i = 0; i < data.results.length; i++){
          for (var key in data.results[i]) {
            data.results[i][key] = app.scrubber(data.results[i][key]);
          }
          app.addMessage(data.results[i]);
          if (rooms.indexOf(data.results[i].roomname) === -1){
            rooms.push(data.results[i].roomname);
            app.addRoom(data.results[i].roomname);
          }
        }
        buttons = $('button')
        buttons.click(function(){
          console.log(this);
        });
      },
      error: function (data) {
        // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to receive message');
      }
    });
  },
  scrubber: function(data) {
    return data.replace(/[&<>`"'!@$%()=+{}]/g, "");
  },
  clearMessages: function() {
    $('#chats').empty();
  },
  addMessage: function(message) {
    $('#chats').append('<li>' + message.roomname + ' | ' + message.username + ' : ' + message.text + '</li>')
  },
  addRoom: function(roomname) {
    $('#roomSelect').append('<button class = "room" id = "' + roomname + '">' + roomname + '</button>');
  },
  currentRoom: ''
};
$(document).ready(function() {
  window.setInterval(function() {
    app.fetch();
  }, 1000);
});



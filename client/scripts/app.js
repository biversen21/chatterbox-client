// YOUR CODE HERE:
var buttons;

var app = {
  server: 'https://api.parse.com/1/classes/chatterbox',
  init: function() {},
  send: function(message) {
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
      data: {'order' : '-createdAt'},
      contentType: 'application/json',
      success: function (data) {
        app.clearMessages();
        $('#roomSelect').empty();
        var rooms = [];

        for (var i = 0; i < data.results.length; i++){
          var currentData = data.results[i];
          for (var key in currentData) {
            currentData[key] = app.scrubber(currentData[key]);
          }
          app.addMessage(currentData);
          if (rooms.indexOf(currentData.roomname) === -1){
            rooms.push(currentData.roomname);
            app.addRoom(currentData.roomname);
          }
        }

        $('.room').click(function(){
          app.currentRoom = this.id;
        });

        $('#allrooms').click(function(){
          app.currentRoom = undefined;
        })

        $('li').click(function(){
          var text = $(this).html();
          var friendName = text.substring(text.indexOf('|') + 2, text.indexOf(':') - 1);
          app.friendList.push(friendName);
        })
      },
      error: function (data) {
        // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to receive message');
      }
    });
  },
  scrubber: function(data) {
    if (data.indexOf('<') !== -1 || data.indexOf('script') !== -1 || data.indexOf('JAMES') !== -1){
      return;
    }
    return data.replace(/[&<>`"'!@$%()=+{}]/g, "");
  },
  clearMessages: function() {
    $('#chats').empty();
  },
  addMessage: function(message) {
    if (message.roomname === app.currentRoom || app.currentRoom === undefined){
      if (app.friendList.indexOf(message.username) !== -1){
        $('#chats').append('<li><b>' + message.roomname + ' | ' + message.username + ' : ' + message.text + '</b></li>');
      } else {
        $('#chats').append('<li>' + message.roomname + ' | ' + message.username + ' : ' + message.text + '</li>');
      }
    }
  },
  addRoom: function(roomname) {
    $('#roomSelect').append('<button class = "room" id = "' + roomname + '">' + roomname + '</button>');
  },
  currentRoom: undefined,
  friendList: []
};

$(document).ready(function() {
  window.setInterval(function() {
    app.fetch();
  }, 1000);

  $('#sendButton').click(function(){
    var $url = $(location).attr('href');
    var $userName = $url.substring($url.indexOf('username') + 9, $url.length);
    var sendMessage = {
      username: $userName,
      text: $('#newMessage').val(),
      roomname: app.currentRoom || 'lobby'
    };
    app.send(sendMessage);
  });

  $('#createRoom').click(function(){
    app.currentRoom = $('#newRoom').val();
    $('#defaults').append('<button class = "room" id = "' + app.currentRoom + '">' + app.currentRoom + '</button>');
  });

});



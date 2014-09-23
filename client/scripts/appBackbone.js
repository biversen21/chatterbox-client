$(function(){
  var Message = Backbone.Model.extend({
    initialize: function(newMessage) {
      this.set('username', newMessage.username);
      this.set('text', newMessage.text);
      this.set('roomname', newMessage.roomname);
    }
  });

  var MessageCollection = Backbone.Collection.extend({
    model: Message,
    url: 'https://api.parse.com/1/classes/chatterbox',
    initialize: function(){}
  });

  var MessageView = Backbone.View.extend({
    el: '.container',
    initialize: function(){
      this.render();
    },
    render: function(){
      var messageCollection = new MessageCollection();
      var that = this;
      messageCollection.fetch({
        success: function(messageCollection) {
          messageCollection = messageCollection.models[0].get('results');
          _.each(messageCollection, function(message) {
            for (var key in message) {
              message[key] = that.scrubber(message[key]);
            }
            var html = "<div class='message-block'>" + "<span class='username'>"
                + message.username + " | </span>" + "<span class='message'>"
                + message.text + "</span>" + "</div>";
            $(that.el).append(html);
          })
        }
      })
    },
    scrubber: function(data) {
      // if (data.indexOf('<') !== -1 || data.indexOf('script') !== -1 || data.indexOf('JAMES') !== -1){
      //   return;
      // }
      return data.replace(/[&<>`"'!@$%()=+{}]/g, "");
    }
  });

  var messageView = new MessageView();

});

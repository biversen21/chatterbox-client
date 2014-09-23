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
    // create interval method to check for update: true, if yes trigger render
  });

  var MessageView = Backbone.View.extend({
    el: '.container',
    initialize: function(){
      this.render();
    },
    render: function(){
        var messageCollection = new MessageCollection(); // externally instantiate
        messageCollection.on('add', function(message){
          console.log(message);
        });
        var that = this; // can probably remove
        messageCollection.fetch({  // moves into messagecollection
          data: {order: '-createdAt'}, // moves into messagecollection
          success: function(messageCollection) { // moves into messagecollection and calls render on success

            messageCollection = messageCollection.models[0].get('results');

            _.each(messageCollection, function(message) {
              for (var key in message) {
                message[key] = that.scrubber(message[key]);
              }
              var html = "<div class='message-block'>" + "<span class='username'>"
                  + message.username + " | </span>" + "<span class='message'>"
                  + message.text + "</span>" + "</div>";
              $(that.el).append(html);
            });

          }//end of success
        })//end of fetch
        // setInterval(function(){  figure out what to do with this
        //   messageCollection.fetch({
        //     update:true;
        //   };
        // }), 1000)
    },
    scrubber: function(data) {
      if (data !== null) {
        if (data.indexOf('<') !== -1 || data.indexOf('script') !== -1 || data.indexOf('JAMES') !== -1){
          return;
        }
        return data.replace(/[&<>`"'!@$%()=+{}]/g, "");
      }
    }
  });

  var messageView = new MessageView();

});

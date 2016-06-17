import Ember from 'ember';
import layout from 'bepstore-chat/templates/components/chat-window';

const { Component, computed, observer, inject: { service } } = Ember;

export default Component.extend({
  layout,
  classNames: 'chat-window',
  classNameBindings: ['isHidden:hidden'],
  session: service(),
  account: service(),
  ajax: service(),

  openChat: false,
  windowSize: 'chat-closed',

  isHidden: computed('session.user', function(){
    if(this.get('session.user.id')){
      return false;
    }
    return true;
  }),

  resetHidden: observer('session.user', function(){
      if(this.get('session.user.id')){
        this.set('isHidden', false);
      }
      else {
        this.set('isHidden', true);
      }
    }),

  actions: {
    toggle: function() {
      this.toggleProperty('openChat');
      if(this.get('openChat')){
        this.set('windowSize', 'chat-open');
      } else {
        this.set('windowSize', 'chat-closed');
      }
    },
    sendMessage: function(message) {
<<<<<<< 5caac1de97b6c21173f3f557ca7aa4ed3d4301c0
      if(this.get('messages.lastObject.userid') === this.get('session.user.id')){
        let messages = this.get('messages.lastObject.body');
        messages.addObject({id:messages.length, content: message});
      }
      else {
        this.get('messages').addObject({userid:this.get('session.user.id'), body: [{id:1,content:message}]});
      }
    },
    toRooms: function(){

    },
    toLast: function(){

=======
      let accessToken = this.get('session.data.authenticated.access_token');
      let host = this.get('account.host');
      let roomId = "57154bb3187bb6f0eae0136d";
      let url = `${host}/provide/gitter/rooms/${roomId}/chatMessages`;

      return this.get('ajax').request(url, {
        type: 'POST',
        data: JSON.stringify({ text: message }),
        dataType: 'json',
        xhrFields: {
          withCredentials: true
        },
        crossDomain: true,
        headers: {
         'Content-Type': 'application/json',
         'Authorization': `Bearer ${accessToken}`
       }
      }).then((response) => {
        return this.get('store').createRecord('chat-message', response);
      });
>>>>>>> Add chat via gitter
    }


  }
});

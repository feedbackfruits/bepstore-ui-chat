import Ember from 'ember';
import layout from 'bepstore-chat/templates/components/chat-window';

const { Component, computed, observer, inject: { service } } = Ember;

export default Component.extend({
  layout,
  classNames: 'chat-window',
  classNameBindings: ['isHidden:hidden'],
  session: service(),

  openChat: false,
  windowSize: 'chat-closed',
  contentChat: false,
  messages: [],

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

    }


  }
});

import Ember from 'ember';
import layout from 'bepstore-chat/templates/components/chat-window';

const { Component, computed, inject: { service } } = Ember;

export default Component.extend({
  layout,
  classNames: 'chat-window',
  classNameBindings: ['isHidden:hidden'],
  session: service(),
  store: service(),
  account: service(),
  ajax: service(),

  openChat: false,
  room: null,
  windowSize: 'chat-closed',


  isHidden: computed('session.user', function(){
    return !(this.get('session.user.id'));
  }),

  hasGitter: computed('isHidden', 'account.me.identities.[]', function(){
    return !this.get('isHidden') && this.get('account').isAuthorized('gitter');
  }),

  rooms: computed('isHidden', 'hasGitter', function(){
    if(this.get('hasGitter')){
      return this.get('store').peekAll('chat-room');
    }
    return [];
  }),

  repoRooms: computed('rooms.[]', function() {
    let rooms = this.get('rooms');
    return rooms.filterBy('githubType', 'REPO');
  }),

  messages: computed('isHidden', 'hasGitter', function(){
    if(this.get('hasGitter') && this.get('room.id')){
      return this.get('store').peekAll('chat-message');
    }
    return [];
  }),

  messagesByRoom: computed('messages.[]', 'room', function() {
    let messages = this.get('messages');
    let roomId = this.get('room.id');
    return messages.filterBy('room.id', roomId).sortBy('sent');
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
      let accessToken = this.get('session.data.authenticated.access_token');
      let host = this.get('account.host');
      let room = this.get('room');
      let url = `${host}/provide/gitter/rooms/${room.id}/chatMessages`;

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
        let store = this.get('store');
        let record = store.peekRecord('chat-message', response.id);

        if (record) {
          return;
        }

        record = store.createRecord('chat-message', response);
        record.set('room', room);
      });
    },
    toRooms: function(){
      this.set('last', this.get('room'));
      this.set('room', null);
    },
    toRoom: function(roomName){
      this.set('room', this.get('store').peekAll('chat-room').findBy('name', roomName));
    },
    toLast: function(){
      if(this.get('last')){
        this.set('room', this.get('last'));
      }
    }
  }
});

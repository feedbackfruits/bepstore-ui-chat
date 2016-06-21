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
  contentChat: true,
  windowSize: 'chat-closed',

  messages: computed('isHidden', 'hasGitter', function(){
    if(this.get('hasGitter')){
      return this.get('store').peekAll('chat-message');
    }
    return null;
  }),

  isHidden: computed('session.user', function(){
    return !(this.get('session.user.id'));
  }),

  hasGitter: computed('isHidden', 'account.me.identities.[]', function(){
    return !this.get('isHidden') && this.get('account').isAuthorized('gitter');
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
    },
    toRooms: function(){
      // set this to choose gitter of all repos
      this.toggleProperty('contentChat');
    },
    toLast: function(){
      // set this to last used repo
      this.toggleProperty('contentChat');
    }
  }
});

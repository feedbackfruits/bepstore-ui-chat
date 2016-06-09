import Ember from 'ember';
import layout from 'bepstore-chat/templates/components/chat-textfield';

export default Ember.Component.extend({
  layout,
  classNames: "chat-text-field",
  chat: { message: "" },

  actions: {
    send: function(){
      this.get('sendMessage')(this.get('chat.message'));
      this.set('chat.message',"");
    }
  }
});

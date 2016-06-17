import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';

export default Model.extend({
  text: attr('string'),
  html: attr('string'),
  sent: attr('string'),

  unread: attr('string'),

  room: belongsTo('chatRoom'),

  fromUser: attr({ defaultValue: null })
});

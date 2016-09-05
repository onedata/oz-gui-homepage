import Ember from 'ember';

export default Ember.Component.extend({
  didInsertElement() {
    window.ATL_JQ_PAGE_PROPS = {
      "triggerFunction": function (showCollectorDialog) {
        $("#jira-bug-report").click(function (e) {
          e.preventDefault();
          showCollectorDialog();
        });
      }
    };
  }
});

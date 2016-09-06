import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'a',

  attributeBindings: ['href'],

  /* jshint scripturl:true */
  href: "javascript:void(0);",

  didInsertElement() {
    const $self = this.$();

    this.$().parent().prepend('<script type="text/javascript" ' +
      'src="https://jira.plgrid.pl/jira/s/1a52d611a131f89f42a610f8a8d44881-T/en_USw8oy4d/6343/3/1.4.16/_/download/batch/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector.js?locale=en-US&collectorId=9d8100e8">' +
      '</script>'
    );

    window.ATL_JQ_PAGE_PROPS = {
      "triggerFunction": function (showCollectorDialog) {
        $self.click(function (e) {
          e.preventDefault();
          showCollectorDialog();
        });
      }
    };
  }
});

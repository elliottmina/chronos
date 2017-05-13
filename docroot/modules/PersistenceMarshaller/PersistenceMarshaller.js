var PersistenceMarshaller = function() {

	var timeUtil;
	var record;
	
	var init = function() {
		gatherDependencies();
		addBehavior();
	};

	var gatherDependencies = function() {
		timeUtil = new TimeUtil();
	};

	var addBehavior = function() {
		App.dispatcher.register('SPAN_SUBMITTED', onSpanSubmitted);
		App.dispatcher.register('DATE_SUBMITTED', loadDate);
		App.dispatcher.register('DELETE_SPAN_SUBMITTED', onDeleteSpanSubmitted);
	};

	var onSpanSubmitted = function(span) {
		record.spans[span.guid] = span;
		App.persister.put(record);
		App.dispatcher.update('SPAN_SAVED', {
			span:span,
			record:record}
		);
	};

	var onDeleteSpanSubmitted = function(guid) {
		var span = record.spans[guid];
		delete(record.spans[guid]);
		App.persister.put(record);
		App.dispatcher.update('SPAN_DELETED', {
			span:span,
			record:record}
		);
	};

	var loadDate = function(dateStr) {
		record = App.persister.fetch(dateStr);
		App.dispatcher.update('DATE_CHANGED', record);
	};

	init();

	return {
		ready:function() {
			loadDate(timeUtil.getYmd(new Date()));
		}
	};
	
};

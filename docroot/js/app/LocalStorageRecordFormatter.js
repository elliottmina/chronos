var LocalStorageRecordFormatter = function() {

	var datify = function(span, key) {
		if (isNaN(Date.parse(span[key])))
			throw false;

		span[key] = new Date(span[key]);
	};

	return {
		format:function(result) {
			if (!result)
				throw false;

			var data = JSON.parse(result);
			
			if (typeof data.date !== 'string')
				throw false;
			
			if (typeof data.spans !== 'object')
				throw false;
		
			jQuery.each(data.spans, function(key, span) {
				if (typeof span.project !== 'string')
					throw false;

				if (typeof span.guid === undefined)
					throw false;

				datify(span, 'start');
				datify(span, 'finish');
			});

			return data;
		},
		unformat:function(record) {
			jQuery.each(record.spans, function(index, span) {
				span.start = new Date(span.start).toISOString();
				span.finish = new Date(span.finish).toISOString();
			});			
		}
	};

};

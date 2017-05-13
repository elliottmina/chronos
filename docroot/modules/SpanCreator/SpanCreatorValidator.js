var SpanCreatorValidator = function() {

	return {
		validate:function(payload) {
			if (!payload.start || !payload.finish)
				return false;
			
			if (payload.finish - payload.start < 0)
				return false;

			if (payload.project == '')
				return false;

			if (!Array.isArray(payload.tasks))
				return false;
			
			return true;
		}
	};
};

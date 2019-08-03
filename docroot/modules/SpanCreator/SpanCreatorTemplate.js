var SpanCreatorTemplate = `
	<section>
		<div class="project_suggestions pos_wrapper">
			<label for="SpanCreatorProject">Project</label>
			<input type="text" id="SpanCreatorProject" name="project" tabindex="1" required />
			<ul></ul>
		</div>
		<div class="time_field_wrapper">
			<label>Start time</label>
			<span class="start">
				<span class="time_field_container">
					<span class="time" tabindex="1"></span>
					<span class="period">AM</span>
					<button class="now far fa-clock" tabindex="-1"></button>
					<span class="cursor"></span>
				</span>
			</span>
		</div>
		<div class="task_list">
			<label for="SpanCreatorTask">Tasks</label>
			<input type="text" id="SpanCreatorTask" tabindex="1" />
			<ul></ul>
		</div>
		<div class="time_field_wrapper">
			<label>Finish time</label>
			<span class="finish">
				<span class="time_field_container">
					<span class="time" tabindex="1"></span>
					<span class="period">AM</span>
					<button class="now far fa-clock" tabindex="-1"></button>
					<span class="cursor"></span>
				</span>
			</span>
		</div>
		<div class="button_container">
			<div class="button save" tabindex="1">
				<i class="fas fa-save"></i>
				<span class="text">Create</span>
			</div>
			<div class="button duplicate" tabindex="1">
				<i class="far fa-repeat"></i>
				Create + repeat
			</div>
		</div>
	</section>
`;

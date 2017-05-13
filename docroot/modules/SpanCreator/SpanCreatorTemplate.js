var SpanCreatorTemplate = `
	<div class="project_suggestions pos_wrapper">
		<label for="SpanCreatorProject">Project</label>
		<input type="text" id="SpanCreatorProject" name="project" tabindex="1" required />
		<ul></ul>
	</div>
	<div class="time_fields">
		<div class="time_field_wrapper">
			<label>Start time</label>
			<span class="start">
				<span class="time_field_container">
					<span class="time" tabindex="1"></span>
					<span class="period">AM</span>
					<button class="now fa fa-clock-o" tabindex="-1"></button>
					<span class="cursor"></span>
				</span>
			</span>
		</div>
		<div class="time_field_wrapper">
			<label>Finish time</label>
			<span class="finish">
				<span class="time_field_container">
					<span class="time" tabindex="1"></span>
					<span class="period">AM</span>
					<button class="now fa fa-clock-o" tabindex="-1"></button>
					<span class="cursor"></span>
				</span>
			</span>
		</div>
	</div>
	<div class="task_list">
		<label for="SpanCreatorTask">Tasks</label>
		<input type="text" id="SpanCreatorTask" tabindex="1" />
		<ul></ul>
	</div>
	<div class="button_container">
		<div class="button save" tabindex="1">
			<i class="fa fa-floppy-o"></i>
			Save
		</div>
		<div class="button duplicate" tabindex="1">
			<i class="fa fa-clone"></i>
			Save + Clone
		</div>
		<div class="hotkeys">
			<span class="hotkey">
				<span class="icon">⌘</span>+<span class="icon">P</span>
				<span class="text">Project</span>
			</span>
			<span class="hotkey">
				<span class="icon"><i class="fa fa-arrow-up"></i></span>
				<span class="text">Min</span>
			</span>
			<span class="hotkey">
				<span class="icon"><i class="fa fa-arrow-down"></i></span>
				<span class="text">Min</span>
			</span>
			<span class="hotkey">
				<span class="icon">N</span>
				<span class="text">ow</span>
			</span>
			<span class="hotkey">
				<span class="icon">A</span>
				<span class="text">M</span>
			</span>
			<span class="hotkey">
				<span class="icon">P</span>
				<span class="text">M</span>
			</span>
			<span class="hotkey">
				<span class="icon">⌘</span>+<span class="icon">S</span>
				<span class="text">Save</span>
			</span>
		</div>
	</div>
`;

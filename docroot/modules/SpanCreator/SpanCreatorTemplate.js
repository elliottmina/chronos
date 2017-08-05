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
					<button class="now fa fa-clock-o" tabindex="-1"></button>
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
					<button class="now fa fa-clock-o" tabindex="-1"></button>
					<span class="cursor"></span>
				</span>
			</span>
		</div>
		<div class="button_container">
			<div class="button save" tabindex="1">
				<i class="fa fa-floppy-o"></i>
				<span class="text">Create</span>
			</div>
			<div class="button duplicate" tabindex="1">
				<i class="fa fa-repeat"></i>
				Save + repeat
			</div>
		</div>
	</section>
	<section class="hotkeys">
		<header>Hot keys</header>
		<ul>
			<li>
				<span class="icon">Alt</span>+<span class="icon">P</span>
				<span class="text">Project</span>
			</li>

			<li>
				<span class="icon">Alt</span>+<span class="icon">S</span>
				<span class="text">Start</span>
			</li>

			<li>
				<span class="icon">Alt</span>+<span class="icon">F</span>
				<span class="text">Finish</span>
			</li>

			<li>
				<span class="icon">Alt</span>+<span class="icon">Enter</span>
				<span class="text">Save</span>
			</li>
		</ul>
		<ul>
			<li>
				<span class="icon"><i class="fa fa-arrow-up"></i></span>
				<span class="text">Min</span>
			</li>

			<li>
				<span class="icon"><i class="fa fa-arrow-down"></i></span>
				<span class="text">Min</span>
			</li>

			<li>
				<span class="icon">N</span>
				<span class="text">Now</span>
			</li>

		</ul>
		<ul>

			<li>
				<span class="icon">A</span>
				<span class="text">AM</span>
			</li>

			<li>
				<span class="icon">P</span>
				<span class="text">PM</span>
			</li>
		</ul>
	</section>
	<button class="toggle_hotkeys"><i class="fa fa-chevron-down"></i></button>
`;

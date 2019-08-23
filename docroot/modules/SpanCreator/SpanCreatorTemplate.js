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
      <span class="editing_indicator">
        <span class="far fa-pencil"></span> Editing
      </span>
    </div>

    <section class="hotkeys">
      <div class="set global">
        <header>Global</header>
        <ul>
          <li>
            <span class="keys">
              <span class="icon">Ctrl</span> + <span class="icon">J</span>
            </span>
            <span class="text">Project</span>
          </li>

          <li>
            <span class="keys">
              <span class="icon">Ctrl</span> + <span class="icon">K</span>
            </span>
            <span class="text">Start</span>
          </li>

          <li>
            <span class="keys">
              <span class="icon">Ctrl</span> + <span class="icon">L</span>
            </span>
            <span class="text">Task</span>
          </li>

          <li>
            <span class="keys">
              <span class="icon">Ctrl</span> + <span class="icon pad">;</span>
            </span>
            <span class="text">Finish</span>
          </li>

          <li>
            <span class="keys">
              <span class="icon">Ctrl</span> + <span class="icon">Enter</span>
            </span>
            <span class="text">Save</span>
          </li>

        </ul>
      </div>
      <div class="set time">
        <header>Time field</header>
        <ul>
          <li>
            <span class="keys">
              <span class="icon"><i class="far fa-arrow-up"></i></span>
            </span>
            <span class="text">Minute up</span>
          </li>

          <li>
            <span class="keys">
              <span class="icon"><i class="far fa-arrow-down"></i></span>
            </span>
            <span class="text">Minute down</span>
          </li>

          <li>
            <span class="keys">
              <span class="icon">N</span>
            </span>
            <span class="text">Now</span>
          </li>

          <li>
            <span class="keys">
              <span class="icon">A</span>
            </span>
            <span class="text">AM</span>
          </li>

          <li>
            <span class="keys">
              <span class="icon">P</span>
            </span>
            <span class="text">PM</span>
          </li>
        </ul>
      </div>
    </section>


  </section>
`;

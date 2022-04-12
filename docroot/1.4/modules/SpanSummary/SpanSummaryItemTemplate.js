var SpanSummaryItemTemplate = `
  <li>
    <header>
      <label></label>

      <span class="time">
        (<span class="start"></span> - <span class="finish"></span>,
        <span class="elapsed"></span>)
      </span>

      <span class="actions">
        <span class="mini_button edit far fa-pencil"></span>
        <span class="mini_button delete far fa-trash"></span>
        <span class="mini_button repeat far fa-repeat"></span>
      </span>
    </header>
    <ul class="task_list"></ul>
  </li>`;
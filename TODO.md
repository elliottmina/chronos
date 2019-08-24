# TODO

* rebuild index

## Backlog

### Design

* Center text in daily charts
* New colors (including dark)
* Colors for cancelbutton
* Draw custom legend for stats charts.
  * order DESc
  * Take top 4

## Future

* Replace .button with <button>
* Get rid of jquery
* Persister as a replaceable module (SQLite, XHR, git)
* Move current date to App, so modules don't have to track it

## Done

* Removed JSON and text summaries
* Fixed issue where saving a span caused the first project to be selected.
* App remembers your work-in-progress span, in case you refresh the browser.
* Added hours per week goal.
* Goal hours per day, and hours per week are configurable.
* Fixed bug that sometimes caused suggestions to not populate when clicked.
* Changed date navigation keys to square brackets, so text can be selected with keyboard controls.
* Made it more obvious when you are editing a previous span.
* Moved today's projects to top of suggestion list.
* Added copy button for time values.
* Made hours display only decimal or minute values, based on configuration settings.
* Date display periodically checks if you have changed days.
* Added charts to show distribution of hours across projects.
* Summary now sorts projects alphabetically.
* Made project summary and span summary filterable.
* Fixed bug that didn't confirm save-and-repeat on previous/future dates.
* Fixed bug that sometimes caused edited task list to silently include the wrong items when executing save-and-repeat.
* Added project name segmentation based on configurable char list.
* Added chart to show elapsed time vs worked time.
* Fixed bug in exporter that broken downloads when hash present in data.
* Added save-and-repeat shortcut
* Span and project summaries are always displayed.  These are stacked at low screen widths, and side-by-side at higher screen widths.
* Project root controls colors for spans, projects and charts, chart contents.
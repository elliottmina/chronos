# TODO

* rebuild index

## Backlog

* shortcut for save and repeat
* Test with real data

### Design

* SVG icons instead of font?
* New colors (including dark)
* More chart colors?
* ensure date nav buttons don't move
* delete Goal.css?

## Future

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


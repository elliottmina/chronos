# TODO

## Backlog

## Future

* Replace .button with <button>
* Get rid of jquery
* Persister as a replaceable module (SQLite, XHR, git)
* Move current date to App, so modules don't have to track it

## Change list

### Project root

* Projects names are split up by configurable delimiters, so chronos recoginzes "Fionta: Overhead activities" is two items.
* Project delimiters are configurable.
* Project parts are given special visual treatment.
* Project root (first item in split) drives pie charts and colors.

### Stats and goals

* Chronos now tracks weekly goals.
* Daily/weekly goals are now configurable.
* Added charts to show distribution of hours across projects.
* Added chart to show elapsed time vs worked time.

### Quality of life

* Changed date navigation keys to square brackets, so text can be selected with keyboard controls.
* Span editing now as a cancel button.
* Moved today's projects to top of suggestion list.
* App remembers your work-in-progress span, in case you refresh the browser.
* Added copy button for time values.
* Added copy button for entire project (bottom left copy icon).
* Added save-and-repeat shortcut
* Date display periodically checks if you have changed days.
* Made hours display only decimal or minute values, based on configuration settings.

### Summary changes

* Made project summary and span summary filterable.
* Removed JSON and text summaries
* Span and project summaries are always displayed.
* Project summary now sorts projects alphabetically.

### Bug fixes

* Fixed bug in exporter that broken downloads when hash present in data.
* Fixed bug that didn't confirm save-and-repeat on previous/future dates.
* Fixed bug that sometimes caused edited task list to silently include the wrong items when executing save-and-repeat.
* Fixed issue where saving a span caused the first project to be selected.
* Fixed bug that sometimes caused suggestions to not populate when clicked.

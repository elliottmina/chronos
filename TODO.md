# TODO

* rebuild index

## Backlog

* Bug: JSON exporter does not include full data with large data sets.  Likely exceeding maximum string size.
* Allow repeat of summary
* Tasks
  * Edit tasks
  * Suggest tasks
* Metrics
  * Show volume per project/sub project for day, week, month, quarter year
    * sub projects
      * Perhaps just configurable delimiters (|:/.][)
  * Track time elapsed (start of first entry vs end of last entry) vs time worked
  * Goal section to display daily and weekly goals.
* Avatar with words of encouragement?  Also coach Z.
* Sound no longer plays
* Don't play goal animation on page load
* Reverse order of spans

## Future

* Get rid of jquery
* Persister as a replaceable module (SQLite, XHR, git)
* Move current date to App, so modules don't have to track it

## Done

* Removed JSON and text summaries
* Fixed issue where saving a span caused the first project to be selected.
* App remembers your work-in-progress span, in case you refresh the browser.
* Goal hours per day, and hours per week are configurable.
* Fixed bug that sometimes caused suggestions to not populate when clicked.
* Changed date navigation keys to square brackets, so text can be selected with keyboard controls.
* Made it more obvious when you are editing a previous span.
* Moved today's projects to top of list.
* Added copy button for time values.
* Made hours display only decimal or minute values, based on configuration settings.

# TODO

* rebuild index

## Backlog

* Move decimal hour setting to global
* Filter spans and summaries
* ensure date nav buttons don't move
* generate deterministic icons or abbreviations for projects
* repeat task wtih 3 items, remove the first two tasks, repeat and save
  -> First task is retained
* SVG icons instead of font?
* Sort project summary 
* delete Goal.css?
* Allow repeat of summary
* filter span list
* Periodically check if today is still today
* Metrics
  * Show volume per project/sub project for day, week, month, quarter year
    * sub projects
      * Perhaps just configurable delimiters (|:/.][)
  * Track time elapsed (start of first entry vs end of last entry) vs time worked
* Sound no longer plays
* Goals
  * Avatar with words of encouragement?  Also coach Z.
* Bug: JSON exporter does not include full data with large data sets.  Likely exceeding maximum string size.
* New colors
* Rename register/update to pub/sub

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

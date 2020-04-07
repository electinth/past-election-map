<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

**Table of Contents** _generated with [DocToc](https://github.com/thlorenz/doctoc)_

- [Script for merging election result data in csv into topo json files](#script-for-merging-election-result-data-in-csv-into-topo-json-files)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Script for merging election result data in csv into topo json files

To merge, do the following,

1. put election result files inside `csv` folder
2. filename should be `candidate_result_${BE}.csv`
3. source topojson files should be in `topo` folder
4. run `node -r esm merge.js`
5. output should be named `thailand-election.topo.json` and found in this folder
6. To use, put the file in `src/data`

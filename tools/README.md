<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

**Table of Contents** _generated with [DocToc](https://github.com/thlorenz/doctoc)_

- [Script for merging election result data in csv into topo json files](#script-for-merging-election-result-data-in-csv-into-topo-json-files)
- [Note on labelPosition script](#note-on-labelposition-script)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Generate election map TopoJSON

Prerequisites

```bash
npm install -g mapshaper
```

To create TopoJSON and combine additional data, do the following:

1. Put province file `province.csv` in `/csv`.
2. Put election results files at `csv/candidate_result_${BE}.csv`.
2. Put election map GeoJSON files at `/geo/${BE}.geojson`.
3. Run:

    ```bash
    $ chmod +x create-topojson.sh
    $ ./create-topojson.sh
    ```

4. Output TopoJSON will be created at `topo/thailand-election.topo.json`.
5. To use, put the file in `src/data`.

## Note on labelPosition script

currently polylabel cannot compute position for `สกลนคร`, use d3 centroid as a position for now.

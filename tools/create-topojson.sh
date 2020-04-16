# Geojson => topojson
# Simplify, filter islands
# Rename fields, layers
# Set ID field
# Join attributes from CSV
# Filter fields
rm -rf tmp/

mkdir -p tmp/{geojson,topojson}

echo "Preparing thailand-election.topo.json ..."

# Create all zones geojson

# B.E.2562
mapshaper geo/2562.geojson \
  -simplify 0.02 \
  -filter-islands min-vertices=4 min-area=20km2 \
  -rename-layers 2562 \
  -join csv/province.csv keys=province,name_th fields=* string-fields=province_id,region_id \
  -rename-fields province_name=name_th,province_name_en=name_en,zone_id=zone_no,code_name=code_th,code_name_en=code_en,region_name=region_th \
  -each 'id=`${province_id}-${zone_id}`, pid=`${province_id}-${province_name_en.toLowerCase()}`, zone_name=`${province_name} เขต ${zone_id}`' \
  -filter-fields id,province_id,zone_id,zone_name,province_name,province_name_en,region_id,region_name,code_name,code_name_en \
  -o tmp/geojson/2562.geojson field-order=ascending


# B.E.2557
mapshaper geo/2557.geojson \
  -simplify 0.02 \
  -filter-islands min-vertices=4 min-area=20km2 \
  -rename-layers 2557 \
  -join csv/province.csv keys=province,name_th fields=* string-fields=province_id,region_id \
  -rename-fields province_name=name_th,province_name_en=name_en,zone_id=zone_no,code_name=code_th,code_name_en=code_en,region_name=region_th \
  -each 'id=`${province_id}-${zone_id}`, pid=`${province_id}-${province_name_en.toLowerCase()}`, zone_name=`${province_name} เขต ${zone_id}`' \
  -filter-fields id,province_id,zone_id,zone_name,province_name,province_name_en,region_id,region_name,code_name,code_name_en \
  -o tmp/geojson/2557.geojson field-order=ascending

# B.E.2554
mapshaper geo/2554.geojson \
  -simplify 0.02 \
  -filter-islands min-vertices=4 min-area=20km2 \
  -rename-layers 2554 \
  -join csv/province.csv keys=province,name_th fields=* string-fields=province_id,region_id \
  -rename-fields province_name=name_th,province_name_en=name_en,zone_id=zone_no,code_name=code_th,code_name_en=code_en,region_name=region_th \
  -each 'id=`${province_id}-${zone_id}`, pid=`${province_id}-${province_name_en.toLowerCase()}`, zone_name=`${province_name} เขต ${zone_id}`' \
  -filter-fields id,province_id,zone_id,zone_name,province_name,province_name_en,region_id,region_name,code_name,code_name_en \
  -o tmp/geojson/2554.geojson field-order=ascending

# B.E.2550
mapshaper geo/2550.geojson \
  -simplify 0.02 \
  -filter-islands min-vertices=4 min-area=20km2 \
  -rename-layers 2550 \
  -join csv/province.csv keys=province,name_th fields=* string-fields=province_id,region_id \
  -rename-fields province_name=name_th,province_name_en=name_en,zone_id=zone_no,code_name=code_th,code_name_en=code_en,region_name=region_th \
  -each 'id=`${province_id}-${zone_id}`, pid=`${province_id}-${province_name_en.toLowerCase()}`, zone_name=`${province_name} เขต ${zone_id}`' \
  -filter-fields id,province_id,zone_id,zone_name,province_name,province_name_en,region_id,region_name,code_name,code_name_en \
  -o tmp/geojson/2550.geojson field-order=ascending


# Convert all geojson files to topojson
mapshaper tmp/geojson/*.geojson \
  -o tmp/topojson/ format=topojson extension=.topojson


# Combine multiple files into one file with multiple layers
mapshaper \
  tmp/topojson/2562.topojson \
  tmp/topojson/2557.topojson \
  tmp/topojson/2554.topojson \
  tmp/topojson/2550.topojson \
  combine-files \
  -rename-layers election-2562,election-2557,election-2554,election-2550 \
  -o ./topo/thailand-election.topo.json format=topojson

# Combine candidate results data to topo json
node -r esm merge.js
node -r esm label-position.js

# Done
echo "----------------------------------------------------------------"
echo "Great! Next steps:"
echo "- Move topo/thailand-election.topo.json to ../src/data"

# Clean up
rm -rf tmp/

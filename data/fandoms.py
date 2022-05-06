import csv
import json

IN_FILENAME = "fandoms.csv"
OUT_FILENAME = "fandoms.json"

infile = open(IN_FILENAME, newline='')
csvreader = csv.reader(infile)
next(csvreader)

output = {}

for row in csvreader:
    slug = row[0]
    title = row[1]
    subs = [x for x in row[2:] if x]
    entry = {'title': title}
    if subs:
        entry['subs'] = subs
    output[slug] = entry

with open(OUT_FILENAME, "w") as jsonfile:
    json.dump(output, jsonfile)

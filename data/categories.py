import csv
import json

IN_FILENAME = "categories.csv"
OUT_FILENAME = "categories.json"

infile = open(IN_FILENAME, newline='')
csvreader = csv.reader(infile)
next(csvreader)

output = {row[0]: row[1] for row in csvreader}

with open(OUT_FILENAME, "w") as jsonfile:
    json.dump(output, jsonfile)

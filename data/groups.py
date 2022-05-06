import csv
import json

IN_FILENAME = "groups.csv"
OUT_FILENAME = "groups.json"

# Load these for validation
with open("categories.json") as f:
    CATEGORIES = json.load(f)
with open("fandoms.json") as f:
    FANDOMS = json.load(f)

infile = open(IN_FILENAME, newline='')
csvreader = csv.reader(infile)
next(csvreader)

output = []

for row in csvreader:
    table, name, categories, other, fandoms = row

    categories = categories.split(",")
    if not fandoms:
        fandoms = []
    else:
        fandoms = fandoms.split(",")

    # Validate slugs
    for category in categories:
        if category not in CATEGORIES:
            print("ERROR: Category {} from {} does not exist".format(category, name))
    for fandom in fandoms:
        if fandom not in FANDOMS:
            print("ERROR: Fandom {} from {} does not exist".format(fandom, name))

    entry = {
        'table': table,
        'name': name,
        'categories': categories,
        'other': other,
        'fandoms': fandoms,
    }

    output.append(entry)


with open(OUT_FILENAME, "w") as jsonfile:
    json.dump(output, jsonfile)

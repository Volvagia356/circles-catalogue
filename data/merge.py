import json

output = {}

for item in ('categories', 'fandoms', 'groups'):
    with open("{}.json".format(item)) as f:
        output[item] = json.load(f)

with open("data.json", "w") as f:
    json.dump(output, f)

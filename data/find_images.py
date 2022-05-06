import json
import os.path
import urllib.parse

with open("groups.json") as f:
    groups = json.load(f)

for group in groups:
    if os.path.isfile("../img/jpg/{}.jpg".format(group['table'])):
        image_path = "jpg/{}.jpg".format(group['table'])
    elif os.path.isfile("../img/png/{}.png".format(group['table'])):
        image_path = "png/{}.png".format(group['table'])
    else:
        image_path = None
        print("ERROR: Image not found for {}".format(group['name']))
    if image_path:
        image_path = urllib.parse.quote(image_path)
    group['image'] = image_path

with open("groups.json", "w") as f:
    json.dump(groups, f)

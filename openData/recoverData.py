

import requests
import json 

url = "https://data.enseignementsup-recherche.gouv.fr/api/records/1.0/search/?dataset=fr-esr-principaux-etablissements-enseignement-superieur&facet=uo_lib&rows=1000"

r = requests.get(url)
records = r.json()['records']
data = []
for record in records:
    recordId = record['recordid']
    localisation = record['fields']['com_nom']
    name = record['fields']['uo_lib']
    print(recordId, localisation, name)
    schoolObject = {
        "id": recordId,
        "city": localisation,
        "school": name
    }
    data.append(schoolObject)
with open('Schools.json', 'w') as f:
    json.dump(data, f)


import requests
import json 



# url = "https://data.enseignementsup-recherche.gouv.fr/api/records/1.0/search/?dataset=fr-esr-principaux-etablissements-enseignement-superieur&facet=uo_lib&rows=1000"

url = "https://en.wikipedia.org/w/api.php?action=query&format=json&pllimit=5000&prop=links&titles=List+of+hobbies"
r = requests.get(url)
hobbies = r.json()['query']['pages']['31257416']['links']
list_of_hobbies = []
for id, hobby in enumerate(hobbies):
    hobby_name = hobby['title']
    hobby_dict = {
        'id': id,
        'name': hobby_name
    }
    list_of_hobbies.append(hobby_dict)


with open('hobbies_en.json', 'w') as f:
    json.dump(list_of_hobbies, f)

# records = r.json()['records']
# data = []
# for record in records:
#     recordId = record['recordid']
#     localisation = record['fields']['com_nom']
#     name = record['fields']['uo_lib']
#     print(recordId, localisation, name)
#     schoolObject = {
#         "id": recordId,
#         "city": localisation,
#         "school": name
#     }
#     data.append(schoolObject)
# with open('Schools.json', 'w') as f:
#     json.dump(data, f)
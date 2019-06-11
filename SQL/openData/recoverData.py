

import requests
import json 
import random


## hobbies
# url = "https://data.enseignementsup-recherche.gouv.fr/api/records/1.0/search/?dataset=fr-esr-principaux-etablissements-enseignement-superieur&facet=uo_lib&rows=1000"
# hobbies = r.json()['query']['pages']['31257416']['links']
# list_of_hobbies = []
# for id, hobby in enumerate(hobbies):
#     hobby_name = hobby['title']
#     hobby_dict = {
#         'id': id,
#         'name': hobby_name
#     }
#     list_of_hobbies.append(hobby_dict)
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

with open('dbUsers.json', 'r') as f:
    savedUsers = json.load(f)['data']
    women_ids = [user['id'] for user in savedUsers if user['gender'] == 'femme']
    random.shuffle(women_ids)
    men_ids = [user['id'] for user in savedUsers if user['gender'] == 'homme']
    random.shuffle(men_ids)
    nb_users = len(savedUsers)*2

while len(men_ids) > 0 or len(women_ids) > 0:
    url = "https://randomuser.me/api/?inc=picture&results=" + str(nb_users)
    r = requests.get(url)
    users = r.json()
    for element in users['results']:
        picture = element['picture']['large']
        if '/women' in picture and len(women_ids) > 0:
            user_id = women_ids.pop()
            print('UPDATE User SET profile_picture = "' + picture + '" WHERE id = "' + user_id + '";')
        elif '/men' in picture and len(men_ids) > 0:
            user_id = men_ids.pop()
            print('UPDATE User SET profile_picture = "' + picture + '" WHERE id = "' + user_id + '";')
            
    
# with open('users_pictures.json', 'w') as f:
#     json.dump(users, f)


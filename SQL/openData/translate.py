# -*- coding: utf-8 -*-

# This simple app uses the '/translate' resource to translate text from
# one language to another.

# This sample runs on Python 2.7.x and Python 3.x.
# You may need to install requests and uuid.
# Run: pip install requests uuid

import os, requests, uuid, json
subscriptionKey = "9a230295a28d4e1c8b8964f2ca4723b0"

# If you want to set your subscription key as a string, uncomment the next line.
#subscriptionKey = 'put_your_key_here'

# If you encounter any issues with the base_url or path, make sure
# that you are using the latest endpoint: https://docs.microsoft.com/azure/cognitive-services/translator/reference/v3-0-translate
base_url = 'https://api.cognitive.microsofttranslator.com'
path = '/translate?api-version=3.0'
params = '&to=fr'
constructed_url = base_url + path + params

headers = {
    'Ocp-Apim-Subscription-Key': subscriptionKey,
    'Content-type': 'application/json',
    'X-ClientTraceId': str(uuid.uuid4())
}

# You can pass more than one object in body.
list_of_hobbies = []
with open('hobbies_en.json') as json_data:
    d = json.load(json_data)
    print(d)
    for id, hobby in enumerate(d):
        body = [{
            'text' : hobby['name']
        }]
        request = requests.post(constructed_url, headers=headers, json=body)
        response = request.json()
        hobby_fr = response[0]['translations'][0]['text']
        print(hobby_fr)
        hobby_dict = {
        'id': id,
        'name': hobby_fr
         }
        list_of_hobbies.append(hobby_dict)
        with open('hobbies_fr.json', 'w') as f:
            json.dump(list_of_hobbies, f)
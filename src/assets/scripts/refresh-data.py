import os
import json

playlistsFolder = r'D:/projects/nx-projects/apps/music/src/assets/songs'

jsonPath = r'D:/projects/nx-projects/apps/music/src/assets/'

# resets the json file every time.

playlistId = 0
titleId = 0

playlistsJson = '['
titlesJson = '['

# Directory must only contain playlists subdirectories.
with os.scandir(playlistsFolder) as entries:
  for entry in entries:
    if os.path.isdir(os.path.join(playlistsFolder, entry)):

      playlistsJson += '{"id":"' + str(playlistId) + '","name":"' + entry.name + '"},'

      with os.scandir(os.path.join(playlistsFolder, entry)) as playlist:
        for title in playlist:

          split = title.name.split('-')

          titlesJson += '{"id":"' + str(titleId) + '","playlistId":"' + str(playlistId) + '","name":"' + split[len(split) - 1].replace('.mp3','').strip() + '","artist":"' + split[0].strip() + '","source":"/assets/songs/' + entry.name + '/' + title.name.strip() + '"},'

          titleId += 1
      playlistId += 1

#remove trailing ',' and closes.
playlistsJson = playlistsJson[:len(playlistsJson) -1]
playlistsJson += ']'

titlesJson = titlesJson[:len(titlesJson) -1]
titlesJson += ']'

# dump auto clears the previous content
with open('apps/music/src/assets/playlists.json', 'w', newline='\r\n', encoding='utf-8') as playlistF:
  json.dump(playlistsJson, playlistF, ensure_ascii=False, indent=2)

with open('apps/music/src/assets/titles.json', 'w', encoding='utf-8') as titleF:
  json.dump(titlesJson, titleF, ensure_ascii=False, indent=2)



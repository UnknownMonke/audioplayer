import os
import json

sourceFolder = r'D:\\projects\\music\\server\\data\\songs'
destFolder = r'D:\\projects\\music\\server\\data'

# Resets the json file every time.
playlistId = 0
titleId = 0

playlistsJson = '['
titlesJson = '['

# Directory must only contain playlists subdirectories.
with os.scandir(sourceFolder) as entries:
  for entry in entries:
    if os.path.isdir(os.path.join(sourceFolder, entry)):

      playlistsJson += '{"id":"' + str(playlistId) + '","name":"' + entry.name + '"},'

      with os.scandir(os.path.join(sourceFolder, entry)) as playlist:
        for title in playlist:

          split = title.name.split('-')

          titlesJson += ''.join(['{"id":"', str(titleId), '","playlistId":"', str(playlistId), '","name":"', split[len(split) - 1].replace('.mp3','').strip(),
          '","artist":"', split[0].strip(), '","source":"', title.name, '"},'])

          titleId += 1
      playlistId += 1

# Remove trailing ',' and closes.
playlistsJson = playlistsJson[:len(playlistsJson) -1]
playlistsJson += ']'

titlesJson = titlesJson[:len(titlesJson) -1]
titlesJson += ']'

# Dump auto clears the previous content
with open('' + destFolder + '/playlists.json', 'w', newline='\r\n', encoding='utf-8') as playlistF:
  json.dump(playlistsJson, playlistF, ensure_ascii=False, indent=2)

with open('' + destFolder + '/titles.json', 'w', encoding='utf-8') as titleF:
  json.dump(titlesJson, titleF, ensure_ascii=False, indent=2)



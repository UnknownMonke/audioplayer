/** --------------- Audio Object Types --------------- */

/** Holds all audio playback necessary informations. */
export declare type AudioState = {
  loadedMetadata: boolean,
  isPlaying: boolean,
  isLooping: boolean,
  currentTime: number, // Time in s.
  duration: number, // Duration in s.
  volume: number, // Between 0 and 1.
  error: boolean
};

/** Conveys commands toward the HTML Audio element. */
export declare type AudioCommand = {
  name: AudioAction,
  payload: {
    value?: boolean,
    data?: {
      time?: number,
      volume?: number,
      source?: string
    }
  }
};

/** Holds the audio commands names. */
export enum AudioAction {
  PRELOAD = 'preload',
  LOAD = 'load',
  LOOP = 'loop',
  PLAY = 'play',
  STOP = 'stop',
  TIMEUPDATE = 'timeUpdate',
  VOLUMECHANGE = 'volumeChange',
  RESET = 'reset',
  NONE = ''
};

/** Holds some of the HTMLAudioElement native events and custom events. */
export enum AudioEvent {
  // Fired when the paused property is changed from true to false, as a result of the HTMLMediaElement.play() method, or the autoplay attribute.
  PLAY = 'play',
  // Fired when playback is ready to start after having been paused or delayed due to lack of data
  PLAYING= 'playing',
  // Fired when a request to pause play is handled and the activity has entered its paused state, most commonly occurring when the media HTMLMediaElement.pause() method is called.
  PAUSE = 'pause',
  // Fired when the metadata is loaded, such as track duration and media type.
  LOADEDMETADATA = 'loadedmetadata',
  // Fired when the time indicated by the currentTime property has been updated.
  TIMEUPDATE = 'timeupdate',
  VOLUMECHANGE = 'volumechange',
  // Fired when playback stops on end of the media or because no further data is available.
  ENDED = 'ended',
  ERROR = 'error'
};

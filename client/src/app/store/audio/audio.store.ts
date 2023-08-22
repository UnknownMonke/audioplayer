import { createAction, createActionGroup, createFeatureSelector, createReducer, emptyProps, on, props } from "@ngrx/store";
import { CurrentTitle } from "src/app/types";
import { AudioAction, AudioCommand, AudioState } from "./audio.types";

// ----------------------- Actions ----------------------- //*

export const AudioCommands = createActionGroup({
  source: '[Audio] Audio Commands',
  events: {
    'preload': props<{ source: string }>(),
    'load': props<{ source: string }>(),
    'play': props<{ play: boolean }>(),
    'stop': emptyProps(),
    'toggleLoop': emptyProps(),
    'timeUpdate': props<{ time: number }>(),
    'volumeChange': props<{ volume: number }>(),
    'reset': emptyProps()
  }
});

export const AudioEvents = createActionGroup({
  source: '[Audio] Audio Events',
  events: {
    'loadedMetadata': props<{ value: boolean, time: number, volume: number }>(),
    'playing': props<{ playing: boolean }>(),
    'looping': props<{ looping: boolean }>(),
    'timeUpdate': props<{ time: number }>(),
    'volumeChange': props<{ volume: number }>(),
    'ended': emptyProps(),
    'reset': emptyProps()
  }
});

export const playPause = createAction(
  '[Audio] play pause',
  props<{ currentTitle: CurrentTitle }>()
);

export const togglePlay = createAction(
  '[Audio] toggle play'
);

export const changeTitle = createAction(
  '[Audio] change title',
  props<{ direction: 1 | -1 }>()
);

// ----------------------- Reducers ---------------------- //

export const audioCommandReducer = createReducer(
  { name: AudioAction.NONE, payload: {} } as AudioCommand,
  on(AudioCommands.preload, (_command, { source }) => {
    return {
      name: AudioAction.PRELOAD,
      payload: {
        data: { source }
      }
    }
  }),
  on(AudioCommands.load, (_command, { source }) => {
    return {
      name: AudioAction.LOAD,
      payload: {
        data: { source }
      }
    }
  }),
  on(AudioCommands.toggleLoop, (_command) => {
    return {
      name: AudioAction.LOOP,
      payload: {}
    }
  }),
  on(AudioCommands.play, (_command, { play }) => {
    return {
      name: AudioAction.PLAY,
      payload: {
        value: play
      }
    }
  }),
  on(AudioCommands.stop, (_command) => {
    return {
      name: AudioAction.STOP,
      payload: {}
    }
  }),
  on(AudioCommands.timeUpdate, (_command, { time }) => {
    return {
      name: AudioAction.TIMEUPDATE,
      payload: {
        data: { time }
      }
    }
  }),
  on(AudioCommands.volumeChange, (_command, { volume }) => {
    return {
      name: AudioAction.VOLUMECHANGE,
      payload: {
        data: { volume }
      }
    }
  }),
  on(AudioCommands.reset, (_command) => {
    return {
      name: AudioAction.RESET,
      payload: {}
    }
  })
)

// ----------------------- Reducers ---------------------- //

export const initialState: AudioState = {
  loadedMetadata: false,
  isPlaying: false,
  isLooping: false,
  currentTime: 0,
  duration: 0,
  volume: 0,
  error: false
};

export const audioStateReducer = createReducer(
  initialState,
  on(AudioEvents.playing, (state: AudioState, { playing }) => ({ ...state, isPlaying: playing }) ),
  on(AudioEvents.looping, (state: AudioState, { looping }) => ({ ...state, isLooping: looping }) ),
  on(AudioEvents.loadedMetadata, (state: AudioState, { value, time, volume }) => ({ ...state, loadedMetadata: value, duration: time, volume }) ),
  on(AudioEvents.timeUpdate, (state: AudioState, { time }) => ({ ...state, currentTime: time }) ),
  on(AudioEvents.volumeChange, (state: AudioState, { volume }) => ({ ...state, volume }) ),
  on(AudioEvents.reset, () => initialState)
);

// ----------------------- Selectors --------------------- //

export const audioCommand = createFeatureSelector<AudioCommand>('audioCommand');
export const audioState = createFeatureSelector<AudioState>('audioState');




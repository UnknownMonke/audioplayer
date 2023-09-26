import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { filter, Subject, takeWhile, tap } from "rxjs";
import { changeTitle, audioCommand, AudioEvents } from "../store/audio/audio.store";
import { AudioEvent, AudioCommand, AudioAction } from "../store/audio/audio.types";

/**
 * Audio stream builder service.
 *
 * ---
 *
 * Actions :
 *
 * - Builds the audio media element and all the necessary nodes.
 * - Subscribes the audio element to the audio commands from the store.
 * - Binds listeners to the audio events of the media element which trigger updates to the audio state.
 * - Exposes the analyser node to process playback and compute the FFT locally.
 *
 * Process :
 *
 * The HTMLAudioElement provides access to the properties of the <audio> DOM element,
 * which is used to embed sound content in documents.
 *
 * It contains various events such as play, pause, time update...
 * The current title will be played from there.
 *
 * In order to instantiate this element, we use the Web Audio API :
 *
 *   - Create an AudioContext, which creates a graph of nodes (source, effects, destination) that we will plug to.
 *   - Inside the context, create the sources node — such as <audio>, oscillator, stream.
 *   - Create effects nodes, such as reverb, biquad filter, panner, compressor.
 *   - Choose final destination of audio, for example your system speakers.
 *   - Connect the sources up to the effects, and the effects to the destination.
 *
 *     ┌─────────┐         ┌─────────┐        ┌─────────────┐
 *     │  Input  ├─────────► Effects ├────────► Destination │
 *     └─────────┘         └─────────┘        └─────────────┘
 *
 * In addition, we add listeners to some of the audio element events (the one we use)
 * and replicate them in the state to make them available to others parts of the application.
 * The listener transmits the event to the state by updating the replicated store variable each time the original event is fired.
 *
 * The AudioState object holds the state of the audio playback with properties corresponding to the various audio events and other non native properties,
 * effectively holding a complete image of the audio playback current parameters, such as time, volume, looping, play state...
 *
 * Some events such as playing also update other parts of the state, such as the current title, using a dedicated effect.
 *
 * ---
 *
 * This service is never called by any component, use the AudioService facade instead, which interfaces components with this service and add additional logic.
 */
@Injectable({
  providedIn: 'root',
})
export class AudioProvider {

  analyser: AnalyserNode = {} as AnalyserNode;

  isDead$ = new Subject<boolean>();

  constructor(
    private _store: Store,
  ) {
    this.initChain();
  }

  initChain(): void {
    // --------- Input --------- //

    // Creates context.
    const ctx: AudioContext = new AudioContext();

    // Assign audio element source.
    const source: MediaElementAudioSourceNode = ctx.createMediaElementSource(new Audio());

    // Creates the HTMLAudioElement.
    const audio = source.mediaElement;

    // Plugs the listeners and state.
    Object.values(AudioEvent).forEach((eventName: string) =>
      audio.addEventListener(eventName, (event: Event) => this._updateState(event, audio))
    );

    // -------- Effects ------- //

    // Creates analyser for FFT.
    this.analyser = ctx.createAnalyser();
    // Sets number of values. Default is 1024.
    this.analyser.fftSize = 256;
    // Connects the analyser to source input.
    source.connect(this.analyser);

    // Creates gain to allow playback in speakers.
    const gain: GainNode = ctx.createGain();
    // Connects gain to source input.
    source.connect(gain);

    // ------ Destination ----- //

    // Connects gain to output to send the playback to speakers.
    gain.connect(ctx.destination);

    // ------------------------ //

    // Wires the audio element to the audio commands to lauch them from the store.
    this._store.select(audioCommand)
      .pipe(
        filter( (cmd: AudioCommand) => cmd !== undefined ),
        takeWhile( (cmd: AudioCommand) => cmd.name !== AudioAction.RESET ),
        tap( (cmd: AudioCommand) => this._execCommand(cmd, audio) )
      ).subscribe();

    console.info('Audio chain initialized');
  }

  /** Dispatches the audio event in the state. */
  private _updateState(event: Event, audio: HTMLAudioElement): void {
    switch (event.type) {
      case AudioEvent.LOADEDMETADATA: return this._store.dispatch( AudioEvents.loadedMetadata({ value: true, time: audio.duration, volume: audio.volume }) );
      case AudioEvent.PAUSE: return this._store.dispatch( AudioEvents.playing({ playing: false }) );
      case AudioEvent.PLAYING: return this._store.dispatch( AudioEvents.playing({ playing: true }) );
      case AudioEvent.TIMEUPDATE: return this._store.dispatch( AudioEvents.timeUpdate({ time: audio.currentTime }) );
      case AudioEvent.VOLUMECHANGE: return this._store.dispatch( AudioEvents.volumeChange({ volume: audio.volume }) );
      case AudioEvent.ENDED: return this._store.dispatch( changeTitle({ direction: 1 }) ); // Plays next title on playback end event.
      default: break;
    }
  }

  private _execCommand(command: AudioCommand, audio: HTMLAudioElement): void {

    switch(command.name) {

      case AudioAction.PRELOAD:
        audio.src = command.payload.data?.source ? command.payload.data.source  : '';
        audio.load();
        break;

      case AudioAction.LOAD:
        audio.pause();
        audio.src = command.payload.data?.source ? command.payload.data.source  : '';
        audio.load();
        audio.play();
        break;

      case AudioAction.LOOP:
        audio.loop = !audio.loop;
        this._store.dispatch( AudioEvents.looping({ looping: audio.loop }) );
        break;

      case AudioAction.PLAY:
        command.payload.value ? audio.play() : audio.pause();
        break;

      case AudioAction.STOP:
        audio.pause();
        audio.src = '';
        audio.load();
        break;

      case AudioAction.TIMEUPDATE:
        if(command.payload.data?.time) audio.currentTime = command.payload.data.time;
        break;

      case AudioAction.VOLUMECHANGE:
        if(command.payload.data?.volume !== undefined) {
          if(command.payload.data.volume === 0) {
            audio.muted = true;
            // Manually dispatches the volume event as no event is normally dispatched, since the volume did not change.
            this._store.dispatch( AudioEvents.volumeChange({ volume: 0 }) );
          } else {
            audio.muted = false;
            audio.volume = command.payload.data.volume;
          }
        }
        break;

      default: break;
    }
  }
}

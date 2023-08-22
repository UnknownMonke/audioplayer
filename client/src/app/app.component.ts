import { HttpClientModule } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { EffectsModule } from "@ngrx/effects";
import { StoreModule } from '@ngrx/store';
import { HttpClientInMemoryWebApiModule } from "angular-in-memory-web-api";
import { AppRoutingModule } from './app-routing.module';
import { AudioPlayerModule } from './components/audio-player/audioplayer.component';
import { BackgroundModule } from './components/background/background.component';
import { InMemoryDataService } from './in-memory-data.service';
import { AudioEffects } from './store/audio/audio.effect';
import { audioCommandReducer, audioStateReducer } from './store/audio/audio.store';
import { DisplayEffects } from './store/display/display.effects';
import { displaysReducer } from './store/display/display.store';
import { PlaylistEffects } from './store/playlist/playlist.effect';
import { currentPlaylistReducer, streamingPlaylistReducer, playlistsReducer } from './store/playlist/playlist.store';
import { TitleEffects } from './store/title/title.effects';
import { currentTitleReducer } from './store/title/title.store';

//TODO use meta reducers to debug tools
//TODO testing, labels on buttons, random
//TODO tri playlists
//TODO sliding text title song
//TODO private mode css ?
/**
 * Root component of the application.
 *
 * ---
 *
 * Content components, such as the list of playlists and titles, are encapsulated into the background content container.
 * Fixed elements like the audio player are encapsulated into the footer container, fixed, above the content.
 *
 * Usage notes :
 *
 * - Using ng-content is only useful if more than one template share the same container, otherwise using a child component is preferred.
 *
 * - The Angular change detection strategy is set to OnPush by default on all components to prevent for a complete change detection of the tree
 * each time an input is changed (which improves performance).
 *
 * Observables :
 *
 * - Subscribing to an Observable is analogous to calling a Function.
 * - Observables are able to deliver values either synchronously or asynchronously.
 * - Observables can "return" multiple values over time.
 *
 * Components are reusable by default unless standalone (presentationzl vs container vs layout).
 *
 * State is updated by dispatching an action to a reducer that links the action to the state variable :
 *
 *
 * ┌─────────────┐      ┌───────────┐       ┌───────────┐
 * │  Selectors  ◄──────┤   Store   │       │ Databases │
 * └──────┬──────┘      └─────▲─────┘       └───┬───▲───┘
 *        │                   │                 │   │
 *        │                   │                 │   │
 *        │                   │                 │   │
 *        │             ┌─────┴─────┐       ┌───▼───┴───┐
 *        │             │  Reducer  │       │  Service  │
 *        │             └─────▲─────┘       └───┬───▲───┘
 *        │                   │                 │   │
 *        │                   │                 │   │
 * ┌──────▼──────┐      ┌─────┴─────┐       ┌───▼───┴───┐
 * │  Component  ├──────►  Actions  │       │  Effects  │
 * └─────────────┘      └───▲───▲───┘       └───┬───┬───┘
 *                          │   │               │   │
 *                          │   │               │   │
 *                          │   │               │   │
 *                          │   └───────────────┘   │
 *                          │                       │
 *                          └───────────────────────┘
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'm-root',
  template: `
    <m-background>

      <ng-container content>
        <router-outlet></router-outlet>
      </ng-container>

      <ng-container footer>
        <m-audioplayer></m-audioplayer>
      </ng-container>

    </m-background>
  `
})
export class AppComponent {}

// ------------------------------------------------------------------------------------------------------------------------ //

@NgModule({
  declarations: [AppComponent],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    HttpClientModule,
    RouterModule,
    // Intercepts HTTP requests and returns simulated server responses.
    HttpClientInMemoryWebApiModule.forRoot(InMemoryDataService, { dataEncapsulation: false }),
    EffectsModule.forRoot([
      AudioEffects,
      DisplayEffects,
      PlaylistEffects,
      TitleEffects
    ]),
    // Injects the store and assign corresponding reducers to each of their state variable.
    StoreModule.forRoot(
      {
        displays: displaysReducer,
        audioState: audioStateReducer,
        audioCommand: audioCommandReducer,
        currentPlaylist: currentPlaylistReducer,
        streamingPlaylist: streamingPlaylistReducer,
        currentTitle: currentTitleReducer,
        playlists: playlistsReducer
      }
    ),
    AudioPlayerModule,
    BackgroundModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}

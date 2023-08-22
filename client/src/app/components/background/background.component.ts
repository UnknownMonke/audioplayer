import { ChangeDetectionStrategy, Component, NgModule } from "@angular/core";

/**
 * Layout component to hold css background.
 *
 * ---
 *
 * Holds a content container, a footer container for audio player with fixed height and can hold a fixed header (not used).
 *
 * The component is encapsulated between the parent component and the parent component content which is injected through the ng-content :
 *
 * ┌────────────────────────────┐
 * │      Parent Component      │
 * │ ┌────────────────────────┐ │
 * │ │       Component        │ │
 * │ │ ┌────────────────────┐ │ │
 * │ │ │   Parent Content   │ │ │
 * │ │ └────────────────────┘ │ │
 * │ └────────────────────────┘ │
 * └────────────────────────────┘
 *
 * ng-content is used to inject templates in the child component diectly from the parent component.
 * See Angular content projection.
 *
 * ---
 *
 * One background is instantiated throughout the whole application.
 *
 * ---
 *
 * Technicals :
 *
 * The app is held within the window height. The player is at the bottom of the screen, of fixed height,
 * and the titles and playlists are in a scrollable list, within the remaining height frame, which must be adaptative
 * for when the player is visible or not (100% of the screen, or 100% - playerHeight).
 *
 * To do so, one solution could be to watch programatically for the player display through the corresponding Observable,
 * then assign a class using the ngIf directive, which would set the content height accordingly.
 *
 * To prevent importing unecessary data into the component, the even-more simple solution is to fix the container height,
 * then flex the display with a scroll on the content; the content height will automatically adjust when the player appears.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'm-background',
  templateUrl: './background.component.html',
  styleUrls: ['./background.component.scss']
})
export class BackgroundComponent {}

// ------------------------------------------------------------------------------------------------------------------------ //

@NgModule({
  declarations: [BackgroundComponent],
  exports: [BackgroundComponent],
  imports: []
})
export class BackgroundModule {}

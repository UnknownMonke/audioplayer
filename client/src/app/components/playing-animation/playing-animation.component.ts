import { ChangeDetectionStrategy, Component, NgModule } from "@angular/core";

/**
 * Presentational component to display a playing animation within its parent element, in pure css.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'm-playing-animation',
  templateUrl: './playing-animation.component.html',
  styleUrls: ['./playing-animation.component.scss']
})
export class PlayingAnimationComponent {}

// ------------------------------------------------------------------------------------------------------------------------ //

@NgModule({
  declarations: [PlayingAnimationComponent],
  exports: [PlayingAnimationComponent],
  imports: []
})
export class PlayingAnimationModule {}

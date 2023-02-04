import { ChangeDetectionStrategy, Component, NgModule } from "@angular/core";

/**
 * Presentational component to display a spinning loading animation within its parent element, in pure css.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'm-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent {}

// ------------------------------------------------------------------------------------------------------------------------ //

@NgModule({
  declarations: [LoaderComponent],
  exports: [LoaderComponent],
  imports: []
})
export class LoaderModule {}

import { ChangeDetectionStrategy, Component, Input, NgModule } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";

/**
 * Presentational component to hold the card button-style element.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'm-card-button',
  templateUrl: './card-button.component.html',
  styleUrls: ['./card-button.component.scss']
})
export class CardButtonComponent {

  @Input() icon = ''; // Obvious types do not need to be declared.
}

// ------------------------------------------------------------------------------------------------------------------------ //

@NgModule({
  declarations: [CardButtonComponent],
  exports: [CardButtonComponent],
  imports: [
    MatIconModule
  ]
})
export class CardButtonModule {}

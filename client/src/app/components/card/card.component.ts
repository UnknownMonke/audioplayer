import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, Input, NgModule } from "@angular/core";
import { CardButtonModule } from "../card-button/card-button.component";

/**
 * Presentational card component to display a playlist or individual title.
 *
 * ---
 *
 * Conveys all the necessary informations through an input props.
 *
 * The input is transmitted by the parent to avoid any logic within the child component.
 *
 * All custom types are declared in the global types.d.ts file.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'm-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent {

  @Input() options: CardOptions = {}; // Gives an empty default value to the input.
}

// ------------------------------------------------------------------------------------------------------------------------ //

@NgModule({
  declarations: [CardComponent],
  exports: [CardComponent],
  imports: [
    CommonModule,
    CardButtonModule
  ]
})
export class CardModule {}

/**
 * Local type for Card component.
 * Holds song and playlist card parameters.
 *
 * Only used in the component and components that instantiates it,
 * therefore we can define it inside the component itself and export it.
 */
export type CardOptions = {
  itemId: string,
  title: string,
  subTitle?: string,
  isPlayable?: boolean,
  isPlaying?: boolean,
  selected?: boolean,
  disabled?: boolean
} | Record<PropertyKey, never>;

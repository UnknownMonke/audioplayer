import { ChangeDetectionStrategy, Component, Input, NgModule } from "@angular/core";

/**
 * Layout component to encapsulate a list of items under a list-type structure.
 *
 * ---
 *
 * Provides the css structure and a title.
 *
 * Height is modified when the audio player is visible to see all elements (automatically from the background flexbox).
 *
 * The component is encapsulated between the parent component and the parent component content (the cards) which is injected through the ng-content
 * (similar to the Background component).
 *
 * Encapsulating is useful when several components with different needs must share the same encapsulating component.
 * Another way of doing it could be to assign a variable to load the specific component through ngIf directive.
 *
 * ---
 *
 * Important : a centered flexbox with scroll centers according to the element width.
 * The audio player not in the scroll is not exactly aligned with the list as a result.
 * However this is barely noticeable to the end user.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'm-listview',
  templateUrl: './listview.component.html',
  styleUrls: ['./listview.component.scss']
})
export class ListViewComponent {

  @Input() listTitle = ''; // Obvious types do not need to be declared.
}

// ------------------------------------------------------------------------------------------------------------------------ //

@NgModule({
  declarations: [ListViewComponent],
  exports: [ListViewComponent],
  imports: []
})
export class ListViewModule {}

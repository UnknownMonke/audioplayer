import { AfterViewInit, ChangeDetectionStrategy, Component, Input, NgModule } from "@angular/core";
import { ScrollService } from "src/app/services/scroll.service";

/**
 * Layout component to encapsulate a list of items under a list-type structure.
 *
 * ---
 *
 * Actions :
 *
 * - Provides the css structure and a title.
 * - Send a dispatch once the component has finished loading, to apply the stored scroll position to the scrollable background element.
 *
 * ---
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
export class ListViewComponent implements AfterViewInit {

  @Input() listTitle = ''; // Obvious types do not need to be declared.

  constructor(
    private _scrollService: ScrollService
  ) {}

  ngAfterViewInit(): void {
    this._scrollService.applyScroll(); // Once loaded, triggers scroll restoration.
  }
}

// ------------------------------------------------------------------------------------------------------------------------ //

@NgModule({
  declarations: [ListViewComponent],
  exports: [ListViewComponent],
  imports: []
})
export class ListViewModule {}

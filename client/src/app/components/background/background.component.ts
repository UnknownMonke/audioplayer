import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, ElementRef, NgModule, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { Subject, takeUntil } from "rxjs";
import { ScrollService } from "../../services/scroll.service";

/**
 * Standalone component to hold css background.
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
 * --> See Angular content projection.
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
 *
 * The content holds the lists of playlists and titles, and as such is made scrollable.
 * The navigation remembers the previous scroll position,
 * and the template listens for scroll restoration after the list of elements has finished initialization.
 * --> See the scroll store for more infos.
 *
 * Also, the subscription is handled within the component as the async pipe will produce some weird results upon scroll restoration.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'm-background',
  templateUrl: './background.component.html',
  styleUrls: ['./background.component.scss']
})
export class BackgroundComponent implements OnInit, OnDestroy {

  isDead$ = new Subject<boolean>();

  @ViewChild('content') content: ElementRef<HTMLDivElement>;

  constructor(
    private _element: ElementRef,
    private _scrollService: ScrollService
  ) {
    this.content = this._element.nativeElement
  }

  ngOnInit(): void {
    this._scrollService.scrollPos$
      .pipe(
        takeUntil(this.isDead$)
      ).subscribe((value: number) => {
        this.content.nativeElement.scrollTop = value;
      });
  }

  scrollend(scrollEvent: any): void {
    this._scrollService.savePos(scrollEvent.target.scrollTop);
  }

  ngOnDestroy(): void {
    this.isDead$.next(true);
  }
}

// ------------------------------------------------------------------------------------------------------------------------ //

@NgModule({
  declarations: [BackgroundComponent],
  exports: [BackgroundComponent],
  imports: [
    CommonModule
  ]
})
export class BackgroundModule {}

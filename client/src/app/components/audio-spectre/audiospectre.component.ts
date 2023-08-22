import { CommonModule } from "@angular/common";
import { Component, ChangeDetectionStrategy, NgModule, OnInit, ViewChild, ElementRef, HostListener, OnDestroy, NgZone } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { filter, Observable, Subject, takeUntil, tap } from "rxjs";
import { AudioService } from "../../services/audio.service";

/**
 * Standalone component to display the Audio Spectre.
 *
 * ---
 *
 * The spectre is computed by the Analyser node inside the service, in the form of an unsigned bit array.
 *
 * The component simply get the attribute and draw the fft canvas every tick.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'm-audiospectre',
  templateUrl: './audiospectre.component.html',
  styleUrls: ['./audiospectre.component.scss'],
})
export class AudioSpectreComponent implements OnInit, OnDestroy {

  isDead$ = new Subject<boolean>();

  readonly playerExpanded$: Observable<boolean>;

  @ViewChild('canvas', { static: true })
  canvas: ElementRef<HTMLCanvasElement> | null = null;

  private _currentRoute;

  private _bars = 0;
  private _height = 0;

  private _dataArray: Uint8Array;

  private _animationFrameId = 0;

  constructor(
    private _router: Router,
    private _audioService: AudioService,
    private zone: NgZone
  ) {
    this._dataArray = new Uint8Array(this._audioService.analyser.frequencyBinCount);
    this._currentRoute = this._router.url;

    this.playerExpanded$ = this._audioService.playerExpanded$;
  }

  ngOnInit(): void {

    this._router.events
      .pipe(
        takeUntil(this.isDead$),
        filter((event: any) => event instanceof NavigationEnd),
        tap((event: NavigationEnd) => {
          this._currentRoute = event.url;
          this._onResize();
        })
      )
      .subscribe();

    if(this.canvas) {
      const ctx: CanvasRenderingContext2D | null = this.canvas.nativeElement.getContext('2d');

      this._onResize();

      if(ctx) {

        this.zone.runOutsideAngular(() => {
          const tick = () => {
            this._audioService.analyser.getByteFrequencyData(this._dataArray); // Fills array with instant fft.

            if(this._dataArray.some(data => data > 0)) {
              this._draw(ctx, this._dataArray);

            }
            this._animationFrameId = requestAnimationFrame(tick); // Triggers other repaints.
          }
          // Starts the animation.
          this._animationFrameId = requestAnimationFrame(tick);
        });
      }
    }
  }

  private _draw(ctx: CanvasRenderingContext2D, data: Uint8Array | null) {

    if(this.canvas) {

      const height = this.canvas.nativeElement.height;
      const width = this.canvas.nativeElement.width;

      ctx.clearRect(0, 0, width, height);

      if(data) {
        // Recreate the color each time to account for canvas resize
        // Creates the bar color.
        const gradient = ctx.createLinearGradient(0, 0, 0, height);

        gradient.addColorStop(1, '#ac1d92');
        gradient.addColorStop(0.65, '#ffa5ac');
        gradient.addColorStop(0.36, '#ffe8a8');
        gradient.addColorStop(0.22, '#fac4f2');
        gradient.addColorStop(0, '#ffffff');

        /*gradient.addColorStop(1, '#290040');
        gradient.addColorStop(0.65, '#ffa5ac');
        gradient.addColorStop(0.22, '#fac4f2');
        gradient.addColorStop(0, '#ffffff');*/


        /*gradient.addColorStop(1, '#ffda51');
        gradient.addColorStop(0.64, '#9e24a3');
        gradient.addColorStop(0, '#290040');*/

        ctx.fillStyle = gradient;

        /*
        Now we set our barWidth to be equal to the canvas width divided by the number of bars (the buffer length).
        However, we are also multiplying that width by 2.5, because most of the frequencies will come back
        as having no audio in them, as most of the sounds we hear every day are in a certain lower frequency range.

        We don't want to display loads of empty bars, therefore we simply shift the ones that will display
        regularly at a noticeable height across so they fill the canvas display.
        */

        // take the first 100 values

        const barWidth = width / (this._bars * 2) - 1;
        //const barWidth = width / 100;

        let x = 0;

        // The limit in display of the bars is due to the saturation of the data, encoded on 1024 points

        // for (const item of audioData) {
        for (let i = 0; i <= this._bars; i++) {

          const barHeight = Math.floor(data[i] * height / 256);

          ctx.fillRect(width / 2 - x, height, barWidth, -barHeight);

          ctx.fillRect(width / 2 + x, height, barWidth, -barHeight);

          x += barWidth + 1;
        }
      }
    }
  }

  @HostListener("window:resize", ["$event"])
  private _onResize() {
    if(this.canvas) {
      // Runtime media queries equivalent for resolutions.
      if(window.innerWidth > 1300) {
        this._bars = 60;

      } else if(window.innerWidth > 1080) {
        this._bars = 50;

      } else if(window.innerWidth > 600) {
        this._bars = 30;

      } else if(window.innerWidth > 450) {
        this._bars = 20;

      } else {
        this._bars = 14;
      }

      // Full
      if(this._currentRoute.includes('title')) {

        if(window.innerWidth > 1100) {
          this._height = 200;
        } else if(window.innerWidth > 600) {
          this._height = 230;
        } else {
          this._height = 260;
        }

      } else {
        if(window.innerWidth > 600) {
          this._height = 120;
        } else {
          this._height = 180;
        }
      }

      this.canvas.nativeElement.width = window.innerWidth;
      this.canvas.nativeElement.height = this._height;
    }
  }

  ngOnDestroy(): void {
    this.isDead$.next(true);
    cancelAnimationFrame(this._animationFrameId);
  }
}

// ------------------------------------------------------------------------------------------------------------------------ //

@NgModule({
  declarations: [AudioSpectreComponent],
  exports: [AudioSpectreComponent],
  imports: [
    CommonModule
  ]
})
export class AudioSpectreModule {}

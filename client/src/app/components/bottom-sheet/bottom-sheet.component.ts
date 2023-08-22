import { ChangeDetectionStrategy, Component, NgModule } from "@angular/core";
import { SettingsModule } from "../settings-menu/settings-menu.component";

/**
 * Layout component to hold the settings menu in a bottom dialog.
 *
 * ---
 *
 * The menu is held on a dialog fixed to the bottom of the screen.
 * This component only processes display, transitions and animations.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'm-bottom-sheet',
  templateUrl: './bottom-sheet.component.html',
  styleUrls: ['./bottom-sheet.component.scss']
})
export class BottomSheetComponent {}

// ------------------------------------------------------------------------------------------------------------------------ //

@NgModule({
  declarations: [BottomSheetComponent],
  exports: [BottomSheetComponent],
  imports: [
    SettingsModule
  ]
})
export class BottomSheetModule {}

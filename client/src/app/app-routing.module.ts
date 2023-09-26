import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { PlaylistComponent } from './components/playlist/playlist.component';
import { PlaylistsComponent } from './components/playlists/playlists.component';
import { TitleViewComponent } from './components/titleview/titleview.component';

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'playlists',
    component: PlaylistsComponent
  },
  {
    path: 'playlist/:id',
    component: PlaylistComponent
  },
  {
    path: 'title/:id',
    component: TitleViewComponent
  },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', component: HomeComponent } // Wildcard Route : matches any other route that doesn't exists in the application and redirects to the homepage.
];

// ------------------------------------------------------------------------------------------------------------------------ //

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {}

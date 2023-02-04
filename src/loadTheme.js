/**
 * On bootstrap, sets the current theme before css loads, by assigning a data attribute to the html tag.
 *
 * Theme is persisted through sessions.
 */
(function() {
  if(localStorage.getItem('theme')) {
     document.documentElement.setAttribute('data-theme', localStorage.getItem('theme'));

  } else {
    document.documentElement.setAttribute('data-theme', 'default');
    localStorage.setItem('theme', 'default');
  }
})();

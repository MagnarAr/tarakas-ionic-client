import {Component} from '@angular/core';

import {HomePage} from '../home/home';
import {SettingsPage} from '../settings/settings';
import {HelpPage} from '../help/help';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any = HomePage;
  tab2Root: any = HelpPage;
  tab3Root: any = SettingsPage;

  constructor() {

  }
}

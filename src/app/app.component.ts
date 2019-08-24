import {Component} from '@angular/core';
import {Platform} from 'ionic-angular';
import {SplashScreen} from '@ionic-native/splash-screen';
import {StatusBar} from '@ionic-native/status-bar';

import {TabsPage} from '../pages/tabs/tabs';
import {TranslateService} from '@ngx-translate/core'


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage = TabsPage;

  constructor(platform: Platform, private translate: TranslateService, private splashScreen: SplashScreen, private statusBar: StatusBar) {
    this.initTranslationSettings();

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  private initTranslationSettings() {
    let fallbackLanguage = 'et'; // change to 'en' to test english right now
    let userLang = navigator.language.split('-')[0]; // use navigator lang if available
    userLang = /(et)/gi.test(userLang) ? userLang : fallbackLanguage;

    // this language will be used as a fallback when a translation isn't found in the current language
    this.translate.setDefaultLang(fallbackLanguage);

    // the lang to use, if the lang isn't available, it will use the current loader to get them
    this.translate.use(userLang);
  }
}

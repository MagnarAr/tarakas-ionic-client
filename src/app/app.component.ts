import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { TranslateService } from '@ngx-translate/core'


@Component({
  selector: 'tarakas-app',
  templateUrl: 'app.html'
})
export class TarakasApplication {

  constructor(private platform: Platform,
              private translate: TranslateService,
              private splashScreen: SplashScreen,
              private statusBar: StatusBar) {
    this.initTranslationSettings();

    this.platform.ready().then(() => {
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

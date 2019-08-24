import {NgModule, ErrorHandler, LOCALE_ID} from '@angular/core';
import {IonicStorageModule, Storage} from '@ionic/storage';
import {IonicApp, IonicModule, IonicErrorHandler} from 'ionic-angular';
import {MyApp} from './app.component';
import {SettingsPage} from '../pages/settings/settings';
import {HelpPage} from '../pages/help/help';
import {HomePage} from '../pages/home/home';
import {TabsPage} from '../pages/tabs/tabs';
import {AddNewGoalComponent} from "../pages/goals/add-new-goal.component";
import {Http, HttpModule} from "@angular/http";
import {BrowserModule} from '@angular/platform-browser';
import {GoalDetailsPage} from "../pages/goals/goal-details";
import {UserSession} from "../providers/user-session";
import {LoginComponent} from "../pages/login/login";
import {AuthService} from "../providers/auth-service";
import {AuthHttp, AuthConfig} from "angular2-jwt";
import {GoalService} from "../providers/goal-service";
import {ProtectedComponent} from "../components/protected.component";
import {PriceLabelDirective} from "../components/price-label";
import {CardGoalDirective} from "../components/card-goal";
import {EuroColumnDirective} from "../components/euro-column.component";
import {SplashScreen} from "@ionic-native/splash-screen";
import {StatusBar} from "@ionic-native/status-bar";
import {Camera} from "@ionic-native/camera";
import {SocialSharing} from "@ionic-native/social-sharing";
import {TranslateLoader, TranslateModule, TranslateService} from "@ngx-translate/core";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";

let storage = new Storage({});

export function getAuthHttp(http) {
  return new AuthHttp(new AuthConfig({
    headerPrefix: "Bearer",
    headerName: "X-Authorization",
    globalHeaders: [{'Accept': 'application/json'}],
    tokenGetter: (() => storage.get('token')),
  }), http);
}

export function HttpLoaderFactory(http: Http) {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    MyApp,
    ProtectedComponent,
    SettingsPage,
    HelpPage,
    HomePage,
    TabsPage,
    AddNewGoalComponent,
    GoalDetailsPage,
    LoginComponent,
    PriceLabelDirective,
    CardGoalDirective,
    EuroColumnDirective
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [Http]
      }
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ProtectedComponent,
    SettingsPage,
    HelpPage,
    HomePage,
    TabsPage,
    AddNewGoalComponent,
    GoalDetailsPage,
    LoginComponent
  ],
  providers: [
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    {provide: AuthHttp, useFactory: getAuthHttp, deps: [Http]},
    {provide: LOCALE_ID, useValue: 'et-EE'},
    SplashScreen,
    StatusBar,
    SocialSharing,
    Camera,
    TranslateService,
    UserSession,
    AuthService,
    GoalService
  ]
})
export class AppModule {
}

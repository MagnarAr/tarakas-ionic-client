import {NgModule, LOCALE_ID} from '@angular/core';
import {IonicStorageModule, Storage} from '@ionic/storage';
import {IonicModule, IonicRouteStrategy} from '@ionic/angular';
import {TarakasApplication} from './app.component';
import {BrowserModule} from '@angular/platform-browser';
import {LoginComponent} from "./login/login";
import {TranslateLoader, TranslateModule, TranslateService} from "@ngx-translate/core";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {Camera} from "@ionic-native/camera/ngx";
import {SplashScreen} from "@ionic-native/splash-screen/ngx";
import {StatusBar} from "@ionic-native/status-bar/ngx";
import {SocialSharing} from "@ionic-native/social-sharing/ngx";
import {JWT_OPTIONS, JwtModule} from "@auth0/angular-jwt";
import {RouteReuseStrategy} from "@angular/router";
import {AppRoutingModule} from "./app-routing.module";
import {ReactiveFormsModule} from "@angular/forms";
import {registerLocaleData} from "@angular/common";
import localeET from '@angular/common/locales/et';

export function jwtOptionsFactory(storage) {
  return {
    tokenGetter: () => {
      return storage.get('token');
    },
    headerName: 'X-Authorization',
    whitelistedDomains: ['localhost:9000']
  }
}

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

registerLocaleData(localeET);

@NgModule({
  declarations: [
    TarakasApplication,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    IonicModule.forRoot(),
    IonicStorageModule.forRoot(),
    AppRoutingModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: jwtOptionsFactory,
        deps: [Storage]
      }
    })
  ],
  entryComponents: [],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: LOCALE_ID, useValue: 'et-EE' },
    SplashScreen,
    StatusBar,
    SocialSharing,
    Camera,
    TranslateService
  ],
  bootstrap: [TarakasApplication]
})
export class AppModule {
}

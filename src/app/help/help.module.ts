import {NgModule} from "@angular/core";
import {IonicModule} from "@ionic/angular";
import {RouterModule} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";
import {HelpPage} from "./help";

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        TranslateModule,
        RouterModule.forChild([{ path: '', component: HelpPage }])
    ],
    declarations: [
        HelpPage
    ]
})
export class HelpModule {}

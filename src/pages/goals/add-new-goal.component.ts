import {Component} from "@angular/core";
import {ViewController, App} from "ionic-angular";
import {Camera} from "@ionic-native/camera";
import {Validators, FormBuilder, FormGroup} from '@angular/forms';
import {ProtectedComponent} from "../../components/protected.component";
import {AuthService} from "../../providers/auth-service";
import {GoalService} from "../../providers/goal-service";
import {PriceValidator} from "../../components/validators/price-validator";

@Component({
  selector: 'add-new-goal',
  templateUrl: 'add-new-goal.html'
})
export class AddNewGoalComponent extends ProtectedComponent {

  formData: FormGroup;
  public imageSource: string;

  constructor(public goalService: GoalService, public viewCtrl: ViewController, private camera: Camera,
              private formBuilder: FormBuilder, public authService: AuthService, public _app: App) {
    super(authService, _app);
    this.formData = this.formBuilder.group({
      name: ['', [Validators.required]],
      price: [null, [PriceValidator.isValid, Validators.required]],
      imageSource: [''],
      collectedAmount: [0]
    });
  }

  saveGoal() {
    this.goalService.saveNewGoal(this.formData.value)
      .subscribe((result) => this.viewCtrl.dismiss().catch(() => {
      }));
    //this.viewCtrl.dismiss(newGoal);
  }

  public dismiss() {
    this.viewCtrl.dismiss().catch(() => {
    });
  }

  public takePicture() {
    this.camera.getPicture({
      quality: 80,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.CAMERA,
      allowEdit: true,
      encodingType: this.camera.EncodingType.JPEG,
      targetWidth: 300,
      targetHeight: 300,
      saveToPhotoAlbum: false
    }).then(imageData => {
      this.formData.value.imageSource = imageData;
    }, error => {
      console.log("ERROR -> " + JSON.stringify(error));
    });
  }
}

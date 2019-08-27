import { Component } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { Camera } from "@ionic-native/camera/ngx";
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { GoalService } from "../services/goal-service";
import { PriceValidator } from "../validators/price-validator";

@Component({
  selector: 'add-new-goal',
  templateUrl: './add-new-goal.html',
  styleUrls: ['./add-new-goal.scss']
})
export class AddNewGoalComponent {

  formData: FormGroup;

  constructor(private goalService: GoalService,
              private viewCtrl: ModalController,
              private camera: Camera,
              private formBuilder: FormBuilder) {
    this.formData = this.formBuilder.group({
      name: ['', [Validators.required]],
      price: [null, [PriceValidator.isValid, Validators.required]],
      imageSource: [''],
      collectedAmount: [0]
    });
  }

  saveGoal() {
    this.goalService.saveNewGoal(this.formData.value)
      .subscribe(() => this.viewCtrl.dismiss(), () => this.viewCtrl.dismiss());
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
      this.formData.controls['imageSource'].setValue(imageData);
    }, error => {
      console.log("ERROR -> " + JSON.stringify(error));
    });
  }
}

import {AbstractControl, FormGroup} from '@angular/forms';
import * as moment from 'moment';
// validation number
export function numberValidator(control: AbstractControl): { [key: string]: any } | null {
  const valid = /^\d+$/.test(control.value);
  return valid ? null : {invalidNumber: {valid: false, value: control.value}};
}

// validation input message error
export function validationErrorMessagesService(form: FormGroup, validationErrorMessages: any, formErrors: any) {
  Object.keys(form.controls).forEach((key: string) => {
    const abstractControl = form.get(key);
    formErrors[key] = '';
    if (abstractControl && !abstractControl.valid && (abstractControl.touched || abstractControl.dirty)) {
      const message = validationErrorMessages[key];
      for (const errorKey in abstractControl.errors) {
        if (errorKey) {
          formErrors[key] += message[errorKey] + '';
        }
      }
    }
    if (abstractControl instanceof FormGroup) {
      validationErrorMessages(abstractControl);
    }
  });
}
// validation input message error
export function validationAllErrorMessagesService(form: FormGroup, validationErrorMessages: any, formErrors: any) {
  Object.keys(form.controls).forEach((key: string) => {
    const abstractControl = form.get(key);
    formErrors[key] = '';
    if (abstractControl && !abstractControl.valid) {
      const message = validationErrorMessages[key];
      for (const errorKey in abstractControl.errors) {
        if (errorKey) {
          formErrors[key] += message[errorKey] + '';
        }
      }
    }
    if (abstractControl instanceof FormGroup) {
      validationErrorMessages(abstractControl);
    }
  });
}
// display fields css
export function displayFieldCssService(field: string) {
  return {
    'has-error': field,
    'has-feedback': field
  };
}


export class ValidatorToaDoService {
  public errorX = '';
  public errorY = '';
  public errorSrid = '';
  public errorKieuToaDo = '';
  public submit = false;
  constructor() {}

  public resetValidatorToaDo() {
    this.errorX = '';
    this.errorY = '';
    this.errorSrid = '';
    this.errorKieuToaDo = '';
    this.submit = false;
  }
  public validatorToaDo(form: FormGroup) {
    this.resetValidatorToaDo();

    if ((!form.value.toadox === true) && (!form.value.toadoy === true)) {
      if (form.valid === true) this.submit = true;
    } else {
      if ((!form.value.toadox === true) || (!form.value.toadoy === true) || (!form.value.srid === true)) {
        (!form.value.toadox === true) ? this.errorX = "Bạn phải nhập tọa độ x" : this.errorX = "";
        (!form.value.toadoy === true) ? this.errorY = "Bạn phải nhập tọa độ y" : this.errorY = "";
        (!form.value.srid === true) ? this.errorSrid = "Bạn phải chọn srid" : this.errorSrid = "";
        (!form.value.kieutoado === true) ? this.errorKieuToaDo = "Bạn phải chọn kiểu tọa độ" : this.errorKieuToaDo = "";
      } else {
        if (form.valid === true) this.submit = true;
      }
    }
    if (form.value.kieutoado === 'xy') {
      if ((!form.value.toadox === true) && (!form.value.toadoy === true)) {
        if (form.valid === true) this.submit = true;
      } else {
        if ((!form.value.toadox === true) || (!form.value.toadoy === true)
          || (!form.value.srid === true)) {
          (!form.value.toadox === true) ? this.errorX = "Bạn phải nhập tọa độ x" : this.errorX = "";
          (!form.value.toadoy === true) ? this.errorY = "Bạn phải nhập tọa độ y" : this.errorY = "";
          (!form.value.srid === true) ? this.errorSrid = "Bạn phải chọn srid" : this.errorSrid = "";
          (!form.value.kieutoado === true) ? this.errorKieuToaDo = "Bạn phải chọn kiểu tọa độ" : this.errorKieuToaDo = "";
        } else {
          if (form.valid === true) this.submit = true;
        }
      }
    } else if (form.value.kieutoado === 'latlng') {
      if ((!form.value.toadox === true) && (!form.value.toadoy === true)) {
        if (form.valid === true) this.submit = true;
      } else {
        if ((!form.value.toadox === true) || (!form.value.toadoy === true)) {
          (!form.value.toadox === true) ? this.errorX = "Bạn phải nhập latitude" : this.errorX = "";
          (!form.value.toadoy === true) ? this.errorY = "Bạn phải nhập longitude" : this.errorY = "";
          (!form.value.srid === true) ? this.errorSrid = "Bạn phải chọn srid" : this.errorSrid = "";
          (!form.value.kieutoado === true) ? this.errorKieuToaDo = "Bạn phải chọn kiểu tọa độ" : this.errorKieuToaDo = "";
        } else {
          if (form.valid === true) this.submit = true;
        }
      }
    }
  }
}

/**
 * Validator thời gian bắt đầu và thời gian kết thúc nhập trả ra lỗi
 * @param firstDate
 * @param lastDate
 */
export function  validatorFullTime(firstDate, lastDate) {
  let errorTimeFromTo = '';
  if (!firstDate === true || !lastDate === true) {
    errorTimeFromTo = 'Hãy nhập đầy đủ thông tin';
  } else {
    if (firstDate.length !== lastDate.length) {
      errorTimeFromTo = 'Hãy nhập cùng kiểu định dạng của ngày bắt đầu và ngày kết thúc';
    } else{
      if  (!checkFullTime(firstDate)) {
        errorTimeFromTo = 'Hãy nhập đúng kiểu định dạng của ngày bắt đầu';
      } else {
        if  (!checkFullTime(lastDate)) {
          errorTimeFromTo = 'Hãy nhập đúng kiểu định dạng của ngày kết thúc';
        }
      }
    }
  }
  return errorTimeFromTo;
}

/**
 * Check một chuỗi string có phải kiểu date hay không
 * @param fulltime
 */
function checkFullTime(fulltime) {
  if  ((moment(fulltime, 'DD/MM/YYYY', true).isValid() === false) &&
    (moment(fulltime, 'MM/YYYY', true).isValid() === false) &&
    (moment(fulltime, 'YYYY', true).isValid() === false) &&
    (moment(fulltime, 'DD/MM/YYYY HH:mm:ss', true).isValid() === false) &&
    (moment(fulltime, 'DD-MM-YYYY', true).isValid() === false) &&
    (moment(fulltime, 'MM-YYYY', true).isValid() === false) &&
    (moment(fulltime, 'YYYY', true).isValid() === false) &&
    (moment(fulltime, 'DD-MM-YYYY HH:mm:ss', true).isValid() === false)) {
    return false;
  }
  return true;
}

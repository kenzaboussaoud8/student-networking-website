import { FormControl } from '@angular/forms';

export class AgeValidator {
    static isValid(control: FormControl): any {
        console.log(control.value);
        var birthdate = new Date(control.value+'T00:00:00');
        var ageDifMs = Date.now() - birthdate.getTime();
        var ageDate = new Date(ageDifMs); // miliseconds from epoch
        console.log(Math.abs(ageDate.getUTCFullYear() - 1970));
        if (Math.abs(ageDate.getUTCFullYear() - 1970) >= 18){ return null; }
        return {"notOldEnough": true};
    }
}
export default class Staff{
    constructor(firstName,lastName,joinedDate,designation,gender,dob,addressLine01,addressLine02,addressLine03,addressLine04,addressLine05,contactNo,emailStaff,roleStaff,fieldList,vehicleList,equipmentList) {
        this._firstName = firstName;
        this._lastName = lastName;
        this._joinedDate = joinedDate;
        this._designation = designation;
        this._gender = gender;
        this._dob = dob;
        this._addressLine01 = addressLine01;
        this._addressLine02 = addressLine02;
        this._addressLine03 = addressLine03;
        this._addressLine04 = addressLine04;
        this._addressLine05 = addressLine05;
        this._contactNo = contactNo;
        this._emailStaff = emailStaff;
        this._roleStaff = roleStaff;
        this._fieldList = fieldList;
        this._vehicleList = vehicleList;
        this._equipmentList = equipmentList;
    }


    get firstName() {
        return this._firstName;
    }

    set firstName(value) {
        this._firstName = value;
    }

    get lastName() {
        return this._lastName;
    }

    set lastName(value) {
        this._lastName = value;
    }

    get joinedDate() {
        return this._joinedDate;
    }

    set joinedDate(value) {
        this._joinedDate = value;
    }

    get designation() {
        return this._designation;
    }

    set designation(value) {
        this._designation = value;
    }

    get gender() {
        return this._gender;
    }

    set gender(value) {
        this._gender = value;
    }

    get dob() {
        return this._dob;
    }

    set dob(value) {
        this._dob = value;
    }

    get addressLine01() {
        return this._addressLine01;
    }

    set addressLine01(value) {
        this._addressLine01 = value;
    }

    get addressLine02() {
        return this._addressLine02;
    }

    set addressLine02(value) {
        this._addressLine02 = value;
    }

    get addressLine03() {
        return this._addressLine03;
    }

    set addressLine03(value) {
        this._addressLine03 = value;
    }

    get addressLine04() {
        return this._addressLine04;
    }

    set addressLine04(value) {
        this._addressLine04 = value;
    }

    get addressLine05() {
        return this._addressLine05;
    }

    set addressLine05(value) {
        this._addressLine05 = value;
    }

    get contactNo() {
        return this._contactNo;
    }

    set contactNo(value) {
        this._contactNo = value;
    }

    get emailStaff() {
        return this._emailStaff;
    }

    set emailStaff(value) {
        this._emailStaff = value;
    }

    get roleStaff() {
        return this._roleStaff;
    }

    set roleStaff(value) {
        this._roleStaff = value;
    }

    get fieldList() {
        return this._fieldList;
    }

    set fieldList(value) {
        this._fieldList = value;
    }

    get vehicleList() {
        return this._vehicleList;
    }

    set vehicleList(value) {
        this._vehicleList = value;
    }

    get equipmentList() {
        return this._equipmentList;
    }

    set equipmentList(value) {
        this._equipmentList = value;
    }
}
export default class Equipment{
    constructor(name,type,status,count,assignStaff,assignField) {
        this._name = name;
        this._type = type;
        this._status = status;
        this._count = count;
        this._assignStaff = assignStaff;
        this._assignField = assignField;
    }


    get name() {
        return this._name;
    }

    set name(value) {
        this._name = value;
    }

    get type() {
        return this._type;
    }

    set type(value) {
        this._type = value;
    }

    get status() {
        return this._status;
    }

    set status(value) {
        this._status = value;
    }

    get count() {
        return this._count;
    }

    set count(value) {
        this._count = value;
    }

    get assignStaff() {
        return this._assignStaff;
    }

    set assignStaff(value) {
        this._assignStaff = value;
    }

    get assignField() {
        return this._assignField;
    }

    set assignField(value) {
        this._assignField = value;
    }
}
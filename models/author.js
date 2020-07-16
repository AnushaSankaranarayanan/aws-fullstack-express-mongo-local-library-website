var mongoose = require('mongoose');
var moment = require('moment')
var Schema = mongoose.Schema;

var AuthorSchema = new Schema(
    {
        first_name: { type: String, require: true, maxlength: 100 },
        family_name: { type: String, require: true, maxlength: 100 },
        date_of_birth: { type: Date },
        date_of_death: { type: Date },
    }

);

AuthorSchema.virtual('name')
    .get(function () {
        // To avoid errors in cases where an author does not have either a family name or first name
        // We want to make sure we handle the exception by returning an empty string for that case
        var fullName = '';
        if (this.first_name && this.family_name) {
            fullName = this.first_name + ', ' + this.family_name;
        }
        return fullName
    });


AuthorSchema.virtual('lifespan')
    .get(function () {
        var lifespan = ''
        if(this.date_of_birth && this.date_of_death){
            lifespan = this.dob_formatted + ' - ' + this.dod_formatted;
        }
        else if (this.date_of_birth && !this.date_of_death){
            lifespan = this.dob_formatted
        }
        return lifespan
    });

AuthorSchema.virtual('url')
    .get(function () {
        return '/catalog/author/' + this._id
    }
    );

AuthorSchema.virtual('dob_formatted')
    .get(function () {
        return this.date_of_birth ? moment(this.date_of_birth).format('MMMM Do, YYYY') : '';
    }
    );

AuthorSchema.virtual('dod_formatted')
    .get(function () {
        return this.date_of_death ? moment(this.date_of_death).format('MMMM Do, YYYY') : '';
    }
    );

module.exports = mongoose.model('Author', AuthorSchema);
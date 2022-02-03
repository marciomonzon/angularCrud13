import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApiService } from '../shared/api.service';
import { StudentModel } from './student-dash.model';

@Component({
  selector: 'app-student-dash',
  templateUrl: './student-dash.component.html',
  styleUrls: ['./student-dash.component.css']
})
export class StudentDashComponent implements OnInit {

  idStudentAux!: number;
  fromValue!: FormGroup;
  studentModelObj: StudentModel = new StudentModel;
  studentData!: any;
  showAdd!: boolean;
  showUpdate!: boolean;

  constructor(private formBuilder: FormBuilder, private api: ApiService) { }

  ngOnInit(): void {
    this.fromValue = this.formBuilder.group({
      name:[''],
      email:[''],
      mobile:[''],
      fees:['']
    })
    this.getAllStudents();
  }

  clickAddStudent() {
    this.fromValue.reset();
    this.showAdd = true;
    this.showUpdate = false;
  }

  clickUpdateStudent() {
    this.showAdd = false;
    this.showUpdate = true;
  }

  closeModalAndUpdateTable() {
    let ref = document.getElementById("cancel")
    ref?.click();
    this.fromValue.reset();
    this.getAllStudents();
  }

  populateModelObj() {
    this.studentModelObj.name = this.fromValue.value.name;
    this.studentModelObj.email = this.fromValue.value.email;
    this.studentModelObj.mobile = this.fromValue.value.mobile;
    this.studentModelObj.fees = this.fromValue.value.fees;
  }

  postStudentDetails() {
    this.populateModelObj()
    console.log(this.studentModelObj);
    this.api.postStudent(this.studentModelObj).subscribe(res => {
      alert("Student Record Added Successfully")
      this.closeModalAndUpdateTable()
    },
    err => {
      alert("Something went wrong! Please check again")
    })
  }

  getAllStudents() {
    this.api.getStudents().subscribe(res => {
      this.studentData = res;
    })
  }

  deleteStudent(stu: any) {
    this.api.deleteStudent(stu.id).subscribe(res => {
      alert("student record deleted")
      this.getAllStudents();
    })
  }

  onEdit(stu:any) {
    this.clickUpdateStudent();
    this.idStudentAux = stu.id;
    this.fromValue.controls['name'].setValue(stu.name);
    this.fromValue.controls['email'].setValue(stu.email);
    this.fromValue.controls['mobile'].setValue(stu.mobile);
    this.fromValue.controls['fees'].setValue(stu.fees);
  }

  updateStudent() {
    this.populateModelObj()

    this.api.updateStudent(this.studentModelObj, this.idStudentAux)
    .subscribe(res => {
      alert("student record updated!")
      this.closeModalAndUpdateTable()
    })
  }

}
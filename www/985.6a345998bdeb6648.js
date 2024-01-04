"use strict";(self.webpackChunkCVCFrontEnd=self.webpackChunkCVCFrontEnd||[]).push([[985],{2985:(N,h,d)=>{d.r(h),d.d(h,{CompanyInformationModule:()=>M});var p=d(8692),o=d(92),y=d(3580);class m{}var e=d(4537),c=d(3817),g=d(6362),u=d(7253);function f(l,s){if(1&l&&(e.TgZ(0,"option",35),e._uU(1),e.qZA()),2&l){const a=s.$implicit;e.s9C("value",a.value),e.xp6(1),e.hij(" ",a.text," ")}}let _=(()=>{class l{constructor(a,r,n,i,t){this.companyService=a,this.popupService=r,this.auth=n,this.cdr=i,this.formBuilder=t,this.email="",this.companyProfile=new m,this.cd=i,this.currentUsername=this.auth.currentUser,this.email=this.currentUsername.userId,this.createForm(),this.cd.markForCheck()}ngOnInit(){this.getCompanyProfile(this.email),this.cd.markForCheck()}createForm(){this.profileForm=this.formBuilder.group({name:["",[o.kI.required]],contact_FirstName:["",[o.kI.required]],contact_LastName:["",[o.kI.required]],contact_Phone:["",[o.kI.required]],nationality:["",[o.kI.required]],email:["",[o.kI.required]],business_Type:["",[o.kI.required]],total_Asset:["",[o.kI.required]],rC_Number:["",[o.kI.required]],tin_Number:["",[o.kI.required]],no_Staff:["",[o.kI.required]],year_Incorporated:["",[o.kI.required]],yearly_Revenue:["",[o.kI.required]],no_Expatriate:["",[o.kI.required]]})}getCompanyProfile(a){this.companyService.getCompanyProfile(a).subscribe({next:r=>{this.companyProfile=r.data.company,this.countries=r.data.nations,console.log(this.companyProfile),this.countries.filter(n=>{if(n.text==this.companyProfile.nationality)return this.currentValue={value:n.value,text:n.text},n.value}),this.cd.markForCheck()}})}save(){const a=this.profileForm.value;a.nationality==this.currentValue.text&&(a.nationality=this.currentValue.value),console.log(a),this.companyService.saveCompanyProfile(a).subscribe({next:r=>{this.popupService.open("Record updated successfully","success")},error:r=>{console.log(r),this.popupService.open(r?.error,"error")}})}static#e=this.\u0275fac=function(r){return new(r||l)(e.Y36(c.J),e.Y36(g.q),e.Y36(u.$),e.Y36(e.sBO),e.Y36(o.qu))};static#n=this.\u0275cmp=e.Xpm({type:l,selectors:[["ng-component"]],decls:79,vars:17,consts:[[1,"max-w-screen-lg","mx-auto","mt-8"],[1,"font-semibold","text-xl","text-gray-600"],[1,"text-gray-500","mb-6"],[1,"bg-white","rounded","shadow-lg","px-4","md:p-8","mb-6",3,"formGroup"],[1,"lg:col-span-2"],[1,"grid","gap-4","gap-y-2","text-sm","grid-cols-1","md:grid-cols-7"],[1,"md:col-span-3"],["for","zipcode"],[1,"h-10","bg-gray-50","flex","border","border-gray-200","rounded","items-center","mt-1"],["type","text","formControlName","name","id","name","placeholder","",1,"px-2","appearance-none","outline-none","text-gray-800","w-full","bg-transparent",3,"ngModel","ngModelChange"],[1,"md:col-span-2"],["type","text","formControlName","business_Type","id","business_Type","placeholder","",1,"px-2","appearance-none","outline-none","text-gray-800","w-full","bg-transparent",3,"ngModel","ngModelChange"],["type","text","formControlName","email","id","email","placeholder","",1,"px-2","appearance-none","outline-none","text-gray-800","w-full","bg-transparent",3,"ngModel","ngModelChange"],[1,"md:col-span-4"],["for","address_1"],["formControlName","contact_FirstName","id","contact_FirstName","placeholder","",1,"px-2","appearance-none","outline-none","text-gray-800","w-full","bg-transparent",3,"ngModel","ngModelChange"],["for","state"],["formControlName","contact_Phone","id","contact_Phone","placeholder","",1,"px-2","appearance-none","outline-none","text-gray-800","w-full","bg-transparent",3,"ngModel","ngModelChange"],["for","city"],["type","text","formControlName","rC_Number","id","rC_Number","placeholder","",1,"h-10","border","mt-1","rounded","px-2","w-full","bg-gray-50",3,"ngModel","ngModelChange"],["for","address"],["type","text","formControlName","tin_Number","id","tin_Number","placeholder","",1,"h-10","border","mt-1","rounded","px-2","w-full","bg-gray-50",3,"ngModel","ngModelChange"],[1,"md:col-span-1"],["type","text","formControlName","year_Incorporated","id","year_Incorporated","placeholder","",1,"h-10","border","mt-1","rounded","px-2","w-full","bg-gray-50",3,"ngModel","ngModelChange"],["for","country"],["formControlName","nationality","id","countryName","placeholder","",1,"px-1","appearance-none","outline-none","text-gray-800","w-full","bg-transparent",3,"ngModel"],["selected","",3,"value"],[3,"value",4,"ngFor","ngForOf"],["type","text","formControlName","total_Asset","id","total_Asset","placeholder","",1,"h-10","border","mt-1","rounded","px-2","w-full","bg-gray-50",3,"ngModel","ngModelChange"],["type","text","formControlName","no_Staff","id","no_Staff","placeholder","",1,"h-10","border","mt-1","rounded","px-2","w-full","bg-gray-50",3,"ngModel","ngModelChange"],["type","text","formControlName","yearly_Revenue","id","yearly_Revenue","placeholder","",1,"h-10","border","mt-1","rounded","px-2","w-full","bg-gray-50",3,"ngModel","ngModelChange"],["type","text","formControlName","no_Expatriate","id","no_Expatriate","placeholder","",1,"h-10","border","mt-1","rounded","px-2","w-full","bg-gray-50",3,"ngModel","ngModelChange"],[1,"md:col-span-7","text-right"],[1,"inline-flex","items-end"],[1,"bg-green-800","hover:bg-green-900","text-white","font-bold","py-2","px-4","rounded",3,"click"],[3,"value"]],template:function(r,n){1&r&&(e.TgZ(0,"div",0)(1,"div")(2,"h2",1),e._uU(3,"Company Profile"),e.qZA(),e.TgZ(4,"p",2),e._uU(5,"Complete the company profile information."),e.qZA(),e.TgZ(6,"div",3)(7,"div",4)(8,"div",5)(9,"div",6)(10,"label",7),e._uU(11,"Company Name"),e.qZA(),e.TgZ(12,"div",8)(13,"input",9),e.NdJ("ngModelChange",function(t){return n.companyProfile.name=t}),e.qZA()()(),e.TgZ(14,"div",10)(15,"label",7),e._uU(16,"Business Type"),e.qZA(),e.TgZ(17,"div",8)(18,"input",11),e.NdJ("ngModelChange",function(t){return n.companyProfile.business_Type=t}),e.qZA()()(),e.TgZ(19,"div",10)(20,"label",7),e._uU(21,"Company Email"),e.qZA(),e.TgZ(22,"div",8)(23,"input",12),e.NdJ("ngModelChange",function(t){return n.companyProfile.user_Id=t}),e.qZA()()(),e.TgZ(24,"div",13)(25,"label",14),e._uU(26,"Contact Person's First Name"),e.qZA(),e.TgZ(27,"div",8)(28,"input",15),e.NdJ("ngModelChange",function(t){return n.companyProfile.contact_FirstName=t}),e.qZA()()(),e.TgZ(29,"div",6)(30,"label",16),e._uU(31,"Contact Person's Telephone"),e.qZA(),e.TgZ(32,"div",8)(33,"input",17),e.NdJ("ngModelChange",function(t){return n.companyProfile.contact_Phone=t}),e.qZA()()(),e.TgZ(34,"div",10)(35,"label",18),e._uU(36,"Registration Number"),e.qZA(),e.TgZ(37,"input",19),e.NdJ("ngModelChange",function(t){return n.companyProfile.rC_Number=t}),e.qZA()(),e.TgZ(38,"div",10)(39,"label",20),e._uU(40,"TIN Number"),e.qZA(),e.TgZ(41,"input",21),e.NdJ("ngModelChange",function(t){return n.companyProfile.tin_Number=t}),e.qZA()(),e.TgZ(42,"div",22)(43,"label",18),e._uU(44,"Year Incorporated"),e.qZA(),e.TgZ(45,"input",23),e.NdJ("ngModelChange",function(t){return n.companyProfile.year_Incorporated=t}),e.qZA()(),e.TgZ(46,"div",10)(47,"label",24),e._uU(48,"Country"),e.qZA(),e.TgZ(49,"div",8)(50,"select",25)(51,"option",26),e._uU(52),e.qZA(),e.YNc(53,f,2,2,"option",27),e._uU(54," > "),e.qZA()()(),e.TgZ(55,"div",10)(56,"label",18),e._uU(57,"Total Assets"),e.qZA(),e.TgZ(58,"input",28),e.NdJ("ngModelChange",function(t){return n.companyProfile.total_Asset=t}),e.qZA()(),e.TgZ(59,"div",10)(60,"label",18),e._uU(61,"No. of Staff"),e.qZA(),e.TgZ(62,"input",29),e.NdJ("ngModelChange",function(t){return n.companyProfile.no_Staff=t}),e.qZA()(),e.TgZ(63,"div",22)(64,"label",18),e._uU(65,"Yearly Revenue"),e.qZA(),e.TgZ(66,"input",30),e.NdJ("ngModelChange",function(t){return n.companyProfile.yearly_Revenue=t}),e.qZA()(),e.TgZ(67,"div",10)(68,"label",18),e._uU(69,"No. of Expertriates"),e.qZA(),e.TgZ(70,"input",31),e.NdJ("ngModelChange",function(t){return n.companyProfile.no_Expatriate=t}),e.qZA()(),e.TgZ(71,"div",32)(72,"div",33)(73,"button",34),e.NdJ("click",function(){return n.save()}),e._uU(74," Update Profile "),e.qZA()()()()()()()(),e._UZ(75,"br")(76,"br")(77,"br")(78,"br")),2&r&&(e.xp6(6),e.Q6J("formGroup",n.profileForm),e.xp6(7),e.Q6J("ngModel",n.companyProfile.name),e.xp6(5),e.Q6J("ngModel",n.companyProfile.business_Type),e.xp6(5),e.Q6J("ngModel",n.companyProfile.user_Id),e.xp6(5),e.Q6J("ngModel",n.companyProfile.contact_FirstName),e.xp6(5),e.Q6J("ngModel",n.companyProfile.contact_Phone),e.xp6(4),e.Q6J("ngModel",n.companyProfile.rC_Number),e.xp6(4),e.Q6J("ngModel",n.companyProfile.tin_Number),e.xp6(4),e.Q6J("ngModel",n.companyProfile.year_Incorporated),e.xp6(5),e.Q6J("ngModel",n.companyProfile.nationality),e.xp6(1),e.s9C("value",n.companyProfile.nationality),e.xp6(1),e.hij(" ",n.companyProfile.nationality," "),e.xp6(1),e.Q6J("ngForOf",n.countries),e.xp6(5),e.Q6J("ngModel",n.companyProfile.total_Asset),e.xp6(4),e.Q6J("ngModel",n.companyProfile.no_Staff),e.xp6(4),e.Q6J("ngModel",n.companyProfile.yearly_Revenue),e.xp6(4),e.Q6J("ngModel",n.companyProfile.no_Expatriate))},dependencies:[p.sg,o.YN,o.Kr,o.Fj,o.EJ,o.JJ,o.JL,o.sg,o.u],changeDetection:0})}return l})();function C(l,s){if(1&l&&(e.TgZ(0,"option",28),e._uU(1),e.qZA()),2&l){const a=s.$implicit,r=e.oxw();e.Q6J("selected",r.address.country_Id===a.value)("ngValue",a),e.xp6(1),e.hij(" ",a.text," ")}}function Z(l,s){if(1&l&&(e.TgZ(0,"option",29),e._uU(1),e.qZA()),2&l){const a=s.$implicit,r=e.oxw();e.Q6J("selected",a.id===r.address.stateId),e.xp6(1),e.hij(" ",a.name," ")}}const b=[{path:"",component:_},{path:"companyprofile",component:_},{path:"companyaddress",component:(()=>{class l{constructor(a,r,n,i){this.companyService=a,this.popupService=r,this.auth=n,this.cdr=i,this.address=new m,this.email="",this.cd=i,this.currentUsername=this.auth.currentUser,this.email=this.currentUsername.userId,this.createForm(),this.cd.markForCheck()}ngOnInit(){this.getCompanyProfile(this.email),this.getStates(),this.cd.markForCheck()}createForm(){this.addressForm=new o.cw({type:new o.NI(""),address_1:new o.NI("",[o.kI.required]),address_2:new o.NI(""),city:new o.NI("",[o.kI.required]),stateName:new o.NI("",[o.kI.required]),postal_code:new o.NI("",[o.kI.required]),countryName:new o.NI("",[o.kI.required])},{})}getCompanyProfile(a){this.companyService.getCompanyProfile(a).subscribe({next:r=>{this.address=r.data.registeredAddress,this.countries=r.data.nations,this.addressForm.get("countryName").setValue(this.address.countryName),console.log(r),this.cd.markForCheck()}})}getId(a){this.states=this.allStates.filter(r=>r.countryID==a.value),this.address.countryName=a.text}getStates(){this.companyService.getStates().subscribe({next:a=>{this.allStates=a.data,this.addressForm.get("stateName").setValue(this.address.stateName),this.cd.markForCheck()}})}save(){const a=this.addressForm.value;a.countryName=this.address.countryName,console.log(a),this.companyService.saveCompanyProfile(a).subscribe({next:r=>{this.popupService.open("Record updated successfully","success")},error:r=>{console.log(r),this.popupService.open(r?.error,"error")}})}static#e=this.\u0275fac=function(r){return new(r||l)(e.Y36(c.J),e.Y36(g.q),e.Y36(u.$),e.Y36(e.sBO))};static#n=this.\u0275cmp=e.Xpm({type:l,selectors:[["ng-component"]],decls:52,vars:9,consts:[[1,"max-w-screen-lg","mx-auto","mt-8"],[1,"font-semibold","text-xl","text-gray-600"],[1,"text-gray-500","mb-6"],[1,"bg-white","rounded","shadow-lg","px-4","md:p-8","mb-6",3,"formGroup"],[1,"lg:col-span-2"],[1,"grid","gap-4","gap-y-2","text-sm","grid-cols-1","md:grid-cols-7"],[1,"md:col-span-1"],["for","zipcode"],[1,"h-10","bg-gray-50","flex","border","border-gray-200","rounded","items-center","mt-1"],["type","text","formControlName","type","id","type","placeholder","",1,"px-2","appearance-none","outline-none","text-gray-800","w-full","bg-transparent",3,"ngModel","ngModelChange"],[1,"md:col-span-3"],["for","address_1"],["formControlName","address_1","id","address_1","placeholder","",1,"px-2","appearance-none","outline-none","text-gray-800","w-full","bg-transparent",3,"ngModel","ngModelChange"],["for","state"],["formControlName","address_2","id","address_2","placeholder","",1,"px-2","appearance-none","outline-none","text-gray-800","w-full","bg-transparent",3,"ngModel","ngModelChange"],["for","city"],["type","text","formControlName","postal_code","id","postal_code","placeholder","",1,"h-10","border","mt-1","rounded","px-2","w-full","bg-gray-50",3,"ngModel","ngModelChange"],[1,"md:col-span-4"],["for","address"],["type","text","formControlName","city","id","city","placeholder","",1,"h-10","border","mt-1","rounded","px-2","w-full","bg-gray-50",3,"ngModel","ngModelChange"],["for","country"],["formControlName","countryName","id","countryName","placeholder","",1,"px-1","appearance-none","outline-none","text-gray-800","w-full","bg-transparent",3,"ngModel","ngModelChange","change"],[3,"selected","ngValue",4,"ngFor","ngForOf"],["formControlName","stateName","id","stateName","placeholder","",1,"px-4","appearance-none","outline-none","text-gray-800","w-full","bg-transparent"],[3,"selected",4,"ngFor","ngForOf"],[1,"md:col-span-7","text-right"],[1,"inline-flex","items-end"],[1,"bg-green-800","hover:bg-green-900","text-white","font-bold","py-2","px-4","rounded",3,"click"],[3,"selected","ngValue"],[3,"selected"]],template:function(r,n){1&r&&(e.TgZ(0,"div",0)(1,"div")(2,"h2",1),e._uU(3,"Company address"),e.qZA(),e.TgZ(4,"p",2),e._uU(5,"Fill in the company address."),e.qZA(),e.TgZ(6,"div",3)(7,"div",4)(8,"div",5)(9,"div",6)(10,"label",7),e._uU(11,"Address Type"),e.qZA(),e.TgZ(12,"div",8)(13,"input",9),e.NdJ("ngModelChange",function(t){return n.address.type=t}),e.qZA()()(),e.TgZ(14,"div",10)(15,"label",11),e._uU(16,"Address 1"),e.qZA(),e.TgZ(17,"div",8)(18,"input",12),e.NdJ("ngModelChange",function(t){return n.address.address_1=t}),e.qZA()()(),e.TgZ(19,"div",10)(20,"label",13),e._uU(21,"Address 2"),e.qZA(),e.TgZ(22,"div",8)(23,"input",14),e.NdJ("ngModelChange",function(t){return n.address.address_2=t}),e.qZA()()(),e.TgZ(24,"div",10)(25,"label",15),e._uU(26,"Postal Code"),e.qZA(),e.TgZ(27,"input",16),e.NdJ("ngModelChange",function(t){return n.address.postal_code=t}),e.qZA()(),e.TgZ(28,"div",17)(29,"label",18),e._uU(30,"City"),e.qZA(),e.TgZ(31,"input",19),e.NdJ("ngModelChange",function(t){return n.address.city=t}),e.qZA()(),e.TgZ(32,"div",10)(33,"label",20),e._uU(34,"Country"),e.qZA(),e.TgZ(35,"div",8)(36,"select",21),e.NdJ("ngModelChange",function(t){return n.address.country_Id=t})("change",function(){return n.getId(n.address.country_Id)}),e.YNc(37,C,2,3,"option",22),e.qZA()()(),e.TgZ(38,"div",17)(39,"label",13),e._uU(40,"State"),e.qZA(),e.TgZ(41,"div",8)(42,"select",23),e.YNc(43,Z,2,2,"option",24),e.qZA()()(),e.TgZ(44,"div",25)(45,"div",26)(46,"button",27),e.NdJ("click",function(){return n.save()}),e._uU(47," Update Address "),e.qZA()()()()()()()(),e._UZ(48,"br")(49,"br")(50,"br")(51,"br")),2&r&&(e.xp6(6),e.Q6J("formGroup",n.addressForm),e.xp6(7),e.Q6J("ngModel",n.address.type),e.xp6(5),e.Q6J("ngModel",n.address.address_1),e.xp6(5),e.Q6J("ngModel",n.address.address_2),e.xp6(4),e.Q6J("ngModel",n.address.postal_code),e.xp6(4),e.Q6J("ngModel",n.address.city),e.xp6(5),e.Q6J("ngModel",n.address.country_Id),e.xp6(1),e.Q6J("ngForOf",n.countries),e.xp6(6),e.Q6J("ngForOf",n.states))},dependencies:[p.sg,o.YN,o.Kr,o.Fj,o.EJ,o.JJ,o.JL,o.sg,o.u]})}return l})()},{path:"companydirector",component:(()=>{class l{constructor(a,r,n,i,t){this.companyService=a,this.popupService=r,this.auth=n,this.cdr=i,this.formBuilder=t,this.companyDirector=new m,this.email="",this.cd=i,this.currentUsername=this.auth.currentUser,this.email=this.currentUsername.userId,this.createForm(),this.cd.markForCheck()}ngOnInit(){this.getCompanyProfile(this.email),this.getStates(),this.cd.markForCheck()}createForm(){this.directorForm=this.formBuilder.group({firstName:["",[o.kI.required]],lastName:["",[o.kI.required]],telephone:["",[o.kI.required]],nationality:["",[o.kI.required]],address_1:["",[o.kI.required]],address_2:["",[o.kI.required]],city:["",[o.kI.required]],postal_code:["",[o.kI.required]],type:["",[o.kI.required]],countryName:["",[o.kI.required]],stateName:["",[o.kI.required]]})}getCompanyProfile(a){this.companyService.getCompanyProfile(a).subscribe({next:r=>{this.companyDirector=r.data.director,this.countries=r.data.nations,console.log(r),this.cd.markForCheck()}})}getId(a){this.states=this.allStates.filter(r=>r.countryID==a.value),this.companyDirector.countryName=a.text}getStates(){this.companyService.getStates().subscribe({next:a=>{this.allStates=a.data,this.cd.markForCheck()}})}save(){const a=this.directorForm.value;a.countryName=this.companyDirector.countryName,console.log(a),this.companyService.saveCompanyProfile(a).subscribe({next:r=>{this.popupService.open("Record updated successfully","success")},error:r=>{console.log(r),this.popupService.open(r.error,"error")}})}static#e=this.\u0275fac=function(r){return new(r||l)(e.Y36(c.J),e.Y36(g.q),e.Y36(u.$),e.Y36(e.sBO),e.Y36(o.qu))};static#n=this.\u0275cmp=e.Xpm({type:l,selectors:[["ng-component"]],decls:85,vars:11,consts:[[1,"grid","grid-cols-2","md:grid-cols-4","mt-4"],[1,"ml-4","col-span-1"],[1,""],["id","DirectorNames"],["onclick","getDirectors(58548)",1,"btn","btn-dark","btn-block"],[1,"ti-user"],[1,"max-w-screen-lg","md:col-span-3","mx-4","mt-8"],[1,"bg-white","rounded","shadow-lg","px-4","md:p-8","mb-6",3,"formGroup"],[1,"lg:col-span-2"],[1,"grid","gap-4","gap-y-2","text-sm","grid-cols-1","md:grid-cols-6"],[1,"md:col-span-3"],["for","address_1"],[1,"h-10","bg-gray-50","flex","border","border-gray-200","rounded","items-center","mt-1"],["formControlName","firstName","id","firstName","placeholder","",1,"px-2","appearance-none","outline-none","text-gray-800","w-full","bg-transparent",3,"ngModel","ngModelChange"],["formControlName","lastName","id","lastName","placeholder","",1,"px-2","appearance-none","outline-none","text-gray-800","w-full","bg-transparent",3,"ngModel","ngModelChange"],["for","state"],["formControlName","nationality","id","nationality","placeholder","",1,"px-2","appearance-none","outline-none","text-gray-800","w-full","bg-transparent",3,"ngModel","ngModelChange"],["formControlName","telephone","id","telephone","placeholder","",1,"px-2","appearance-none","outline-none","text-gray-800","w-full","bg-transparent",3,"ngModel","ngModelChange"],["formControlName","address_1","id","address_1","placeholder","",1,"px-2","appearance-none","outline-none","text-gray-800","w-full","bg-transparent",3,"ngModel","ngModelChange"],["for","address_2"],["formControlName","address_2","id","address_2","placeholder","",1,"px-2","appearance-none","outline-none","text-gray-800","w-full","bg-transparent",3,"ngModel","ngModelChange"],[1,"md:col-span-2"],["for","city"],["type","text","formControlName","type","id","type","placeholder","",1,"px-2","appearance-none","outline-none","text-gray-800","w-full","bg-transparent",3,"ngModel","ngModelChange"],["type","text","formControlName","postal_code","id","postal_code","placeholder","",1,"px-2","appearance-none","outline-none","text-gray-800","w-full","bg-transparent",3,"ngModel","ngModelChange"],["for","address"],["type","text","formControlName","city","id","city","placeholder","",1,"px-2","appearance-none","outline-none","text-gray-800","w-full","bg-transparent",3,"ngModel","ngModelChange"],["for","country"],["formControlName","countryName","id","countryName","placeholder","",1,"px-1","appearance-none","outline-none","text-gray-800","w-full","bg-transparent",3,"ngModel","ngModelChange","change"],["formControlName","stateName","id","stateName","placeholder","",1,"px-4","appearance-none","outline-none","text-gray-800","w-full","bg-transparent"],[1,"md:col-span-6","text-right"],[1,"inline-flex","items-end"],[1,"bg-blue-800","hover:bg-blue-900","text-white","mr-2","font-bold","py-2","px-4","rounded",3,"click"],[1,"bg-green-800","hover:bg-green-900","text-white","font-bold","py-2","px-4","rounded",3,"click"]],template:function(r,n){1&r&&(e.TgZ(0,"div",0)(1,"div",1)(2,"span")(3,"b",2),e._UZ(4,"i",2),e._uU(5," Directors List "),e.qZA(),e._uU(6," \xa0 "),e.qZA(),e._UZ(7,"hr",2),e.TgZ(8,"div",3)(9,"span",4),e._UZ(10,"i",5),e._uU(11," Daniel"),e.qZA()()(),e.TgZ(12,"div",6)(13,"div")(14,"div",7)(15,"div",8)(16,"div",9)(17,"div",10)(18,"label",11),e._uU(19,"First Name"),e.qZA(),e.TgZ(20,"div",12)(21,"input",13),e.NdJ("ngModelChange",function(t){return n.companyDirector.firstName=t}),e.qZA()()(),e.TgZ(22,"div",10)(23,"label",11),e._uU(24,"Last Name"),e.qZA(),e.TgZ(25,"div",12)(26,"input",14),e.NdJ("ngModelChange",function(t){return n.companyDirector.lastName=t}),e.qZA()()(),e.TgZ(27,"div",10)(28,"label",15),e._uU(29,"Nationality"),e.qZA(),e.TgZ(30,"div",12)(31,"input",16),e.NdJ("ngModelChange",function(t){return n.companyDirector.nationality=t}),e.qZA()()(),e.TgZ(32,"div",10)(33,"label",11),e._uU(34,"Phone Number"),e.qZA(),e.TgZ(35,"div",12)(36,"input",17),e.NdJ("ngModelChange",function(t){return n.companyDirector.telephone=t}),e.qZA()()(),e.TgZ(37,"div",10)(38,"label",15),e._uU(39,"Address 1"),e.qZA(),e.TgZ(40,"div",12)(41,"input",18),e.NdJ("ngModelChange",function(t){return n.companyDirector.address_1=t}),e.qZA()()(),e.TgZ(42,"div",10)(43,"label",19),e._uU(44,"Address 2"),e.qZA(),e.TgZ(45,"div",12)(46,"input",20),e.NdJ("ngModelChange",function(t){return n.companyDirector.address_2=t}),e.qZA()()(),e.TgZ(47,"div",21)(48,"label",22),e._uU(49,"Address Type"),e.qZA(),e.TgZ(50,"div",12)(51,"input",23),e.NdJ("ngModelChange",function(t){return n.companyDirector.type=t}),e.qZA()()(),e.TgZ(52,"div",21)(53,"label",22),e._uU(54,"Postal Code"),e.qZA(),e.TgZ(55,"div",12)(56,"input",24),e.NdJ("ngModelChange",function(t){return n.companyDirector.postal_code=t}),e.qZA()()(),e.TgZ(57,"div",21)(58,"label",25),e._uU(59,"City"),e.qZA(),e.TgZ(60,"div",12)(61,"input",26),e.NdJ("ngModelChange",function(t){return n.companyDirector.city=t}),e.qZA()()(),e.TgZ(62,"div",10)(63,"label",27),e._uU(64,"Country"),e.qZA(),e.TgZ(65,"div",12)(66,"select",28),e.NdJ("ngModelChange",function(t){return n.companyDirector.countryName=t})("change",function(){return n.getId(n.companyDirector)}),e._UZ(67,"option"),e.qZA()()(),e.TgZ(68,"div",10)(69,"label",15),e._uU(70,"State"),e.qZA(),e.TgZ(71,"div",12)(72,"select",29),e._UZ(73,"option"),e.qZA()()(),e.TgZ(74,"div",30)(75,"div",31)(76,"button",32),e.NdJ("click",function(){return n.save()}),e._uU(77," Update Director "),e.qZA()(),e.TgZ(78,"div",31)(79,"button",33),e.NdJ("click",function(){return n.save()}),e._uU(80," Register Director "),e.qZA()()()()()()()()(),e._UZ(81,"br")(82,"br")(83,"br")(84,"br")),2&r&&(e.xp6(14),e.Q6J("formGroup",n.directorForm),e.xp6(7),e.Q6J("ngModel",n.companyDirector.firstName),e.xp6(5),e.Q6J("ngModel",n.companyDirector.lastName),e.xp6(5),e.Q6J("ngModel",n.companyDirector.nationality),e.xp6(5),e.Q6J("ngModel",n.companyDirector.telephone),e.xp6(5),e.Q6J("ngModel",n.companyDirector.address_1),e.xp6(5),e.Q6J("ngModel",n.companyDirector.address_2),e.xp6(5),e.Q6J("ngModel",n.companyDirector.type),e.xp6(5),e.Q6J("ngModel",n.companyDirector.postal_code),e.xp6(5),e.Q6J("ngModel",n.companyDirector.city),e.xp6(5),e.Q6J("ngModel",n.companyDirector.countryName))},dependencies:[o.YN,o.Kr,o.Fj,o.EJ,o.JJ,o.JL,o.sg,o.u]})}return l})()}];let v=(()=>{class l{static#e=this.\u0275fac=function(r){return new(r||l)};static#n=this.\u0275mod=e.oAB({type:l});static#o=this.\u0275inj=e.cJS({imports:[y.Bz.forChild(b),y.Bz]})}return l})(),M=(()=>{class l{static#e=this.\u0275fac=function(r){return new(r||l)};static#n=this.\u0275mod=e.oAB({type:l});static#o=this.\u0275inj=e.cJS({imports:[p.ez,v,o.u5,o.UX]})}return l})()}}]);
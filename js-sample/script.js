 var TASKLISTADDFORM=$('#tasklistForm').html();
$(document).ready(function(){

 var pathname = window.location.pathname.split("/");

 /*validation section*/
	$('#loginFrontendForm').validate({
		submitHandler:function(form){
			form.submit();
		},
		rules:{
			"_username":{
				required:true
			},
			"_password":{
				required:true
			}
		},
		messages:{
			"_username":{
				required:"<span>Please Enter Username</span>"
			},
			"_password":{
				required:"<span>Please Enter Password</span>"
			}
		}
	});

	//company user form
	$('#companyUserForm').validate({
		submitHandler:function(form){
			form.submit();
		},
		rules:{
			"company_user_form[firstName]":{
	    		required: true
	    	},
	    	"company_user_form[lastName]":{
	    		required: true
	    	},
	    	"company_user_form[email]":{
	    		required:true,
	    		email:true
	    	},
	    	"company_user_form[password]":{
	    		required:true
	    	},
	    	"company_user_form[password][first]":{
	    		required:true
	    	},
	    	"company_user_form[password][second]" : {
                equalTo : "#company_user_form_password_first"
            }
		},
		messages:{
			"company_user_form[firstName]":{
	    		required: "<span>Please Enter First Name</span>"
	    	},
	    	"company_user_form[lastName]":{
	    		required: "<span>Please Enter Last Name</span>"
	    	},
	    	"company_user_form[email]":{
	    		required: "<span>Please Enter Email</span>",
	    		email: "<span>Please Enter Valid Email</span>"
	    	},
	    	"company_user_form[password][first]":{
	    		required:"<span>Please Enter Password</span>"
	    	},
	    	"company_user_form[password][second]" : {
                equalTo : "<span>Password Not Matched</span>"
            }
		}
	});

	$('#AddPasswordForm').validate({
		submitHandler:function(form){
			form.submit();
		},
		rules:{
	    	"company_user_form[password][first]":{
	    		required:true
	    	},
	    	"company_user_form[password][second]" : {
                equalTo : "#company_user_form_password_first"
            }
		},
		messages:{
	    	"company_user_form[password][first]":{
	    		required:"<span>Please Enter Password</span>"
	    	},
	    	"company_user_form[password][second]" : {
                equalTo : "<span>Password Not Matched</span>"
            }
		}
	});

	//project
	var projValid=$('#projectForm').validate({
		submitHandler:function(form){
			form.submit();
		},
		ignore: [],
		rules:{
			"project_form[projectTitle]":{
	    		required: true
	    	},
	    	"project_form[projectDescription]":{
	    		required: true
	    	},
	    	"project_form[startDate]":{
	    		required: true
	    	},
	    	"project_form[deadline]":{
	    		required: true
	    	},
	    	"project_form[status]":{
	    		required: true
	    	},
	    	"project_form[assignedTo][]":{
	    		required: true
	    	}
		},	
		messages:{
			"project_form[projectTitle]":{
	    		required: "<span>Please Enter Project Title</span>"
	    	},
	    	"project_form[projectDescription]":{
	    		required: "<span>Please Enter Project Description</span>"
	    	},
	    	"project_form[startDate]":{
	    		required: "<span>Please Select Start Date</span>"
	    	},
	    	"project_form[deadline]":{
	    		required: "<span>Please Select Deadline</span>"
	    	},
	    	"project_form[status]":{
	    		required: "<span>Please Select Status</span>"
	    	}
		},
		errorPlacement: function (error, element) {
      		var el = $(element).closest('.jqte');
      		if (el.length == 1) {
          		error.insertAfter(el);
      		} else {
          		error.insertAfter(element);
      		}
  		}
	});

	//task list
	var tasklistValid=$('#tasklistForm').validate({
		submitHandler:function(form){
			var url=$(form).attr('action');
			$.ajax({
        		type: $(form).attr('method'),
        		url: url,
        		data: $(form).serialize(),
        		dataType : 'json'
    		})
    		.done(function (response) {
    			if (response.success == true) {
    				toastr.success(response.message, {timeOut: 500});         
            		location.reload();
    			}else{
    				toastr.success(response.message, {timeOut: 500});         
            		location.reload();
    			}
    		});
		},
		ignore: [],
		rules:{
			"tasklist_form[tasklistTitle]":{
	    		required: true
	    		
	    	}
		},
		messages:{
			"tasklist_form[tasklistTitle]":{
	    		required: "<span>Please Enter Title</span>"
	    	}
		}
	});
	var taskValid=$('#taskForm').validate({
		submitHandler:function(form){
			var taskListId=$('.task-modal-active').data('id');
			taskListId=(typeof taskListId=='undefined')?$('#opentaskModal').data('id'):taskListId;
			var tid=$('#hiddenTaskId').val();
			var url=(tid)?'ajaxEditTask/'+tid:'ajaxAddTask/'+taskListId;
			var file_data = $('#task_form_file')[0].files[0];
			var formData = new FormData();
			formData.append('file', file_data);
			var other_data = $(form).serializeArray();
    		$.each(other_data,function(key,input){
        		formData.append(input.name,input.value);
    		});
        	$.ajax({
        		type: $(form).attr('method'),
        		url: base_url+url,
        		data: formData,
        		dataType : 'json',
        		contentType:false,
				processData:false
    		})
    		.done(function (response) {
        		if (response.success == true) {
        			toastr.success(response.message, {timeOut: 500});
        			location.reload();
        			return false;
        			var editUrl=base_url+'ajaxEditTask/'+response.data.id;
        			var deleteUrl=base_url+'ajaxDeleteTask/'+response.data.id;

        			//<a href="javascript:void(0);" id="task-delete-'+response.data.id+'" onclick="deleteTask(`'+deleteUrl+'`,this,event);" class="task-list-links text-danger"><i class="glyphicon glyphicon-trash"></i> Delete</a>
        			var html='<li class="list-group-item list-item-child no-collapsable"><a href="">'+response.data.task_title+'</a><div class="pull-right"><a href="javascript:void(0);" id="task-edit-'+response.data.id+'" onclick="editTask(`'+editUrl+'`,this,event);" class="task-list-links no-collapsable"><i class="glyphicon glyphicon-edit"></i> Edit</a></div></li>';

        			//<a href="javascript:void(0);" id="task-delete-'+response.data.id+'" onclick="deleteTask(`'+deleteUrl+'`,this,event);" class="task-list-links text-danger"><i class="glyphicon glyphicon-trash"></i> Delete</a>
        			var editHtml=response.data.task_title+'<div class="pull-right"><a href="javascript:void(0);" id="task-edit-'+response.data.id+'" onclick="editTask(`'+editUrl+'`,this,event);" class="task-list-links no-collapsable"><i class="glyphicon glyphicon-edit"></i> Edit</a></div>';
        			if(tid){
        				$('#task-edit-'+tid).parents('li.list-item-child').html(editHtml);
             		}else{
             			$("li.task-modal-active ul").append(html);
        			}
        			toastr.success(response.message, {timeOut: 500});         
            		$('#taskModalpop').modal('hide').delay(500);
        			
        		} else {
            		toastr.warning(response.message, {timeOut: 500}); 
        		}
    		});
    		return false; // required to block normal submit since you used ajax
		},
		rules: {
            "task_form[file]": {
                extensionNotAllow:true
            }
        }
	});

	var taskFile=$('#taskFileForm').validate({
        ignore: [],
        rules: {
            "task_file_form[file]": {
                extensionNotAllow:true
            }
        },
        errorPlacement: function (error, element) {
      		$('#task_comment_form_button').after(error);
      		
  		}
	});
	var taskCommentForm=$('#taskCommentForm').validate({
        ignore: [],
        rules: {
            "task_comment_form[comment]": {
                required:true
            }
        },
        errorPlacement: function (error, element) {
      		var el = $(element).closest('.jqte');
      		if (el.length == 1) {
          		error.insertAfter(el);
      		} else {
          		error.insertAfter(element);
      		}
      		
  		}
	});

	var estimateForm=$('#estimateForm').validate({
		ignore: [],
		rules: {
            "task_form[estimate]": {
                required:true
            }
        },
        messages:{
        	"task_form[estimate]": {
                required:"<span>Please Enter Estimate</span>"
            }
        },
        submitHandler:function(form){
        	var url=$(form).attr('action');
        	var data=$(form).serialize();
        	$.ajax({
        		type:'post',
        		url: url,
        		data:data,
        		datatype :'json',
        		success:function (response) {
        			if(response.success==true){
        				toastr.success(response.message,{timeOut:500});
        				location.reload();
        			}else{
        				toastr.warning(response.message,{timeOut:500});
        			}
   				}
    		});
        	
        }
	});
/*validation section*/

	var type=(pathname[pathname.length-2]=='tasklist')?pathname[pathname.length-2]:pathname[pathname.length-1];
	var company_id = pathname[pathname.length-2];
	company_id=($.isNumeric(company_id))?company_id:'';

	//datatables
	switch(type){
		case 'users':
		    $('#userListing').DataTable({
		        "processing": true,
		        "serverSide": true,
		        "ajax": {
		            "url": base_url+"ajaxcompany/"+company_id+"/users",
		            "type": "POST"
		        },
		        "columns": [
		            { "data": "id" },
		            { "data": "firstName" },
		            { "data": "lastName" },
		            { "data": "email" },
		            { "data": "actions","orderable": false},
		        ]
		    });
		break;
		case 'projects':
			//datatable
		    $('#projectListing').DataTable({
		        "processing": true,
		        "serverSide": true,
		        "ajax": {
		            "url": base_url+"ajaxprojects",
		            "type": "POST"
		        },
		        "columns": [
		            { "data": "id" },
		            { "data": "projectTitle" },
		            { "data": "projectDescription" },
		            { "data": "actions","orderable": false},
		        ]
		    });
		break;
		/*case 'tasklist':
			//datatable
		    $('#taskListing').DataTable({
		        "processing": true,
		        "serverSide": true,
		        "ajax": {
		            "url": base_url+"ajaxtasklists/"+pathname[pathname.length-1],
		            "type": "POST"
		        },
		        "columns": [
		            { "data": "id" },
		            { "data": "tasklistTitle" },
		            { "data": "actions", "orderable": false},
		        ]
		    });
		break;*/

	}
	
    //Automtic edit checked unchecked
    $('.chkdiv').click(function(){
    	if(!$(this).find('label').hasClass('active')) {
    		if($.trim($(this).parent().text()).indexOf('ADD')>=0){
    			$(this).parent().next().find('.btn.btn-info ').addClass('active');
    			$(this).parent().next().find('input[type="checkbox"]').prop('checked',true);
    		}
    	}else{
    		if($.trim($(this).parent().text()).indexOf('ADD')>=0){
    			$(this).parent().next().find('.btn.btn-info ').removeClass('active');
    			$(this).parent().next().find('input[type="checkbox"]').prop('checked',false);
    		}
    	}
    });

    /*datepicker*/
    $('#project_form_startDate').datepicker({ dateFormat: 'yy-mm-dd',onSelect: function (selectedDate) {
        projValid.form();
        var dt = new Date(selectedDate);
        dt.setDate(dt.getDate() + 1);
        $("#project_form_deadline").datepicker("option", "minDate", dt);
    }});
    $('#project_form_deadline').datepicker({ dateFormat: 'yy-mm-dd',onSelect: function (selectedDate) {
    	projValid.form();
    }});

    $('#task_form_startDate').datepicker({ dateFormat: 'yy-mm-dd',onSelect: function (selectedDate) {
        var dt = new Date(selectedDate);
        dt.setDate(dt.getDate() + 1);
        $("#task_form_deadline").datepicker("option", "minDate", dt);
    }});
    $('#task_form_deadline').datepicker({ dateFormat: 'yy-mm-dd',onSelect: function (selectedDate) {
    	//projValid.form();
    }});


   	if(isDate($('#project_form_startDate').datepicker('getDate'))) {
   		var startDate=$('#project_form_startDate').datepicker('getDate');
   		var dt = new Date(startDate);
   		dt.setDate(dt.getDate() + 1);
   		$("#project_form_deadline").datepicker("option", "minDate", dt);
   	}
   	/*datepicker*/

    //editor
     $("textarea").jqte();

    //project description on change
    $("#project_form_projectDescription").closest(".jqte").find(".jqte_editor").blur(function () {
      if (!$.isEmptyObject(projValid.submitted)) {
          projValid.form();
      }else{
      	 projValid.valid();
      }
  	});

    //list group item toggle
    $('.main-parent-li').on('click', function(e) {
    	var classes=$(e.target).attr('class').split(' ');
    	//console.log(classes);
    	//console.log($.inArray('no-collapsable',classes));
    	if($.inArray('no-collapsable',classes)<0) {
			$(this).find('i.main-list-i').toggleClass('glyphicon glyphicon-plus').toggleClass('glyphicon glyphicon-minus');
    	}
    });
});

//is date method
function isDate(val) {
    var d = new Date(val);
    return !isNaN(d.valueOf());
}

//saveTask
function saveTask(form){
	console.log(form);
}

//add button click
$(document).on('click','#opentaskModal',function(e){
	e.stopPropagation();
	$('#taskModalTitle').text('Add Task');
	$('#task_form_submit').text('Save');
	$('form')[0].reset();
	$('.jqte_editor').empty();
	$('#hiddenTaskId').val('');
	$(this).parents('li').addClass('task-modal-active');
	//get Assigned dropdown values
	var tid=(typeof $(this).parents('li').data('id')=='undefined')?$(this).data('id'):$(this).parents('li').data('id');
	setAssignedDropHtml(tid);
   	$('#taskModalpop').modal('show');
});

//bootstrap callbacks
$('#taskModalpop').on('show.bs.modal', function (e) {
});

$('#taskModalpop').on('hidden.bs.modal', function (e) {
	$('#opentaskModal').parents('li').removeClass('task-modal-active');
});

$(document).on("click",".no-collapsable,.list-item-child",function(e){
	e.stopPropagation();
});

//projects sidebar toggle
$(".project-options").click(function(){
	$(this).find('a').toggleClass('project-open');
	$("ul.sub-projects").slideToggle();
});



//edit task and shown data on form
function editTask(url,th,e){
	e.stopPropagation();
	$.ajax({
        type:'post',
        url: url,
        dataType : 'json'
    }).done(function (response) {
        if (response.success == true) {
        	$('#taskModalTitle').text('Edit Task');
        	$.each(response.data,function(key,value){
        		if(key=='task_form_taskDescription'){
        			$('.jqte_editor').html(value);
        		}else{
        			$('#'+key).val(value);
        		}
        	});
        	setAssignedDropHtml(response.data.task_list_id,response.data.task_form_assignedTo);//call internal method
        	var startDate=$('#task_form_startDate').datepicker('getDate');
   			var dt = new Date(startDate);
   			dt.setDate(dt.getDate() + 1);
   			$("#task_form_deadline").datepicker("option", "minDate", dt);
        	$('#taskModalpop').modal('show');
        } else {
            toastr.warning(response.message, {timeOut: 500}); 		
    	}	
   	});
}

//delete task
function deleteTask(url,th,e){
	e.stopPropagation();
	$.ajax({
        type:'post',
        url: url,
        dataType : 'json'
    }).done(function (response) {
        if (response.success == true) {
        	$(th).parents('.list-item-child').remove();
        	toastr.success(response.message, {timeOut: 500}); 
        } else {
            toastr.warning(response.message, {timeOut: 500}); 		
    	}	
   	});
}

//set assigned dropdown html
function setAssignedDropHtml(tid,taskUsers=''){
	
	if(tid){
		$.ajax({
        	type:'post',
        	url: base_url+'ajaxTasklistUsers/'+tid,
        	dataType : 'json'
    	}).done(function (response) {
        	if (response.success == true) {
        		var optionHtml='';
        		var cbox=0;
        		$.each(response.data,function(key,value){
        				optionHtml+='<input id="task_form_assignedTo_'+cbox+'" name="task_form[assignedTo][]" value="'+value+'" type="checkbox"><label for="task_form_assignedTo_'+cbox+'">'+key+'</label>';
        			cbox++;
        		});

        		if($('#task_form_assignedTo input').length<1){
					$('#task_form_assignedTo').append(optionHtml);
        		}
        		if(taskUsers){
					$.each(taskUsers.split(","),function(){
						$('#task_form_assignedTo input[value="'+$.trim(this)+'"]').prop('checked',true);
					});
				}
        		
        	} 	
   		});
	}
	
}

//delete with conform box
function deleteOperation(url,type,ev=''){
	ev.stopPropagation();
	if(confirm("Do you want to delete this "+type+"?")) {
		window.location.href=url;
	}

}

//'#taskFiles click
/*$(document).on('change','#task_file_form_file',function(){
	var tid=$('#task_file_form_taskId').val();
	var formData = new FormData();
	formData.append('file', $('#task_file_form_file')[0].files[0]);
	if($('#taskFileForm').valid()){
		$.ajax({
			url:base_url+'ajaxTaskFile/'+tid,
			type:'post',
			data:formData,
			datatype:'json',
			contentType:false,
			cacahe:false,
			processData:false,
			success:function(response){
				toastr.success(response.message, {timeOut: 500}); 
			}

		});
	}
	
});*/

//save comment click
$(document).on("click","#task_comment_form_submit",function(e){
	e.preventDefault();
	var tid=$('#task_file_form_taskId').val();
	var formData = new FormData();
	formData.append('file', $('#task_file_form_file')[0].files[0]);
	formData.append('comment', $('.jqte_editor').html());

	if($('#taskFileForm').valid() && $('#taskCommentForm').valid()){
		$.ajax({
			url:base_url+'ajaxTaskFile/'+tid,
			type:'post',
			data:formData,
			datatype:'json',
			contentType:false,
			cache:false,
			processData:false,
			success:function(response){
				toastr.success(response.message, {timeOut: 500});
				$('.jqte_editor').empty()
				location.reload();
			}

		});
	}
});

//extension not allow
$.validator.addMethod("extensionNotAllow", function(value, element) {
	var extension = value.substr( (value.lastIndexOf('.') +1) );
   if (extension=="php"){
        return false;  // FAIL validation when REGEX matches
    } else {
        return true;   // PASS validation otherwise
    };
}, "Please enter a value with a valid extension.");

//add task list open pop
$(document).on('click','#addEditTaskList',function(e){
	e.preventDefault();
	e.stopPropagation();
	var url=$(this).attr('href');
	$('#tasklistForm').attr('action',url);
	$('#taskListModalTitle').text('Add Task List');
	$('#tasklistForm').html(TASKLISTADDFORM);
   	$('#taskListModalpop').modal('show');

   	return false;
});

//edit Task List pop open
$(document).on('click','.editTaskListpop',function(e){
	e.preventDefault();
	e.stopPropagation();
	var url=$(this).attr('href');
	$('#tasklistForm').attr('action',url);
	$('#taskListModalTitle').text('Edit Task List');

	$.ajax({
        type:'post',
        url: url,
        datatype : 'text/html',
        success:function (response) {
        	var html=$.parseHTML(response);

        	$('#tasklistForm').html($(html).find('#tasklistForm').html());
        	$('#taskListModalpop').modal('show');
   		}
    });
});

//product listing clickable
$(document).on('click','#projectListing tbody tr',function(){
	var url=$(this).find('td:last a:last').attr('href');
	window.location.href=url;
});

//provide estimate click and open pop up
$(document).on("click","#provideEstimate",function(e){
	e.preventDefault();
	var url=$(this).attr('href');
	$('#estimateForm').attr('action',url);
	$('#estimateForm').find('.jqte_editor').empty();
	$('#provideEstimateModalpop').modal('show');
});

//taskAction method
function taskAction(tid,action){
	if(tid){

		if(confirm("Do you want to "+action+" it?") ) {
			switch(action){
				case 'approve':
				action='approved';
				break;
				case 'complete':
				action='completed';
				break;
				case 'reject':
				action='rejected';
				break;
			}
			$.ajax({
	        	type:'post',
	        	url: base_url+'task/approveReject/'+tid+'/'+action,
	        	datatype : 'json',
	        	success:function (response) {
	        		if(response.success==true){
	        			toastr.success(response.message,{timeOut:500});
	        			location.reload();
	        		}else{
	        			toastr.warning(response.message,{timeOut:500});
	        		}
	   			}
    		});
		}
		
	}
	
}

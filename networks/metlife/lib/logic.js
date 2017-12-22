'use strict';
/**
 * Write your transction processor functions here
 */

/**
 * Sample transaction
 * @param {ml.gi.mvp.employee.employeeRecord.updateEmployee} changeAssetValue
 * @transaction
 */
function updateEmployee(trade) {
    trade.employee1.name.firstName = "Forrest"
    trade.employee1.name.lastName = "Smith"
    trade.employee1.name.prefix = "MR"

    return getAssetRegistry('ml.gi.mvp.employee.employeeRecord.Employee')
        .then(function (assetRegistry) {
            return assetRegistry.update(trade.employee1);
        });
}


/**
 * Add Employee transaction
 * @param {ml.gi.mvp.employee.employeeRecord.addEmployee} changeAssetValue
 * @transaction
 */
function addEmployee(inputData) {
  	var factory = getFactory();
  	ourEmployee = factory.newResource('ml.gi.mvp.employee.employeeRecord', 'Employee', inputData.serialNumber);
  	
  /*	ourEmployee.name = inputData.name;
  	ourEmployee.address = inputData.address;
  	ourEmployee.contactInfo = inputData.contactInfo;
  
  	ourEmployee.social = inputData.social;
  	ourEmployee.dateOfBirth = inputData.dateOfBirth;
  	ourEmployee.hireDate = inputData.hireDate;
  	ourEmployee.gender = inputData.gender;
  	ourEmployee.maritalStatus = inputData.maritalStatus;
  	ourEmployee.terminationDate = inputData.terminationDate;
  	ourEmployee.status = inputData.status;
  	ourEmployee.createdBy = inputData.createdBy;
  	ourEmployee.createdDate = inputData.createdDate;
  	ourEmployee.lastUpdatedBy = inputData.lastUpdatedBy;
  	ourEmployee.lastUpdatedDate = inputData.lastUpdatedDate;
  
  	ourEmployee.employer = inputData.employer;
  	ourEmployee.tpa = inputData.tpa;
  
  	validateWholeEmployee(ourEmployee);*/
  
  
    return getAssetRegistry('ml.gi.mvp.employee.employeeRecord.Employee')
        .then(function (assetRegistry) {
           return assetRegistry.add(ourEmployee);
        }).then(function() {
           //emit event for handlers
           var addEmployee = factory.newEvent('ml.gi.mvp.employee.employeeRecord', 'AddEmployeeEvent');
           addEmployee.serialNumber = inputData.serialNumber;
           emit(addEmployee);
        });


		
    
}

//This function exists because apparently Composer does not check if the fields exist
function validateWholeEmployee(employee) {
  var myError = new Error("One or more fields has been left blank");
  
  //strings
  
  if (!employee.serialNumber) { //might be superfluous but whatever
    throw myError;
  }

  if (!employee.social) {
    throw myError;
  }

  if (!employee.dateOfBirth) {
    throw myError;
  }

  if (!employee.hireDate) {
    throw myError;
  }

  if (!employee.status) {
    throw myError;
  }

  if (!employee.createdBy) {
    throw myError;
  }

  if (!employee.createdDate) {
    throw myError;
  }

  if (!employee.lastUpdatedBy) {
    throw myError;
  }
  
  //DateTimes
  //There might be a better way to do this
  
  if (!employee.lastUpdatedDate) {
    throw myError;
  }
  
  //Name concept
  if (!employee.name.firstName) {
    throw myError;
  }
  if (!employee.name.lastName) {
    throw myError;
  }
  
  //Address array
  if (!employee.address.length) {
    throw myError;
  }
  for (ind = 0; ind < employee.address.length; ind++) {
    if (!employee.address[ind].type) {
      throw myError;
    }
    
    if (!employee.address[ind].line1) {
      throw myError;
    }
    
    if (!employee.address[ind].city) {
      throw myError;
    }
    
    if (!employee.address[ind].state) {
      throw myError;
    }
    
    if (!employee.address[ind].country) {
      throw myError;
    }
    
    if (!employee.address[ind].zip) {
      throw myError;
    }
  }
    
    
  //Contact Info array
  if (!employee.contactInfo.length) {
    throw myError;
  }
  for (ind = 0; ind < employee.contactInfo.length; ind++) {
    if (!employee.contactInfo[ind].type) {
      throw myError;
    }
    
    if (!employee.contactInfo[ind].email) {
      throw myError;
    }
    
    if (!employee.contactInfo[ind].mobilePhoneNumber) {
      throw myError;
    }
  }
/**
Composer already checks the presense of these references, but doesn't check if they point to a real asset. Not sure how to improve on that
  --> Employer employer
  --> TPA tpa 
}
*/  
}
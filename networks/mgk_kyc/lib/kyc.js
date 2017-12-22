
/**
* @param {org.acme.model.IdentifyPerson} tx Transaction for identifying persons.
* @transaction
*/
function identifyPerson(tx) 
{
  tx.personIdentified.identifiedBy = tx.verifyingCompany;
  tx.personIdentified.identified   = new Date();
  
  console.log(tx.verifyingCompany.toString());
  console.log(tx.personIdentified.toString());

  return getAssetRegistry('org.acme.model.Person').then(function(personRegistry) 
  {
	     return personRegistry.update(tx.personIdentified);
  });
}

/**
* @param {org.acme.model.CheckIdentity} tx Transaction for querying, if a person is identified.
* @transaction
*/
function checkIdentity(tx) 
{
  var factory = getFactory();
  var event = factory.newEvent('org.acme.model', 'IdentificationEvent');
  event.personChecked = tx.personToCheck;
  event.requester = getCurrentParticipant();
  event.identified = (tx.personToCheck.identified!=null)
  emit(event);
}

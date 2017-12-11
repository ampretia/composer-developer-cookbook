#!/bin/bash
set -ev
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Due to the way the model is setup we need to create the organization LandRegistry first.
node ${DIR}/createOrgs.js

# Issue the IDAdmins of the LandRegistry, and the other ogranisations
composer participant add -p hlfv1 -i admin -s adminpw -n dpn-scenario -d '{"$class" : "net.biz.digitalproperty.core.IDAdmin",  "email"  : "ian@EnglandRegistry.com",  "firstname" :"ian",  "lastname"  :"andrews",  "jobtitle"  :"EnglandRegistry id-admin","reportingBusiness":"EnglandRegistry.com","organization":"resource:net.biz.digitalproperty.core.Organization#EnglandLandRegistry"}'
${DIR}/addIdentity.sh ian@EnglandRegistry.com net.biz.digitalproperty.core.IDAdmin#ian@EnglandRegistry.com admin

composer participant add -p hlfv1 -i admin -s adminpw -n dpn-scenario -d '{"$class" : "net.biz.digitalproperty.core.IDAdmin",  "email"  : "ian@BlockLink.com",  "firstname" :"ian",  "lastname"  :"andrews",  "jobtitle"  :"BlockLink id-admin","organization":"resource:net.biz.digitalproperty.core.Organization#BlockLink"}'
${DIR}/addIdentity.sh ian@BlockLink.com net.biz.digitalproperty.core.IDAdmin#ian@BlockLink.com admin

composer participant add -p hlfv1 -i admin -s adminpw -n dpn-scenario -d '{"$class" : "net.biz.digitalproperty.core.IDAdmin",  "email"  : "ian@CongaBuild.com",  "firstname" :"ian",  "lastname"  :"andrews",  "jobtitle"  :"Conga Build id-admin","organization":"resource:net.biz.digitalproperty.core.Organization#CongaBuild"}'
${DIR}/addIdentity.sh ian@CongaBuild.com net.biz.digitalproperty.core.IDAdmin#ian@CongaBuild.com admin

composer participant add -p hlfv1 -i admin -s adminpw -n dpn-scenario -d '{"$class" : "net.biz.digitalproperty.core.IDAdmin",  "email"  : "ian@quicksale.com",  "firstname" :"ian",  "lastname"  :"andrews",  "jobtitle"  :"QuickSale id-admin","organization":"resource:net.biz.digitalproperty.core.Organization#QuickSale"}'
${DIR}/addIdentity.sh ian@quicksale.com net.biz.digitalproperty.core.IDAdmin#ian@quicksale.com admin

composer participant add -p hlfv1 -i admin -s adminpw -n dpn-scenario -d '{"$class" : "net.biz.digitalproperty.core.IDAdmin",  "email"  : "ian@SellCheap.com",  "firstname" :"ian",  "lastname"  :"andrews",  "jobtitle"  :"SellCheap id-admin","organization":"resource:net.biz.digitalproperty.core.Organization#SellCheap"}'
${DIR}/addIdentity.sh ian@SellCheap.com net.biz.digitalproperty.core.IDAdmin#ian@SellCheap.com admin

composer participant add -p hlfv1 -i admin -s adminpw -n dpn-scenario -d '{"$class" : "net.biz.digitalproperty.core.NetworkAdmin",  "email"  : "nell@EnglandRegsitry.com",  "firstname" :"Nell",  "lastname"  :"Norris",  "jobtitle"  :"Network-admin","organization":"resource:net.biz.digitalproperty.core.Organization#EnglandRegistry"}'
${DIR}/addIdentity.sh nell@EnglandRegsitry.com net.biz.digitalproperty.core.NetworkAdmin#nell@EnglandRegsitry.com admin

#
# Issue Identities for the indiviuals..
composer participant add -p hlfv1 -i admin -s adminpw -n dpn-scenario -d '{"$class" : "net.biz.digitalproperty.core.Individual",  "email"  : "lisa@example.com",  "firstname" :"lisa",  "lastname"  :"lenon",  "jobtitle"  :"individual"}'
${DIR}/addIdentity.sh lisa@example.com net.biz.digitalproperty.core.Individual#lisa@example.com admin

composer participant add -p hlfv1 -i admin -s adminpw -n dpn-scenario -d '{"$class" : "net.biz.digitalproperty.core.Individual",  "email"  : "erin@example.com",  "firstname" :"erin",  "lastname"  :"edwards",  "jobtitle"  :"individual"}'
${DIR}/addIdentity.sh erin@example.com net.biz.digitalproperty.core.Individual#erin@example.com admin

composer participant add -p hlfv1 -i admin -s adminpw -n dpn-scenario -d '{"$class" : "net.biz.digitalproperty.core.Individual",  "email"  : "joespeh@example.com",  "firstname" :"joseph",  "lastname"  :"jones",  "jobtitle"  :"individual"}'
${DIR}/addIdentity.sh joespeh@example.com net.biz.digitalproperty.core.Individual#joespeh@example.com admin

composer participant add -p hlfv1 -i admin -s adminpw -n dpn-scenario -d '{"$class" : "net.biz.digitalproperty.core.Individual",  "email"  : "oscar@example.com",  "firstname" :"oscar",  "lastname"  :"orwell",  "jobtitle"  :"individual"}'
${DIR}/addIdentity.sh oscar@example.com net.biz.digitalproperty.core.Individual#oscar@example.com admin

# Now we are in to Fully Protected mode as we are able to stop using the admin id from here on out.
# He can then issue to the LandRegsitry business admin
composer participant add -p hlfv1 -i ian@EnglandRegistry.com -s x -n dpn-scenario -d '{"$class" : "net.biz.digitalproperty.core.BusinessAdmin",  "email"  : "bob@EnglandRegistry.com",  "firstname" :"bob",  "lastname"  :"bob brown",  "jobtitle"  :"title adder","organization":"resource:net.biz.digitalproperty.core.Organization#EnglandLandRegistry"}'
${DIR}/addIdentity.sh bob@EnglandRegistry.com net.biz.digitalproperty.core.BusinessAdmin#bob@EnglandRegistry.com ian@EnglandRegistry.com

# He can also add in a 'functionary'
#composer participant add -p hlfv1 -i ian@EnglandRegistry.com -s x -n dpn-scenario -d '{"$class" : "net.biz.digitalproperty.core.OrganizationRepresentive",  "email"  : "lisa@EnglandRegistry.com",  "firstname" :"Lisa",  "lastname"  :"Long",  "jobtitle"  :"Functionary","organization":"resource:net.biz.digitalproperty.core.Organization#EnglandLandRegistry"}'
#${DIR}/addIdentity.sh lisa@EnglandRegistry.com net.biz.digitalproperty.core.OrganizationRepresentive#lisa@EnglandRegistry.com ian@EnglandRegistry.com










exit

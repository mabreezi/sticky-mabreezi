'use strict';
/**
 * Write your transction processor functions here
 */


/**
 * Track the trade of a commodity from one trader to another
 * @param {org.kibaati.ItemTransfer} trade - the trade to be processed
 * @transaction
 */
function onTransfer(trade) {
    if (trade.item.owner.getFullyQualifiedIdentifier() == getCurrentParticipant().getFullyQualifiedIdentifier()){
        trade.item.owner = trade.newOwner

        return getAssetRegistry('org.kibaati.Item')
            .then(function(assetRegistry){
                return assetRegistry.update(trade.item);
            });
    }

    else {
        throw new Error('You do not have permission to transfer this item')
    }

}


/**
 * Transfer a commodity from one person to another used by ADMIN only
 * @param {org.kibaati.AdminItemTransfer} trade - the trade to be processed
 * @transaction
 */
function onAdminTransfer(trade) {
    if (trade.item.owner.getFullyQualifiedIdentifier() == trade.previousOwner.getFullyQualifiedIdentifier()){
        trade.item.owner = trade.newOwner

        return getAssetRegistry('org.kibaati.Item')
            .then(function(assetRegistry){
                return assetRegistry.update(trade.item);
            });
    }

    else {
        throw new Error('You cannot transfer this item because the person given as the previous owner given is not the current owner')
    }

}


/**
 * Make a payment, transfer funds to another person
 * @param {org.kibaati.OrdinaryPayment} payment - the  payment to be made
 * @transaction
 */
 function onOrdinaryPayment(payment){
 	var sender = getCurrentParticipant();
 	var recipient = payment.recipient;
    var tranAmount = payment.amount

    if (sender.balance >= tranAmount){
        sender.balance = sender.balance - tranAmount
        recipient.balance = recipient.balance + tranAmount

        getParticipantRegistry(sender.getFullyQualifiedType())
            .then( function(participantRegistry){
                return participantRegistry.update(sender);
            })

        return getParticipantRegistry(recipient.getFullyQualifiedType())
        .then( function(participantRegistry){
            return participantRegistry.update( recipient)
        });

    }

    else{
        throw new Error('You do not have enough funds to complete this transaction')
    }

 }


/**
 * Refugee receives funds from a merchant, funds move from refugee to merchant
 * @param {org.kibaati.RefugeeMerchantPayment} payment - the  payment to be made
 * @transaction
 */
 function onRefugeeMerchantPayment(payment){
        var recipient = getCurrentParticipant();
        var sender = payment.refugee;
    var tranAmount = payment.amount

    if (sender.balance >= tranAmount){
        sender.balance = sender.balance - tranAmount
        recipient.balance = recipient.balance + tranAmount

        getParticipantRegistry(sender.getFullyQualifiedType())
            .then( function(participantRegistry){
                return participantRegistry.update(sender);
            })

        return getParticipantRegistry(recipient.getFullyQualifiedType())
        .then( function(participantRegistry){
            return participantRegistry.update( recipient)
        });

    }

    else{
        throw new Error('You do not have enough funds to complete this transaction')
    }

 }



/**
 * Transfer funds from one person to another, used by ADMIN only
 * @param {org.kibaati.AdminCrossPayment} payment - the  payment to be made
 * @transaction
 */
 function onAdminCrossPayment(payment){
    var sender =payment.sender;
    var recipient = payment.recipient;
    var tranAmount = payment.amount

    if (sender.balance >= tranAmount){
        sender.balance = sender.balance - tranAmount
        recipient.balance = recipient.balance + tranAmount

        getParticipantRegistry(sender.getFullyQualifiedType())
            .then( function(participantRegistry){
                return participantRegistry.update(sender);
            })

        return getParticipantRegistry(recipient.getFullyQualifiedType())
        .then( function(participantRegistry){
            return participantRegistry.update( recipient)
        });

    }

    else{
        throw new Error('Originator does not have enough funds to complete this transaction')
    }

 }



 /**
 * Update the location of the shipment
 * @param {org.kibaati.LocationUpdate} locationUpdate - the new location received from the shipment
 * @transaction
 */
function updateLocation(locationUpdate){
    var factory = getFactory();
    var location = locationUpdate.location;
    var shipment = locationUpdate.shipment;
    var destination = shipment.destination

    if (shipment.locationReadings){
        shipment.locationReadings.push(location);
    }
    else{
        shipment.locationReadings = [location];
    }

    if (location == destination){
        shipmentArrivedEvent = factory.NewEvent('org.kibaati', 'ShipmentArrived');
        shipmentArivedEvent.shipment = shipment;
        shipmentArrivedEvent.message = "The shipment has reached it's destination of " + destination;
        emit(shipmentArrivedEvent);

    }

    return getAssetRegistry('org.kibaati.Shipment')
        .then( function(assetRegistry){
            return assetRegistry.update(shipment)
        });
}

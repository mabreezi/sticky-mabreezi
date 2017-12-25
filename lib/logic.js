'use strict';
/**
 * Write your transction processor functions here
 */

/**
 * Track the trade of a commodity from one trader to another
 * @param {org.kibaati.Trade} trade - the trade to be processed
 * @transaction
 */
function onTransfer(trade) {
	trade.item.owner = trade.newOwner
	
	return getAssetRegistry('org.kibati.Item')
		.then(function(assetRegistry){
			return assetRegistry.update(trade.commodity);
		});
}

/**
 * Move funds from one person to another
 * @param {org.kibaati.Payment} payment - the trade to be processed
 * @transaction
 */
 function onPayment(payment){
 	var sender = payment.sender;
 	var recipient = payment.recipient;
 	var tranAmount = payment.amount
 	
 	sender.balance = sender.balance - tranAmount
 	recipient.balance = recipient.balance + tranAmount
 	
 	return getParticipantRegistry('org.kibaati.Person')
 		.then( function(participantRegistry){
 			return participantRegistry.updateAll([sender, recipient])
 		});
 }

/*
    @description       : Lighting web Component for order add Order products component
    @author            : Apurba Singh, Appstrail             
    @last modified on  : 28-04-2023
    @last modified by  : Apurba Singh, Appstrail
    Modifications Log 
    Ver   Date         Author          Modification
    1.0   28-04-2023   Apurba Singh   Initial Version
*/
public with sharing class createOrderListViewButtonController {
    public createOrderListViewButtonController() {

    }
//Id = :UserInfo.getUserId() AND IsActive = true AND IsPortalEnabled = true
    @AuraEnabled(cacheable=true)
    public static User getLoggedInUser() {
        String currentUserId = UserInfo.getUserId();
        System.debug('Current user ID: ' + currentUserId);
        return [SELECT Id, Name, IsActive, IsPortalEnabled, LastName, contact.account.name FROM User WHERE Id= :UserInfo.getUserID() AND IsActive = true AND IsPortalEnabled = true ];
    }

    @AuraEnabled
    public static Order createOrderRequest(String orderName, Date poDate, String accountId,List<docSizewrap> orderItems) {
        System.debug('Order name'+orderName);
        System.debug('poDate'+poDate);
        System.debug('accountId'+accountId);
        System.debug('orderItems'+orderItems);


        String currentUserId = UserInfo.getUserId();
        System.debug('Current user ID: ' + currentUserId);
        // Get the distributor pricebook ID
        Pricebook2 distributorPricebookId = [SELECT Id FROM Pricebook2 WHERE IsStandard = false AND Name = 'Distributor Pricebook' LIMIT 1];
        System.debug('Distribute proce id'+distributorPricebookId.Id);
        User userRecord = [SELECT Id, IsActive, IsPortalEnabled, LastName, contact.accountId FROM User WHERE IsPortalEnabled = true  LIMIT 1];
        System.debug('AccId '+userRecord.contact.accountId);
        Account accountRecord = [SELECT Id, ShippingStreet, ShippingCity, ShippingState, ShippingPostalCode, ShippingCountry, BillingStreet, BillingCity, BillingState, BillingPostalCode, BillingCountry FROM Account WHERE Id =: userRecord.contact.accountId];
        System.debug('Accountrecords'+accountRecord);
        System.debug('Accountrecords'+accountRecord.ShippingCity);
        System.debug('Accountrecords'+accountRecord.BillingCity);
         
        Order orderRecord = new Order(
            Name = orderName,
            PoDate = poDate,
            Status = 'Draft',
            AccountId = userRecord.contact.accountId,
            Pricebook2Id = distributorPricebookId.Id,
            EffectiveDate = poDate,
            ShippingStreet = accountRecord.ShippingStreet,
            ShippingCity = accountRecord.ShippingCity,
            ShippingState = accountRecord.ShippingState,
            ShippingPostalCode = accountRecord.ShippingPostalCode,
            ShippingCountry = accountRecord.ShippingCountry,
            BillingStreet = accountRecord.BillingStreet,
            BillingCity = accountRecord.BillingCity,
            BillingState = accountRecord.BillingState,
            BillingPostalCode = accountRecord.BillingPostalCode,
            BillingCountry = accountRecord.BillingCountry
        );
        insert orderRecord;
        // Create the order product records
        List<OrderItem> orderItemRecords = new List<OrderItem>();
        for (docSizewrap orderItem : orderItems) {
            PricebookEntry pricebookEntry = [SELECT Id, UnitPrice FROM PricebookEntry WHERE Product2Id = :orderItem.productId AND Pricebook2Id = :distributorPricebookId.Id];
            OrderItem orderItemRecord = new OrderItem(
                OrderId = orderRecord.Id,
                PricebookEntryId = pricebookEntry.Id,
                Product2Id = orderItem.productId,
                Quantity = orderItem.quantity,
                UnitPrice = pricebookEntry.UnitPrice
            );
            orderItemRecords.add(orderItemRecord);
        }
        insert orderItemRecords; 

        return orderRecord;
    }
    public class docSizewrap{
        @AuraEnabled public string productId{get;set;} 
        @AuraEnabled public decimal quantity{get;set;}
    }

}
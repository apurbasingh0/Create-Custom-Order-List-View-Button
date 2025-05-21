import { LightningElement, track, api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import createOrderRequest from '@salesforce/apex/createOrderListViewButtonController.createOrderRequest';
import getLoggedInUser from '@salesforce/apex/createOrderListViewButtonController.getLoggedInUser';

export default class createOrderListViewButton extends NavigationMixin(LightningElement) {
    @track orderName;
    @track poDate;
    @track account;
    @api recordId;
    @track products = [];
    @track valueselecteddata;
    @track showcomp = false;
    @track showcomp2 = true;
    @track disabledButton = false;

    @track accountId;
    @track productFiletr = 'Id In (Select Product2Id From PricebookEntry Where IsActive = true AND Pricebook2.Name = \''+'Distributor Pricebook'+'\')';

    connectedCallback() {
        this.retrieveLoggedInUser();
    }

    addRequestOrder(){
        this.showcomp = true;
        this.showcomp2 = false;
    }

    retrieveLoggedInUser() {
        getLoggedInUser()
            .then(result => {
                this.accountId = result.Contact.Account.Name;
                console.log('AccountId'+this.accountId);
            })
            .catch(error => {
                console.error(error);
            });
    }

    // filterType = {
    //     'Pricebook2.Id': ['01s0T000000AvJhQAK']
    // };

    handleOrderNameChange(event) {
       this.orderName = event.target.value;
    }

    handlePoDateChange(event) {
      this.poDate = event.target.value;
    }


    handleQuantityChange(event) {
        console.log('inside:::');
        const fieldName = event.currentTarget.dataset.selectedName;
        console.log('fieldName:::'+fieldName);
        const valueId = event.detail.Id;
        console.log('valueId:::'+valueId);
        const id = event.currentTarget.dataset.id;
        console.log('id:::'+id);
        // iterate over the product list and find the product with the matching id
        this.products.forEach(product => {
            if (product.newproductId == id) {
                switch (fieldName) {
                    case 'quantity_r':
                        product.quantity = event.target.value;
                        console.log('quantity:::'+ product.quantity);
                        break;
                    case 'product_r':
                        product.productId = valueId;
                        console.log('product_r:::'+product.productId);
                        break;    
                }
            }
        });
    }
       
	addProduct() {
       this.products.push({  productId: '', quantity: 0,newproductId:Math.random()});
    }	

    deleteProduct(event) {
        const productId = event.currentTarget.dataset.id;
        console.log('productId::'+productId);
        this.products = this.products.filter(product => {
            if(product.newproductId == productId){
             product='';
            }
             return product;
          });
    }

    handleSave() {
        console.log('productId::'+JSON.stringify(this.products));
        this.disabledButton = true;
        if(this.products && this.products.length > 0) {
            createOrderRequest({ orderName: this.orderName, poDate: this.poDate, account: this.account, orderItems: this.products })
            .then(result => {
                console.log("Result::::"+JSON.stringify(result));
                if(result != null){
                    
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Order request created successfully',
                        variant: 'success',
                    }),
                ); 

                this[NavigationMixin.Navigate]({
                    type: 'standard__recordPage',
                    attributes: {
                    recordId: result.Id,
                    objectApiName: 'Order',
                    actionName: 'view'
                    }
                });
                this.resetTheData();
            }
        })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error',
                        message: error.body.message,
                        variant: 'error',
                    }),
                ); 
            });
        } else {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error',
                    message: 'Please Add the Order Products',
                    variant: 'error',
                }),
            ); 
        }
    }
    

    handleCancel(){
        this.resetTheData();
        this.navigateToOrderListView();
        
       // location.reload();
    }

    showToastMessage(type, message, variant, mode) {
        const evt = new ShowToastEvent({
        title: type,
        message: message,
        variant: variant,
        mode: mode
        });
        this.dispatchEvent(evt);
    }

    navigateToOrderListView() {
       // location.reload();
        this[NavigationMixin.Navigate]({
        type: 'standard__objectPage',
        attributes: {
        objectApiName: 'Order',
        actionName: 'list'
        }
        });
    }

    resetTheData(){
        // reset the form data after successful save
        this.orderName = null;
        this.poDate = null;
        this.products = [];
    }

}
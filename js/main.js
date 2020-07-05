// Open contact detail
$("#btnViewContact").click(e => {

    // Open contact details
    $(".nameHolder").click( e => { 
        if( e.target.parentElement.parentElement.classList.contains("contactRest")){
            e.target.parentElement.parentElement.classList.remove("contactRest");
            e.target.parentElement.parentElement.classList.add("contact");
        }
        else{
            e.target.parentElement.parentElement.classList.add("contactRest");
            e.target.parentElement.parentElement.classList.remove("contact");
        }
    });

    // Close contact details
    $(".contactRest").mouseleave( e => { 
        if( e.target.classList.contains("contact")){
            e.target.classList.add("contactRest");
            e.target.classList.remove("contact");
        }
    });  
    
    // Delete
    $(".delete").click( e =>{
        const ui = new UI();
        ui.deleteContact(e)
    });

    // Edit
    $(".edit").click( e => {
        
        if( e.target.classList.contains("edit")){                                                   
            $("#editName").val(e.target.parentNode.childNodes[7].childNodes[1].textContent);
            $("#editEmail").val(e.target.parentNode.childNodes[9].childNodes[1].childNodes[1].childNodes[3].innerText);
            $("#editPhone").val(e.target.parentNode.childNodes[9].childNodes[1].childNodes[3].childNodes[3].innerText);
            $("#editCountry").val(e.target.parentNode.childNodes[9].childNodes[1].childNodes[7].childNodes[3].innerText);
            $("#editState").val(e.target.parentNode.childNodes[9].childNodes[1].childNodes[11].childNodes[3].innerText);
            $("#editAddress").val(e.target.parentNode.childNodes[9].childNodes[1].childNodes[15].childNodes[3].innerText);                
            contactStorage.deletContact($("#editName").val());
        }
    });


    // Update
    $("#w-change-btn").click( e => {                                                                       
                let editName = $("#editName").val();
                let editEmail = $("#editEmail").val();
                let editPhone = $("#editPhone").val();
                let editCountry = $("#editCountry").val();
                let editState = $("#editState").val();
                let editAddress = $("#editAddress").val();
                contactStorage.deletContact(editName);
                // instantiate UI
                const ui = new UI();
                if((editName !== "") && (editEmail !== "") &&
                (editPhone !== "") && (editCountry !== "") &&
                (editState !== "") && (editAddress !== "")
                ){                    
                    // instantiate Contact
                    const contact = new Contact(editName, editEmail, editPhone, editCountry, editState, editAddress);                     
                    contactStorage.saveContact(contact);
                    ui.addContactList(contact);                    
                    ui.showAlert('Updated!', 'success');                    
                }  
                else{
                    ui.showAlert('Please fill all inputs!', 'error');
                }
                    
        });

});

// Save contact
$("#btnSave").click((fullName, email, phone, country, state, address) =>{
    
    // Getting values from input
    fullName = $("#newName").val();
    email = $("#newEmail").val();
    phone = $("#newPhone").val();
    country = $("#newCountry").val();
    state = $("#newState").val();
    address = $("#newAddress").val();

    // validations
    let nameValidate = Validation.validateName();
    let emailValidate = Validation.validateEmail();
    let phoneValidate = Validation.validatePhone();
    let countryValidate = Validation.validateCountry();
    let stateValidate = Validation.validateState();
    let addressValidate = Validation.validateAddress();

    // instantiate UI
    const ui = new UI();
    if((nameValidate === true) && (emailValidate === true) &&
     (phoneValidate === true) && (countryValidate === true) &&
     (stateValidate === true) && (addressValidate === true)
    ){

        // instantiate Contact
        const contact = new Contact(fullName, email, phone, country, state, address);    
        contactStorage.saveContact(contact);
        ui.addContactList(contact);
        ui.showAlert('Saved!', 'success');
        ui.clearFields();
    }  
    else{
        ui.showAlert('Please fill all inputs!', 'error');
    } 
});

// display contacts to UI
$("#document").ready(e => {

    let contactList = [];
    // Instantiate UI
    const ui = new UI();

    // call contacts from storage
    const contacts = contactStorage.retreiveContact();
    contacts.forEach(contact =>{
        contactList.push(contact);
        ui.addContactList(contact);
    })    
});
// Get new contact class
class Contact{
    constructor(fullName, email, phone, country, state, address){
        this.fullName = fullName;
        this.email = email;
        this.phone = phone;
        this.country = country;
        this.state = state;
        this.address = address;
    }
}

// Local storage classS
class contactStorage{

    // Method to save a new contact
    static saveContact(contact){
        const Contacts = contactStorage.retreiveContact();
        Contacts.push(contact);
        localStorage.setItem('Contacts', JSON.stringify(Contacts));
    }

    // Method to retrieve contact
    static retreiveContact(){
        let Contacts;
        if(localStorage.getItem('Contacts') === null){
            Contacts = [];            
        }
        else{
            Contacts = JSON.parse(localStorage.getItem('Contacts'));
        }
        return Contacts;
    }

    // Method to delete contact
    static deletContact(name){
        let Contacts;
        if(localStorage.getItem('Contacts') === null){
            Contacts = [];            
        }
        else{
            Contacts = JSON.parse(localStorage.getItem('Contacts'));
        }
        Contacts.forEach((contact, index) =>{
            if(contact.fullName === name){
                Contacts.splice(index,1);
            }
        });
        localStorage.setItem('Contacts', JSON.stringify(Contacts));
    }
}

// Validation class
class Validation{
    // validate name entry
    static validateName(){
        let fullName = $("#newName").val();
        const re = /^[a-zA-Z ]{2,20}$/;
        if(!re.test(fullName)){
            $("#newName").addClass('is-invalid');
            return false;
        }
        else{
            $("#newName").removeClass('is-invalid');
            return true;
        }        
    }

    // validate email
    static validateEmail(){
        let email = $("#newEmail").val();
        const re = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
        if(!re.test(email)){
            $("#newEmail").addClass('is-invalid');
            return false;
        }
        else{
            $("#newEmail").removeClass('is-invalid');
            return true;
        }        
    }

    // validate phone number
    static validatePhone(){
        let phone = $("#newPhone").val();
        const re = /^\(?\d{4}\)?[-. ]?\d{3}[-. ]?\d{4}$/;
        if(!re.test(phone)){
            $("#newPhone").addClass('is-invalid');
            return false;
        }
        else{
            $("#newPhone").removeClass('is-invalid');
            return true;
        }      
    }

    // Validate country
    static validateCountry(){
    
        let country = $("#newCountry").val();
        if(country === ""){
            $("#newCountry").addClass('is-invalid');
            return false;
        }
        else{
            $("#newCountry").removeClass('is-invalid');
            return true;
        }
    }

    // Validate state
    static validateState(){
    
            let country = $("#newState").val();
            if(country === ""){
                $("#newState").addClass('is-invalid');
                return false;
            }
            else{
                $("#newState").removeClass('is-invalid');
                return true;
            }
    }
            
    // Validate address
    static validateAddress(){
        
            let country = $("#newAddress").val();
            if(country === ""){
                $("#newAddress").addClass('is-invalid');
                return false;
            }
            else{
                $("#newAddress").removeClass('is-invalid');
                return true;
            }
    }
}

// UI class
class UI{

    // Method to load contacts to ui
    addContactList(contact){

        const contacts = $("#viewContact");
        let contents = `
        <div class="contactRest" id="contactRest">
        <a href="tel:${contact.phone}" style="float:right; margin-right:20px;"><img src="img/phone.png" style="margin-top:10px; width:20px; height:20px;"></a>
        <a href="mailto:${contact.email}" style="float:right; margin-right:20px;"><img src="img/mail.png" style="margin-top:10px; width:20px; height:20px;"></a>
            <div class="nameLabel bg-primary">
                <h3>${contact.fullName.charAt(0)}</h3>
            </div>
            <div class="nameHolder">
                <b id="name">${contact.fullName}</b>
            </div> 
            <div id="personDetails">
                <div id="allDetails" class="show">
                    <span>
                        <label>Email: </label>
                        <label>${contact.email}</label>
                    </span>
                    <span>
                        <label>Phone: </label>
                        <label>${contact.phone}</label>
                    </span>
                    <br>
                    <span>
                        <label>Country: </label>
                        <label>${contact.country}</label>
                    </span>
                    <br>
                    <span>
                        <label>State: </label>
                        <label>${contact.state}</label>
                    </span>
                    <br>
                    <span>
                        <label>Address: </label>
                        <label>${contact.address}</label>
                    </span>
                                        
                </div>
            </div> 
            <a href="#" class="delete">Delete</a>
            <a href="#" class="edit" data-toggle="modal" data-target="#editModal" >Edit</a>
        </div>
        `;
        contacts.append(contents);        
    }


    // Method to clear form fields
    clearFields(){
        $("#newName").val("");
        $("#newEmail").val("");
        $("#newPhone").val("");
        $("#newCountry").val("");
        $("#newState").val("");
        $("#newAddress").val("");
    }

    // Method to delete contact
    deleteContact(e){
        if( e.target.classList.contains("delete")){                       
            if(confirm('Delete ?')){
                e.target.parentElement.remove();
                let name = e.target.parentNode.childNodes[7].childNodes[1].textContent;
                // remove from local storage                
                contactStorage.deletContact(name);
                const ui = new UI();
                ui.showAlert('Deleted!','success');
            }
            else{
                const ui = new UI();
                ui.showAlert('Delete request denied!','error');
            }
        }
    }

    // Alert method
    showAlert(message, className){
        // create a div
        const div = document.createElement('div');

        // add classes
        div.className = `alert ${className}`;        
        // add text
        div.appendChild(document.createTextNode(message));
        // get parent
        const col = document.querySelector('.jumbotron');
        // cget form
        const container = document.querySelector('.tab-content');
        // insert alert
        col.insertBefore(div, container);
        // timeout after 3s
        setTimeout(function(){
            document.querySelector('.alert').remove();
        },2000);

    }
}

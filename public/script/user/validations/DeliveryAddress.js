const form = document.getElementById('form');
var Fname = document.getElementById('Fname');
const email = document.getElementById('email');
const CellNo = document.getElementById('CellNo');
const city = document.getElementById('city');
const address = document.getElementById('address');
const pcode = document.getElementById('pcode');
//to the from from default submition.
form.addEventListener('submit', e => {
    e.preventDefault();

});

// error message
const setError = (element, message) => {

    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector('.error');

    errorDisplay.innerText = message;
    inputControl.classList.add('error');
    inputControl.classList.remove('success');

}
const setSuccess = (element, message) => {

    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector('.error');

    errorDisplay.innerText = message;
    inputControl.classList.remove('error');
    inputControl.classList.add('success');

}

const validateInputs = () => {


    const CellNovalue = CellNo.value.trim();
    const cityvalue = city.value.trim();
    const addressvalue = address.value.trim();
    const pcodevalue = pcode.value.trim();

    //validation for cell no
    let celllenght = CellNovalue.length
    //validation for minimum lenght of Full Cell Number
    if (celllenght < 11 || celllenght > 11) {
        setError(CellNo, '*Cell No Should contain 11 digits');
    }
    else if (CellNovalue[0] != 0) {
        setError(CellNo, '*Cell No should start with 0');
    }
    else {
        setSuccess(CellNo, '');
    }

    //validation for Address
    const regex = /^[#.0-9a-zA-Z\s,-]+$/
    if (regex.test(addressvalue) == true) {
        setSuccess(address, '');
    }
    else {
        setError(address, '*Invalid Address Pattren');
    }
    //validation on postal code
    let codelenght = pcodevalue.length
    //validation for minimum lenght of Full postal code
    if (codelenght != 6) {
        setError(pcode, '*Postal Code Should Contain 6 Digits');
    }
    else {
        setSuccess(pcode, '');
    }
}
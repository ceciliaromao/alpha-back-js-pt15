const body = document.querySelector('body');
const currencySelect = document.querySelector('#currencySelect');
const startDateInput = document.querySelector('#startDateInput');
const endDateInput = document.querySelector('#endDateInput');
const currencyFetchButton = document.querySelector('#currencyFetchButton');
const messageBox = document.querySelector('#messageBox');
const tableBody = document.querySelector('#tableBody');
const loadingModal = document.querySelector('#loadingModal');

//Change cursor and show/hide modal
function isLoading(boolean) {
    if (boolean) {
        body.style.cursor = 'wait';
        loadingModal.style.display = 'flex';
    } else {
        body.style.cursor = 'default';
        loadingModal.style.display = 'none';
    }
}

//Set today exchange
function displayTodayExchange(data) {
    document.querySelector('#cell1').innerHTML = `R$${data[0].bid}`
    return null;
}

//Renders table row
function renderCurrencyFetch(data) {
    //Reset table
    tableBody.innerHTML = '';

    //Define date/time
    const dateTime = new Date(data[0].timestamp*1000)

    //Structure table
    const row = tableBody.insertRow();

    const cell1 = row.insertCell(0);
    const cell2 = row.insertCell(1);
    const cell3 = row.insertCell(2);
    const cell4 = row.insertCell(3);
    const cell5 = row.insertCell(4);

    cell1.innerHTML = ``;
    cell2.innerHTML = `${dateTime.getUTCDate().toString().padStart(2,'0')}/${(dateTime.getUTCMonth()+1).toString().padStart(2,'0')}/${dateTime.getUTCFullYear()} - ${dateTime.getUTCHours().toString().padStart(2,'0')}:${dateTime.getUTCMinutes().toString().padStart(2,'0')}`;
    cell3.innerHTML = `R$${data[0].low}`;
    cell4.innerHTML = `R$${data[0].high}`;
    cell5.innerHTML = `R$${data[0].bid}`;

    //Important for the second fetch
    cell1.setAttribute('id', 'cell1');
    return null;
}

function currencyFetch() {
    const currency = currencySelect.value;
    const startDate = new Date(startDateInput.value);
    const endDate = new Date(endDateInput.value);
    
    if (currency === '' || !startDateInput.value || !endDateInput.value) messageBox.textContent = 'Please insert valid values'
    else {
        //Reset message box
        messageBox.textContent = '';

        //Create API URL
        const startYear = startDate.getUTCFullYear();
        const startMonth = (startDate.getUTCMonth()+1).toString().padStart(2,'0');
        const startDay = (startDate.getUTCDate()).toString().padStart(2,'0');

        const endYear = endDate.getUTCFullYear();
        const endMonth = (endDate.getUTCMonth()+1).toString().padStart(2,'0');
        const endDay = (endDate.getUTCDate()).toString().padStart(2,'0');

        //Days between start & end dates
        const period = parseInt((Date.parse(endDate) - Date.parse(startDate))/86400000);

        //Build URL
        const url = `https://economia.awesomeapi.com.br/json/daily/${currency}-BRL/?start_date=${startYear}${startMonth}${startDay}&end_date=${endYear}${endMonth}${endDay}`;

        //Show loading modal and change cursor to 'wait'
        isLoading(true);

        //Fetch start-end period data
        fetch(url)
        .then(res => res.json())
        .then(data => {
            //Render fetched data
            renderCurrencyFetch(data);

            //Fetch today exchange
            fetch(`https://economia.awesomeapi.com.br/json/daily/${currency}-BRL/1`)
            .then(res => res.json())
            .then(data => {
                //Display today exchange
                displayTodayExchange(data);
                
                //Close loading modal and return cursor to default
                isLoading(false);
            });
        })
        //Show error in console
        .catch(error => {
            console.log(error)
            isLoading(false);
        })
    }
    return null;
}

currencyFetchButton.addEventListener('click',currencyFetch)
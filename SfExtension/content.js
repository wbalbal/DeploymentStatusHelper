let data = [{
    'status':'NOT SYNCHRONISED',
    'path':'path/path/path1path/path/kkkkkl',
    'componentName':'[data-component-id]',
    'lastDateSync':'15/06/22',
    'diff':'blablab lablablab lanlab labla blablabl ablanlablab labla blablab lanlablabl ablabl ablablan lab lablablabl abla blanlablabla blabl ablabl anla'
}]

window.onload = async () => {
    let sfHost = location.host.split('.')[0] + ".my.salesforce.com";
    let message = await new Promise(resolve =>
        chrome.runtime.sendMessage({message: "getSession", sfHost}, resolve));
    let instanceHostname = "";
    let sessionId = "";
    let method = "GET";
    if (message) {
        instanceHostname = message.hostname;
        sessionId = message.key;
    }
    let xhr = new XMLHttpRequest();
    url = "/services/data/v35.0/query/?q=" + encodeURIComponent("select Id, Plz_type__c, Plz_Status__c, Plz_Path__c, Plz_Name__c from Plz_Metadata_Status__c");
    url += (url.includes("?") ? "&" : "?") + "cache=" + Math.random();
    xhr.open(method, "https://" + instanceHostname + url, true);

    xhr.setRequestHeader("Accept", "application/json; charset=UTF-8");
    xhr.setRequestHeader("Authorization", "Bearer " + sessionId);
    xhr.send();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == XMLHttpRequest.DONE) {
            let metadataStatusList = JSON.parse(xhr.responseText)?.records;
            console.log(metadataStatusList);
            setTimeout(() => {
                for( let element of metadataStatusList ){
                    //let componentName = 'c-' + element.componentName;
                    let componentName = element.Plz_Name__c;
                    let componentItem = document.querySelectorAll(componentName);
                    for( let componentItemsItem of componentItem ){
        
                        //Create HTML elements to inject
                        const InsertedDiv=document.createElement("div");
                        const InsertedDivForLastSyncDate =document.createElement("div");
                        const InsertedDivContainer=document.createElement("div");
                        const InsertedButton=document.createElement("div");
                        const divPopup=document.createElement("span");
                        const InsertedPathButton=document.createElement("div");
                        const divPopupForPath =document.createElement("span");
        
        
                        //Set Button Title and Assign CSS Classes
                        InsertedButton.innerText="SEE_DIFF";
                        InsertedPathButton.innerText="CMP_PATH";
                        InsertedButton.classList.add("tooltip");
                        InsertedPathButton.classList.add("tooltip");
                        InsertedDivContainer.classList.add("deployment_helper");
                        componentItemsItem.classList.add("deployment_helper_parent");
                        divPopupForPath.classList.add("tooltiptext");
                        divPopup.classList.add("tooltiptext");
        
                        //Set elements content
                        InsertedDiv.innerText=element.Plz_Status__c;
                        InsertedDivForLastSyncDate.innerText= "";
                        divPopupForPath.innerText=element.Plz_Path__c;
                        divPopup.innerText= "To be implemented next Release !!!!!!!!";
        
                        //Inject HTML to the Dom
                        InsertedDivContainer.appendChild(InsertedDiv);
                        InsertedDiv.appendChild(InsertedButton);
                        InsertedDiv.appendChild(InsertedPathButton);
                        InsertedDiv.appendChild(InsertedDivForLastSyncDate);
                        componentItemsItem.appendChild(InsertedDivContainer);
                        InsertedDiv.parentNode.insertBefore(InsertedButton,InsertedDiv);
                        InsertedDiv.parentNode.insertBefore(InsertedPathButton,InsertedDiv);
                        InsertedButton.appendChild(divPopup);
                        InsertedPathButton.appendChild(divPopupForPath);
        
            }}}, "3000")

        }
    }
    
    

}







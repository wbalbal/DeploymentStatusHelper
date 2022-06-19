let data = [{
    'status':'NOT SYNCHRONISED',
    'path':'path/path/path1path/path/kkkkkl',
    'componentName':'[data-component-id]',
    'lastDateSync':'15/06/22',
    'diff':'blablab lablablab lanlab labla blablabl ablanlablab labla blablab lanlablabl ablabl ablablan lab lablablabl abla blanlablabla blabl ablabl anla'
}]

window.onload = () => {
    setTimeout(() => {
        for( let element of data ){
            //let componentName = 'c-' + element.componentName;
            let componentName = element.componentName;
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
                InsertedDiv.innerText=element.status;
                InsertedDivForLastSyncDate.innerText=element.lastDateSync;
                divPopupForPath.innerText=element.path;
                divPopup.innerText=element.diff;

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







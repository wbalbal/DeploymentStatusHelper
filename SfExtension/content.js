let data = [{
    'status':'SyncKawkaw',
    'path':'path/path/path1',
    'componentName':'[data-component-id]',
    'lastDateSync':'15/06/22',
    'diff':'blablablablablab lanlab labla blablabl ablanlablab labla blablab lanlablabl ablabl ablablan lab lablablabl abla blanlablabla blabl ablabl anla'
}]

window.onload = () => {
    setTimeout(() => {
        for( let element of data ){
            //let componentName = 'c-' + element.componentName;
            let componentName = element.componentName;
            let componentItem = document.querySelectorAll(componentName);
            for( let componentItemsItem of componentItem ){
                const InsertedDiv=document.createElement("div");
                const InsertedDivContainer=document.createElement("div");
                const InsertedButton=document.createElement("div");
                const divPopup=document.createElement("span");
                InsertedButton.innerText="diff";
                InsertedButton.name="diff";
                InsertedButton.setAttribute("cmpName",componentName);
                //InsertedButton:addEventListener("click",getdiff);
                InsertedButton.classList.add("tooltip");
                InsertedDivContainer.classList.add("deployment_helper");
                InsertedDiv.appendChild(InsertedButton);
                InsertedDiv.innerText=element.status;
                InsertedDivContainer.appendChild(InsertedDiv);
                componentItemsItem.appendChild(InsertedDivContainer);
                componentItemsItem.classList.add("deployment_helper_parent");
                InsertedDiv.parentNode.insertBefore(InsertedButton,InsertedDiv);
                divPopup.classList.add("tooltiptext");
                divPopup.innerText=element.diff;
                InsertedButton.appendChild(divPopup);
                //componentItemsItem.parentNode.insertBefore(InsertedDiv,componentItemsItem);
    }}}, "3000")

}
function getdiff(element){
    let cmpName = element.getAttribute("cmpName");
    console.log(cmpName);
}







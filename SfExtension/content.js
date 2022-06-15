let data = [{
    'status':'SyncKawkaw',
    'path':'path/path/path1',
    'componentName':'[data-component-id]',
    'lastDateSync':'15/06/22'
}]

window.onload = () => {
    setTimeout(() => {
        for( let element of data ){
            //let componentName = 'c-' + element.componentName;
            let componentName = element.componentName;
            let componentItem = document.querySelectorAll(componentName);
            for( let componentItemsItem of componentItem ){
                const InsertedDiv=document.createElement("div");
                const InsertedButton=document.createElement("button");
                InsertedButton.innerText="diff";
                InsertedButton.name="diff";
                InsertedButton.setAttribute("cmpName",componentName);
                InsertedButton:addEventListener("click",getdiff);
                InsertedDiv.classList.add("deployment_helper");
                InsertedButton.classList.add("deployment_helper");
                InsertedDiv.innerText=element.status;
                InsertedDiv.innerText=element.path;
                InsertedDiv.innerText=element.lastDateSync;
                componentItemsItem.parentNode.insertBefore(InsertedDiv,componentItemsItem);
                InsertedDiv.parentNode.insertBefore(InsertedButton,InsertedDiv);
    }}}, "3000")
}
function getdiff(element){
    let cmpName = element.getAttribute("cmpName");
    console.log(cmpName);
}





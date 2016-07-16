function myWarning($mdDialog,myText){
              $mdDialog.show(
                  $mdDialog.alert()
                    .parent(angular.element(document.querySelector('#popupContainer')))
                    .clickOutsideToClose(true)
                    .title('Alert')
                    .htmlContent(myText)
                    .ariaLabel('Alert Dialog Demo')
                    .ok('OK')
                    //.targetEvent(ev)
                );
}  

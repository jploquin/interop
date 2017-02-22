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

//calcul de tranche en fction du pct de reussite sur un cas de test ou une categorie
function get_tranche(nb_ok,nb_ko){
var tranche_ok=0;
var pct_ok=0;
if (nb_ok+nb_ko>0){ 
  pct_ok = (100*parseInt(nb_ok))/(parseInt(nb_ok)+parseInt(nb_ko));
  tranche_ok=5;
}
if (pct_ok>80) tranche_ok=1;
                  else if (pct_ok>60) tranche_ok=2;
                  else if (pct_ok>40) tranche_ok=3;
                  else if (pct_ok>20) tranche_ok=4;
                  else if (pct_ok>0) tranche_ok=5;
return tranche_ok;
}

function get_signification_tranche(tranche){
  var retour = "";
  switch (tranche){
    case 1:
      retour="Très bon niveau d'interopérabilité";
      break;
    case 2:
      retour="Bon niveau d'interopérabilité";
      break;
    case 3:
      retour="Niveau moyen d'interopérabilité";
      break;
    case 1:
      retour="Mauvais d'interopérabilité";
      break;
    case 5:
      retour="Très mauvais d'interopérabilité";
      break;

  }
  return retour;
}


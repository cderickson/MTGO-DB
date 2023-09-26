function initGetWinner(){
  fetch('/game_winner_init', {headers: {'X-Requested-By': 'MTGO-Tracker'}}).then(function(response){
    response.json().then(function(data){
      if (data.match_id === "NA"){
        document.getElementById("EndGameActions").style.display = "none";
        document.getElementById("GameWinnerModal2").className = "modal-dialog modal-dialog-centered";
        document.getElementById("GameWinnerModalLabel").innerHTML = 'Get Game_Winner';
        document.getElementById("GameWinnerModalDate").style.display = "none";
        document.getElementById("GameWinnerP1Button").innerHTML = 'Player 1';
        document.getElementById("GameWinnerP2Button").innerHTML = 'Player 2';
        document.getElementById("GameWinnerHR1").style.display = "none";
        document.getElementById("GameWinnerSkipButton").disabled = true;
        document.getElementById("GameWinnerP1Button").disabled = true;
        document.getElementById("GameWinnerP2Button").disabled = true;
        document.getElementById("GameWinnerMessage").innerHTML = "<b><center>No Game records with a missing Game_Winner.</center></b>";
        if (document.getElementById("getMissingMenuButton") !== null) {
          document.getElementById("getMissingMenuButton").setAttribute("disabled", "disabled");
        };
      } else{
        document.getElementById("GameWinnerModal2").className = "modal-dialog modal-dialog-centered modal-lg";
        document.getElementById("GameWinnerModalLabel").innerHTML = 'Get Game_Winner - ' + data.match_id;
        document.getElementById("GameWinnerModalDate").innerHTML = '<center><b>' + data.date + ' vs. ' + data.p2 + '<br>Game ' + data.game_num + '</b></center>';
        document.getElementById("GameWinnerP1Button").innerHTML = data.p1;
        document.getElementById("GameWinnerP2Button").innerHTML = data.p2;
        document.getElementById("EndGameActions").innerHTML = "";
        for (var i = 0; i < data.game_actions.length; i++){
          document.getElementById("EndGameActions").innerHTML += data.game_actions[i] + "<br>"
        };
        document.getElementById("getMissingMenuButton").classList.remove("disabled");
      };
    });
  });      
};

function applyGetWinner(winner){
  match_id = document.getElementById("GameWinnerModalLabel").innerHTML.split(" - ")[1]
  game_num = document.getElementById("GameWinnerModalDate").innerHTML.split("Game ")[1].split("</b>")[0]
  menu_button = document.getElementById("getMissingMenuButton")
  if (winner === "P1"){
    game_winner = document.getElementById("GameWinnerP1Button").innerHTML
  } else if (winner === "P2") {
    game_winner = document.getElementById("GameWinnerP2Button").innerHTML
  } else {
    game_winner = '0'
  }
  fetch('/game_winner/'+match_id+'/'+game_num+'/'+game_winner, {headers: {'X-Requested-By': 'MTGO-Tracker'}}).then(function(response){
    response.json().then(function(data){
      console.log(data)
      if (data.match_id === "NA"){
        document.getElementById("GetWinnerCloseButton").click();
      } else {
        document.getElementById("GameWinnerModalLabel").innerHTML = 'Get Game_Winner - ' + data.match_id;
        document.getElementById("GameWinnerModalDate").innerHTML = '<center><b>' + data.date + ' vs. ' + data.p2 + '<br>Game ' + data.game_num + '</b></center>';
        document.getElementById("GameWinnerP1Button").innerHTML = data.p1;
        document.getElementById("GameWinnerP2Button").innerHTML = data.p2;
        document.getElementById("EndGameActions").innerHTML = "";
        for (var i = 0; i < data.game_actions.length; i++){
          document.getElementById("EndGameActions").innerHTML += data.game_actions[i] + "<br>"
        };
      };
    });
  });
};

function initGetDraftId(){
  fetch('/draft_id_init', {headers: {'X-Requested-By': 'MTGO-Tracker'}}).then(function(response){
    response.json().then(function(data){
      console.log(data)
      if (data.match_id === "NA"){
        document.getElementById("DraftIdModalDate").style.display = "none";
        document.getElementById("DraftIdHR1").style.display = "none";
        document.getElementById("DraftIdButton").style.display = "none";
        document.getElementById("DraftIdSkipButton").disabled = true;
        document.getElementById("DraftIdApplyButton").disabled = true;
        document.getElementById("DraftIdMessage").innerHTML = "<b><center>No Limited Matches missing an Associated Draft_ID.<br><br>Note: Matches need to have Format set to 'Limited' before they can be associated with a Draft.</center></b>";
        if (document.getElementById("applyDraftIdMenuButton") !== null) {
          document.getElementById("applyDraftIdMenuButton").setAttribute("disabled", "disabled");
        }
      } else{
        document.getElementById("DraftIdModalLabel").innerHTML = 'Apply Associated Draft_IDs';
        document.getElementById("DraftIdModalDate").innerHTML = '<center><b>' + data.match_id + '</b><br><b>Date: </b>' + data.date + '</center>';
        document.getElementById("DraftIdLands").innerHTML = "";
        document.getElementById("DraftIdSpells").innerHTML = "";
        document.getElementById("DraftIdSpells2").innerHTML = "";
        for (var i = 0; i < data.lands.length; i++){
          document.getElementById("DraftIdLands").innerHTML += data.lands[i];
          if (i < data.lands.length-1){
            document.getElementById("DraftIdLands").innerHTML += "<br>"
          };
        };
        const midpoint = Math.floor(data.spells.length / 2)
        for (var i = 0; i < data.spells.length; i++){
          if (i < midpoint) {
            document.getElementById("DraftIdSpells").innerHTML += data.spells[i];
          } else {
            document.getElementById("DraftIdSpells2").innerHTML += data.spells[i];
          };
          if (i == data.spells.length-1) {
            // do nothing
          } else if (i == midpoint-1) {
            // do nothing
          } else if (i < midpoint) {
            document.getElementById("DraftIdSpells").innerHTML += "<br>"
          } else if (i < data.spells.length) {
            document.getElementById("DraftIdSpells2").innerHTML += "<br>"
          } else {
            // do nothing
          };
        };
        document.getElementById("DraftIdButton").innerHTML = data.possible_draft_ids[0];
        document.getElementById("DraftIdMenu").innerHTML = ""
        for (var i = 0; i < data.possible_draft_ids.length; i++){
          document.getElementById("DraftIdMenu").innerHTML += '<li><a class="dropdown-item" onclick="showAssociatedDraftId(this)">'+data.possible_draft_ids[i]+' </a></li>';
        };
        document.getElementById("applyDraftIdMenuButton").classList.remove("disabled");
      };
    });
  });      
};

function applyGetDraftId(skip){
  match_id = document.getElementById("DraftIdModalDate").innerHTML.split("</b><br>")[0].split("<b>")[1]
  if (skip){
    draft_id = "0";
  } else{
    draft_id = document.getElementById("DraftIdButton").innerHTML
  }
  console.log(match_id+","+draft_id)
  fetch('/associated_draft_id/'+match_id+'/'+draft_id, {headers: {'X-Requested-By': 'MTGO-Tracker'}}).then(function(response){
    response.json().then(function(data){
      console.log(data)
      if (data.match_id === "NA"){
        if (document.getElementById("applyDraftIdMenuButton") !== null) {
          document.getElementById("applyDraftIdMenuButton").setAttribute("disabled", "disabled");
        }
        document.getElementById("DraftIdCloseButton").click();
      } else{
        document.getElementById("DraftIdModalLabel").innerHTML = 'Apply Associated Draft_IDs';
        document.getElementById("DraftIdModalDate").innerHTML = '<center><b>' + data.match_id + '</b><br><b>Date: </b>' + data.date + '</center>';
        document.getElementById("DraftIdLands").innerHTML = "";
        document.getElementById("DraftIdSpells").innerHTML = "";
        document.getElementById("DraftIdSpells2").innerHTML = "";
        for (var i = 0; i < data.lands.length; i++){
          document.getElementById("DraftIdLands").innerHTML += data.lands[i];
          if (i < data.lands.length-1){
            document.getElementById("DraftIdLands").innerHTML += "<br>"
          };
        };
        const midpoint = Math.floor(data.spells.length / 2)
        for (var i = 0; i < data.spells.length; i++){
          if (i < midpoint) {
            document.getElementById("DraftIdSpells").innerHTML += data.spells[i];
          } else {
            document.getElementById("DraftIdSpells2").innerHTML += data.spells[i];
          };
          if (i == data.spells.length-1) {
            // do nothing
          } else if (i == midpoint-1) {
            // do nothing
          } else if (i < midpoint) {
            document.getElementById("DraftIdSpells").innerHTML += "<br>"
          } else if (i < data.spells.length) {
            document.getElementById("DraftIdSpells2").innerHTML += "<br>"
          } else {
            // do nothing
          };
        };
        document.getElementById("DraftIdButton").innerHTML = data.possible_draft_ids[0];
        document.getElementById("DraftIdMenu").innerHTML = ""
        for (var i = 0; i < data.possible_draft_ids.length; i++){
          document.getElementById("DraftIdMenu").innerHTML += '<li><a class="dropdown-item" onclick="showAssociatedDraftId(this)">'+data.possible_draft_ids[i]+' </a></li>';
        };
      };
    });
  });
};

initGetWinner();
initGetDraftId();

function showAssociatedDraftId(item) {document.getElementById("DraftIdButton").innerHTML = item.innerHTML;}
function showBestGuess(item) {
  document.getElementById("BestGuessButton").innerHTML = item.innerHTML;
  document.getElementById("BG_Match_Set").value = document.getElementById("BestGuessButton").innerHTML.trim();
};
function showImportType(item) {
  document.getElementById("ImportTypeButton").innerHTML = item.innerHTML;
  document.getElementById("dataToImport").value = document.getElementById("ImportTypeButton").innerHTML.trim();
};
function bestGuessHidden(label) {document.getElementById("BG_Replace").value = label;}
function bestGuess(overwrite){
  bg_type = document.getElementById("BestGuessButton").innerHTML.trim()
  console.log(bg_type)
  if (overwrite){
    url = "/best_guess/overwrite/"
  } else{
    url = "/best_guess/unknown/"
  };
  if (bg_type === "All Matches"){
    url += "all"
  } else if (bg_type === "Constructed Only"){
    url += "con"
  } else if (bg_type === "Limited Only"){
    console.log(bg_type)
    url += "lim"
  };
  console.log(url)
  fetch(url).then(function(response){
    response.json().then(function(data){
      if (data.message_type === "success"){
        console.log(data.message)
      } else{
        console.log("bad")
      };
    });
  });      
};
function importHidden(label) {document.getElementById("dataToImport").value = label;}

function loadFromAppSubmission(event) {
  event.preventDefault();  // Prevent form submission
  
  // Show the processing modal
  $('#processing-modal').modal('show');
  
  // Disable the close functionality of the modal
  $('#processing-modal').on('hide.bs.modal', function (event) {
    event.preventDefault();
    event.stopPropagation();
    $(this).modal('show');
  });
  
  // Create a FormData object to store the file
  var formData = new FormData(this);
  
  // Make an AJAX request to handle the file upload
  $.ajax({
    url: '/load_from_app',
    type: 'POST',
    data: formData,
    processData: false,
    contentType: false,
    success: function(response) {
      // Handle the upload success here
      console.log('Upload success:', response);

      // Check if a redirect is needed
      if (response.redirect) {
        window.location.href = response.redirect;
      }
    },
    error: function(jqXHR, textStatus, errorThrown) {
      // Handle the upload error here
      console.log('Upload error:', textStatus, errorThrown);
    },
    complete: function() {
      // Hide the processing modal
      $('#processing-modal').modal('hide');
      
      // Enable the close functionality of the modal
      $('#processing-modal .close').prop('disabled', false);
      $('.modal-backdrop').on('click', function() {
        return false;
      });
    }
  });
};

$(document).ready(function() {
  $('#loadFromAppModal').submit(loadFromAppSubmission);
});

function loadGameLogsSubmission(event) {
  event.preventDefault();  // Prevent form submission
  
  // Show the processing modal
  $('#processing-modal').modal('show');
  
  // Disable the close functionality of the modal
  $('#processing-modal').on('hide.bs.modal', function (event) {
    event.preventDefault();
    event.stopPropagation();
    $(this).modal('show');
  });
  
  // Create a FormData object to store the file
  var formData = new FormData(this);
  
  // Make an AJAX request to handle the file upload
  $.ajax({
    url: '/load',
    type: 'POST',
    data: formData,
    processData: false,
    contentType: false,
    success: function(response) {
      // Handle the upload success here
      console.log('Upload success:', response);

      // Check if a redirect is needed
      if (response.redirect) {
        window.location.href = response.redirect;
      }
    },
    error: function(jqXHR, textStatus, errorThrown) {
      // Handle the upload error here
      console.log('Upload error:', textStatus, errorThrown);
    },
    complete: function() {
      // Hide the processing modal
      $('#processing-modal').modal('hide');
      
      // Enable the close functionality of the modal
      $('#processing-modal .close').prop('disabled', false);
      $('.modal-backdrop').on('click', function() {
        return false;
      });
    }
  });
};

$(document).ready(function() {
  $('#loadGameLogsModal').submit(loadGameLogsSubmission);
});

function getBestGuessSubmission(event) {
  event.preventDefault();  // Prevent form submission
  
  // Show the processing modal
  $('#processing-modal').modal('show');
  
  // Disable the close functionality of the modal
  $('#processing-modal').on('hide.bs.modal', function (event) {
    event.preventDefault();
    event.stopPropagation();
    $(this).modal('show');
  });
  
  // Create a FormData object to store the file
  var formData = new FormData(this);
  
  // Make an AJAX request to handle the file upload
  $.ajax({
    url: '/best_guess',
    type: 'POST',
    data: formData,
    processData: false,
    contentType: false,
    success: function(response) {
      // Handle the upload success here
      console.log('Upload success:', response);

      // Check if a redirect is needed
      if (response.redirect) {
        window.location.href = response.redirect;
      }
    },
    error: function(jqXHR, textStatus, errorThrown) {
      // Handle the upload error here
      console.log('Upload error:', textStatus, errorThrown);
    },
    complete: function() {
      // Hide the processing modal
      $('#processing-modal').modal('hide');
      
      // Enable the close functionality of the modal
      $('#processing-modal .close').prop('disabled', false);
      $('.modal-backdrop').on('click', function() {
        return false;
      });
    }
  });
};

$(document).ready(function() {
  $('#getBestGuessModal').submit(getBestGuessSubmission);
});

// $(document).ready(function() {
//   initGetWinner();
//   initGetDraftId();
// });

function updateDashFormMenu(item) {
  document.getElementById("loadDashFormMenu").action = "/load_dashboards/" + item;
  //window.dynamicUrl = "/dashboards/" + item;
  window.dynamicUrl = item
  console.log("in base.js update dash form menu:" + window.dynamicUrl)
}

function getDashFilterOptions() {
  return new Promise((resolve, reject) => {
    fetch('/filter_options', {headers: {'X-Requested-By': 'MTGO-Tracker'}})
      .then(response => response.json())
      .then(data => {
        document.getElementById("dashDate1").value = data["Date1"];
        document.getElementById("dashDate2").value = data["Date2"];
        for (var i = 0; i < data["Card"].length; i++){
          document.getElementById("CardFilterMenu").innerHTML += '<li><a class="dropdown-item" onclick="showCardFilter(this)">'+data["Card"][i]+' </a></li>';
        };
        for (var i = 0; i < data["Opponent"].length; i++){
          document.getElementById("OpponentFilterMenu").innerHTML += '<li><a class="dropdown-item" onclick="showOpponentFilter(this)">'+data["Opponent"][i]+' </a></li>';
        };
        for (var i = 0; i < data["Format"].length; i++){
          document.getElementById("FormatFilterMenu").innerHTML += '<li><a class="dropdown-item" onclick="showFormatFilter(this)">'+data["Format"][i]+' </a></li>';
        };
        for (var i = 0; i < data["Limited Format"].length; i++){
          document.getElementById("LimitedFormatFilterMenu").innerHTML += '<li><a class="dropdown-item" onclick="showLimitedFormatFilter(this)">'+data["Limited Format"][i]+' </a></li>';
        };
        for (var i = 0; i < data["Deck"].length; i++){
          document.getElementById("DeckFilterMenu").innerHTML += '<li><a class="dropdown-item" onclick="showDeckFilter(this)">'+data["Deck"][i]+' </a></li>';
        };
        for (var i = 0; i < data["Opp. Deck"].length; i++){
          document.getElementById("OppDeckFilterMenu").innerHTML += '<li><a class="dropdown-item" onclick="showOppDeckFilter(this)">'+data["Opp. Deck"][i]+' </a></li>';
        };
        for (var i = 0; i < data["Action"].length; i++){
          document.getElementById("ActionFilterMenu").innerHTML += '<li><a class="dropdown-item" onclick="showActionFilter(this)">'+data["Action"][i]+' </a></li>';
        };
        resolve();
      })
      .catch(error => {
        reject(error);
      });
    });
};

function setDashFilterButtons() {
  return new Promise((resolve, reject) => {
    try {
      //var dashName = window.dynamicUrl.split("/")[2]
      //console.log(dashName)
      if (dynamicUrl == 'match-history'){
        document.getElementById("CardFilter").setAttribute("disabled", "disabled");
        document.getElementById("OpponentFilter").removeAttribute("disabled");
        document.getElementById("FormatFilter").removeAttribute("disabled");
        document.getElementById("LimitedFormatFilter").setAttribute("disabled", "disabled");
        document.getElementById("DeckFilter").removeAttribute("disabled");
        document.getElementById("OppDeckFilter").removeAttribute("disabled");
        document.getElementById("Date1Filter").removeAttribute("disabled");
        document.getElementById("Date2Filter").removeAttribute("disabled");
        document.getElementById("ActionFilter").setAttribute("disabled", "disabled");
      } else if (dynamicUrl == 'match-stats'){
        document.getElementById("CardFilter").setAttribute("disabled", "disabled");
        document.getElementById("OpponentFilter").removeAttribute("disabled");
        document.getElementById("FormatFilter").removeAttribute("disabled");
        document.getElementById("LimitedFormatFilter").setAttribute("disabled", "disabled");
        document.getElementById("DeckFilter").removeAttribute("disabled");
        document.getElementById("OppDeckFilter").removeAttribute("disabled");
        document.getElementById("Date1Filter").removeAttribute("disabled");
        document.getElementById("Date2Filter").removeAttribute("disabled");
        document.getElementById("ActionFilter").setAttribute("disabled", "disabled");
      } else if (dynamicUrl == 'game-stats'){
        document.getElementById("CardFilter").setAttribute("disabled", "disabled");
        document.getElementById("OpponentFilter").removeAttribute("disabled");
        document.getElementById("FormatFilter").removeAttribute("disabled");
        document.getElementById("LimitedFormatFilter").setAttribute("disabled", "disabled");
        document.getElementById("DeckFilter").removeAttribute("disabled");
        document.getElementById("OppDeckFilter").removeAttribute("disabled");
        document.getElementById("Date1Filter").removeAttribute("disabled");
        document.getElementById("Date2Filter").removeAttribute("disabled");
        document.getElementById("ActionFilter").setAttribute("disabled", "disabled");
      } else if (dynamicUrl == 'play-stats'){
        document.getElementById("CardFilter").setAttribute("disabled", "disabled");
        document.getElementById("OpponentFilter").removeAttribute("disabled");
        document.getElementById("FormatFilter").removeAttribute("disabled");
        document.getElementById("LimitedFormatFilter").setAttribute("disabled", "disabled");
        document.getElementById("DeckFilter").removeAttribute("disabled");
        document.getElementById("OppDeckFilter").removeAttribute("disabled");
        document.getElementById("Date1Filter").removeAttribute("disabled");
        document.getElementById("Date2Filter").removeAttribute("disabled");
        document.getElementById("ActionFilter").setAttribute("disabled", "disabled");
      } else if (dynamicUrl == 'card-data'){
        document.getElementById("CardFilter").removeAttribute("disabled");
        document.getElementById("OpponentFilter").removeAttribute("disabled");
        document.getElementById("FormatFilter").removeAttribute("disabled");
        document.getElementById("LimitedFormatFilter").setAttribute("disabled", "disabled");
        document.getElementById("DeckFilter").removeAttribute("disabled");
        document.getElementById("OppDeckFilter").removeAttribute("disabled");
        document.getElementById("Date1Filter").removeAttribute("disabled");
        document.getElementById("Date2Filter").removeAttribute("disabled");
        document.getElementById("ActionFilter").removeAttribute("disabled");
      }
      resolve();
    } catch (error) {
      reject(error);
    };
  });
};

function reloadStylesheets() {
  return new Promise((resolve) => {
    var queryString = '?reload=' + new Date().getTime();
    $('link[rel="stylesheet"]').each(function () {
      this.href = this.href.replace(/\?.*|$/, queryString);
    });
    resolve();
  });
};

function reloadJs() {
  return new Promise((resolve) => {
    var queryString = '?reload=' + new Date().getTime();
    $('script').each(function () {
      this.src = this.src.replace(/\?.*|$/, queryString);
    });
    resolve();
  });
};

$(document).ready(function() {
  async function handleFormSubmission(event) {
    event.preventDefault();  // Prevent form submission
    
    $('#processing-modal').modal('show');
    
    $('#processing-modal').on('hide.bs.modal', function (event) {
      event.preventDefault();
      event.stopPropagation();
      $(this).modal('show');
    });

    var formData = new FormData(this);

    try {
      const response = await $.ajax({
        url: "/load_dashboards/" + dynamicUrl,
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
      });

      const tempElement = $('<div>').html(response);
      const extractedContent = tempElement.find('#loadBlock').html();

      $("#loadBlock").css({ overflow: "auto" });
      $('#loadBlock').html(extractedContent);

      history.pushState({}, '', window.location.origin + "/dashboards/" + dynamicUrl);

      await reloadJs();
      //await reloadStylesheets();

      await setDashFilterButtons();
      await getDashFilterOptions();
      
    } catch (error) {
      console.log('Upload error:', error);
    } finally {
      handleAjaxUpdate();
      $('#processing-modal').modal('hide');
      $('.modal-backdrop').remove();
      $('#processing-modal .close').prop('disabled', false);
    };
  };

  function handleAjaxUpdate() {
    $('#loadDashFormMenu').submit(handleFormSubmission);
    $('#loadDashForm').submit(handleFormSubmission);
    $('#loadFromAppModal').submit(loadFromAppSubmission);
    $('#loadGameLogsModal').submit(loadGameLogsSubmission);
    initGetWinner();
    initGetDraftId();
  };

  function programmaticSubmit() {
    $('#loadDashFormMenu').trigger("submit")
  };

  console.log("in base.js doc ready processing function")

  if (window.directLink) {
    $('#loadDashFormMenu').submit(handleFormSubmission);
    updateDashFormMenu(dynamicUrl);
    programmaticSubmit();
  } else {
    console.log("in base.js: adding jquery event listener")
    $('#loadDashForm').submit(handleFormSubmission);
    $('#loadDashFormMenu').submit(handleFormSubmission);
  };
});
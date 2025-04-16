//THIS CODE EXISTS ONLY IN THE APP SCRIPT EXSION AND HAS NO MEANING TO THIS CODE, IT IS ONLY HERE FOR DOCUMENTATION

function doGet() {
    const sheetNames = ['Tasks', 'Deadlines', 'Competitions', 'Priorities'];
    const output = {};
  
    sheetNames.forEach(name => {
      const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name);
      const data = sheet.getDataRange().getValues();
      const headers = data[0];
      const rows = data.slice(1).map(row => {
        let obj = {};
        row.forEach((cell, i) => {
          obj[headers[i]] = cell;
        });
        return obj;
      });
      output[name] = rows;
    });
  
    return ContentService
      .createTextOutput(JSON.stringify(output))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  function doPost(e) {
    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    };
  
    try {
      const params = JSON.parse(e.postData.contents);
      const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(params.sheet);
      const sheetHeaders = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  
      const row = sheetHeaders.map(h => params[h] || "");
      sheet.appendRow(row);
  
      return ContentService.createTextOutput(JSON.stringify({ success: true }))
        .setMimeType(ContentService.MimeType.JSON);
    } catch (err) {
      return ContentService.createTextOutput(JSON.stringify({ success: false, error: err.message }))
        .setMimeType(ContentService.MimeType.JSON);
    }
  }
  
  function doOptions(e) {
    return ContentService.createTextOutput('')
      .setMimeType(ContentService.MimeType.TEXT)
      .setHeader("Access-Control-Allow-Origin", "*")
      .setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
      .setHeader("Access-Control-Allow-Headers", "Content-Type");
  }
  
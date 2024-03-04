function sendEmailWithTable(sheetName, emailAddress, promptsSheetName) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(sheetName);
  var promptsSheet = ss.getSheetByName(promptsSheetName);  // The new prompts sheet

    // Debugging: Log the sheet name and whether the sheet was found
  Logger.log("Sheet name: " + sheetName);
  if (sheet == null) {
    Logger.log("Sheet not found: " + sheetName);
    return; // Exit the function if the sheet is not found
  }
  var dataRange = sheet.getDataRange();
  var data = dataRange.getValues();

  var uniqueData = processAndFilterData(data);
  var count = countJobsLast2Hours(sheet);

  var htmlContent = generateHTMLContent(count, uniqueData, sheetName, promptsSheetName);

  var subject = '';
  GmailApp.sendEmail(emailAddress, subject, '', {htmlBody: htmlContent});
}

function processAndFilterData(data) {
  var filteredData = data.map(function(row) {
    return [row[0], row[3], row[7], row[2]]; // Adjust indices to match your columns
  });

  var uniqueKeys = new Set();
  var uniqueData = [];
  for (var i = 0; i < filteredData.length; i++) {
    var key = filteredData[i].join("|");
    if (!uniqueKeys.has(key)) {
      uniqueKeys.add(key);
      uniqueData.push(filteredData[i]);
    }
  }

  uniqueData.sort(function(a, b) {
    return parseDate(b[2]) - parseDate(a[2]);
  });

  var maxJobs = 500;
  if (uniqueData.length > maxJobs) {
    uniqueData = uniqueData.slice(0, maxJobs);
  }

  return uniqueData;
}

function countJobsLast2Hours(sheet) {
  var dateColumn = sheet.getRange('H2:H' + sheet.getLastRow()).getValues();
  var currentTime = new Date();
  var twoHoursAgo = new Date(currentTime.getTime() - (7 * 60 * 60 * 1000));
  var count = 0;

  for (var i = 0; i < dateColumn.length; i++) {
    var jobDate = parseDate(dateColumn[i][0]);
    if (jobDate && jobDate > twoHoursAgo && jobDate <= currentTime) {
      count++;
    }
  }

  return count;
}

function generateHTMLContent(count, uniqueData, sheetName, promptsSheetName) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var promptsSheet = ss.getSheetByName(promptsSheetName);
    // Fetch the row number from cell D1
  var selectedRow = promptsSheet.getRange("D1").getValue();
  if (selectedRow < 1 || selectedRow > 6) {
    Logger.log("Invalid row number in D1. Defaulting to 1.");
    selectedRow = 1;  // Default to 1 if out of expected range
  }
  var selectedValue = promptsSheet.getRange("A" + selectedRow).getValue();
  var promptsRange = promptsSheet.getRange("A1:A6"); // Adjust the range as necessary
  var promptsValues = promptsRange.getValues();

  var prefix = sheetName.startsWith("") ? "S" : "E";

  // Flatten the array and filter out empty strings
  var buttonLabels = promptsValues.flat().filter(String);

  let buttonsHtml = buttonLabels.map((label, index) =>
    `<a href="}" class="button">${label}</a>`).join('');

  let htmlContent = `
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; }
        h1 { color: #333; }
        h2 a {
          text-decoration: none;
          color: #0078D4;
        } /* Styles for hyperlink in h2 */
        .button {
          display: inline-block;
          margin: 10px 10px; /* Adjusted margin for spacing */
          padding: 10px 10px;
          background-color: #0078D4;
          color: white;
          text-decoration: none;
          border-radius: 5px;
          font-size: 14px;
          text-align: center;
        }
        .button-container {
          text-align: center;
          padding: 10px 0; /* 10x padding around the buttons section */
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px; /* Added space between the table and buttons */
        }
        th, td {
          padding: 8px;
          text-align: left;
          border-bottom: 1px solid #ddd;
        }
        th {
          background-color: #f2f2f2;
        }
        tr:nth-child(even) {
          background-color: #f9f9f9;
        }
        tr:hover {
          background-color: #f1f1f1;
        }
      </style>
    </head>
    <body>
      <h1>New jobs posted in the last 2 hours: ${count}</h1>
      <h2><a href="" target="_blank">Gemini AI Draft Proposal Generator</a></h2>
      <h3>Proposal Structure selected: ${selectedValue}</h3>
      <div class="button-container">
        ${buttonsHtml}
      </div>
      <table>
        <tr><th>Title</th><th>Price</th><th>Date Posted</th><th>URL</th></tr>`;

  //const prefix = getParameterPrefix(sheetName);
  var limitedData = uniqueData.slice(0, 200);

  limitedData.forEach(function(row, index) {
    var upwork_url = row[3];
    const fullUrl = ``;
    const fullUrl_hyperlink = encodeURIComponent(row[3]);

    htmlContent += `<tr><td>
                        <a href="${fullUrl}" target="_blank">${row[0]}</a>
                        </td><td>${row[1]}</td>
                        <td>${row[2]}</td><td>
                        <a href="${upwork_url}" target="_blank">URL Link</a>
                    </td></tr>`;
  });

  htmlContent += `</table></body></html>`;
  return htmlContent;
}

function parseDate(dateStr) {
  try {
    var parts = dateStr.match(/(\d{2}):(\d{2})(AM|PM) (\d{2})\/(\d{2})\/(\d{4})/);
    if (!parts) return null;
    var hours = parseInt(parts[1], 10);
    var minutes = parseInt(parts[2], 10);
    var ampm = parts[3];
    var day = parseInt(parts[4], 10);
    var month = parseInt(parts[5], 10) - 1;
    var year = parseInt(parts[6], 10);
    if (ampm === 'PM' && hours < 12) hours += 12;
    if (ampm === 'AM' && hours === 12) hours = 0;
    return new Date(year, month, day, hours, minutes);
  } catch (e) {
    return null;
  }
}

// Example usage
function sendReports() {
  sendEmailWithTable("", "", "");
  sendEmailWithTable("", "", "");
}

function getParameterPrefix(sheetName) {
  if (sheetName === "") {
    return 's';
  } else if (sheetName === "") {
    return 'e';
  } else {
    return ''; // default case or handle error
  }
}

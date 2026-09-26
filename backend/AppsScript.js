// ==========================================================================
// CONFIGURATION
// ==========================================================================

// ID Spreadsheet utama
var SPREADSHEET_ID = "1RAXGeY1kGDS9RWPj-ktILv_LUA-ZKqr1duhCK61iaTk";

// Nomor tujuan default reminder WhatsApp
var TARGET_PHONE = "083168211468";

// PENTING:
// Jangan simpan token asli di GitHub/public repository.
// Isi token baru setelah melakukan regenerate di Fonnte.
var FONNTE_TOKEN = "MASUKKAN_TOKEN_FONNTE_BARU_DI_SINI";

// Ganti saat web sudah deploy ke Vercel / hosting lain
var FRONTEND_URL = "http://localhost:5173";


// ==========================================================================
// CATEGORY MAP
// ==========================================================================

var CATEGORY_MAP = {
  "KEPEMIMPINAN DAN KOMITMEN MANAJEMEN":
    "1. KEPEMIMPINAN DAN KOMITMEN MANAJEMEN",

  "SOSIALISASI, KOORDINASI DAN KERJASAMA DENGAN STAKEHOLDER PENGAMANAN":
    "2. SOSIALISASI, KOORDINASI DAN KERJASAMA DENGAN STAKEHOLDER PENGAMANAN",

  "PEMBINAAN TEKNIS, AUDIT DAN TINJAUAN MANAJEMEN SISTEM PENGAMANAN":
    "3. PEMBINAAN TEKNIS, AUDIT DAN TINJAUAN MANAJEMEN SISTEM PENGAMANAN",

  "IDENTIFIKASI TINGKAT KERAWANAN KEAMANAN, ANALISA RESIKO DAN KONTIJENSI KEAMANAN":
    "4. IDENTIFIKASI TINGKAT KERAWANAN KEAMANAN, ANALISA RESIKO DAN KONTIJENSI KEAMANAN",

  "KOMPETENSI DAN PELATIHAN":
    "5. KOMPETENSI DAN PELATIHAN",

  "PELAPORAN":
    "6. PELAPORAN",

  "PROGRAM PENDUKUNG":
    "7. PROGRAM PENDUKUNG"
};


// ==========================================================================
// RESPONSE HELPER
// ==========================================================================

function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}


// ==========================================================================
// MENCARI SHEET BERDASARKAN TAHUN
// ==========================================================================

function getSheet(year) {
  year = year ? String(year).trim() : "2026";

  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);

  if (!ss) {
    throw new Error(
      "Gagal membuka Spreadsheet. Periksa SPREADSHEET_ID."
    );
  }

  // Sheet khusus tahun 2026
  if (year === "2026") {
    var mainSheet = ss.getSheetByName("Proker KAM 2026 TW 2");

    if (mainSheet) {
      return mainSheet;
    }
  }

  // Cari sheet lain berdasarkan tahun
  var sheets = ss.getSheets();

  for (var i = 0; i < sheets.length; i++) {
    var name = sheets[i].getName();

    if (name.indexOf(year) !== -1) {
      return sheets[i];
    }
  }

  // PENTING:
  // Membaca data TIDAK BOLEH otomatis membuat tahun baru.
  throw new Error(
    "Sheet untuk tahun " + year + " tidak ditemukan."
  );
}


// ==========================================================================
// RESET ACTUAL UNTUK TAHUN BARU
// ==========================================================================

function clearActualsForNewYear(sheet) {
  var data = sheet.getDataRange().getValues();

  for (var i = 16; i < data.length; i++) {
    var row = data[i];

    var status = row[12];

    if (status === "Actual") {
      var rowNum = i + 1;

      var range = sheet.getRange(
        rowNum,
        14,
        1,
        53
      );

      range.clearContent();
      range.setBackground("#ffffff");
    }
  }
}


// ==========================================================================
// WARNA PLAN & ACTUAL
// ==========================================================================

function formatWeekCellColors(
  sheet,
  rowNum,
  weeksObj,
  isActual
) {
  var rowColors = [];

  for (var w = 1; w <= 53; w++) {
    var val = weeksObj[w];

    if (
      val !== undefined &&
      val !== "" &&
      Number(val) > 0
    ) {
      rowColors.push(
        isActual
          ? "#c6efce"
          : "#fff2cc"
      );
    } else {
      rowColors.push("#ffffff");
    }
  }

  sheet
    .getRange(rowNum, 14, 1, 53)
    .setBackgrounds([rowColors]);
}


// ==========================================================================
// UPDATE HEADER TAHUN & TANGGAL
// ==========================================================================

function updateSheetHeadersForYear(sheet, year) {
  var yearNum = parseInt(year, 10);

  if (isNaN(yearNum)) {
    return;
  }

  var current = new Date(
    yearNum,
    0,
    1
  );

  var firstDay = current.getDay();

  var daysToFirstSunday =
    firstDay === 0
      ? 0
      : (7 - firstDay);

  var week1EndDate = new Date(
    yearNum,
    0,
    1 + daysToFirstSunday
  );

  var cellN14 = sheet.getRange(
    14,
    14
  );

  cellN14.setValue(week1EndDate);
  cellN14.setNumberFormat("dd/mm");

  var monthStartCols = {
    "Januari": 14,
    "Februari": 19,
    "Maret": 23,
    "April": 27,
    "Mei": 31,
    "Juni": 36,
    "Juli": 40,
    "Agustus": 44,
    "September": 49,
    "Oktober": 53,
    "November": 57,
    "Desember": 61
  };

  for (var monthName in monthStartCols) {
    var colNum = monthStartCols[monthName];

    sheet
      .getRange(13, colNum)
      .setValue(
        monthName + " " + year
      );
  }

  var lastRow = sheet.getLastRow();

  if (lastRow >= 17) {
    sheet
      .getRange(
        17,
        14,
        lastRow - 16,
        53
      )
      .setHorizontalAlignment("center")
      .setVerticalAlignment("middle");
  }
}


// ==========================================================================
// HELPER
// ==========================================================================

function padZero(num) {
  return num < 10
    ? "0" + num
    : String(num);
}


function getMonthNameIndonesian(mIdx) {
  var months = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember"
  ];

  return months[mIdx];
}


function extractLinkFromBulk(
  richTextValues,
  formulas,
  data,
  rIdx,
  cIdx
) {
  try {
    var richText =
      richTextValues[rIdx][cIdx];

    if (richText) {
      var url =
        richText.getLinkUrl();

      if (url) {
        return url;
      }
    }

    var formula =
      formulas[rIdx][cIdx];

    if (formula) {
      var match =
        formula.match(
          /=HYPERLINK\("([^"]+)"/i
        ) ||
        formula.match(
          /=HYPERLINK\('([^']+)'/i
        );

      if (
        match &&
        match[1]
      ) {
        return match[1];
      }
    }

  } catch (e) {
    console.log(
      "Tidak dapat membaca hyperlink: " +
      e.toString()
    );
  }

  return data[rIdx][cIdx]
    ? data[rIdx][cIdx]
        .toString()
        .trim()
    : "";
}


// ==========================================================================
// MENDAPATKAN BULAN BERDASARKAN WEEK
// ==========================================================================

function getMonthsFromWeeks(weeks) {
  var monthsMap = {
    "Jan": [1, 2, 3, 4, 5],
    "Feb": [6, 7, 8, 9],
    "Mar": [10, 11, 12, 13],
    "Apr": [14, 15, 16, 17],
    "Mei": [18, 19, 20, 21, 22],
    "Jun": [23, 24, 25, 26],
    "Jul": [27, 28, 29, 30],
    "Agu": [31, 32, 33, 34, 35],
    "Sep": [36, 37, 38, 39],
    "Okt": [40, 41, 42, 43],
    "Nov": [44, 45, 46, 47],
    "Des": [48, 49, 50, 51, 52, 53]
  };

  var selectedMonths = [];

  for (var month in monthsMap) {
    var monthWeeks =
      monthsMap[month];

    for (var w in weeks) {
      if (
        monthWeeks.indexOf(
          Number(w)
        ) !== -1
      ) {
        if (
          selectedMonths.indexOf(
            month
          ) === -1
        ) {
          selectedMonths.push(
            month
          );
        }
      }
    }
  }

  return selectedMonths;
}


// ==========================================================================
// FORMAT MATLEV KAM
// ==========================================================================

function formatMatlevKamValue(val) {
  if (!val) {
    return "";
  }

  if (val instanceof Date) {
    var month =
      val.getMonth() + 1;

    var date =
      val.getDate();

    return month + "." + date;
  }

  return val
    .toString()
    .trim();
}


// ==========================================================================
// FORMAT WEEK CELLS
// ==========================================================================

function formatSheetWeekCells(
  sheet,
  rowNum
) {
  sheet
    .getRange(
      rowNum,
      14,
      1,
      53
    )
    .setHorizontalAlignment("center")
    .setVerticalAlignment("middle");
}


// ==========================================================================
// GET REQUEST
// ==========================================================================

function doGet(e) {
  try {
    var action =
      e.parameter.action;

    var year =
      e.parameter.year ||
      "2026";

    if (action === "read") {
      return readData(year);
    }

    return jsonResponse({
      status: "error",
      message:
        "Permintaan GET tidak valid"
    });

  } catch (err) {
    return jsonResponse({
      status: "error",
      message:
        err.toString()
    });
  }
}


// ==========================================================================
// POST REQUEST
// ==========================================================================

function doPost(e) {
  try {
    if (
      !e ||
      !e.postData ||
      !e.postData.contents
    ) {
      return jsonResponse({
        status: "error",
        message:
          "Payload kosong"
      });
    }

    var payload =
      JSON.parse(
        e.postData.contents
      );

    var action =
      payload.action;

    var year =
      payload.year ||
      "2026";


    if (action === "login") {
      return handleLogin(
        payload
      );
    }


    if (action === "send_wa") {
      return sendWhatsAppMessage(
        payload.phone,
        payload.message
      );
    }


    if (action === "add") {
      return addData(
        payload,
        year
      );
    }


    if (action === "edit") {
      return editData(
        payload,
        year
      );
    }


    if (action === "delete") {
      return deleteData(
        payload,
        year
      );
    }


    if (action === "create_year") {
      return createYearSheet(
        payload.year,
        payload.sourceYear ||
        "2026"
      );
    }


    if (action === "delete_year") {
      return deleteYearSheet(
        payload.year
      );
    }


    return jsonResponse({
      status: "error",
      message:
        "Permintaan POST tidak valid"
    });

  } catch (err) {
    console.error(err);

    return jsonResponse({
      status: "error",
      message:
        err.toString()
    });
  }
}


// ==========================================================================
// MEMBUAT TAHUN BARU
// ==========================================================================

function createYearSheet(
  year,
  sourceYear
) {
  year =
    String(
      year || ""
    ).trim();

  sourceYear =
    String(
      sourceYear || "2026"
    ).trim();


  if (
    !/^\d{4}$/.test(year)
  ) {
    return jsonResponse({
      status: "error",
      message:
        "Format tahun harus 4 digit, contoh: 2027."
    });
  }


  var yearNum =
    Number(year);


  if (
    yearNum < 2000 ||
    yearNum > 2100
  ) {
    return jsonResponse({
      status: "error",
      message:
        "Tahun harus berada pada rentang 2000 sampai 2100."
    });
  }


  var ss =
    SpreadsheetApp.openById(
      SPREADSHEET_ID
    );

  var sheets =
    ss.getSheets();


  // Pastikan tahun belum ada
  for (
    var i = 0;
    i < sheets.length;
    i++
  ) {
    if (
      sheets[i]
        .getName()
        .indexOf(year) !== -1
    ) {
      return jsonResponse({
        status: "error",
        message:
          "Tab untuk tahun " +
          year +
          " sudah tersedia."
      });
    }
  }


  var sourceSheet = null;


  if (
    sourceYear === "2026"
  ) {
    sourceSheet =
      ss.getSheetByName(
        "Proker KAM 2026 TW 2"
      );
  }


  if (!sourceSheet) {
    for (
      var j = 0;
      j < sheets.length;
      j++
    ) {
      if (
        sheets[j]
          .getName()
          .indexOf(
            sourceYear
          ) !== -1
      ) {
        sourceSheet =
          sheets[j];

        break;
      }
    }
  }


  if (!sourceSheet) {
    return jsonResponse({
      status: "error",
      message:
        "Sheet sumber tahun " +
        sourceYear +
        " tidak ditemukan."
    });
  }


  try {
    var newSheet =
      sourceSheet
        .copyTo(ss)
        .setName(
          "Proker KAM " +
          year
        );


    clearActualsForNewYear(
      newSheet
    );


    updateSheetHeadersForYear(
      newSheet,
      year
    );


    SpreadsheetApp.flush();


    return jsonResponse({
      status: "success",

      message:
        "Rencana tahun " +
        year +
        " berhasil dibuat dari tahun " +
        sourceYear +
        ".",

      year: year
    });

  } catch (err) {
    return jsonResponse({
      status: "error",

      message:
        "Gagal membuat tahun " +
        year +
        ": " +
        err.toString()
    });
  }
}


// ==========================================================================
// HAPUS TAHUN
// ==========================================================================

function deleteYearSheet(year) {
  year =
    String(
      year || ""
    ).trim();


  if (
    year === "2026"
  ) {
    return jsonResponse({
      status: "error",
      message:
        "Tab tahun default 2026 tidak boleh dihapus!"
    });
  }


  var ss =
    SpreadsheetApp.openById(
      SPREADSHEET_ID
    );

  var sheets =
    ss.getSheets();


  for (
    var i = 0;
    i < sheets.length;
    i++
  ) {
    var name =
      sheets[i].getName();

    if (
      name.indexOf(year) !== -1
    ) {
      ss.deleteSheet(
        sheets[i]
      );

      return jsonResponse({
        status: "success",
        message:
          "Tab sheet tahun " +
          year +
          " berhasil dihapus!"
      });
    }
  }


  return jsonResponse({
    status: "error",
    message:
      "Tab sheet tahun tidak ditemukan"
  });
}


// ==========================================================================
// LOGIN
// ==========================================================================

function handleLogin(payload) {
  var email =
    payload.email
      ? payload.email
          .trim()
          .toLowerCase()
      : "";

  var password =
    payload.password
      ? payload.password
          .trim()
      : "";


  var USERS_DATABASE = [
    {
      email:
        "admin@pln.co.id",
      password:
        "admin",
      role:
        "admin"
    },

    {
      email:
        "tamu@pln.co.id",
      password:
        "tamu",
      role:
        "guest"
    }
  ];


  for (
    var i = 0;
    i < USERS_DATABASE.length;
    i++
  ) {
    if (
      USERS_DATABASE[i].email ===
        email &&
      USERS_DATABASE[i].password ===
        password
    ) {
      return jsonResponse({
        status:
          "success",

        role:
          USERS_DATABASE[i].role,

        message:
          "Login berhasil!"
      });
    }
  }


  return jsonResponse({
    status: "error",
    message:
      "Email atau password salah!"
  });
}


// ==========================================================================
// WHATSAPP FONNTE
// ==========================================================================

function sendWhatsAppMessage(
  phone,
  message
) {
  if (!phone) {
    return jsonResponse({
      status: "error",
      message:
        "Nomor WhatsApp kosong."
    });
  }


  if (
    !FONNTE_TOKEN ||
    FONNTE_TOKEN ===
      "MASUKKAN_TOKEN_FONNTE_BARU_DI_SINI"
  ) {
    return jsonResponse({
      status: "error",
      message:
        "Token Fonnte belum dikonfigurasi."
    });
  }


  var url =
    "https://api.fonnte.com/send";


  var options = {
    method:
      "post",

    headers: {
      Authorization:
        FONNTE_TOKEN
    },

    payload: {
      target:
        phone,

      message:
        message
    },

    muteHttpExceptions:
      true
  };


  try {
    var response =
      UrlFetchApp.fetch(
        url,
        options
      );


    var resText =
      response
        .getContentText();


    console.log(
      "Nomor Tujuan: " +
      phone
    );


    console.log(
      "Respon Fonnte: " +
      resText
    );


    return jsonResponse({
      status:
        "success",

      response:
        resText
    });

  } catch (err) {
    console.error(
      "Gagal mengirim WhatsApp: " +
      err.toString()
    );


    return jsonResponse({
      status:
        "error",

      message:
        err.toString()
    });
  }
}


// ==========================================================================
// READ DATA
// ==========================================================================

function readData(year) {
  try {
    var sheet =
      getSheet(year);


    var data =
      sheet
        .getDataRange()
        .getValues();


    if (
      data.length <= 16
    ) {
      return jsonResponse({
        status:
          "success",

        data:
          []
      });
    }


    var richTextValues =
      sheet
        .getRange(
          1,
          1,
          data.length,
          data[0].length
        )
        .getRichTextValues();


    var formulas =
      sheet
        .getRange(
          1,
          1,
          data.length,
          data[0].length
        )
        .getFormulas();


    var jsonArray = [];

    var currentCategory = "";

    var currentCategoryNum = "";


    for (
      var i = 16;
      i < data.length;
      i++
    ) {
      var rowPlan =
        data[i];


      // Kosong
      if (
        !rowPlan[5]
      ) {
        continue;
      }


      // Header kategori
      if (
        !rowPlan[3] &&
        !rowPlan[6]
      ) {
        var rawCategory =
          rowPlan[5]
            .toString()
            .trim();


        var cleanKey =
          rawCategory
            .replace(
              /^\d+\.\s*/,
              ""
            )
            .toUpperCase()
            .trim();


        currentCategory =
          CATEGORY_MAP[
            cleanKey
          ] ||
          rawCategory;


        currentCategoryNum =
          currentCategory;


        continue;
      }


      var rowActual =
        data[i + 1] || [];


      var targetPlan =
        Number(
          rowPlan[8] || 0
        );


      var actualTotal =
        Number(
          rowActual[8] || 0
        );


      var weeks = {};

      var actualWeeks = {};


      for (
        var w = 1;
        w <= 53;
        w++
      ) {
        var colIdx =
          13 + (w - 1);


        var planVal =
          rowPlan[colIdx];


        if (
          planVal !== "" &&
          !isNaN(planVal) &&
          Number(planVal) > 0
        ) {
          weeks[w] =
            Number(planVal);
        }


        var actualVal =
          rowActual[colIdx];


        if (
          actualVal !== "" &&
          !isNaN(actualVal) &&
          Number(actualVal) > 0
        ) {
          actualWeeks[w] =
            Number(actualVal);
        }
      }


      var status =
        "Belum Mulai";


      if (
        actualTotal >=
          targetPlan &&
        targetPlan > 0
      ) {
        status =
          "Selesai";

      } else if (
        actualTotal > 0
      ) {
        status =
          "Dalam Proses";
      }


      var folderUrl =
        extractLinkFromBulk(
          richTextValues,
          formulas,
          data,
          i,
          10
        );


      var linkUrl =
        extractLinkFromBulk(
          richTextValues,
          formulas,
          data,
          i,
          11
        );


      var obj = {
        id:
          rowPlan[70]
            ? Number(
                rowPlan[70]
              )
            : (i + 1),

        iso45001:
          rowPlan[1] || "",

        pp50:
          rowPlan[2] || "",

        matlevKam:
          formatMatlevKamValue(
            rowPlan[3]
          ),

        no:
          formatMatlevKamValue(
            rowPlan[3]
          ),

        subNo:
          String(
            rowPlan[4] || ""
          ),

        title:
          rowPlan[5] || "",

        category:
          currentCategory,

        categoryNum:
          currentCategoryNum,

        pic:
          rowPlan[6] || "",

        biaya:
          rowPlan[7] || "-",

        target:
          targetPlan,

        actual:
          actualTotal,

        status:
          status,

        prosedur:
          rowPlan[9] || "-",

        folder:
          folderUrl || "-",

        link:
          linkUrl || "",

        months:
          getMonthsFromWeeks(
            weeks
          ),

        weeks:
          weeks,

        actualWeeks:
          actualWeeks
      };


      jsonArray.push(
        obj
      );


      // Lewati row Actual
      i++;
    }


    return jsonResponse({
      status:
        "success",

      data:
        jsonArray
    });


  } catch (err) {
    console.error(
      "readData Error: " +
      err.toString()
    );


    return jsonResponse({
      status:
        "error",

      message:
        err.toString(),

      data:
        []
    });
  }
}


// ==========================================================================
// ADD DATA
// ==========================================================================

function addData(
  payload,
  year
) {
  var sheet =
    getSheet(year);


  var nextRow =
    sheet.getLastRow() + 1;


  var formulaTarget =
    "=SUM(N" +
    nextRow +
    ":BP" +
    nextRow +
    ")";


  var formulaProgress =
    "=SUM(N" +
    (nextRow + 1) +
    ":BP" +
    (nextRow + 1) +
    ")";


  var rowPlan = [
    "",
    payload.iso45001 || "",
    payload.pp50 || "",

    // FIX MATLEV KAM
    payload.no ||
      payload.matlevKam ||
      "",

    payload.subNo || "",
    payload.title || "",
    payload.pic || "",
    payload.biaya || "-",
    formulaTarget,
    payload.prosedur || "-",
    payload.folder || "-",
    payload.link || "",
    "Plan"
  ];


  var rowActual = [
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    formulaProgress,
    "",
    "",
    "",
    "Actual"
  ];


  for (
    var w = 1;
    w <= 53;
    w++
  ) {
    rowPlan.push(
      payload.weeks &&
      payload.weeks[w]
        ? Number(
            payload.weeks[w]
          )
        : ""
    );


    rowActual.push(
      payload.actualWeeks &&
      payload.actualWeeks[w]
        ? Number(
            payload.actualWeeks[w]
          )
        : ""
    );
  }


  while (
    rowPlan.length < 70
  ) {
    rowPlan.push("");
  }


  rowPlan.push(
    payload.id
  );


  while (
    rowActual.length < 70
  ) {
    rowActual.push("");
  }


  rowActual.push(
    payload.id
  );


  sheet.appendRow(
    rowPlan
  );


  sheet.appendRow(
    rowActual
  );


  sheet
    .getRange(
      nextRow,
      14,
      2,
      53
    )
    .setHorizontalAlignment(
      "center"
    )
    .setVerticalAlignment(
      "middle"
    );


  formatWeekCellColors(
    sheet,
    nextRow,
    payload.weeks || {},
    false
  );


  formatWeekCellColors(
    sheet,
    nextRow + 1,
    payload.actualWeeks || {},
    true
  );


  SpreadsheetApp.flush();


  return jsonResponse({
    status:
      "success",

    message:
      "Kegiatan berhasil ditambahkan",

    id:
      payload.id
  });
}


// ==========================================================================
// EDIT DATA BERDASARKAN ID
// ==========================================================================

function editData(
  payload,
  year
) {
  var sheet =
    getSheet(year);


  var data =
    sheet
      .getDataRange()
      .getValues();


  var targetId =
    Number(
      payload.id
    );


  if (!targetId) {
    return jsonResponse({
      status:
        "error",

      message:
        "ID kegiatan tidak valid"
    });
  }


  for (
    var i = 16;
    i < data.length;
    i++
  ) {
    var rowPlan =
      data[i];


    var rowId =
      Number(
        rowPlan[70]
      );


    if (
      rowId === targetId
    ) {
      var rowNum =
        i + 1;


      var formulaPlanI =
        sheet
          .getRange(
            rowNum,
            9
          )
          .getFormula();


      var formulaActualI =
        sheet
          .getRange(
            rowNum + 1,
            9
          )
          .getFormula();


      var defaultFormulaPlan =
        "=SUM(N" +
        rowNum +
        ":BP" +
        rowNum +
        ")";


      var defaultFormulaActual =
        "=SUM(N" +
        (rowNum + 1) +
        ":BP" +
        (rowNum + 1) +
        ")";


      var newRowPlan = [
        "",
        payload.iso45001 || "",
        payload.pp50 || "",

        payload.no ||
          payload.matlevKam ||
          "",

        payload.subNo || "",
        payload.title || "",
        payload.pic || "",
        payload.biaya || "-",

        formulaPlanI ||
          defaultFormulaPlan,

        payload.prosedur || "-",
        payload.folder || "-",
        payload.link || "",
        "Plan"
      ];


      for (
        var w = 1;
        w <= 53;
        w++
      ) {
        newRowPlan.push(
          payload.weeks &&
          payload.weeks[w]
            ? Number(
                payload.weeks[w]
              )
            : ""
        );
      }


      while (
        newRowPlan.length < 70
      ) {
        newRowPlan.push("");
      }


      newRowPlan.push(
        payload.id
      );


      var newRowActual = [
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",

        formulaActualI ||
          defaultFormulaActual,

        "",
        "",
        "",
        "Actual"
      ];


      for (
        var aw = 1;
        aw <= 53;
        aw++
      ) {
        newRowActual.push(
          payload.actualWeeks &&
          payload.actualWeeks[aw]
            ? Number(
                payload.actualWeeks[aw]
              )
            : ""
        );
      }


      while (
        newRowActual.length < 70
      ) {
        newRowActual.push("");
      }


      newRowActual.push(
        payload.id
      );


      sheet
        .getRange(
          rowNum,
          1,
          1,
          71
        )
        .setValues([
          newRowPlan
        ]);


      sheet
        .getRange(
          rowNum + 1,
          1,
          1,
          71
        )
        .setValues([
          newRowActual
        ]);


      sheet
        .getRange(
          rowNum,
          14,
          2,
          53
        )
        .setHorizontalAlignment(
          "center"
        )
        .setVerticalAlignment(
          "middle"
        );


      formatWeekCellColors(
        sheet,
        rowNum,
        payload.weeks || {},
        false
      );


      formatWeekCellColors(
        sheet,
        rowNum + 1,
        payload.actualWeeks || {},
        true
      );


      SpreadsheetApp.flush();


      return jsonResponse({
        status:
          "success",

        message:
          "Kegiatan berhasil diperbarui"
      });
    }
  }


  return jsonResponse({
    status:
      "error",

    message:
      "ID kegiatan tidak ditemukan"
  });
}


// ==========================================================================
// DELETE DATA BERDASARKAN ID
// ==========================================================================

function deleteData(
  payload,
  year
) {
  var sheet =
    getSheet(year);


  var data =
    sheet
      .getDataRange()
      .getValues();


  var targetId =
    Number(
      payload.id
    );


  if (!targetId) {
    return jsonResponse({
      status:
        "error",

      message:
        "ID kegiatan tidak valid"
    });
  }


  for (
    var i = 16;
    i < data.length;
    i++
  ) {
    var rowId =
      Number(
        data[i][70]
      );


    if (
      rowId === targetId
    ) {
      // Hapus baris Plan + Actual
      sheet.deleteRows(
        i + 1,
        2
      );


      SpreadsheetApp.flush();


      return jsonResponse({
        status:
          "success",

        message:
          "Kegiatan berhasil dihapus"
      });
    }
  }


  return jsonResponse({
    status:
      "error",

    message:
      "Kegiatan tidak ditemukan untuk dihapus"
  });
}


// ==========================================================================
// REMINDER MINGGUAN
// ==========================================================================

function sendWeeklyK3LAutoReminders() {
  var yearActive =
    new Date()
      .getFullYear()
      .toString();


  var sheet =
    getSheet(
      yearActive
    );


  var data =
    sheet
      .getDataRange()
      .getValues();


  var currentWeek =
    getCurrentWeekNumber();


  var plansList = [];


  for (
    var i = 16;
    i < data.length;
    i++
  ) {
    var rowPlan =
      data[i];


    if (
      !rowPlan[5]
    ) {
      continue;
    }


    if (
      !rowPlan[3] &&
      !rowPlan[6]
    ) {
      continue;
    }


    var rowActual =
      data[i + 1] ||
      [];


    var colIdx =
      13 +
      (currentWeek - 1);


    var planValueThisWeek =
      Number(
        rowPlan[colIdx] || 0
      );


    var actualValueThisWeek =
      Number(
        rowActual[colIdx] || 0
      );


    var isPlannedThisWeek =
      planValueThisWeek > 0;


    // Reminder hanya bila target minggu berjalan belum terpenuhi
    if (
      isPlannedThisWeek &&
      actualValueThisWeek <
        planValueThisWeek
    ) {
      plansList.push(
        "- *" +
        rowPlan[5] +
        "* (MATLEV KAM: " +
        formatMatlevKamValue(
          rowPlan[3]
        ) +
        " " +
        (rowPlan[4] || "") +
        ")" +
        " - Target: " +
        planValueThisWeek +
        ", Aktual: " +
        actualValueThisWeek
      );
    }


    i++;
  }


  if (
    plansList.length > 0
  ) {
    var message =
      "Halo Rekan K3L,\n\n" +

      "*PENGINGAT PROGRAM K3L MINGGU INI (M-" +
      currentWeek +
      ")*\n\n" +

      "Berikut kegiatan yang masih memiliki target pada minggu ini:\n\n" +

      plansList.join("\n") +

      "\n\nJika kegiatan telah dilaksanakan, silakan memperbarui realisasi melalui sistem:\n" +

      FRONTEND_URL +

      "\n\nTerima kasih,\nSistem Monitoring K3L PLN";


    sendWhatsAppMessage(
      TARGET_PHONE,
      message
    );
  }
}


// ==========================================================================
// REMINDER BULANAN
// ==========================================================================

function sendMonthlyK3LAutoReminders() {
  var now =
    new Date();


  var yearActive =
    now
      .getFullYear()
      .toString();


  var sheet =
    getSheet(
      yearActive
    );


  var data =
    sheet
      .getDataRange()
      .getValues();


  var monthsShort = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "Mei",
    "Jun",
    "Jul",
    "Agu",
    "Sep",
    "Okt",
    "Nov",
    "Des"
  ];


  var currentMonthShort =
    monthsShort[
      now.getMonth()
    ];


  var currentMonthLong =
    getMonthNameIndonesian(
      now.getMonth()
    );


  var monthMap = {
    "Jan": [1, 2, 3, 4, 5],
    "Feb": [6, 7, 8, 9],
    "Mar": [10, 11, 12, 13],
    "Apr": [14, 15, 16, 17],
    "Mei": [18, 19, 20, 21, 22],
    "Jun": [23, 24, 25, 26],
    "Jul": [27, 28, 29, 30],
    "Agu": [31, 32, 33, 34, 35],
    "Sep": [36, 37, 38, 39],
    "Okt": [40, 41, 42, 43],
    "Nov": [44, 45, 46, 47],
    "Des": [48, 49, 50, 51, 52, 53]
  };


  var monthWeeks =
    monthMap[
      currentMonthShort
    ] || [];


  var monthlyPlans = [];


  for (
    var i = 16;
    i < data.length;
    i++
  ) {
    var rowPlan =
      data[i];


    if (
      !rowPlan[5]
    ) {
      continue;
    }


    if (
      !rowPlan[3] &&
      !rowPlan[6]
    ) {
      continue;
    }


    var planWeeksThisMonth =
      [];


    for (
      var k = 0;
      k < monthWeeks.length;
      k++
    ) {
      var weekNum =
        monthWeeks[k];


      var colIdx =
        13 +
        (weekNum - 1);


      var planVal =
        Number(
          rowPlan[colIdx] || 0
        );


      if (
        planVal > 0
      ) {
        planWeeksThisMonth.push(
          "M-" + weekNum
        );
      }
    }


    if (
      planWeeksThisMonth.length > 0
    ) {
      monthlyPlans.push(
        "- *" +
        rowPlan[5] +
        "* (" +
        planWeeksThisMonth.join(
          ", "
        ) +
        ")"
      );
    }


    i++;
  }


  var message =
    "Halo Rekan K3L,\n\n" +

    "*DAFTAR RENCANA PROGRAM K3L BULAN " +
    currentMonthLong.toUpperCase() +
    " " +
    yearActive +
    "*\n\n" +

    (
      monthlyPlans.length > 0
        ? monthlyPlans.join("\n")
        : "Tidak ada rencana kegiatan untuk bulan ini."
    ) +

    "\n\nTautan Sistem:\n" +
    FRONTEND_URL +

    "\n\nTerima kasih,\nSistem Monitoring K3L PLN";


  sendWhatsAppMessage(
    TARGET_PHONE,
    message
  );
}


// ==========================================================================
// REMINDER JUMAT
// ==========================================================================

function sendFridayK3LAutoReminders() {
  var message =
    "Halo Rekan K3L,\n\n" +

    "*PENGINGAT HARI JUMAT SORE*\n\n" +

    "Apakah pada minggu ini Anda telah melaksanakan Program Kerja K3L (Proker KAM)?\n\n" +

    "Jika sudah, silakan memperbarui realisasi melalui Formulir Pemantauan:\n" +

    FRONTEND_URL +

    "\n\nTerima kasih,\nSistem Monitoring K3L PLN";


  sendWhatsAppMessage(
    TARGET_PHONE,
    message
  );
}


// ==========================================================================
// WEEK NUMBER
// ==========================================================================

function getCurrentWeekNumber() {
  var now =
    new Date();


  var start =
    new Date(
      now.getFullYear(),
      0,
      1
    );


  var diff =
    now - start;


  var oneDay =
    1000 *
    60 *
    60 *
    24;


  var dayOfYear =
    Math.floor(
      diff / oneDay
    );


  var week =
    Math.ceil(
      (
        dayOfYear +
        start.getDay() +
        1
      ) / 7
    );


  if (week < 1) {
    return 1;
  }


  if (week > 53) {
    return 53;
  }


  return week;
}